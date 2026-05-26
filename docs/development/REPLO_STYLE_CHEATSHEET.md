# CONKA Style Cheat Sheet — for Replo

A one-pager of the visual system used across `/start` and every other clinical-grammar page (home, /science, /our-story, /case-studies, /ingredients, /app, /why-conka, /conka-flow, /conka-clarity, /conka-both, PDP, protocol). Source of truth: `app/brand-base.css`.

> **Three rules that beat everything else:**
> 1. **Zero rounded corners** — every surface, every button. Sharp edges.
> 2. **Navy #1B2757 is interactive-only** — CTAs, links, active states. Never decorative.
> 3. **Hairline borders, no shadows, no gradients** — `rgba(0,0,0,0.08–0.12)` borders; no drop shadows; no gradient backgrounds.

---

## Colours

### Core palette

| Role | Hex | Usage |
|---|---|---|
| **Brand black** | `#000000` | Primary text, headings |
| **Brand white** | `#FFFFFF` | Primary background |
| **Navy accent** | `#1B2757` | **The blue.** Buttons, links, active CTAs, data emphasis. Interactive only. |
| **Tint** | `#F5F5F5` | Alternating section background — every other section uses this for visual rhythm |
| **Deep grey** | `#212121` | Rarely used; available for dark surfaces if black is too heavy |

### Border tints (hairlines only)

| Use case | Value (rgba) | Tailwind shorthand |
|---|---|---|
| Subtle divider | `rgba(0, 0, 0, 0.06)` | `border-black/6` |
| Default hairline | `rgba(0, 0, 0, 0.08)` | `border-black/8` |
| Stronger hairline | `rgba(0, 0, 0, 0.12)` | `border-black/12` |

### Text opacity ramp (on white)

| Use case | Value | Notes |
|---|---|---|
| Primary text | `#000000` | Headlines, key body |
| Secondary body | `rgba(0,0,0,0.70)` | `text-black/70` — long-form body |
| Tertiary | `rgba(0,0,0,0.55)` | `text-black/55` — captions, subtle context |
| Muted/labels | `rgba(0,0,0,0.40)` | `text-black/40` — eyebrows, metadata |
| Disabled/very faint | `rgba(0,0,0,0.15)` | `text-black/15` — empty stars, faint dividers |

### Do NOT use on the landing page

- `#4058bb` (legacy soft-blue) — only for B2B portal / account, never landing
- Flow amber `#D97706` and Clear blue `#0369A1` — deprecated; clinical pages use navy only
- Any gradient — forbidden outside the figure-plate text overlay

---

## Fonts

| Role | Family | Weights used | Falls back to |
|---|---|---|---|
| **Primary (headings + body)** | Neue Haas Grotesk Display | 400, 500, 700 | `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif` |
| **Data / mono (eyebrows, stats, captions)** | JetBrains Mono | 400, 500 | `"IBM Plex Mono", "Courier New", monospace` |

**For Replo:** if Neue Haas isn't licensed/uploadable into the Replo project, the closest free swap is **Inter** (similar geometry, slightly less personality). JetBrains Mono is free and on Google Fonts — use it as-is.

---

## Type scale

All headings left-aligned. Never centre headings on this brand.

| Class | Size (clamp) | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `brand-h1` | clamp(36px, 6vw, 56px) | 500 | 1.1 | −0.02em |
| `brand-h1-bold` | clamp(36px, 6vw, 56px) | 700 | 1.1 | −0.02em |
| `brand-h2` | clamp(28px, 4vw, 40px) | 500 | 1.125 | −0.01em |
| `brand-h3` | clamp(20px, 3vw, 28px) | 400 | 1.15 | 0 |
| `brand-h4` | clamp(16px, 2vw, 20px) | 500 | 1.2 | −0.01em |
| `brand-body` | 16px | 400 | 1.4 | 0 |
| `brand-caption` | 14px | 400 | 1.15 | 0 |

### Mono patterns (very on-brand — use liberally)

| Pattern | Sample | Spec |
|---|---|---|
| **Eyebrow** | `// The formulation · ING-01` | JetBrains Mono, 10px, weight 500, uppercase, tracking 0.20em, `text-black/40` |
| **Mono sub-line** | `16 active ingredients · 2 daily shots · clinically dosed` | JetBrains Mono, 10px, weight 400, uppercase, tracking 0.18em, `text-black/50`, tabular-nums |
| **Figure plate** (on imagery) | `FIG-01 · TIME IN EFFECT` | JetBrains Mono, 9px, weight 400, uppercase, tracking 0.20em, white on `rgba(0,0,0,0.55)`, padding 4px 8px |
| **Stat / number** | `4.7/5`, `150,000+` | JetBrains Mono, weight 500–700, `tabular-nums` always |

The eyebrow + headline + mono sub-line opener is the signature visual rhythm of the brand — every section header on `/start` uses it.

---

## Radius

| Element | Value |
|---|---|
| Buttons / inputs | **0px** |
| Cards | **0px** |
| Image containers | **0px** |

Sharp corners everywhere. The exception is the **primary CTA button** which uses an inline two-corner notch (top-left + bottom-right) — see `ConkaCTAButton` for the exact clip-path. Secondary CTAs use a 12px top-right chamfer (`.lab-clip-tr`).

---

## Spacing scale

| Token | px | Use |
|---|---|---|
| xs | 4 | Inline gaps |
| s | 8 | Tight stack |
| m | 16 | Default gap |
| l | 24 | Comfortable stack |
| xl | 32 | Section internal spacing |
| 2xl | 48 | Large breathing room |

## Layout

| Setting | Value |
|---|---|
| Page max-width | 1280px |
| Gutter (mobile, ≤768px) | 20px |
| Gutter (desktop, >768px) | 5vw |
| Section vertical padding (desktop) | clamp(80px, 10vh, 160px) |
| Section vertical padding (mobile) | 80px |
| Body copy max-width | 65ch |

Pages alternate `brand-bg-white` and `brand-bg-tint` (`#F5F5F5`) section-by-section to create rhythm.

---

## Primary CTA spec

The brand's signature CTA — used everywhere on `/start`:

- **Background:** black (`#000000`)
- **Text:** white, weight 500, sentence case (e.g. "Get Both from £1.61/shot")
- **Shape:** rectangle with **two inverted corner notches** (top-left + bottom-right). Gives it an "industrial / spec-sheet" feel.
- **Hover:** slight opacity drop
- **Trailing blinking cursor** ▍ — a subtle JetBrains-Mono-style cursor at the end of the label

If Replo can't recreate the notched-corner shape exactly, fall back to: solid black rectangle, zero radius, white text — and accept that as the v1.

Secondary CTAs use the same black/white treatment but with a single 12px top-right chamfer (`.lab-clip-tr`).

---

## Section composition pattern

Every section on `/start` follows this rhythm:

```
[mono eyebrow]              // The formulation · ING-01
[heading h1 or h2]          Two shots. Built around your day.
[mono sub-line]             16 active ingredients · 2 daily shots · clinically dosed

[content — cards, charts, etc.]

[primary CTA]               Get Both from £1.61/shot
[trust badges row]          Informed Sport · Lab tested · GMP
```

Match this pattern in Replo for visual consistency across the site.

---

## Quick paste-in CSS variables (if Replo lets you set custom CSS)

```css
:root {
  /* Colours */
  --brand-white: #ffffff;
  --brand-black: #000000;
  --brand-accent: #1b2757;    /* navy — interactive only */
  --brand-tint: #f5f5f5;       /* alternating section bg */

  /* Border tints */
  --brand-divider-subtle: rgba(0, 0, 0, 0.06);
  --brand-divider: rgba(0, 0, 0, 0.08);
  --brand-border-strong: rgba(0, 0, 0, 0.12);

  /* Fonts */
  --font-brand-primary: "Neue Haas Grotesk Display", "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  --font-brand-data: "JetBrains Mono", "IBM Plex Mono", "Courier New", monospace;

  /* Radius */
  --brand-radius-interactive: 0px;
  --brand-radius-container: 0px;
  --brand-radius-card: 0px;

  /* Layout */
  --brand-max-width: 1280px;
}
```

---

## Reference docs

- Full design system: `docs/branding/DESIGN_SYSTEM.md`
- Source CSS: `app/brand-base.css`
- Brand voice & copy rules: `docs/branding/BRAND_VOICE.md`
- Quality bar / reference sites: `docs/branding/QUALITY_STANDARDS.md`
