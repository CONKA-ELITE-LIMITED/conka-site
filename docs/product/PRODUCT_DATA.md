# Product Data Organization

Overview of how product data is organized, where Shopify variant IDs live, and how to use helpers.

> **For the physical formulation (per-shot doses, ingredients, %NRV, nutrition label data):** see [FORMULATION_SPEC.md](./FORMULATION_SPEC.md).

## Two Product Systems

The codebase has **two independent product data systems**:

| System | Purpose | Barrel import | Shopify mapping |
|--------|---------|---------------|-----------------|
| **Main site** | PDP pages, cart, B2B portal | `@/app/lib/productData` | `shopifyProductMapping.ts` |
| **Funnel** | `/funnel` page (paid traffic) | `@/app/lib/funnelData` | Built into `funnelData.ts` |

They are intentionally separate. The funnel system was built standalone to avoid coupling to the protocol-era product structure (which is being removed). The only shared dependency is `formatPrice()` from productHelpers.

---

## Main Site Product Data

### Module Structure

```
productTypes.ts           → Core types (no dependencies)
    ↓
productColors.ts          → Colors and gradients
productPricing.ts         → Pricing data, VAT, B2B constants
formulaContent.ts         → Formula narrative, ingredients, clinical data
protocolContent.ts        → Protocol content and tier configs (being removed)
    ↓
productHelpers.ts         → Pricing lookups, formatting, calendar generation
    ↓
productData.ts            → BARREL: re-exports everything above
    ↓
shopifyProductMapping.ts  → Maps internal IDs → Shopify variant GIDs + selling plans
productMetadata.ts        → Reverse: Shopify variant GID → internal product info
b2bCartTier.ts            → B2B tier logic (box count → tier → variant updates)
```

**Barrel export:** `productData.ts` re-exports everything, so consumers use `from "@/app/lib/productData"`.

### Modules

#### `productTypes.ts`
**Purpose:** Shared type definitions
**Dependencies:** None
**Exports:** `FormulaId`, `PackSize`, `PurchaseType`, `ProtocolId`, `ProtocolTier`, `ProductId`

#### `productColors.ts`
**Purpose:** Colors, gradients, and color utilities
**Dependencies:** `productTypes` (types only)
**Exports:** `FORMULA_COLORS`, `PRODUCT_GRADIENTS`, `getProductGradient`, `getProductAccent`, `PROTOCOL_COLORS`, `getProtocolGradient`, `getProtocolAccent`, `interpolateHex`

#### `productPricing.ts`
**Purpose:** All pricing data for formulas and protocols
**Dependencies:** None
**Exports:** `formulaPricing`, `protocolPricing`

#### `formulaContent.ts`
**Purpose:** Formula content, struggle types, and clinical data
**Dependencies:** `productTypes` (FormulaId)
**Exports:** `StruggleId`, `RadarDataPoint`, `ClinicalStudy`, `StruggleSolution`, `Ingredient`, `ClinicalResult`, `FormulaBenefit`, `FormulaContent`, `formulaContent`, `STRUGGLE_OPTIONS`

#### `protocolContent.ts`
**Purpose:** Protocol content and tier configurations (being phased out — see `WEBSITE_SIMPLIFICATION_PLAN.md`)
**Dependencies:** `productTypes` (ProtocolId, ProtocolTier)
**Exports:** `ProtocolTierConfig`, `ProtocolBenefitStat`, `ProtocolContent`, `protocolContent`

#### `productHelpers.ts`
**Purpose:** Pure helper functions — pricing lookups, formatting, calendar generation
**Dependencies:** `productTypes`, `productPricing`, `protocolContent`
**Exports:** `formatPrice`, `getFormulaPricing`, `getProtocolPricing`, `getBillingLabel`, `generateProtocolCalendarDays`

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

## Funnel Product Data

The funnel system is a **standalone module** for the `/funnel` page. It has its own types, pricing matrix, variant mapping, display data, and checkout logic.

### Why separate?

1. The funnel sells a simplified offering (Flow / Clear / Both × 3 cadences) that doesn't map to the main site's pack-size model
2. Funnel products are separate Shopify products (tagged `funnel`) with their own variant IDs and selling plans
3. Clean separation means the funnel isn't affected by protocol cleanup or main site product changes
4. The funnel uses direct-to-checkout (isolated cart creation), not the global CartContext

### Module Structure

```
funnelData.ts       → Types, 3×3 pricing matrix, variant mapping, display data, upsell logic
    ↓
funnelCheckout.ts   → Isolated cart creation, analytics, checkout URL redirect
```

### `funnelData.ts`
**Purpose:** All funnel product data — pricing, Shopify GIDs, display content, upsell logic
**Dependencies:** `productData` (only `formatPrice()`)
**Key exports:**

| Export | What |
|--------|------|
| `FunnelProduct` | `"both" \| "flow" \| "clear"` |
| `FunnelCadence` | `"monthly-sub" \| "monthly-otp" \| "quarterly-sub"` |
| `FUNNEL_PRICING` | 3×3 pricing matrix (price, perShot, perDay, shotCount, compareAtPrice) |
| `FUNNEL_VARIANTS` | 3×3 Shopify variant GID + selling plan ID mapping |
| `FUNNEL_PRODUCTS` | Display data per product (name, tagline, features, thumbnail, accent) |
| `FUNNEL_CADENCES` | Display data per cadence (label, subtitle, badge, features) |
| `getOfferPricing()` | Look up pricing for a product × cadence combination |
| `getOfferVariant()` | Look up Shopify variant config for a product × cadence |
| `isVariantReady()` | Check if a combination has a real Shopify variant ID |
| `getUpsellOffer()` | Contextual upsell logic (Flow→Both, Clear→Both, OTP→Sub, Monthly→Quarterly) |

### Funnel Pricing (from COGS analysis, 2026-03-27)

| | Monthly Sub | Monthly OTP | Quarterly Sub |
|---|---|---|---|
| **Flow** (28 shots) | £59.99 | £79.99 | £149.99 |
| **Clear** (28 shots) | £59.99 | £79.99 | £149.99 |
| **Both** (56 shots) | £89.99 | £129.99 | £229.99 |

### Funnel Shopify Products

3 products tagged `funnel`, each with 2 variants (monthly + quarterly size):

| Product | Shopify title | Monthly variant | Quarterly variant |
|---------|--------------|-----------------|-------------------|
| Flow | CONKA Flow AM | Flow - 28 Shots (£79.99) | Flow - 84 Shots (£229.99) |
| Clear | CONKA Clear PM | Clear - 28 Shots (£79.99) | Clear - 84 Shots (£229.99) |
| Both | CONKA Flow + Clear | Both - 56 Shots (£129.99) | Both - 168 Shots (£389.99) |

### Funnel Selling Plans (Loop)

4 selling plans (fixed amount discount):

| Plan (internal name) | Discount | Attached to | Sub price result |
|----------------------|----------|-------------|------------------|
| Monthly Single Subscription - Funnel | £20 off | Flow, Clear (28-shot variant) | £59.99 |
| Monthly Dual Subscription - Funnel | £40 off | Both (56-shot variant) | £89.99 |
| Quarterly Single Subscription - Funnel | £80 off | Flow, Clear (84-shot variant) | £149.99 |
| Quarterly Dual Subscription - Funnel | £160 off | Both (168-shot variant) | £229.99 |

**Why 4 plans?** Loop selling plans apply a fixed discount globally to all products they're attached to. Flow/Clear and Both have different base prices, so they need different discount amounts. Monthly and quarterly use different variants (different base prices), so they also need separate plans.

### `funnelCheckout.ts`
**Purpose:** Creates an isolated Shopify cart and redirects to checkout. Does not use global CartContext or open the cart drawer.
**Dependencies:** `funnelData`, `metaPixel`, `tripleWhale`, `analytics`
**Flow:** Create cart via `/api/cart` → fire analytics (Meta Pixel, Triple Whale, Vercel) → redirect to `cart.checkoutUrl`

---

## Using Helpers

### Main Site Pricing

```typescript
import { getFormulaPricing, getProtocolPricing, formatPrice } from "@/app/lib/productData";

const pricing = getFormulaPricing("28", "subscription");
// Returns: { price: number, priceExVat: number, billing: string }

const displayPrice = formatPrice(123.45); // "£123.45"
```

### Funnel Pricing

```typescript
import { getOfferPricing, getOfferVariant, isVariantReady } from "@/app/lib/funnelData";

const pricing = getOfferPricing("both", "monthly-sub");
// Returns: { price: 89.99, perShot: 1.61, perDay: 3.22, shotCount: 56, compareAtPrice: 129.99 }

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

**Funnel — import directly from funnelData:**
```typescript
import { FunnelProduct, getOfferPricing, FUNNEL_PRODUCTS } from "@/app/lib/funnelData";
```

**Never import from sub-modules directly** (e.g. don't import from `productPricing.ts` or `productHelpers.ts`).

---

## Dependency Graph

```
productTypes (foundation — no deps)
    ↓
    ├→ productColors
    ├→ productPricing
    ├→ formulaContent
    ├→ protocolContent
    │
    └→ productHelpers (imports productPricing, protocolContent)
        │
        └→ productData (BARREL: re-exports all above)
            │
            ├→ shopifyProductMapping (variant GIDs)
            └→ productMetadata (reverse variant lookup)

funnelData (INDEPENDENT — only imports formatPrice from productData)
    └→ funnelCheckout (cart creation + analytics)
```

## Key Principles

1. **No circular dependencies:** Types → Colors/Pricing/Content → Helpers only
2. **Single source of truth:** Each piece of data lives in one module
3. **Two systems, not one:** Main site and funnel are deliberately separate
4. **Tree-shaking friendly:** Barrel uses `export *`, unused modules aren't bundled
5. **Shopify GIDs live in mapping files:** `shopifyProductMapping.ts` for main site, `funnelData.ts` for funnel

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/fetch-funnel-products.ts` | Fetch funnel product variant GIDs and selling plan GIDs from Shopify Storefront API | `npx tsx scripts/fetch-funnel-products.ts` |
