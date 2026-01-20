import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type MemberSession = {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  user: {
    id: string;
    email: string | null;
  };
  profile: Profile;
};

export const requireMember = async (): Promise<MemberSession> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  const user = data.session?.user ?? null;

  if (error || !user) {
    throw new Error("Login required.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Your account is not active.");
  }

  return {
    supabase,
    user: { id: user.id, email: user.email ?? null },
    profile: profile as Profile
  };
};
