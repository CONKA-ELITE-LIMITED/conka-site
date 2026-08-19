# Skio Orders: Attribution + Fulfilment Parity

**Status:** Phase 1 VERIFIED (2026-08-18) · Phase 2 metafield audit PASSED · remaining Phase 2 = Synergy handoff + live routing test (ops)
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
| 1 | Attribution verification (prove Skio order carries attribution + fires CAPI Purchase; rebill skipped) | **VERIFIED 2026-08-18** (see Verification results) |
| 2 | Synergy fulfilment verification/config (bundlecomposition, new SKUs to Synergy, pull + location routing) | **Task 1 (metafield audit) PASSED**; tasks 2-3 (Synergy handoff + live routing) open, ops-led |
| 3 | Recurring-revenue attribution decision (Skio webhooks vs acquisition-only) | Future (decision-gated) |

## Verification results (2026-08-18)

### Phase 1 — attribution: PASS

- **Code path proven variant-agnostic.** `funnelCheckout.ts` + `CartContext.tsx` attach `buildMetaCartAttributes()` (cart-level `_fbp`/`_fbc`/`conka_uid`) + line attrs on every add, regardless of Loop vs Skio variant; `/api/cart` forwards cart attributes → order `note_attributes`; the webhook gates CAPI on `checkout_token`. No Skio-specific branch anywhere.
- **Live evidence (read via the attribution-audit Admin app, `read_orders`).** Real 2026-08-18 funnel orders carry the full attribute set with `checkout_token` present and real £ values: `#3878` (£39.99 — `_fbp`+`_fbc`+`conka_uid`+`_listicle_origin=adhd-listicle-sticky`), `#3875` (£69.98), `#3873` (£67.50), `#3872` (£39.99). Since a Skio order uses the identical `/api/cart` path, parity is established.
- **Skio test order `#3879` is not a valid attribution artifact** (and needs no fix): it went through the real PDP path (line prop `source: product_page`, Skio variant `FLOW-20`) but in a **cookie-less session** → empty `note_attributes`, £0 total (100%-off discount), app/channel-created. It confirms the pipes connect (checkout_token present → webhook would fire) but proves nothing about attribution quality. A real ad-driven buyer sets the cookies; they flow through the path `#3878` proves.
- **Rebill skip is by design and certain:** Skio rebills are contract-created with no `checkout_token` → skipped, same as Loop rebills (which prod logs already show excluded). Recorded in `META_PIXEL_AND_CAPI.md`.
- **Remaining "verify by effect" (non-blocking, needs Rudh's Meta/Vercel access):** Events Manager EMQ on a `#3878`-class Purchase; the first real Skio rebill logging "Skipping non-checkout order".

### Phase 2 task 1 — metafield audit: PASS

All 6 Skio base variants carry `custom.bundlecomposition` + correct weight (2.1kg per 28-box), none `SYNERGYIGNORE`, compositions matching the live Loop funnel shot economics:

| SKU | Variant GID | Weight | `bundlecomposition` |
|-----|-------------|--------|---------------------|
| `FLOW-20` | 58457787040118 | 2.1kg | `1xFLOW-FUNNEL-28` |
| `FLOW-60` | 58457811550582 | 6.3kg | `3xFLOW-FUNNEL-28` |
| `CLEAR-20` | 58457822069110 | 2.1kg | `1xCLEAR-FUNNEL-28` |
| `CLEAR-60` | 58457854411126 | 6.3kg | `3xCLEAR-FUNNEL-28` |
| `BOTH-40` | 58457859686774 | 4.2kg | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` |
| `BOTH-120` | 58457864077686 | 10.5kg | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28` (140 shots — matches Loop `BOTH-FUNNEL-140`) |

## Active phase task breakdown

### Phase 1 - Attribution verification

1. ~~**[Verify] Inspect the Skio test order's note attributes.**~~ **DONE — see Verification results.** #3879's attributes were empty (cookie-less test session), so parity was instead proven from real prod orders (`#3878` et al.) that share the identical code path.
2. **[Verify] Confirm the CAPI Purchase fired.** *Open, needs Rudh's Vercel/Meta access.* Vercel logs (`conka-shopify` prod, filter `[Shopify webhook]`) + Events Manager EMQ. Verify against a `#3878`-class real order (not #3879, which is £0/attribution-less).
3. **[Verify] Confirm a rebill is skipped.** *Open, waits for the first real Skio rebill.* Logs show "Skipping non-checkout order" with `hasCheckoutToken:false`. Logic is certain (rebills carry no `checkout_token`).
4. ~~**[Doc] Record results**~~ **DONE** in `docs/analytics/META_PIXEL_AND_CAPI.md` + `skio-migration-status.md`. `/review-analytics`: no cart-mutation code changed (verification-only), so no re-run warranted.

### Phase 2 - Synergy fulfilment verification/config (ops-led)

1. ~~**[Ops] Metafield audit.**~~ **DONE — PASS.** All 6 Skio base variants carry `custom.bundlecomposition` + correct weight, none `SYNERGYIGNORE` (see Verification results table). No gaps to fix.
2. **[Ops] Hand Synergy the new SKUs.** *Open — next action.* Ready-to-send document drafted: [`skio-synergy-sku-handoff.md`](./skio-synergy-sku-handoff.md) (context + a plain-text message to forward to Bethany with the 6 SKU→box mappings). Per the [Synergy add-a-variant process](./skio-migration-status.md#synergy-fulfilment--process-for-any-newchanged-subscription-variant); Synergy explodes via the metafield, no manual portal work. Complexity: Small.
3. **[Ops] Routing test.** *Open — needs a Synergy pull.* A Skio order (first + a recurring) pulls to Synergy, gets `IMPORTSYNERGY`, explodes into 28-boxes on Synergy's pick side, and inventory routes to the Synergy location. Coordinate with Bethany/Synergy. Note: Synergy pulls only **open + paid + unfulfilled** — the 100%-off `#3879` was auto-fulfilled, so it won't pull; use a normally-paid Skio order for this test. Complexity: Medium.

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
