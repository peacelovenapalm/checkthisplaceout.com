# agents.md — CheckThisPlaceOut.com (Codex Operating Manual)

This repo is **CheckThisPlaceOut.com**: a mobile-first curated Vegas guide with an invite-only contributor portal.

## Product Truths (Do Not Drift)
- Public site is **read-only** and shows **approved places only**
- Contributor portal is **invite-only**
- Roles: `admin | bartender`
- No external APIs (no live hours, no open-now, no photos)
- No public signup, no public writing, no public reviews/comments
- Supabase + RLS must enforce permissions (no frontend-only auth)
- Place lifecycle: `draft → submitted → approved/rejected → archived`
- Voting rule: `YES >= 3 AND YES > NO`
- **Do NOT implement auto-approval as a DB trigger**
  - vote → recount → approve happens in server actions or admin RPC

---

## Repo Versioning
- **v0.6**: local JSON, single curator
- **v0.65**: Supabase + RLS, invite-only multi-bartender, vote-to-publish (**current target**)
- **v0.7**: community layer (explicitly deferred; do not implement)

---

## Canonical Schema
**Source of truth migration:**
- `supabase/migrations/20250309120000_v065_init.sql`

Tables:
- `profiles`
- `places`
- `votes`

FK expectations:
- `places.created_by → profiles.id`
- `votes.voter_id → profiles.id`

Public reads MUST always filter:
- `places.status = 'approved'`

---

## Environment Variables (New Supabase Keys)
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only (for admin actions / approvals):
- `SUPABASE_SECRET_KEY`

Dev-only legacy fallbacks allowed (but not preferred):
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Rules:
- never ship secret keys to the client bundle
- restart dev server after env changes
- clear `.next` when debugging cache issues

---

## Codebase Conventions
### Public Data Access
- `src/lib/places.ts` is the public data layer
- Always map DB records into UI-safe shape
- Handle empty states (0 results) without crashing

### Portal Auth Gating
All portal server actions MUST begin with:
- `requireMember()` from `src/lib/auth/requireMember.ts`

Invite-only enforcement:
- no profile row OR inactive profile → block access

### Server Actions
- keep actions in `src/lib/actions/*`
- validate status transitions at the action layer
- never rely on client checks

### Client-only Hazards
- Leaflet / react-leaflet must be client-only
- Use `dynamic(..., { ssr:false })` wrapper:
  - `src/components/MapView.client.tsx`

### Copy / Voice
- punchy, dry, deadpan
- 5th grade reading level
- avoid walls of text on mobile

---

## Work Package Rules (How Codex should work)
Every work package must include:
1) **Objective**
2) **Guardrails**
3) **Tasks (in order)**
4) **Acceptance criteria**
5) **Files likely to change**
6) **Verification commands**
7) **Rollback guidance** (if something breaks)

### Hard Guardrails
- no schema changes unless explicitly requested
- if schema is required, add a migration file only (no manual “ad hoc” SQL)
- no RLS weakening
- no v0.7 features
- no external APIs

---

## Release Pipeline (v0.65 → v1.0)
### WP-03: Bootstrap + Doctor
- make setup foolproof: env + migration + seed admin
- `npm run doctor` must be reliable

### WP-07: /categories route
- spec gap closure, small and clean

### WP-04: Transactional voting via RPC (no trigger)
- atomic vote insert + recount + approve
- must return counts + status

### WP-05: CI build/lint/typecheck
- fail fast in PRs

---

## Definition of Done (for v1.0 readiness)
- `npm run build` passes clean
- `/` loads with 0 results gracefully
- `/categories` exists and navigates
- full portal loop works end-to-end:
  - draft → submit → vote → approve → appears public
- no secret keys leaked client-side
- RLS remains strict and correct