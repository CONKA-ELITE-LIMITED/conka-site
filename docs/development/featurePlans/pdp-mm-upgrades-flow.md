# PDP Magic-Mind Upgrades - Flow

Mobile-first upgrades to the CONKA Flow PDP (`/conka-flow`), continuing the Simple DTC
reposition shipped in SCRUM-1171. Inspired by Magic Mind's updated PDP: tighten the
decision surface above the fold, and replace the below-fold education with a single
browsable ingredient-led section. Flow only for now; Clear and Both follow once the
patterns are proven.

## Problem

Paid traffic (our highest-cost segment) lands on the PDPs. Post-1171 the hero is Simple
DTC, but the buy area still carries per-card fine print on every plan (tall, busy), gives
the shopper no single summary of what the chosen subscription actually delivers, and the
below-fold education is spread across two overlapping components (`FormulaBenefitsPillars`
+ `ClinicalIngredients`) with long prose. Magic Mind's PDP is faster to read and easier to
scan on a phone. These changes close that gap on the surface where warm, high-intent
traffic converts.

## Who it serves

Cold-to-warm paid traffic on mobile (74% of visits) evaluating a Flow subscription.

## Business impact

Acquisition / CRO plus subscription mix. A clear, dynamic subscription summary reduces
purchase anxiety at the decision point; a tighter pricing widget lowers cognitive load; a
scannable ingredient section keeps evaluators on the page instead of bouncing to research
elsewhere.

## Design language

Simple DTC (DESIGN_SYSTEM.md §8.5): rounded pills/cards, filled navy `#1B2757` primary,
green `#1a7f4f` savings accent, light-navy `#eef0f5` tint strips, soft shadows/rings
allowed. The page keeps its `.brand-clinical` wrapper for token inheritance only; that
zeroes the `--brand-radius-*` tokens but NOT Tailwind `rounded-*` utilities, so Simple DTC
cards render correctly. Use `rounded-md` (cards/controls), `rounded-lg` (tiles),
`rounded-full` (pills).

## Appetite

Scale B per ticket (roughly a day each). Three tickets, sequenced A then B then C.

## Phases / tickets

| Phase | Ticket | Description | Status |
|-------|--------|-------------|--------|
| A | Dynamic subscription box | Summary card under the CTA that rewrites from the selected plan | Not Started |
| B | Pricing widget tightening | Collapse plan cards so only the selected one expands its detail | Not Started |
| C | Ingredient-led benefits | New outcome-grouped ingredient accordion component | Not Started |

Copy tightening (originally a fourth piece) is folded into B (hero/plan copy) and C
(benefit copy) rather than a standalone ticket, so it ships with the surface it touches.

---

## Ticket A - Dynamic "Your subscription" box

**What:** A summary card rendered directly under the Add-to-Cart button and the buy-once
link (Magic Mind position), that rewrites itself from the currently selected plan. Monthly
shows "20 shots delivered monthly, first delivery 28 shots incl. 8 free, save 43%, cancel
anytime". Quarterly shows "60 shots every 3 months, 80 first delivery incl. 20 free, save
63%...". It reads from the same `cadenceData` pricing the plan cards use, so it stays in
sync automatically.

**Approach:** New `SubscriptionSummary` component (in `ProductBuyPanel.tsx` or a sibling
file), taking `formulaId` + `selectedCadence`. Derives lines from
`getCadencePricingByProductHeroId`: `shotCount`, cadence word, `firstOrderShots`,
`freeShots`, `getDisplayDiscount`. Green tick/dot bullets, one highlighted free-shots line.
Rendered once inside `ProductBuyPanel` so it appears on both the mobile hero and the
desktop buy column.

**Tasks:**
1. **Frontend - SubscriptionSummary component** - Small - build the dynamic card; lines
   derived from cadence pricing, one highlighted free-shots line. Files:
   `app/components/product/ProductBuyPanel.tsx` (or new
   `app/components/product/SubscriptionSummary.tsx`).
2. **Frontend - Mount + de-duplicate** - Small - render it after the buy-once link and
   before/instead of the redundant lines in `TrustBar`; ensure no duplicate
   shipping/guarantee/cancel messaging stacks up. Files: `ProductBuyPanel.tsx`.

**Mobile:** Card is full-width, bullets wrap cleanly at 390px, no horizontal overflow.

**Out of scope:** Clear/Both PDPs (Flow only), any pricing/variant changes, plan-card
restyle (that is ticket B).

## Ticket B - Pricing widget tightening

**What:** Collapse the two `FlatPlanCard`s so each unselected card is a compact one-line
row (radio + shot count + price + save pill), and only the selected card expands its
detail. Today every card shows a manual "Learn more" disclosure with the full subscription
benefits list, making the widget tall and repetitive. Fold the "what you get" detail into
ticket A's summary box so the cards can stay lean.

**Approach:** Refactor `FlatPlanCard` / `PlanSelector` in `ProductBuyPanel.tsx`: drive the
detail open state off `isSelected` instead of a manual `<details>`; strip the per-card
benefits list (now owned by ticket A's box); tighten labels. Keep the compare-at price,
save pill, and per-shot line on the selected card.

**Tasks:**
1. **Frontend - Collapse plan cards** - Medium - selected-only expansion, compact
   unselected rows, tightened labels. Depends on ticket A (the summary box must own the
   benefits detail first). Files: `ProductBuyPanel.tsx`.
2. **Copy - Tighten hero + plan copy** - Small - shorten card labels and any hero lede
   prose to headline+checklist density. Files: `ProductBuyPanel.tsx`,
   `ProductHeroMobileV2.tsx`, `productHeroHelpers.ts`.

**Mobile:** Unselected rows are a single line at 390px; radios and the whole card are a
44px+ tap target; selected-card detail does not push the CTA off-screen.

**Out of scope:** Changing the cadence axis or adding pack-size options; pricing math.

## Ticket C - Ingredient-led benefits section

**What:** A new below-fold section that fuses our existing outcome-grouping and
ingredient-card patterns into Magic Mind's browsable layout. Three outcome buckets as
headings, each a stack of ingredient accordion cards (render icon + name + chevron),
expanding to a render image, a bold one-line claim, a short paragraph, and a "Studies
support" link. Replaces the current `FormulaBenefitsPillars` + `ClinicalIngredients`
sections on the Flow page only.

**Buckets (first cut, MM categories):**
- **Mental performance** - Lemon Balm, Ashwagandha
- **Sustained energy** - Rhodiola Rosea
- **Brain health** - Turmeric (with Black Pepper folded in as its absorption partner),
  Bilberry

Exact per-ingredient placement is a small curation call finalized in implementation; MM
categories are the starting point and can be readjusted later.

**Approach:** New `IngredientOutcomeAccordions.tsx`. Reuses ingredient records from
`ingredientsData.ts` (`getOrderedActiveIngredients("01")`): `name`, `image` (render),
`oneLineClaim`, `description`, and `keyStats[].source` / `clinicalStudies[].pmid` for the
studies link. The "Studies support" URL is derived from the first available `pmid`
(`https://pubmed.ncbi.nlm.nih.gov/{pmid}`); if an ingredient has no pmid, the link is
omitted rather than broken. Mount on `app/conka-flow/page.tsx`, removing the two sections
it replaces (Flow only; the old components stay for Clear/Both until those pages follow).

**Tasks:**
1. **Data - Bucket mapping + studies-link helper** - Small - a curated Flow bucket map
   (3 buckets to 6 ingredients, Black Pepper nested under Turmeric) and a helper that
   derives a PubMed URL from an ingredient's first pmid. Files: new component file and/or a
   small helper in `ingredientsData.ts`.
2. **Frontend - IngredientOutcomeAccordions component** - Medium - outcome headings +
   ingredient accordion cards (icon/name/chevron collapsed; render + bold claim +
   paragraph + studies link expanded). Files: new
   `app/components/product/IngredientOutcomeAccordions.tsx`.
3. **Frontend - Mount + retire old sections** - Small - render on the Flow page, remove
   `FormulaBenefitsPillars` + `ClinicalIngredients` from the Flow page only. Files:
   `app/conka-flow/page.tsx`.
4. **Copy - Tighten benefit copy** - Small - trim claims/descriptions to MM density where
   needed. Files: `ingredientsData.ts` (Flow entries only).

**Mobile:** Accordion cards are 44px+ tap targets, one-line collapsed; expanded render
images do not overflow at 390px; only reasonable stacking (multiple open allowed).

**Out of scope:** Clear/Both ingredient sections; adding new citation-URL fields to the
data model (we derive from existing pmid); new render photography.

---

## Rabbit holes / watch-outs

- **A/B overlap:** ticket A's box and ticket B's card simplification both touch "what you
  get" messaging. Ship A first so B has a home to move the benefits detail into; avoid
  leaving the same list in both places.
- **Studies link integrity:** derive PubMed URLs only where a pmid exists; never render a
  half-built or 404 link. Confirm the pmid values in `ingredientsData.ts` resolve.
- **Retiring old sections:** `FormulaBenefitsPillars` and `ClinicalIngredients` are still
  used by Clear/Both. Remove them from the Flow page only; do not delete the components.
- **Claims:** the bold ingredient claims touch quantified-health-claim territory. Run
  `/review-claims` before ship if desired; this is the owner's legality pass, not a build
  blocker.

## No-gos

- No Clear/Both changes in these tickets (Flow proves the pattern first).
- No pricing, variant, cadence-axis, or checkout changes.
- No new product photography or new data-model fields.

## Risks

- Removing two sections and adding one changes the Flow page's section rhythm; verify
  background alternation and spacing still read cleanly on mobile.
- The subscription box must never contradict the selected plan; it is the single source of
  the "what you're buying" summary, so keep it strictly derived from `cadenceData`.

## References

- Buy panel: `app/components/product/ProductBuyPanel.tsx`
- Mobile hero: `app/components/product/ProductHeroMobileV2.tsx`
- Page: `app/conka-flow/page.tsx`
- Ingredient data: `app/lib/ingredientsData.ts`; existing patterns:
  `FormulaBenefitsPillars`, `ClinicalIngredients`, `IngredientBottomSheet`
- Pricing: `app/lib/cadenceData.ts`, `app/lib/funnelData.ts`
- Design system: `docs/branding/DESIGN_SYSTEM.md` §8.5 (Simple DTC)
- Predecessor: SCRUM-1171 (PDP hero Simple DTC reposition, Done)

## Jira tickets

Epic SCRUM-763 (Website & CRO), Sprint 29. All three relate to SCRUM-1171 (predecessor).

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1207 | Flow PDP: dynamic "Your subscription" summary box | A | To Do |
| SCRUM-1208 | Flow PDP: tighten pricing widget (collapse plan cards) | B | To Do |
| SCRUM-1209 | Flow PDP: ingredient-led benefits section (outcome accordions) | C | To Do |

Sequencing: SCRUM-1207 blocks SCRUM-1208 (the summary box must own the benefits
detail before the plan cards drop it). SCRUM-1209 is independent and can run in parallel.
