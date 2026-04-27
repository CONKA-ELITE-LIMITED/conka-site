# CONKA Design System

> **Single source of truth** for visual design decisions. This document defines **what** the system is and **why** each rule exists. Implementation tokens live in [`app/brand-base.css`](../../app/brand-base.css).
>
> **Migration note:** This system replaces the legacy "Soft-Tech Luxury" system (`premium-base.css`). Existing pages continue to use `premium-base.css` until migrated. New pages and refactored pages should use `brand-base.css`. See [Migration from legacy](#migration-from-legacy) below.

> ### Acquisition and content pages use the Clinical Aesthetic
>
> **Active spec for every acquisition / content surface:** [`CLINICAL_AESTHETIC.md`](./CLINICAL_AESTHETIC.md). All pages listed below opt into it via `.brand-clinical` on the page root, which overrides tokens to zero radius and navy `#1B2757`, and layers on spec-sheet grammar (hairline frames, mono eyebrows, topic codes, figure plates).
>
> `/` · `/start` · `/funnel` · `/science` · `/our-story` · `/case-studies` · `/ingredients` · `/app` · `/why-conka` · `/conka-flow` · `/conka-clarity` · `/protocol/[id]` · Navigation · Footer
>
> **Key overrides the base system below does NOT describe:**
> - Zero radius everywhere (tokens become `0`)
> - Navy `#1B2757` is **interactive-only** (never used on headings, data points, or decoration — differs from base accent rules)
> - No gradients (base allows subtle accent gradient; clinical forbids it)
> - Single black headings; no accent spans
> - Section eyebrows open with `// <concept> · <TOPIC-0X>` and follow the global topic-code catalog
> - Left-aligned only (matches base, but enforced strictly)
>
> The base system documented below still governs **non-clinical surfaces** only: the B2B portal, account portal, and any legacy pages not yet migrated. For every new acquisition or content page, read `CLINICAL_AESTHETIC.md` first.

---

## 1. Principles

1. **Monochrome canvas first.** Most pages should feel black-and-white before any accent is applied. Colour is functional, not decorative.
2. **Minimal, scientific, slightly organic.** Never overdesigned. Every element earns its place.
3. **One system, not per-page decisions.** Layout, spacing, radius, and typography are fixed constraints — new content drops in without ad-hoc styling.
4. **Left-aligned by default.** All copy defaults to left alignment for clarity, consistency, and editorial feel. Centre alignment is avoided. Right alignment only when it serves a clear layout purpose.

---

## 2. Typography

### Font stack

| Role | Font | Fallback | Notes |
|------|------|----------|-------|
| **Primary** (headings + body) | Neue Haas Grotesk Display | `var(--font-brand-primary)` with system sans-serif fallback | Loaded via `next/font/local` from `app/fonts/`. Weights: Regular (400), Medium (500), Bold (700). |
| **Data** (metrics, labels, code) | JetBrains Mono | `var(--font-brand-data)` with monospace fallback | Loaded via `next/font/local` from `app/fonts/`. Weights: Regular (400), Medium (500). |

### Type scale

| Role | Class | Font | Weight | Size | Line height | Letter spacing |
|------|-------|------|--------|------|-------------|----------------|
| **H1 (Hero)** | `.brand-h1` | Primary | Medium (500) / Bold (700) | `clamp(2.25rem, 6vw, 3.5rem)` | 110% | -2% (-0.02em) |
| **H2 (Section)** | `.brand-h2` | Primary | Medium (500) | `clamp(1.75rem, 4vw, 2.5rem)` | 112.5% | -1% (-0.01em) |
| **H3 (Sub)** | `.brand-h3` | Primary | Regular (400) / Medium (500) | `clamp(1.25rem, 3vw, 1.75rem)` | 115% | 0 |
| **Body** | `.brand-body` | Primary | Regular (400) | `1rem` | 140% | 0 |
| **Caption** | `.brand-caption` | Primary | Regular (400) | `0.875rem` | 115% | 0 |
| **Data metric** | `.brand-data` | JetBrains Mono | Medium (500) | `inherit` (context-dependent) | native | 0 |
| **Data label** | `.brand-data-label` | JetBrains Mono | Regular (400) | `0.875rem` | native | 0 |

### Typography rules

- **Left-align everything** by default. No centred section headers.
- Body copy max-width: `65ch` (`--brand-body-max-width`) to maintain readability.
- Hero titles can use Bold (700); all other headings use Medium (500) or Regular (400).
- Data/metrics always use JetBrains Mono to visually distinguish numbers from prose.

### Heading spacing

`brand-h*` classes set typography only (font, size, weight, tracking, line-height). They include a default `margin-bottom` for convenience, but **components should override with `mb-0`** and control spacing via Tailwind.

**Standard heading block pattern:**

```jsx
<div className="mb-10">                           {/* 2.5rem gap to content below */}
  <h2 className="brand-h2 mb-0">Heading</h2>
  <p className="mt-2 text-black/60">Subtitle</p>  {/* tight to heading */}
</div>
```

- `mb-10` (2.5rem) from heading block to content — consistent across all sections.
- Subtitle sits at `mt-2` (0.5rem) below heading.
- CSS classes own typography; Tailwind owns layout spacing.

---

## 3. Colour palette

| Name | Variable | Hex | Role |
|------|----------|-----|------|
| **Pure White** | `--brand-white` | `#FFFFFF` | Primary background. Default canvas (~55-60% of sections). |
| **Tint** | `--brand-tint` | `#F4F5F8` | Soft zone break (~96% lightness, faint blue-grey). Signals content shift without colour. ~30-40% of sections. One tint only — no warm/cool variants. |
| **UI Neutral** | `--brand-neutral` | `#CCCCCA` | Dividers and borders only. **Not for section backgrounds** (too heavy at 80% lightness). |
| **Neuro Blue** | `--brand-accent` | `#4058BB` | Primary CTA button colour. Key highlights, important interactions. |
| **Deep Grey** | `--brand-deep-grey` | `#212121` | Slight contrast from black. Least used. |
| **Deep Black** | `--brand-black` | `#000000` | Primary text, footer. Authority and sharpness. |

### Colour strategy

- **Use colour functionally, not decoratively.** Most pages should feel monochrome first.
- Think of the page as a canvas — colour draws eyes to imagery and actions.
- Accent colour (`--brand-accent`) used to:
  - **Primary CTA buttons** (accent bg, white text) — the main interactive signal
  - Emphasise data points
  - One accent-wash section background per page (ties credibility content to brand)
- **Text on backgrounds:**
  - On white/warm/cool/accent-wash: Deep Black text with opacity tiers (see Text colour tiers below)
  - On black/dark sections: Pure White (`--brand-white`) text
  - On accent buttons: white text only (ensure contrast)

### Text colour tiers

4 fixed tiers. Pick the tier based on content role. No in-between values.

| Tier | Opacity | Tailwind class | Use for |
|------|---------|---------------|---------|
| **Primary** | 100% | `text-black` | Headings, card titles, key statements |
| **Secondary** | 80% | `text-black/80` | Body copy, descriptions, benefit text |
| **Tertiary** | 60% | `text-black/60` | Captions, subtitles, metadata, supporting detail |
| **Muted** | 40% | `text-black/40` | Legal footnotes, PMIDs, disclaimers |

**Rule:** If something doesn't clearly fit a tier, it goes in the tier above (more visible).

### Gradients

- Subtle, soft gradients only.
- Use for: background washes, product highlights.
- Should feel: warm, organic, almost imperceptible.
- **Avoid:** harsh gradients, neon/techy feel.
- Legacy gradient `--gradient-neuro-blue-accent` remains available for emphasis spans during migration.

---

## 4. Radius system

Three tiers, used consistently everywhere:

| Token | Value | Use |
|-------|-------|-----|
| `--brand-radius-interactive` | `16px` (1rem) | Buttons, input fields, pills, tags, small interactive elements |
| `--brand-radius-container` | `24px` (1.5rem) | Image containers, ingredient graphics, content blocks, nested surfaces |
| `--brand-radius-card` | `32px` (2rem) | Cards, major surface areas, bento cells, case study blocks |

### Radius rules

- **No other radius values.** Pick one of the three tiers.
- Full-pill (`9999px`) is retired except for dot indicators and tiny badges.
- Buttons use `--brand-radius-interactive` (16px), not pill shape.
- Nested elements inside cards use `--brand-radius-container` (24px).
- All three tiers apply on mobile too — do not shrink radii on small screens.

---

## 5. Spacing & layout

### Track system (unchanged from legacy)

The track/section model remains the same — this is about layout, not aesthetics:

| Token | Value | Purpose |
|-------|-------|---------|
| `--brand-max-width` | `1280px` | Content rail max-width |
| `--brand-gutter-mobile` | `1.25rem` | Horizontal padding on mobile |
| `--brand-gutter-desktop` | `5vw` | Horizontal padding on desktop |

### Section spacing (vertical rhythm)

| Token | Value | Purpose |
|-------|-------|---------|
| `--brand-section-padding` | `clamp(5rem, 10vh, 10rem)` | Section top/bottom padding (desktop) |
| `--brand-section-padding-mobile` | `5rem` | Section top/bottom padding (mobile) |
| `--brand-header-gap` | `3rem` | Gap between section heading and content |
| `--brand-text-gap` | `1.5rem` | Gap between heading and body text |

### Internal spacing scale

| Token | Value |
|-------|-------|
| `--brand-space-xs` | `0.25rem` (4px) |
| `--brand-space-s` | `0.5rem` (8px) |
| `--brand-space-m` | `1rem` (16px) |
| `--brand-space-l` | `1.5rem` (24px) |
| `--brand-space-xl` | `2rem` (32px) |
| `--brand-space-2xl` | `3rem` (48px) |

---

## 6. Graphics strategy

### Overall direction

Minimal. Scientific. Slightly organic. Never overdesigned.

### Graphic elements

**Use:**
- Lines (thin, subtle dividers)
- Grids
- Data blocks

**Avoid:**
- Illustrations (unless extremely minimal)
- Overly "wellness" visuals
- Decorative elements that don't serve communication

### Dividers and borders

- Dividers use `--brand-neutral` (#CCCCCA) or `rgba(0,0,0,0.06)` for very subtle separation.
- Borders are thin (1px) and only used when structural clarity requires them.
- Prefer whitespace over borders to separate content.

---

## 7. Section & component architecture

> This model is carried forward from the legacy system — it works well and doesn't change.

### The rule: page orchestrates, component is content-only

**Page owns:**
- `<section>` wrapper with `brand-section` class
- Background colour (via `brand-bg-white`, `brand-bg-black`, `brand-bg-neutral`)
- Track wrapper (`brand-track`) for content alignment
- `aria-label` for accessibility

**Component owns:**
- Content only — no `<section>`, no `max-w-*`, no `px-*` at root
- Internal layout (grids, stacks, gaps)
- Card/surface styling using brand radius and colour tokens
- Typography — sets text colour explicitly when surface differs from section background

### Structure

```
<section class="brand-section brand-bg-white">
  <div class="brand-track">
    <MyComponent />
  </div>
</section>
```

### Section backgrounds

| Class | Background | Default text | Use |
|-------|-----------|-------------|-----|
| `.brand-bg-white` | `--brand-white` (#FFFFFF) | `--brand-black` | Default canvas (~55-60%) |
| `.brand-bg-tint` | `--brand-tint` (#F4F5F8) | `--brand-black` | Soft zone breaks (~30-40%) |
| `.brand-bg-black` | `--brand-black` (#000000) | `--brand-white` | Available but use sparingly |
| `.brand-bg-neutral` | `--brand-neutral` (#CCCCCA) | `--brand-black` | **Legacy only.** Do not use for new pages. |
| `.brand-bg-deep-grey` | `--brand-deep-grey` (#212121) | `--brand-white` | Available but use sparingly |

### Colour rhythm

Pages follow a light-base rhythm with subtle tint shifts:

```
White (Hero)
  ↓
Tint (credibility / benefits)
  ↓
White (breathing room)
  ↓
Tint (detail/depth content)
  ↓
White (social proof)
  ↓
Tint (risk reversal / guarantee)
  ↓
White (content)
  ↓
White (FAQ)
  ↓
Tint (quiet sign-off / disclaimer)
```

**Rules:**
- White is the default — ~55-60% of sections.
- **Never place two identical backgrounds adjacent.** The tint is subtle enough (~96% lightness) that the eye registers a zone change without it feeling like a colour.
- **One tint only.** No warm/cool/accent-wash variants. Simplicity beats variety.
- Dark sections (black, deep-grey) are available but use sparingly (max 1 per page). Landing page uses none.
- Neuro Blue (`--brand-accent`) for CTA buttons, not as a section background.

---

## 8. Component rules

### Cards

```css
border-radius: var(--brand-radius-card);     /* 32px */
background: var(--brand-white);
border: none;                                 /* or 1px solid var(--brand-neutral) if needed */
padding: 2rem;                                /* or var(--brand-space-xl) */
```

### Buttons (CTAs)

```css
border-radius: var(--brand-radius-interactive);  /* 16px */
background: var(--brand-accent);
color: var(--brand-white);
padding: 0.75rem 1.5rem;
font-weight: 500;
```

- **Primary: accent fill (`--brand-accent`), white text** — the default for all conversion CTAs. Accent on buttons trains the eye that "this colour = action".
- Secondary: white fill, black border, black text
- Tertiary: black fill, white text (navigation, non-conversion actions)

### Image containers

```css
border-radius: var(--brand-radius-container);  /* 24px */
overflow: hidden;
```

### Data blocks

```css
font-family: var(--font-brand-data);           /* JetBrains Mono */
```

- Metric values: Medium weight, size contextual
- Labels: Regular weight, `0.875rem`

---

## 9. Mobile (74% of traffic)

Mobile-first is non-negotiable. Full mobile guide: [`MOBILE_OPTIMIZATION.md`](./MOBILE_OPTIMIZATION.md).

Key rules for the design system:

- Design at 390px first. Desktop is the adaptation.
- **Radii stay the same** on mobile (32px cards, 24px containers, 16px interactive).
- Section padding reduces: `--brand-section-padding-mobile` (5rem) instead of the desktop clamp.
- Gutters reduce: `--brand-gutter-mobile` (1.25rem).
- One idea per viewport. Scannable over readable.
- If mobile and desktop conflict, mobile wins.

---

## 10. Migration from legacy

### What changes

| Area | Legacy (`premium-base.css`) | New (`brand-base.css`) |
|------|---------------------------|----------------------|
| Primary font | Poppins | Neue Haas Grotesk (system fallback until licensed) |
| Data font | IBM Plex Mono | JetBrains Mono |
| Card radius | 40px | 32px |
| Button radius | 9999px (pill) | 16px |
| Container radius | 20px | 24px |
| Primary bg | Bone #F9F9F9 | Pure White #FFFFFF |
| Primary text | Ink #111111 | Deep Black #000000 |
| Accent | Neuro blue gradient system | Single #4058BB |
| Secondary bg | Surface #F4F6F5, Mid #D1D5D2 | UI Neutral #CCCCCA |
| Header alignment | Centred (`.premium-header-group`) | Left-aligned |

### What stays the same

- Track/section/component architecture
- Section padding scale (clamp system)
- Gutter values
- Max-width (1280px)
- Content-only component rule
- Mobile-first approach

### How to migrate a page

1. Replace `premium-base.css` class references with `brand-base.css` equivalents
2. Update section backgrounds: `premium-bg-bone` → `brand-bg-white`, `premium-bg-ink` → `brand-bg-black`
3. Update radius: `--premium-radius-card` → `--brand-radius-card`, etc.
4. Update typography classes: `.premium-section-heading` → `.brand-h2`, etc.
5. Left-align all headers (remove `text-center` from header groups)
6. Replace `.premium-section-luxury` → `.brand-section`
7. Replace `.premium-track` → `.brand-track`

### Class mapping

| Legacy class | New class |
|-------------|-----------|
| `.premium-section-luxury` | `.brand-section` |
| `.premium-track` | `.brand-track` |
| `.premium-bg-ink` | `.brand-bg-black` |
| `.premium-bg-bone` | `.brand-bg-white` |
| `.premium-bg-surface` | `.brand-bg-neutral` |
| `.premium-bg-mid` | `.brand-bg-neutral` |
| `.premium-card-soft` | Use `--brand-radius-card` + `--brand-white` directly |
| `.premium-section-heading` | `.brand-h2` |
| `.premium-section-subtitle` | `.brand-body` |
| `.premium-body` | `.brand-body` |
| `.premium-body-sm` | `.brand-caption` |
| `.premium-data` | `.brand-data` |
| `.premium-header-group` | Remove — left-align content instead |

---

## 11. Checklist for new sections

Before shipping any new section:

1. **Section wrapper:** `<section class="brand-section brand-bg-{white|tint|black}">` with `aria-label`
2. **Track:** `<div class="brand-track">` wrapping the component
3. **No custom spacing:** Use brand tokens only — no ad-hoc padding or max-widths
4. **Radius:** One of the three tiers (16/24/32px) — no other values
5. **Typography:** Correct class from the type scale, left-aligned
6. **Colour functional:** Accent blue only for CTAs/data highlights, not decoration
7. **Mobile review at 390px** before desktop
8. **One idea per viewport** on mobile
9. **Can it be understood in <3 seconds** on a phone?

---

## Related docs

- **How to write copy:** [`BRAND_VOICE.md`](./BRAND_VOICE.md)
- **Quality bar and reference sites:** [`QUALITY_STANDARDS.md`](./QUALITY_STANDARDS.md)
- **Mobile component patterns:** [`MOBILE_OPTIMIZATION.md`](./MOBILE_OPTIMIZATION.md)
- **Legacy system (until fully migrated):** [`SOFT_TECH_LUXURY_STYLE_SHEET_GUIDELINES.md`](./SOFT_TECH_LUXURY_STYLE_SHEET_GUIDELINES.md)
- **Implementation tokens:** [`app/brand-base.css`](../../app/brand-base.css)
- **Legacy tokens (still active):** [`app/premium-base.css`](../../app/premium-base.css)
