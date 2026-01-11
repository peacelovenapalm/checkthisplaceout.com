"use server";

import { redirect } from "next/navigation";
import { getActionProfile } from "@/lib/actions/guards";
import type { SupabaseServerClient } from "@/lib/supabase/server";
import type { PlaceStatus, Price } from "@/lib/types";

export type PlaceActionState = {
  error?: string;
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const ensureUniqueSlug = async (
  supabase: SupabaseServerClient,
  baseSlug: string,
  currentId?: string | null
) => {
  const { data } = await supabase
    .from("places")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (!data || (currentId && data.id === currentId)) {
    return baseSlug;
  }

  const suffix = Math.random().toString(36).slice(2, 6);
  return `${baseSlug}-${suffix}`;
};

const parseText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const parseOptional = (value: FormDataEntryValue | null) => {
  const text = parseText(value);
  return text ? text : null;
};

const parseNumber = (value: FormDataEntryValue | null) => {
  const text = parseText(value);
  if (!text) return null;
  const parsed = Number.parseFloat(text);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseDelimitedList = (value: FormDataEntryValue | null) => {
  const text = parseText(value);
  if (!text) return [];
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseWarnings = (value: FormDataEntryValue | null) => {
  const text = parseText(value);
  if (!text) return [];
  return text
    .split(/[,\\n]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseMulti = (values: FormDataEntryValue[]) => {
  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
};

const normalizePrice = (value: string): Price => {
  if (value === "$" || value === "$$" || value === "$$$" || value === "") {
    return value;
  }
  return "";
};

const buildPayload = (formData: FormData) => {
  const title = parseText(formData.get("title"));
  const descriptionShort = parseOptional(formData.get("description_short"));
  const story = parseOptional(formData.get("story"));
  const signatureMove = parseOptional(formData.get("signature_move"));
  const bestTime = parseOptional(formData.get("best_time"));
  const warnings = parseWarnings(formData.get("warnings"));
  const area = parseOptional(formData.get("area"));
  const categories = parseMulti(formData.getAll("categories"));
  const vibes = parseDelimitedList(formData.get("vibes"));
  const price = normalizePrice(parseText(formData.get("price")));
  const lat = parseNumber(formData.get("lat"));
  const lng = parseNumber(formData.get("lng"));
  const images = parseDelimitedList(formData.get("images"));

  const googleMapsUrl = parseText(formData.get("googleMapsUrl"));
  const appleMapsUrl = parseOptional(formData.get("appleMapsUrl"));
  const instagramUrl = parseOptional(formData.get("instagramUrl"));
  const websiteUrl = parseOptional(formData.get("websiteUrl"));
  const phone = parseOptional(formData.get("phone"));

  return {
    title,
    description_short: descriptionShort,
    story,
    signature_move: signatureMove,
    best_time: bestTime,
    warnings,
    area,
    categories,
    vibes,
    price,
    lat,
    lng,
    links: {
      googleMapsUrl,
      appleMapsUrl: appleMapsUrl ?? undefined,
      instagramUrl: instagramUrl ?? undefined,
      websiteUrl: websiteUrl ?? undefined,
      phone: phone ?? undefined
    },
    images
  };
};

const validateForSubmit = (payload: ReturnType<typeof buildPayload>) => {
  if (!payload.title) return "Title is required before submitting.";
  if (!payload.area) return "Area is required before submitting.";
  if (!payload.categories.length)
    return "Select at least one category before submitting.";
  if (!payload.vibes.length)
    return "Add at least one vibe before submitting.";
  if (!payload.description_short)
    return "One-liner is required before submitting.";
  if (!payload.story) return "Story is required before submitting.";
  if (!payload.signature_move)
    return "Signature move is required before submitting.";
  if (!payload.best_time) return "Best time is required before submitting.";
  if (!payload.links.googleMapsUrl)
    return "Google Maps URL is required before submitting.";
  if (payload.lat === null || payload.lng === null)
    return "Latitude and longitude are required before submitting.";
  return null;
};

export const upsertPlace = async (
  _prevState: PlaceActionState,
  formData: FormData
): Promise<PlaceActionState> => {
  try {
    const intent = parseText(formData.get("intent"));
    const isSubmit = intent === "submit";

    if (!intent) {
      return { error: "Missing action intent." };
    }

    const { supabase, userId } = await getActionProfile();

    const placeId = parseText(formData.get("placeId")) || null;
    const payload = buildPayload(formData);

    if (isSubmit) {
      const validationError = validateForSubmit(payload);
      if (validationError) {
        return { error: validationError };
      }
    }

    if (!placeId) {
      if (!payload.title) {
        return { error: "Title is required to create a draft." };
      }
      if (isSubmit) {
        return { error: "Save the draft before submitting." };
      }

      const baseSlug = slugify(payload.title) || "place";
      const slug = await ensureUniqueSlug(supabase, baseSlug, null);

      const { data, error } = await supabase
        .from("places")
        .insert({
          ...payload,
          slug,
          created_by: userId,
          status: "draft"
        })
        .select("id")
        .single();

      if (error) {
        return { error: error.message };
      }

      redirect(`/places/${data.id}/edit`);
    }

    const updatePayload: Record<string, unknown> = {
      ...payload
    };

    if (isSubmit) {
      updatePayload.status = "submitted" as PlaceStatus;
      updatePayload.submitted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("places")
      .update(updatePayload)
      .eq("id", placeId);

    if (error) {
      return { error: error.message };
    }

    if (isSubmit) {
      redirect("/dashboard");
    }

    redirect(`/places/${placeId}/edit`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save place."
    };
  }
};

export const adminSetPlaceStatus = async (formData: FormData) => {
  try {
    const { supabase, profile } = await getActionProfile();

    if (profile.role !== "admin") {
      redirect("/review?error=Admin access required.");
    }

    const placeId = parseText(formData.get("placeId"));
    const status = parseText(formData.get("status")) as PlaceStatus;

    if (!placeId || !status) {
      redirect("/review?error=Missing place or status.");
    }

    const updatePayload: Record<string, unknown> = { status };
    if (status === "approved") {
      updatePayload.approved_at = new Date().toISOString();
    }
    if (status === "rejected") {
      updatePayload.approved_at = null;
    }

    const { error } = await supabase
      .from("places")
      .update(updatePayload)
      .eq("id", placeId);

    if (error) {
      redirect(`/review?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/review");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update status.";
    redirect(`/review?error=${encodeURIComponent(message)}`);
  }
};
