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

**Section 6 — `% increase benefit cards`.** New component on `/start` between the inline buy box (Section 5) and the legacy testimonials block. Lead with quantified cognitive metrics (e.g. "+28.96% focus", "+18.41% memory") in scannable cards; each card expandable into a "how this helps someone" detail line. Reference style: 8 Hours benefit cards + Ketone-IQ "benefits of daily use". Sources for the %s need alignment with `docs/branding/BRAND_VOICE.md` proof points and the app-insights data before launch. See the brief in `## Section plan` below.

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

### Section 3 — `LandingValueComparisonV2` ✅ DONE (on `section-3`)

- **Ticket:** SCRUM-1038 (last separate sub-ticket; subsequent sections roll under SCRUM-1035 directly)
- **Branch:** `section-3` (NOT yet merged)
- **Key commits:** `73705f6` initial ship; `b354783` red crash callout + standardised section spacing; `d822db2` CONKA bar fills 100% + red accent on coffee crash
- **What shipped:**
  - New `app/components/landing/LandingValueComparisonV2.tsx` — two horizontal bars that animate fill on scroll-in via the existing `useInView` hook. Coffee fills 0 to 56% of the day (solid black peak 9am-12pm, red hatched crash 12pm-2pm with a red "↑ Crash" callout below the bar). CONKA Flow + Clear fills 100% smoothly in navy from 9am to 6pm. Three labelled time markers per bar; no hour-by-hour ticks.
  - H2: "The 2pm crash isn't you."
  - Subline: "Coffee gets you started. CONKA gets you through."
  - Footnote below the CTA carries the V1 data anchor ("Based on 7,593 cognitive tests across 712 CONKA app users over 30 months") with a link to `/app-insights#time-of-day`.
  - `prefers-reduced-motion` respected via a lazy `useState` initializer; bars render at final state with no transition when reduced.
  - Wired into `CROBelowFold` immediately after Brand Story. The original `LandingValueComparison` (still used by the three clinical PDPs) is untouched.

### Section 4 — `CROFormulaSplitV2` ✅ DONE (on `section-3`)

- **Branch:** `section-3`
- **Key commits:** `d1415a8` initial AM/PM toggle + ingredient accordion; `811b2e1` layout rework (toggle outside the card, bigger bottle, white background); `07f2311` Magic Mind-style ingredient overrides + coloured toggle; `61cf777` toggle moved above the card; `ded2b33` "See the science" label; `b92a40c` Morning / Afternoon labels
- **What shipped:**
  - New `app/components/cro/CROFormulaSplitV2.tsx` replacing the V1 `CROFormulaSplit` slot.
  - H2: "Built for every part of your day."
  - Coloured pill toggle ABOVE the product card (Morning amber `#F59E0B` + sun icon, Afternoon navy + custom sun-horizon SVG icon; the moon was rejected because afternoon is not night).
  - Bottle card: square aspect, large bottle render via `scale-150`, product name + one-line copy overlaid in the bottom-left corner.
  - Below the card: a dynamic editorial intro headline, then a vertical stack of pill-shaped ingredient rows.
  - Each row: circular ingredient image + name + `+`/`−` indicator. Click expands to category pill, plain-language "what is it" (per-ingredient override), plain-language "why it helps" (per-ingredient override), then a nested "See the science" reveal with study key-finding, the top two key stats, and the source citation.
  - Em-dashes from the shared `ingredientsData.ts` are stripped at render so the V2 surface stays on brand voice. The shared catalogue itself is not modified.
- **Flags carried into launch:**
  - 13 new ingredient `whatIs` + `whyGood` overrides plus the per-formula intro copy — `/review-claims` pass needed before merge.

### Section 5 — `CROBuyBox` (inline conka-both quick purchase) ✅ DONE (on `section-3`)

- **Branch:** `section-3`
- **Key commits:** `a5dc421` initial ship; `abf1c33` `/formulas/both/BothBox.jpg` asset swap; `30eed0b` bullet tightening + remove duplicated guarantee subline; `f591f3f` re-add "16 clinical ingredients" bullet; `093cd1d` FAQ accordion under the card; `44fc2de` "When do I take it?" rewrite with mini bottle assets
- **What shipped:**
  - New `app/components/cro/CROBuyBox.tsx`. Ketone-IQ-inspired single conka-both card, V2 palette (no red anywhere): product photo (`/formulas/both/BothBox.jpg`, the two boxes + bottles shot), navy price row with grey strike-through OTP and a navy "Save X%" pill, per-shot micro-line, 4-item benefits checklist (56 shots split / 2 a day / Free UK shipping / 16 clinical ingredients, UK patented), bordered Subscribe & Save toggle auto-checked, full-width CTA whose label flips between "Start subscription · £X.XX/mo" and "Order once · £X.XX", 100-day guarantee footer.
  - Real cart wiring through `useCart().addToCart(variant.variantId, 1, variant.sellingPlanId, { location: "buy_box", source: "v2_quick_purchase" })`. `AddToCartMetadata.location`/`source` are typed as plain `string` so no `CartContext.tsx` changes were required. Drawer auto-opens on add.
  - Variant + pricing resolved at render via `getCadenceVariantByProductHeroId("03", cadence)` and `getCadencePricingByProductHeroId("03", cadence)`. Savings derived from the monthly-sub `compareAtPrice`, falling back to the monthly-otp price.
  - `CROPillCTA` extended with optional `onClick` / `disabled` / `type` props so it can render as a `<button>` for cart actions. Link mode is unchanged for existing callers.
  - FAQ accordion below the card (same accordion mechanics as Section 4): "What's in it?" expands to a chip grid of all 13 ingredients grouped by formula; "When do I take it?" expands to two authoritative Flow + Clear paragraphs each anchored by a small bottle render; "Need international shipping?" expands to a one-line yes.
- **Flags carried into launch:**
  - New copy across the buy-box benefits, FAQ panels, and the timing answer — `/review-claims` pass needed before merge.

### Sections 6–11 ✅ DONE (on `section-3`)

All eleven V2 sections shipped on the `section-3` branch (not yet merged). The legacy `CROFinalCTA` block between Section 11 and the disclaimer was also removed on 2026-05-26. See individual section briefs below.

---

## Shared building blocks + gotchas

These were introduced or discovered during Sections 1 + 2. Anyone picking up Section 3+ should know them.

### `CROPillCTA` (shared component)

Lives at `app/components/cro/CROPillCTA.tsx`. The V2 pill button. Used everywhere a V2 CTA appears (Hero, Brand Story, Section 3 chart, Section 5 buy box).

API:
```tsx
<CROPillCTA>Order Now</CROPillCTA>                       // content-width, defaults to FUNNEL_URL
<CROPillCTA className="w-full">Save £120</CROPillCTA>    // full-width variant
<CROPillCTA href="/some-other-route">Click</CROPillCTA>  // custom href
<CROPillCTA onClick={fn} disabled={loading}>...          // button mode (added for Section 5 cart action)
```

Defaults: `inline-flex`, `py-4 px-10`, `rounded-full`, `bg-[#1B2757]` (navy), `text-white`, `font-semibold`. Providing `onClick` switches the component from a `<Link>` to a `<button>`. Centering when content-width is done by the parent (wrap in `flex justify-center`), not by the component.

### `.brand-v2` CSS scope

Lives at the bottom of Layer 2 in `app/brand-base.css`. Currently overrides only:
- `--brand-radius-interactive: 10px`
- `--brand-radius-container: 12px`
- `--brand-radius-card: 12px`

Applied on `/start` page root in `app/start/page.tsx` (`className="brand-clinical brand-v2 …"`). Other clinical pages are unaffected. Expand this scope (more token overrides) as sections need them, rather than adding new global tokens.

### Section padding cascade gotcha ⚠️

`app/globals.css` imports Tailwind first, then `brand-base.css`. This means `.brand-section { padding: var(--brand-section-padding); }` **wins the cascade against Tailwind utility classes** (`pb-0`, `pt-8`, etc.).

**Symptom:** you add `pb-0` to a section and nothing changes. Same for `pt-*`.

**Fix:** use inline style. The pattern already exists on `/app-insights/page.tsx`.

**Standardised V2 spacing (established during Section 3, applied to every V2 section since):**

```tsx
<section
  className="brand-section brand-bg-white"
  style={{ paddingTop: 0, paddingBottom: "4rem" }}
  aria-label="..."
>
```

`paddingTop: 0` on every V2 section + `paddingBottom: "4rem"` on every V2 section gives a clean 4rem gap between any two V2 sections without re-introducing the 80px default. The Hero on `/start` keeps `paddingBottom: "4rem"` (set in `page.tsx`) for symmetry. Every new V2 section should follow this pattern.

Do not waste time with `!pb-4` or `pb-4!` — just use inline style.

### Section background rhythm

Current state of `/start`: the V2 sections (Hero, Brand Story, Section 3 chart, Section 4 formula split, Section 5 buy box) are all `brand-bg-white` per user direction. The legacy V1 sections below (Testimonials onwards) keep their original tint/white alternation. Don't try to "fix" the white run — it's intentional. The visual rhythm comes from the cards inside each section (soft grey backgrounds on the buy box and ingredient rows), not from section-level alternation.

### Old components kept on disk

The V1 components that V2 sections replace are left on disk for easy revert. None of them are imported on `/start` anymore, but they still serve `/conka-flow`, `/conka-clarity`, `/conka-both` (the shared ones) or are kept as historical reference (the CRO* ones).

- `app/components/cro/CROHero.tsx` — replaced by `CROHeroV2.tsx` (kept; no longer imported)
- `app/components/cro/CROFormulaSplit.tsx` — replaced by `CROFormulaSplitV2.tsx` (kept; no longer imported)
- `app/components/landing/LandingValueComparison.tsx` — Section 3 forks to `LandingValueComparisonV2`; the V1 file stays as-is because three other clinical pages still render it. Do NOT modify the V1 file.

### Accordion pattern (Sections 4 + 5)

Both Section 4 (ingredient rows) and Section 5 (FAQ rows) use the same accordion mechanic: a soft `bg-black/[0.04] rounded-[16px]` pill containing a button (`aria-expanded` + `aria-controls`) and a content region (`role="region"`, `transition-[max-height]`) with `+` / `−` indicators. Single-open behaviour managed with `useState<string | null>(openId)`. When you add another accordion-style surface to `/start`, mirror this pattern verbatim. Nested accordions are fine (Section 4's "See the science" toggle is a second `useState` per row).

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
| — | Legacy `CROFinalCTA` | **Removed** 2026-05-26 — Sections 5 + 10 already carry conversion CTAs; the extra final CTA was redundant |

### Section 1 — Hero ✅
Shipped. See `## Implementation log` above.

### Section 2 — Brand Story ✅
Shipped. See `## Implementation log` above. Animation (spinning bottle) deferred. Later copy refinements (2026-05-26): H2 expanded to "We Created Drinkable Focus and Clarity." (so both formulas get visible billing), and the subline second sentence reframed from "where focus isn't optional" to "where cognitive performance isn't optional" to match the broader V2 vocabulary.

### Section 3 — `LandingValueComparisonV2` (Coffee vs CONKA + price comparison) ✅

- **Header:** "The 2pm crash isn't you." Subline: "Coffee gets you started. CONKA gets you through."
- **Layout:** the two animated bars + the price comparison sit together inside ONE bordered card (`border-black/12 rounded-[var(--brand-radius-container)] p-5 sm:p-6`) so the card holds both halves of the Coffee-vs-CONKA argument: time-of-day coverage AND cost.
- **Bars:**
  - Coffee bar: peak 9am-12pm (33%, solid black), red hatched crash from 12pm-2pm (56%). Small red `↑ Crash` callout under the bar at the crash midpoint.
  - CONKA bar: SPLIT halfway. Flow (amber `#F59E0B`) covers 0-50% (morning), Clear (soft blue `#94B9FF`, from `productColors.ts` FORMULA_COLORS) covers 50-100% (afternoon). Sequential reveal — Flow animates from 220ms over 600ms, then Clear from 820ms over 600ms.
  - Three labelled time markers per bar (Start / Crash or 1pm / End). No hour-by-hour ticks.
- **Price comparison** (inside the same bordered card, separated by a hairline `border-t border-black/10`):
  - H3: "£{MONTHLY_SAVINGS_VS_COFFEE}/month less than a daily coffee."
  - Two rows: "Daily coffee · £{COFFEE_PRICE_PER_DAY}/day" (muted) and "Both shots · £{PRICE_PER_DAY_BOTH}/day" (navy bold)
  - All three numbers pull from `app/lib/landingPricing.ts` constants.
- **Files:**
  - New: `app/components/landing/LandingValueComparisonV2.tsx` (do NOT modify the shared V1 `LandingValueComparison.tsx`)
  - Modified: `app/start/CROBelowFold.tsx` — swap the slot
- **CTA:** "Try from £1.62 per day" via shared `CROPillCTA` (outside the card)
- **Footnote outside the card:** "Based on 7,593 cognitive tests across 712 CONKA app users over 30 months." with link to `/app-insights#time-of-day`.
- **Animation:** CSS `transform: scaleX(...)` triggered by the existing `useInView` hook. `prefers-reduced-motion` skips animation (lazy `useState` initializer).
- **A11y:** `role="img"` + `aria-label` carrying the comparison in prose; markers `aria-hidden`.

### Section 4 — `CROFormulaSplitV2` (AM/PM toggle + 8 Hours-style ingredient list) ✅

Scoped + shipped 2026-05-26. No separate Jira ticket per current direction; rolls under SCRUM-1035. Toggle PM/Afternoon active colour updated 2026-05-26 from the brand navy (`#1B2757`) to the canonical Clear hex from `productColors.ts` (`#94B9FF` soft blue, with black text per the `PRODUCT_GRADIENT_TEXT_COLOR` lookup which says "black" for Clear). AM/Morning toggle keeps amber + white.

- **H2:** "Flow for your mornings. Clear for your afternoons." (static)
- **Layout:**
  - Product card with a close-up bottle image (uses the existing `/formulas/conkaFlow/FlowNoBackground.png` and `/formulas/conkaClear/ClearNoBackground.png` assets from `LandingProductSplit`), product name, and one-line benefit copy.
  - AM / PM toggle pill below the card. Sun icon = AM (Flow), moon icon = PM (Clear). Inline SVG icons, no emoji.
  - Below the toggle: a dynamic 2-line editorial headline tied to the chosen product, followed by a vertical stack of pill-shaped ingredient rows.
- **Ingredient rows:**
  - Circular ingredient image (left) using `/ingredients/{formula}/*.webp` from `ingredientsData.ts`, ingredient name (middle), "+" / "−" toggle (right). Dose hidden in the closed state.
  - Click expands an accordion below the row: `oneLineClaim`, the top two `keyStats`, the first `clinicalStudies` citation, and the per-formula `percentage` as the dose surrogate.
  - Single-open behaviour (clicking a new row closes the previously open one). All closed on first paint.
  - Image fallback for ingredients without an `image`: navy circle with the first two letters in white.
- **Files:**
  - New: `app/components/cro/CROFormulaSplitV2.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (swap the existing `CROFormulaSplit` slot; new section uses `brand-bg-tint` to break the V2 white trio)
  - DO NOT touch: `app/components/cro/CROFormulaSplit.tsx` (kept on disk for revert; V1 reference)
  - DO NOT modify: `app/lib/ingredientsData.ts` (shared catalogue)
- **A11y:** toggle is `role="tablist"` + `role="tab"` + `aria-selected`; ingredient panel uses `aria-expanded` + `aria-controls`. Accordion content region has `role="region"`.
- **Animation:** instant swap on toggle (no cross-fade to start); accordion uses CSS `max-height` transition (~220ms ease-out) to a generous fixed max.
- **Carry-overs:** uses shared `CROPillCTA` if a CTA gets added later; honours the standardised V2 section spacing (`paddingTop: 0, paddingBottom: "4rem"`); mobile-first at 390px.
- **Flag for /review-claims after build:** new copy strings on the product card and ingredient intros (e.g. "without the coffee", "steady morning focus"). Same family as Section 3 claims.

### Section 5 — `CROBuyBox` (conka-both quick purchase)

Scoped + shipped 2026-05-26. No separate Jira ticket per current direction; rolls under SCRUM-1035.

- **H2:** "Try your first shot today."
- **Card structure** (Ketone-IQ inspired, V2 palette):
  - Primary product photo (`/formulas/both/BothShots.jpg`) at the top of the card, 5:4 aspect, full-bleed
  - Title "CONKA Both" + tagline "Flow for the morning, Clear for the afternoon."
  - Price row: big navy sub price `/mo`, OTP price greyed and struck through, navy "Save X%" pill (no red anywhere)
  - "£X.XX per shot" micro-line below the price
  - Benefits checklist (4 navy ticks)
  - Subscribe & Save toggle row: bordered, auto-checked, expands explanatory copy. Native `<input type="checkbox">` styled with `accent-[#1B2757]`.
  - Full-width navy pill CTA whose label flips on the toggle:
    - Sub on: "Start subscription · £X.XX/mo"
    - Sub off: "Order once · £X.XX"
  - Footer: 100-day money-back guarantee + "Pause, adjust, or cancel anytime."
- **Cart wiring:** uses `useCart()` and `addToCart(variant.variantId, 1, variant.sellingPlanId, { location: "buy_box", source: "v2_quick_purchase" })`. The cart drawer opens automatically (`setIsOpen(true)` is fired inside `addToCart`). `AddToCartMetadata.location` and `.source` are typed as plain `string` so no type changes were needed.
- **Pricing source:** `getCadenceVariantByProductHeroId("03", cadence)` for variant + selling plan IDs, `getCadencePricingByProductHeroId("03", cadence)` for the display numbers. Savings derived from the monthly-sub `compareAtPrice` (falls back to the monthly-otp price).
- **Files:**
  - New: `app/components/cro/CROBuyBox.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (new section after `CROFormulaSplitV2`, before testimonials), `app/components/cro/CROPillCTA.tsx` (added optional `onClick`, `disabled`, `type` props so it can render as a `<button>` for cart actions; link mode unchanged for existing callers)
- **Carry-overs:** standardised V2 section spacing (`paddingTop: 0, paddingBottom: 4rem`), `.brand-v2` scope, `brand-bg-white` background to keep the V2 white run.

**Deferred to a follow-up (Section 5b):**
- Two FAQ-style dropdowns below the buy box: "What's in it?" and "Where do we ship?"
- Quarterly cadence option
- Quantity stepper (visitor still adjusts in the cart drawer)
- `/review-claims` pass on the new benefit list copy

### Section 6 — `CROBenefitCards` (Ketone-IQ pdp-stat-cards style, "Measured, not marketed.") ✅

Scoped + shipped 2026-05-26, with copy + layout revisions across `6fdb05a`, `6c79a47`, `9b8d513`, `1a7e93d`, `876ed74`, `3fa7ea4`. Rolls under SCRUM-1035; no separate sub-ticket.

- **H2:** "Measured, not marketed."
- **Subline:** "Sharper focus, faster recall, stronger memory, calmer days, all anchored in real data."
- **Title-bar tile** (its own grey rectangular tile spanning the grid width, between subline and stat tiles): `Taking **CONKA** can help you:` — uppercase, centered, "CONKA" in navy + extrabold. Same `bg-black/[0.04] rounded-[16px]` aesthetic as the stat tiles so it feels like part of the grid system. Mirrors Ketone's `pdp-stat-cards-block__title-bar` pattern.
- **Layout:** 2x2 grid of square stat tiles (`grid-cols-2 gap-3 aspect-square`). Soft `bg-black/[0.04] rounded-[16px]` cards, centered content. Each tile carries an `(01)..(04)` mono index in the top-left corner, an uppercase verb-infinitive headline, and a big navy `tabular-nums` stat. **No captions** — the headline is the only line of copy on each tile so it has to read cleanly on its own.
- **Four-dimension framework** (one tile per dimension, no overlap), ordered to lead with the strongest claims:
  - **(01) Memory** | "REMEMBER MORE" | `+63%` | Bacopa monnieri / Small 2018 / PMID 29246725 (active in Clear)
  - **(02) Calm** | "STAY CALMER" | `−28%` | Lemon Balm / Kennedy 2006 / PMID 16444660 (active in Flow)
  - **(03) Focus** | "FOCUS INTO THE NIGHT" | `+1.09 pts` | CONKA in-app data, n=74 evening-dip tests, per-user delta from `appInsightsData.timeOfDay`
  - **(04) Speed** | "THINK FASTER" | `−41 ms` | CONKA in-app data, n=15 users with both conditions, from `appInsightsData.mentalFatigue` CONKA sub-section
- **Tile headlines use verb-infinitive form** ("Remember more" / "Stay calmer" / "Focus into the night" / "Think faster") so the title-bar tile reads continuously into each one: "Taking CONKA can help you: remember more / stay calmer / focus into the night / think faster."
- **References footer** (Ketone-IQ pdp-stat-cards-block__footer style), pushed up in prominence (text size 10px → 11px, opacity black/45 → black/60) to compensate for the captions being removed. A single flowing paragraph with numbered references keyed to the tile indexes:
  - `01.` Small et al. (2018). Bacopa monnieri, 12-week clinical trial on memory performance. PMID 29246725.
  - `02.` Kennedy et al. (2006). Melissa officinalis (Lemon Balm), randomised double-blind placebo-controlled crossover on stress and anxiety. PMID 16444660.
  - `03.` CONKA in-app cognitive tests, evening-dip window, n=74 / 712 users / 30 months. Per-user delta methodology.
  - `04.` CONKA in-app cognitive tests, fatigued-day window, n=15. Per-user delta methodology.
- **Disclaimer line** below the references: "Ingredient findings as published, not extrapolated to product-level effect. Full per-user app data and methodology at /app-insights."
- **No CTA in Section 6.** Conversion already happened at Section 5; this is the proof beat.
- **Files:**
  - New: `app/components/cro/CROBenefitCards.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (inserted between Section 5 buy box and the legacy testimonials)
- **Section background:** `brand-bg-white` (V2 white run continues). Standard `paddingTop: 0, paddingBottom: 4rem`.

**Future enhancement (deferred):** if we want "see the data" detail per tile, the natural path is a modal sheet keyed off the tile id. The `(01)..(04)` index in the corner is the obvious tap affordance. Footer link to `/app-insights` already covers the full report for visitors who want the deep dive.

**Flags carried into launch:**
- All four metric and headline strings are claims-load-bearing. `/review-claims` pass needed before merge. Tile structure makes per-tile copy swaps trivial if compliance flags any individual line.

### Section 7 — `CROAthletes` (athlete carousel + Informed Sport block)

Scoped + shipped 2026-05-26 across `bcfc18f`, `9dec480`, `137c317`, `8bf99bc`, `8b76695`. Rolls under SCRUM-1035; no separate sub-ticket.

- **H2:** "Trusted where focus can't fail." (connective tissue with the Section 2 brand-story line "Trusted where focus isn't optional")
- **Subline:** "Olympic medallists, world champions, and international competitors use CONKA on the days that matter most."
- **Active slide layout** (one bordered card containing image + text):
  - `border border-black/12 rounded-[var(--brand-radius-container)] overflow-hidden bg-white` container
  - Portrait at `aspect-[4/3]` (shorter than square so the card is less tall and the quote dominates)
  - Prev/next circular arrow buttons overlaid on the portrait, vertically centered, white-on-navy chevron with `focus-visible` ring only (no click-focus visual)
  - Below the portrait, padded content: athlete name (`text-[24px] semibold`), then `sport · role` line, then the quote rendered very large (`text-[22px] sm:text-[24px] font-medium`) as the visual hero. Big readable quote was the explicit upgrade brief.
- **Roster strip below the active slide:**
  - 7 square 88px tiles with `rounded-[14px]` outer border. Image takes the upper portion (flex-1), first name sits in a small label area at the bottom of the same card. No inner divider between asset and name.
  - Active tile: `border-[#1B2757]`. Inactive: `border-black/12 opacity-75`. Focus ring uses `focus-visible` only (keyboard) so click-and-active state is a single navy border, not the previous border + offset-ring double line.
  - Strip lives inside the brand-track padding (no `-mx-5 px-5` edge-bleed) so first and last tiles have natural breathing room.
  - All V1 clinical noise removed: no `01.` prefix, no chamfered `lab-clip-tr` nav, no mono `RUGBY 7s · OLYMPIC` chips.
- **Roster sits BELOW the active slide.** Considered above; below wins because the H2 + subline already deliver the breadth claim, and the visitor's first emotional hit should be a face + quote, not a row of thumbnails. Strip becomes "want more?" navigation rather than a blocker.
- **Mechanics:** `useState` active index, touch swipe (50px threshold, ported from V1), keyboard arrow keys, tap roster to set active, tap on-slide arrows. `aria-live="polite"` on the active slide wrapper for screen readers.
- **Informed Sport block** below the carousel (inside the same section):
  - Container: `bg-black/[0.04] rounded-[var(--brand-radius-container)] p-6 sm:p-8`, centered content
  - Eyebrow: `QUALITY & TESTING` (navy uppercase, tracked)
  - Title: "Independently tested. Every batch." (`text-[26-28px] semibold`)
  - `/public/logos/InformedSportLogo.png` rendered at 160x160 (bumped from initial 128px for more presence)
  - Body copy lifted verbatim from `WhyConkaWorksDesktop.tsx` (legally vetted, already live), with key facts bolded inline: `**Informed Sport**`, `**280 banned substances**`, `**WADA**`, `**Olympic committees**`. First-scan eye-catching.
  - Closing line: "No exceptions. No shortcuts." (navy uppercase, tracked) — short confident close.
- **No CTA in Section 7.** Trust beat after Section 5 conversion and Section 6 numerical proof.
- **Files:**
  - New: `app/components/cro/CROAthletes.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (inserted between `CROBenefitCards` and the legacy `CROTestimonials`)
  - Untouched: `app/components/AthleteCredibilityCarousel.tsx` — still imported by `/conka-flow`, `/conka-clarity`, `/conka-both` PDPs. The V1 file stays so those pages don't regress.
- **Section background:** `brand-bg-white`. Standard `paddingTop: 0, paddingBottom: 4rem`.

**Flags carried into launch:**
- The subline is new copy ("on the days that matter most") and the Informed Sport block closing line ("No exceptions. No shortcuts.") are new — `/review-claims` pass needed before launch.
- All seven athlete quotes are already live on the clinical PDPs so no fresh claims work needed there.
- Main Informed Sport body sentence is verbatim from existing site content; only the surrounding structure changed.

### Section 8 — `CROResearch` (Ketone-IQ "World-Class Research" pattern)

Scoped + shipped 2026-05-26 across `58a5f4d`, `9410e6d`, `df47951`. Rolls under SCRUM-1035; no separate sub-ticket.

- **Layout:** mirrors Ketone-IQ's `content-section content-section__image` + `content-section__content` pattern: a hero image spread at the top, then the title, then a partner-logo strip, then a left-aligned aspirational description.
- **Hero image:** `/public/UniversityOfCambridge.png` (Cambridge college photograph). Renders full-bleed on mobile via the V2 hero-image edge-break pattern (`-mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[var(--brand-radius-container)]`) so it touches the screen edges on mobile but stays contained with rounded corners on md+. `aspect-[4/3]` so it does not dominate the vertical rhythm.
- **Title:** two lines, centered, large. "World-Class Research." / "World-Class Results." `text-[34px] sm:text-[38px] font-semibold`. Same-name as Ketone's headline; CONKA earns it via the Cambridge / Durham / Exeter relationships.
- **Partner logo strip:** centered row of three logos under the title, with `gap-6 sm:gap-10 flex-wrap`. Sized `110x80` on mobile and `140x100` at sm+ (bumped up so the credentials carry visual weight). Logos: `/logos/UniversityOfDurham.png`, `/logos/UniversityOfExeter.png`, `/logos/MadeInBritain.png`. All `object-contain`.
- **Description:** left-aligned (not centered) so it reads as a confident declarative statement, not a ceremonial caption. "Our research is led by experts in cognitive science and brain performance. We work with leading UK universities and research labs, pioneering new ways for anyone to access elite-level focus." Two-sentence adaptation of the Ketone copy; "leading UK universities and research labs" is intentionally hedged to stay defensible.
- **What got dropped versus the first ship:** the "Cambridge cognitive test" story (eyebrow + card title + body sentence + credentials chips) was removed when the layout pivoted to the Ketone pattern. That story still lives elsewhere on the site (`HowThisIsPossibleModule`, `AppResearchModal`, `LandingDisclaimer`). Section 8 now stands as a broader research-credibility moment.
- **No CTA in Section 8.** Trust beat after Section 5 conversion + Section 6 numerical proof + Section 7 athletes/Informed Sport.
- **Files:**
  - New: `app/components/cro/CROResearch.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (inserted between `CROAthletes` and the legacy `CROTestimonials`)
  - New asset: `/public/UniversityOfCambridge.png` (Cambridge college photograph)
- **Section background:** `brand-bg-white`. Standard `paddingTop: 0, paddingBottom: 4rem`.

**Flags carried into launch:**
- Description copy is new (loosely adapted from Ketone). Specifically the phrase "leading UK universities and research labs" and "elite-level focus" should be reviewed by `/review-claims` before merge. "Leading UK universities" is defensible; "elite-level focus" is aspirational marketing language that could be tightened if compliance wants more conservative phrasing.

### Section 9 — `CROCustomerReviews` (V2 reskin of LandingTestimonials)

Scoped + shipped 2026-05-26. Rolls under SCRUM-1035; no separate sub-ticket.

- **Pure visual reskin.** Same data (`CURATED_TESTIMONIALS` from `app/lib/customerTestimonials.ts`, 8 testimonials all with photos). Same carousel mechanics ported verbatim from `LandingTestimonials.tsx`. No new copy, no claims work.
- **H2:** "Real people. Real results." (kept from V1)
- **Subline:** "Eight stories from the people who use CONKA every day." (replaces V1's mono `N=500+ · Verified reviews`)
- **Card structure (V2):**
  - Photo at the top of each card, `aspect-[4/3]`, `object-cover` (was bottom in V1)
  - One bordered card per slide (`border border-black/12 rounded-[var(--brand-radius-container)]`), no internal dividers
  - Rating row: gold filled SVG stars (`#F59E0B`, matches hero trust micro-row) + product label on the right
  - Headline (semibold sans), body (truncated at 200 chars with bold navy "Read more" / "Show less"), name + month/year attribution
  - Date formatted as "Mar 2026" via `Intl.DateTimeFormat`, not the V1 mono ISO string
- **Removed V1 clinical noise:**
  - Mono `// Field observations · PROOF-03` eyebrow
  - Mono `N=500+ · Verified reviews` subline
  - Per-card `SpecHeader` (black tick badge + mono `Verified · YYYY-MM-DD` + mono `4.5/5` + hairline-character stars + mono product label + hard dividing border)
  - Hanging mono open-quote
  - Chamfered `lab-clip-tr` navy nav buttons
  - Hard-pixel dot indicators (`bg-black w-4 h-1.5` active, `bg-black/20 w-1.5 h-1.5` inactive)
- **Mechanics preserved verbatim:** `CARD_WIDTH_MOBILE = 300`, `CARD_WIDTH_DESKTOP = 340`, `GAP = 16`, `AUTO_ADVANCE_MS = 3500`, `TRANSITION_MS = 600`, `RESUME_DELAY_MS = 5000`, `CHAR_LIMIT = 200`, `SWIPE_THRESHOLD = 50`. 3x render for infinite loop, `pos` + `smooth` + `isPaused` + `expandedIndex` state machine, pause-on-hover, pause-on-touch, pause-on-expand. Auto-advance kept — testimonials are passive proof; auto-advance shows breadth without requiring engagement.
- **Navigation:**
  - Desktop: circular white-background arrow buttons overlaid on the carousel sides (Section 7 pattern), `focus-visible` ring only.
  - Mobile: dot indicators below the carousel. Active dot is navy `w-5 h-2` pill; inactive are `bg-black/15` circles.
- **No CTA in Section 9.** Conversion already happened at Section 5.
- **Files:**
  - New: `app/components/cro/CROCustomerReviews.tsx`
  - Modified: `app/start/CROBelowFold.tsx` — swapped the existing dynamic-imported `CROTestimonials` slot for the new V2 component. Kept the `VisibilityGate` wrapper (raised `minHeight` to `680px` to match the new card-with-photo height). Standardised V2 section spacing applied (`paddingTop: 0, paddingBottom: 4rem`).
  - Untouched: `app/components/landing/LandingTestimonials.tsx` — still serves `/conka-flow`, `/conka-clarity`, `/conka-both`, `/protocol/[id]`, `/`.
  - Untouched: `app/lib/customerTestimonials.ts` — shared catalogue.
- **Section background:** `brand-bg-white`.

**Flags carried into launch:**
- One new copy string: the subline "Eight stories from the people who use CONKA every day." — quick `/review-claims` pass before merge, but low risk (it's just a count + neutral framing).

### Section 10 — `CROAppCallout` ("We don't ask if CONKA works. We measure it.")

Scoped + shipped 2026-05-26. Rolls under SCRUM-1035; no separate sub-ticket.

- **Thesis:** "Don't trust us, test yourself." By Section 10 the visitor has seen all the proof; the remaining objection is "what if it doesn't work for me." The section answers: the CONKA app gives you the same cognitive test we use for every in-app metric on the page. Take it before, take it after. If your data doesn't move, the 100-day money-back guarantee means you don't lose money. Literally no risk.
- **Layout:** mirrors the Section 8 hero pattern. Lifestyle image at the top (full-bleed mobile via `-mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[var(--brand-radius-container)]`), then H2, opener, body, risk-close card, CTA, small `/app` text link.
- **Hero image:** `/public/lifestyle/ConkaAppYoga.jpg` — phone displaying the CONKA app's "Your Brain Over Time" graph next to a CONKA bottle on a textured floor. Strong single asset for the section.
- **H2 (verbatim from `InsightHeroDifferentiator.tsx`):** "We don't ask if CONKA works. We measure it." Two lines via `<br />`.
- **Opener (verbatim from `AppUSPSection.tsx`):** "Other brands tell you it works. CONKA gives you a cognitive test and a daily log so you can watch it happen."
- **Body 1 (verbatim from `AppFeaturePanel.tsx`):** "This isn't an IQ test. It measures how efficiently your brain processes information, tracked over time."
- **Body 2 (verbatim from `AppFeaturePanel.tsx`):** "Built on Cambridge-derived visual recognition. Because it uses natural images, your brain can't learn or memorise the answers. Your score only improves if your brain actually improves."
- **Risk-close card** (soft grey, `bg-black/[0.04] rounded-[var(--brand-radius-container)]`):
  - Eyebrow: `NO RISK. REAL NUMBERS.` (navy uppercase tracked)
  - Body: "Take the test. Try CONKA. Take the test again. If your data doesn't move, we'll refund you within 100 days." (pulls `GUARANTEE_DAYS` from `offerConstants.ts` so the number stays in sync if marketing changes the policy)
- **CTA:** full-width `CROPillCTA` "Try CONKA risk-free" pointing at `FUNNEL_URL`. The page is closing toward conversion at this point; the section's job is the final argument before Section 11.
- **/app link** below the CTA as a small navy text link "Learn more about the app →". Sized so it does not compete with the funnel CTA.
- **No App Store / Play Store download badges in this section** (per user direction — Section 10 pushes for the sale, not app downloads).
- **Files:**
  - New: `app/components/cro/CROAppCallout.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (inserted between `CROCustomerReviews` and the legacy `CROGuarantee`)
  - Untouched: `app/components/home/AppUSPSection.tsx` — still serves the home page `/`
- **Section background:** `brand-bg-white`. Standard `paddingTop: 0, paddingBottom: 4rem`.

**Flags carried into launch:**
- The risk-close card body is new copy ("Take the test. Try CONKA. Take the test again. If your data doesn't move, we'll refund you within 100 days.") — `/review-claims` pass before launch but low risk; it's just a paraphrase of the guarantee terms.
- Every other load-bearing sentence is lifted verbatim from existing site components.

### Section 11 — `CROFAQv2` ("Still wondering?")

Scoped + shipped 2026-05-26 in `bb05a6d`. Rolls under SCRUM-1035; no separate sub-ticket.

- **H2:** "Still wondering?" (replaces V1's generic "Frequently asked questions")
- **Question set — curated and reordered** to remove overlap with Section 5's buy-box FAQ and to flow broadest-product to narrowest-practical:
  1. **Why two formulas instead of one?** (NEW; first half of the answer lifted from `storyData.ts`, last sentence rewritten to frame both Flow and Clear as DAILY rituals rather than the V1's "daily / for recovery" split: "...So we developed two formulas designed to work together, taken daily: Flow in the morning for consistent focus, Clear in the afternoon for consistent clarity.") — reinforces Section 4's AM/PM system
  2. **Can I take just one shot?** (V1 Q3, verbatim) — product flexibility
  3. **How quickly will it arrive?** (V1 Q4, verbatim) — logistics
  4. **What if my score doesn't improve?** (V1 Q1, verbatim — already pulls `GUARANTEE_LABEL_FULL` and `GUARANTEE_COPY_TRIAL` from `offerConstants`)
  5. **How do I cancel?** (V1 Q5, verbatim — same constants approach)
- **Dropped from V1:** "What's the difference between Flow and Clear?" — duplicates Section 5's "What's in it?" panel.
- **Accordion mechanic** ported verbatim from Sections 4 / 5 / 9: soft `bg-black/[0.04] rounded-[16px]` pill rows, `aria-expanded` + `aria-controls`, `max-height` transition (200ms ease-out), single-open behaviour via `useState<string | null>(openId)`, plain `+` / `−` indicator on the right edge. All collapsed on first paint.
- **V1 clinical chrome stripped:**
  - Mono `// Common questions · FAQ-01` eyebrow
  - Numbered `01.` prefix on each row
  - Category eyebrow chips (TRIAL / PRODUCT / SHIPPING / SUBSCRIPTION)
  - Hard bordered outer FAQ container with hairline divider between rows
  - Mono `[+]` / `[−]` toggle
  - Black left-border "Response" answer treatment
  - Mono "Avg response 4h" footer
- **Contact footer kept** in V2 style: "Still stuck? info@conka.io" as a soft centred line with a navy underlined email link.
- **No CTA inside the section.** The legacy `CROFinalCTA` block that previously sat after the FAQ has been removed (per user direction on 2026-05-26); the conversion CTAs in Sections 5 and 10 close the page. `LandingDisclaimer` is now the section immediately after the FAQ.
- **Files:**
  - New: `app/components/cro/CROFAQv2.tsx`
  - Modified: `app/start/CROBelowFold.tsx` (swapped the dynamic-imported `CROFAQ` slot for `CROFAQv2`; applied standard V2 spacing; background switched from `brand-bg-tint` to `brand-bg-white` to continue the V2 white run)
  - Untouched: `app/components/cro/CROFAQ.tsx` (no other consumers, kept on disk for revert per the V2 pattern)
- **Section background:** `brand-bg-white`. Standard `paddingTop: 0, paddingBottom: 4rem`.

**Flags carried into launch:**
- One new Q+A pair ("Why two formulas instead of one?") lifted verbatim from `storyData.ts` — already-vetted copy, low risk for `/review-claims`.
- The other four Q+A pairs are verbatim from V1.

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
