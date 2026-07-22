# CONKA Design System

> Single source of truth for all visual design decisions.
> Token implementation: `app/brand-base.css` — the single stylesheet (Layers 1, 2, 2.5, 3).
> The former `app/premium-base.css` ("Soft-Tech Luxury") has been **deleted**; its still-referenced tokens were folded into `brand-base.css` Layer 3 as `@deprecated`.
>
> **Direction:** the forward language is **Simple DTC** (§8.5). **Clinical** (§8) is retained for evidence-dense and `/app` dark surfaces. See the per-surface authority table in §8.5.

---

## Contents

1. [Principles](#1-principles)
2. [Typography](#2-typography)
3. [Colour palette](#3-colour-palette)
4. [Radius system](#4-radius-system)
5. [Spacing and layout](#5-spacing-and-layout)
6. [Section and component architecture](#6-section-and-component-architecture)
7. [Mobile](#7-mobile-74-of-traffic)
8. [Clinical Aesthetic](#8-clinical-aesthetic)
8.5. [Simple DTC (forward direction)](#85-simple-dtc-forward-direction)
9. [Landing Page Visual System](#9-landing-page-visual-system)
10. [App Dark Aesthetic](#10-app-dark-aesthetic)
11. [Migration from legacy](#11-migration-from-legacy)
12. [Checklist for new sections](#12-checklist-for-new-sections)
13. [Related docs](#13-related-docs)

---

## 1. Principles

1. **Monochrome canvas first.** Most pages should feel black-and-white before any accent is applied. Colour is functional, not decorative.
2. **Minimal, scientific, slightly organic.** Never overdesigned. Every element earns its place.
3. **One system, not per-page decisions.** Layout, spacing, radius, and typography are fixed constraints — new content drops in without ad-hoc styling.
4. **Left-aligned by default.** All copy defaults to left alignment for clarity, consistency, and editorial feel. Centre alignment is avoided.
5. **Restraint over density.** Sharp structure everywhere; dense clinical micro-typography only where the data earns it. Calm, not busy.

---

## 2. Typography

### Font stack

| Role | Font | Variable | Notes |
|------|------|----------|-------|
| **Primary** (headings + body) | Neue Haas Grotesk Display | `--font-brand-primary` | `next/font/local` from `app/fonts/`. Weights: 400, 500, 700. |
| **Data** (metrics, short labels, mono) | JetBrains Mono | `--font-brand-data` | `next/font/local` from `app/fonts/`. Weights: 400, 500. |

> **Two registers — read vs scan.** The Primary font is the *reading layer*: headings, body, descriptions, and any control/form label a user reads to take an action — sentence case, near-black, comfortably sized. The Data font is the *scanning layer*: eyebrows, stat/spec labels, counters, tags, units, PMIDs — short markers (≤3 words), uppercase, low opacity. Clinical clarity comes from keeping these separate; mono is *seasoning*, not the main text. Setting prose or interactive labels in mono is the single most common legibility regression on these pages — when unsure, ask whether a user reads it (sans) or scans it (mono).

### Type scale

| Role | Class | Weight | Size | Line height | Letter spacing |
|------|-------|--------|------|-------------|----------------|
| H1 | `.brand-h1` | 500 | `clamp(2.25rem, 6vw, 3.5rem)` | 110% | -0.02em |
| H1 Bold | `.brand-h1-bold` | 700 | `clamp(2.25rem, 6vw, 3.5rem)` | 110% | -0.02em |
| H2 | `.brand-h2` | 500 | `clamp(1.75rem, 4vw, 2.5rem)` | 112.5% | -0.01em |
| H3 | `.brand-h3` | 400 | `clamp(1.25rem, 3vw, 1.75rem)` | 115% | 0 |
| H4 | `.brand-h4` | 500 | `clamp(1rem, 2vw, 1.25rem)` | 120% | -0.01em |
| Body | `.brand-body` | 400 | `1rem` | 140% | 0 |
| Caption | `.brand-caption` | 400 | `0.875rem` | 115% | 0 |
| Data metric | `.brand-data` | 500 | context-dependent | native | 0 |
| Data label | `.brand-data-label` | 400 | `0.875rem` | native | 0 |

### Heading spacing

`brand-h*` classes own typography only. Components override the built-in `margin-bottom` with `mb-0` and control spacing via Tailwind.

```jsx
<div className="mb-10">
  <h2 className="brand-h2 mb-0">Heading</h2>
  <p className="mt-2 text-black/60">Subtitle</p>
</div>
```

---

## 3. Colour palette

| Name | Variable | Hex | Role |
|------|----------|-----|------|
| Pure White | `--brand-white` | `#FFFFFF` | Primary background, default canvas |
| Tint | `--brand-tint` | `#F4F5F8` | Soft zone break (~96% lightness). One tint only. |
| UI Neutral | `--brand-neutral` | `#CCCCCA` | Dividers and borders only. Not for section backgrounds. |
| Neuro Blue | `--brand-accent` | `#4058BB` | Primary CTA button colour. Clinical scope overrides to `#1B2757`. |
| Savings / Positive | `--brand-positive` | `#1A7F4F` | Sanctioned system-wide accent for savings %, "+N free" badges, cart Savings row. Always at `/10` tint bg + solid text (`bg-[#1a7f4f]/10 text-[#1a7f4f]`). See §8.5. |
| Deep Grey | `--brand-deep-grey` | `#212121` | Use sparingly. |
| Deep Black | `--brand-black` | `#000000` | Primary text, footer. |

### Text colour tiers (light surfaces)

4 fixed tiers. No in-between values.

| Tier | Opacity | Tailwind | Use for |
|------|---------|----------|---------|
| Primary | 100% | `text-black` | Headings, card titles, key statements |
| Secondary | 80% | `text-black/80` | Body copy, descriptions |
| Tertiary | 60% | `text-black/60` | Captions, subtitles, metadata |
| Muted | 40% | `text-black/40` | Legal footnotes, PMIDs, disclaimers |

---

## 4. Radius system

| Token | Value | Use |
|-------|-------|-----|
| `--brand-radius-interactive` | `16px` | Buttons, inputs, pills, tags |
| `--brand-radius-container` | `24px` | Image containers, nested surfaces |
| `--brand-radius-card` | `32px` | Cards, major surfaces, bento cells |

The Clinical scope (`.brand-clinical`) overrides all three to `0px`. The dark-canvas pages (`/app`, `/app-insights`) inherit zero radius because they apply `.brand-clinical` themselves; there is no separate "App Dark" radius rule.

---

## 5. Spacing and layout

| Token | Value | Purpose |
|-------|-------|---------|
| `--brand-max-width` | `1280px` | Content rail |
| `--brand-gutter-mobile` | `1.25rem` | Horizontal padding mobile |
| `--brand-gutter-desktop` | `5vw` | Horizontal padding desktop |
| `--brand-section-padding` | `clamp(5rem, 10vh, 10rem)` | Section vertical padding desktop |
| `--brand-section-padding-mobile` | `5rem` | Section vertical padding mobile |
| `--brand-header-gap` | `3rem` | Heading block to content |
| `--brand-text-gap` | `1.5rem` | Heading to body |

---

## 6. Section and component architecture

### The rule: page orchestrates, component is content-only

**Page owns:** `<section>` wrapper with `brand-section`, background class, track wrapper (`brand-track`) for content alignment, and `aria-label` for accessibility.

**Component owns:** content only — no `<section>`, no root `max-w-*`, no `px-*`. Internal layout (grids, stacks, gaps), card/surface styling using brand tokens, and typography — setting text colour explicitly when the surface differs from the section background.

```tsx
<section className="brand-section brand-bg-white" aria-label="Benefits">
  <div className="brand-track">
    <MyComponent />
  </div>
</section>
```

### Section backgrounds

| Class | Background | Use |
|-------|-----------|-----|
| `.brand-bg-white` | `#FFFFFF` | Default canvas (~55-60%) |
| `.brand-bg-tint` | `#F4F5F8` | Soft zone breaks (~30-40%) |
| `.brand-bg-black` | `#000000` | Use sparingly (max 1 per page) |
| `.brand-bg-neutral` | `#CCCCCA` | Legacy only. Do not use on new pages. |

**Colour rhythm rule:** never place two identical backgrounds adjacent. White/tint alternation at this lightness level feels like gentle rhythm, not harsh striping.

---

## 7. Mobile (74% of traffic)

Mobile-first is non-negotiable. Full mobile guide: `MOBILE_OPTIMIZATION.md`.

- Design at 390px first. Desktop is the adaptation.
- Radii stay the same on mobile.
- Section padding reduces to `--brand-section-padding-mobile`.
- One idea per viewport. Scannable over readable.
- If mobile and desktop conflict, mobile wins.
- Minimum 44x44px tap targets on all interactive elements.
- Split into `ComponentDesktop.tsx` / `ComponentMobile.tsx` with `useIsMobile(1024)` only when layouts diverge significantly.

---

## 8. Clinical Aesthetic

> Active spec for every acquisition and content surface. Opt-in via `.brand-clinical` on the page root.
>
> Active pages: `/` `/start` `/funnel` `/science` `/our-story` `/case-studies` `/ingredients` `/app` `/app-insights` `/why-conka` `/conka-flow` `/conka-clarity` `/protocol/[id]` + Navigation + Footer
>
> **The clinical grammar (zero radii, hairline borders, mono labels, eyebrow + heading + sub-line, no shadows, no gradients, navy as interactive-only) applies in both light and dark themes.** This section documents the canonical light-theme palette (black-on-white). Section 10 documents the dark-theme palette (white-opacity on `#0a0a0a`) used by `/app` and `/app-insights`. Both inherit the same structural grammar; only the colour layer flips.
>
> **Restraint first.** Clinical detailing is a tool, not a default. The structural grammar (zero radius, hairline borders, left-alignment, mono for data) applies everywhere. The dense micro-typography (topic codes, counters, spec strips, PMID tags, formula tags) is reserved for surfaces where data density genuinely earns it. Most sections need only an eyebrow, a heading, and clean body copy. When in doubt, leave it out.

### Token overrides (`.brand-clinical`)

| Token | Base | Clinical | Effect |
|-------|------|----------|--------|
| `--brand-radius-card` | 32px | `0` | Square cards |
| `--brand-radius-container` | 24px | `0` | Square containers |
| `--brand-radius-interactive` | 16px | `0` | Square buttons |
| `--brand-accent` | `#4058BB` | `#1B2757` | Darker navy |
| `--brand-tint` | `#f4f5f8` | `#f5f5f5` | Neutral grey |

All components using these tokens update automatically. No per-component overrides needed.

### Clinical utilities (unscoped, opt-in from `brand-base.css`)

- **`.lab-clip-tr`** — top-right 12px chamfer. Apply to primary CTAs, nav buttons, tags only. Never on cards, asset frames, or non-interactive surfaces.
- **`.lab-asset-frame`** — double-border `box-shadow` stack for imagery and data surfaces.
- **`@keyframes lab-blink`** — terminal cursor blink. `style={{ animation: "lab-blink 1s step-end infinite" }}`.
- **Smaller overlay chamfer (10px)** — for badge overlays inside images. Inline: `[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]`

### Standard patterns

**Section header**

Every section opens with an eyebrow + heading. The mono sub-line (`.brand-mono-sub`) is optional — add it only when a section needs a genuine clarifier, proof point, or scale figure. Default to omitting it. **`.brand-mono-sub` is a ≤10-word data clarifier, not a description.** For a readable sentence under the heading, use a sans body paragraph (`text-base text-black/80 leading-relaxed`), never the mono sub-line.

| Element | Role | Format | CSS class |
|---------|------|--------|-----------|
| Eyebrow | Identifies the topic | `// <short concept> · <TOPIC-0X>` | `.brand-eyebrow` |
| Heading | Bold positioning statement | Single black. No accent spans. `letterSpacing: "-0.02em"` inline. | `brand-h1/h2/h3` |
| Sub-line | Optional clarifier, proof, or scale | Mono, middle-dot separated, max 10 words | `.brand-mono-sub` |

```tsx
<p className="brand-eyebrow mb-3">{"// Short concept · TOPIC-0X"}</p>
<h2 className="brand-h2 mb-2 text-black" style={{ letterSpacing: "-0.02em" }}>
  Section heading, single black.
</h2>
{/* Optional sub-line — only when a genuine clarifier/proof/scale is needed:
<p className="brand-mono-sub">Clarifier · Proof · Scale</p> */}
```

Wrap `// ...` as `{"// ..."}` in JSX to avoid `react/jsx-no-comment-textnodes`.

**Data card**
```
bg-white border border-black/12 p-5 lg:p-6
```

**Card header row (number + category)**
```tsx
<div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
  <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">01.</span>
  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">CATEGORY</span>
</div>
```

**Card header row (labelled counter + right-aligned identity)** — same row container; left `font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums` (e.g. `P-01 · Pillar 01 / 05`), right navy identity `font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums`.

**Spec strip (3-col dashboard stats)**
```tsx
<div className="grid grid-cols-3 gap-0 border border-black/12 bg-white">
  <div className="p-4 border-r border-black/8">
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">Studies</p>
    <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">32</p>
  </div>
</div>
```

**Em-dash bullets (replace `•`)**
```tsx
<li className="flex items-start gap-2">
  <span className="font-mono text-black/30 shrink-0">—</span>
  <span>{item}</span>
</li>
```

**Segmented tabs** — zero-radius 2-col grid. Active: `bg-black text-white`. Inactive: `bg-white`. `min-h-[44px]` tap target.

**Evidence grid (nested hairlines)** — outer `border border-black/12`, inner cells `border-r border-black/8` / `border-b border-black/8`, no gaps. Responsive: 2-col mobile, 4-col desktop.

**Icon tile (card signifier)** — `w-11 h-11 flex items-center justify-center text-white`, `backgroundColor: "#1B2757"` inline; SVG at `width/height 22`, `strokeWidth 1.75`, `strokeLinecap="square"`, `strokeLinejoin="miter"`.

**Hairline data table (numbered rows)** — `bg-white border border-black/12`; each row `flex items-baseline justify-between gap-4 px-4 py-3` with `border-b border-black/8` on all but the last. Counter: `font-mono text-[10px] text-black/35 tabular-nums`, padded `String(idx + 1).padStart(2, "0")`. Name: `text-sm font-semibold text-black`; role label: `font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-0.5`.

**Formula / variant tag** — `font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/6 border border-[#1B2757]/20 px-2 py-0.5 tabular-nums` (e.g. `F01`).

**Quote block** — mono label `font-mono text-[10px] uppercase tracking-[0.2em] text-black/40` above a `border-l-2 border-[#1B2757] pl-5 lg:pl-6` block; quote `text-3xl lg:text-4xl text-black leading-tight` with `letterSpacing: "-0.02em"`; attribution `font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 tabular-nums mt-5`, prefixed `— `.

**PubMed / citation link** — `<a>` to `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, `target="_blank" rel="noopener noreferrer"`, class `font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums`, label `PMID {pmid} ↗`.

**Closing CTA card** — `bg-white border border-black/12 p-5 lg:p-8`; mono label `font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3`; heading `brand-h3 text-black` with `letterSpacing: "-0.02em"`; mono guarantee strip `font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6`; close with `ConkaCTAButton`.

**Figure plates** — use the `FigurePlate` component (`app/components/FigurePlate.tsx`). Lifestyle and portrait imagery only; never on product renders. Number sequentially across the page (`Fig. 01`, `Fig. 02`, ...).

### Clinical typography rules

- **Eyebrow:** `.brand-eyebrow` — do not write the Tailwind string by hand
- **Mono sub:** `.brand-mono-sub` — do not write the Tailwind string by hand
- **Row counter / spec label:** `font-mono text-[9px]–[11px] uppercase tracking-[0.18em] tabular-nums`, opacity `text-black/35–60`
- **Body paragraph inside a clinical card:** `text-sm md:text-base text-black/70–/75 leading-relaxed`. Never full-opacity `brand-body` in clinical surfaces.
- **Interactive / form / control labels** (a label a user reads to act on: input labels, slider labels, control captions): sans, sentence case, `text-sm font-medium text-black`. These belong to the *reading* layer, not the data layer — do **not** set them in mono, uppercase, or low opacity. Reference: the order builder and cost estimator on `/professionals`.
- Canonical separator: middle-dot `·` (U+00B7). Not `|`, not `—`.
- Every section eyebrow opens with `//`. Format: `// <short concept> · <TOPIC-0X>`.
- Headings get `letterSpacing: "-0.02em"` inline (stock classes don't tighten enough for clinical).
- Headings are single `text-black`. No accent spans, no navy fills, no gradient text. Navy `#1B2757` is interactive-only.
- Any number that can change: `tabular-nums`.
- **Mono is for *scanned data*, not *read text*.** `font-mono` (uppercase, low opacity) covers data labels and structural markers only — eyebrows, stat/spec labels, counters, units, percentages, PMIDs, tags, fig plates: three words or fewer that the eye scans, never reads. The moment text is a sentence, or a label a user reads to take an action, it leaves the mono register and becomes sans, sentence case, near-black. When unsure: would a user *read* this or *scan* it? Read → sans. Scan → mono.

### Counter conventions

| Prefix | Use | Example |
|--------|-----|---------|
| `01` | Generic index | Hairline table rows |
| `01.` | List item (trailing dot) | Sidebar case study rows |
| `01 / 05` | Position in a fixed set | Carousel counter |
| `P-01` | Pillar | Science pillars |
| `F-01` / `F01` | Formula | Flow/Clear identification |
| `U-01` | University partner | Evidence summary |
| `R-01` | Researcher | Evidence summary |
| `Fig. 01` | Figure plate on imagery | Any framed asset |

### Topic codes

Every section eyebrow ends with a topic code. Codes are global, one canonical code per topic.

| Code | Topic |
|------|-------|
| `CONKA-00` | Core brand philosophy |
| `CONKA-01` | CONKA Flow (product) |
| `CONKA-02` | CONKA Clear (product) |
| `CONKA-03` | Both / Bundle |
| `APP-01` | The companion app |
| `SCI-01` | How it works / mechanism |
| `SCI-02` | Deep science / research / clinical trials |
| `ING-01` | Ingredients / formula breakdown |
| `STORY-01` | Our story / founders |
| `PROOF-01` | First-party objective evidence |
| `PROOF-02` | Self-verification (100-day guarantee) |
| `PROOF-03` | Third-party social proof |
| `FAQ-01` | FAQ |

Rules: UPPERCASE stem, hyphen, two-digit padding (`APP-01`, not `app-1`). Global scope — add a row here before using a new code.

### Clinical colour grammar

| Use | Value | Rule |
|-----|-------|------|
| Primary CTA, selected state | `#1B2757` (navy) | **Interactive only.** Never decorative. |
| Dividers, borders | `border-black/8`–`/12` | Hairline. Thicker only when selected. |
| Section backgrounds | `bg-white` / `bg-[var(--brand-tint)]` | Alternate for rhythm. |

### Primary CTA — `ConkaCTAButton`

`app/components/landing/ConkaCTAButton.tsx`. Standard CTA for every clinical surface. Do not hand-roll. Props: `children` (label), `href` (defaults to `FUNNEL_URL`), `meta` (second row).

### Clinical "Do not" list

- Add `border-radius` — tokens handle it
- Use gradients — solid navy `#1B2757` only (exception: `bg-gradient-to-t from-black/70` over imagery for figure-plate legibility)
- Colour headings — single black only
- Omit the topic code in a section eyebrow
- Apply `lab-clip-tr` to non-interactive elements
- Hand-roll a primary CTA — always `ConkaCTAButton`
- Add shadows to cards — hairline border only
- Centre-align headings
- Use emoji in labels
- Use `•` bullets — em-dash (`—`) only
- Apply figure plates to product renders

---

## 8.5. Simple DTC (forward direction)

> **The forward language.** Simple DTC is where new acquisition work is heading. It reads like a modern consumer supplement brand (Magic Mind, Seed): rounded, confident, quietly branded, minimal chrome. It is built from the **Layer 1 base tokens** in `brand-base.css` — it does **not** apply `.brand-clinical`.
>
> Reference implementations (shipped, draw the grammar from these): the **cart drawer + `CartAppGift` + `CartUpsellStrip`** (`app/components/CartDrawer.tsx` and siblings), the **nav cart/account states** (`app/components/navigation/NavigationDesktop.tsx` / `NavigationMobile.tsx`), and **`ProductHeroV2` / `ProductHeroMobileV2`** with `HeroBadges` on `/conka-flow`.

### Lineage: premium → clinical → Simple DTC

| Stage | What it was | Why we left it |
|-------|-------------|----------------|
| **Premium** ("Soft-Tech Luxury") | Bone canvas, Poppins, neuro-blue gradients, centred headers, 40px pills. `premium-base.css` (deleted). | Over-styled, generic-luxury, gradient-heavy. |
| **Clinical** (§8) | Zero radius, mono/uppercase micro-labels, hairline borders, navy interactive-only, no shadows, spec-sheet density. | Powerful for evidence, but too austere and busy for acquisition — reads lab-report, not consumer brand. Kept for the surfaces where data density earns it. |
| **Simple DTC** (this section) | Rounded pills/cards, filled navy as primary/decorative, one green savings accent, light-navy tint strips, soft shadows/rings, sans by default, mono reserved for true scanned data. | The current direction. Cleaner, warmer, higher-converting on paid social. |

### What Simple DTC keeps vs drops (relative to Clinical §8)

**Keeps:**
- Left-alignment by default (no centred headers).
- Hairline borders where a divider genuinely helps (`border-black/8`–`/15`).
- Tokenised spacing and the page-orchestrates / component-content-only architecture (§6).
- Tight heading tracking via inline `letterSpacing: "-0.02em"` on `brand-h1`/`h2`.
- Solid-black type as the default; opacity tiers only for genuinely secondary text.

**Drops:**
- **Zero radius.** Simple DTC is rounded — `rounded-full` for pills/buttons/nav, `rounded-lg`/`rounded-xl`/`rounded-2xl` for cards and tiles.
- **Navy as interactive-only.** Filled navy `#1B2757` is now allowed as a **primary and decorative** fill (badges, gradient cards, icon/star fills), not just on interactive elements.
- **The no-shadow / no-gradient rule.** Soft shadows and `ring-1` are permitted on lifted cards; soft navy-terminating gradients are permitted on decorative surfaces.
- **The faded mono eyebrow.** Drop the `font-mono … uppercase tracking-[0.18em+]` low-opacity eyebrow / sub-line. Lead with a plain `brand-h1` + `brand-body` in solid black. Mono is **not** banned outright: it survives on compact micro-labels (time-of-day badges, "verified buyer" tags) as **solid black/near-solid**, small (`text-[9px]`), at `tracking-[0.12em]` — a scalpel, not a blanket.
- **The grey text ramp as default.** Prefer solid `text-black`; reserve `text-black/50`–`/70` for secondary/disabled/strikethrough only.

### The grammar (concrete values, from the shipped surfaces)

| Element | Value | Where |
|---------|-------|-------|
| Pills / buttons / nav | `rounded-full` | Shop pill, cart button, discount/savings pills |
| Cards / tiles | `rounded-lg` → `rounded-2xl` | Cart line, app-gift card, product tiles |
| Primary navy | `#1B2757` — filled (`bg-[#1B2757] text-white`) | Shop pill, active cart button, upsell CTA, "Free!" badge |
| Decorative navy | `#1B2757` fill / icon fill / gradient | `CartAppGift` "Free!" badge, hero rating stars, mobile social-proof gradient card |
| Savings / positive | green `#1a7f4f` at `/10` tint bg + solid text | savings %, "+N free" badge, cart Savings row, guarantee tick (`--brand-positive`) |
| Light-navy tint strip | `#eef0f5` (also `#eef1f8`, `#dbe0f0`→`#eef1f8` gradient) | free-shipping banner, app-gift container, hero SpecBadge |
| Shadows / rings | soft `shadow-[0_2px_12px_rgba(0,0,0,0.08)]`, `ring-1 ring-black/5` | lifted product cards |
| Hairlines | `border-black/8`–`/15` | list dividers, nav header, content tiles |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-[#1B2757]` | all interactive nav elements |
| Type | solid `text-black`, sans (`--font-brand-primary`) | headings, body, most labels |
| Mono (scalpel) | `font-mono text-[9px] uppercase tracking-[0.12em]`, solid black | time-of-day + verified-buyer micro-badges only |

Prefer the `--brand-positive` token over the hard-coded `#1a7f4f` on new work; navy is still hard-coded as `#1B2757` at consumer sites (a Layer-1 navy token and a component sweep are deferred — see the plan doc).

### `ConkaCTAButton` mono meta line — clinical holdover, to retire

`ConkaCTAButton`'s `meta` prop renders a mono-uppercase second line — a clinical tell. On Simple DTC surfaces, **pass `meta={null}`** so the button is a clean rounded CTA with no mono sub-line. The component's mono meta styling is a to-be-simplified holdover; it is documented here as deprecated for DTC surfaces (no component change was made in the formalization ticket, SCRUM-1172).

### Per-surface authority

Simple DTC is added **alongside** Clinical (§8) and App-Dark (§10), not as a global replacement. Default split (adjust as surfaces convert):

| Surface group | Language |
|---------------|----------|
| Cart / nav; home; PDP acquisition (`/conka-flow`, `/conka-clarity`); landing / funnel / `/go`; top-of-funnel `/professionals` | **Simple DTC** |
| Science / evidence-dense modules (`/science`) | **Clinical** (§8) — mono + density earn their place on dense data |
| `/app`, `/app-insights` dark pages | **App-Dark** (§10) — clinical grammar on a dark canvas |
| Account, subscription management, B2B order/management UIs | Clinical for now (mono data labels aid scanning); convert opportunistically |

### Programme + learnings

Simple DTC is being rolled out iteratively (define → seed tokens → sweep components). The rules above are the definition; the running **learnings log** (soft-card recipe, shared `DotIndicator` / `SegmentedToggle` primitives, the `mix-blend-multiply` cutout trick, native `<details>` accordions, etc.) and the phase plan live in `docs/development/featurePlans/simple-dtc-design-language.md`. Read it before a component conversion.

---

## 9. Landing Page Visual System

> Evidence-based decisions applied to `/start` and to be extended to other pages.

### Background palette

Two backgrounds only: white and one tint.

| Token | Hex | Lightness | Role |
|-------|-----|-----------|------|
| `--brand-white` | `#ffffff` | 100% | Default canvas (~55-60% of sections) |
| `--brand-tint` | `#f4f5f8` | ~96% | Soft zone break (~40% of sections) |

Why one tint: analysis of 4 high-converting D2C supplement landing pages (Headstrong, Ovrload, AG1, Magic Mind) shows all use a single near-white tint in the 94-97% range. At this level you register "different zone" without the section feeling coloured (Weber-Fechner law). Multiple tints force the eye to re-orient; one tint creates rhythm.

### Section cadence

| # | Section | Background | Reason |
|---|---------|-----------|--------|
| 1 | Hero | white | Clean entry, product image provides visual weight |
| 2 | Benefits + trust | tint | Accent CTA on tinted bg feels branded |
| 3 | Product split | white | Breathing room |
| 4 | Value comparison | tint | Natural follow-on from product reveal |
| 5 | Ingredients | white | Signals shift to detail |
| 6 | Testimonials | tint | White testimonial cards pop against tint |
| 7 | Guarantee + app | white | Risk-reversal on clean canvas |
| 8 | Case Studies | tint | Data cards self-distinguish |
| 9 | FAQ | white | Clean, low-friction |
| 10 | Disclaimer | tint | Quiet sign-off |

(Colour rhythm rule — never two identical backgrounds adjacent — applies; see section 6.)

### Accent colour `#4058bb`

| Where | How |
|-------|-----|
| Primary CTAs | Accent bg + white text — the main interactive signal |
| Benefits icon circles | ~8% opacity bg, accent icon stroke |
| Trust badge icons | ~60% opacity |
| Nowhere else | Keeps the signal clean |

### Text colour tiers (landing pages)

Same 4-tier system as section 3: Primary 100% / Secondary 80% / Tertiary 60% / Muted 40%.

### CSS class responsibility split

| CSS classes own | Tailwind utilities own |
|----------------|----------------------|
| Typography (font, size, weight, tracking, line-height) | Layout (margins, padding, gaps, alignment) |
| Section wrapper (padding, gutters) | Colour and opacity |
| Track (max-width, centering) | Responsive overrides |

---

## 10. App Dark Aesthetic

> The dark-canvas pages: `/app` and `/app-insights`. Both apply the clinical grammar from section 8 (zero radii, hairline borders, mono labels, no shadows, no gradients) over a near-black background with a sparse SVG dot grid. Components used only on these pages can apply these styles directly without further design-system justification.

### Scope

Both pages apply `.brand-clinical` for zero radii and navy CTAs, then layer dark surfaces using white-opacity Tailwind utilities applied directly in components. There is no `.brand-app-dark` scope class; the dark theme is `brand-clinical` + a dark background.

The page-shell pattern, verbatim from `app/page.tsx` and `app-insights/page.tsx`:

```tsx
<div
  className="brand-clinical min-h-screen text-white flex flex-col"
  style={{
    backgroundColor: "#0a0a0a",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='11' width='2' height='2' fill='rgba(255%2C255%2C255%2C0.18)'/%3E%3C/svg%3E\")",
    backgroundSize: "24px 24px",
  }}
>
  {/* page sections */}
</div>
```

### White/opacity ramp

Surfaces, borders, and text on the dark canvas span a continuous ramp rather than a fixed palette. Reach for the most-used stops first; fall back to other levels only when an intermediate hierarchy step is genuinely needed.

**Most-used stops (start here):**

| Utility | Use |
|---------|-----|
| `bg-white/10` | Default card / tile surface |
| `bg-white/[0.06]` | Quieter card surface (sub-cards, ghost surfaces) |
| `bg-white/[0.04]` | Faintest surface (background panels under cards) |
| `border-white/12` | Default hairline border |
| `border-white/15` | Slightly stronger hairline (callouts, primary cards) |
| `border-white/10` | Sub-divider inside a card (header-row underline, footer-row top) |
| `text-white` | Primary text, active state, large stat values |
| `text-white/85` | Body copy inside cards (slightly lifted) |
| `text-white/70` | Counter labels, secondary headings |
| `text-white/55` | Standard body copy on the page canvas |
| `text-white/40` | Eyebrow / label text |
| `text-white/35` | Very muted (footnotes, tags, sources) |

**Interactive surfaces:**

| Utility | Use |
|---------|-----|
| `bg-white text-black` | Primary CTA fill (and active filter pill) |
| `bg-transparent border-white/30 text-white` | Secondary CTA (outline) |
| `bg-white/[0.07]` | Inactive tab / ghost surface |
| `bg-white/[0.10]` hover from `[0.06]` | Card-as-button hover state |

**Full ramp in use** across both pages: surfaces `0.03–0.15`, borders `10–60`, text `25–100` — but stay on the most-used stops above unless an intermediate tier is genuinely needed.

**Discipline:** stay on multiples of 5 for opacity values (`text-white/40`, `text-white/55`, etc.) so the ramp stays predictable. Reach for arbitrary `[0.0X]` only when a hairline-thin surface tier is genuinely needed (e.g. layered ghost panels). Don't introduce new stops without a visual reason — pick the nearest existing tier first.

### Card pattern

```tsx
<div className="bg-white/10 border border-white/12 p-5 lg:p-6">
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">Label</p>
  <h4 className="brand-h4 text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Heading</h4>
  <p className="text-sm text-white/55 leading-relaxed">Body copy.</p>
</div>
```

### SVG dot grid

`/app` and `/app-insights` both use the same dot pattern: **2×2px white squares at 24px pitch, `rgba(255,255,255,0.18)` fill**, applied via inline `backgroundImage` on the page-shell `<div>` (see snippet above). Do not introduce a second variant.

### Variants (brief)

- **Hero feature tabs / sticky scroll tabs** — Active: `bg-white text-black border-white`. Inactive: `bg-white/[0.07] border-white/30 text-white/70 hover:bg-white/[0.12] hover:border-white/50 hover:text-white/90`. `min-h-[44px]` tap target. In `AppStickyPhoneBlock` the phone asset frame gets `bg-white/[0.06]` for a subtle lift.
- **Spec strip / scores grid (dark)** — dark mirror of the light spec strip: outer `bg-white/10 border border-white/12`; header row `border-b border-white/10 px-4 py-2.5` with `text-white/50`/`text-white/70` mono labels; then `grid grid-cols-3 gap-0` cells `p-5 lg:p-6 border-r border-white/10` — label `font-mono text-[9px] uppercase tracking-[0.18em] text-white/40`, value `font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white`, note `font-mono text-[9px] text-white/50`.

### App Dark "Do not" list

- Use pure `#000000` as the background — use `#0a0a0a` (softer on the eye)
- Hardcode white hex values — use white/opacity utilities (`text-white/55`, `border-white/12`, etc.)
- Invent new opacity stops outside multiples of 5 without a visual reason — pick the nearest existing tier first
- Apply `lab-clip-tr` chamfer to cards — reserved for interactive CTAs only
- Centre-align body copy — left-align everything
- Add a third dot-grid variant — both pages already use the same 2×2px / 24px / 18% pattern; reuse it

---

## 11. Migration from legacy (complete)

> The premium → brand migration is **done**. `app/premium-base.css` has been deleted and no `premium-*` class or `--premium-radius-*` token exists in the codebase anymore. This section is kept only as a decoder ring for anyone reading an old branch, PR, or changelog. Do not treat any `premium-*` reference as current.

### What changed

| Area | Old (`premium-base.css`, deleted) | Now (`brand-base.css`) |
|------|-----------------------------------|------------------------|
| Primary font | Poppins | Neue Haas Grotesk |
| Data font | IBM Plex Mono | JetBrains Mono |
| Card radius | 40px | 32px (0px clinical) |
| Button radius | 9999px (pill) | 16px (0px clinical) |
| Container radius | 20px | 24px (0px clinical) |
| Primary bg | Bone `#F9F9F9` | Pure White `#FFFFFF` |
| Primary text | Ink `#111111` | Deep Black `#000000` |
| Accent | Neuro blue gradient | Single `#4058BB` (clinical: `#1B2757`) |
| Header alignment | Centred | Left-aligned |

### Class mapping (historical)

| Old class (deleted) | Current class |
|-------------|-----------|
| `.premium-section-luxury` | `.brand-section` |
| `.premium-track` | `.brand-track` |
| `.premium-bg-ink` | `.brand-bg-black` |
| `.premium-bg-bone` | `.brand-bg-white` |
| `.premium-bg-surface` / `.premium-bg-mid` | `.brand-bg-tint` |
| `.premium-section-heading` | `.brand-h2` |
| `.premium-section-subtitle` / `.premium-body` | `.brand-body` |
| `.premium-body-sm` | `.brand-caption` |
| `.premium-data` | `.brand-data` |
| `.premium-header-group` | Remove — left-align content instead |

---

## 12. Checklist for new sections

Before shipping any new section:

- [ ] Section wrapper: `<section className="brand-section brand-bg-{white|tint|black}" aria-label="...">`
- [ ] Track: `<div className="brand-track">` wrapping the component
- [ ] No custom spacing: brand tokens only — no ad-hoc `max-w-*` or `px-*` at component root
- [ ] Radius: one of the three tiers (16/24/32px) — or 0 in clinical/app-dark scope
- [ ] Typography: correct class, left-aligned
- [ ] Colour functional: accent blue only for CTAs/data highlights
- [ ] Mobile review at 390px before desktop
- [ ] One idea per viewport on mobile
- [ ] Can it be understood in under 3 seconds on a phone?
- [ ] Clinical pages: eyebrow + heading with topic code (sub-line optional — add only if it earns its place)
- [ ] App Dark pages: white/opacity utilities from the ramp above

---

## 13. Related docs

| Doc | Topic |
|-----|-------|
| `BRAND_VOICE.md` | Copy rules, proof assets, claims compliance |
| `QUALITY_STANDARDS.md` | Quality bar, reference sites, mobile mandate |
| `MOBILE_OPTIMIZATION.md` | Mobile component patterns, split architecture |
| `app/brand-base.css` | Token implementation (all layers) |
| `docs/development/featurePlans/simple-dtc-design-language.md` | Simple DTC programme — rules, learnings log, phases |
| `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` | Active site strategy |
