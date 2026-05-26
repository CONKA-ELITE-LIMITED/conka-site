# Landing Page V2 — Soften /start for DTC Conversion

> **For a new chat picking this up:** read this whole doc, then go to `## What's next` for the immediate next task (Section 3). The `## Implementation log` records what's actually shipped vs what was planned. The `## Shared building blocks + gotchas` section captures decisions and cascade quirks that will bite you if ignored.

## Problem

`/start` has been live as our paid-traffic landing page for several months. Conversion is below target. The working hypothesis is that the clinical-grammar aesthetic (zero radius, mono labels, `// SCI-01` eyebrows, hairline borders, "Fig. 01 · Time in effect" framing) reads as too cold and too data-dense for cold paid traffic — particularly cold Meta traffic, where the user has zero brand awareness and is on a phone, comparing against ten other products they just scrolled past.

The clinical grammar works on `/conka-flow`, `/conka-clarity`, and `/conka-both` because those visitors have already shown intent. On `/start`, it's a barrier.

## Who it serves

Cold paid Meta and Google traffic landing on the site for the first time with no prior brand exposure.

## Business impact

Direct conversion improvement on our primary acquisition funnel. With current ad spend behind `/start`, even a small CR uplift compounds significantly. The same uplift also improves blended ROAS and lowers effective CAC.

## Build target

**Figma mockups → Next.js render on `/start`.** Earlier exploration considered Replo on a subdomain; we are not going that route. V2 ships in the codebase as a refactor of the existing `/start` page.

## Appetite

Section-by-section. Each section is scoped, designed in Figma, and implemented as a separate piece of work. Detailed estimates emerge when each section is picked up. The whole rebuild spans several weeks of design + engineering, interleaved with normal work.

---

## The CRO bet (read this first)

`/start` V2 explicitly trades clinical density for fast comprehension. The clinical grammar earns trust on `/conka-flow`, `/conka-clarity`, `/conka-both` because those visitors arrive with intent. On `/start` (cold paid Meta and Google), it loses to attention budget on mobile. V2's job is to land the argument in under 3 seconds per section while still feeling researched. Proof density is restored deeper in the page (Sections 6 % benefit cards, Section 8 Cambridge research) rather than front-loaded.

Practical implication for every section from Section 3 onwards: the test is "would a skeptical Meta-clicker on a phone get the point before scrolling past?" If no, simplify the visual, even if it means dropping a data point we'd keep on a clinical PDP.

## No Figma for Sections 3–11

Marketing has not produced and will not produce Figma mockups for Sections 3 onwards. We design in code. Sections are shaped via the `/scope` flow, built against the CRO principle above, and reviewed via `/review-page` / `/review-visual` / `/review-claims`. Earlier guidance in this doc that said "wait for Figma" is superseded.

## What's next

**Section 3 — `LandingValueComparisonV2` (Coffee vs CONKA, visual bar comparison).** New component inspired by LMNT's homepage: two horizontal animated bars that fill left-to-right when in view. Coffee bar fills a short distance then stops abruptly with a visually unpleasant tail; CONKA bar fills further and tapers smoothly past coffee's wear-off. No hour-by-hour ticks; three labelled time markers per bar (Start / Crash or Drop-off / End). Replaces the `LandingValueComparison` slot in `app/start/CROBelowFold.tsx`. Do not modify the shared `LandingValueComparison.tsx` (used by `/conka-flow`, `/conka-clarity`, `/conka-both`).

Scoped via `/scope` on 2026-05-26. Sub-ticket under SCRUM-1035. Branch already exists: `section-3`.

---

## Implementation log

### Section 1 — Hero V2 ✅ DONE & MERGED

- **Ticket:** SCRUM-1036
- **Branch:** `LANDING-PAGE-V2-HERO` (merged to `LANDING-PAGE-V2` via PR #243)
- **Commit:** `00daa5f`

**What shipped:**
- New `app/components/cro/CROHeroV2.tsx`
- Single-column, mobile-first layout:
  - Mobile full-bleed lifestyle image at top (`-mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[var(--brand-radius-container)]`)
  - Asset: `/public/lifestyle/clear/ClearDrink.jpg` (woman holding CONKA Clear bottle)
  - Image gets `priority` + `fetchPriority="high"` for LCP
  - Trust micro-row: 5 stacked avatars + ★★★★★ in gold (`#F59E0B`) + bold "622+ reviews · 5,000+ daily users"
  - H1: "Brain Performance in One *Daily* Shot." (Daily in `<em>`)
  - Subline: "With a daily dose of CONKA, you'll experience a noticeable boost in focus, memory, stress resilience & neuroplasticity through our patented formula.†" (solid black, leading-snug)
  - Full-width navy pill CTA "Save £120 + Free Shipping" via `CROPillCTA className="w-full"`
- Added `.brand-v2` scope class to `app/brand-base.css` — currently overrides radius tokens only (`--brand-radius-interactive: 10px`, container/card: 12px)
- Applied `brand-v2` class on `/start` page root in `app/start/page.tsx`
- Old `CROHero.tsx` left untouched on disk for revert

**Flags carried into launch:**
- Subline mentions "stress resilience & neuroplasticity" — new claims, needs `/review-claims` before launch
- "Save £120 + Free Shipping" — confirm £120 is real subscription savings, not placeholder
- Desktop Figma still pending — current implementation mirrors mobile layout, centered in `max-w-[560px]`

### Section 2 — Brand Story V2 ✅ DONE (PR pending)

- **Ticket:** SCRUM-1037
- **Branch:** `section-2-upgrade` (NOT yet merged — needs push + PR + merge into `LANDING-PAGE-V2`)
- **Commit:** `ff9e37b`

**What shipped:**
- New `app/components/cro/CROBrandStory.tsx`
- New `app/components/cro/CROPillCTA.tsx` (extracted from inline `HeroCTA` in `CROHeroV2.tsx`; shared by both sections going forward)
- Modified `app/components/cro/CROHeroV2.tsx` to use `CROPillCTA className="w-full"`
- Modified `app/start/CROBelowFold.tsx` to insert Brand Story as the first below-fold section (above `CROFormulaSplit`)
- Modified `app/start/page.tsx` to add `style={{ paddingBottom: "4rem" }}` on the hero `<section>` to reduce the gap to Section 2

**Brand Story content:**
- H2: "We Created Drinkable Focus."
- Subline: "We spent over £500,000 and 3 years developing the first nootropic shot. Trusted where focus isn't optional, by athletes, physicians, biohackers, and the world's hardest-thinking professionals."
- Image: `/public/hero/ShotsHero.jpg` (two CONKA bottles, dark + white cap on white bg)
  - Container: `aspect-[10/9]` (slightly wider than tall, crops 5% off top + bottom)
  - `object-cover object-center scale-150` — zoomed into the bottles, white space cropped
- Two stats stacked:
  - **150,000+** / shots sold to date
  - **£500,000** / invested into clinical research
- Centered content-width navy pill CTA "Order Now" (wrapped in `<div className="flex justify-center">`)
- Section background: `brand-bg-white` (same as hero — no alternating rhythm yet, matches Figma)
- Section padding: `style={{ paddingTop: 0 }}` to make hero's pb the full gap

**Flags carried into launch:**
- Subline finalised (2026-05-26): "Trusted where focus isn't optional, by athletes, physicians, biohackers, and the world's hardest-thinking professionals." — endorsement-style audience claim, run `/review-claims` to confirm it's safe under EFSA rules before launch
- Spinning/floating bottle animation deferred per parent plan (static asset for now)

### Sections 3–11 ⏳ NOT STARTED

See `## Section plan` below for briefs.

---

## Shared building blocks + gotchas

These were introduced or discovered during Sections 1 + 2. Anyone picking up Section 3+ should know them.

### `CROPillCTA` (shared component)

Lives at `app/components/cro/CROPillCTA.tsx`. The V2 pill button. Used by Hero and Brand Story; will be used by every future V2 CTA unless specified otherwise.

API:
```tsx
<CROPillCTA>Order Now</CROPillCTA>                       // content-width, defaults to FUNNEL_URL
<CROPillCTA className="w-full">Save £120</CROPillCTA>    // full-width variant
<CROPillCTA href="/some-other-route">Click</CROPillCTA>  // custom href
```

Defaults: `inline-flex`, `py-4 px-10`, `rounded-full`, `bg-[#1B2757]` (navy), `text-white`, `font-semibold`. Centering when content-width is done by the parent (wrap in `flex justify-center`), not by the component.

### `.brand-v2` CSS scope

Lives at the bottom of Layer 2 in `app/brand-base.css`. Currently overrides only:
- `--brand-radius-interactive: 10px`
- `--brand-radius-container: 12px`
- `--brand-radius-card: 12px`

Applied on `/start` page root in `app/start/page.tsx` (`className="brand-clinical brand-v2 …"`). Other clinical pages are unaffected. Expand this scope (more token overrides) as sections need them, rather than adding new global tokens.

### Section padding cascade gotcha ⚠️

`app/globals.css` imports Tailwind first, then `brand-base.css`. This means `.brand-section { padding: var(--brand-section-padding); }` **wins the cascade against Tailwind utility classes** (`pb-0`, `pt-8`, etc.).

**Symptom:** you add `pb-0` to a section and nothing changes. Same for `pt-*`.

**Fix:** use inline style. The pattern already exists on `/app-insights/page.tsx`. Examples from V2:
- Hero `<section>`: `style={{ paddingBottom: "4rem" }}` — overrides the default 80px (mobile) bottom padding
- Brand Story `<section>`: `style={{ paddingTop: 0 }}` — zeros out the default 80px (mobile) top padding

Do not waste time with `!pb-4` or `pb-4!` — just use inline style.

### Section background rhythm

Currently broken from the alternating tint convention. Hero is `brand-bg-white`, Brand Story is also `brand-bg-white` (matches Figma). The next existing section (`CROFormulaSplit`) stays `brand-bg-tint`. Don't try to "fix" the rhythm — match what each Figma section calls for.

### Old components kept on disk

`app/components/cro/CROHero.tsx` is the V1 hero. Untouched, but no longer imported anywhere on `/start`. Kept for easy revert if V2 needs to be rolled back. Same logic will apply for any other CRO* component the V2 sections replace.

### CROFormulaSplit ⚠️ not yet refactored for V2

A prior session refactored `CROFormulaSplit.tsx` to a tabbed AM/PM layout with inline benefit clusters. That refactor was **reverted** and the file is back to the original side-by-side cards + drawer pattern. Section 4 (which targets a deeper AM/PM-toggle restyle) still needs to be built from scratch when picked up. Don't assume the tab toggle is shipped.

---

## Approach

**Two-stage per section:**
1. Figma mockup + content sign-off (design-led)
2. Next.js implementation on `/start` (engineering-led)

**Design direction:** move `/start` (and only `/start`) away from the clinical aesthetic toward a more conventional DTC visual vocabulary. Other clinical pages — home, `/conka-flow`, `/conka-clarity`, `/conka-both`, `/science`, `/our-story` — are not in scope and must not regress.

**Visual reframe — concrete shifts:**
- Softer geometry — light rounding (8–12px on cards, modest radius on CTAs) instead of clinical 0px
- Warmer typographic hierarchy — fewer mono eyebrows, fewer "FIG. 01 · SECTION-NN" lab labels, larger body text, more whitespace
- More lifestyle and product imagery — including bold, slightly wacky product/ingredient renders (per Section 4)
- Stronger emotional hooks — turn "2pm crash" and "longer afternoons" into visceral, visual arguments rather than chart-led proof
- Less density — fewer claims per viewport, bigger hero stats, more scannable

**Design references** (called out in the section briefs below):
- **Ketone-IQ homepage** — overall design / layout inspiration. Specific patterns called out: floating spinning product bottle (Section 2), "quick purchase" buy box (Section 5), "benefits of daily use" structure (Section 6), university research treatment (Section 8), custom icon system across the page
- **8 Hours** — ingredients panel treatment (Section 4), % increase benefit cards (Section 6)

**Direction confirmed by marketing (2026-05-26):**
- **Colour:** white background, black + grey accents (matches existing brand-base)
- **Typography:** Favorit was the target font, but **deferred** — we use existing Neue Haas Grotesk for now and revisit fonts later (Favorit needs a Dinamo Web License or we swap to a free equivalent like Inter)
- **Imagery direction:** more lifestyle, vibey, aspirational — "buying into the lifestyle they want", not corporate/boring. Action item for marketing to source new shots
- **Custom icon system:** CONKA-specific icons for recurring concepts — brain, bottle, energy, etc. Action item for design. These replace the current mono-eyebrow `// SECTION-NN` labels in many places
- **Product carousel imagery:** each image should be annotated — overlay diagrams, callouts, text labels — so visual benefits land without reading body copy
- **Copy direction:** lean into the ad angles converting well on Meta. Henry is putting together a synopsis — copy direction is gated on that

**Component strategy** (from the `/start` audit):

| Component | Strategy |
|---|---|
| `CROHero` | ✅ Replaced by `CROHeroV2` (kept on disk for revert) |
| `CROFormulaSplit`, `CROTestimonials`, `CROGuarantee`, `CROFAQ`, `CROFinalCTA` | Edit in place or fork to `*V2` — only used on `/start`, zero blast radius |
| `LandingValueComparison` | **Fork** to new `LandingValueComparisonV2` (LMNT-style animated bars, not a 1:1 copy) — shared with 3 other pages, must not regress them |
| `LandingDisclaimer` | Edit in place if visual only; flag for legal review if copy changes |
| `ConkaCTAButton`, `LabTrustBadges`, `IngredientsPanel` | Do not touch — shared primitives across the site. V2 uses `CROPillCTA` for its own CTA |
| `Navigation`, `Footer` | Out of scope |
| **New components (Sections 2, 5, 6, 7, 8, 10)** | Built under `app/components/cro/` with `CRO*` naming. ✅ `CROBrandStory` shipped for Section 2 |

---

## Section plan

V2 introduces 11 sections (up from 8 on the current `/start`). Reordered and partly new. The new architecture leads with emotional hooks earlier and pushes proof-density deeper into the page rather than front-loading it.

| # | Section | Status | Source/target component |
|---|---|---|---|
| 1 | Hero | ✅ Done (PR merged) | `CROHeroV2` |
| 2 | "We Created Drinkable Focus" | ✅ Done (PR pending) | `CROBrandStory` |
| 3 | Coffee vs CONKA (visual bar comparison) | **Next** | New `LandingValueComparisonV2` (LMNT-style animated bars; do NOT touch shared `LandingValueComparison`) |
| 4 | AM/PM toggle + ingredient close-ups | Not started | New `CROFormulaSplitV2` or in-place refactor of `CROFormulaSplit` |
| 5 | First buy box (quick purchase) | Not started | New `CROBuyBox` (or similar) |
| 6 | % increase benefit cards | Not started | New `CROBenefitCards` |
| 7 | Athlete + Informed Sport | Not started | New `CROAthletes` |
| 8 | University research / Cambridge | Not started | New `CROResearch` |
| 9 | Customer social proof | Not started | Restyle `CROTestimonials` (or fork to V2) |
| 10 | App callout + data/science | Not started | New `CROAppCallout` |
| 11 | FAQ | Not started | Restyle `CROFAQ` (or fork to V2) |
| — | Disclaimer footer | Keep | `LandingDisclaimer` (no change planned) |

### Section 1 — Hero ✅
Shipped. See `## Implementation log` above.

### Section 2 — Brand Story ✅
Shipped. See `## Implementation log` above. Animation (spinning bottle) deferred.

### Section 3 — `LandingValueComparisonV2` (Coffee vs CONKA, visual bar comparison) ← NEXT

- **Header:** "Two shots, built around your day."
- **Approach:** LMNT-inspired horizontal animated bar comparison. The current `LandingValueComparison` chart is directionally right but loses on attention budget. V2 replaces the chart with two stacked horizontal bars that animate fill on scroll-in.
  - Coffee bar: shorter fill, slower animation, abrupt jaggy end, muted colour. Visually communicates the crash.
  - CONKA bar: longer fill, slightly faster animation, smooth tapered end, brand-forward colour. Extends visibly past coffee's wear-off.
  - No hour-by-hour ticks. Each bar carries three labelled time markers: Start, Crash (or Drop-off / Wear-off, pending `/review-claims`), End.
  - Footnote anchor underneath both bars (carry over the V1 data-source footnote so we keep a defensible "researched" anchor).
- **Files:**
  - New: `app/components/cro/LandingValueComparisonV2.tsx` (do NOT modify the shared `LandingValueComparison.tsx`)
  - Modified: `app/start/CROBelowFold.tsx` — swap the slot
- **CTA:** "Try from £1.62 per day" via shared `CROPillCTA`
- **Animation:** prefer CSS keyframes on `transform: scaleX(...)` triggered by IntersectionObserver / existing `useInView` hook. Reach for framer-motion only if reuse is messy. Respect `prefers-reduced-motion` (skip animation, render bars at final state).
- **A11y:** `role="img"` + `aria-label` carrying the comparison in prose; markers `aria-hidden` (duplicated in label).
- **Compliance:** the word "Crash" and the duration framing need `/review-claims` before launch. Design with the marker label as a plain `<span>` so a compliance-driven swap to "Drop-off" / "Wear-off" doesn't require layout changes.
- **Mobile-first:** must look great at 390px; stack marker labels vertically below the bar if they collide.

### Section 4 — AM/PM toggle + ingredient close-ups
- Header: **"Why your afternoons feel longer than your mornings."**
- AM/PM toggle (sun + moon icons)
- When selected, swap to bold close-up bottle image of Flow or Clear
- Replace the current ingredients drawer with a concise **inline** ingredients panel underneath the bottle:
  - Lead with benefit, not dose
  - "Wacky / unclinical" ingredient imagery — should not feel like a supplement facts panel
  - Reference: 8 Hours ingredients section, replaced with CONKA ingredients
- Note: a prior attempt at a tabbed AM/PM `CROFormulaSplit` was reverted. Building this section means starting from the original `CROFormulaSplit` (side-by-side + drawer) and either editing in place or forking to `CROFormulaSplitV2`

### Section 5 — First buy box
- Header copy: **"Try your first shot today."**
- Quick-purchase widget — sends straight to Shopify checkout via `CartContext.addToCart` (NEVER hit `/api/cart` directly)
- Reference: Ketone-IQ "quick purchase" section
- Two FAQ-style dropdowns below the buy box:
  - "What's in it?"
  - "Where do we ship?"
- Pass `location: "buy_box"`, `source: "v2_quick_purchase"` to `addToCart` for funnel attribution

### Section 6 — % increase benefit cards
- Lead with % increases in specific cognitive metrics
- Each card expandable into "how this helps someone" detail
- References: 8 Hours benefits cards, Ketone-IQ "benefits of daily use"
- Source of %s: needs alignment with `docs/branding/BRAND_VOICE.md` proof points and the app-insights data

### Section 7 — Athlete + Informed Sport
- Athlete imagery — high-volume, lifestyle/action shots
- Inline explanation of Informed Sport certification: what it means, why CONKA has it
- Visual style: matches the new V2 grammar (warmer, more lifestyle)

### Section 8 — University research / Cambridge
- Reference: Ketone-IQ university research section
- Cambridge University imagery + logos of partner institutions
- Tie back to the cognitive test credentials currently in `LandingDisclaimer` footnote `^^`

### Section 9 — Customer social proof
- Same source data as current `CROTestimonials` (`app/lib/customerTestimonials.ts`)
- Restyle to match V2 grammar — softer cards, more visual weight per review
- Source as many photos as possible of customers holding the product (action item for marketing)

### Section 10 — App callout
- Why we have an app + photo of someone using it
- "Data / science behind it" sub-block — granular detail for the buyers who want to understand the measurement methodology
- This block is allowed to be denser / more technical — it serves the analytical buyer, not the cold ad-click
- Link to download (App Store + Play Store)

### Section 11 — FAQ
- Same 5 questions as current `CROFAQ`
- Restyle to match V2 grammar
- Confirm question set during section scoping

### Disclaimer footer
- Keep `LandingDisclaimer` as-is unless visual change is needed
- Any copy change to footnotes requires `/review-claims` first

---

## Cross-section status

| Item | Status |
|---|---|
| Typography (Favorit vs Inter vs keep Neue Haas) | **Deferred** — keep Neue Haas for V2 v1, revisit later |
| Custom icon system (brain, bottle, energy) | Not started — design action |
| Lifestyle imagery refresh | Not started — marketing action |
| Annotated product carousel imagery | Not started — design + marketing action |
| Ad-angle copy synopsis from Henry | Pending |
| `.brand-v2` scope class | ✅ Introduced (Section 1) — radius overrides only so far |
| `CROPillCTA` shared component | ✅ Introduced (Section 2) — used by Hero + Brand Story |
| Section padding cascade workaround | ✅ Established (inline-style pattern) |

---

## Constraints (non-negotiable)

- **`/start` remains noindex/nofollow** — paid-traffic only
- **EFSA claims compliance** — all anchor footnotes (`†`, `††`, `‡`, `§`, `¶`, `^^`, `*`) must continue to resolve. Disclaimer block content cannot change without legal review
- **Analytics surface preserved** — every existing event must still fire with the same name and metadata. The new Section 5 buy box must wire `AddToCart` + `InitiateCheckout` correctly via `CartContext`
- **Mobile-first** — 74% of `/start` traffic is mobile (per `CLAUDE.md`). Mobile is reviewed before desktop, every section
- **Performance** — Lighthouse 90+ on mobile, LCP < 2.5s. The Section 2 animation (deferred) and Section 7 athlete imagery are the biggest risks
- **No regression to other clinical pages** — home, `/conka-flow`, `/conka-clarity`, `/conka-both`, `/science`, `/our-story` must look unchanged. The fork strategy on `LandingValueComparison` (Section 3) exists specifically for this

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Softer aesthetic reduces perceived credibility, drops CR further | Conversion review window once V2 is live; sections 6 (% benefits) and 8 (Cambridge) intentionally preserve proof density |
| Section 2 spinning animation tanks LCP on mobile | Deferred to a later iteration; shipped as static asset for v1 |
| Section 5 quick-purchase widget breaks `CartContext` invariants (B2B tier normalization, analytics metadata) | Route through `CartContext.addToCart` like every other CTA — never directly hit `/api/cart`. Pass `location: "buy_box"`, `source: "v2_quick_purchase"` |
| EFSA claims compliance accidentally broken during copy changes | Run `/review-claims` after every section that touches copy |
| Performance regresses (new lifestyle imagery is heavy) | Image audit per section — every new asset must be `next/image` with explicit dimensions; LCP image gets `priority`; below-fold gets `loading="lazy"` |
| Shared `LandingValueComparison` accidentally edited | Build the new `LandingValueComparisonV2` instead — never edit the shared file. Code review specifically checks this |
| Sections built piecemeal end up visually inconsistent | The scoped `brand-v2` modifier class gives every section the same softened token set; review at half-built milestone (~5 sections shipped) to catch drift |
| Tailwind padding utility classes don't override `.brand-section` defaults | Use inline style — already a documented pattern. See `## Shared building blocks + gotchas` above |

## References

- `docs/development/REPLO_LANDING_BRIEF.md` — full architecture + copy of current `/start` (V1)
- `docs/development/REPLO_STYLE_CHEATSHEET.md` — current clinical design system (the thing V2 moves away from, for `/start` only)
- `docs/branding/QUALITY_STANDARDS.md` — quality bar
- `docs/branding/BRAND_VOICE.md` — copy rules
- `docs/development/LANDING_PAGE_CLAIMS_LOG.md` — EFSA claims log
- **External design references:** Ketone-IQ homepage (sections 2, 5, 6, 8), 8 Hours product page (sections 4, 6)

## Tickets

- Parent: [SCRUM-1035](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1035) — Landing Page V2
- [SCRUM-1036](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1036) — V2 Section 1 Hero ✅
- [SCRUM-1037](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1037) — V2 Section 2 Brand Story ✅
- [SCRUM-1038](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1038) — V2 Section 3 LandingValueComparisonV2 (To Do, Sprint 26)
- Section 4+ tickets to be created as each section is picked up
