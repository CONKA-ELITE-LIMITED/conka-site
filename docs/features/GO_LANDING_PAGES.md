# `/go/[slug]` Landing Pages

The shared contract behind every ad landing page. **Read this first**, then the doc
for the format you are building:

| Format | Doc | What it is |
|---|---|---|
| `listicle` | [`LISTICLE_SYSTEM.md`](./LISTICLE_SYSTEM.md) | "N reasons" pages, two templates (`mm` editorial, `im8` proof-dense) |
| `quiz` | [`LANDING_QUIZ_SYSTEM.md`](./LANDING_QUIZ_SYSTEM.md) | Config-driven quiz engine with screens, scoring and a reveal |
| `offer` | [Offer format](#offer-format) below | Single-offer page for impulse-priced acquisition tests, straight to checkout |

Everything on this page is true of all three. Neither format doc repeats it.

---

## What these pages are

Destinations for paid Meta traffic, and nothing else. Built June 2026 for the
conversion push: 3-4 ad personas, each with format iterations, targeting 1-4%
conversion.

The rules that follow from that:

- **`noindex`.** `generateMetadata` sets `robots: { index: false, follow: false }`. These pages must never compete with the money pages in organic search.
- **Never linked from the site.** No nav entry, no footer link, no internal link from any indexed page. Traffic arrives from an ad or not at all.
- **A new iteration is a new slug**, never an edit to a live one. That keeps the comparison clean in Vercel Analytics, where you filter by `slug`.

**Not the old `/quiz`.** The legacy protocol-scoring quiz was deleted and now 308s
to `/build-your-order`. This system shares nothing with it except some analytics
naming conventions.

## The route

```
config (app/lib/landings/*.ts)
  -> registered in app/lib/landings/index.ts
  -> app/go/[slug]/page.tsx: getLandingConfig(slug)
       -> "quiz" ? QuizEngine : "offer" ? OfferRenderer : <listicle renderer by template>
```

| Path | Role |
|------|------|
| `app/go/[slug]/page.tsx` | The route. Registry lookup, 404 on unknown slug, noindex metadata |
| `app/go/[slug]/error.tsx` | Error boundary with a reset button |
| `app/lib/landings/index.ts` | **The registry.** Slug to config map. Adding a page is one line here |
| `app/lib/landings/types.ts` | Shared config schema; `format` is the top-level discriminator |

**`dynamicParams = false`.** `generateStaticParams` builds every registered slug and
an unregistered slug 404s. Config lives in code by design, so **a new page needs a
deploy**. There is no CMS and there is not meant to be one.

## Adding a page, in outline

1. Copy the model config for your format (each format doc names it).
2. Set `slug` (becomes the URL), `persona`, `format`, `title`.
3. Write the format-specific body.
4. Register it in `app/lib/landings/index.ts`.
5. Deploy.

Nothing else changes. No route file, no component, no per-page styling.

## Analytics, the shared part

Each format emits its own event family (`landing:*` for quizzes,
`listicle:*` for listicles; offer pages reuse `listicle:*` plus one `offer:*`
event, see below). What is shared:

- **Every event carries `slug`**, so per-page funnels filter directly in Vercel Analytics. Compare within a format, not across: the two engines measure different things under similar-sounding names.
- **The two-property budget** documented in `app/lib/analytics.ts` applies to both. Fold extra dimensions into an existing property rather than adding a third.
- **Section impressions use one shared observer**, `app/components/analytics/sectionImpressions.tsx` (also used by the PDPs). It takes an `onSeen(section)` callback and knows nothing about event names, so each surface keeps its own event shape. **Do not change its `threshold` or `rootMargin`** without accepting that every historical impression count is silently rebased.
- **Meta:** ViewContent on entry. Meta only fires on `www.conka.io` (see `isProductionHost`), so preview deploys stay out of the dataset.
- Run `/review` after any change to event wiring, before scaling spend.

## Offer format

A single-offer page for paid acquisition tests that sells a low-priced trial into a
subscription. The one config is the **CONKA trial pack**, `/go/trial-pack`
(`app/lib/landings/trial-pack.ts`). Status: SCRUM-1343 (page), SCRUM-1344 (Klaviyo
and conka-lab). The campaign's what, why and success metrics: `docs/sprints/2026-09-trial-pack.md`.

**The offer.** The visitor picks Flow, Clear or Both and pays a trial price for a
4-shot pack (Both: 8 shots, one of each). `conversionDays` (7) after the order,
Skio moves the contract onto that product's monthly plan, and the first monthly
box is the starter pack. A buy-once link sells the product's regular one-time box
instead. UK only: there is no EU rate below 5,250g. Variants and plans:
`docs/product/SKU_AND_SHOT_REFERENCE.md`. Trial prices: `docs/PRICING_HISTORY.md`.
The Skio side (plans, Journeys): `docs/features/SUBSCRIPTIONS.md`.

**A new offer or copy iteration is a new slug.**

| File | Role |
|------|------|
| `app/lib/landings/offer-types.ts` | `OfferConfig`, `OfferOption` and the derived `OfferOptionView` |
| `app/lib/landings/trial-pack.ts` | The trial pack config, the model to copy |
| `app/lib/landings/trial-pack-faq.ts` | `buildTrialPackFaqs`, the "How the trial works" questions |
| `app/components/go/offer/OfferRenderer.tsx` | Server renderer: derives option views from `offerData.ts`, lays out every section |
| `app/components/go/offer/OfferHero.tsx` | Hero frame built from `ProductHeroV3`'s parts |
| `app/components/go/offer/OfferBuyBox.tsx` | Pack tiles, checkout CTA, conversion disclosure, buy-once link |
| `app/components/go/offer/OfferPurchase.tsx` | Client islands: selection provider, CTA, buy-once link, gallery, disclosure rows, sticky bar, error line |
| `app/components/go/offer/OfferCountdownBanner.tsx` / `OfferCountdown.tsx` | Top bar (server) and its ticking timer (client island) |
| `app/components/go/offer/offerCheckout.ts` | Fresh cart, exact variant + plan, fail-closed plan check, redirect to `checkoutUrl` |
| `app/components/go/offer/TrialPackSeen.tsx` | Marks the tab on landing so a later site-cart order carries `_trial_pack_seen` (`docs/development/CART_ATTRIBUTES.md`) |
| `app/components/go/offer/OfferUpsellModal.tsx` | Parked, not rendered. Kept for a possible "skip the trial, start monthly now" |

### Config

| Field | Notes |
|---|---|
| `options` | `flow`, `clear`, `both`, in tile order. Each: `label`, `summary`, `heroId` (the product whose gallery, disclosure rows and monthly plan it uses), `shots`, `price`, `referencePrice`, `variantId`, `sellingPlanId`, optional `galleryLead`, `explainerSlide`, `badge` |
| `price` | Trial price, **display only**. The charge is the variant's Shopify price less the Skio plan's percentage |
| `summary` | One short clause under the selector heading for the selected option, followed by the saving. Keep it within two lines at 390px or the tiles jump |
| `referencePrice` | The pack's own one-time Shopify price, struck through on the tile. Must match Shopify |
| `sellingPlanId` | The Skio trial plan. `null` blocks trial checkout for that option |
| `galleryLead` | First gallery image, ahead of the product's PDP slides (`MM_GALLERY_ASSETS`) |
| `explainerSlide` | Inserted as the 2nd gallery image. Per option because it burns in that product's monthly figures |
| `badge` | Pill on the tile's top edge. Both carries "Best value" |
| `defaultOption` | `both` |
| `conversionDays` | Stated next to the CTA and in the FAQ, so it must match Skio |
| `reviews` | Real reviews, condensed with an ellipsis only, rotated under the trust row |
| `offerFaqs` | `{ title, build(options, conversionDays) }`, see FAQ below |

Monthly, one-time and starter-pack figures are never authored in the config.
`OfferRenderer` derives them per option from `app/lib/offerData.ts` and throws at
build time if an option has no one-time variant or `defaultOption` is not an option.

### Page, top to bottom

- **No site nav.** `OfferCountdownBanner`, a navy bar ("This week only / CONKA trial pack from £X") with a countdown to Sunday 23:59 Europe/London that rolls over weekly. The timer boxes are fixed width and render `--` on the server, so hydration causes no layout shift.
- **Hero.** Offer pill, h1 "Try CONKA from £X" (the cheapest trial price), gallery (lead image, explainer, PDP slides), product name, avatar trust row and rotating review, `OfferBuyBox`, partner `LogoMarquee` with `lowPriority` (its logos fetch behind the gallery's LCP image), ingredient disclosure rows, certifications, trust strip.
- **`OfferBuyBox`.** "Choose your trial pack:", then a line restating the selection ("{label}: {summary} Save £X", the saving being `referencePrice` less `price`, held to a two-line height so the tiles never jump), three tiles (bottle cutout, name, struck `referencePrice`, trial price), CTA "Start trial for £X" (the sticky bar uses the same label), then the disclosure "{N} shots today. Monthly £Y from day 7, starter pack in your first box. Cancel anytime before.", then "Or buy a {N}-shot box once for £Z".
- **Below the fold always renders Both:** UGC marquee, `ClinicalIngredients`, `WhatToExpectV2` and `ProductComparisonTable` for Both, the offer FAQ section (tint), `BOTH_PDP_FAQ_ITEMS` (white), footer. The sticky CTA bar appears once the hero CTA scrolls out of view.
- Standard 100-day guarantee.

### Checkout

`offerCheckout.ts` creates a fresh cart via `POST /api/cart` (never the cart drawer)
and redirects to `cart.checkoutUrl`. **Deliberately not `byoCheckout.ts`**, which
re-resolves its own variant from the BYO cadences.

**It fails closed twice**, because a trial pack sold without its plan charges the
full one-time price and never converts:

1. The option has no `sellingPlanId`.
2. The cart Shopify returns does not carry exactly that plan on the line, or carries a `warning`. `/api/cart` silently retries without the selling plan when Shopify rejects it and still returns 200, so checking config alone is not enough.

The visitor sees a generic retry line; the cause goes to the console.

Cart attributes: `_fbp`, `_fbc`, `conka_uid` (`buildMetaCartAttributes`). Line
attributes: `_source=trial_pack`, `_offer_choice`, `_purchase`
(`docs/development/CART_ATTRIBUTES.md`).

### Analytics

Deliberately minimal: the website only emits, and conka-lab owns wiring and
visualisation. There is no add-to-cart step in the UI, so every add-to-cart
signal fires at the checkout click.

| Event | Fires | Properties |
|-------|-------|------------|
| `listicle:section_viewed` | Section scrolls into view | `slug` (`trial-pack`), `section` (`hero`, `ugc`, `ingredients`, `what_to_expect`, `comparison`, `offer_faq`, `faq`) |
| `listicle:cta_clicked` | Any CTA click | `slug`, `section` |
| `offer:option_selected` | Tile change | `slug`, `option` |
| `purchase:add_to_cart` | Checkout click | `source: "trial_pack"`, `location: offer_<section>` (`hero`, `sticky`, `otp`) |
| `cart:checkout_clicked` | Checkout click | `items`, `value` |

- **Meta:** ViewContent on mount; AddToCart and InitiateCheckout at the checkout click, Pixel and CAPI deduplicated by a shared `event_id`. Triple Whale AddToCart at the same click.
- **Purchase:** the server Purchase (orders/paid webhook) gates on `checkout_token`, so the trial order counts as a Purchase and the day-7 conversion charge and renewals do not.
- `offer:upsell_shown` / `offer:upsell_choice` helpers exist in `app/lib/analytics.ts` for the parked modal and never fire.

### FAQ

`offerFaqs` renders as its own section ahead of the general Both FAQ. Its questions
are built from the option views, so prices and days follow the config and
`offerData.ts`. Offer pages do not use `faqIds`. Why they live outside `FAQ_ITEMS`:
`docs/features/FAQ_SYSTEM.md`.

### What conka-lab needs

| Item | Value |
|---|---|
| Trial variants | `FLOW-BOX-4`, `CLEAR-BOX-4`, `BOTH-BOX-8` (GIDs in `SKU_AND_SHOT_REFERENCE.md`) |
| Conversion targets | `FLOW-STARTER-20`, `CLEAR-STARTER-20`, `BOTH-STARTER-40` on the monthly plans, then the plain `FLOW-20` / `CLEAR-20` / `BOTH-40` (`SUBSCRIPTIONS.md`) |
| Order markers | `_source=trial_pack`, `_offer_choice=flow\|clear\|both`, `_purchase=trial\|one_time` |
| Vercel events | `listicle:section_viewed` / `listicle:cta_clicked` (slug `trial-pack`), `offer:option_selected`, `purchase:add_to_cart` |
| Classification | A trial order is a subscriber in trial until day 7, then an ordinary monthly subscriber. One-time orders are not subscribers |
| App link | `https://www.conka.io/app` (no deep link exists) |

### Decisions and gotchas

- **Both is one bundle variant, never two cart lines.** Two lines create two contracts converting to Flow + Clear monthly, not one Both monthly.
- **A page price and its Skio percentage change together.** Change one alone and the page and checkout disagree. Re-render any slide that burns in the price or a percentage (`design/pdp-slides/README.md`, which also holds the new-filename rule for re-rendered slides).
- **The conversion terms sit next to the CTA.** It is a trial into a subscription; the disclosure is the single statement of the terms.
- **Below the fold is always Both.** Keeps the page server-rendered with no layout shift and speaks to the default option.
- **Stays under `/go` while it is an experiment.** A root page reusing PDP sections would compete with the PDPs in search.
- **Returning subscribers can buy the trial.** Filter read-outs by first order. One trial per customer is not enforced.

## Gotchas that bite every format

- **A new config needs a deploy.** Marketing cannot ship a page without one.
- **Unknown ids fail the build**, deliberately, so a page cannot ship with a broken reference. Add the id to its source file first.
- **Preview vs production.** Meta is host-gated, Vercel Analytics is not, so preview traffic does reach Vercel. Discount your own walkthroughs when reading a fresh page's numbers.

## References

- Programme and plan docs: `docs/development/featurePlans/landing-conversion/` (start at its README)
- Live listicle performance data: `docs/analytics/LISTICLE_PERFORMANCE.md`
