# Subscriptions (Skio)

**Canonical doc for how CONKA subscriptions work.** Skio owns every subscription contract. We
sell into it, embed its portal, and hold almost no subscription code of our own.

The migration from Loop that produced this state is history, not behaviour: see
`docs/development/featurePlans/archive/skio-migration.md` and `archive/loop-decommission.md`
for the reasoning, vendor answers and cutover record.

**Related:** `docs/features/CUSTOMER_PORTAL.md` (the account surface and auth),
`docs/product/SKU_AND_SHOT_REFERENCE.md` (the canonical SKU and variant GID map),
`docs/development/CART_ATTRIBUTES.md` (what lands on an order).

---

## How it works

1. A subscribe surface calls `getOfferVariant` in `app/lib/offerData.ts`, which returns a Skio
   variant plus a selling plan.
2. That pair goes into a normal Shopify cart and out to Shopify's hosted checkout. There is no
   custom checkout and no Skio API call in the purchase path.
3. Skio sees the order, creates the contract, and owns every renewal from then on.
4. The customer manages everything at `/account/manage`, which is Skio's portal in an iframe.

The only Skio API call we make from the app is signing the portal login. Everything else is
dashboard configuration.

## The pricing model, and the trap in it

**Skio plans discount by percentage off the variant's one-time price.** Loop applied a fixed
adjustment, so the two are not interchangeable and this difference has caused every pricing
incident on the platform:

- A variant's price **is** its one-time price. The plan takes the discount off. So one variant
  serves as both the OTP (sold bare) and the subscription (sold with a plan attached).
- **A variant with no plan bound sells at full price.** A swap target missing its plan moves a
  subscriber from £39.99 to £69.98 silently.
- **Never use "Set price"** in the Skio dashboard. Skio ignores it under Shopify market prices,
  which risks overcharging international customers. Percentage off, always.
- Base price includes postage, and the discount absorbs it, which is how subscriptions ship free.

### Selling plan groups

| Group | Applies to | Bill every | % off | Sub price | Plan GID |
|-------|-----------|-----------|-------|-----------|----------|
| 20 Shots - Monthly | Flow, Clear | 1 month | 42.86% | £39.99 | `712928887158` |
| 60 Shots - Quarterly | Flow, Clear | 3 months | 42.11% | £109.99 | `712928919926` |
| 40 Shots - Monthly | Both | 1 month | 25.00% | £74.99 | `712928952694` |
| 120 Shots - Quarterly | Both | 3 months | 46.43% | £149.99 | `712928985462` |

Variant SKUs and GIDs live in `docs/product/SKU_AND_SHOT_REFERENCE.md`, not here.

### Starter variants and Journeys

The starter pack (hat plus travel pack in the first box) is the primary first-order offer, so
each cadence has a `*-STARTER-*` Skio variant at the **full one-time base price**, attached to
the same plan as its plain sibling. A Skio **Journey** swaps the contract onto the plain variant
after order 1, so renewals ship the plain box with the plan discount intact.

Do not attach a Loop-era `*-STARTER-*` variant to a Skio plan. Those are fixed-priced at the
charged amount, so a percentage plan under-bills them (£22.85 instead of £39.99).

## Bundles and fulfilment

Every subscription variant is a **Synergy virtual bundle**: `custom.bundlecomposition` on the
Shopify variant holds the physical boxes in single-line `NxSKU+NxSKU` form, exploded at pick
time. Synergy needs no onboarding for a new bundle whose components it already carries.

**The failure mode is the opposite of what you would expect.** A variant *without* the metafield
reaches Synergy as a plain SKU and must be hand-fixed on every order. That was the historic
quarterly pain. So:

**Process for any new or changed subscription variant:** create it at the base one-time price;
set `custom.bundlecomposition`; leave `custom.batchexpiry` blank (only physical boxes carry
batch and expiry); set the weight (boxes x 2.1 kg); attach the selling plan; then verify on the
first live order that it exploded into components.

**Never delete `FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`.** Every bundle composition points at them.

**Synergy rules:** the connector pulls only open, paid, unfulfilled orders. Never remove the
`IMPORTSYNERGY` tag. Orders cannot be edited once Synergy has pulled them.

### Shipping on renewals

The shipping line on a renewal order comes from the **delivery method stored on the Shopify
subscription contract**, not from a rate picked at billing time. That name is what Synergy routes
couriers on, and it rejects anything outside its configured list.

**Every contract migrated from Loop stores a null title.** All 296 carry `null` for `title`,
`presentmentTitle` and `code`; all 33 created through Skio checkout carry `Express`. So renewals
from the first group print `Subscription shipping` and are held by Synergy as "Invalid Dispatch
Method", while checkout orders print `Express`. Nothing is re-rated at billing: our cheapest UK
rate is already `Express` at £0.00, and `Subscription shipping` is not a rate we have ever
configured. Our profile holds only `Express`, `24 Hour Delivery` and `Express International`.

**This predates Skio.** Order `#3935` was billed by **Loop** on 27 Aug 2026 carrying the identical
label. Renewals on this store have always behaved this way; it surfaced now because Synergy's
routing is new, not because the platform changed. Do not raise it with Skio as a migration fault.

**The fix** is Skio's per-contract **"Re-sync with Shopify"** in the Update delivery method dialog.
It pulls the rate name off our Shopify profile, picks correctly from the address, and leaves the
price alone (`Delivery price: Synced with Shopify`, override unchecked). The API equivalent is
`changeSubscriptionDeliveryMethod`.

**Never disturb the price while correcting a title.** Leave `setOverride` false. UK contracts are
£0 either way, but the 12 international ones store Loop-era delivery prices (EUR 26.95, EUR 38.95,
USD 28-31) that do not match our current Express International bands, so a re-rate would change
what real customers pay.

**The mapping is unambiguous, and simpler than it looks.** UK is the only zone carrying two rates
(`Express` at £0 and `24 Hour Delivery` at £6.54+). All eleven overseas zones carry exactly one,
`Express International`. So a subscription contract maps to `Express` if the shipping address is
UK and `Express International` otherwise, with no exceptions. Two traps to check before ever
re-deriving this: **Jersey sits in its own `Express International` zone**, so a Channel Islands
address labelled "United Kingdom" would be mis-mapped, and a country with no configured zone has
no rate at all. Neither is present today (audited 2026-09-07).

> ⚠️ **The two-method rule above expires when the international DDP work ships.**
> `Express International` is being retired and replaced by `European Delivery` (DHL road, EU) and
> `Express International DHL` (DHL air, rest of world), all on DDP terms. The mapping then becomes
> three methods: `Express` for UK, `European Delivery` for the EU, `Express International DHL`
> everywhere else. See `docs/development/featurePlans/international-duties-and-ddp.md`.

### Do not re-sync the 12 international contracts yet

**Fix the 207 UK contracts now. Hold the 12 international ones.** Active subscription state
pulled from Skio 8 Sept 2026:

| | Loop-migrated (needs this fix) | Skio-native (already correct) |
|---|---|---|
| UK | **207** | 37 |
| International | **12** (8 France, 4 USA) | 0 |

Every international subscriber is Loop-migrated; there are no Skio-native international
contracts at all.

The UK contracts map to `Express`, which the international work does not touch, so fixing them
now is final. The 12 international ones would be set to `Express International`, which that work
**retires**, so correcting them now means correcting them twice. Hold them and do it once
against the final method names.

They are being revisited regardless: four of the eight French contracts are monthly single-box
subscribers due to be migrated to quarterly, and all 12 carry the stale Loop-era delivery prices
noted above.

**A subscription always resolves to `Express` in the UK, even when the customer paid for next-day.**
Order `#4042` carries two shipping lines, `24 Hour Delivery £6.54` and `Express £0.00`, and the
contract took the second. The paid upgrade applies to the first order only; renewals revert to
standard silently. All 34 Skio-native contracts behave this way. Tracked as a behaviour question in
`docs/TODO.md`, not a defect.

**Gotcha: our own Shopify apps cannot read subscription contracts.** `read_own_subscription_contracts`
only covers contracts the calling app created, and Skio owns all of ours. Contract-level checks go
through Skio's API (`getCurrentSubscriptionDeliveryMethod`), not Shopify's.

Status and the open verification: **SCRUM-1311**.

### Fulfilment staging

Plans and variants stay constant as box formats change; only `bundlecomposition` moves. The
customer and Skio never see the stages.

- **Stage 1 (current):** everything ships in 28-boxes, first and recurring identical, so the
  free-shots offer is baked in. We ship more than we charge for until smaller boxes exist.
- **Stage 2 (20-box live, date TBD):** add bonus variants plus a swap Journey, so the first
  order ships the bigger box and recurring switches to the 20-box.
- **Stage 3 (gift box live):** recurring is the 20-box, first order gets a gift box, drop the
  swap Journey.

## The portal

Skio Customer Portal v3 (cpv3), embedded at `/account/manage`, auto-logged-in via a
server-signed magic link. It is the whole account: Skio renders its own Orders, Account and
Logout inside the frame. Route and auth detail is in `docs/features/CUSTOMER_PORTAL.md`.

**The login endpoint is `/a/account/shopify-login`,** not `/a/account/login`. The latter is
Skio's passwordless email login and renders "Email does not exist". Host is `cpv3.skio.com`;
`storefront-iframe.skio.com` is the retired v2.

### Swap catalogue lockdown

Skio's portal lets a subscriber change product from its "edit products" page. Left open, that
picker offers **every** variant on the product, starter kits included, so a subscriber could put
themselves on a hat-and-travel-pack-per-renewal contract. Order-1 Journeys do not catch this:
they fire on the first order only, never on a mid-life swap.

Closed in the dashboard, per product, no code. For Flow, Clear and Both: **Product settings →
Show in edit products page for customers** ON → **Only allow certain variants to be shown**,
ticking only the plain non-starter subscription variants (two per product, the same six that are
the Journey swap targets, so a mid-life swap and an order-1 Journey land in the same place).
Everything else stays unticked: all six Skio starters, every legacy Loop-era funnel variant, and
the one-time SKUs. **"Product eligible for one-time upsell" stays OFF.**

**The paired check that is easy to forget:** in **Product variant selling plans**, every allowed
swap target must show its plan pill. A target with no plan bound sells at the full one-time
price, per the pricing model above.

### Portal gotchas

- **`hostname` must be `shop.conka.io`.** Skio resolves the store via
  `get-site-by-domain-or-hostname` and 400s on a Vercel preview URL or the myshopify domain.
- **`totalSpent` is sent as `0`.** Display-only, not part of the hash, and the Customer Account
  API exposes no lifetime-spend field (`amountSpent` is Admin-only).
- **`DEV_MOCK_AUTH` cannot drive the portal** (non-numeric id, no `customer_access_token`). Test
  on a preview or production login.
- **The customer must exist in Skio**, or the portal falls back to Skio's login form.
- **Publish the portal** in `dashboard.skio.com/portal-settings`. A Draft portal renders the
  shell and hangs on content. Splash images must be PNG/JPG/SVG/GIF, not WebP; hard-refresh
  after saving.

## Env vars and code

| Var | Scope | Purpose |
|-----|-------|---------|
| `SKIO_API_TOKEN` | server, all envs | Skio GraphQL API. Header `authorization: API {token}` |
| `SKIO_STORE_ID_HASH` | server secret | Signs the portal login hash. **Never `NEXT_PUBLIC_`**, it would let anyone forge a login for any customer |
| `SKIO_PORTAL_HOSTNAME` | server, optional | Overrides the portal `hostname` param. Defaults to `shop.conka.io` |

Both required vars are getters in `app/lib/env.ts` `optionalEnvVars`.

| Path | Role |
|------|------|
| `app/lib/skio.ts` | API config plus the `LOOP_TO_SKIO_SELLING_PLAN` map for migrated contracts |
| `app/lib/offerData.ts` | `getOfferVariant`, `SKIO_OFFER_VARIANTS` (the live purchase path), `LEGACY_OFFER_VARIANTS` (reverse lookup only) |
| `app/api/auth/skio-portal/route.ts` | Signs the portal iframe src |
| `app/account/manage/*` | The portal page and `SkioPortalFrame` |

Every subscribe surface routes through `getOfferVariant`, which always sells from
`SKIO_OFFER_VARIANTS`. Reverse lookups still search both tables, because a cart or order can
hold a migrated Loop-era line that must still resolve to a product.

### Pulling GIDs from the Skio API

```
POST https://graphql.skio.com/v1/graphql   (header: authorization: API {SKIO_API_TOKEN})
query { SellingPlans { platformId name } }
query { PricingPolicies { percentageOff SellingPlan { platformId } } }
query { SellingPlanGroupResources { SellingPlanGroup { platformId } ProductVariant { platformId sku } } }
```

Match plans to products by `percentageOff` and attached variant SKUs. Limits: depth 4, 100 nodes
per request, 2,000 req/min. Shopify GIDs come back as `platformId`.

## Attribution

**Acquisition attribution works and needs no Skio-specific code.** The purchase path only
chooses a variant and plan; cart attributes (`_fbp`, `_fbc`, `conka_uid`, `_listicle_origin`,
`_upsell`) and the CAPI webhook's `checkout_token` gate are variant-agnostic. Verified against
the first nine Skio-native orders on 2026-09-02.

**Rebills send no Meta Purchase**, matching Loop. Recurring visibility comes from Skio's native
Triple Whale integration. Meta CAPI for rebills is deferred.

**Order tags: Skio stamps one where Loop stamped eight, and nothing depended on the difference.**
Skio writes `Subscription First Order`. No code, Klaviyo segment or retention flow reads order
tags, and `IMPORTSYNERGY`, the only load-bearing one, is written by Synergy. **Do not ask Skio to
replicate Loop's tag set.** Full breakdown in `docs/development/CART_ATTRIBUTES.md`.

## Retention

**The retention engine is the separate `conka-lab` repo**, not Klaviyo config: a Python pipeline
on Render ingests subscription data into Convex, assigns each customer a segment every 6h, and
drains those into Klaviyo lists. Everything downstream of `sanitized_customers` consumes fields
by meaning, never by platform name, so Skio was an ingest-adapter change and nothing more. Detail
lives in the conka-lab repo, at `docs/featurePlans/loop-to-skio-ingest-migration.md` there.

**Cancellation deflection and save-offers live in Skio's portal**, where the reason is captured.
Klaviyo keeps only the post-cancel winback.

## Legacy protocol contracts

`ProtocolId`, `PROTOCOL_VARIANTS` and `app/lib/legacy/protocolSubscriptions.ts` are **live legacy
support, not dead code**. Twelve customers still hold protocol contracts (4 active, 8 paused as
of the 2026-08-27 migration preview). The code stays until those contracts end. Do not propose
tidying it.

## Decisions and trade-offs

- **Percentage-off plans on net-new variants**, rather than repricing existing ones. Repricing
  could not be tested before cutover and depended on Loop's price-sync behaviour.
- **Net-new variants, nothing existing renamed.** Renaming a SKU would have broken Synergy's
  mapping for in-flight orders.
- **The no-code iframe portal**, not a self-built portal on Skio's GraphQL API. This is why the
  entire self-built subscription UI could be deleted.
- **Kept the free-shots offer** (quantity bonus on the first order) via staged fulfilment rather
  than a cheaper-first-box price policy. It is a core conversion driver.
- **OTP still sells the old `-OTP` SKUs.** Consolidating one-time purchases onto the Skio
  variants is possible under the percentage model but deliberately deferred.

## Known gaps

- **Does a Shopify-side address edit reach a Skio contract?** Never confirmed. Made moot by
  deleting the only form that could cause the mismatch, so the portal is the sole place an
  address changes. If an address-editing surface is ever rebuilt, answer this first.
- **Klaviyo templates** still link to the retired `/account/subscriptions`, covered by a
  redirect. Tracked in `docs/TODO.md`.
