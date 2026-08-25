# Product Data Organization

Overview of how product data is organized, where Shopify variant IDs live, and how to use helpers.

> **For the physical formulation (per-shot doses, ingredients, %NRV, nutrition label data):** see [FORMULATION_SPEC.md](./FORMULATION_SPEC.md).
>
> **For the actual SKUs, variant GIDs, selling plans, shot counts, and prices** (funnel / main-site / legacy protocol) and the account per-shot display logic: see [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md). This doc covers how the *code* is organised; that one is the data.

## Two Product Systems

The codebase has **two independent product data systems**:

| System | Purpose | Barrel import | Shopify mapping |
|--------|---------|---------------|-----------------|
| **Main site** | PDP pages, cart, B2B portal | `@/app/lib/productData` | `shopifyProductMapping.ts` |
| **Build Your Order** | `/build-your-order` flow (paid traffic) | `@/app/lib/byoData` | Built into `byoData.ts` |

They are intentionally separate. The funnel system was built standalone to avoid coupling to the protocol-era product structure (which is being removed). The only shared dependency is `formatPrice()` from productHelpers.

---

## Main Site Product Data

### Module Structure

```
productTypes.ts           → Core types (no dependencies)
    ↓
productColors.ts          → Colors and gradients
productPricing.ts         → Formula pricing data, VAT, B2B constants
formulaContent.ts         → Formula narrative, ingredients, clinical data
productImages.ts          → Formula image sets (slideshows, quarterly swaps)
    ↓
productHelpers.ts         → Pricing lookups + formatting (imports productPricing)
    ↓
productData.ts            → BARREL: re-exports everything above
    ↓
shopifyProductMapping.ts  → Maps internal IDs → Shopify variant GIDs + selling plans
productMetadata.ts        → Reverse: Shopify variant GID → internal product info
```

**Barrel export:** `productData.ts` re-exports `productTypes`, `productColors`, `productPricing`, `formulaContent`, `productHelpers`, and `productImages`, so consumers use `from "@/app/lib/productData"`. It **deliberately excludes all protocol data** — those types/IDs live in `app/lib/legacy/protocolSubscriptions.ts` (retired-product support; see [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §3).

### Modules

#### `productTypes.ts`
**Purpose:** Shared type definitions
**Dependencies:** None (re-exports `ProtocolId`/`ProtocolTier` from `legacy/protocolSubscriptions` to keep the `ProductId` union whole)
**Exports:** `FormulaId`, `PackSize`, `PurchaseType`, `ProtocolId`, `ProtocolTier`, `ProductId`

#### `productColors.ts`
**Purpose:** Colors, gradients, and color utilities
**Dependencies:** `productTypes` (types only)
**Exports:** `FORMULA_COLORS`, `PRODUCT_GRADIENTS`, `getProductGradient`, `getProductAccent`, `PROTOCOL_COLORS`, `getProtocolGradient`, `getProtocolAccent`, `interpolateHex`

#### `productPricing.ts`
**Purpose:** Pricing data for the main-site formula packs (4/8/12/28), plus VAT/B2B constants
**Dependencies:** None
**Exports:** `formulaPricing` (and pricing constants). Display-only; cart/checkout prices come from Shopify — see [`../development/CART_PRICING_SOURCE_OF_TRUTH.md`](../development/CART_PRICING_SOURCE_OF_TRUTH.md).

#### `formulaContent.ts`
**Purpose:** Formula content, struggle types, and clinical data
**Dependencies:** `productTypes` (FormulaId)
**Exports:** `StruggleId`, `RadarDataPoint`, `ClinicalStudy`, `StruggleSolution`, `Ingredient`, `ClinicalResult`, `FormulaBenefit`, `FormulaContent`, `formulaContent`, `STRUGGLE_OPTIONS`

#### `productImages.ts`
**Purpose:** Formula image sets used by the funnel and product surfaces (slideshow frames, quarterly-cadence first-slide swaps)
**Dependencies:** None
**Exports:** `formulaImages`, `quarterlyImages`

#### `productHelpers.ts`
**Purpose:** Pure helper functions — formula pricing lookups + formatting
**Dependencies:** `productTypes` (types), `productPricing` (`formulaPricing`)
**Exports:** `formatPrice`, `getFormulaPricing`, `getBillingLabel`

> **Note:** protocol content, protocol pricing helpers, and the protocol calendar have been removed from the main modules. The former `protocolContent.ts` and the `getProtocolPricing`/`generateProtocolCalendarDays` helpers no longer exist. Protocol *display* data that survives lives in `app/lib/subscriptionProduct.ts` (`PROTOCOLS`); protocol *commerce* IDs live in `app/lib/legacy/protocolSubscriptions.ts`.

### Shopify Integration Layer

#### `shopifyProductMapping.ts`
**Purpose:** Forward mapping — internal product IDs to Shopify variant GIDs and selling plan IDs
**Dependencies:** `productData` (types)
**Exports:** `FORMULA_VARIANTS`, `FORMULA_SELLING_PLANS`, `TRIAL_PACK_VARIANTS`, `getPlanFrequency`, `getFormulaVariantId`, `getTrialPackVariantId`

Protocol variants are not here. They are retired-product support for existing subscribers and live in `app/lib/legacy/protocolSubscriptions.ts`.

**Selling plans (main site):**
| Plan GID suffix | Frequency | Pack sizes |
|-----------------|-----------|------------|
| `711429882230` | Weekly | 4-shot |
| `711429947766` | Bi-weekly | 8-shot, 12-shot |
| `711429980534` | Monthly | 28-shot |

#### `productMetadata.ts`
**Purpose:** Reverse mapping — Shopify variant GID to internal product info (used to hydrate cart lines with display data)
**Dependencies:** `shopifyProductMapping`, `productData` (types)
**Exports:** `ProductMetadata`, `extractProductMetadata()`

### Supplementary Modules

| File | Purpose | Standalone? |
|------|---------|-------------|
| `ingredientsData.ts` | Detailed ingredient data, clinical studies, mechanisms | Imports `FormulaId` from productData |
| `productSizeUtils.ts` | Pack size → Loop tier key mapping for subscription management | Fully standalone |
| `productImageConfig.ts` | Navigation/card thumbnail paths | Fully standalone |
| `subscriptionProduct.ts` | Subscription management display data (protocols, tiers) | Standalone (duplicates some protocolContent) |

---

## Build Your Order Product Data

The Build Your Order system (formerly the funnel) is a **standalone module** for the `/build-your-order` flow. It has its own types, pricing matrix, variant mapping, display data, and checkout logic.

### Why separate?

1. The funnel sells a simplified offering (Flow / Clear / Both × 3 cadences) that doesn't map to the main site's pack-size model
2. Offer products are separate Shopify products (tagged `funnel` in Shopify) with their own variant IDs and selling plans
3. Clean separation means the funnel isn't affected by protocol cleanup or main site product changes
4. The funnel uses direct-to-checkout (isolated cart creation), not the global CartContext

### Module Structure

```
byoData.ts       → Types, 3×3 pricing matrix, variant mapping, display data, upsell logic
    ↓
byoCheckout.ts   → Isolated cart creation, analytics, checkout URL redirect
```

### `byoData.ts`
**Purpose:** All funnel product data — pricing, Shopify GIDs, display content, upsell logic
**Dependencies:** `productData` (only `formatPrice()`)
**Key exports:**

| Export | What |
|--------|------|
| `ByoProduct` | `"both" \| "flow" \| "clear"` |
| `ByoCadence` | `"monthly-sub" \| "monthly-otp" \| "quarterly-sub"` |
| `BYO_PRICING` | 3×3 pricing matrix (price, perShot, perDay, shotCount, compareAtPrice) |
| `BYO_VARIANTS` | 3×3 Shopify variant GID + selling plan ID mapping |
| `BYO_PRODUCTS` | Display data per product (name, tagline, features, thumbnail, accent) |
| `BYO_CADENCES` | Display data per cadence (label, subtitle, badge, features) |
| `getOfferPricing()` | Look up pricing for a product × cadence combination |
| `getOfferVariant()` | Look up Shopify variant config for a product × cadence |
| `isVariantReady()` | Check if a combination has a real Shopify variant ID |
| `getUpsellOffer()` | Contextual upsell logic (Flow→Both, Clear→Both, OTP→Sub, Monthly→Quarterly) |

### Offer Pricing (current — "priced + free shots" model)

The prices below are the live model (`BYO_PRICING` in `byoData.ts`). The **full** SKU / shot-count / per-shot table — including free-shot bonuses and the Loop first-order swap — is the source of truth in [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §1. Don't duplicate it; this is the short version.

| | Monthly Sub | One-time | Quarterly Sub |
|---|---|---|---|
| **Flow** | £39.99 (20 shots) | £69.98 (20) | £109.99 (60) |
| **Clear** | £39.99 (20 shots) | £69.98 (20) | £109.99 (60) |
| **Both** | £74.99 (40 shots) | £99.98 (40) | £149.99 (120) |

Shot counts are **priced** shots. Monthly subs ship a bonus box on the first order only (Loop swaps the SKU from order 2); quarterly ships a bonus every cycle. One-time prices bake in £9.99 compulsory postage.

### Offer Shopify variants & selling plans

9 variants (3 products × 3 cadences), all live and tagged `funnel`. Variant GIDs + selling-plan GIDs are in [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §1 (mirrored from `BYO_VARIANTS`). The monthly-sub variant stored in code is the **first-order bonus** SKU (28/56 shots); Loop swaps the contract to the recurring SKU (20/40) after order 1, and that recurring GID is not stored in the codebase.

**Why separate monthly vs quarterly selling plans?** Loop selling plans apply a fixed discount globally to every product they're attached to. Flow/Clear and Both have different base prices, and monthly vs quarterly use different variants, so each combination needs its own plan.

### `byoCheckout.ts`
**Purpose:** Creates an isolated Shopify cart and redirects to checkout. Does not use global CartContext or open the cart drawer.
**Dependencies:** `funnelData`, `metaPixel`, `tripleWhale`, `analytics`
**Flow:** Create cart via `/api/cart` → fire analytics (Meta Pixel, Triple Whale, Vercel) → redirect to `cart.checkoutUrl`

---

## Using Helpers

### Main Site Pricing

```typescript
import { getFormulaPricing, formatPrice } from "@/app/lib/productData";

const pricing = getFormulaPricing("28", "subscription");
// Returns: { price: number, priceExVat: number, billing: string }

const displayPrice = formatPrice(123.45); // "£123.45"
```

### Offer Pricing

```typescript
import { getOfferPricing, getOfferVariant, isVariantReady } from "@/app/lib/byoData";

const pricing = getOfferPricing("both", "monthly-sub");
// Returns: { price: 74.99, perShot: 1.87, perDay: 3.74, shotCount: 40, compareAtPrice: 89.99, freeShots: 16, firstOrderShots: 56, ... }

const variant = getOfferVariant("flow", "quarterly-sub");
// Returns: { variantId: "gid://shopify/ProductVariant/...", sellingPlanId: "gid://shopify/SellingPlan/..." }

const ready = isVariantReady("both", "quarterly-sub"); // true
```

---

## Import Patterns

**Main site — always import from the barrel:**
```typescript
import { FormulaId, formulaContent, getFormulaPricing, formatPrice } from "@/app/lib/productData";
```

**Build Your Order — import directly from byoData:**
```typescript
import { ByoProduct, getOfferPricing, BYO_PRODUCTS } from "@/app/lib/byoData";
```

**Never import from sub-modules directly** (e.g. don't import from `productPricing.ts` or `productHelpers.ts`).

---

## Dependency Graph

```
productTypes (foundation — no deps; re-exports ProtocolId/Tier from legacy)
    ↓
    ├→ productColors
    ├→ productPricing
    ├→ formulaContent
    ├→ productImages
    │
    └→ productHelpers (imports productPricing)
        │
        └→ productData (BARREL: re-exports all above)
            │
            ├→ shopifyProductMapping (variant GIDs)
            └→ productMetadata (reverse variant lookup — also reads legacy/protocolSubscriptions)

funnelData (INDEPENDENT — only imports formatPrice + image sets from productData)
    └→ funnelCheckout (cart creation + analytics)

legacy/protocolSubscriptions (dependency leaf — retired-product IDs, imported by productTypes + productMetadata)
```

## Key Principles

1. **No circular dependencies:** Types → Colors/Pricing/Content → Helpers only
2. **Single source of truth:** Each piece of data lives in one module
3. **Two systems, not one:** Main site and funnel are deliberately separate
4. **Tree-shaking friendly:** Barrel uses `export *`, unused modules aren't bundled
5. **Shopify GIDs live in mapping files:** `shopifyProductMapping.ts` for main site, `byoData.ts` for funnel

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/fetch-funnel-products.ts` | Fetch funnel product variant GIDs and selling plan GIDs from Shopify Storefront API | `npx tsx scripts/fetch-funnel-products.ts` |
