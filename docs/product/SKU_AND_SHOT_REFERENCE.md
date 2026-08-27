# SKU & Shot-Count Reference

The single reconciliation of **every product generation** CONKA has sold, their Shopify variant IDs / selling plans, and — critically — **how many shots each represents and at what price per shot**. It exists because that number is defined in several places that do not agree, and the account portal currently derives a subscriber's per-shot cost from the wrong one.

There are **three product generations** live in Shopify at once:

1. **Funnel products** — the current, actively-sold offering (Flow / Clear / Both × 3 cadences). New orders should be these.
2. **Main-site formula products** — Flow / Clear trial packs (4/8/12/28) used by PDPs, the home page, and the B2B portal.
3. **Legacy protocol products** — the retired Resilience / Precision / Balance / Ultimate protocols. **Not sold**, but existing subscribers still renew against them, so the IDs are live.

> **Code source of truth** (this doc mirrors it; on any change, edit the code first, then this doc):
> - Funnel: `app/lib/byoData.ts`
> - Main site: `app/lib/shopifyProductMapping.ts`, `app/lib/productPricing.ts`
> - Legacy: `app/lib/legacy/protocolSubscriptions.ts`, `app/lib/subscriptionProduct.ts`
> - Price-change log: [`../PRICING_HISTORY.md`](../PRICING_HISTORY.md)

---

## 1. Funnel products (current — actively sold)

The `/conka-flow`, `/conka-clarity`, funnel, and landing surfaces. Uses a **"priced + free shots"** model: the first subscription order ships a bonus box, then Loop swaps to the smaller recurring SKU from order 2. `perShot` is computed on **priced** shots only. Prices last verified in `byoData.ts` (baseline 2026-07-14, see PRICING_HISTORY.md).

| Product | Cadence | Price | Priced shots | Free (1st order) | 1st-order shots | Recurring shots | Per shot |
|---------|---------|-------|-------------|------------------|-----------------|-----------------|----------|
| Flow | Monthly sub | £39.99 | 20 | +8 | 28 | 20 | £2.00 |
| Flow | One-time | £69.98¹ | 20 | — | 20 | — | £3.50 |
| Flow | Quarterly sub | £109.99 | 60 | +20 | 80 | 60 | £1.83 |
| Clear | Monthly sub | £39.99 | 20 | +8 | 28 | 20 | £2.00 |
| Clear | One-time | £69.98¹ | 20 | — | 20 | — | £3.50 |
| Clear | Quarterly sub | £109.99 | 60 | +20 | 80 | 60 | £1.83 |
| Both | Monthly sub | £74.99 | 40 | +16 | 56 | 40 | £1.87 |
| Both | One-time | £99.98¹ | 40 | — | 40 | — | £2.50 |
| Both | Quarterly sub | £149.99 | 120 | +20 | 140 | 120 | £1.25 |

¹ One-time price bakes in £9.99 compulsory postage (`OTP_PRICE` + `OTP_POSTAGE`). Subscriptions always ship free.

### Funnel Shopify variant GIDs & selling plans

Note the **first-order-swap**: the monthly-sub variant recorded in code is the *bonus* SKU (28/56). After order 1, Loop swaps the contract to the recurring SKU (20/40), **whose GID is not stored in this codebase** — it lives Loop-side. This matters for the account portal (see §5): you cannot resolve a recurring monthly subscriber's shot count by matching its variant GID against `BYO_VARIANTS`.

| Product | Cadence | SKU (label) | Variant GID (numeric) | Selling plan |
|---------|---------|-------------|-----------------------|--------------|
| Flow | Monthly sub | FLOW-FUNNEL-28 → swaps to FLOW-FUNNEL-20 | 57568795918710 | 712527348086 |
| Flow | One-time | FLOW-FUNNEL-20-OTP | 58153768714614 | — |
| Flow | Quarterly sub | FLOW-FUNNEL-80 | 58153768747382 | 712527413622 |
| Clear | Monthly sub | CLEAR-FUNNEL-28 → swaps to CLEAR-FUNNEL-20 | 57568517489014 | 712527348086 |
| Clear | One-time | CLEAR-FUNNEL-20-OTP | 58153768812918 | — |
| Clear | Quarterly sub | CLEAR-FUNNEL-80 | 58153768845686 | 712527413622 |
| Both | Monthly sub | BOTH-FUNNEL-56 → swaps to BOTH-FUNNEL-40 | 57568809976182 | 712527479158 |
| Both | One-time | BOTH-FUNNEL-40-OTP | 58153768911222 | — |
| Both | Quarterly sub | BOTH-FUNNEL-140 | 58153768943990 | 712527446390 |

Synergy 3PL barcodes on the physical funnel boxes: `FLOWFUNNEL28` / `CLEARFUNNEL28` (Code 128). See [`../shipping/SHIPPING_AND_COURIERS.md`](../shipping/SHIPPING_AND_COURIERS.md).

---

## 2. Main-site formula products (Flow / Clear trial packs)

PDP / home / B2B. One-time base prices; subscriptions apply a global **20%** discount (`SUBSCRIPTION_DISCOUNT_PERCENT`). Shots = the pack size, one shot per unit.

| Formula | Pack | One-time | Subscription (−20%) | Per shot (sub) | Variant GID | Selling plan (frequency) |
|---------|------|----------|---------------------|----------------|-------------|--------------------------|
| Flow (01) | 4 | £14.99 | £11.99 | ~£3.00 | 57000187363702 | 711429882230 (weekly) |
| Flow (01) | 8 | £28.99 | £23.19 | ~£2.90 | 56999967785334 | 711429947766 (bi-weekly) |
| Flow (01) | 12 | £39.99 | £31.99 | ~£2.67 | 56999967752566 | 711429947766 (bi-weekly) |
| Flow (01) | 28 | £79.99 | £63.99 | ~£2.29 | 56999967818102 | 711429980534 (monthly) |
| Clear (02) | 4 | £14.99 | £11.99 | ~£3.00 | 57000418607478 | 711429882230 (weekly) |
| Clear (02) | 8 | £28.99 | £23.19 | ~£2.90 | 57000418640246 | 711429947766 (bi-weekly) |
| Clear (02) | 12 | £39.99 | £31.99 | ~£2.67 | 57000418673014 | 711429947766 (bi-weekly) |
| Clear (02) | 28 | £79.99 | £63.99 | ~£2.29 | 57000418705782 | 711429980534 (monthly) |

`TRIAL_PACK_VARIANTS` (home, one-time only) reuses the 4/8/12 GIDs above. Authoritative prices live in `app/lib/productPricing.ts` (`formulaPricing`); treat the per-shot column here as indicative.

---

## 3. Legacy protocol products (retired — renewals only)

⚠️ Retired in the 2026 simplification. **No new orders.** IDs are live because existing subscribers renew against them (`app/lib/legacy/protocolSubscriptions.ts` — do not edit the IDs). Deleting is "Phase 5" of [`../development/featurePlans/asset-and-protocol-cleanup.md`](../development/featurePlans/asset-and-protocol-cleanup.md), gated on zero remaining subscribers.

| Protocol | Tier | Variant label | One-time | Sub (−20%) | Variant GID | Selling plan |
|----------|------|---------------|----------|-----------|-------------|--------------|
| 1 Resilience | starter | RESILIANCE_STARTER_4 | £14.99 | £11.99 | 56999240597878 | 711429882230 |
| 1 Resilience | pro | RESILIANCE_PRO_12 | £39.99 | £31.99 | 56999240630646 | 711429947766 |
| 1 Resilience | max | RESILIANCE_MAX_28 | £79.99 | £63.99 | 56999240663414 | 711429980534 |
| 2 Precision | starter | PRECISION_STARTER_4 | £14.99 | £11.99 | 56999234503030 | 711429882230 |
| 2 Precision | pro | PRECISION_PRO_12 | £39.99 | £31.99 | 56999234535798 | 711429947766 |
| 2 Precision | max | PRECISION_MAX_28 | £79.99 | £63.99 | 56999234568566 | 711429980534 |
| 3 Balance | starter | BALANCED_STARTER_4 | £14.99 | £11.99 | 56998884573558 | 711429882230 |
| 3 Balance | pro | BALANCED_PRO_12 | £39.99 | £31.99 | 56998884606326 | 711429947766 |
| 3 Balance | max | BALANCED_MAX_28 | £79.99 | £63.99 | 56998884639094 | 711429980534 |
| 4 Ultimate | pro | ULTAMATE_PRO_28 | £79.99 | £63.99 | 56999249478006 | 711429947766 |
| 4 Ultimate | max | ULTAMATE_MAX_56 | £144.99 | £115.99 | 56999249510774 | 711429980534 |

(Variant-label spellings — RESILIANCE, ULTAMATE — are the real Shopify SKUs. Do not "correct" them.)

---

## 3b. Loop → Skio selling-plan mapping (migration, Phase 2 input)

Consolidated old-Loop-GID → new-Skio-GID map for the [Skio migration](../development/featurePlans/skio-migration.md). This is the **direct input to Phase 2** (re-point purchase surfaces). Every distinct Loop selling plan across §1–§3 appears once. Mirror of `app/lib/skio.ts` `LOOP_TO_SKIO_SELLING_PLAN`.

**Fill the Skio column once the Skio plans exist (Phase 1 Task 1).** Skio GIDs are `gid://shopify/SellingPlan/<n>`; enter the full GID.

| Surface | Plan / tier | Loop selling plan (GID numeric) | Skio selling plan (GID numeric) | Notes |
|---------|-------------|---------------------------------|---------------------------------|-------|
| Funnel | Flow & Clear — Monthly Sub | 712527348086 | _TBD_ | single-product monthly |
| Funnel | Flow & Clear — Quarterly | 712527413622 | _TBD_ | single-product quarterly (−80 SKU) |
| Funnel | Both — Monthly Sub | 712527479158 | _TBD_ | |
| Funnel | Both — Quarterly | 712527446390 | _TBD_ | |
| PDP + Protocol | Starter (−20%) | 711429882230 | _TBD_ | group 98722480502; shared PDP + legacy protocol |
| PDP + Protocol | Pro (−20%) | 711429947766 | _TBD_ | group 98722546038; shared PDP + legacy protocol |
| PDP + Protocol | Max (−20%) | 711429980534 | _TBD_ | group 98722578806; shared PDP + legacy protocol |

The PDP (`PLAN_CONFIGURATIONS`) and legacy protocol (`PROTOCOL_VARIANTS`) surfaces reuse the **same three** Loop plans (starter/pro/max), so they collapse to three rows. Confirm Skio replicates the −20% Subscribe & Save discount on the new plans before filling.

---

## 4. The shot-count ambiguity (read before touching per-shot display)

For a legacy protocol tier, **three different numbers** all claim to be "the shots", and they disagree. For a "pro" Resilience sub:

| Source | Number | What it actually means |
|--------|--------|------------------------|
| `legacy/protocolSubscriptions.ts` variant label `PRO_12` | **12** | Billed **pack size** (box the customer pays for) |
| `subscriptionProduct.ts` `PROTOCOLS[].tiers.pro.totalShots` | **6** | **Per-delivery** shots actually shipped (flowCount 5 + clarityCount 1) |
| `account/subscriptions/utils.ts` `standardPricing.pro.shots` | **12** | Number the account card **displays** and divides price by |

Per-delivery totals from `subscriptionProduct.ts` (`PROTOCOLS`):

| Protocol | starter | pro | max |
|----------|---------|-----|-----|
| 1 Resilience | 4 (3F/1C) | 6 (5F/1C) | 7 (6F/1C) |
| 2 Precision | 4 (1F/3C) | 6 (1F/5C) | 7 (1F/6C) |
| 3 Balance | 4 (2F/2C) | 6 (3F/3C) | 7 (4F/3C) |
| 4 Ultimate | — | 28 (14F/14C) | 56 (28F/28C) |

So "pack size 12" and "per-delivery 6" are both real and both correct for their own meaning — they are not the same quantity. Any future per-shot fix must pick **one** definition of "shots" per surface and state it. This doc does not resolve which; it flags the conflict.

---

## 5. Account-portal shot / per-shot display — history & current state

**Current state (resolved by removal):** the subscription card (`app/components/subscriptions/SubscriptionListCard.tsx`) shows only **Billing** and **Total price**. The **Shots per delivery** and **Per shot** tiles were **removed**, because their numbers were wrong (see below) and per-shot adds little value once someone has already subscribed.

**What was wrong (why they were removed):**
- Shots came from `app/account/subscriptions/utils.ts` `getTierDisplayInfo`: `getCurrentPlan` inferred a tier (`starter`/`pro`/`max`) from product-title keywords or the billing interval (weekly→starter, bi-weekly→pro, **monthly→max**), then a hardcoded table mapped tier→shots (`standardPricing` 4/12/28, `ultimatePricing` 28/56) and per-shot = price ÷ that count.
- That table is the retired **protocol** model. The current **funnel** products (Flow/Clear/Both = 20/40/60/120 shots) match none of it: a Flow Monthly sub (£39.99, 20 shots) inferred as `max` → 28 shots → per-shot £39.99/28 = **£1.43** instead of **£2.00**. The multi-line "Both" path scanned `variantTitle` only for `56/28/12/8/4`, so a 40-shot box fell back to `quantity` (≈1) and was also wrong.

**`getTierDisplayInfo` still exists** and still carries the stale `shots`/`pricePerShot` fields — they are simply no longer read by the card. `TierSelectorPanel.tsx` (the plan-edit UI) still renders a `£X/shot` figure from the same stale source; that surface was **not** touched by this change and remains protocol-shaped.

**If shot count is ever reinstated** (e.g. "20 per delivery" on the card), do NOT revive the tier table. Build a resolver that: (1) matches `variantShopifyId` against a combined funnel + main-site + legacy variant→shots map (§1-§3), (2) falls back to parsing "N shot(s)" / a trailing pack number from `variantTitle`/title, (3) falls back to `quantity`. The API already passes `variantShopifyId`, `variantTitle`, `quantity`, `price` (`app/api/auth/subscriptions/route.ts` ~396-403). The catch (§1): recurring monthly funnel variants (FLOW-FUNNEL-20 etc.) are **not** in the codebase, so variant-GID lookup alone can't cover post-first-order subscribers — verify the resolver against **real Loop subscription data** before shipping, and pick one definition of "shots" per surface (§4).
