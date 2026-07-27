# 2026-07 Ad-Spend Sprint — £300/day Listicle Trial

**Window:** Fri 24 Jul → ~Fri 7 Aug 2026 (2 weeks) · **Spend:** £300/day Meta · **Status:** live
**Data:** [LISTICLE_PERFORMANCE.md](../analytics/LISTICLE_PERFORMANCE.md) · **Dashboard:** <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>

## What this is

A two-week trial of increased Meta spend (£300/day) pointed at the three persona listicles, to learn which persona and which content actually converts before committing to a larger budget. It sits under the [Landing Conversion Programme](../development/featurePlans/landing-conversion/README.md) — the personas × formats push — and is the first real spend behind the listicle format.

Two things landed together on **Friday 24 July**, which is why that date is the analytics floor for everything:
1. **The spend increase** to £300/day.
2. **Section-level analytics** (`listicle:section_viewed`, `listicle:cta_clicked`) went live — the first time we can see behaviour *inside* a listicle, not just that it was visited.

## Context: the Magic Mind refactor

The listicles were rebuilt into a Magic-Mind-style editorial format ahead of this trial. Two templates now exist (`mm` editorial / `im8` evidence-dense — see [LISTICLE_SYSTEM.md](../features/LISTICLE_SYSTEM.md)); the three persona pages in this trial are all `im8`:

| Persona | Slug | Signature interactive block |
|---------|------|-----------------------------|
| ADHD | `/go/adhd-listicle` | Symptom picker (self-identify) |
| Productivity | `/go/productivity-listicle` | — |
| Brain-ageing | `/go/brain-ageing-listicle` | Men/women segment toggle |

## Goals

1. **Which persona converts most** — rank the three on the deepest attributable signal.
2. **Which section drives it** — find the content doing the conversion work, and the drop-off points.
3. Feed the [programme target](../development/featurePlans/landing-conversion/README.md): a measurable 1–4% (aim 3%) conversion loop per landing.

## What we're measuring

CTA-click is the working conversion signal (every listicle CTA hands off to a PDP). Scroll depth (`section_viewed`) is the denominator. Active-intent (`listicle:interaction`) was added at the close of the first window to capture symptom/segment engagement. Full method and queries: [LISTICLE_PERFORMANCE.md](../analytics/LISTICLE_PERFORMANCE.md).

## First read (24–27 Jul baseline)

| Persona | Visitors | CTA rate | Role |
|---------|---------:|---------:|------|
| ADHD | 713 | 7.2% | Volume leader — keep fed |
| Brain-ageing | 226 | 11.5% | Efficiency leader — underfed, scale it |
| Productivity | 545 | 2.4% | Leaking — hero fails to earn the scroll (83% bounce before reason 1) |

**Section insight:** clicks come from the **hero + sticky bar**, not the body reasons. The body's job is retention — getting people deep enough for the sticky bar to catch them. That's exactly where ADHD wins and Productivity collapses.

## Open decisions / to resolve during the trial

- **Route listicle CTAs at the funnel, not the classic PDP?** Purchase attribution (`?src=<slug>-<section>` → `purchase:add_to_cart.source`, SCRUM-1177) is **wired and deployed correctly** — but returns ~zero because listicle CTAs land on the classic PDPs (`/conka-flow` etc.), which barely produce tracked add-to-carts. Real purchases run through the funnel path, which skips the cart and goes straight to Shopify checkout. Pointing listicle CTAs at the funnel would both lift conversion and make purchases attributable. Cheap, front-end only — **not** the deep Shopify product/SKU tagging (that's distributor-sensitive and out of scope here).
- **Rework or cut Productivity's hero** before spending more on it.
- **Shift budget share toward Brain-ageing** to test whether 11.5% holds at volume.

## Not in scope

- Shopify product/SKU-level persona tagging (distributor-sensitive; deferred).
- A/B infrastructure — an iteration is a new slug, per the programme.

## Links

- Data log: [LISTICLE_PERFORMANCE.md](../analytics/LISTICLE_PERFORMANCE.md)
- Programme: [Landing Conversion Programme](../development/featurePlans/landing-conversion/README.md)
- Mechanics: [LISTICLE_SYSTEM.md](../features/LISTICLE_SYSTEM.md)
