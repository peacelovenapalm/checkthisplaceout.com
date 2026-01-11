import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv } from "@/lib/supabase/env";

export const createSupabaseAdminClient = () => {
  const { url, secretKey } = getSupabaseAdminEnv();
  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};
