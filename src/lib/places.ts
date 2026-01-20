import type { Place, PlaceLinks, PlaceRecord } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const normalizeLinks = (links: PlaceRecord["links"]): PlaceLinks => {
  if (!links || typeof links !== "object") {
    return { googleMapsUrl: "" };
  }

  return {
    googleMapsUrl: links.googleMapsUrl ?? "",
    appleMapsUrl: links.appleMapsUrl ?? undefined,
    instagramUrl: links.instagramUrl ?? undefined,
    websiteUrl: links.websiteUrl ?? undefined,
    phone: links.phone ?? undefined
  };
};

const normalizeNumber = (value: PlaceRecord["lat"]): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const mapPlaceRecord = (record: PlaceRecord): Place => ({
  id: record.id,
  title: record.title,
  categories: record.categories ?? [],
  area: record.area ?? "",
  lat: normalizeNumber(record.lat),
  lng: normalizeNumber(record.lng),
  description_short: record.description_short ?? "",
  story: record.story ?? "",
  signature_move: record.signature_move ?? "",
  best_time: record.best_time ?? "",
  vibes: record.vibes ?? [],
  price: record.price ?? "",
  links: normalizeLinks(record.links),
  images: record.images ?? [],
  warnings: record.warnings ?? []
});

export const getApprovedPlaces = async (): Promise<Place[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("status", "approved")
      .order("approved_at", { ascending: false });

    if (error) {
      console.error("getApprovedPlaces error", error.message);
      return [];
    }

    return (data as PlaceRecord[]).map(mapPlaceRecord);
  } catch (error) {
    console.error("getApprovedPlaces error", error);
    return [];
  }
};

export const getApprovedPlacesByCategory = async (
  slug: string
): Promise<Place[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("status", "approved")
      .contains("categories", [slug])
      .order("approved_at", { ascending: false });

    if (error) {
      console.error("getApprovedPlacesByCategory error", error.message);
      return [];
    }

    return (data as PlaceRecord[]).map(mapPlaceRecord);
  } catch (error) {
    console.error("getApprovedPlacesByCategory error", error);
    return [];
  }
};

export const getApprovedPlaceById = async (
  id: string
): Promise<Place | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("getApprovedPlaceById error", error.message);
      }
      return null;
    }

    return mapPlaceRecord(data as PlaceRecord);
  } catch (error) {
    console.error("getApprovedPlaceById error", error);
    return null;
  }
};
