# CONKA Clinical Aesthetic

Reference for the acquisition aesthetic on `/start`, `/funnel`, and the home page. Apply to any surface that needs to match.

**Reference implementations:** `app/page.tsx` · `app/start/page.tsx` · `app/funnel/FunnelClient.tsx`

---

## Scope

Add `brand-clinical` to the page root. This overrides CSS variables for children only — nothing outside is affected.

```tsx
<div className="brand-clinical min-h-screen bg-white">{/* … */}</div>
```

### Token overrides (`.brand-clinical`)

| Token | Base | Clinical | Effect |
|-------|------|----------|--------|
| `--brand-radius-card` | 32px | `0` | Square cards |
| `--brand-radius-container` | 24px | `0` | Square containers |
| `--brand-radius-interactive` | 16px | `0` | Square buttons |
| `--brand-accent` | `#4058BB` | `#1B2757` | Darker navy |
| `--brand-tint` | `#f4f5f8` | `#f5f5f5` | Neutral grey |

All components using these tokens update automatically. No per-component overrides needed.

---

## Utilities (unscoped, from `app/brand-base.css`)

### `lab-clip-tr` — interactive signifier
Top-right 12px chamfer. **Primary CTAs, nav buttons, tags only.** Never apply to cards, asset frames, section containers, or any non-interactive surface — it reads as "you can click this".

### `lab-asset-frame` — spec-sheet treatment
Double-border `box-shadow` stack for imagery and data surfaces.

### `@keyframes lab-blink`
Terminal cursor blink. `style={{ animation: "lab-blink 1s step-end infinite" }}`.

### Smaller overlay chamfer (10px)
For badge overlays inside images (`MORNING`, `AFTERNOON`, `MOST POPULAR`). Inline:
```
[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]
```

---

## Standard patterns

### Trio header (every section opens with one)

Three elements, three distinct roles:

| Element | Role | Format |
|---------|------|--------|
| **Eyebrow** | Identifies the topic the section belongs to | `// <short concept> · <TOPIC-0X>`. Topic code mandatory; concept optional flavor. |
| **Heading** | The bold positioning statement | Single black. No accent spans. No gradients. No navy fills. `letterSpacing: "-0.02em"` inline. |
| **Sub-line** | What the heading cannot fit: clarifier, proof, or scale | Mono, middle-dot separated, ≤10 words. |

```tsx
<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
  {"// Short concept · TOPIC-0X"}
</p>
<h2 className="brand-h1 mb-2 text-black" style={{ letterSpacing: "-0.02em" }}>
  Section heading, single black.
</h2>
<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
  Clarifier · Proof · Scale
</p>
```

**JSX note:** wrap `// ...` as `{"// ..."}` to avoid `react/jsx-no-comment-textnodes`. Topic codes are always UPPERCASE with two-digit padding (`APP-01`, not `app-1`). See [Topic codes](#topic-codes) for the catalog.

### Data card
```
bg-white border border-black/12 p-5 lg:p-6
```
Hairline border, no shadow. Token enforces 0 radius.

### Card header row (number + category)
```tsx
<div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
  <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">01.</span>
  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">CATEGORY</span>
</div>
```

### Card header row (labelled counter + right-aligned identity)
Use when the counter needs a prefix (pillar, partner, researcher, principle). Right cell names the formula, affiliation, or dominant tag — it's navy (`text-[#1B2757]`) because it's the card's identity, not a divider.
```tsx
<div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
    P-01 · Pillar 01 / 05
  </span>
  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
    CONKA Flow
  </span>
</div>
```
Counter prefixes we're using: `P-` pillar · `U-` university partner · `R-` researcher · `F-` formula · `Fig.` figure plate. Keep them two digits with leading zeros.

### Spec strip (3-col stats inside `lab-asset-frame`)
Small mono label above a `tabular-nums` value; `border-r border-black/8` between cells. See `WhyConkaWorksDesktop`.

### Segmented tabs
Zero-radius 2-col grid. Active = `bg-black text-white`. Inactive = `bg-white`. `min-h-[44px]` tap target. Used for Subscribe/One-Time, filter toggles.

### Em-dash bullets (replace `•`)
```tsx
<li className="flex items-start gap-2">
  <span className="font-mono text-black/30 shrink-0">—</span>
  <span>{item}</span>
</li>
```

### Chamfer nav buttons (prev/next)
44×44 navy square with `lab-clip-tr`. Paired; navigation only. See `AthleteCredibilityCarousel#ChamferNav`.

### Figure plates (imagery overlay)
Any lifestyle, product, or portrait image inside a hairline frame gets at least one plate. Plates turn decorative imagery into spec-sheet imagery. Two-corner pattern: top-left = figure number + subject, bottom-right = metadata (location, score, partner, reading).

```tsx
<div className="relative aspect-[4/5] border border-black/12 bg-white overflow-hidden">
  <Image {...props} />
  {/* Optional gradient for overlay legibility when plates sit over busy areas */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" aria-hidden />
  <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
    Fig. 01 · Research Context
  </div>
  <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
    Durham · Cambridge
  </div>
</div>
```
Rules: `bg-black/55` (never fully opaque, never fully transparent). `px-2 py-1` only — plates are tight. Number plates sequentially across a page (`Fig. 01` … `Fig. 05`) so the page reads like a document. Omit the gradient when the plate sits over a naturally dark region.

### Hairline data table (numbered rows)
Use instead of chip/tag clouds when items have a consistent two-part shape (name + role, stat + label, partner + focus). Reads as catalogue, not card.
```tsx
<div className="bg-white border border-black/12">
  {items.map((item, idx) => (
    <div
      key={item.name}
      className={`flex items-baseline justify-between gap-4 px-4 py-3 ${
        idx < items.length - 1 ? "border-b border-black/8" : ""
      }`}
    >
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-mono text-[10px] text-black/35 tabular-nums flex-shrink-0">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black truncate">{item.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-0.5">
            {item.role}
          </p>
        </div>
      </div>
      {/* optional right-aligned mono badge */}
    </div>
  ))}
</div>
```
Pair with a header row (above) when the table is the body of a card. Standalone tables can skip the header row.

### Evidence grid (nested hairlines)
Multi-cell data surface for stats, study results, or comparison cells. Outer border + inner `border-r` / `border-b` dividers, not gaps. Responsive: 2-col mobile, 4-col desktop. See `PillarCard#keyStats`.
```
border border-black/12  →  each cell: p-3 lg:p-4 bg-white, !lastCol: border-r border-black/8, !lastRow: border-b border-black/8
```

### Spec strip (dashboard stat row)
Horizontal stats bar used under a trio header or inside a data card. 3-col (hero) or 4-col (evidence). Small mono label above an oversized `tabular-nums` value; `border-r border-black/8` between cells; outer hairline wrap.
```tsx
<div className="grid grid-cols-3 gap-0 border border-black/12 bg-white">
  <div className="p-4 border-r border-black/8">
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">Studies</p>
    <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">32</p>
  </div>
  {/* … */}
</div>
```
Mix value sizes in one strip if one cell holds a long identifier (patent number, SKU) — drop that cell to `text-sm` or `text-base` while others stay `text-2xl lg:text-4xl`. Keeps the grid balanced.

### Icon tile (card signifier)
Square navy tile, 44×44 (`w-11 h-11`), white stroke icon, placed flush-left inside a principle/pillar/card body. Not interactive, so no chamfer.
```tsx
<div className="w-11 h-11 flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: "#1B2757" }}>
  <svg width="22" height="22" {...} strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
</div>
```
Icon stroke weight: `1.75` with `strokeLinecap="square"` `strokeLinejoin="miter"`. Softer rounded strokes read as consumer — square caps match the spec-sheet grammar.

### Formula / variant tag
Inline badge that names which formula an item belongs to. Reserved for F01 / F02 / BOTH in scientific contexts. Navy-on-tinted-navy, hairline-boxed, mono.
```tsx
<span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/6 border border-[#1B2757]/20 px-2 py-0.5 tabular-nums">
  F01
</span>
```

### Quote block (research philosophy, manifesto)
Large text with a 2px navy left rule — not blockquotes, not oversized quotation marks. Eyebrow reads as a document code (`// Research Philosophy · Doc-RP-001`). Attribution uses an em-dash and separates location/date with `·`.
```tsx
<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-6">
  // Research Philosophy · Doc-RP-001
</p>
<div className="border-l-2 border-[#1B2757] pl-5 lg:pl-6">
  <p className="text-3xl lg:text-4xl text-black leading-tight" style={{ letterSpacing: "-0.02em" }}>
    {quote}
  </p>
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 tabular-nums mt-5">
    — {author} · Durham, 2023
  </p>
</div>
```

### PubMed / citation link
Every stat that can be cited should be. Navy mono, trailing `↗`, tabular.
```tsx
<a
  href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
  target="_blank"
  rel="noopener noreferrer"
  className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums"
>
  PMID {pmid} ↗
</a>
```

### Closing CTA card
Final section pattern across `/science`, `/case-studies`, `/our-story`: a hairline card containing eyebrow → heading → mono guarantee line → `ConkaCTAButton`. Always points at `/protocol/3` unless the page has a stronger product affinity.
```tsx
<div className="bg-white border border-black/12 p-5 lg:p-8">
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
    Recommended start · Balance protocol
  </p>
  <h3 className="brand-h3 text-black mb-3" style={{ letterSpacing: "-0.02em" }}>
    Put the science to work.
  </h3>
  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
    100-Day money-back guarantee · Free UK shipping · Cancel anytime
  </p>
  <ConkaCTAButton href="/protocol/3" meta="// balance protocol · 14 shots · 7-day cadence">
    Try CONKA now
  </ConkaCTAButton>
</div>
```

---

## Typography rules

- **Eyebrow:** `font-mono text-[10px] uppercase tracking-[0.2em] text-black/40`
- **Mono sub:** `font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums`
- **Row counter / spec label:** `font-mono text-[9px]–[11px] uppercase tracking-[0.18em] tabular-nums`, opacity `text-black/35–60`
- **Figure plate:** `font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums`
- **PMID / citation:** `font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] tabular-nums`, trailing `↗`
- **Body paragraph inside a clinical card:** `text-sm md:text-base text-black/70–/75 leading-relaxed`. Never use `brand-body` at full opacity in clinical surfaces — the type is too dense against the hairline frames.
- Any number that can change → `tabular-nums`
- Units, labels, percentages, PMIDs → `font-mono`
- Canonical separator is the middle-dot `·` (U+00B7). Not `|`, not `—`.
- Every section eyebrow opens with `//`. Format: `// <short concept> · <TOPIC-0X>`. Topic code mandatory; short concept optional. Wrap as `{"// ..."}` in JSX to avoid `react/jsx-no-comment-textnodes`. Longer-form "document code" eyebrows (`// Research Philosophy · Doc-RP-001`) remain valid where the context is a named document rather than a section.
- Headings get `letterSpacing: "-0.02em"` inline. The stock `brand-h1`/`brand-h2` classes don't tighten enough for clinical.
- Headings are single `text-black`. No accent spans, no navy fills, no gradient text. Navy `#1B2757` is interactive-only; headings are not interactive.

## Counter conventions

Counter format signals what you're counting. Keep zero-padded to 2 digits unless the total exceeds 99.

| Prefix | Use | Example |
|--------|-----|---------|
| `01` | Generic item index | Hairline table rows |
| `01.` | List item (trailing dot) | Sidebar case study rows |
| `01 / 05` | Position in a fixed set | Carousel counter, pillar position |
| `P-01` | Pillar | Science pillars |
| `F-01` / `F01` | Formula | Flow/Clear identification |
| `U-01` | University partner | Evidence summary |
| `R-01` | Researcher | Evidence summary |
| `Fig. 01` | Figure plate on imagery | Any hairline-framed asset |

Numbering is sequential across a page — `Fig. 01` through `Fig. 05` should read as one continuous document.

---

## Topic codes

Every section eyebrow ends with a topic code identifying its subject. Codes are **global**, not per-page — one canonical code per topic so the same subject reads the same wherever it appears across the site.

| Code | Topic |
|------|-------|
| `CONKA-00` | Core brand philosophy — purpose, mission, the fundamental "why CONKA exists" |
| `CONKA-01` | CONKA Flow (product) |
| `CONKA-02` | CONKA Clear (product) |
| `CONKA-03` | Both / Bundle / commercial conversion |
| `APP-01` | The companion app |
| `SCI-01` | How it works / mechanism |
| `SCI-02` | Deep science / research / clinical trials |
| `ING-01` | Ingredients / formula breakdown |
| `STORY-01` | Our story / founders |
| `PROOF-01` | First-party objective evidence — clinical data, case studies, credentials, certifications, manufacturing standards |
| `PROOF-02` | Self-verification — 100-day guarantee, risk reversal, prove it yourself |
| `PROOF-03` | Third-party social proof — testimonials, customer reviews |
| `FAQ-01` | FAQ |

**Rules:**
- UPPERCASE stem, hyphen, two-digit padding. Example: `APP-01`, not `app-1`.
- Global scope: one canonical code per topic. If a section doesn't fit an existing code, add a new row to this catalog before using it.
- Topic codes are distinct from element counters (`P-01`, `F-01`, `U-01`, `R-01`, `Fig. 01`). Element counters live inside a section body; topic codes live in the section eyebrow.
- New topics: pick a meaningful 3–6 char stem + `-01`. Expand to `-02` if a second surface covers the same topic from a different angle (e.g. `SCI-01` mechanism, `SCI-02` deep research).

---

## Colour grammar

| Use | Value | Rule |
|-----|-------|------|
| Primary CTA, selected state | `#1B2757` (navy) | **Interactive only.** Never decorative. |
| Data surfaces | `lab-asset-frame` | — |
| Dividers, borders | `border-black/8`–`/12` | Hairline. Thicker only when selected. |
| Section backgrounds | `bg-white` / `bg-[var(--brand-tint)]` | Alternate for rhythm. |
| Product accent (Flow/Clear/Both) | `FUNNEL_PRODUCTS.accent` | Identifier strips only. Never the primary selection signal — navy border handles that. |

---

## Primary CTA — `ConkaCTAButton`

`app/components/landing/ConkaCTAButton.tsx`. **Standard CTA for every clinical surface.** Do not hand-roll or reach for `LandingCTA`. The inverted CONKA "O" ring is part of the button identity.

Anatomy: "O" ring · mono label + blinking `_` · mono meta line · right arrow · top-right chamfer.

Props: `children` (label — no trailing `→`, the button renders its own), `href` (defaults to `FUNNEL_URL`), `meta` (second row).

For interactive buttons that fire handlers (not links), replicate the visual directly — see `FunnelCTA.tsx`.

---

## Component conventions

Components expose a consistent prop shape when they include a CTA or optional regions:

- `hideCTA?: boolean` — suppress the bottom CTA block
- `ctaHref?: string` — override CTA target
- `ctaLabel?: string` — override CTA text

Pages pass these when retargeting a shared component (e.g. home's `LabGuarantee` and `LabTimeline` CTAs point to `/protocol/3`).

**Structural contract:** components return content only. No `<section>`, no root `max-w-*`, no `px-*`. Pages own the section wrapper, background, and `brand-track`.

---

## Responsive patterns

- **Dual-position controls:** `flex lg:hidden` + `hidden lg:flex` places the same element at different positions on mobile vs desktop (e.g. carousel nav sits under the portrait on mobile, at card base on desktop).
- **Mobile scroll → desktop grid:** `flex lg:grid lg:grid-cols-N gap-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none`. Swipe on mobile, static grid on desktop.
- Split into `ComponentDesktop.tsx` / `ComponentMobile.tsx` with `useIsMobile()` only when layouts diverge significantly. Otherwise use breakpoint utilities inline.

---

## Trust grid — `LabTrustBadges`

`app/components/landing/LabTrustBadges.tsx`. 4-cell mono grid (Free Shipping · Informed Sport · Batch Tested · Cancel Anytime). Drop in above or below any CTA. No props.

---

## Corner brackets (lifestyle assets only)

```tsx
<span aria-hidden className="pointer-events-none absolute top-3 left-3 w-[20%] h-[20%] border-t-[6px] border-l-[6px] border-black" />
<span aria-hidden className="pointer-events-none absolute bottom-3 right-3 w-[20%] h-[20%] border-b-[6px] border-r-[6px] border-black" />
```

Requires `relative overflow-hidden` parent. Use `border-white` on dark images. Not for product renders.

---

## Do not

- Add `border-radius` — tokens handle it
- Use gradients — solid navy `#1B2757` only. Exception: `bg-gradient-to-t from-black/70 via-black/25 to-transparent` is allowed *over imagery* for figure-plate legibility, never on UI surfaces.
- Colour headings — single black only. No accent spans, no navy spans, no gradient text. Headings are not interactive; navy `#1B2757` is reserved for interactive elements (CTAs, selected state, citation links).
- Omit the topic code in a section eyebrow — every section eyebrow ends with `· TOPIC-0X`. See [Topic codes](#topic-codes).
- Apply `lab-clip-tr` (or any chamfer) to non-interactive elements (cards, icon tiles, figure plates)
- Hand-roll a primary CTA — always `ConkaCTAButton`
- Add shadows to cards — hairline border only
- Use product accent as a selected-state signal — navy border handles selection
- Centre-align headings
- Use emoji in labels — mono tags instead (`Ships ·`, `Note ·`, `01 ·`)
- Use `bg-brand-accent` fills outside CTAs
- Use rounded SVG strokes in icon tiles (`strokeLinecap="round"`) — square caps, miter joins
- Use oversized quotation marks or blockquote styling — 2px navy left rule instead
- Use `•` bullets anywhere — em-dash (`—`) only
- Leave imagery un-plated in a clinical layout — every framed asset gets at least one `Fig. 0X` corner plate
