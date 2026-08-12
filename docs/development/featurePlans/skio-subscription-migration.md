# Skio Subscription Migration (replace Loop)

**Status:** Scoped, not started
**Scale:** C (multi-day, phased)
**Tracking:** Plan doc only (no Jira yet; each active phase gets scoped more deeply and ticketed at build time)
**Owner:** Rudh
**Created:** 2026-08-12

---

## Problem

Loop is being replaced by Skio as our subscription platform for lower fees and a fully-managed, no-code subscription layer. We self-install and wire Skio into the headless storefront ourselves; Skio's team migrates existing subscription contracts after we go live. This serves **retention / LTV** (better-managed subscriptions, far less bespoke code to maintain) and indirectly acquisition (the subscribe flow keeps converting unchanged).

**Who it serves:** every subscriber (new and existing), plus engineering/ops (removes a large custom Loop portal and its maintenance burden).

## Approach

Skio installs as a Shopify app and uses **Shopify Subscription Contracts natively**; checkout stays Shopify-hosted (`cart.checkoutUrl` unchanged). Skio creates its **own selling plans and selling-plan groups**, so every subscribe surface must be re-pointed from Loop's `sellingPlanId`s to Skio's. We then embed Skio's hosted customer portal via a **server-signed iframe** and, at a coordinated big-bang cutover, decommission all Loop wiring.

**Correction confirmed during Phase 1 scoping:** our storefront does **not** query Shopify for selling plans. Product / variant / plan data is entirely static (hardcoded GIDs in `funnelData.ts` `FUNNEL_VARIANTS`, `PLAN_CONFIGURATIONS`, and `protocolSubscriptions.ts`). There is therefore **no product-query work** in this migration; re-pointing is a constant swap (Phase 2). The cart fragment already requests `sellingPlanAllocation { sellingPlan { id name } }` (`app/lib/shopifyQueries.ts`), which is enough to render the "Subscription" label.

**Design language:** Simple DTC for the `/account` page frame. The portal itself is themed inside the Skio dashboard (our CSS cannot reach into the iframe).

## Migration model (confirmed with user)

Big-bang cutover coordinated with Skio's team:

1. Skio's team exports our live Loop contracts and recreates them as Skio subscription contracts (copies).
2. We flip the storefront to Skio's selling plans.
3. Loop auto-billing is disabled at that moment so nobody is double-charged.
4. Loop wiring is removed in the cutover release.

The single hard coordination point is timing the storefront flip with Skio's migration-complete confirmation and the Loop billing shutoff. This lives in the Phase 4 runbook, not extra build.

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Skio setup + selling-plan mapping | Not Started (Active) |
| 2 | Re-point purchase surfaces (PDP, then funnel, then rest) | Not Started (Active) |
| 3 | Embedded Skio customer portal (iframe) | Not Started (Active) |
| 4 | Cutover + Loop decommission | Not Started (Active) |
| 5 | Legacy protocol retirement | Future (ops-gated) |

Each phase is independently deployable via a Vercel preview. Phases 1-3 can be built and previewed without disrupting live Loop subscriptions; Phase 4 is the switch.

---

## Active phase task breakdown

### Phase 1 - Skio setup + selling-plan mapping

No user-facing change. Establishes the Skio side, captures the plan mapping, and scaffolds the storefront config. Ticket: **SCRUM-1210**.

1. **[Ops/Shopify] Install Skio + recreate selling plans**
   - What: install the Skio Shopify app; build Skio selling plans + groups matching current cadences and Subscribe & Save discounts (Flow/Clear/Both x monthly sub x quarterly). Generate the API token; note `STORE_ID_HASH`; confirm portal version (cpv3 vs v2) for Phase 3.
   - Complexity: Small (config, not code).
2. **[Docs] Capture the plan mapping**
   - What: record old Loop plan GID -> new Skio plan GID for every subscribe combo (`FUNNEL_VARIANTS`, `PLAN_CONFIGURATIONS`, `PROTOCOL_VARIANTS`) in `docs/product/SKU_AND_SHOT_REFERENCE.md`. This mapping is the direct input Phase 2 consumes.
   - Dependencies: task 1.
   - Complexity: Small.
3. **[Infra] Secrets + mapping scaffold**
   - What: add `SKIO_STORE_ID_HASH` and `SKIO_API_TOKEN` as optional getters on `app/lib/env.ts` (mirror `loopApiKey`) + `optionalEnvVars`; set real values in Vercel + `.env.local`. Create `app/lib/skio.ts` holding the GraphQL client config (`https://graphql.skio.com/v1/graphql`, header `authorization: API {token}`) and the exported Loop -> Skio mapping const. Not wired into any purchase flow yet.
   - Dependencies: tasks 1-2.
   - Complexity: Small.
   - Files: `app/lib/env.ts`, new `app/lib/skio.ts`.
4. **[Commerce] Cart-fragment sanity check**
   - What: confirm the existing `CART_FRAGMENT` renders the "Subscription" label with a Skio plan attached to a test cart line; add `options` to the `sellingPlan` selection only if needed. No product-query work (plans are static, not queried).
   - Complexity: Small.
   - Files: `app/lib/shopifyQueries.ts` (only if the label needs `options`).

### Phase 2 - Re-point purchase surfaces

Swap every subscribe attach point from Loop plan IDs to Skio plan IDs. Order: **PDP first, then funnel, then anything else the sweep finds.** Keep behind a config swap so it flips cleanly at cutover.

1. **[Discovery] Subscribe-surface sweep** (blocking)
   - What: grep every attach point for `sellingPlanId` / `sellingPlan` and produce the complete list of subscribe surfaces (PDP, funnel, subscription-box components, `/go/[slug]` landings, any others). Missing one surface means a post-cutover buyer hits a dead Loop plan.
   - Complexity: Small but blocking for the rest of Phase 2.
2. **[Commerce] Re-point PDP**
   - What: swap plan IDs in `PLAN_CONFIGURATIONS` / `productData`; verify `CartContext` attaches the Skio plan on add-to-cart.
   - Dependencies: Phase 1, discovery sweep.
   - Complexity: Medium.
   - Files: `app/lib/productData.ts` (+ submodules), `app/context/CartContext.tsx`.
3. **[Commerce] Re-point funnel**
   - What: swap `FUNNEL_VARIANTS` plan IDs; verify `funnelCheckout` builds the correct `cart.checkoutUrl` with the Skio plan attached.
   - Dependencies: Phase 1, discovery sweep.
   - Complexity: Medium.
   - Files: `app/lib/funnelData.ts`, `app/lib/funnelCheckout.ts`.
4. **[Commerce] Re-point remaining surfaces**
   - What: re-point anything else the sweep surfaced.
   - Complexity: TBD by discovery.

### Phase 3 - Embedded Skio customer portal (iframe)

Replace the self-built subscriptions UI with Skio's hosted portal via a server-signed magic link.

1. **[Server] Signed iframe-src route**
   - What: route handler reads the authenticated Shopify customer id/email (via the Customer Account API session), computes `hash = md5(customerId + STORE_ID_HASH)`, and returns/injects the `https://cpv3.skio.com/a/account/shopify-login` src with the required query params (`hostname`, `shop`, `email`, `id`, `totalSpent`, `hash`). `STORE_ID_HASH` stays server-side only, never exposed to the client.
   - Dependencies: Phase 1 secrets.
   - Complexity: Medium.
   - Files: new `app/api/auth/skio-portal/route.ts`, `app/context/AuthContext.tsx`.
2. **[Frontend] Embed in /account**
   - What: replace the subscriptions UI with the iframe inside a Simple DTC shell; handle loading / empty / signed-out states, resize, and mobile layout.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/account/subscriptions/*`.
3. **[Infra] CSP + frame headers**
   - What: add `frame-src https://cpv3.skio.com` to our CSP; confirm Skio's `frame-ancestors` / `X-Frame-Options` permit our domain (verify in a preview deploy). Theme the portal in the Skio dashboard.
   - Complexity: Small.
   - Files: `next.config.ts` / headers config.

### Phase 4 - Cutover + Loop decommission

The switch. Coordinated with Skio, then Loop is removed.

1. **[Cutover] Runbook**
   - What: sequence the storefront flip with Skio's migration-complete confirmation and Loop auto-billing shutoff so no contract is double-billed. Written before the release.
   - Complexity: Small doc, high-stakes.
2. **[Cleanup] Remove Loop**
   - What: delete `app/lib/loop.ts`, all `app/api/auth/subscriptions/*` Loop routes, custom subscription components/modals + the RETENTION15 cancel flow, Loop env vars, and the Loop per-contract address-mirror in `customer/update` (after confirming Skio re-reads Shopify addresses).
   - Complexity: Large.
   - Files: `app/lib/loop.ts`, `app/api/auth/subscriptions/*`, `app/components/subscriptions/*`, `app/api/auth/customer/update/route.ts`, `app/lib/env.ts`.
3. **[Commerce] Webhooks**
   - What: re-wire `app/api/webhooks/shopify/orders` as needed for Skio; confirm exact webhook setup with Skio's onboarding team.
   - Complexity: Medium.

---

## Future work

### Phase 5 - Legacy protocol retirement (ops-gated)

After Skio confirms zero remaining protocol contracts, retire `app/lib/legacy/protocolSubscriptions.ts` and `PROTOCOL_VARIANTS`. This is the QUARANTINED live-legacy commerce layer (non-deletable today) and ties into the existing `asset-and-protocol-cleanup.md` Phase 5. Gated on ops confirmation that no subscriber still holds a protocol contract.

### Possible follow-ups (not committed)

- **Retention analytics via Skio webhooks** - with the iframe we lose visibility into in-portal cancel/pause/skip actions our custom flow used to fire. If retention analytics matter, feed Skio webhooks into our analytics. Decide after go-live.
- **Native retention/deflection** - if Skio's portal cancel-deflection proves weaker than our RETENTION15 flow, consider rebuilding deflection natively on Skio's GraphQL API.

---

## Rabbit holes

- **Iframe auth/resize undocumented edges** - the magic-link hash and postMessage-based resize are not fully specced in public docs. Verify against a real Skio-provisioned store early (a Phase 3 spike) before committing the portal UI.
- **The complete subscribe-surface list** - missing one surface means a subscriber buys a dead Loop plan after cutover. The Phase 2 discovery sweep is the guard; treat it as blocking.
- **Address editing** - confirm Skio's portal writes address changes back to Shopify so we can safely drop the Loop address-mirror without losing sync.

## No-gos

- Not building our own portal on Skio's GraphQL API. The user chose the no-code iframe. (Skio's GraphQL API at `https://graphql.skio.com/v1/graphql` remains available if we ever want native actions later.)
- Not deleting the legacy protocol commerce layer now. That is Phase 5, ops-gated.
- Not touching Shopify-hosted checkout. It is unchanged, still `cart.checkoutUrl`.

## Risks

- **Lost in-portal analytics** - iframe hides cancel/pause/skip events. May need Skio webhooks if retention analytics matter (see Future work).
- **Double-billing at cutover** - mitigated by the runbook (Loop billing disabled the moment Skio goes live).
- **CSP / frame-ancestors mismatch** - could silently block the portal. Verify in a preview deploy.

## Open questions

- Skio portal **v3 (`cpv3`) vs v2 (`storefront-iframe.skio.com`)** - confirm which is provisioned for us.
- Does Skio's portal handle **address edits and payment-method updates** fully, or do we retain any of our own routes for those?
- Exact **webhook setup** and the **migration checklist** - get directly from Skio's onboarding team.

---

## Technical reference

### Current Loop integration (to be removed at Phase 4)

- `app/lib/loop.ts` - Loop Admin API client (`api.loopsubscriptions.com/admin/2023-10`, `X-Loop-Token`). The whole Loop SDK surface: get/pause/resume/cancel/skip/frequency/quantity/swap.
- `app/api/auth/subscriptions/` - portal server routes (hybrid read of Shopify contracts + Loop details; consolidated mutations in `[id]/pause/route.ts`; `[id]/reschedule`; `payment-methods/*`).
- `app/api/auth/customer/update/route.ts` - mirrors name/address to every active/paused Loop contract via `PUT /subscription/{id}/address`. Loop stores addresses per-contract; Skio should remove this need.
- `app/account/subscriptions/*` + `app/components/subscriptions/*` - the fully self-built portal UI (Edit/MultiLineEdit/Pause/Resume/Reschedule/Reactivate/PlaceOrder/Cancellation), including the three-step reason -> retention (`RETENTION15`) -> confirm cancel flow. Hooks: `useSubscriptions.ts`, `usePaymentMethods.ts`.
- Loop selling-plan IDs live in `app/lib/funnelData.ts` (`FUNNEL_VARIANTS`) and `app/lib/legacy/protocolSubscriptions.ts` (`PROTOCOL_VARIANTS`).

### Purchase-side selling plans (to be re-pointed in Phase 2)

- `app/context/CartContext.tsx` + `app/api/cart/route.ts` attach `sellingPlanId` to cart lines.
- Funnel path `app/lib/funnelCheckout.ts` builds a Shopify `cart.checkoutUrl` with the plan attached (bypasses CartContext).
- `PLAN_CONFIGURATIONS` (starter/pro/max -> sellingPlanId + group) and `FUNNEL_VARIANTS` (product x cadence -> variantId + sellingPlanId).

### Auth / customer identity (used to sign the iframe)

- Shopify **Customer Account API** OAuth 2.0 + PKCE. Cookies set at callback: `customer_access_token`, `customer_id_token`, `customer_token_expires`. Session via `/api/auth/session`. **No Multipass.** `DEV_MOCK_AUTH` bypass exists for local dev.
- For the iframe, the authenticated customer's Shopify `id` and `email` are the identity handed to Skio's magic-link hash.

### Skio integration facts (from vendor docs)

- Skio uses Shopify Subscription Contracts natively; checkout stays Shopify-hosted.
- Storefront wiring is via Shopify's Storefront API selling-plan objects (no Skio JS SDK for the selector). The Hydrogen/Remix onboarding is the closest analog to our Next.js setup: query `sellingPlanGroups` / `sellingPlanAllocations`, add to cart with `{ merchandiseId, quantity, sellingPlanId }`, render the label from the cart line's `sellingPlanAllocation`.
- Iframe portal: `https://cpv3.skio.com/a/account/shopify-login?hostname=&shop=&email=&id=&totalSpent=&hash=` where `hash = md5(customerId + STORE_ID_HASH)`; `STORE_ID_HASH` from dashboard.skio.com/theme. Portal theming is done in the Skio dashboard.
- Skio GraphQL API: `https://graphql.skio.com/v1/graphql`, header `authorization: API {token}`. Limits: depth 4, 100 nodes/request, 2,000 req/min. Exposes Shopify GIDs as `platformId` (useful for reconciliation). Mutations cover pause/skip/cancel/reactivate/swap/line edits.
- Dashboard roles: Store Owner / Admin / Member (per-section restrictions, per-user overrides).

### Related docs

- `docs/ops/subscription-platform.md` - Loop vs Skio fee/contract/migration snapshot (primary migration doc).
- `docs/features/CUSTOMER_PORTAL.md` - exhaustive current portal + Loop behaviour spec.
- `docs/workflows/04-shopify-commerce.md` - Loop integration rules, funnel selling plans.
- `docs/development/featurePlans/account-portal-funnel-simplification.md` - takes cues from Magic Mind's Skio portal; overlaps with this migration.
- `docs/development/featurePlans/account-portal-simple-dtc.md` - `/account` restyle.
- `docs/development/featurePlans/asset-and-protocol-cleanup.md` - Phase 5 protocol retirement.
- `docs/product/SKU_AND_SHOT_REFERENCE.md` - canonical selling-plan GIDs.

### Skio documentation (vendor)

- https://help.skio.com/docs/new-to-skio
- https://help.skio.com/docs/using-skio
- https://help.skio.com/docs/advanced-skio-setup
- https://code.skio.com/
- https://help.skio.com/docs/managing-skio-user-permissions-1
- https://help.skio.com/docs/onboarding-integrating-on-hydrogen-remix
- https://help.skio.com/docs/how-do-i-render-the-skio-logincustomer-portal-in-an-iframe

---

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1210 | [Shopify & Subscriptions] Skio Phase 1: install app, create selling plans, capture plan mapping + secrets scaffold | 1 | To Do |

Sprint 29, epic SCRUM-768 (Shopify & Subscriptions). Phases 2-4 are scoped more deeply and ticketed at build time; Phase 5 is Future/ops-gated.
