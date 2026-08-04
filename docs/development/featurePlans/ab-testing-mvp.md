# A/B Testing — Lean MVP for a Headless Store

**Status:** Research / not built · **Date:** 2026-08-04 · **Owner:** Rudh

Goal: improve conversion rate on Meta-ad → listicle → PDP → checkout, by testing
big-swing changes on a low ad budget. This doc covers what the market tools
(Shoplift/Intelligems) actually do, why they don't fit our stack, and the
smallest system that gets us real answers using hooks we already have.

---

## TL;DR (the decision)

1. **Decision (2026-08-04): no third-party tool.** Shoplift/Intelligems are
   Shopify **theme-native** — they inject a script into `theme.liquid` and test
   Liquid templates in the theme editor. Our storefront is **headless Next.js**;
   those pages never render through the Shopify theme, so the tools could only
   test our hosted *checkout*, not the listicles/PDPs we want to test.
   ~$99–499/mo for zero coverage. Binned.
2. **Build a ~1–2 day self-hosted split-test** on primitives we already have:
   the `conka_uid` first-party cookie for sticky bucketing, the existing
   `?src=`/origin string to carry the variant into analytics **and** Shopify
   order tags for free, and the Convex `quizEvents` pattern to log exposures.
3. **Two split mechanisms, pick per test:** split at the **Meta ad-set level**
   (zero code — one landing URL per ad set) for listicle tests; split
   **on-site by cookie** for same-URL tests like the Both-PDP selector.
4. **Given our traffic, only test big swings and measure an up-funnel proxy**
   (landing→PDP CTR, or add-to-cart rate). Purchase is a directional check,
   not the significance gate. Small tweaks measured on a 3% purchase baseline
   would need ~100k visitors/variant — months we don't have.
5. **Accumulate a rolling window (~10+ days), don't judge on a single day.**
   Sticky `conka_uid` bucketing keeps returning visitors in their original
   variant across the whole window, so a longer run *adds* sample without
   double-counting. Hold conditions constant for the window (see §2).

---

## 1. What Shoplift (and Intelligems) actually offer

**Shoplift** — the "how pages *look*" tester. From $99/mo.
- Duplicate a **Shopify theme template**, edit it in the theme editor (no code),
  split traffic 50/50 via a script added after `<head>` in `theme.liquid`.
  No-flicker because the variant is decided server-side in the theme.
- Tests homepage, PDP, collection, landing, nav, mini-cart, whole-theme rebrands.
- Reports CVR, **revenue per visitor (RPV)**, AOV, CTR, with segments.
- "Lift Assist" auto-suggests proven sections (sticky ATC, trust badges, etc.).

**Intelligems** — the "how much you *charge*" tester. $49 redirects / $79 content /
$499 Plus for price/shipping/offer testing with profit-based reporting.

**Why neither fits us:** both integrate through the **Shopify theme + Liquid**.
Our site is headless Next.js on Vercel; Shopify only renders checkout. So they
can't test `/go/[slug]` or `/conka-both`. The *good ideas* worth copying:
50/50 sticky split, server-decided (no flicker), and RPV/CVR/AOV per variant.

## 2. The traffic reality (why we must be pragmatic)

Standard guidance: **~1,000+ visitors and 100–200 conversions per variant,
2–4 weeks, 50/50 split**. Detecting a **10% lift on a 3% purchase baseline needs
~100k visitors per variant** — effectively unreachable on our budget.

Two levers make it work on low traffic:

- **Test big swings, not tweaks.** Landing-page/offer changes commonly move CR
  **20–50%**. Large effects need far less traffic to detect than 5% tweaks.
- **Measure an up-funnel proxy with a high baseline.** Landing→PDP click-through
  or add-to-cart rate has a **20–40% baseline** vs 3% for purchase, so
  significance arrives ~10× faster. Treat purchase/RPV as a directional read.

**Discipline rules:** always 50/50 (unequal splits need far bigger samples);
one variable per test; **run a rolling ~10+ day window** (not a single day) and
don't call it before ~2 full weeks even if it looks decided early. Because
`conka_uid` bucketing is sticky for 400 days, a longer window keeps each returning
visitor in the same variant — it accumulates clean sample rather than re-rolling
them. The tradeoff: **freeze the test conditions for the window** — don't change
ad creative, price, or the offer mid-test, or you contaminate the comparison. Call
it only on the proxy metric with a sanity check that purchase didn't move the
wrong way. Use a free significance calculator — we do **not** need a stats engine.

## 3. Core metrics & how we already track them

| Metric | Baseline | Why | Where it comes from today |
|---|---|---|---|
| **Landing→PDP CTR** (primary for listicle tests) | high (20–40%) | fastest to significance | `?src=<slug>-<section>` on outbound CTA → `captureListicleSrc()` on PDP |
| **Add-to-cart rate** (primary for PDP tests) | mid | closest high-baseline signal to money | `CartContext.addToCart` fires Vercel/Meta/TW |
| **Initiate checkout rate** | mid | catches cart-drawer drop-off | `CartDrawer` `trackMetaInitiateCheckout` |
| **Purchase CR / RPV / AOV** | low (~3%) | truth, but slow | Shopify `orders/paid` webhook + order tags |

All four analytics systems (Vercel, Meta Pixel, Meta CAPI, Triple Whale) already
fire from `CartContext.addToCart` after a successful cart mutation. We attach the
variant to the events that already exist — no new tracking pipeline.

## 4. MVP architecture (build on existing hooks)

**a. Sticky bucketing — reuse `conka_uid`.**
`getOrCreateExternalId()` in `app/lib/metaPixel.ts` already mints a first-party
visitor id: **400-day cookie, scoped `.conka.io` (survives to checkout), read
everywhere.** Bucket deterministically: `bucket = hash(conka_uid) % 100`, then
map to a variant per active experiment. No new id, sticky by construction,
consistent server- and client-side.

**b. Carry the variant with zero new plumbing — pack it into `source`/`origin`.**
`analytics.ts` documents a **2-custom-prop budget** on Vercel, which is why the
codebase already *packs* values into single strings (`source = "<slug>-<section>"`,
`config = "product|cadence"`). Append the experiment id the same way, e.g.
`origin = "<slug>-<section>|exp_bothsel_v1:B"`. That single string already flows
to the Vercel event **and** to Shopify order tags via the `orders/paid` webhook —
so we can slice purchase CR by variant in Shopify with no extra work.
Meta CAPI/Triple Whale have **no prop limit** — add `variant` to `custom_data`
if we want it in the ads dataset too.

**c. (Optional) exposure log — clone the Convex `quizEvents` pattern.**
Add an `experimentEvents` table to `convex/schema.ts` and a `record` mutation
(pure insert, append-only, mirror `convex/quizEvents.ts`), fired from a
`useExperiment` hook modelled on `useQuizEvents`. Logs `{ uid, experiment,
variant, event, ts }` on assignment/exposure/conversion. Nice-to-have for clean
per-variant funnels; **not required for v1** if we lean on Shopify order tags +
Meta/Vercel.

**Minimal v1 (no Convex):** a tiny `getVariant(experiment)` helper (reads
`conka_uid`, hashes, returns variant + records nothing), used to (i) render the
variant and (ii) append the exp id to the origin string at add-to-cart. Ship,
read results in Shopify + Meta. Add Convex only if we want richer funnels.

## 5. Two split mechanisms — pick per test

- **Meta ad-set split (zero code) — for listicle tests.** Duplicate the ad set,
  same creative + same optimization event, **one landing URL per set, 50/50**.
  We already control the traffic source and listicles are cheap to register at a
  new slug. Downside: Meta audience overlap adds noise — keep strictly 50/50 and
  read the on-site proxy, not just Meta's CR.
- **On-site cookie split — for same-URL tests** like the Both-PDP selector,
  where every visitor lands on `/conka-both`. Use `getVariant()` (§4a).

## 6. The two proposed tests, scoped

### Test A — Both PDP variant selector (Magic-Mind-style)
Add a segmented "**choose Flow / Clear / Both**" selector to `/conka-both`,
letting a visitor pick a single formula inline instead of bouncing to another PDP.

- **Self-contained, no schema/cart changes.** `funnelData.ts` already holds
  `FUNNEL_VARIANTS.flow/.clear/.both` (variant GID + selling plan per cadence),
  and `addToCart` takes an arbitrary `variantId`/`sellingPlanId`. Add a
  `selectedProduct` state next to `selectedCadence` in `app/conka-both/page.tsx`,
  swap `getCadenceVariantByProductHeroId("03", cadence)` for a product+cadence
  lookup, render a toggle in `ProductHeroV2`/`ProductHeroMobileV2`.
- **Split:** on-site cookie (control = current Both-only page, variant = page with
  selector). **Primary metric:** add-to-cart rate. **Guardrail:** AOV/RPV (a
  selector could shift mix from Both → single and lower AOV — watch it).
- **⚠️ Brand constraint:** memory `no-single-product-emphasis` — never spotlight
  or enlarge one formula over the other; a *neutral, equal-weight* three-way
  toggle is fine, a Flow-forward default is not.

### Test B — Listicle hero / copy / CTA / traffic-direction
The listicle registry (`app/lib/landings/`) makes each page a **pure config
object** — hero image, headline, subcopy, CTA text, and destination all live in
config. Cheapest possible variant creation.

- **What to test (one variable per test):** `hero.asset` (image), `hero.headline`
  / `hero.subcopy` (copy), `hero.cta` + `stickyBar.cta` (CTA messaging),
  **traffic direction** = which PDP a `mm` CTA points to (`ProductCard` link:
  `/conka-flow` vs `/conka-clarity` vs `/conka-both`), or `template` (`mm`
  editorial vs `im8` sell-in-place).
- **Split:** Meta ad-set level — register a second slug with the varied config,
  point a duplicate ad set at it, 50/50. **Primary metric:** landing→PDP CTR
  (via `?src=`) for `mm`, or add-to-cart rate for `im8`.
- **Highest-leverage first:** hero image and the "traffic direction" test tend to
  move CR most; CTA wording least. Rank accordingly.

## 7. Suggested order & effort

| # | Test | Split | Build | Why first |
|---|---|---|---|---|
| 1 | Listicle **hero image** | Meta ad-set | ~1h (new config + slug) | zero infra, biggest effect size, fastest signal |
| 2 | Listicle **traffic direction** (which PDP) | Meta ad-set | ~1h | tests a strategic question cheaply |
| 3 | **Both PDP selector** | on-site cookie | ~0.5–1 day | needs `getVariant()` helper; higher-effort UI |
| 4 | Listicle CTA / copy | Meta ad-set | ~1h each | smaller effect, run after the big levers |

Tests 1–2 need **no code beyond a new config** — start there to prove the loop
while we build `getVariant()` for on-site tests. `getVariant()` + origin-packing
is the only real engineering (~half a day); Convex `experimentEvents` is an
optional follow-up.

## 8. Open questions

- Do we want per-variant funnels in Convex (build `experimentEvents`), or is
  "Shopify order tags + Meta + Vercel" enough for v1? (Recommend: enough for v1.)
- Significance: manual calculator per test, or a small `/app`-style internal
  readout? (Recommend: manual calculator first.)
- Confirm the Both selector respects `no-single-product-emphasis` in design
  review before it ships as a variant.

---

**Related:** `docs/features/LISTICLE_SYSTEM.md` · `app/lib/funnelData.ts` ·
`app/lib/metaPixel.ts` (`getOrCreateExternalId`) · `convex/quizEvents.ts` ·
`docs/analytics/README.md`
