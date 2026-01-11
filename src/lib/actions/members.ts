"use server";

import { redirect } from "next/navigation";
import { getActionProfile } from "@/lib/actions/guards";
import type { ProfileRole } from "@/lib/types";

export const updateMember = async (formData: FormData) => {
  try {
    const { supabase, profile } = await getActionProfile();

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
