# Go-Live Pricing & SKU Audit — "20 + 8" Offer

**Date:** 2026-06-26
**Purpose:** Everything that must change to move the **live** site from the current retail offer to the new **"20 + 8 free"** offer (£39.99/mo single, new SKUs, new Loop plans). Compiled from a three-way codebase audit (data layer · checkout wiring · page-level displays).

> This audits the **existing live site**. The `app/(trial-b)/` funnel-c trial already implements the target offer (prices match; variants are draft; Loop plans are placeholders) — it is a useful reference, not part of this changeset.

---

## TL;DR

1. **One file drives almost everything: `app/lib/funnelData.ts`.** Its `FUNNEL_PRICING` matrix and `FUNNEL_VARIANTS` map feed every DTC checkout and price display on `/funnel`, `/lander`, `/start`, `/conka-flow`, `/conka-clarity`, `/conka-both`, and `/go/[slug]` — via `getOfferPricing` and the `cadenceData.ts` wrappers. **Update this one matrix and prices + variants cascade site-wide.**
2. **Live prices are currently *higher* than the new target** and the data model lacks the `postage`/`freeShots` concept. The fix is to back-port the trial-b matrix (values + extended fields) into the live file.
3. **A parallel hand-copied price file — `app/lib/landingPricing.ts` — powers the entire home page** with string constants (`1.61`, `89.99`, `2.14`, …) that *look* derived but are manually synced. Must be edited by hand or the home page silently shows old numbers.
4. **Hardcoded discount % copy is the biggest landmine** — the lander says **"31% off"** in 6 places as raw strings, decoupled from the price math (already wrong for Flow/Clear). Plus a stray `/start` hero CTA literal.
5. **Two go-live gates remain external to this audit:** the new variants are **draft/unpurchasable**, and the new **Loop selling plans don't exist yet**. Code can't be "done" until both are cleared.

---

## Scope

**IN scope (DTC retail → new offer):**
- `/funnel`, `/lander`, `/start`, `/conka-flow`, `/conka-clarity`, `/conka-both`, `/` (home), `/go/[slug]` listicles.

**OUT of scope (confirm before touching):**
- **B2B / `/professionals`** — own variants (`b2bVariants.ts`) + wholesale tiers (`b2bPricing.ts`). Unaffected.
- **Legacy protocol/quiz system** (`shopifyProductMapping.ts`) — **dead code for checkout**; `/protocol`, `/quiz`, `/shop` are permanent redirects (`next.config.ts`). Only lingering live uses are analytics lookups (see §5).
- **Account portal subscription tiers** (`subscriptionProduct.ts`) — these reflect what *existing* Loop subscribers are billed. Changing them re-prices current subs, not new checkouts. Leave unless intentionally migrating existing customers.

---

## §1 — `app/lib/funnelData.ts` (PRIMARY — the hub)

### 1a. Prices to change — `FUNNEL_PRICING` (lines ~94–161)

| Product · cadence | LIVE now | → New target | Shots (live → new) |
|---|---|---|---|
| Flow/Clear · monthly-sub | £59.99 | **£39.99** | 28 → 28 first order, 20 ongoing |
| Flow/Clear · one-time | £79.99 | **£69.98** (incl £9.99 postage) | 28 → 20 |
| Flow/Clear · quarterly-sub | £149.99 | **£109.99** | 84 → 80 |
| Both · monthly-sub | £89.99 | **£74.99** | 56 → 56 first order, 40 ongoing |
| Both · one-time | £129.99 | **£99.98** (incl £9.99 postage) | 56 → 40 |
| Both · quarterly-sub | £229.99 | **£149.99** | 168 → 140 |

Also update: `OTP_PRICE` map (~L88–92), every hand-computed **`perShot` / `perDay`** (they are literals, *not* computed from price ÷ shots — recalc by hand), and `compareAtPrice` references.

**Model extension required:** live `FunnelPricing` has no `freeShots` / `firstOrderShots` / `postage` fields. Port the extended interface from `app/(trial-b)/lib/funnelData.ts` (which already carries the exact target numbers + `freeShots`, `firstOrderShots`, `subsequentShots`, `postage`, `freeShotsValue`).

### 1b. Variants to repoint — `FUNNEL_VARIANTS` (lines ~171–211)

> **Structural decision (important):** today `monthly-sub` and `monthly-otp` **share one variant** (the subscription is just the variant + a selling plan). The new offer splits them. The cart line at checkout is created with the **first-order** variant, and **Loop swaps the recurring variant** to the 20/40 SKU. So `monthly-sub.variantId` should **keep the 28/56 first-order SKU** — the 20/40 SKUs live *only* in the Loop plan, not in this map.

| Cadence line | Action | GID |
|---|---|---|
| flow `monthly-sub` | **keep** FLOW-FUNNEL-28 (first order) | `57568795918710` |
| flow `monthly-otp` | **repoint** → FLOW-FUNNEL-20-OTP | `58153768714614` |
| flow `quarterly-sub` | **repoint** → FLOW-FUNNEL-80 | `58153768747382` |
| clear `monthly-sub` | **keep** CLEAR-FUNNEL-28 | `57568517489014` |
| clear `monthly-otp` | **repoint** → CLEAR-FUNNEL-20-OTP | `58153768812918` |
| clear `quarterly-sub` | **repoint** → CLEAR-FUNNEL-80 | `58153768845686` |
| both `monthly-sub` | **keep** BOTH-FUNNEL-56 | `57568809976182` |
| both `monthly-otp` | **repoint** → BOTH-FUNNEL-40-OTP | `58153768911222` |
| both `quarterly-sub` | **repoint** → BOTH-FUNNEL-140 | `58153768943990` |

Ongoing-sub SKUs (Loop-swap targets, not in this map): FLOW-FUNNEL-20 `58153768681846` · CLEAR-FUNNEL-20 `58153768780150` · BOTH-FUNNEL-40 `58153768878454`.

⚠️ The new OTP/quarterly variants are **draft (`availableForSale:false`)** — activate inventory + set `CONTINUE` before checkout works.

### 1c. Selling plans to replace — `FUNNEL_VARIANTS` (pending new Loop plans)

None of the new Loop plans exist yet. Replace each current GID once Loop is configured:

| Line | Current GID | Role → replace with |
|---|---|---|
| ~175 / ~188 | `712527348086` | Single monthly → **new monthly plan w/ 28→20 swap** |
| ~182 / ~195 | `712527413622` | Single quarterly → new quarterly plan |
| ~201 | `712527479158` | Both monthly → new monthly (56→40 swap) |
| ~208 | `712527446390` | Both quarterly → new quarterly |

---

## §2 — `app/lib/landingPricing.ts` (home page — hand-copied, HIGH leverage)

The **entire home page** (and conka-both's shared landing sections) renders prices from string constants here that mirror `funnelData` but are **not** computed from it. Edit by hand or the home page goes stale silently.

`PRICE_PER_SHOT_BOTH="1.61"`, `PRICE_PER_DAY_BOTH="3.22"`, `PRICE_PER_MONTH_BOTH="89.99"`, `PRICE_PER_SHOT_FLOW/CLEAR="2.14"`, `COFFEE_PRICE_PER_DAY="5.00"`, `MONTHLY_SAVINGS_VS_COFFEE="53"`.

Consumers (all show `Get Both from £{PRICE_PER_SHOT_BOTH}/shot`): `LandingProductShowcase.tsx:232`, `LabTimeline.tsx:300`, `LabFAQ.tsx:101`, `LandingValueComparison.tsx:71`, `LandingProductSplit.tsx:172`, `LandingTestimonials.tsx:431`, `CrashChart.tsx` (£53 / £5.00/day / £3.22/day).

---

## §3 — Hardcoded discount-% copy (LANDMINES — decoupled from price math)

These are raw strings; they will be **wrong** the moment prices change (several already are):

| Location | Hardcoded text |
|---|---|
| `lander/sections/BuyBoxes/buyboxes.data.ts:8,15` | "Subscribe & Save **31%**", "31% off & Free Shipping" |
| `lander/sections/Hero/Hero.tsx:71,78` | "**31% off** your first month", "Get your 31% off" |
| `lander/sections/Nav/Nav.tsx:62` | "Subscribe to claim **31% off**…" |
| `lander/sections/BuyBoxes/BuyCard.tsx:145` | aria "Subscribe & Save 31%" |
| `lander/sections/CrashChart/CrashChart.tsx:39-41` | defaults `£53` / `£5.00/day` / `£3.22/day` (rendered with no props) |
| `start/page.tsx:223` | hero CTA "Get Both From **£1.61/shot**" (literal; buy-box below is derived → they'll contradict) |
| `funnel/page.tsx:7` | metadata "Subscribe and save **25%**" |
| `ProtocolHero.tsx:69` / `ProtocolHeroMobile.tsx:68` | "save **25%**" (low priority — protocol redirected) |

> Recommendation: replace these with values **derived from `getSavingsPercent`** so they can never drift again. The blanket "31%" is already only correct for Both (Flow/Clear ≈ 25%).

---

## §4 — Other hardcoded prices (review, mostly non-offer)

| Location | Value | Note |
|---|---|---|
| `ProductBuyPanel.tsx:144` + `ListicleProductHero.tsx` | `£119.99/yr` app value (struck-through) | merch/app anchor, duplicated |
| `ProductBuyPanel.tsx:77-79` + listicle | `£25 / £20 / £15` app rewards | merch, not offer |
| `WinHero.tsx` | "worth **£79.99**" | tied to OTP Flow price → stale if it changes |
| `trial-b SummaryStep.tsx:112` | postage `29.97` / `9.99` | trial-b only |
| Founders / OurStory / lander BuyBoxes | `£500,000` / `£500K+` research | editorial stat, leave |

---

## §5 — Analytics gaps (won't break checkout, but go blank/null for new offer)

- **`CartContext.tsx:9` + `shopifyProductMapping.ts:41-45`** (`getPlanFrequency` / `SELLING_PLAN_FREQUENCY`) — only knows the **old** plan IDs. New Loop plan GIDs must be added here or `_plan_frequency` cart attribute is blank for new subs added via the drawer.
- **`productMetadata.ts`** (via `CartContext.tsx:230` `extractProductMetadata`) — reverse-looks up the **legacy** `FORMULA_VARIANTS`/`PROTOCOL_VARIANTS` tables; returns **null** for the new funnel variants → analytics product metadata gap. Add the new variants or point it at `funnelData`.

---

## §6 — Recommended go-live sequence

1. **Shopify/Loop (external):** activate the 9 draft variants (inventory + `CONTINUE`); create the new **monthly (28→20 swap)** and **quarterly** Loop plans; capture their selling-plan GIDs.
2. **`funnelData.ts`:** port the trial-b `FunnelPricing` model + target prices (§1a); repoint OTP/quarterly variants (§1b); drop in the new selling-plan GIDs (§1c). → cascades to all DTC pages.
3. **`landingPricing.ts`:** update the home-page constants to match (§2).
4. **De-hardcode the % copy** (§3) — ideally rewire to `getSavingsPercent`; at minimum correct the literals. Fix the `/start` hero CTA.
5. **Analytics tables** (§5): teach `SELLING_PLAN_FREQUENCY` + `productMetadata` the new GIDs.
6. **Verify:** each page's displayed price == the variant it checks out (price/charge parity), per product × cadence.

## Decisions — CONFIRMED (2026-06-26)

- [x] **B2B and account-portal subscription tiers stay untouched** — no re-pricing of existing subscribers.
- [x] **First-order → ongoing swap is handled by the Loop plan** — `monthly-sub.variantId` keeps the 28/56 SKU (order 1 = 20+8), Loop swaps to the 20/40 SKU from order 2.
- [x] **Surface the 20+8 mechanic everywhere** — every page must make it clear (as funnel-c does) that it's **20 + 8 free on the first order, 20 thereafter**. Requires exposing `freeShots`/`firstOrderShots` in the shared display copy, not just funnel-c.
- [x] **Correct the % discount literals** (faster path) rather than rewiring to derive from price.
- [x] **Postage baked into the OTP variant price** (£69.98 / £99.98) — already set on the variants; not added at checkout.
