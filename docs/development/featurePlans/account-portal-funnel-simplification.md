# Account Portal — Funnel Simplification

> **SUPERSEDED (2026-09-02).** This plan shaped the self-built Loop account
> portal, and every file it names (`app/account/subscriptions/**`,
> `app/components/subscriptions/**`) was deleted in the Loop decommission. Skio's
> embedded portal at `/account/manage` replaced the surface. Kept for the
> reasoning behind the card and cadence decisions, not as current behaviour.
> See `loop-decommission.md`.


Simplify the subscription portal from its protocol-era shape to the funnel product model (Flow / Clear / Both × monthly / quarterly), taking structural cues from Magic Mind's Skio portal. This is the **content / IA / commerce-model** simplification — distinct from and complementary to the cosmetic Clinical→Simple DTC restyle in [`archive/account-portal-simple-dtc.md`](./archive/account-portal-simple-dtc.md) (SCRUM-1188), which deliberately ring-fenced this logic.

## Problem (root cause: wrong abstraction)

The portal is hard-coded to the **protocol** concept — tiers (starter/pro/max), formula-mix ratios, protocol IDs, pack sizes (4/8/12/28) — instead of a **generic DTC subscription product** (a product, a cadence, a price, a next-delivery date, a status). Almost every defect below is a symptom of that one wrong abstraction: the portal reasons in "protocols," so for a plain funnel subscription its logic is either broken or irrelevant.

- Subscription cards title as `Conka Flow - Starter - 4` with a `STARTER` tier badge and a protocol subtitle/description — none of which map to a funnel product.
- A **"Formula mix — 0× Flow + 0× Clarity per week"** card renders literal zeros (funnel subs have no protocol flow/clarity counts). `SubscriptionListCard.tsx`.
- Shots-per-delivery and per-shot tiles were already removed (Aug 2026) for the same root cause; see [`../../product/SKU_AND_SHOT_REFERENCE.md`](../../product/SKU_AND_SHOT_REFERENCE.md) §5.
- `EditSubscriptionModal` lets a customer change protocol + tier + pack size (4/8/12/28) — controls that don't exist in the funnel model.

Net: the highest-frequency post-purchase surface looks broken and over-complex for what CONKA sells.

## Who it serves / business impact

Existing paying subscribers. Pure **retention / LTV** surface. Skio's own data on why this matters (all from their supplement-churn research, sourced below): self-service portals cut support tickets 30-40%; skip/swap-instead-of-cancel cuts churn ~14%; reason-matched cancel offers save 15-30% of would-be cancellers; filtered in-portal upsells lift attach rate from 2-3% to 15-20% and add £6-10 to subscription AOV. The order-2 → order-3 drop is the primary supplement-churn KPI.

## The CONKA constraint that simplifies everything

Cadence is **not editable**. Monthly and quarterly are structurally different billing (quarterly = prepay 3 months, re-bill in 3 months), and one-time is not a subscription. So unlike Magic Mind we **drop the "edit frequency" control entirely**. The only plan change we expose is **product swap within the same cadence family**:

- Monthly sub → swap between Flow / Clear / Both (monthly variants)
- Quarterly sub → swap between Flow / Clear / Both (quarterly variants)
- No monthly ↔ quarterly, no cadence editing.

This is simpler than Skio's default and honest to the model. It also maps cleanly onto `BYO_VARIANTS` in `app/lib/byoData.ts` (product × cadence → variant GID + selling plan) — the swap is "re-point the line(s) to the target product's variant at the same cadence," far simpler than the protocol tier maths it replaces.

## The central move: a DTC-subscription view model

The refactor is not cosmetic and it is not a platform migration. **We stay on our current stack (Loop) and adopt Skio's *recommended portal structure* as a reference** — Magic Mind (a Skio store) is the worked example, and Skio's public docs are the pattern library. What changes is the internal model the portal renders from.

Introduce one normalizer that turns **any** subscription — funnel product, legacy protocol, main-site formula — into a common shape:

```
DtcSubscriptionView {
  displayName   // "Flow" | "Clear" | "Both" | (legacy) protocol name
  cadence       // "monthly" | "quarterly" | "one-time"
  price         // Loop's authoritative charged amount
  nextDate
  status        // active | paused | cancelled | expired
  lines[]       // 1 line (Flow/Clear) or 2 (Both); each { product, variantId, cadence }
  swapTargets[] // other products at the SAME cadence (empty for legacy/locked)
}
```

The card and detail view render **only** from this shape. Protocol-specific fields (tier, formula-mix ratio, shot maths, pack size) are not in the model, so they disappear from the UI by construction rather than by hand-deletion. A legacy protocol subscription is just an instance whose `displayName` is the protocol name and whose `swapTargets` are empty (or protocol-only) — it keeps rendering and renewing, it simply loses the broken funnel-shaped tiles.

`getSubscriptionType` (already funnel-aware: Flow/Clear/Both) is the seed for `displayName`; `getTierDisplayInfo` / `PROTOCOL_INFO` are what this view model **replaces** for display.

## Reference: what Magic Mind / Skio does (to borrow)

- Subscription-centric IA: **list → detail → act**. Compact list card (cadence + price + status); tap into a full detail view.
- Detail view order (Skio default): **Products** (per line: quantity stepper, variant dropdown, Swap, Skip) → **filtered upsell** ("Try Something New" / Add product) → **Shipping** → **Summary** (subtotal / shipping / promo / total, plus a "You've saved £X with your subscription" line) → **Billing** (payment method + backup).
- **4 primary actions** on the card (Skip, Get Now, Pause, Next order date); everything else under a **"More"** menu.
- **Swap, don't cancel** as the default retention move; cadence change / discount / pause escalate inside a reason-driven cancel flow.
- Cancel flow: optional value-reminder splash → reason (+ sub-reasons) → targeted offer; present cheapest saves first, discounts last.
- Supplement-specific: ask "how many days/week do you take it?"; recognise order-3 as a milestone ("most people quit here, here's 15% off") framed as loyalty not bribery.

## Target CONKA design

### IA
Keep the existing Overview page — it is already funnel-aware and Magic-Mind-like (greeting, spec strip, next-delivery hero, tap-to-manage list with Flow/Clear/Both badges). Adopt Skio's **list → detail** split for the Subscriptions tab (today it renders full expanded cards inline). Consider folding `/account/details` into an "Account" view later; not core.

### Subscription list card (compact)
Product image · clean product name (**Flow / Clear / Both**, via `getSubscriptionType`, never `- Starter - 4`) · **headline = cadence + price** ("Monthly · £39.99", "Quarterly · £109.99") · status pill · next renewal date · a single "Manage" affordance. **Remove:** tier badge, protocol subtitle/description, formula-mix card.

### Subscription detail view
- **Header:** product name + Monthly/Quarterly + price + status. No cadence edit.
- **Products:** the line(s) with a **Swap** control (same-cadence products only). "Both" is multi-line (Flow + Clear); swapping to/from it adds/removes a line (reuse the multi-line edit path). Skip = per-order skip.
- **Upsell (filtered):** reuse `getUpsellOffer` from `offerData.ts` (Flow→Both add Clear, Clear→Both add Flow, monthly→quarterly). Filter out what they already have (don't offer Both to a Both subscriber).
- **Shipping:** address + edit.
- **Summary:** subtotal / shipping (free for subs) / total + "You've saved £X vs one-time" (derive from `compareAtPrice` in `BYO_PRICING`).
- **Billing:** payment method + update (reuse `usePaymentMethods` / `triggerUpdateEmail`).

### Action hierarchy
- Primary: **Skip next order**, **Reschedule** (next order date), **Get now** (place order).
- Secondary ("More"): **Swap product**, **Pause**, **Apply promo**, **Cancel**.
- Removed: edit frequency/cadence, protocol/tier/pack-size selection.

### Cancel flow (retention)
Enhance the existing `CancellationModal` (already has reason + pause/edit/discount alternatives) into a Skio-style reason → reason-matched-offer flow: too-much-product → skip/pause; price → discount; taste/efficacy → swap product; deliver cheapest saves first, discount last. Optionally surface an **order-3 milestone** recognition (we already have `completedOrdersCount`).

## Phases

| Phase | Description | Depends on | Risk |
|-------|-------------|-----------|------|
| **0** | ✅ **Done (SCRUM-1199).** Introduce the `DtcSubscriptionView` normalizer and render the card from it: display name from `getSubscriptionType` (Flow/Clear/Both), headline = cadence + price. The tier badge, protocol subtitle/description, and formula-mix card fall out because the model has no such fields. Legacy protocol subs degrade to a generic card. | none | Low |
| **1** | ✅ **Done (SCRUM-1199).** List → detail IA split for the Subscriptions tab; deep-linkable detail route with Products / Upsell (read-only) / Shipping / Summary / Billing sections, rendered from the view model. | 0 | Medium |
| **2** | **Swap model:** re-point edit/swap from protocol tiers to funnel product × cadence via `BYO_VARIANTS`; `swapTargets` = same-cadence products; handle Both multi-line add/remove. | 0 | High (commerce logic) |
| **3** | In-portal filtered upsell carousel (reuse `getUpsellOffer`). | 1, 2 | Medium |
| **4** | Reason-driven cancel flow + order-milestone recognition, structured per Skio's cancel-flow recommendations. | 0 | Medium |

Phases 0 and 1 shipped together in SCRUM-1199 (the `DtcSubscriptionView` normalizer, compact list card, deep-linkable detail route, and retirement of the monolithic protocol `SubscriptionCard`). Phases 2-4 build on the view model; nothing here assumes or requires a platform migration.

## Affected files (current-state map)

- `app/account/subscriptions/page.tsx` — list page (renders expanded cards today).
- `app/components/subscriptions/SubscriptionListCard.tsx` — the card; artifacts to strip at ~130-157 (title/badge/subtitle/description) and ~256-280 (formula mix).
- `app/account/subscriptions/utils.ts` — `getSubscriptionType` (funnel-aware, reuse), `getTierDisplayInfo`/`PROTOCOL_INFO` (protocol-shaped, retire from display).
- `app/components/subscriptions/EditSubscriptionModal.tsx` + `MultiLineEditModal.tsx` — swap UI to remodel in Phase 2.
- `app/hooks/useSubscriptions.ts` — `changePlan` / `editMultiLine` to re-point at funnel variants.
- `app/lib/offerData.ts` — `OFFER_VARIANTS`, `getUpsellOffer`, `OFFER_PRICING` (source for swap targets, upsell, savings).
- `app/api/auth/subscriptions/**` — swap/edit routes.
- `CancellationModal.tsx` — cancel-flow enhancement (Phase 4).

## Ring-fence / no-gos

- `app/lib/legacy/protocolSubscriptions.ts` and `PROTOCOL_VARIANTS` stay live for existing protocol subscribers — do not delete. Existing protocol subs must still render and renew; the view model degrades them gracefully (generic name, empty/locked `swapTargets`, no funnel-shaped tiles).
- This is a platform-agnostic build on our current stack. Skio is a **pattern reference**, not a dependency or a migration; don't couple anything to Skio.

## Jira

| Ticket | Phases | Status |
|--------|--------|--------|
| SCRUM-1199 | 0 + 1 (view model, list → detail IA) | In Progress (built; branch `feature/account-portal-dtc-view-model`) |

Phases 2-4 are not yet ticketed (scope them when picked up).

## Build progress & handoff (visual alignment to Magic Mind)

**Design decision (locked):** the subscription card and detail view lead with the **delivery cadence** as the hero ("Every month" / "Every 3 months"), not the product name. Rationale: a subscription contract bills and delivers every line item on a single cadence, so the cadence is a property of the whole subscription; the product(s) are line items within it. One subscription per cadence is the norm; a customer holding multiple cadences is an edge case (route to support to adjust rather than build multi-cadence editing). This is the Magic Mind / Skio structure.

**Built on branch `feature/account-portal-dtc-view-model` (SCRUM-1199):**
- Phase 0: `DtcSubscriptionView` normalizer (`app/account/subscriptions/viewModel.ts`), with `cadenceHeroLabel`; retired the protocol `SubscriptionCard`.
- Phase 1: compact list card (`SubscriptionListCard`) + deep-linkable detail route (`app/account/subscriptions/[id]/page.tsx`) with Products / Shipping / Summary / Billing.
- Card aligned to MM: temporal hero ("Every month") + `Product · £price · Status` subline, dimmed image + optional Reactivate for inactive.

**Next (not yet built):**
1. **Detail hero** — make `[id]/page.tsx` lead with the cadence hero ("Every month") + `Flow · £39.99 · renews 10 Aug`; keep Back; NO edit-frequency pencil (cadence is not editable for us).
2. **Overview** (`app/account/page.tsx`) — restructure to `Hello, {name}` + subscription card(s) as the focus (active first, else inactive) + an Inactive subscriptions section + a "Looking for past orders? See here" link (to `/account/orders`); trim the spec strip and the separate "Your next shipment" hero so subscriptions are the focus.

Still deferred (not in this visual pass): upsell accept (Phase 3), swap (Phase 2), cancel flow (Phase 4).

## References

- Cosmetic restyle (complementary): [`archive/account-portal-simple-dtc.md`](./archive/account-portal-simple-dtc.md) (SCRUM-1188)
- SKU / shot model + why the tiles were wrong: [`../../product/SKU_AND_SHOT_REFERENCE.md`](../../product/SKU_AND_SHOT_REFERENCE.md)
- Funnel product model, swap targets, upsell, savings: `app/lib/offerData.ts`
- Skio portal structure + settings: https://help.skio.com/docs/customer-portal-v2-walkthrough , https://help.skio.com/docs/customer-portal-v2-settings
- Skio cancel-flow best practices: https://help.skio.com/docs/cancel-flow-best-practices-guide
- Skio supplement-churn playbook: https://skio.com/blog/why-70-of-supplement-subscribers-churn-after-order-2
- Skio product swap / upsell tooling: https://help.skio.com/docs/products-tool
