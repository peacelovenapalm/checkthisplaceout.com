"use server";

import { redirect } from "next/navigation";
import { copy } from "@/lib/copy";
import { requireMember } from "@/lib/auth/requireMember";
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
  if (!payload.title) return copy.form.validation.required;
  if (!payload.area) return copy.form.validation.required;
  if (!payload.categories.length) return copy.form.validation.required;
  if (!payload.vibes.length) return copy.form.validation.required;
  if (!payload.description_short) return copy.form.validation.required;
  if (!payload.story) return copy.form.validation.required;
  if (!payload.signature_move) return copy.form.validation.required;
  if (!payload.best_time) return copy.form.validation.required;
  if (!payload.links.googleMapsUrl) return copy.form.validation.required;
  if (payload.lat === null || payload.lng === null)
    return copy.form.validation.required;
  return null;
};

export const createDraftPlace = async (
  supabase: SupabaseServerClient,
  profileId: string,
  payload: ReturnType<typeof buildPayload>
) => {
  const baseSlug = slugify(payload.title) || "place";
  const slug = await ensureUniqueSlug(supabase, baseSlug, null);

  const { data, error } = await supabase
    .from("places")
    .insert({
      ...payload,
      slug,
      created_by: profileId,
      status: "draft"
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id as string;
};

export const updateDraftOrSubmittedPlace = async (
  supabase: SupabaseServerClient,
  placeId: string,
  payload: ReturnType<typeof buildPayload>,
  profile: { id: string; role: "admin" | "bartender" }
) => {
  const { data: place, error } = await supabase
    .from("places")
    .select("id, created_by, status")
    .eq("id", placeId)
    .maybeSingle();

  if (error || !place) {
    throw new Error("Place not found.");
  }

  const isOwner = place.created_by === profile.id;
  const isAdmin = profile.role === "admin";
  const allowedOwnerStatuses = new Set(["draft", "submitted", "rejected"]);

  if (!isAdmin && !isOwner) {
    throw new Error("You do not have access to this place.");
  }

  if (!isAdmin && !allowedOwnerStatuses.has(place.status)) {
    throw new Error("This place cannot be edited.");
  }

  const { error: updateError } = await supabase
    .from("places")
    .update(payload)
    .eq("id", placeId);

  if (updateError) {
    throw new Error(updateError.message);
  }
};

export const submitPlace = async (
  supabase: SupabaseServerClient,
  placeId: string,
  profile: { id: string; role: "admin" | "bartender" }
) => {
  const { data: place, error } = await supabase
    .from("places")
    .select("id, created_by, status")
    .eq("id", placeId)
    .maybeSingle();

  if (error || !place) {
    throw new Error("Place not found.");
  }

  const isOwner = place.created_by === profile.id;
  const isAdmin = profile.role === "admin";

  if (!isAdmin && !isOwner) {
    throw new Error("You do not have access to this place.");
  }

  const { error: submitError } = await supabase
    .from("places")
    .update({
      status: "submitted" as PlaceStatus,
      submitted_at: new Date().toISOString()
    })
    .eq("id", placeId);

  if (submitError) {
    throw new Error(submitError.message);
  }
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

    const { supabase, profile } = await requireMember();

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
        return { error: copy.form.validation.required };
      }
      if (isSubmit) {
        return { error: copy.form.validation.saveDraftFirst };
      }

      const createdId = await createDraftPlace(
        supabase,
        profile.id,
        payload
      );
      redirect(`/places/${createdId}/edit`);
    }

    await updateDraftOrSubmittedPlace(supabase, placeId, payload, profile);

    if (isSubmit) {
      await submitPlace(supabase, placeId, profile);
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
    const { supabase, profile } = await requireMember();

    if (profile.role !== "admin") {
      redirect("/review?error=Admin access required.");
    }

    const placeId = parseText(formData.get("placeId"));
    const status = parseText(formData.get("status")) as PlaceStatus;

    const allowedStatuses = new Set([
      "draft",
      "submitted",
      "approved",
      "rejected",
      "archived"
    ]);

    if (!placeId || !status || !allowedStatuses.has(status)) {
      redirect("/review?error=Missing place or status.");
    }

    const updatePayload: Record<string, unknown> = { status };
    if (status === "approved") {
      updatePayload.approved_at = new Date().toISOString();
    }
    if (status === "submitted") {
      updatePayload.submitted_at = new Date().toISOString();
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
