import "server-only";

import {
  getSupabasePublicEnv as getSharedSupabasePublicEnv,
  getSupabasePublicDiagnostics
} from "@/lib/supabase/env.shared";
import type {
  SupabasePublicDiagnostics,
  SupabasePublicEnv
} from "@/lib/supabase/env.shared";

let didLogPresence = false;

const stripQuotes = (value?: string | null) => {
  if (!value) return "";
  return value.replace(/^['"]|['"]$/g, "");
};

const diagnosticsEnabled = () =>
  process.env.SUPABASE_ENV_DIAGNOSTICS === "1";

const logEnvPresence = () => {
  if (!diagnosticsEnabled() || didLogPresence) return;

  const diagnostics = getSupabaseEnvDiagnostics();
  console.info(
    `Supabase env (server): URL=${diagnostics.hasUrl} HTTPS=${diagnostics.urlIsHttps} PUBLISHABLE_KEY=${diagnostics.hasPublishableKey} SECRET=${diagnostics.hasSecretKey} PUB_PREFIX=${diagnostics.publishableKeyHasPrefix} SECRET_PREFIX=${diagnostics.secretKeyHasPrefix}`
  );
  didLogPresence = true;
};

export const getSupabasePublicEnv = (): SupabasePublicEnv => {
  const env = getSharedSupabasePublicEnv();
  logEnvPresence();
  return env;
};

export type SupabaseAdminEnv = SupabasePublicEnv & {
  secretKey: string;
};

export const getSupabaseAdminEnv = (): SupabaseAdminEnv => {
  const env = getSupabasePublicEnv();
  const secretKey = stripQuotes(process.env.SUPABASE_SECRET_KEY);

  if (!secretKey) {
    throw new Error(
      "Admin Supabase client requires SUPABASE_SECRET_KEY (sb_secret_...)."
    );
  }

  return { ...env, secretKey };
};

export type SupabaseEnvDiagnostics = SupabasePublicDiagnostics & {
  hasSecretKey: boolean;
  secretKeyHasPrefix: boolean;
};

export const getSupabaseEnvDiagnostics = (): SupabaseEnvDiagnostics => {
  const publicDiagnostics = getSupabasePublicDiagnostics();
  const secretKey = stripQuotes(process.env.SUPABASE_SECRET_KEY);

  return {
    ...publicDiagnostics,
    hasSecretKey: Boolean(secretKey),
    secretKeyHasPrefix: secretKey.startsWith("sb_secret_")
  };
};
