import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/lib/types";

export type ActionProfile = {
  supabase: SupabaseServerClient;
  profile: Profile;
  userId: string;
  email: string | null;
};

export const getActionProfile = async (): Promise<ActionProfile> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!profile) {
    throw new Error("Your account is not yet active.");
  }

  return {
    supabase,
    profile: profile as Profile,
    userId: user.id,
    email: user.email ?? null
  };
};

export const requireRole = (profile: Profile, role: ProfileRole) => {
  if (profile.role !== role) {
    throw new Error("You do not have access to this action.");
  }
};
