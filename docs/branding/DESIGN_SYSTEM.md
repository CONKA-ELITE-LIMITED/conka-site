# CONKA Design System

> Single source of truth for all visual design decisions.
> Token implementation: `app/brand-base.css` (layers 1-4 in one file).
> `app/premium-base.css` is now a stub — all legacy classes live in brand-base.css Layer 4.

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

---

## 2. Typography

### Font stack

| Role | Font | Variable | Notes |
|------|------|----------|-------|
| **Primary** (headings + body) | Neue Haas Grotesk Display | `--font-brand-primary` | `next/font/local` from `app/fonts/`. Weights: 400, 500, 700. |
| **Data** (metrics, labels, mono) | JetBrains Mono | `--font-brand-data` | `next/font/local` from `app/fonts/`. Weights: 400, 500. |

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

The Clinical scope (`.brand-clinical`) overrides all three to `0px`. App Dark (`/app`) also uses zero radius.

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

**Page owns:**
- `<section>` wrapper with `brand-section` (or `premium-section-luxury` on legacy pages)
- Background class
- Track wrapper (`brand-track`) for content alignment
- `aria-label` for accessibility

**Component owns:**
- Content only — no `<section>`, no root `max-w-*`, no `px-*`
- Internal layout (grids, stacks, gaps)
- Card/surface styling using brand tokens
- Typography — sets text colour explicitly when surface differs from section background

### Structure

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
> Active pages: `/` `/start` `/funnel` `/science` `/our-story` `/case-studies` `/ingredients` `/app` `/why-conka` `/conka-flow` `/conka-clarity` `/protocol/[id]` + Navigation + Footer

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

**`.lab-clip-tr`** — top-right 12px chamfer. Apply to primary CTAs, nav buttons, tags only. Never on cards, asset frames, or non-interactive surfaces.

**`.lab-asset-frame`** — double-border `box-shadow` stack for imagery and data surfaces.

**`@keyframes lab-blink`** — terminal cursor blink. `style={{ animation: "lab-blink 1s step-end infinite" }}`.

**Smaller overlay chamfer (10px)** — for badge overlays inside images. Inline: `[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]`

### Standard patterns

**Trio header (every section opens with one)**

Three elements, three distinct roles:

| Element | Role | Format | CSS class |
|---------|------|--------|-----------|
| Eyebrow | Identifies the topic | `// <short concept> · <TOPIC-0X>` | `.brand-eyebrow` |
| Heading | Bold positioning statement | Single black. No accent spans. `letterSpacing: "-0.02em"` inline. | `brand-h1/h2/h3` |
| Sub-line | Clarifier, proof, or scale | Mono, middle-dot separated, max 10 words | `.brand-mono-sub` |

```tsx
<p className="brand-eyebrow mb-3">{"// Short concept · TOPIC-0X"}</p>
<h2 className="brand-h2 mb-2 text-black" style={{ letterSpacing: "-0.02em" }}>
  Section heading, single black.
</h2>
<p className="brand-mono-sub">Clarifier · Proof · Scale</p>
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

**Card header row (labelled counter + right-aligned identity)**
```tsx
<div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">P-01 · Pillar 01 / 05</span>
  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">CONKA Flow</span>
</div>
```

**Segmented tabs**
Zero-radius 2-col grid. Active: `bg-black text-white`. Inactive: `bg-white`. `min-h-[44px]` tap target.

**Em-dash bullets (replace `•`)**
```tsx
<li className="flex items-start gap-2">
  <span className="font-mono text-black/30 shrink-0">—</span>
  <span>{item}</span>
</li>
```

**Spec strip (3-col dashboard stats)**
```tsx
<div className="grid grid-cols-3 gap-0 border border-black/12 bg-white">
  <div className="p-4 border-r border-black/8">
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">Studies</p>
    <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">32</p>
  </div>
</div>
```

**Evidence grid (nested hairlines)**
Outer `border border-black/12`, inner cells `border-r border-black/8` / `border-b border-black/8`, no gaps. Responsive: 2-col mobile, 4-col desktop.

**Icon tile (card signifier)**
```tsx
<div className="w-11 h-11 flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: "#1B2757" }}>
  <svg width="22" height="22" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
</div>
```

**Hairline data table (numbered rows)**
```tsx
<div className="bg-white border border-black/12">
  {items.map((item, idx) => (
    <div key={item.name} className={`flex items-baseline justify-between gap-4 px-4 py-3 ${idx < items.length - 1 ? "border-b border-black/8" : ""}`}>
      <span className="font-mono text-[10px] text-black/35 tabular-nums flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
      <div>
        <p className="text-sm font-semibold text-black">{item.name}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-0.5">{item.role}</p>
      </div>
    </div>
  ))}
</div>
```

**Formula / variant tag**
```tsx
<span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/6 border border-[#1B2757]/20 px-2 py-0.5 tabular-nums">F01</span>
```

**Quote block**
```tsx
<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-6">// Research Philosophy · Doc-RP-001</p>
<div className="border-l-2 border-[#1B2757] pl-5 lg:pl-6">
  <p className="text-3xl lg:text-4xl text-black leading-tight" style={{ letterSpacing: "-0.02em" }}>{quote}</p>
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 tabular-nums mt-5">— {author} · Durham, 2023</p>
</div>
```

**PubMed / citation link**
```tsx
<a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`} target="_blank" rel="noopener noreferrer"
   className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums">
  PMID {pmid} ↗
</a>
```

**Closing CTA card**
```tsx
<div className="bg-white border border-black/12 p-5 lg:p-8">
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">Recommended start · Balance protocol</p>
  <h3 className="brand-h3 text-black mb-3" style={{ letterSpacing: "-0.02em" }}>Put the science to work.</h3>
  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">100-Day money-back guarantee · Free UK shipping · Cancel anytime</p>
  <ConkaCTAButton href="/protocol/3" meta="// balance protocol · 14 shots · 7-day cadence">Try CONKA now</ConkaCTAButton>
</div>
```

**Figure plates** — use the `FigurePlate` component (`app/components/FigurePlate.tsx`). Lifestyle and portrait imagery only; never on product renders. Number sequentially across the page (`Fig. 01`, `Fig. 02`, ...).

### Clinical typography rules

- **Eyebrow:** `.brand-eyebrow` — do not write the Tailwind string by hand
- **Mono sub:** `.brand-mono-sub` — do not write the Tailwind string by hand
- **Row counter / spec label:** `font-mono text-[9px]–[11px] uppercase tracking-[0.18em] tabular-nums`, opacity `text-black/35–60`
- **Body paragraph inside a clinical card:** `text-sm md:text-base text-black/70–/75 leading-relaxed`. Never full-opacity `brand-body` in clinical surfaces.
- Canonical separator: middle-dot `·` (U+00B7). Not `|`, not `—`.
- Every section eyebrow opens with `//`. Format: `// <short concept> · <TOPIC-0X>`.
- Headings get `letterSpacing: "-0.02em"` inline (stock classes don't tighten enough for clinical).
- Headings are single `text-black`. No accent spans, no navy fills, no gradient text. Navy `#1B2757` is interactive-only.
- Any number that can change: `tabular-nums`. Units, labels, percentages, PMIDs: `font-mono`.

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

`app/components/landing/ConkaCTAButton.tsx`. Standard CTA for every clinical surface. Do not hand-roll.

Props: `children` (label), `href` (defaults to `FUNNEL_URL`), `meta` (second row).

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

**Rule:** never place two identical backgrounds adjacent.

### Accent colour `#4058bb`

| Where | How |
|-------|-----|
| Primary CTAs | Accent bg + white text — the main interactive signal |
| Benefits icon circles | ~8% opacity bg, accent icon stroke |
| Trust badge icons | ~60% opacity |
| Nowhere else | Keeps the signal clean |

### Text colour tiers (landing pages)

Same 4-tier system as section 3 above: Primary 100% / Secondary 80% / Tertiary 60% / Muted 40%.

### CSS class responsibility split

| CSS classes own | Tailwind utilities own |
|----------------|----------------------|
| Typography (font, size, weight, tracking, line-height) | Layout (margins, padding, gaps, alignment) |
| Section wrapper (padding, gutters) | Colour and opacity |
| Track (max-width, centering) | Responsive overrides |

---

## 10. App Dark Aesthetic

> The `/app` page aesthetic. Only applies to the `/app` route. Components used only on `/app` can apply these styles directly without design-system justification.

### Scope

The page root uses `bg-[#0a0a0a]` (slightly softer than pure black) with the `.app-dot-grid` utility from `brand-base.css` for the SVG dot grid background.

```tsx
<div className="brand-app-dark bg-[#0a0a0a] app-dot-grid min-h-screen">
  {/* page sections */}
</div>
```

No `brand-clinical` override needed on `/app` — the white-opacity palette is applied directly via Tailwind utilities.

### White/opacity palette

All surfaces and text use white at fixed opacity levels. These are Tailwind utilities applied directly in components.

| Utility | Use |
|---------|-----|
| `bg-white/10` | Card/tile surface |
| `border-white/12` | Card border (hairline) |
| `bg-white/[0.07]` | Inactive tab / ghost surface |
| `text-white/55` | Body copy |
| `text-white/40` | Eyebrow / label text |
| `text-white/35` | Very muted (footnotes, tags) |
| `text-white` | Primary text, active state |
| `bg-white text-black` | Primary CTA fill |
| `bg-transparent border-white/30 text-white` | Secondary CTA (outline) |

### Card pattern

```tsx
<div className="bg-white/10 border border-white/12 p-5 lg:p-6">
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">Label</p>
  <h4 className="brand-h4 text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Heading</h4>
  <p className="text-sm text-white/55 leading-relaxed">Body copy.</p>
</div>
```

### Tab pattern (hero feature tabs)

Active: `bg-white text-black border-white`
Inactive: `bg-white/[0.07] border-white/30 text-white/70 hover:bg-white/[0.12] hover:border-white/50 hover:text-white/90`

Minimum height: `min-h-[44px]` (tap target).

### Spec strip / scores grid (dark variant)

```tsx
<div className="bg-white/10 border border-white/12">
  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums">Fig. 08 · Label</p>
    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 tabular-nums">Results</p>
  </div>
  <div className="grid grid-cols-3 gap-0">
    <div className="p-5 lg:p-6 border-r border-white/10">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">Label</p>
      <p className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white mt-3 leading-none">Value</p>
      <p className="font-mono text-[9px] text-white/50 mt-3 tabular-nums">Note</p>
    </div>
  </div>
</div>
```

### Sticky scroll tabs (AppStickyPhoneBlock)

Same active/inactive pattern as hero tabs. Phone asset frame gets `bg-white/[0.06]` for a subtle lift.

### SVG dot grid

Defined as `.app-dot-grid` in `brand-base.css` (Layer 2.5). 1px white dots at 20px pitch, `rgba(255,255,255,0.07)` fill. Apply to the page root div alongside `bg-[#0a0a0a]`.

### App Dark "Do not" list

- Use pure `#000000` as the background — use `#0a0a0a` (softer on the eye)
- Hardcode white hex values — use white/opacity utilities
- Use opacity values between the fixed palette levels — pick the nearest tier
- Apply `lab-clip-tr` chamfer to cards — reserved for interactive CTAs only
- Centre-align body copy — left-align everything

---

## 11. Migration from legacy

### What changes

| Area | Legacy (`premium-base.css` / Layer 4) | New (`brand-base.css` Layer 1-2) |
|------|---------------------------------------|----------------------------------|
| Primary font | Poppins | Neue Haas Grotesk |
| Data font | IBM Plex Mono | JetBrains Mono |
| Card radius | 40px | 32px (0px clinical) |
| Button radius | 9999px (pill) | 16px (0px clinical) |
| Container radius | 20px | 24px (0px clinical) |
| Primary bg | Bone `#F9F9F9` | Pure White `#FFFFFF` |
| Primary text | Ink `#111111` | Deep Black `#000000` |
| Accent | Neuro blue gradient | Single `#4058BB` (clinical: `#1B2757`) |
| Header alignment | Centred | Left-aligned |

### Class mapping

| Legacy class | New class |
|-------------|-----------|
| `.premium-section-luxury` | `.brand-section` |
| `.premium-track` | `.brand-track` |
| `.premium-bg-ink` | `.brand-bg-black` |
| `.premium-bg-bone` | `.brand-bg-white` |
| `.premium-bg-surface` | `.brand-bg-neutral` |
| `.premium-bg-mid` | `.brand-bg-neutral` |
| `.premium-section-heading` | `.brand-h2` |
| `.premium-section-subtitle` | `.brand-body` |
| `.premium-body` | `.brand-body` |
| `.premium-body-sm` | `.brand-caption` |
| `.premium-data` | `.brand-data` |
| `.premium-header-group` | Remove — left-align content instead |

### How to migrate a page

1. Replace `premium-section-luxury` with `brand-section` and `premium-track` with `brand-track`
2. Update section backgrounds per the class mapping
3. Update typography classes
4. Left-align all headers (remove `text-center` from header groups)
5. Add `.brand-clinical` to the page root to get zero radius + navy accent

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
- [ ] Clinical pages: trio header (eyebrow + heading + sub-line) with topic code
- [ ] App Dark pages: white/opacity utilities from the fixed palette above

---

## 13. Related docs

| Doc | Topic |
|-----|-------|
| `BRAND_VOICE.md` | Copy rules, proof assets, claims compliance |
| `QUALITY_STANDARDS.md` | Quality bar, reference sites, mobile mandate |
| `MOBILE_OPTIMIZATION.md` | Mobile component patterns, split architecture |
| `app/brand-base.css` | Token implementation (all layers) |
| `app/premium-base.css` | Stub only — classes now in brand-base.css Layer 4 |
| `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` | Active site strategy |
