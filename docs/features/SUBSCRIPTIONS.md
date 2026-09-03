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
