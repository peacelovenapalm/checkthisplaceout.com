# Supabase environment variables

Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Optional (server-only):
- SUPABASE_SECRET_KEY

Notes:
- Restart the Next dev server after changing `.env.local`.
- If auth behaves oddly after env changes, clear `.next` and restart.
