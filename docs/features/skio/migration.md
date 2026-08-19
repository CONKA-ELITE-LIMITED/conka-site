# Skio Migration (Loop -> Skio)

The model for moving from Loop to Skio. Skio's team runs the contract migration; this documents how it works and the decisions we own. Live status: `docs/development/featurePlans/skio-migration-status.md`.

## Model: big-bang cutover

Skio creates its own selling plans, so every subscribe surface must re-point from Loop's `sellingPlanId`s to Skio's. We build the whole Skio structure alongside live Loop (behind the flag), then flip in one coordinated moment:

1. **Skio's team** exports our live Loop contracts and recreates them as Skio subscription contracts (at their current prices).
2. **We** flip `NEXT_PUBLIC_SKIO_ENABLED` to `true` and redeploy, so new customers buy Skio variants/plans and `/account` routes to the Skio portal.
3. **Loop auto-billing is disabled** at that moment so no contract is double-charged.
4. **Loop wiring is removed** in the cutover release.

The single hard coordination point is timing the storefront flip with Skio's migration-complete confirmation and the Loop billing shutoff.

## Why a flag, not an edit

Both Loop and Skio ship in the same build; the flag chooses. Off (default) = Loop, fully live and untouched. On = Skio. This lets us build + verify Phases 1-3 without disrupting live subscribers, and gives a clean switch. Emergency rollback = Vercel Instant Rollback to the pre-cutover deploy (or flip the flag back + redeploy).

## What re-points (Phase 2, done)

Every live subscribe surface routes through `getOfferVariant` in `app/lib/funnelData.ts`, which returns Skio variants + plans when the flag is on. Reverse lookups resolve BOTH Loop and Skio tables so in-flight and migrated lines still render. `monthly-otp` is untouched (one-time is not a subscription). The Loop portal-swap accessors stay on Loop until Phase 4.

## Fulfilment staging

The Skio selling variants + plans stay constant; only the fulfilment metafield changes as box formats arrive:
- **Stage 1 (now):** everything ships in 28-boxes (first + recurring identical); the free-shots offer is baked in. Just the 6 base variants.
- **Stage 2 (20-box live):** add bonus variants + a Skio swap Journey so the first order ships the bigger box and recurring switches to the 20-box.
- **Stage 3 (gift box live):** recurring 20-box; first order gets a small gift box.

## Decisions we own

- **Kept the free-shots offer** (quantity bonus on the first order), delivered via the staged fulfilment model, rather than a cheaper-first-box price policy.
- **Percentage-off plans on net-new base variants** (the clean Skio shape), nothing existing repriced.
- **Recurring-revenue attribution** is acquisition-only today (rebills send no Meta Purchase, matching Loop). At cutover, the cheapest recurring visibility is Skio's **native Triple Whale integration** (no build); Meta CAPI for rebills would be built off Skio's webhooks and is deferred (SCRUM-1223 Phase 3).

## Answers from Skio (Noah, 2026-08-18)

All the pre-cutover open questions are answered. Sources: Noah (Skio) email 2026-08-18; Skio headless iframe + webhooks docs.

- **Rebill attribution (1.B).** Attributes carry to renewal orders ONLY if they live on the Shopify **subscription contract**, which is populated from the **checkout/cart** data, not from edits made to the first order after checkout. Our `_fbp`/`_fbc`/`conka_uid`/`_listicle_origin` are attached as **cart-level attributes at checkout**, so they should persist to the contract and appear on each renewal. Skio does not re-copy attributes per bill. (Worth confirming on the first real renewal.)
- **Rebill `checkout_token` (2.B).** CONFIRMED: Skio rebills are created server-side through Shopify's native subscription billing and have **no `checkout_token`**. So our `orders/paid` webhook correctly skips them (see `META_PIXEL_AND_CAPI.md`). Noah suggests also keying on `subscription_contract_id`/selling-plan data for belt-and-braces.
- **Webhooks / events (3.B).** Skio emits subscription-lifecycle events (billed / order created / cancelled / paused / skipped) via its webhooks + event-metrics API - the basis for any recurring-revenue / churn reporting.
- **Native integrations (4.B).** Skio has a **native Triple Whale** integration (enable at cutover for recurring visibility). No native Meta CAPI - that would be built off Skio's webhooks if we decide we need it.
- **Migrated contracts (5.B).** Migrated Loop contracts keep their **operational** history (start date, order history, billing schedule, products, payment method) but do **NOT** retain Loop's original attribution/custom fields. If channel-to-LTV reporting matters, preserve the original source in Shopify customer metafields/tags before cutover and join to Skio LTV in the warehouse. (Acceptable for us: migrated contracts are already-acquired customers.)
- **Portal params + provisioning (2.A/3.A/4.A).** Store is on **cpv3** (Customer Portal v3). Auto-login endpoint is **`/a/account/shopify-login`** (fixed in SCRUM-1227); params `hostname` = public domain, `shop` = myshopify domain, `totalSpent` = real value (we send `0`, display-only, not in the hash). Address/payment changes in the Skio portal **write back to Shopify automatically** (so the Loop address-mirror can be dropped at cutover). See [`customer-portal.md`](./customer-portal.md).
- **Creating a test subscription (1.A).** Either run a 100%-off discount through Shopify checkout, or manually create one in the Skio backend (Subscribers -> Subscriptions -> "create subscription").

## Cutover checklist (Phase 4, not started)

1. Skio confirms all Loop contracts migrated into Skio.
2. Disable Loop auto-billing.
3. Set `NEXT_PUBLIC_SKIO_ENABLED=true` (+ `SKIO_STORE_ID_HASH`, `SKIO_API_TOKEN`) in Vercel prod; deploy the Loop-removal release.
4. Verify a real Skio purchase + portal login in prod; verify attribution + Synergy fulfilment (SCRUM-1223).
5. Remove Loop wiring (`app/lib/loop.ts`, `app/api/auth/subscriptions/*`, the self-built portal, RETENTION15 flow, Loop env vars).
6. Enable Skio's native **Triple Whale** integration for recurring-revenue visibility (4.B).
7. Drop the Loop per-contract **address-mirror** now that Skio writes address/payment back to Shopify (4.A).
8. (Optional) If channel-to-LTV reporting is wanted, preserve original source in Shopify customer metafields/tags before cutover (5.B) - migrated contracts do not carry Loop attribution.
