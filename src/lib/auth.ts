import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/lib/types";

export type SessionProfile = {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
};

export const getSessionProfile = async (): Promise<SessionProfile> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user ?? null;

  if (!user) {
    return { userId: null, email: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (profile as Profile | null) ?? null
  };
};

export const requireActiveProfile = async () => {
  const sessionProfile = await getSessionProfile();
  if (!sessionProfile.userId) {
    redirect("/login");
  }
  return sessionProfile;
};

export const requireRole = async (role: ProfileRole) => {
  const sessionProfile = await requireActiveProfile();
  if (!sessionProfile.profile) {
    return sessionProfile;
  }
  if (sessionProfile.profile.role !== role) {
    return { ...sessionProfile, profile: null };
  }
  return sessionProfile;
};
