# AGENTS.md — CheckThisPlaceOut.com (v1.0)

This file defines how agents (Codex CLI or other coding agents) should plan, implement, and validate v1.0 of CheckThisPlaceOut.com.

---

## 0) One-sentence mission
Ship a mobile-first, personality-rich Vegas guide that lets a QR-scan user pick a category, choose a place, read a short “friend-text” blurb, and open directions in one tap.

---

## 1) Hard guardrails (do not violate)
### MUST NOT include in v1.0
- No external API calls for hours/photos/open-now.
- No Uber/Lyft pricing, transport cost, or routing APIs.
- No user accounts, login, reviews, comments, or submissions.
- No database or CMS (content is local files).
- No analytics requirements beyond basic page views (optional only).

### MUST include in v1.0
- Home with category tiles.
- Category page with List default and Map toggle.
- Place detail page with story + primary actions.
- Deep links to Maps (Directions + Open in Maps).
- Strong readability and accessibility on mobile, even with heavy visual personality.
- `prefers-reduced-motion` support (reduced/disabled motion and particles).

---

## 2) Success criteria (what “done” means)
A first-time tourist can:
1) Open the site from QR in a bar,
2) Tap a category tile,
3) Scan a list of curated cards,
4) Open a place detail,
5) Tap Directions and arrive in Maps,
All within ~10 seconds of arriving on the site.

---

## 3) Tech stack (recommended defaults)
- Next.js (App Router)
- Tailwind CSS
- Framer Motion (transitions + micro-interactions)
- Leaflet for map UI (simple pins + interaction)
- Content: `data/categories.json`, `data/places.json`
- Images: `/public/places/**`
- Deployment: Vercel-compatible

Avoid heavy GPU effects, shaders, and large particle libraries.

---

## 4) Information architecture (routes)
- `/` Home (category tiles)
- `/c/[category]` Category page (List default, Map toggle)
- `/p/[placeId]` Place detail page
- `/about` (optional but recommended for personal framing)
- `/privacy` (minimal)

---

## 5) Data contracts (single source of truth)
### 5.1 `data/categories.json`
Each item:
- `slug` (string, unique, URL-safe)
- `title` (string)
- `caption` (string, 6–12 words)
- `icon` (string; icon name or asset path)
- `order` (number)

### 5.2 `data/places.json`
Each item:
- `id` (string, unique)
- `name` (string)
- `categories` (string[] of category slugs)
- `area` (string; e.g., "Arts District", "Fremont", "Chinatown")
- `lat` (number)
- `lng` (number)
- `oneLiner` (string; 1 line “why I send people here”)
- `story` (string; 2–6 sentences max)
- `signatureMove` (string; “Order/Do this”)
- `bestTime` (string; simple)
- `vibes` (string[]; 2–5 tags)
- `price` (string; "$" | "$$" | "$$$" | "" optional)
- `links` (object):
  - `googleMapsUrl` (string, REQUIRED)
  - `appleMapsUrl` (string, optional)
  - `instagramUrl` (string, optional)
  - `websiteUrl` (string, optional)
  - `phone` (string, optional)
- `images` (string[] local paths; optional but recommended)
- Optional:
  - `warnings` (string[] or string)
  - `accessibilityNotes` (string)

### 5.3 Validation requirements
Build-time (or pre-commit) validation must:
- Ensure unique `id` and `slug`.
- Ensure each `place.categories[]` exists in categories.
- Ensure lat/lng are numbers within valid ranges.
- Ensure `links.googleMapsUrl` is present and URL-shaped.
- Warn (not fail) on missing optional fields.

---

## 6) UX requirements (mobile-first)
### 6.1 Home
- 8–12 category tiles.
- Large tap targets (>= 44px height), readable without zoom.
- Clear hierarchy; the vibe is in borders/icons/microcopy, not tiny text.

### 6.2 Category page (List default)
PlaceCard must show:
- Name, area, one-liner, vibe tags, optional price.
- Primary CTA: **Directions**
- Secondary CTA: **Open in Maps**
- Optional quick links: Instagram, Website, Call (only if present)

Card tap (or “Details”) goes to `/p/[placeId]`.

### 6.3 Category page (Map toggle)
- Toggle: List | Map.
- Pins for places in this category.
- Tap pin opens a mobile bottom sheet (or panel) with:
  - Name, one-liner
  - Directions / Open in Maps
  - Link to details

### 6.4 Place detail
- Hero image or carousel (local files).
- Story blocks: story, signatureMove, bestTime, warnings.
- Sticky actions on mobile:
  - Directions
  - Open in Maps
  - Call/Website/Instagram if available

---

## 7) Visual direction (personality without unusable chaos)
### 7.1 Style theme
- Dark base with renaissance-rich tones + neon accents.
- Cyberpunk / retro-future geometry + esoteric sigils.
- “MySpace energy” in framing and microcopy, but content remains readable.

### 7.2 Typography rules
- Two-font system max:
  - Display font for headings
  - Clean sans for body
- Body minimum ~16px; line-height comfortable.
- Avoid neon-on-neon for paragraphs; reserve neon for accents and headers.

### 7.3 Motion rules
- Allowed: page transitions, hover/press glow, subtle background drift, optional particles.
- Must respect `prefers-reduced-motion`:
  - disable particles
  - reduce/disable transition motion
- Motion must never block scrolling or reading.

---

## 8) Accessibility requirements
- Tap targets >= 44px.
- Semantic headings and landmarks.
- Visible focus states.
- Alt text on images where meaningful.
- Contrast must remain high for body text.

---

## 9) Performance requirements
- Optimize images (size, compression) and lazy-load below the fold.
- Keep particle density low and disable under reduced motion.
- Avoid giant bundles; keep dependencies minimal.

---

## 10) Component plan (minimum set)
- `CategoryTile`
- `PlaceCard`
- `TagPill`
- `MapView` (Leaflet wrapper)
- `BottomSheet` (mobile)
- `PlaceDetail`
- `HeaderNav` (lightweight)
- `ThemeBackground` (pattern/grain; lightweight)

---

## 11) Agent roles & responsibilities
### 11.1 PM/Orchestrator agent
- Enforce guardrails.
- Keep scope tight to v1.0.
- Define acceptance criteria for each feature.
- Decide what to ship vs defer.

### 11.2 UI/UX agent
- Implement layout hierarchy and readable design tokens.
- Ensure mobile navigation and thumb ergonomics.
- Ensure “character layer” doesn’t destroy legibility.

### 11.3 Frontend engineer agent
- Implement routes, data loading, components.
- Implement map + bottom sheet behavior.
- Implement link-out actions reliably.

### 11.4 QA agent
- Test iOS Safari/Chrome, Android Chrome.
- Verify reduced motion, focus states, no overlap issues.
- Validate build-time data checks.

---

## 12) Work plan (sequenced tasks)
### Phase 1 — Skeleton + data
1) Create `data/categories.json` and `data/places.json` with 5 sample places.
2) Add `/public/places/` with sample images.
3) Add validation script and wire to `npm run validate`.

### Phase 2 — Pages
4) Home page tiles route to categories.
5) Category List page with PlaceCards + actions.
6) Place detail page with sticky actions.

### Phase 3 — Map toggle
7) Add Map toggle and Leaflet pins.
8) Bottom sheet opens on pin tap and links to detail.

### Phase 4 — Polish
9) Implement theme tokens, borders, icons, patterns, subtle animations.
10) `prefers-reduced-motion` support.
11) Accessibility pass and mobile testing.

---

## 13) Testing checklist (definition of done)
### Mobile
- Home tiles: no overlap, readable, easy tap.
- Category list: scroll smooth; CTAs work.
- Map view: loads; pins tappable; bottom sheet usable.
- Place detail: story readable; sticky actions; link-outs correct.
- Missing optional fields do not break layout.

### Accessibility
- Reduced motion disables particles/transitions.
- Focus states visible on desktop.
- Contrast acceptable for body text.

### Data validation
- Invalid category slugs fail validation.
- Missing googleMapsUrl fails validation.
- Duplicate ids fail validation.

---

## 14) Coding conventions
- Prefer simple, explicit code over clever abstractions.
- Keep data loading server-safe; avoid dynamic runtime fetch.
- Use TypeScript types for `Category` and `Place` even if data is JSON.
- Do not introduce large UI libraries that bloat bundles.

---

## 15) PR / commit rules for agents
- Keep PRs small: one feature per PR when possible.
- Include screenshots or short GIF for major UI changes (mobile view).
- Include notes on how to test manually.
- Never add v1.0-excluded features “because it’s easy.”

---

## 16) Quick commands (suggested)
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run validate`
- `npm run test` (optional if tests exist)

---

## 17) “Stop conditions” (ask before proceeding)
Agents must stop and ask (instead of guessing) if:
- A requested change implies external APIs (hours, photos, live data).
- A requested feature implies user accounts, DB, or CMS.
- A requested UX implies heavy performance cost that harms mobile.

---

## 18) Content voice constraints
- One-liners: punchy, specific, no fluff.
- Stories: 2–6 sentences max; “friend text” tone; no walls of text.
- Warnings: short and factual.
- SignatureMove: one directive (order/do/sit/arrive at).

End of file.