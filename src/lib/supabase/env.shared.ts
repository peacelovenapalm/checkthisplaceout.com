export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export type SupabasePublicDiagnostics = {
  hasUrl: boolean;
  hasPublishableKey: boolean;
  urlIsHttps: boolean;
  publishableKeyHasPrefix: boolean;
};

const stripQuotes = (value?: string | null) => {
  if (!value) return "";
  return value.replace(/^['"]|['"]$/g, "");
};

export const getSupabasePublicEnv = (): SupabasePublicEnv => {
  const url = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = stripQuotes(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const hasUrl = Boolean(url);
  const hasPublishable = Boolean(publishableKey);

  if (!hasUrl || !hasPublishable) {
    throw new Error(
      `Missing Supabase env: URL=${hasUrl} PUBLISHABLE_KEY=${hasPublishable}`
    );
  }

  return {
    url,
    publishableKey
  };
};

export const getSupabasePublicDiagnostics = (): SupabasePublicDiagnostics => {
  const url = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = stripQuotes(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  return {
    hasUrl: Boolean(url),
    hasPublishableKey: Boolean(publishableKey),
    urlIsHttps: url.startsWith("https://"),
    publishableKeyHasPrefix: publishableKey.startsWith("sb_publishable_")
  };
};
