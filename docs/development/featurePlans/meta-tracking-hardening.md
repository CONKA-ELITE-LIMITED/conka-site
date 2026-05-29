# Meta Tracking Hardening (post-attribution-fix)

**Created:** 2026-05-29
**Status:** Phase 1 + 2 active. Phase 3 future (gated).
**Related:** `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` (the diagnosis + the completed domain/theme fixes this builds on).

## Problem

Today's domain fix (checkout moved to `shop.conka.io`, legacy theme redirect repaired) closed the main Meta attribution leak: the cross-domain cookie split. The diagnosis surfaced smaller tracking gaps that remain:

- The Meta Pixel loads with `strategy="lazyOnload"`, so early PageView and `_fbc` (ad-click) capture can be delayed or missed.
- InitiateCheckout fires from multiple sources (frontend `CartDrawer` + `funnelCheckout`, plus the Shopify Facebook channel's `checkout_started`), risking double/triple counting in the same pixel.
- We have no first-party Purchase event we control. Purchase is currently sent only by the Shopify Facebook & Instagram channel.

Left unaddressed, these degrade Event Match Quality and add noise to the signal Meta optimises on, which raises CPA.

## Who it serves

Paid (Meta) acquisition. Cleaner, better-matched signal improves optimisation and lowers cost per acquisition.

## Business impact

Acquisition / CRO. Directly affects how efficiently ad spend converts to subscribers.

## Approach

Ship the safe, evidence-free fixes now (Phase 1), verify the post-fix state in Meta (Phase 2), and only build the server-side Purchase path if verification proves the Shopify channel's coverage is insufficient (Phase 3). One pixel only (`1138202151698404`).

**Design system:** No impact (no UI work).

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Safe pixel hygiene (load timing + InitiateCheckout de-dup) | Not Started |
| 2 | Verify post-fix attribution (gates Phase 3) | Not Started |
| 3 | Server-side Purchase webhook + ad-click propagation | Future (gated) |

## Phase 1 — Safe pixel hygiene (ACTIVE)

1. **Pixel load timing (#2)**
   - What: change the Meta Pixel `Script` from `strategy="lazyOnload"` to `afterInteractive` so PageView and `_fbc` capture are not delayed or missed. Confirm no LCP regression (it must not block render).
   - Complexity: Small
   - Files: `app/layout.tsx`

2. **InitiateCheckout de-duplication (#3)**
   - What: make the Shopify Facebook channel's `checkout_started` the single owner of InitiateCheckout, and remove the two frontend InitiateCheckout fires. Eliminates the double/triple count on the same pixel.
   - Decision (approved): Shopify channel owns InitiateCheckout; frontend stops firing it.
   - Complexity: Small
   - Files: `app/components/CartDrawer.tsx`, `app/lib/funnelCheckout.ts`, `app/lib/metaPixel.ts`

## Phase 2 — Verify post-fix attribution (ACTIVE, gate)

3. **Verification pass**
   - What: 2 to 3 days after the domain fix, in Meta Events Manager check: Event Match Quality trend, the Meta-vs-Shopify Purchase gap, Purchase source (Browser vs Server), and any duplication. Run the `/review-analytics` skill. Produce a go/no-go decision on Phase 3.
   - Complexity: Small (analysis, no code)
   - Files: none

## Phase 3 — Server-side Purchase + ad-click propagation (FUTURE, gated on Phase 2)

Only build if Phase 2 shows the Shopify channel's Purchase coverage or match quality is insufficient.

- **#4 ad-click propagation:** capture `fbclid` on landing, derive `_fbc`, and attach `_fbp`/`_fbc` as cart attributes (the attributes path already exists in `app/api/cart/route.ts`) so the order carries the ad-click ID for server-side matching.
- **#5 server-side Purchase webhook:** new `app/api/webhooks/shopify/orders/route.ts` subscribed to `orders/paid` (or `orders/create`), sending Purchase to Meta CAPI with the Shopify `order_id` as `event_id` (for dedup against the channel), plus hashed email/phone and `fbp`/`fbc` in `user_data`. Filter Loop subscription renewals so rebills are not counted as new acquisitions.
- Model HMAC verification on `app/api/webhooks/revolut/route.ts`; model the CAPI send on `app/api/meta/events/route.ts`.
- New env var: `SHOPIFY_WEBHOOK_SECRET`. Reuse existing `META_CAPI_ACCESS_TOKEN`.

## Technical decisions and rationale

- **One pixel only.** Ads, site, and CAPI all use `1138202151698404`. No new datasets.
- **Channel owns InitiateCheckout.** It fires on the actual checkout page (more reliable than a click on our side) and avoids cross-system dedup that is not possible without a shared `event_id`.
- **Purchase webhook is gated.** The Shopify channel already sends Purchase to the same pixel, so an ungated webhook would double-count. Evidence from Phase 2 decides.

## Rabbit holes

- Phase 3 double-counting (mitigated by the Phase 2 gate + `order_id` as shared `event_id`).
- Pixel timing vs performance: keep `afterInteractive`, never blocking, watch LCP.

## No-gos

- Not building the Purchase webhook on spec.
- Not changing the Shopify channel config in code (admin-side).
- Not adding new pixels or datasets.

## Risks

- Removing the frontend InitiateCheckout assumes the channel reliably fires it. Phase 2 should confirm before deletion ships (or ship the removal but verify the channel IC in Phase 2).

## Jira tickets

Sprint 26. Epic category: Website & CRO (SCRUM-763). Active phases only; Phase 3 stays unticketed until the Phase 2 gate says go.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1043 | Meta tracking hardening Phase 1: pixel load timing + InitiateCheckout de-dup | 1 | To Do |
| SCRUM-1044 | Meta tracking hardening Phase 2: verify post-fix attribution (Phase 3 gate) | 2 | To Do |
