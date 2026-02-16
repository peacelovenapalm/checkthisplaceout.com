# First Run (Local Dev + Supabase)

This project expects Supabase + local env vars. Follow these steps once.

## Prerequisites
- Node.js + npm installed
- Verify:
  - `node -v`
  - `npm -v`

## Supabase project setup
1) Create a Supabase project.
2) In the dashboard, grab:
   - Project URL
   - Publishable key (`sb_publishable_...`)
   - Service role key (`sb_secret_...`) required for admin invite/reset actions
3) Click-path to keys:
   - Supabase Dashboard → Project Settings → API
   - Copy the Project URL + Publishable key + Service Role key

## Set local env
1) Copy env template:
   - `cp .env.example .env.local`
2) Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`
   - `SUPABASE_SECRET_KEY=...` (required for admin invite/reset flows)
3) Run doctor:
   - `npm run doctor`

## Run migrations (manual is OK)
1) Open Supabase SQL editor:
   - Supabase Dashboard → SQL Editor → New query
2) Paste and run the full contents of:
   - `supabase/migrations/20250309120000_v065_init.sql`
3) Paste and run the full contents of:
   - `supabase/migrations/20250309121000_v065_cast_vote_rpc.sql`

## Seed the first admin profile
1) Sign in once via `/login` so the user exists in `auth.users`.
2) Copy the user UUID (from Supabase Auth table).
3) Run this SQL in the Supabase SQL editor:
```sql
insert into public.profiles (id, display_name, handle, role, is_active)
values ('<auth_user_uuid>', 'Admin', 'admin', 'admin', true);
```

## Run the app
1) Install deps:
   - `npm install`
2) Start dev server:
   - `npm run dev`
3) Confirm:
   - `/` loads (even if empty)
   - `/login` lets you sign in
   - `/dashboard` loads only after a profile row exists

## Troubleshooting
- Missing env vars: update `.env.local` and restart `npm run dev`.
- Stale build: `rm -rf .next` then restart dev server.
- Port 3000 in use: stop the other process or run `npm run dev -- -p 3001`.
- Key mismatch: ensure `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set.
- Admin actions fail: check `SUPABASE_SECRET_KEY` is present.
