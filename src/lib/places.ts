import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Place, PlaceLinks, PlaceRecord, Price } from "@/lib/types";

const normalizePrice = (price: Price | null | undefined): Price => {
  if (price === "$" || price === "$$" || price === "$$$" || price === "") {
    return price;
  }
  return "";
};

const normalizeLinks = (links: PlaceLinks | null | undefined): PlaceLinks => ({
  googleMapsUrl: links?.googleMapsUrl ?? "",
  appleMapsUrl: links?.appleMapsUrl ?? undefined,
  instagramUrl: links?.instagramUrl ?? undefined,
  websiteUrl: links?.websiteUrl ?? undefined,
  phone: links?.phone ?? undefined
});

const normalizeNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string");
};

const mapPlace = (row: PlaceRecord): Place => {
  return {
    id: row.id,
    name: row.title,
    categories: row.categories ?? [],
    area: row.area ?? "",
    lat: normalizeNumber(row.lat),
    lng: normalizeNumber(row.lng),
    oneLiner: row.description_short ?? "",
    story: row.story ?? "",
    signatureMove: row.signature_move ?? "",
    bestTime: row.best_time ?? "",
    warnings: row.warnings ?? undefined,
    vibes: row.vibes ?? [],
    price: normalizePrice(row.price),
    links: normalizeLinks(row.links ?? undefined),
    images: normalizeImages(row.images)
  };
};

export const getApprovedPlaces = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("status", "approved")
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapPlace(row as PlaceRecord));
};

export const getApprovedPlacesByCategory = async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("status", "approved")
    .contains("categories", [slug])
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapPlace(row as PlaceRecord));
};

export const getApprovedPlaceById = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapPlace(data as PlaceRecord) : null;
};
