# Skio Subscription Migration (replace Loop)

**Status:** Phase 1 in progress
**Scale:** C (multi-day, phased)
**Tracking:** This doc owns scope/rationale; live status in [`skio-migration-status.md`](./skio-migration-status.md) (canonical "where are we"). Each active phase is ticketed at build time.
**Owner:** Rudh
**Created:** 2026-08-12
**Last updated:** 2026-08-24 (Skio's migration answers folded in - see Migration model + Open questions)

---

## Problem

Loop is being replaced by Skio as our subscription platform for lower fees and a fully-managed, no-code subscription layer. We self-install and wire Skio into the headless storefront ourselves; Skio's team migrates existing subscription contracts after we go live. This serves **retention / LTV** (better-managed subscriptions, far less bespoke code to maintain) and indirectly acquisition (the subscribe flow keeps converting unchanged).

**Who it serves:** every subscriber (new and existing), plus engineering/ops (removes a large custom Loop portal and its maintenance burden).

## Approach

Skio installs as a Shopify app and uses **Shopify Subscription Contracts natively**; checkout stays Shopify-hosted (`cart.checkoutUrl` unchanged). Skio creates its **own selling plans and selling-plan groups**, so every subscribe surface must be re-pointed from Loop's `sellingPlanId`s to Skio's. We then embed Skio's hosted customer portal via a **server-signed iframe** and, at a coordinated big-bang cutover, decommission all Loop wiring.

**Correction confirmed during Phase 1 scoping:** our storefront does **not** query Shopify for selling plans. Product / variant / plan data is entirely static (hardcoded GIDs in `funnelData.ts` `FUNNEL_VARIANTS`, `PLAN_CONFIGURATIONS`, and `protocolSubscriptions.ts`). There is therefore **no product-query work** in this migration; re-pointing is a constant swap (Phase 2). The cart fragment already requests `sellingPlanAllocation { sellingPlan { id name } }` (`app/lib/shopifyQueries.ts`), which is enough to render the "Subscription" label.

**Design language:** Simple DTC for the `/account` page frame. The portal itself is themed inside the Skio dashboard (our CSS cannot reach into the iframe).

## Fulfilment (Synergy) — critical

Subscription variants must be set up as **Synergy virtual bundles**, or they reach the 3PL as plain SKUs that get hand-fixed on every order. Full process + the staged box model live in [`skio-migration-status.md`](./skio-migration-status.md) (Synergy fulfilment section). In short:

- The only **physical** unit is the **28-shot box** (`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`, `BATCHEXPIRY` set); every subscription variant is a **virtual bundle** via a `custom.bundlecomposition` metafield (`NxSKU+NxSKU`) that Synergy explodes into 28-boxes at pick time.
- **Process per new variant:** SKU `PRODUCT-SHOTS`, base price; set `bundlecomposition` (batch blank, invsync blank); weight = boxes × 2.1 kg; hand Synergy the SKU → box mapping in one document; never delete the physical `-28`.
- **Stage model** (fulfilment-gated): **Stage 1** ships everything in 28-boxes, same for first + recurring (quarterly = 3 boxes); **Stage 2** (when the physical 20-box exists) re-points the recurring "20-increment" bundles' `bundlecomposition` + weight to the 20-box; **Stage 3** adds a first-order gift box. Skio plans/variants stay constant across stages.
- Adding `bundlecomposition` to the live quarterly variants (done 14 Aug) already fixed the manual quarterly work, independent of the Skio cutover.

## Migration model (confirmed with user + Skio, Aug 2026)

Big-bang cutover coordinated with Skio's team. Skio's answers (Noah, 19 Aug) put real numbers on it:

1. **Pre-cutover (ours, one-way door).** Archive all Loop history. Skio replays none of it into Skio, so anything not exported before Loop is switched off is gone. conka-lab's `raw_loop_*` Convex tables already hold most of it - verify completeness and freeze a snapshot.
2. **Possible Loop plan upgrade (ours).** Skio may need us to upgrade our Loop plan so their team can generate the migration CSV. Skio credits the cost back on our next Skio invoice; their migrations team flags it if needed.
3. **Gate.** Skio confirms all Loop billing has completed for that day, then starts the copy. **This is what prevents a double charge** - contracts arrive in Skio carrying their existing next-charge dates, so nothing bills twice.
4. **Migration (Skio, 2-4 days end to end).** Loop contracts are recreated as **new** Shopify/Skio subscription contracts.
5. **Storefront flip (ours).** Re-point selling plans to Skio (already code-complete behind `NEXT_PUBLIC_SKIO_ENABLED`).
6. **Loop billing off, Loop wiring removed.**

### What migrates and what does not

Confirmed by Skio twice (19 + 20 Aug):

| Carries over | Does **not** carry over |
|---|---|
| Next-charge dates (billing continuity) | Original subscription start date - the Skio contract's create date **is the migration date** |
| Line items, frequencies, current status | Prior billing / cycle count (`cyclesCompleted` starts fresh) |
| Historical orders (they live in Shopify, untouched) | Loop lifecycle events - no replay of skips, pauses, cancellations, dunning attempts |
| | Loop cancel-flow reasons |

Skio's guidance: export and retain Loop reporting before cutover, and expect a discontinuity in cohort / churn / tenure reporting across the boundary. Their migrations team reviews the field-level data mapping with us before go-live - **book that session.**

### Why the create-date reset matters more than it looks

conka-lab's retention engine derives subscriber tenure from the subscription start date, and low tenure is what defines the `NEW_SUB_*` onboarding segments. Taken naively, every long-tenured subscriber re-materialises at cutover with tenure ~0 and gets pitched the new-subscriber welcome sequence. The fix is ours (freeze Loop-derived history and coalesce it in) and it is now **a certainty to build for, not a risk to monitor**. Detail: conka-lab plan sections 6a and 11.

### Coordination points

- Timing the storefront flip against Skio's migration-complete confirmation and the Loop billing shutoff (Phase 4 runbook).
- Confirming from the Migrations Guide who disables Loop auto-billing and at which point in the window. Skio's billing-completed-first gate already prevents a double charge; this is a runbook line, not an open risk.
- conka-lab's ingest source flip (`SUBSCRIPTION_SOURCE=skio`) must land **after** Skio confirms migration complete, or the not-yet-migrated back book disappears from `sanitized_customers` mid-window.

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

Embed Skio's hosted portal via a server-signed magic link, at a **new route** so the live Loop portal is untouched during the build. Ticket: **SCRUM-1221**. Design language: Simple DTC for the `/account/manage` frame (portal interior themed in the Skio dashboard, our CSS cannot reach it).

**Pragmatic decision (approved 18 Aug):** build the Skio portal at a **new URL `/account/manage`** rather than gating the body of `/account`. `/account` and the whole Loop portal (`app/account/page.tsx` list + `app/account/subscriptions/[id]` detail + `app/components/subscriptions/*`) stay exactly as-is. The `NEXT_PUBLIC_SKIO_ENABLED` flag only controls the **entry point**: when on, `/account`'s "Manage Subscriptions" link points to `/account/manage`; when off, `/account` is unchanged. This mirrors Skio's own "embed a Manage Subscriptions link" guidance and keeps the switch reversible.

1. **[Infra] Shared flag helper + CSP**
   - What: extract the inline-duplicated `subscriptionsUseSkio()` (in `app/lib/funnelData.ts` + `app/(trial-b)/lib/funnelData.ts`) into one shared `NEXT_PUBLIC_SKIO_ENABLED` helper. Add a `Content-Security-Policy` header with `frame-src https://cpv3.skio.com` to the `securityHeaders` array in `next.config.ts` (no CSP exists today; our own `X-Frame-Options: DENY` is about others embedding us and does not block us embedding Skio).
   - Complexity: Small.
   - Files: new `app/lib/subscriptionsFlag.ts`, `next.config.ts`, the two `funnelData.ts`.
2. **[Server] Signed iframe-src route**
   - What: `app/api/auth/skio-portal/route.ts` reads the authenticated customer from the session cookies (as `app/api/auth/session/route.ts` does), parses the **numeric** id out of the Shopify GID, computes `hash = md5(customerId + SKIO_STORE_ID_HASH)`, and returns the `https://cpv3.skio.com/a/account/login` src with `hostname`, `shop`, `email`, `id`, `totalSpent`, `hash`. `totalSpent` is not in our session and not part of the hash: send `0` (verify in the spike). `SKIO_STORE_ID_HASH` stays server-side only.
   - Dependencies: task 1, Phase 1 secrets (`env.skioStoreIdHash`).
   - Complexity: Medium.
   - Files: new `app/api/auth/skio-portal/route.ts`, `app/lib/env.ts`.
3. **[Frontend] New `/account/manage` route + entry point**
   - What: new `app/account/manage/page.tsx` renders the Skio iframe in a Simple DTC shell (loading / signed-out / error states, mobile height, postMessage resize). Flag-gate the entry point in `app/account/page.tsx`: link "Manage Subscriptions" to `/account/manage` when the flag is on, else keep the current Loop list. `/account/manage` exists unconditionally (a new page harms nothing) and is directly testable when logged in.
   - Dependencies: task 2.
   - Complexity: Medium.
   - Files: new `app/account/manage/page.tsx` (+ client island), `app/account/page.tsx` (entry link only).
4. **[Verify] Preview spike** (gating)
   - What: on a Vercel preview with the flag on and a REAL Customer Account login (mock auth gives a non-numeric id and cannot drive the portal), confirm the exact URL (`/a/account/login` vs `/a/account/shopify-login`), that the hash auto-logs in, that Skio's `frame-ancestors` allow our domain, and postMessage resize. Fix the URL/param format if the spike disproves the assumptions.
   - Complexity: Small but blocking sign-off.

### Phase 4 - Cutover + Loop decommission

The switch. Coordinated with Skio, then Loop is removed.

0. **[Pre-cutover] Archive Loop history** (blocking, one-way door)
   - What: full export + frozen snapshot of Loop subscriptions, activity logs, orders, billing attempts and cancel-flow reasons. Skio replays none of it and Loop is unrecoverable once switched off. conka-lab's `raw_loop_*` Convex tables are the existing store - verify completeness against the Loop API, then freeze. Also export Loop's own reporting so we keep a pre-cutover churn/tenure baseline.
   - Dependencies: none - can start now.
   - Complexity: Medium. Owned jointly with conka-lab.
0b. **[Ops] Loop plan upgrade - awareness only, no action needed**
   - What: Skio may need us on a higher Loop plan so their team can generate the migration CSV. **Skio committed to notifying us if/when this is necessary**, and they credit the cost back on the next Skio invoice. Nothing to chase - just know the Loop tier we are on (visible in the Loop dashboard) so the ask is not a surprise, and budget for a one-off Loop charge.
   - Complexity: None until they flag it.
0c. **[Ops] Skio data-mapping session**
   - What: book the pre-go-live mapping review Skio offers; take conka-lab's field map (`loop-to-skio-ingest-migration.md` section 4) into it.
   - Complexity: Small.
1. **[Cutover] Runbook**
   - What: sequence the storefront flip, Skio's 2-4 day migration window, the migration-complete confirmation, the conka-lab `SUBSCRIPTION_SOURCE` flip and the Loop auto-billing shutoff so no subscriber disappears mid-window. Double-billing is already handled by Skio's billing-completed-first gate; the open detail is who disables Loop auto-billing and when, per the Migrations Guide. Written before the release.
   - Complexity: Small doc, high-stakes.
1b. **[Safety] Mute retention email across the window**
   - What: set conka-lab `KLAVIYO_ENABLED=false` for the duration of the cutover window, re-enable after a post-migration segment-parity check passes. Cheap insurance against the back book being mass re-segmented (tenure reset, blank pause history) and emailed while data is in flux.
   - Complexity: Small.
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

### Klaviyo / retention-lab migration (sub-plan)

Our Klaviyo retention lab (winback, dunning, pause/reactivation, replenishment, lifecycle segments) runs on Loop's 23 subscription-event metrics + Loop-synced profile properties. At the Phase 4 cutover these must be re-pointed to Skio's equivalents or the whole retention lab silently goes quiet. Scoped separately in [`skio-klaviyo-retention-migration.md`](./skio-klaviyo-retention-migration.md); its cutover switch is synced to this doc's Phase 4.

### Possible follow-ups (not committed)

- **Retention analytics via Skio webhooks** - with the iframe we lose visibility into in-portal cancel/pause/skip actions our custom flow used to fire. Skio confirmed it emits subscription-lifecycle webhooks + has a native Triple Whale integration (see [`../../features/skio/migration.md`](../../features/skio/migration.md)); the Klaviyo side is covered by the sub-plan above.
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

### Still open with Skio

1. **Can the migration carry the original subscription start date onto the new contract?** Skio already writes a `migrationIndex` on migrated subscriptions, so migration-time writes are possible. If they can also write the original Loop start date (and ideally cycle count) into `metadata` / `note` / `customAttributes`, the tenure-reset problem disappears at source. *(Highest leverage - ask before building the workaround.)*
*(Was: does the Klaviyo integration carry the cancel reason? **Answered by Skio's own docs, 2026-08-24 - yes.** See the answered list below. No need to ask.)*

### Previously open, still unanswered

- Skio portal **v3 (`cpv3`) vs v2 (`storefront-iframe.skio.com`)** - confirm which is provisioned for us.
- Does Skio's portal handle **address edits and payment-method updates** fully, or do we retain any of our own routes for those?
- Exact **webhook setup** - Skio answered the *polling* question (audit log) but not the webhook configuration.

### Answered by Skio (19-20 Aug 2026, Noah)

- **Migration mechanics** - Migrations Guide is the walkthrough; 2-4 days end to end; possible Loop plan upgrade, credited back. -> Migration model above.
- **Double-billing** - handled by sequencing: Skio confirms Loop billing has completed for the day *before* copying, and copies carry their existing next-charge dates.
- **What migrates** - next-charge dates and current state yes; original start date, cycle count and Loop event history no. -> Migration model table.
- **Status model** - `status` (ACTIVE / FAILED / PAUSED / CANCELLED / UNDER_REVIEW) plus optional `statusContext` (e.g. `DUNNING`). A failing subscription sits in `FAILED`, not `ACTIVE`; `FAILED -> ACTIVE` on recovery, `FAILED -> CANCELLED` on retry exhaustion.
- **Voluntary vs involuntary cancellation** - a dunning-exhausted cancel carries no cancel-flow reason; a customer cancel does.
- **Cancel reasons are not available via the *API*** - approved feature request, in development. This reflects Skio's no-code model: the reason tree is built and acted on inside their cancel-flow builder, so the reason never needs to cross an API boundary for Skio's own purposes. It is also why moving deflection into Skio's portal is the right call.
- **But reasons DO reach us via the event layer** (verified from Skio's docs, 2026-08-24, not asked of Noah): the `subscriptionCancelled` payload carries `cancellationReason` (root) and `finalCancellationReason` (sub-reason), delivered through the Klaviyo integration or Skio's custom webhook. Skio's own winback guidance is to trigger-split on `cancellationReason` in Klaviyo. This is better than the CSV export Skio pointed us at, since it includes the sub-reason that exports handle unreliably. Net: no reporting loss and no redesign of the involuntary/voluntary split. -> retention sub-plan + conka-lab section 6a.2.
- **Pause history** - `PAUSED` for current state; full pause/resume history in the audit log.
- **Lifecycle events** - the audit-log / event table is confirmed as the right source for a scheduled feed.
- **Bulk historical load** - Public REST API (cursor pagination, date/ID filters) or the BigQuery integration, not paged GraphQL.

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
- Three data channels: **GraphQL** for scheduled incremental pulls, the **Public REST API** (cursor pagination + date/ID filters; orders / subscriptions / storefront users / products) for bulk exports, and the **BigQuery integration** for a turn-key historical backfill. Skio's recommendation for a one-time full history load is REST bulk or BigQuery, not paged GraphQL.
- Subscription state is two fields: `status` (`ACTIVE` / `FAILED` / `PAUSED` / `CANCELLED` / `UNDER_REVIEW`) and optional `statusContext` (e.g. `DUNNING`). Dunning subscriptions sit in `FAILED`, not `ACTIVE`.
- The subscription **audit log** is the canonical lifecycle event feed and is confirmed as pollable on a schedule.
- **Cancel-flow reason text is not exposed over the API** (feature request in development). Reporting-only via dashboard exports.
- Dashboard roles: Store Owner / Admin / Member (per-section restrictions, per-user overrides).

### Related docs

- `docs/ops/subscription-platform.md` - Loop vs Skio fee/contract/migration snapshot (primary migration doc).
- `docs/features/CUSTOMER_PORTAL.md` - exhaustive current portal + Loop behaviour spec.
- `docs/workflows/04-shopify-commerce.md` - Loop integration rules, funnel selling plans.
- `docs/development/featurePlans/account-portal-funnel-simplification.md` - takes cues from Magic Mind's Skio portal; overlaps with this migration.
- `docs/development/featurePlans/account-portal-simple-dtc.md` - `/account` restyle.
- `docs/development/featurePlans/asset-and-protocol-cleanup.md` - Phase 5 protocol retirement.
- `docs/product/SKU_AND_SHOT_REFERENCE.md` - canonical selling-plan GIDs.
- **conka-lab repo** `docs/featurePlans/loop-to-skio-ingest-migration.md` - the data-pipeline half (field-by-field Loop -> Skio map, involuntary-churn derivation, cutover continuity). Cutover synced to this doc's Phase 4.

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
| SCRUM-1221 | [Shopify & Subscriptions] Skio Phase 3: embedded customer portal (iframe) at /account/manage | 3 | To Do |

Sprint 29, epic SCRUM-768 (Shopify & Subscriptions). Phases 2-4 are scoped more deeply and ticketed at build time; Phase 5 is Future/ops-gated.
