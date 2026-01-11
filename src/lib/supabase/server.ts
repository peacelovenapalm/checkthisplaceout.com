import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const createSupabaseServerClient = async () => {
  const { url, publishableKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options: CookieOptions;
  };

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      }
    }
  });
};

export type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;
