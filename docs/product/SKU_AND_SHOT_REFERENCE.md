# SKU & Shot-Count Reference

The single reconciliation of **every product generation** CONKA has sold, their Shopify variant IDs / selling plans, and — critically — **how many shots each represents and at what price per shot**. It exists because that number is defined in several places that do not agree, and the account portal currently derives a subscriber's per-shot cost from the wrong one.

There are **three product generations** live in Shopify at once:

1. **Funnel products** — the current, actively-sold offering (Flow / Clear / Both × 3 cadences). New orders should be these.
2. **Main-site formula products** — Flow / Clear trial packs (4/8/12/28) used by PDPs, the home page, and the B2B portal.
3. **Legacy protocol products** — the retired Resilience / Precision / Balance / Ultimate protocols. **Not sold**, but existing subscribers still renew against them, so the IDs are live.

> **Code source of truth** (this doc mirrors it; on any change, edit the code first, then this doc):
> - Funnel: `app/lib/offerData.ts`
> - Main site: `app/lib/shopifyProductMapping.ts`
> - Legacy: `app/lib/legacy/protocolSubscriptions.ts`, `app/lib/subscriptionProduct.ts`
> - Price-change log: [`../PRICING_HISTORY.md`](../PRICING_HISTORY.md)

---

## 1. Funnel products (current — actively sold)

The `/conka-flow`, `/conka-clarity`, funnel, and landing surfaces. Uses a **"priced + free shots"** model: the first monthly subscription order ships a bonus box, then Loop swaps to the smaller recurring SKU from order 2 (quarterly ships its bonus every cycle, no swap). `perShot` is computed on **priced** shots only. Prices last verified against `offerData.ts` and Shopify Admin 2026-08-28 (SCRUM-1257; see PRICING_HISTORY.md).

| Product | Cadence | Price | Priced shots | Free bonus | 1st-order shots | Recurring shots | Per shot |
|---------|---------|-------|-------------|------------------|-----------------|-----------------|----------|
| Flow | Monthly sub | £39.99 | 20 | +8 (1st order) | 28 | 20 | £2.00 |
| Flow | One-time | £59.99 + £9.99 postage¹ | 20 | — | 20 | — | £3.00 |
| Flow | Quarterly sub | £109.99 | 60 | +20 (every cycle) | 80 | 80 | £1.83 |
| Clear | Monthly sub | £39.99 | 20 | +8 (1st order) | 28 | 20 | £2.00 |
| Clear | One-time | £59.99 + £9.99 postage¹ | 20 | — | 20 | — | £3.00 |
| Clear | Quarterly sub | £109.99 | 60 | +20 (every cycle) | 80 | 80 | £1.83 |
| Both | Monthly sub | £74.99 | 40 | +16 (1st order) | 56 | 40 | £1.87 |
| Both | One-time | £89.99 + £9.99 postage¹ | 40 | — | 40 | — | £2.25 |
| Both | Quarterly sub | £149.99 | 120 | +20 (every cycle) | 140 | 140 | £1.25 |
| Flow | Quarterly one-time² | £180.00 + £9.99 postage¹ | 60 | — | 60 | — | £3.00 |
| Clear | Quarterly one-time² | £180.00 + £9.99 postage¹ | 60 | — | 60 | — | £3.00 |
| Both | Quarterly one-time² | £270.00 + £9.99 postage¹ | 120 | — | 120 | — | £2.25 |

¹ One-time pricing is itemised in the data layer as product price + £9.99 compulsory per-order postage (`OTP_PRICE` + `OTP_POSTAGE`), but **displayed as the single all-in figure** (`getChargedPrice`), matching the Shopify OTP variant, which bakes the postage into its price (£69.98 / £69.98 / £99.98, quarterly £189.99 / £189.99 / £279.99). The itemised UI split was reverted 2026-08-28; it returns when SCRUM-1286 moves shipping out of the SKU prices (see `docs/TODO.md`). `perShot` is the ex-postage product price over priced shots. Subscriptions always ship free.

² Quarterly one-time (`quarterly-otp` cadence, SCRUM-1285): sold through the selection-aware "Buy it once" link on the PDPs and Build Your Order, wired to the Skio-era FLOW-60 / CLEAR-60 / BOTH-120 variants below.

### Funnel Shopify variant GIDs & selling plans

Note the **first-order-swap**: the monthly-sub variant recorded in code is the *bonus* SKU (28/56). After order 1, Loop swaps the contract to the recurring SKU (20/40), **whose GID is not stored in this codebase** — it lives Loop-side. This matters for the account portal (see §5): you cannot resolve a recurring monthly subscriber's shot count by matching its variant GID against `OFFER_VARIANTS`.

| Product | Cadence | SKU (label) | Variant GID (numeric) | Selling plan |
|---------|---------|-------------|-----------------------|--------------|
| Flow | Monthly sub | FLOW-STARTER-28 → swaps to FLOW-FUNNEL-20 | 58560937296246 | 712527348086 |
| Flow | One-time | FLOW-FUNNEL-20-OTP | 58153768714614 | — |
| Flow | Quarterly sub | FLOW-STARTER-80 | 58560941752694 | 712527413622 |
| Clear | Monthly sub | CLEAR-STARTER-28 → swaps to CLEAR-FUNNEL-20 | 58560971309430 | 712527348086 |
| Clear | One-time | CLEAR-FUNNEL-20-OTP | 58153768812918 | — |
| Clear | Quarterly sub | CLEAR-STARTER-80 | 58560980615542 | 712527413622 |
| Both | Monthly sub | BOTH-STARTER-56 → swaps to BOTH-FUNNEL-40 | 58560992805238 | 712527479158 |
| Both | One-time | BOTH-FUNNEL-40-OTP | 58153768911222 | — |
| Both | Quarterly sub | BOTH-STARTER-140 | 58560994771318 | 712527446390 |

### Starter kit variants (SCRUM-1287, created 2026-08-28)

Every subscription cadence now points at a `-STARTER-` variant. Each is the **same shot count and the same price** as the `-FUNNEL-` variant it replaced, with a hat and a travel pack added to the box. The kit contents are the variant's `custom.bundlecomposition` metafield, which Synergy explodes at pick time. The superseded `-FUNNEL-` subscription variants (57568795918710, 58153768747382, 57568517489014, 58153768845686, 57568809976182, 58153768943990) still exist in Shopify and still hold every live subscription created before the swap. Selling plans did not change: the starter variants were attached to the same four Loop plans, whose pricing policy is a fixed £0.00 adjustment, so the variant price is the charged price either way.

| SKU | Variant GID | Price | Compare at | Weight | `custom.bundlecomposition` |
|-----|-------------|-------|-----------|--------|---------------------------|
| FLOW-STARTER-28 | 58560937296246 | £39.99 | £69.98 | 2.5kg | `1xFLOW-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |
| FLOW-STARTER-80 | 58560941752694 | £109.99 | £209.94 | 6.65kg | `3xFLOW-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |
| CLEAR-STARTER-28 | 58560971309430 | £39.99 | £69.98 | 2.5kg | `1xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |
| CLEAR-STARTER-80 | 58560980615542 | £109.99 | £209.94 | 6.65kg | `3xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |
| BOTH-STARTER-56 | 58560992805238 | £74.99 | £129.97 | 4.55kg | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |
| BOTH-STARTER-140 | 58560994771318 | £149.99 | £389.91 | 10.85kg | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` |

The two gift components are ordinary Shopify products, both deliberately **unpublished**: `CONKA-HAT` (CONKA Trucker Hat, 250g) and `CONKA-TRAVEL-PACK-28` (CONKA Travel Pack 2 Weeks, £28.99, 100g). Neither carries a `bundlecomposition` of its own; they are the leaf items a kit explodes into. The capsule count is in the travel pack SKU on purpose, so a future 14-cap pack takes its own SKU and stock line rather than silently redefining this one.

Compare-at values were corrected at the same time to reference a **real purchasable price**: £69.98 is what one 20-shot box costs to buy once, and £209.94 is three of them. The older ex-postage figures (£59.99 / £179.97) referenced a price no customer is ever charged.

Synergy 3PL barcodes on the physical funnel boxes: `FLOWFUNNEL28` / `CLEARFUNNEL28` (Code 128). See [`../shipping/SHIPPING_AND_COURIERS.md`](../shipping/SHIPPING_AND_COURIERS.md).

### Skio-era variants (created for the Skio selling-plan migration)

Read from Shopify Admin 2026-08-28 (SCRUM-1257). Six newer variants sit on the same three products, each attached to a Skio "Subscription" selling-plan group; the **base price is the one-time price** and the plan discounts it to the subscription price. All ACTIVE and available for sale. The 60/120-shot base prices are the first real purchasable quarterly one-time prices, sold as the `quarterly-otp` cadence since SCRUM-1285. They are offerings, not discount anchors: every anchor derives from the monthly-size one-time reference unit so the badge ladder ascends with quantity (see [`../ops/offerings-and-discounts.md`](../ops/offerings-and-discounts.md) §2).

| SKU | Title | One-time base price | Variant GID (numeric) | Postage handling |
|-----|-------|---------------------|-----------------------|------------------|
| FLOW-20 | 20 Shots | £69.98 | 58457787040118 | baked in (= £59.99 + £9.99) |
| FLOW-60 | 60 Shots | £189.99 | 58457811550582 | baked in (= 3 x £59.99 + £9.99, rounded to .99) |
| CLEAR-20 | 20 Shots | £69.98 | 58457822069110 | baked in |
| CLEAR-60 | 60 Shots | £189.99 | 58457854411126 | baked in |
| BOTH-40 | 40 Shots | £99.98 | 58457859686774 | baked in (= £89.99 + £9.99) |
| BOTH-120 | 120 Shots | £279.99 | 58457864077686 | baked in (= 3 x £89.99 + £9.99, rounded to .99) |

The 60/120-shot SKUs are referenced in code since SCRUM-1285: `OFFER_VARIANTS` maps them as the `quarterly-otp` cadence (the selection-aware "Buy it once" link). The 20/40-shot Skio SKUs are not yet referenced; the Skio migration cutover re-points the subscription cadences to them. The `compareAtPrice` values Shopify holds on the FUNNEL variants (59.99 / 179.97 / 89.99 / 269.97) are ex-postage maths, not these purchasable prices.

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

The 4/8/12 trial packs have no code representation any more. `TRIAL_PACK_VARIANTS`, `getTrialPackVariantId` and `app/lib/productPricing.ts` were deleted in SCRUM-1280 once every consumer had gone; the GIDs above are a Shopify record only. Treat the per-shot column as indicative. If a trial-pack surface is ever rebuilt, add it to `offerData.ts` rather than reviving a second pricing module.

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
