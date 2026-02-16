# agents.md — CheckThisPlaceOut.com (v0.65 → v1.0 Operating Manual)

This project is a mobile-first curated Vegas guide:
**QR → Category → Place → Directions.**

## 1) Non-Negotiables (Scope Guardrails)
- Public site is **read-only** and shows **approved places only**
- Contributor portal is **invite-only**
- Roles: `admin | bartender`
- **No public signup**
- **No public writes**
- **No public comments/reviews**
- **No external APIs** (no live hours/open-now/photos/routing APIs)
- **Supabase + RLS is the source of truth** (no frontend-only auth)
- **No DB triggers for auto-approval**
  - voting → recount → approve must happen via server action or RPC
- v0.7 “community layer” is explicitly deferred

## 2) Versioning
- v0.6: local JSON, single curator
- v0.65: Supabase + RLS, invite-only multi-bartender, vote-to-publish (**current target**)
- v0.7: community expansion (**do not implement yet**)

## 3) Workflow Rules (Must Match)
Place lifecycle:
- `draft → submitted → approved/rejected → archived`

Voting:
- Eligible voters: `admin + bartender`
- Vote only allowed when place.status = `submitted`
- One vote per user per place (unique constraint)
- Auto-approve: `YES >= 3 AND YES > NO`
- Admin override allowed

Important:
- Do not implement auto-approval as a DB trigger.

## 4) Canonical Database Schema + Migrations
**Canonical base schema migration:**
- `supabase/migrations/20250309120000_v065_init.sql`

Tables:
- `public.profiles`
- `public.places`
- `public.votes`

FKs:
- `places.created_by → profiles.id`
- `votes.voter_id → profiles.id`

Critical columns used by the app:
- `places.status`
- `places.submitted_at`
- `places.approved_at`
- `places.updated_at`
- `places.warnings text[]`

## 5) Voting RPC Requirement (v1.0 readiness)
The `/review` workflow depends on RPC voting:
- `cast_vote(place_id, vote)` must exist in the database

Rule:
- The RPC must be included in the migration path used by FIRST_RUN setup.
- No triggers.

## 6) Environment Variables
Required (client-safe):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Required for admin operations (server-only):
- `SUPABASE_SECRET_KEY`

Dev-only legacy fallbacks:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Never leak secrets:
- No `sb_secret_*` or service role key in client bundles.

## 7) Code Organization (where things live)
- Routes (App Router): `src/app/**`
- Public data access: `src/lib/places.ts`
- Static category metadata: `src/lib/data.ts` + `data/categories.json`
- Server actions: `src/lib/actions/**`
- Auth gating: `src/lib/auth/requireMember.ts` + `src/lib/auth.ts`
- Supabase clients: `src/lib/supabase/**`
  - server client: `src/lib/supabase/server.ts`
  - admin client: `src/lib/supabase/admin.ts`
- Copy/microcopy: `src/lib/copy.ts`
- Map (client-only): `src/components/MapView.client.tsx`

## 8) v1.0 Definition of Done
Must be true before calling it “v1.0 ready”:
- `npm run build` passes in CI
- `npm run lint` passes in CI
- `/` loads with 0 results gracefully
- `/categories` exists
- Full portal loop works end-to-end:
  - draft → submit → vote → approve → appears on public site
- No secret keys leak to client
- RLS remains strict and correct
- Setup docs are consistent + reproducible

## 9) Work Package Standard (required format)
Every WP must include:
1) Objective
2) Guardrails
3) Tasks (ordered)
4) Acceptance criteria
5) Files likely to change
6) Verification commands
7) Rollback guidance
8) Explicit “Not included” list

## 10) “Do Not Do” List (Anti-scope-creep)
- Do NOT implement v0.7 features
- Do NOT add external APIs
- Do NOT add public signup or public write surfaces
- Do NOT weaken RLS
- Do NOT use DB triggers for auto-approval
- Do NOT introduce client-side secret usage