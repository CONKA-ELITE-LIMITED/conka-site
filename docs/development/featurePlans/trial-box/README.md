# 4-shot trial box: acquisition experiment

Live state lives on SCRUM-1343 / SCRUM-1344. How the page works: `docs/features/GO_LANDING_PAGES.md` (Offer format).

## Problem

Paid Meta traffic into the listicles converts at £105 cumulative / £142 marginal CPA on a £39.99 monthly first order (`docs/analytics/LISTICLE_PERFORMANCE.md`, 21 Aug pull, target £100). The test: does an impulse-level £14.99 weekly offer cut cost per new customer far enough that renewals and monthly upgrades pay it back?

**Who it serves:** cold UK Meta traffic, via a new campaign pointed at a new `/go` page. Acquisition.

**Design language:** Simple DTC (DESIGN_SYSTEM.md §8.5).

## Decisions log

| # | Decision | Why |
|---|---|---|
| 1 | Flow only on the page. Clear product exists so a Clear page is a new slug, not a toggle | One choice = impulse. Config swap, no rebuild |
| 2 | Weekly subscription only. No one-time option on the page | Cleanest impulse test |
| 3 | £14.99/week all-in, free UK shipping | Matches how subs ship today (base price includes postage, discount absorbs it) |
| 4 | Pricing: base (one-time) price **£29.98**, Skio plan **50% off** = £14.99 exactly | Skio rule is percentage off, never set price. 50% divides cleanly and "50% off" reads well |
| 5 | Weekly until cancelled. No Skio Journey auto-convert | Simplest. Emails do the upgrade work |
| 6 | Pre-checkout upsell to the monthly Flow starter pack (`FLOW-STARTER-20` + plan `712928887158`) | Our page, so we can track it. No checkout extension. Both choices go straight to checkout |
| 7 | UK only | No EU rate below 5,250g (`docs/shipping/METHODS_AND_ZONES.md`) |
| 8 | One trial per customer not enforced in v1 | Volume is small; returning customers filtered at analysis |
| 9 | Page copy does not show £3.75/shot. Per-shot price appears only in the upsell | Weekly costs more per shot than monthly; use that only as the upgrade story |
| 10 | Renewal price stated next to the CTA ("Then £14.99 every week until you cancel") | Competitors hide it; that is the chargeback and subscription-trap risk |
| 11 | Klaviyo trigger: Shopify Placed Order where item SKU = `FLOW-BOX-4` / `CLEAR-BOX-4` | Instant, native, no code. conka-lab properties lag up to a day |
| 12 | Email upgrade CTA: Skio portal swap (`/account/manage`) | One contract, no double billing |
| 13 | App email: reuse the existing app-install email, no new app story | Use what we have |
| 14 | Separate Meta campaign, not a split test. Budget set by marketing | Speed |
| 15 | Sequencing: product + plan + page first, Klaviyo once the page is signed off | User call |
| 16 | Upsell is a one-time modal after the first CTA click, always to the monthly starter pack, headed "You save £X" from the value stack (compare-at all-in price + first-box freebie RRP, minus price). Reuses cart-upsell-style imagery | The value stack is the strongest honest saving; showing it once avoids nagging repeat clickers |
| 17 | Analytics kept minimal; the website only emits events | conka-lab owns wiring and visualisation |

## Success metrics

Read at day 14 (two renewals), not 60 days.

- **Verdict:** new-customer CPA vs the £105 listicle baseline.
- **Guardrail:** % of trial customers still active after the 2nd renewal (day 14).
- **Funnel overview:** visitors, CTA clicks, upsell shown, upsell choice (trial vs monthly), purchases, CVR, AOV, purchase split trial vs monthly upsell.

Sources: Vercel Analytics events (below) for the top of funnel; Shopify orders filtered by the `_offer` line attribute and SKU for purchases and split; Meta Ads Manager for spend and CPA; Skio for active status at day 14.

## Unit economics (per £14.99 weekly box, UK)

Rough, from `docs/ops/` and `docs/shipping/`. COGS figure comes from a stale dashboard; packaging not recorded anywhere.

| Line | £ |
|---|---|
| Revenue ex VAT | 12.49 |
| COGS (4 shots at ~£0.64) | -2.57 |
| Synergy pick/pack | -3.20 |
| Evri UK 48hr 0-3kg | -2.25 |
| Shopify 2.8% + 30p, Skio 0.7% | -0.82 |
| **Contribution before packaging** | **~3.65** |

## Phases

| Phase | Description | Ticket |
|---|---|---|
| 1 | Shopify product fix-up, Skio weekly plan, `/go/flow-trial` offer page with upsell modal, analytics | SCRUM-1343 |
| 2 | Klaviyo trial flow + conka-lab classification and exclusions (built in a conka-lab session), after page sign-off. Must be live before the first renewals | SCRUM-1344 |
| 3 | Day-14 read-out and funnel overview | Future |
| Future | Clear page (new slug); no-upsell or cart-drawer arm (new slug); gift on 3rd box; post-payment upsell; one-trial-per-customer enforcement | Future |

## Jira tickets

| Ticket | Scope |
|---|---|
| SCRUM-1343 | [Website & CRO] 4-shot trial box: £14.99 weekly Flow landing page at /go/flow-trial - Phase 1 |
| SCRUM-1344 | [Email & Marketing] 4-shot trial box: Klaviyo trial flow and conka-lab classification - Phase 2 |

## Phase 1 build (as built)

- **Data.** `offer` format: `app/lib/landings/offer-types.ts` (`OfferConfig`), config `app/lib/landings/flow-trial.ts`, registered in `app/lib/landings/index.ts`.
- **Checkout.** `app/components/go/offer/offerCheckout.ts`, modelled on `app/lander/sections/BuyBoxes/lander-checkout.ts` (fresh cart, exact variant + plan, Meta cart attributes, redirect to `checkoutUrl`). Not `byoCheckout.ts`. Line attributes on both paths: `_source=trial_box`, `_offer=flow_trial_4`, `_offer_choice=trial|monthly`.
- **Page.** `app/go/[slug]/page.tsx` branches to `OfferRenderer`. Sections and sticky CTA behaviour documented in `GO_LANDING_PAGES.md`.
- **Upsell.** `OfferUpsellModal.tsx`, see decision 16. Accept or decline marks it seen for the session (`offer_upsell_seen_<slug>`); dismiss does not.
- **Analytics (as built).** Views and CTA clicks reuse `listicle:section_viewed` / `listicle:cta_clicked` keyed by slug. New Vercel events `offer:upsell_shown {slug, product}` and `offer:upsell_choice {slug, choice}`. At checkout: `purchase:add_to_cart` (`source: "trial_box"`), Meta AddToCart + InitiateCheckout, Triple Whale ATC. Meta ViewContent on mount, www only. conka-lab owns wiring and visualisation of these events.
- **FAQ.** Canonical `faqIds` plus offer-only `offerFaqs` (weekly billing, cancelling), see `docs/features/FAQ_SYSTEM.md`.

## Reference values

Canonical copy: `docs/product/SKU_AND_SHOT_REFERENCE.md` (4-shot trial box).

| Field | Flow | Clear |
|---|---|---|
| Product | `gid://shopify/Product/15879926415734` "CONKA Flow 4 Shot Box" | `gid://shopify/Product/15879921074550` "CONKA Clear 4 Shot Box" |
| Variant | `gid://shopify/ProductVariant/58714075136374` | `gid://shopify/ProductVariant/58714000163190` |
| SKU | `FLOW-BOX-4` | `CLEAR-BOX-4` |
| Base price | £29.98 | £29.98 |
| Weight | 300g (28-box is 2,100g = 75g per shot incl. packaging, x4) | 300g |
| HS code / origin | 210690 / GB | 210690 / GB |
| Selling plan group | "4 Shots - Weekly" `gid://shopify/SellingPlanGroup/100221616502` (merchantCode `4-shots---weekly`, shopper-facing name "Subscription") | same |
| Selling plan | `gid://shopify/SellingPlan/712985543030` "Weekly Subscription", WEEK x1, 50% off | same |

## Manual ops (tracked on SCRUM-1343 / SCRUM-1344)

### Shopify

- Barcodes on both variants, sent to Synergy
- Compare-at left empty on the variant (the £29.98 strike-through is rendered from the config). If ever set, it must be a real purchasable price
- Product Active and on the Headless / Storefront sales channel at launch; no `SYNERGYIGNORE` tag
- Confirm the UK shipping rate the box lands in at its real weight (Express free 0-13,650g) and that renewals ship free on the contract method

### Skio

- Weekly to monthly portal swap: Skio owns this and has confirmed it works
- No Journey on these variants
- Test order on an @conka.io address: page > checkout > order in Shopify with `_offer` attribute > contract in Skio at £14.99 weekly > next charge date +7 days

### Synergy

- Send SKU `FLOW-BOX-4` / `CLEAR-BOX-4`, barcode, weight, stock count
- Confirm Synergy pulls a test order

### Klaviyo (Phase 2, by hand in the UI)

- New flow "Trial Box": trigger Placed Order, filter item SKU is `FLOW-BOX-4` or `CLEAR-BOX-4` (check the exact property name on a real test event)
- Emails: D0 reuse existing app-install email; D5 switch to monthly (2 days before first renewal); D12 second nudge
- Flow filter: exit when `conka_billing_frequency` is no longer `weekly`; exclude Dunning
- Welcome flow: add a trigger filter excluding the trial SKUs so nobody gets both
- Planned Weekly Promo flow (not built): must exclude trial customers when it is built
- UTMs `utm_source=klaviyo&utm_medium=email&utm_campaign=trial_box`

### Meta

- New campaign pointed at `https://www.conka.io/go/flow-trial` (www, so ViewContent fires)

## What conka-lab needs

For the conka-lab session that builds the emails, classification and event wiring.

| Item | Value |
|---|---|
| Trial variant GIDs | Flow `gid://shopify/ProductVariant/58714075136374`, Clear `gid://shopify/ProductVariant/58714000163190` |
| SKUs | `FLOW-BOX-4`, `CLEAR-BOX-4` |
| Shots per box | 4 |
| Selling plan | Skio "4 Shots - Weekly", 1 week, 50% off £29.98 = £14.99. Plan `gid://shopify/SellingPlan/712985543030`, group `gid://shopify/SellingPlanGroup/100221616502` |
| Cart / order markers | Line attributes `_source=trial_box`, `_offer=flow_trial_4`, `_offer_choice=trial` or `monthly` (monthly = took the upsell) |
| Vercel events | `listicle:section_viewed`, `listicle:cta_clicked` (slug `flow-trial`), `offer:upsell_shown`, `offer:upsell_choice`, `purchase:add_to_cart` with `source: "trial_box"` |
| Klaviyo trigger | Placed Order, item SKU in (`FLOW-BOX-4`, `CLEAR-BOX-4`) |
| Upgrade target | `FLOW-STARTER-20` (`gid://shopify/ProductVariant/58586461766006`) on Skio plan `gid://shopify/SellingPlan/712928887158`, £39.99 / 20 shots monthly. Clear: `CLEAR-STARTER-20` (`gid://shopify/ProductVariant/58586614858102`), same plan |
| Upgrade URL | `https://www.conka.io/account/manage` (Skio portal swap) |
| App link | `https://www.conka.io/app` (no deep link or install attribution exists). Reuse the existing app-install email |

Changes conka-lab has to make (from reading its docs 14 Sep):

1. **Classification.** `helpers.py` `PRICE_TO_SHOTS` keys on price only; `protocol_normalize.py` only reads sizes written "N-pack", so a "Default Title" / "4 Shot Box" product yields no size. Map on SKU `*-BOX-4` instead.
2. **Trial flag.** New property e.g. `conka_is_trial_box` (plus `properties.ts`, tests, `KLAVIYO_DYNAMIC_FIELDS.md`).
3. **Exclusions for trial customers:**
   - Weekly Promo (planned): would offer biweekly on odd cycles, around day 5, and still links to Loop
   - `LOW_FREQUENCY` segment after day 30
   - `computeChurnRisk`: flags every weekly customer under 60 days as high risk
   - `_to_monthly_equivalent`: counts each trial as ~£65/month projected revenue
   - `NEW_SUB_DIRECT` list flow (and known F-09: people never move on)
4. **Upgrade tracking.** `plan_change_events` already logs billing frequency changes, so weekly to monthly on a trial customer is the upgrade metric.
5. **Consent.** About 40% of new subscribers lack marketing consent and skip list-based flows. The metric-triggered flow above still needs consent to send marketing email.
6. **Event wiring and visualisation.** Ingest the Vercel events above into the funnel overview.

## Rabbit holes

- Skio Journey auto-convert weekly to monthly
- Shopify checkout or post-purchase upsell extensions
- Building a dashboard before there is data (v1 is a manual pull)
- New photography or renders (use existing box imagery)
- Enforcing one trial per customer

## No-gos

- One-time purchase option on the page
- Product choice on the page
- Charging postage
- Hiding the renewal price
- Shipping outside the UK

## Risks

- **`SYNERGYIGNORE` tag** left on at launch: orders never ship.
- **Weight left at 0g:** wrong shipping band, and Synergy/courier data is wrong.
- **Heavy weekly customers pay about £65/month** vs £39.99 monthly. Fine as an upgrade story; watch for complaints.
- **Returning subscribers buying the trial** muddy CPA. Filter by first order at read-out.
- **Klaviyo before day 7:** if Phase 2 lands after the first renewals, the first cohort renews without an upgrade email.

## References

- `docs/features/GO_LANDING_PAGES.md` (Offer format), `app/go/[slug]/page.tsx`, `app/lib/landings/index.ts`
- `docs/features/SUBSCRIPTIONS.md` (Skio percentage model and traps)
- `docs/product/SKU_AND_SHOT_REFERENCE.md` (4-shot trial box)
- `docs/workflows/11-creating-products.md`
- `app/lander/sections/BuyBoxes/lander-checkout.ts` (checkout model)
- `app/lib/offerData.ts` (`SKIO_OFFER_VARIANTS`, monthly upgrade target)
- `docs/development/CART_ATTRIBUTES.md`
- conka-lab: `docs/KLAVIYO_FLOW_LIBRARY.md`, `docs/KLAVIYO_DYNAMIC_FIELDS.md`, `docs/PROMOTION_ENGINE_RULES.md`, `tools/klaviyo-email-import/`
- Competitor teardowns (14 Sep, mobile): Cloud, Ovrload, Grüns. Takeaways: per-shot or per-day price on the CTA, "cancel anytime" inside the price tile, stars above the headline, sticky CTA, guarantee line under the button. Grüns runs straight to checkout with a cart drawer as a URL test arm
