# First-time Supabase setup

You mentioned the Supabase project is not created yet. Follow this once per environment.

1) Create a new Supabase project (name + region).
2) In the Supabase dashboard, copy:
   - Project URL
   - Publishable key (`sb_publishable_...`)
   - Secret key (`sb_secret_...`) only if you need admin actions (vote auto-approve/overrides)
3) Create `.env.local` in the repo root (next to `package.json`) with:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`
   - `SUPABASE_SECRET_KEY=...` (optional)
4) Run the SQL migration:
   - Open Supabase SQL Editor
   - Paste `supabase/migrations/20250309120000_v065_init.sql`
   - Execute it to create tables, constraints, and RLS
5) Create the first auth user (email/password) in Supabase Auth.
6) Insert the first admin profile using the seed snippet at the bottom of the migration file.
7) Restart the Next dev server (env changes are read at startup) and load the app:
   - Public pages should render (even if no places exist)
   - `/login` should work
   - Contributor routes are gated until a matching `profiles` row exists

Note: Until the migration runs, database queries will fail because the tables do not exist.
