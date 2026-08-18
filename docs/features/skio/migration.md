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
- **Recurring-revenue attribution** is acquisition-only today (rebills send no Meta Purchase, matching Loop). Whether to feed recurring/churn signals via Skio webhooks is deferred (SCRUM-1223 Phase 3); questions sent to Skio.

## Open questions for Skio (Noah)

- Do Skio-created rebill orders carry the first order's note attributes (`_fbp`/`_fbc`/`conka_uid`/`_source`), and do they have a `checkout_token`? (We skip Purchase CAPI on no-token orders.)
- What webhooks does Skio emit (billed / order created / cancelled / paused / skipped) for reporting?
- Does Skio have native Meta CAPI / Triple Whale for rebills, or do we build off webhooks?
- Do migrated Loop contracts keep the customer's original attribution?
- Confirm the exact portal `hostname`/params and that the account is fully provisioned (see [`customer-portal.md`](./customer-portal.md)).

## Cutover checklist (Phase 4, not started)

1. Skio confirms all Loop contracts migrated into Skio.
2. Disable Loop auto-billing.
3. Set `NEXT_PUBLIC_SKIO_ENABLED=true` (+ `SKIO_STORE_ID_HASH`, `SKIO_API_TOKEN`) in Vercel prod; deploy the Loop-removal release.
4. Verify a real Skio purchase + portal login in prod; verify attribution + Synergy fulfilment (SCRUM-1223).
5. Remove Loop wiring (`app/lib/loop.ts`, `app/api/auth/subscriptions/*`, the self-built portal, RETENTION15 flow, Loop env vars).
