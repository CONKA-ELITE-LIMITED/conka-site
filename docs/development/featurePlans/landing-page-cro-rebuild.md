# Landing Page CRO Rebuild

> **Status:** Planning
> **Created:** 2026-05-05
> **Page:** `/start`
> **Goal:** Rebuild the landing page as a purpose-built CRO machine for cold Meta ad traffic. Cut from 10 sections to 6. All new components — do not modify shared ones.

---

## Problem

The `/start` page was built incrementally as branding matured. Components that started as landing-specific were gradually reused across the home page, product pages, and PDPs. Today, every section component on `/start` is shared with at least one other page:

| Component | Also used on |
|-----------|-------------|
| `LandingHero` | `app/page.tsx` (home) |
| `LandingProductShowcase` | home, `/protocol/[id]` |
| `LandingDailyBenefits` | home |
| `LandingTestimonials` | home, `/conka-flow`, `/conka-clarity`, `/protocol/[id]` |
| `LabCaseStudies` | home, `/app` |
| `LandingValueComparison` | `/conka-flow`, `/conka-clarity` |
| `LabTimeline` | home, `/protocol/[id]` |
| `LabGuarantee` | `/conka-flow`, `/conka-clarity`, `/protocol/[id]` |
| `LabFAQ` | home, `/protocol/[id]` |
| `ConkaCTAButton` | 20+ components site-wide |

**Consequence:** We can't change any of these for CRO without risking regressions across the whole site. The `/start` page needs its own isolated component tree.

---

## Decision

Build a parallel `app/components/cro/` directory with purpose-built landing components. The existing components stay untouched. The `/start` page swaps to the new tree entirely.

This is not a visual redesign — it is a CRO-specific *intent* redesign. CRO components are allowed to:
- Use more aggressive copy
- Be denser with CTAs
- Have simpler visual hierarchy
- Drop depth/education in favour of conversion signals

---

## Reference site

**Ovrload (`ovrload.co/pages/gummy`)** — the primary benchmark. Key things they do right:
- Immediate hero with claim + CTA (no preamble)
- Normal rectangular button — reads as a button, not a design element
- Social proof via "as seen in" logos before any product detail
- Short testimonial section with real photos
- Guarantee and FAQ close the loop, then done

---

## New section structure (6 sections)

### 1. Hero — `CROHero`
**Job:** Stop the scroll. Make the claim. Get the click.

- Single sharp headline (benefit, not feature)
- One primary CTA — new `CROButton` (see below)
- Subline: price anchor ("From £X/shot") + "100-day guarantee"
- Trust mark row: star rating, Informed Sport, "Trusted by [Athlete 1], [Athlete 2], [Athlete 3]"
- No product showcase, no timeline, no education — that comes after they're interested
- Mobile: CTA must be visible without scrolling on 390px viewport

### 2. What it is — `CROFormulaSplit`
**Job:** Answer "what am I buying?" in 8 seconds.

- Two cards: Flow (AM) and Clear (PM)
- Each card: name, one-sentence purpose, 3 top ingredients only
- No 16-actives breakdown — that lives on the PDP
- Light tint background to break from hero white

### 3. Social proof — `CROTestimonials`
**Job:** "People like me say it works."

- 4–6 curated reviews: real name, real photo, verified purchase
- Prefer reviewers who mention a concrete benefit over general praise
- Do not include athlete reviews here — those go in the hero trust band
- Star aggregate (N= count) above the carousel
- One CTA at the bottom
- Reuses testimonial *data* from `CURATED_TESTIMONIALS` — new component, same data source

### 4. Guarantee — `CROGuarantee`
**Job:** Remove the risk. Make saying no irrational.

- Lead with the guarantee: 100-day money-back, no questions asked
- Use the app as *evidence for confidence*, not a separate selling point:
  > "We built an app that tracks your cognitive improvement. If you don't see it after 30 days, we pay you back."
- Informed Sport certification mention (anti-doping, quality signal)
- Do NOT show app screenshots or app store badges here — it adds friction and confusion
- Keep this to 4–5 lines of copy + one graphic treatment

### 5. FAQ — `CROFAQ`
**Job:** Kill the objections that are stopping the click.

- 5–7 questions max. Every question that gets removed lowers friction, not raises it.
- Priority questions (in this order):
  1. What does CONKA actually do?
  2. When will I feel it?
  3. Is it safe / Informed Sport certified?
  4. What if it doesn't work for me?
  5. How does the subscription work?
  6. Do I need both Flow and Clear?
- No PMID citations here — this is objection-handling, not science communication

### 6. Final CTA — `CROFinalCTA`
**Job:** One last push before they leave.

- Repeat the headline from hero (shorter version)
- CTA + price anchor
- No new information — just close

---

## Button: `CROButton`

The `ConkaCTAButton` is a brand statement — the clip-path polygon reads as a designed object, not a control. Ovrload and every reference site use normal rectangular or lightly-rounded buttons. The cut-corner shape works in the brand context where users are already engaged; on cold traffic it creates a "what is this?" moment that competes with the conversion decision.

**New `CROButton` spec:**
- Standard rectangle, 0 radius (consistent with lab aesthetic) or subtle 4px radius
- Full-width on mobile, min-width 280px on desktop
- Height: 56–60px (taller than current ConkaCTAButton)
- Background: `#4058bb` (brand accent) — not navy `#1B2757`
- White text, mono font, bold, uppercase
- Right-side arrow (same as current)
- **Hard offset shadow:** 4px × 4px solid `#2c3d8a` (darker shade of accent) — gives physical depth, matches the lab-sharp aesthetic
- **Hover:** lift 2px (`translateY(-2px)`), shadow expands to 6px
- **Active:** press down 2px (`translateY(2px)`), shadow collapses to 2px
- Arrow nudges 4px right on hover
- Does NOT include the Conka-O logo, meta subtitle line, or blinking cursor — those are brand presentation, not CRO

Why accent blue (`#4058bb`) not navy: The LANDING_PAGE_VISUAL_SYSTEM establishes that accent = action. Navy is brand identity. The CRO context needs the fastest possible cognitive path to "this is what I click."

---

## Component directory

```
app/components/cro/
  CROHero.tsx
  CROFormulaSplit.tsx
  CROTestimonials.tsx
  CROGuarantee.tsx
  CROFAQ.tsx
  CROFinalCTA.tsx
  CROButton.tsx          ← new button, does not replace ConkaCTAButton
```

`app/start/page.tsx` imports only from `app/components/cro/`. No shared landing components.

---

## What stays the same

- `Navigation` and `Footer` — unchanged
- `LandingDisclaimer` — only used on `/start` currently; keep or replace depending on copy changes
- Background cadence — white / tint alternation per LANDING_PAGE_VISUAL_SYSTEM
- Visual language — mono specs, zero-radius cards, black/white with accent — no style regression

---

## What gets removed from `/start`

| Removed section | Reason |
|----------------|--------|
| `LabCaseStudies` (athlete grid) | Athletes referenced in hero trust band; full grid is too much depth for cold traffic |
| `LandingDailyBenefits` | Collapsed into `CROFormulaSplit` |
| `LandingValueComparison` | Coffee cost comparison is clever but adds length; can A/B back in later |
| `LabTimeline` | "What to expect" is objection content — moved into FAQ |

---

## Build order

1. `CROButton` — needed by everything else; isolated, testable
2. `CROHero` — highest leverage, get this converting first
3. `CROTestimonials` — reuses existing data, lowest rebuild cost
4. `CROGuarantee` + `CROFAQ` — pair these, short sections
5. `CROFormulaSplit` — needs copy decision on what to surface per product
6. `CROFinalCTA` — simplest section, do last
7. Wire up `/start/page.tsx` — swap all imports

---

## Copy decisions needed before build

- Hero headline (the claim — needs to be sharp, not "optimise your brain")
- CROButton label (current: "Get Both from £X/shot" — is this right or do we lead with single product?)
- Guarantee wording (app-as-evidence angle needs a draft)
- FAQ question set — confirm the 5–7 with Harry/team
- Whether `LandingDisclaimer` copy changes (EFSA claims review before shipping)

---

## Out of scope for this phase

- A/B testing infrastructure — measure this rebuild as a clean before/after vs the current `/start` page
- Removing shared components from other pages — they stay where they are
- Funnel page (`/funnel`) — separate initiative
- Home page (`app/page.tsx`) — separate initiative

---

## References

- [Landing Page Visual System](../branding/LANDING_PAGE_VISUAL_SYSTEM.md) — background cadence, accent usage, typography tiers
- [Brand Voice](../branding/BRAND_VOICE.md) — copy rules, claims compliance
- [Quality Standards](../branding/QUALITY_STANDARDS.md) — quality bar
- [Website Simplification Plan](./WEBSITE_SIMPLIFICATION_PLAN.md) — parent initiative
- Benchmark: `ovrload.co/pages/gummy`
