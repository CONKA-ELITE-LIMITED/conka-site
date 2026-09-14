# CONKA trial pack: acquisition experiment

Live state lives on SCRUM-1343 (page) and SCRUM-1344 (Klaviyo + conka-lab). Reshaped 14 Sep 2026 from the weekly "4 box" offer to a trial pack that converts to monthly.

## Problem

We want monthly subscribers. Paid Meta traffic into the listicles costs £105 cumulative / £142 marginal per monthly first order (`docs/analytics/LISTICLE_PERFORMANCE.md`, 21 Aug pull, target £100). The test: does a cheap, honestly framed trial pack (4 days of CONKA) that rolls into the chosen product's monthly plan after 7 days lower the cost of a monthly subscriber?

**Who it serves:** cold UK Meta traffic, via a new campaign pointed at a new `/go` page. Acquisition.

**Design language:** Simple DTC (DESIGN_SYSTEM.md §8.5).

## The offer

1. The visitor picks **Flow, Clear or Both** on `/go/trial-pack`. Both is preselected with a "Best value" badge.
2. They pay a low trial price for **4 days of CONKA**: a Flow 4 box (4 shots), a Clear 4 box (4 shots), or Both (a bundle of one of each, 8 shots).
3. **7 days after purchase**, Skio moves the contract onto that product's monthly plan. The first monthly order is the starter pack.
4. A buy-once link sells the regular one-time box of the selected product instead.

| Option | Trial pack | Trial price (placeholder) | Converts to on day 7 | Buy-once link |
|---|---|---|---|---|
| Flow | `FLOW-BOX-4`, 4 shots | £12.99 | `FLOW-STARTER-20`, £39.99/mo | `FLOW-FUNNEL-20-OTP`, £69.98 |
| Clear | `CLEAR-BOX-4`, 4 shots | £12.99 | `CLEAR-STARTER-20`, £39.99/mo | `CLEAR-FUNNEL-20-OTP`, £69.98 |
| Both | Both bundle (`1xFLOW-BOX-4+1xCLEAR-BOX-4`), 8 shots | £18.99 | `BOTH-STARTER-40`, £74.99/mo | `BOTH-FUNNEL-40-OTP`, £99.98 |

Monthly and one-time figures come from `app/lib/offerData.ts`; trial prices are config values Rudh sets.

## Decisions log

| # | Decision | Why |
|---|---|---|
| 1 | One page, Flow / Clear / Both selector, Both preselected with "Best value" | The goal is any monthly subscriber; Both is the highest-value plan. "Most popular" is a claim we cannot back yet. Flow and Clear stay equal cards |
| 2 | Trial pack converts to the chosen product's monthly plan (starter pack) 7 days after purchase | Gets people into the system at a low price, then onto the plan we actually want |
| 3 | Skio conversion setup is owned by Rudh | Vendor configuration, not website code |
| 4 | Both is a bundle of the Flow and Clear 4 boxes, its own variant | Two separate cart lines would create two contracts converting to Flow + Clear monthly (£79.98), not Both monthly (£74.99) |
| 5 | Honest conversion copy next to the CTA: price today, what they get, when monthly starts, the monthly price, cancel anytime before | It is a trial into a subscription; hiding that is the chargeback and trust risk |
| 6 | Buy-once link = regular one-time box of the selected product, straight to checkout | A no-subscription route for people who will not trial into monthly |
| 7 | Upsell modal dropped for v1, component kept with an "unused" comment | Every trial already converts to monthly; a future "skip the trial, start monthly now" may reuse it |
| 8 | Standard 100-day guarantee; the 30-day override is reverted | They land on monthly, where the site-wide guarantee applies. Less code |
| 9 | Hero follows the selection (gallery, disclosure rows, prices); below the fold always renders the Both versions | Keeps the page server-rendered with no layout shift and speaks to the default |
| 10 | Stay under `/go` (noindex, not linked) while it is an experiment; promote to a root route only if it wins | A root page reusing PDP sections would compete with the PDPs in search |
| 11 | Tracking: `_source=trial_pack`, `_offer_choice=flow|clear|both`, `_purchase=trial|one_time` line attributes; one new event `offer:option_selected` | Separates trial vs one-time and the product split without extra events |
| 12 | Pricing is placeholder until Rudh confirms | Commercial call |
| 13 | Analytics kept minimal; the website only emits, conka-lab wires and visualises | Carried over |
| 14 | UK only | No EU rate below 5,250g (`docs/shipping/METHODS_AND_ZONES.md`). Carried over |

## Success metrics

- **Primary:** cost per customer still subscribed after the day-7 conversion charge, vs the £105 listicle baseline.
- **Supporting:** trial conversion rate (visitors to trial orders), Flow / Clear / Both split, one-time share, % cancelled before day 7.

Sources: Vercel Analytics for the top of funnel; Shopify orders by `_offer_choice` / `_purchase`; Meta Ads Manager for spend; Skio for contracts active after day 7.

## Phases

| Phase | Description | Ticket |
|---|---|---|
| 1 | `/go/trial-pack` page: selector, trial checkout, buy-once link, honest conversion copy, Both content below the fold | SCRUM-1343 |
| 2 | Klaviyo: trial confirmation + "your monthly plan starts in 2 days" reminder before day 7; conka-lab classification by option | SCRUM-1344 |
| 3 | Read-out once the first cohort has converted | Future |
| Future | Reuse the upsell modal as "skip the trial, start monthly now"; below-the-fold content that follows the selection; one trial per customer; promote to a root route if it wins | Future |

## Phase 1 tasks

Builds on the `/go` offer format already on `feat/trial-box` (offer types and registry, `OfferRenderer`, `OfferHero`, `OfferBuyBox`, `OfferPurchase`, `offerCheckout`).

1. **Data (S).** Delete `flow-4-box.ts` and `clear-4-box.ts`. New `app/lib/landings/trial-pack.ts` with `options: { flow, clear, both }`, each: label, trial variant, trial selling plan, trial price, shots, lead gallery image, product it converts to. `defaultOption: "both"`. Monthly and one-time figures derived from `offerData.ts`.
2. **Revert the 30-day guarantee (S).** Remove `guaranteeDays` from the config and the optional props on `ProductComparisonTable` and `TrustStrip`, and the gallery guarantee filter, so the shared components match `main`.
3. **Hero selector (M).** A small client island holds the selected option. The gallery (lead image + that product's slides) and ingredient disclosure rows follow it. `OfferBuyBox` becomes three PDP-style plan cards (Both preselected, badge), the CTA "Checkout - £X", the conversion disclosure, and the buy-once link "Or buy a {20/40}-shot box once for £Z".
4. **Checkout (S).** `offerCheckout` sends the selected trial or one-time variant with the tracking attributes in decision 11.
5. **Upsell modal (S).** The provider stops rendering it. `OfferUpsellModal.tsx` keeps a header comment marking it unused since the trial-pack pivot and why it is kept; same note on its two analytics helpers.
6. **Below the fold (S).** Both ingredients (`ClinicalIngredients` default), `WhatToExpectV2 productId="both"`, `ProductComparisonTable product="both"`, `BOTH_PDP_FAQ_ITEMS`. Nav, UGC, footer and sticky bar unchanged.
7. **Analytics (S).** `offer:option_selected {slug, option}`; existing section, CTA, add-to-cart and Meta events unchanged.
8. **Docs on done.** `GO_LANDING_PAGES.md`, `CART_ATTRIBUTES.md`, `SKU_AND_SHOT_REFERENCE.md`, `PRICING_HISTORY.md`, `SUBSCRIPTIONS.md`, `FAQ_SYSTEM.md`, `CLAUDE.md` routes line. Deferred until the build is final.

**Mobile:** title, gallery, trust row + review, plan cards, CTA and disclosure, buy-once link. The selected card and CTA should sit close enough that a change of option visibly updates the button price.

## Manual ops (Rudh, tracked on the tickets)

### Shopify
- Both trial pack bundle variant, composition `1xFLOW-BOX-4+1xCLEAR-BOX-4`, and share its variant GID
- Trial prices on the three trial variants
- Products Active on the Headless / Storefront channel at launch; barcodes sent to Synergy

### Skio
- Trial selling plan(s) converting 7 days after purchase to `FLOW-STARTER-20` / `CLEAR-STARTER-20` / `BOTH-STARTER-40` monthly, with the starter pack on that first monthly order
- Retire the "4 Shots - Weekly" plan once nothing uses it
- Staff test order per option: trial order, day-7 conversion charge, starter pack shipped

### Assets
- Both trial pack hero image (Flow and Clear exist: `FlowTrialBox.jpg`, `ClearTrialBox.jpg`)

### Klaviyo (Phase 2)
- Trigger on trial orders only (`_purchase=trial`), not one-time
- Reminder before day 7 stating the date and monthly price; exclude trial customers from the Welcome flow

### Meta
- New campaign pointed at `https://www.conka.io/go/trial-pack`

## What conka-lab needs

| Item | Value |
|---|---|
| Trial variants | `FLOW-BOX-4` `gid://shopify/ProductVariant/58714075136374`, `CLEAR-BOX-4` `gid://shopify/ProductVariant/58714000163190`, Both bundle (GID when created) |
| Conversion targets | `FLOW-STARTER-20` `58586461766006`, `CLEAR-STARTER-20` `58586614858102` (plan `712928887158`), `BOTH-STARTER-40` `58586681999734` (plan `712928952694`) |
| Order markers | `_source=trial_pack`, `_offer_choice=flow|clear|both`, `_purchase=trial|one_time` |
| Vercel events | `listicle:section_viewed` / `listicle:cta_clicked` (slug `trial-pack`), `offer:option_selected`, `purchase:add_to_cart` |
| Classification | A trial order is a subscriber in trial until day 7, then an ordinary monthly subscriber. One-time orders are not subscribers |
| App link | `https://www.conka.io/app` (no deep link exists) |

## Rabbit holes

- Rebuilding Skio behaviour in code (it is Skio configuration)
- Making every below-the-fold section follow the selection
- Enforcing one trial per customer in v1
- Final pricing and discount framing before the numbers are set

## No-gos

- Hiding when monthly starts or what it costs
- A separate page per product
- The weekly subscription model
- Shipping outside the UK

## Risks

- **Conversion surprise:** a customer who misses the copy is charged on day 7. The disclosure next to the CTA and the pre-conversion reminder email are the mitigation.
- **Both as two cart lines:** would create two contracts at £79.98 total instead of one Both monthly at £74.99. Decision 4 requires a single bundle variant.
- **Returning subscribers buying the trial** muddy the read-out. Filter by first order.
- **Reminder email late:** if Phase 2 lands after the first day-7 conversions, the first cohort converts without a reminder.

## References

- `app/lib/landings/` (offer types, registry), `app/components/go/offer/` (renderer, hero, buy box, purchase flow, checkout, parked upsell modal)
- `app/lib/offerData.ts` (`SKIO_OFFER_VARIANTS`, `OFFER_PRICING`)
- `app/conka-both/page.tsx` (Both section components)
- `docs/features/SUBSCRIPTIONS.md`, `docs/workflows/11-creating-products.md`, `docs/development/CART_ATTRIBUTES.md`
- conka-lab: `docs/KLAVIYO_FLOW_LIBRARY.md`, `docs/KLAVIYO_DYNAMIC_FIELDS.md`
