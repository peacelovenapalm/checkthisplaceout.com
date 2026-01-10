# AGENTS.md — CheckThisPlaceOut.com (v0.6 - UI Overhaul)

**Current Context:** UI/Brand Overhaul ("Retro-Futurist Ops Terminal")
**System Status:** Functional Logic Stable // Visual Layer Refactor Required

This file defines the strict instructions for agents (Codex CLI, etc.) to implement the **v0.6 Visual Overhaul** of CheckThisPlaceOut.com. The goal is to apply a "Las Vegas Night Ride / Cyberpunk Terminal" aesthetic without breaking existing routing or data validation.

---

## 0) Mission Directive
Reskin the existing functional MVP into a **high-fidelity, retro-futuristic operations terminal**.
The user experience should feel like a "local friend's hacked dossier" of Vegas secrets—dark, neon-accented, slightly gritty, but purely functional.

**Core Vibe:** High-contrast, vector-sharp, HUD (Heads-Up Display) elements, scanlines, and "system status" microcopy.

---

## 1) Hard Guardrails (IMMUTABLE)
### 1.1 Technical Constraints
- **NO** external API calls (Google Places, Yelp, etc.).
- **NO** database/auth/CMS (remain `JSON`-driven).
- **NO** breaking the `npm run validate` schema checks.
- **NO** WebGL/Canvas shaders that kill mobile battery (use CSS/SVG only).

### 1.2 UX Constraints
- **Readability First:** The "cyberpunk" aesthetic MUST NOT compromise text legibility.
  - *Rule:* Body text is always high-contrast off-white on dark. No dark-red text on black.
- **Mobile Performance:** Complex borders/glows must be CSS-optimized.
- **Motion:** Respect `prefers-reduced-motion` absolutely.

---

## 2) Visual Design System (The "Brand Kit")

### 2.1 Color Palette (Tailwind Config)
Implement these exact tokens in `tailwind.config.js`:

* **Backgrounds:**
    * `bg-terminal-black`: `#050505` (Main surface)
    * `bg-terminal-dark`: `#0a0f14` (Card backgrounds)
    * `bg-scanline`: `rgba(0,0,0,0.5)` (Overlay texture)
* **Accents (Neon Signal Layer):**
    * `accent-neon-green`: `#00ff41` (Success / Active / "GO")
    * `accent-cyber-yellow`: `#fcee0a` (Warning / Highlight)
    * `accent-electric-cyan`: `#00f0ff` (Links / Info)
    * `accent-hot-pink`: `#ff00ff` (Vibe tags / "Fun")
* **Neutrals:**
    * `text-hologram`: `#e0e0e0` (Primary text)
    * `text-dim`: `#6b7280` (Secondary/labels)
    * `border-hud`: `#333333` (Inactive borders)

### 2.2 Typography
* **Headlines (Display):** Monospaced or "Tech" sans-serif (e.g., *JetBrains Mono*, *Space Mono*, or *Chakra Petch*). Uppercase styling often used.
* **Body (Readability):** Clean, modern sans-serif (e.g., *Inter* or *Switzer*) for long-form story text.
* **Microcopy:** Monospace, all-caps, small size (e.g., `text-[10px] tracking-widest`).

### 2.3 UI Motifs & Patterns
1.  **The "HUD" Container:** Cards have 1px borders, 45-degree cut corners (clip-path), and optional corner "brackets."
2.  **Scanlines:** A global `pointer-events-none` fixed overlay with a subtle CRT scanline repeating linear-gradient.
3.  **Grid Background:** A very faint (`opacity-5`) micro-grid in the page background.
4.  **Glow:** Use `box-shadow` sparing for active states (buttons, selected inputs).
5.  **Status Indicators:** Small blinking squares or "LEDs" next to headers.

---

## 3) Component Overhaul Plan

### 3.1 Global Layout (`layout.tsx`)
- Apply `bg-terminal-black` globally.
- Add the **Scanline/Noise Overlay** component (z-index 50, pointer-events-none).
- Update Header:
  - Left: Logo (Wordmark: "CHECKTHISPLACEOUT")
  - Right: "SYS.ONLINE" status indicator (green dot).

### 3.2 Category Tiles (`CategoryTile.tsx`)
- **Old:** Simple card.
- **New:** "Data Cartridge" style.
  - Border: 1px solid `border-hud`.
  - Hover: Border becomes `accent-neon-green` + subtle glow.
  - Content: Icon (vector style), Title (Mono uppercase), "Item Count" badge (e.g., `[04]`).

### 3.3 Place Card (`PlaceCard.tsx`)
- **Style:** "File Dossier."
- **Typography:**
  - Name: H3, Bold, `text-hologram`.
  - Area: `text-accent-electric-cyan`, Monospace.
- **Actions:** Buttons become "Tactical Inputs."
  - Primary (Directions): Solid fill `bg-hologram` text black, or `bg-accent-neon-green` text black. Sharp corners or 2px rounded.
  - Secondary: Outline style.

### 3.4 Map Interface (`MapView.tsx`)
- **Tiles:** Use a "Dark Matter" or High-Contrast Dark map provider (CartoDB DarkMatter is ideal).
- **Pins:** Custom DivIcons.
  - Shape: Geometric diamonds or squares.
  - Color: Neon based on category.
  - "Pulse" effect css animation.

### 3.5 Place Detail (`/p/[id]`)
- **Header:** Hero image with "glitch" load effect (optional CSS).
- **Data Block:** Display metadata (Price, Area, Lat/Lng) in a "Technical Specs" grid.
- **Story:** Readable sans-serif text in a dedicated container.
- **Sticky Footer:** "Command Bar" style (solid background, distinct buttons).

---

## 4) Microcopy & Tone (The "System" Voice)
The UI speaks like an Operating System, the Content speaks like a Friend.

* **UI Labels:**
    * Loading -> `LOADING_ASSETS...`
    * Error -> `ERR::CONNECTION_LOST`
    * Map -> `SAT_VIEW`
    * List -> `DATA_LIST`
    * Directions -> `INIT_ROUTE`
    * Open in Maps -> `EXT_APP_LAUNCH`
* **Content (JSON Data):**
    * Remains casual, warm, human. "This burger is life-changing."

---

## 5) Implementation Sequence (Refactoring Strategy)

### Phase 1: Foundation (Design Tokens)
1.  Update `tailwind.config.js` with new colors and fonts.
2.  Add `globals.css` utilities for:
    - `.scanlines`
    - `.hud-border` (clip-path polygons)
    - `.text-glow`
3.  Update `layout.tsx` background.

### Phase 2: Atoms & Molecules
4.  Refactor `Button` component (Standard vs. Tactical).
5.  Refactor `TagPill` (outlined, mono-font).
6.  Refactor `CategoryTile`.

### Phase 3: Layouts & Pages
7.  Update `PlaceCard` structure.
8.  Update `PlaceDetail` page layout (Specs Grid).
9.  Style the Map (custom tiles + pins).

### Phase 4: Polish
10. Add "System Status" micro-animations (blinking cursors, load bars).
11. Verify Contrast Ratios (Accessibility check).

---

## 6) Data Contracts (Unchanged)
**CRITICAL:** Do not modify the structure of `data/categories.json` or `data/places.json`.
The UI changes are purely cosmetic/presentation layer.
- `id`, `slug`, `lat`, `lng` remain the source of truth.

---

## 7) Quality Assurance (Visual)
### Verify before committing:
- **Dark Mode only:** The site does not support "Light Mode."
- **Contrast:** Is the grey text readable on the black background?
- **Touch:** Are the "Tactical Buttons" still large enough (44px min-height)?
- **Glitch:** Do CSS effects disappear when `prefers-reduced-motion: reduce` is active?

---

## 8) Stop Conditions (Ask User)
Stop and ask if:
- A UI element requires importing a heavy library (e.g., Three.js) to achieve the look.
- The "Cut Corner" design breaks layout on small iPhone SE screens.
- You are unsure if a color combination meets WCAG AA standards.