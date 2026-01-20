"use server";

import { redirect } from "next/navigation";
import { copy } from "@/lib/copy";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireMember } from "@/lib/auth/requireMember";
import type { ProfileRole } from "@/lib/types";

export type InviteMemberState = {
  error?: string;
  link?: string;
  email?: string;
};

export type ResetMemberState = {
  error?: string;
  link?: string;
  email?: string;
};

const parseText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export const updateMember = async (formData: FormData) => {
  try {
    const { supabase, profile } = await requireMember();

    if (profile.role !== "admin") {
      redirect("/dashboard");
    }

    const profileId = String(formData.get("profileId") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim() as ProfileRole;
    const isActive = formData.get("is_active") === "on";

    if (!profileId || (role !== "admin" && role !== "bartender")) {
      redirect("/members");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role, is_active: isActive })
      .eq("id", profileId);

    if (error) {
      redirect(`/members?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed.";
    redirect(`/members?error=${encodeURIComponent(message)}`);
  }

  redirect("/members");
};

export const inviteMember = async (
  _prevState: InviteMemberState,
  formData: FormData
): Promise<InviteMemberState> => {
  try {
    const { profile } = await requireMember();

    if (profile.role !== "admin") {
      return { error: copy.errors.notAllowedBody };
    }

    const email = parseText(formData.get("email")).toLowerCase();
    const displayName = parseText(formData.get("display_name"));
    const handle = parseText(formData.get("handle"));
    const role = parseText(formData.get("role")) as ProfileRole;
    const isActive = formData.get("is_active") === "on";

    if (!email) {
      return { error: copy.form.validation.required };
    }

    if (role !== "admin" && role !== "bartender") {
      return { error: copy.form.validation.required };
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "invite",
      email
    });

    if (error) {
      return { error: error.message };
    }

    const userId = data?.user?.id;
    const link = data?.properties?.action_link;

    if (!userId || !link) {
      return { error: copy.errors.genericBody };
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        display_name: displayName || email,
        handle: handle || null,
        role,
        is_active: isActive
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { error: profileError.message };
    }

    return { link, email };
  } catch (error) {
    const message = error instanceof Error ? error.message : copy.errors.genericBody;
    return { error: message };
  }
};

export const resetMemberLogin = async (
  _prevState: ResetMemberState,
  formData: FormData
): Promise<ResetMemberState> => {
  try {
    const { profile } = await requireMember();

    if (profile.role !== "admin") {
      return { error: copy.errors.notAllowedBody };
    }

    const email = parseText(formData.get("email")).toLowerCase();
    if (!email) {
      return { error: copy.form.validation.required };
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email
    });

    if (error) {
      return { error: error.message };
    }

    const link = data?.properties?.action_link;
    if (!link) {
      return { error: copy.errors.genericBody };
    }

    return { link, email };
  } catch (error) {
    const message = error instanceof Error ? error.message : copy.errors.genericBody;
    return { error: message };
  }
};
