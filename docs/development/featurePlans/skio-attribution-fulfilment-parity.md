# Skio Orders: Attribution + Fulfilment Parity

**Status:** Not started (lined up, not yet active)
**Scale:** C (cross-system verification, non-negotiable), but little-to-no code
**Tracking:** This doc + Jira (SCRUM-1223). Part of the Loop to Skio migration; see [`skio-subscription-migration.md`](./skio-subscription-migration.md) and [`skio-migration-status.md`](./skio-migration-status.md).
**Owner:** Rudh
**Created:** 2026-08-18

---

## Problem

At the Skio cutover, every new subscriber buys through Skio variants and selling plans instead of Loop. We must guarantee that Skio orders carry the same **Meta attribution** (fbp / fbc / conka_uid / source / upsell reaching the Purchase CAPI event) and the same **Synergy fulfilment** (bundle explosion into 28-boxes, Synergy pull, location routing) as today's Loop funnel orders. If either silently breaks at cutover, we lose ad attribution (wasted spend, optimiser can't learn) and boxes do not ship. This serves acquisition (attribution) and ops (fulfilment).

## Key finding (grounded in code, 2026-08-18)

The Phase 2 re-point only swapped the variant + selling plan inside `getOfferVariant`. The attribution and fulfilment machinery sit in **separate code paths downstream of that lookup**, so they already treat Skio variants identically. This is largely a **verification + ops** exercise, not a rebuild.

- **Attribution already flows.** `getOfferVariant` (`app/lib/funnelData.ts`) returns whichever table `subscriptionsUseSkio()` selects; the attribute code never inspects the variant. Both paths attach cart/line attributes:
  - Funnel: `app/lib/funnelCheckout.ts` (+ trial-b copy) -> `buildMetaCartAttributes()` cart-level `_fbp`/`_fbc`/`conka_uid`, plus line `_source`/`_plan_frequency`/`_upsell_accepted`/`_selected_product`.
  - PDP: `app/context/CartContext.tsx` -> `buildMetaCartAttributes()` + `_listicle_origin` (`getPurchaseOrigin`) + `_upsell` (`getAcceptedUpsellOrigin`), re-derived on every add.
  - Sources: `captureFbcFromUrl` + `getOrCreateExternalId` (`conka_uid`) in `app/lib/metaPixel.ts`.
- **The webhook is already Skio-correct.** `app/api/webhooks/shopify/orders/route.ts`: `isWebCheckoutOrder = Boolean(order.checkout_token)`. The first Skio order has a checkout token, so its Purchase is sent to CAPI; Skio rebills (no token) are skipped, which is correct (rebills are not new acquisitions). It reads `conka_uid`/`_fbp`/`_fbc`/`_listicle_origin` from `note_attributes`. No Loop-specific logic, only comments.
- **Our code never touches Synergy tags.** `IMPORTSYNERGY` is auto-applied by Synergy on pull, not by us. `SYNERGYIGNORE` lives only on legacy products, never on `FLOW-20` etc. The only order tag we write is the additive `listicle` / `persona:` tag (`addOrderTags`), which cannot disturb Synergy tags.

Net: the "tags for Synergy" are Synergy's job on pull. Our job is making the Skio order **pullable and explodable** (bundlecomposition + location routing) and **proving** the attribution fires.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Attribution verification (prove Skio order carries attribution + fires CAPI Purchase; rebill skipped) | Active (lined up) |
| 2 | Synergy fulfilment verification/config (bundlecomposition, new SKUs to Synergy, pull + location routing) | Active (lined up, ops-led) |
| 3 | Recurring-revenue attribution decision (Skio webhooks vs acquisition-only) | Future (decision-gated) |

## Active phase task breakdown

### Phase 1 - Attribution verification

1. **[Verify] Inspect the Skio test order's note attributes.** Pull order #3879 (read-only Admin/API) and confirm `_fbp`, `_fbc`, `conka_uid`, `_source`, `_upsell_accepted`, `_listicle_origin` are present with real values. Complexity: Small.
2. **[Verify] Confirm the CAPI Purchase fired.** Vercel logs (`conka-shopify` prod, filter `[Shopify webhook]`, `hooks.conka.io`) show "Sending Purchase" for #3879 with value 39.99 and the attribution `user_data`; Meta Test Events / Events Manager shows the Purchase with good EMQ. Complexity: Small.
3. **[Verify] Confirm a rebill is skipped.** On the first real Skio rebill (or a simulated no-token order), logs show "Skipping non-checkout order" with `hasCheckoutToken:false`. Complexity: Small (may wait for a real rebill).
4. **[Doc] Record results** in `docs/analytics/META_PIXEL_AND_CAPI.md` and the Skio status doc. Run `/review-analytics`. Complexity: Small.

### Phase 2 - Synergy fulfilment verification/config (ops-led)

1. **[Ops] Metafield audit.** Verify `custom.bundlecomposition` + correct weight on all 6 Skio base variants (`FLOW-20`, `CLEAR-20`, `BOTH-40`, `FLOW-60`, `CLEAR-60`, `BOTH-120`) and confirm none are `SYNERGYIGNORE`. Fix any gaps. Complexity: Small.
2. **[Ops] Hand Synergy the new SKUs.** One SKU-to-box document for `FLOW-20`...`BOTH-120`, per the Synergy add-a-variant process. Complexity: Small.
3. **[Ops] Routing test.** A Skio order (first + a recurring) pulls to Synergy, gets `IMPORTSYNERGY`, explodes into 28-boxes on Synergy's pick side, and inventory routes to the Synergy location. Complexity: Medium (coordination with Bethany/Synergy).

## Rabbit holes

- **Do not rebuild attribution.** It already works; the trap is re-wiring a path that is fine. Verify first, touch code only if a real drop is found.
- **Rebill attribution is by design.** Rebills carry no fbc and send no Purchase because they are not acquisitions. Do not "fix" unless Phase 3 decides recurring revenue needs its own tracking.

## No-gos

- Not sending a Purchase for Skio rebills (acquisition-only, matches Loop).
- Not changing the `checkout_token` gate.
- Not touching Synergy's `IMPORTSYNERGY` tag (Synergy owns it on pull).

## Risks

- **Silent attribution loss at cutover** if a Skio-specific path (untested) drops an attribute. Mitigated by Phase 1 verifying against a real Skio order before cutover.
- **Fulfilment miss** if a Skio variant lacks bundlecomposition or is not stocked/routed at the Synergy location, so recurring boxes do not ship. Mitigated by Phase 2.

## Open questions

- **Ops:** do recurring Skio orders (open + paid + unfulfilled) get pulled by Synergy and inventory-route to the Synergy location? Unverified in code; pure fulfilment config. Phase 2 confirms.
- **Decision (Phase 3):** does recurring subscription revenue need Meta / Triple Whale visibility (via Skio webhooks), or does it stay acquisition-only? Question sent to Skio (Noah) to understand what Skio can feed.

## References

- `docs/analytics/META_PIXEL_AND_CAPI.md` (attribution + webhook spec)
- `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` (why cart-attribute attribution exists; rebill over-count history)
- `docs/development/featurePlans/synergy-3pl-integration.md` (Synergy pull/tags/bundlecomposition/location routing)
- `docs/development/featurePlans/skio-migration-status.md` (Skio variants + bundlecomposition status)
- Code: `app/lib/funnelCheckout.ts`, `app/context/CartContext.tsx`, `app/lib/metaPixel.ts`, `app/api/webhooks/shopify/orders/route.ts`, `app/lib/funnelData.ts`

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1223 | [Shopify & Subscriptions] Skio orders: attribution + fulfilment parity verification | 1 + 2 | To Do |

Phase 3 is Future / decision-gated; not ticketed.
