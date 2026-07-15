# FAQ system

How customer-facing FAQ content is stored, selected per surface, rendered, and turned into FAQPage schema. Built under the SEO / AEO programme (Phase 10, SCRUM-1143).

## Overview

There is **one FAQ dataset** (`app/lib/faqContent.ts`). Every consumer surface selects a subset of it, renders that subset, and builds its FAQPage JSON-LD **from the same subset** so the schema never describes a question the page does not show. The `/faq` hub renders the full set; product and marketing surfaces render short curated subsets.

The one deliberate exception is `/professionals`, whose FAQ is B2B-specific and lives in its own `TEAM_FAQS` (see `app/components/b2b/TeamFAQ.tsx`). The Flow/Clear PDPs add a few product-specific questions from `formulaContent`; everything else reads from `faqContent.ts`.

## Single source of truth

`app/lib/faqContent.ts`:

- `FAQ_ITEMS: FaqItem[]` — every question. `FaqItem = { id, question, answer, category }`.
- `FaqCategory` — `about | efficacy | safety | usage | app | commercial | support`. Drives grouping on the hub.
- `CONVERSION_FAQ_IDS` / `CONVERSION_FAQ_ITEMS` — the curated ~9-question conversion subset, resolved in an explicit order (the conversion arc, not the hub's category order). Resolution **throws at module load** on an unknown id, so a typo fails the build.
- `PDP_TRUST_FAQ_IDS` — the shared answers grafted onto the Flow/Clear PDPs (currently `side-effects`, `do-nootropics-work`). Kept to generic, non-intense questions; the drug-test answer is hub-only because it reads too heavy on a product page.
- `pickFaqItems(...ids)` — resolve specific items by id, in order; throws on unknown id.
- `stripClaimAnchors(text)` — removes claim anchor glyphs (`†`) for surfaces/schema that do not render the footnote.

`app/lib/formulaFaq.ts`:

- `getFormulaPdpFaqItems(formulaId)` — a formula's product-specific questions (`formulaContent[id].faq`, given synthetic ids) **plus** `PDP_TRUST_FAQ_IDS`. One source for both the Flow/Clear accordion and its schema.

`app/lib/ingredientFaqContent.ts`:

- `INGREDIENT_FAQ_ITEMS` — per-ingredient benefit + side-effect questions for `/ingredients` (separate dataset; targets the highest-volume ingredient search terms).

## Surface → subset map

Every row's rendered questions and schema come from the **same** list.

| Surface | Renders | Component | Subset | Schema built from |
|---|---|---|---|---|
| `/faq` hub | full set, grouped by category | `FaqHub` | `FAQ_ITEMS` | `FAQ_ITEMS` |
| `/` home | conversion subset | `LabFAQ` | `CONVERSION_FAQ_ITEMS` | `CONVERSION_FAQ_ITEMS` |
| `/conka-both` | conversion subset | `LabFAQ` | `CONVERSION_FAQ_ITEMS` | `CONVERSION_FAQ_ITEMS` |
| `/conka-flow` | product + trust | `LabFAQ` | `getFormulaPdpFaqItems("01")` | same |
| `/conka-clarity` | product + trust | `LabFAQ` | `getFormulaPdpFaqItems("02")` | same |
| `/start`, `/start-b` | conversion subset | `CROFAQv2` | `CONVERSION_FAQ_ITEMS` | none rendered on page |
| `/lander`, `/lander-b` | conversion subset | lander `FAQ` | `CONVERSION_FAQ_ITEMS` | none |
| `/ingredients` | ingredient FAQ | `IngredientFAQ` | `INGREDIENT_FAQ_ITEMS` | `INGREDIENT_FAQ_ITEMS` |
| `/go/[slug]` listicles | config-supplied | `CROFAQv2` (items prop) | landing config | none |
| `/professionals` | B2B FAQ | `TeamFAQ` | `TEAM_FAQS` (own) | `TEAM_FAQS` |

Categories that appear **only** on the hub (not in any conversion subset or PDP graft): the deep `safety` cluster, `app`, and `support`. Adding an item to one of those categories surfaces it on `/faq` and nowhere else.

## The schema == visible rule

`buildFaqSchema(items)` (`app/lib/jsonLd.tsx`) serialises whatever list it is handed. Google's policy forbids FAQPage schema describing content the page does not render, so **each surface must pass the schema builder the exact list it renders.** This is why the PDP schema goes through `getFormulaPdpFaqItems` rather than restating the questions. `buildFaqSchema` strips HTML and claim anchors, so schema answers are clean plain text.

## Claims anchors

Convention (see `docs/branding/CLAIMS_COMPLIANCE.md`): a claim glyph in copy must have a matching visible footnote on the same page.

- `†` — "clinically dosed" (doses match published studies). Present on the `underdosed` answer only, which is hub-only, so the single paired footnote lives on `/faq`.
- `††` — EFSA-authorised Vitamin C / B12 wording. **Removed** from the FAQ dataset: the two answers that used it were reworded to a plain Vitamin C mention, so no conversion surface has to carry a footnote.

Do not reintroduce the previous hack of stripping the glyph per-surface while keeping the authorised wording: either render the footnote wherever the claim shows, or reword to avoid the authorised phrasing.

## Disclosure policy (hard constraint)

No per-ingredient mg and no formula-share percentages in client code, rendered or not (data files ship in the JS bundle). Publishable: the **total active load**, **study doses labelled as the study's** (never "per serving"), and **Vitamin C / B12 %NRV**. Ingredient FAQ answers cite the study and its dose, never CONKA's per-ingredient amount, and `/ingredients` carries a footnote saying so. See `docs/product/FORMULATION_SPEC.md` for the full rationale.

## Key files

| File | Purpose |
|------|---------|
| `app/lib/faqContent.ts` | The dataset, categories, conversion subset, PDP trust ids, helpers |
| `app/lib/formulaFaq.ts` | `getFormulaPdpFaqItems` — PDP list (product + trust), one source for accordion and schema |
| `app/lib/ingredientFaqContent.ts` | `/ingredients` per-ingredient FAQ dataset |
| `app/lib/jsonLd.tsx` | `buildFaqSchema`, `JsonLd` |
| `app/components/faq/FaqHub.tsx` | `/faq` hub; renders every category as a section (add a `SECTIONS` row for a new category) |
| `app/components/landing/LabFAQ.tsx` | Shared accordion for home, `/conka-both`, and the Flow/Clear PDPs (`items` + `image` props) |
| `app/components/cro/CROFAQv2.tsx` | `/start` accordion (`showSeeAllLink` opts the `/go` landers out of the hub link) |
| `app/components/ingredients/IngredientFAQ.tsx` | `/ingredients` accordion |
| `app/lander/sections/FAQ/FAQ.tsx` | Lander accordion (noindex) |
| `app/faq/page.tsx` | Hub page + metadata + hub schema + the `†` footnote |

## Gotchas

- **Add a question:** add to `FAQ_ITEMS` with a `category`. It appears on `/faq` automatically. To also show it on conversion surfaces, add its id to `CONVERSION_FAQ_IDS`; on the PDPs, to `PDP_TRUST_FAQ_IDS`.
- **Add a category:** extend the `FaqCategory` union **and** add a `SECTIONS` row in `FaqHub.tsx`, or the questions render nowhere on the hub.
- **`LabFAQ` panel height:** answers are clipped by a `maxHeight` on the animated panel. The longest current answer (`do-nootropics-work`, on the PDPs) is the constraint; bump the value if a longer answer is added.
- **Do not restate PDP questions in the layout schema.** Always go through `getFormulaPdpFaqItems`, or the schema and the accordion will drift.
- **Noindex surfaces** (`/go`, `/lander*`) render a subset but carry no schema and no hub link (paid-traffic funnels should not leak off-funnel).

## References

- Original plan (superseded by this doc): build history in git, SCRUM-1143.
- SEO / AEO canonical reference: `docs/seo-aeo/README.md`.
- Claims rules: `docs/branding/CLAIMS_COMPLIANCE.md`.
- Disclosure policy source: `docs/product/FORMULATION_SPEC.md`.
