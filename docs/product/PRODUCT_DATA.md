# Product Data Organization

Overview of how product data is organized, where Shopify variant IDs live, and how to use helpers.

> **For the physical formulation (per-shot doses, ingredients, %NRV, nutrition label data):** see [FORMULATION_SPEC.md](./FORMULATION_SPEC.md).
>
> **For the actual SKUs, variant GIDs, selling plans, shot counts, and prices** (funnel / main-site / legacy protocol) and the account per-shot display logic: see [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md). This doc covers how the *code* is organised; that one is the data.

## Two Product Systems

The codebase splits product data along one seam: **what a product is** versus **what you can buy**.

| System | Holds | Barrel import | Shopify mapping |
|--------|-------|---------------|-----------------|
| **Product content** | Names, colours, ingredients, benefits copy, clinical data, images | `@/app/lib/productData` | `shopifyProductMapping.ts` |
| **Offer catalogue** | The 9 sellable product x cadence combos, their prices, variant GIDs and selling plans | `@/app/lib/offerData` | Built into `offerData.ts` |

**`offerData.ts` is not the Build Your Order page's data**, despite the history of its name. It is the commerce layer for every surface that sells: the three PDPs (via the `cadenceData.ts` adapter), both landers, `/build-your-order`, the cart drawer, the account portal and the PDP JSON-LD. It was called `funnelData.ts`, then `offerData.ts`, and was renamed to `offerData.ts` in SCRUM-1280 precisely because the page-shaped names kept implying a scope it never had.

The two systems were originally kept apart to avoid coupling the funnel to the protocol-era product structure. That structure is now gone, so the separation survives on its own merit: content and commerce change for different reasons and at different rates. The only shared dependency is `formatPrice()` from productHelpers.

**There is exactly one source for a price you can sell at, and it is `offerData.ts`.** The former main-site `productPricing.ts` (4/8/12/28 pack prices) was deleted in SCRUM-1280 after losing every consumer. Do not reintroduce a second pricing module.

---

## Main Site Product Data

### Module Structure

```
productTypes.ts           → Core types (no dependencies)
    ↓
productColors.ts          → Colors and gradients
formulaContent.ts         → Formula narrative, ingredients, clinical data
productImages.ts          → Formula image sets (slideshows, quarterly swaps)
    ↓
productHelpers.ts         → Formatting helpers (no pricing data)
    ↓
productData.ts            → BARREL: re-exports everything above
    ↓
shopifyProductMapping.ts  → Maps internal IDs → Shopify variant GIDs + selling plans
productMetadata.ts        → Reverse: Shopify variant GID → internal product info
```

**Barrel export:** `productData.ts` re-exports `productTypes`, `productColors`, `formulaContent`, `productHelpers`, and `productImages`, so consumers use `from "@/app/lib/productData"`. It **deliberately excludes all protocol data** — those types/IDs live in `app/lib/legacy/protocolSubscriptions.ts` (retired-product support; see [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §3).

### Modules

#### `productTypes.ts`
**Purpose:** Shared type definitions
**Dependencies:** None (re-exports `ProtocolId`/`ProtocolTier` from `legacy/protocolSubscriptions` to keep the `ProductId` union whole)
**Exports:** `FormulaId`, `PackSize`, `PurchaseType`, `ProtocolId`, `ProtocolTier`, `ProductId`

#### `productColors.ts`
**Purpose:** Colors, gradients, and color utilities
**Dependencies:** `productTypes` (types only)
**Exports:** `FORMULA_COLORS`, `PRODUCT_GRADIENTS`, `getProductGradient`, `getProductAccent`, `PROTOCOL_COLORS`, `getProtocolGradient`, `getProtocolAccent`, `interpolateHex`

#### `formulaContent.ts`
**Purpose:** Formula content, struggle types, and clinical data
**Dependencies:** `productTypes` (FormulaId)
**Exports:** `StruggleId`, `RadarDataPoint`, `ClinicalStudy`, `StruggleSolution`, `Ingredient`, `ClinicalResult`, `FormulaBenefit`, `FormulaContent`, `formulaContent`, `STRUGGLE_OPTIONS`

#### `productImages.ts`
**Purpose:** Formula image sets used by the funnel and product surfaces (slideshow frames, quarterly-cadence first-slide swaps)
**Dependencies:** None
**Exports:** `formulaImages`, `quarterlyImages`

#### `productHelpers.ts`
**Purpose:** Pure formatting helpers
**Dependencies:** None
**Exports:** `formatPrice`, `getBillingLabel`. `getFormulaPricing` was deleted in SCRUM-1280 with `productPricing.ts`; prices come from `offerData.ts`.

> **Note:** protocol content, protocol pricing helpers, and the protocol calendar have been removed from the main modules. The former `protocolContent.ts` and the `getProtocolPricing`/`generateProtocolCalendarDays` helpers no longer exist. Protocol *display* data that survives lives in `app/lib/subscriptionProduct.ts` (`PROTOCOLS`); protocol *commerce* IDs live in `app/lib/legacy/protocolSubscriptions.ts`.

### Shopify Integration Layer

#### `shopifyProductMapping.ts`
**Purpose:** Forward mapping — internal product IDs to Shopify variant GIDs and selling plan IDs
**Dependencies:** `productData` (types)
**Exports:** `FORMULA_VARIANTS`, `FORMULA_SELLING_PLANS`, `getPlanFrequency`, `getFormulaVariantId`. `TRIAL_PACK_VARIANTS` and `getTrialPackVariantId` were deleted in SCRUM-1280 (no consumers); the 4/8/12 GIDs survive only as a Shopify record in SKU_AND_SHOT_REFERENCE.md.

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

## Offer Catalogue

The offer catalogue is a **standalone module** holding everything needed to sell: types, pricing matrix, variant mapping, display data, and checkout logic. Every selling surface reads it, not just `/build-your-order`. See the note at the top of this doc before assuming otherwise.

### Why separate?

1. The funnel sells a simplified offering (Flow / Clear / Both × 3 cadences) that doesn't map to the main site's pack-size model
2. Offer products are separate Shopify products (tagged `funnel` in Shopify) with their own variant IDs and selling plans
3. Clean separation means the funnel isn't affected by protocol cleanup or main site product changes
4. The funnel uses direct-to-checkout (isolated cart creation), not the global CartContext

### Module Structure

```
offerData.ts       → Types, 3×3 pricing matrix, variant mapping, display data, upsell logic
    ↓
byoCheckout.ts   → Isolated cart creation, analytics, checkout URL redirect
```

### `offerData.ts`
**Purpose:** All funnel product data — pricing, Shopify GIDs, display content, upsell logic
**Dependencies:** `productData` (only `formatPrice()`)
**Key exports:**

| Export | What |
|--------|------|
| `OfferProduct` | `"both" \| "flow" \| "clear"` |
| `OfferCadence` | `"monthly-sub" \| "monthly-otp" \| "quarterly-sub"` |
| `OFFER_PRICING` | 3×3 pricing matrix (price, perShot, perDay, shotCount, compareAtPrice) |
| `OFFER_VARIANTS` | 3×3 Shopify variant GID + selling plan ID mapping |
| `OFFER_PRODUCTS` | Display data per product (name, tagline, features, thumbnail, accent) |
| `OFFER_CADENCES` | Display data per cadence (label, subtitle, badge, features) |
| `getOfferPricing()` | Look up pricing for a product × cadence combination |
| `getOfferVariant()` | Look up Shopify variant config for a product × cadence |
| `isVariantReady()` | Check if a combination has a real Shopify variant ID |
| `getUpsellOffer()` | Contextual upsell logic (Flow→Both, Clear→Both, OTP→Sub, Monthly→Quarterly) |

### Offer Pricing (current — "priced + free shots" model)

The prices below are the live model (`OFFER_PRICING` in `offerData.ts`). The **full** SKU / shot-count / per-shot table — including free-shot bonuses and the Loop first-order swap — is the source of truth in [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §1. Don't duplicate it; this is the short version.

| | Monthly Sub | One-time | Quarterly Sub |
|---|---|---|---|
| **Flow** | £39.99 (20 shots) | £69.98 (20) | £109.99 (60) |
| **Clear** | £39.99 (20 shots) | £69.98 (20) | £109.99 (60) |
| **Both** | £74.99 (40 shots) | £99.98 (40) | £149.99 (120) |

Shot counts are **priced** shots. Monthly subs ship a bonus box on the first order only (Loop swaps the SKU from order 2); quarterly ships a bonus every cycle. One-time prices bake in £9.99 compulsory postage.

### Starter pack gifts (`gifts`)

`OfferPricing.gifts` is an optional `OfferGift[]` listing the free extras that come with a first order. It drives the `GiftValueStack` struck-RRP rows on the PDP buy panel and is **display only**: these RRPs never reach a cart line or the checkout, per [CART_PRICING_SOURCE_OF_TRUTH.md](../development/CART_PRICING_SOURCE_OF_TRUTH.md).

Set on the `monthly-sub` and `quarterly-sub` cadences of all three products (`flow`, `clear`, `both`). Presence of `gifts` is what gates the stack, so adding it to another cadence is all that is needed to extend the offer.

The free bonus shots are deliberately **not** in this array; that row derives from `freeShots` / `freeShotsValue` so the shot count has one source. Rows without an `image` fall back to a tick glyph.

### Starter pack shot (`starterPackImage`)

`OfferPricing.starterPackImage` is the arranged pack photograph for the full-width `StarterPackContents` section on the Flow, Clear and Both PDPs. One per product per cadence, because each pack holds different quantities and the artwork carries burned-in prices. It is also the PDP hero gallery's lead slide: `getPdpGalleryImages` prepends it, so the pack shot is absent on the one-time cadences rather than advertising gifts they do not include.

It doubles as that section's visibility switch: absent means the cadence ships no starter pack, and the PDP renders no section wrapper at all rather than an empty one. Set on the same six subscription cadences as `gifts`. The section's shots row is named by the page's `productLabel` prop, not derived from the pricing object.

The section derives every figure from `price`, `compareAtPrice`, `freeShots`, `freeShotsValue` and `gifts`, the same fields the buy panel reads, so the two surfaces cannot show different numbers.

What actually ships is the variant's `custom.bundlecomposition` metafield, which Synergy explodes at pick time. That metafield and this array are kept in step by hand: changing one does not change the other.

### Offer Shopify variants & selling plans

9 variants (3 products × 3 cadences), all live and tagged `funnel`. Variant GIDs + selling-plan GIDs are in [SKU_AND_SHOT_REFERENCE.md](./SKU_AND_SHOT_REFERENCE.md) §1 (mirrored from `OFFER_VARIANTS`). The monthly-sub variant stored in code is the **first-order bonus** SKU (28/56 shots); Loop swaps the contract to the recurring SKU (20/40) after order 1, and that recurring GID is not stored in the codebase.

**Why separate monthly vs quarterly selling plans?** Loop selling plans apply a fixed discount globally to every product they're attached to. Flow/Clear and Both have different base prices, and monthly vs quarterly use different variants, so each combination needs its own plan.

### `byoCheckout.ts`
**Purpose:** Creates an isolated Shopify cart and redirects to checkout. Does not use global CartContext or open the cart drawer.
**Dependencies:** `funnelData`, `metaPixel`, `tripleWhale`, `analytics`
**Flow:** Create cart via `/api/cart` → fire analytics (Meta Pixel, Triple Whale, Vercel) → redirect to `cart.checkoutUrl`

---

## Using Helpers

### Formatting

```typescript
import { formatPrice } from "@/app/lib/productData";

const displayPrice = formatPrice(123.45); // "£123.45"
```

The barrel carries no prices. `getFormulaPricing` was removed in SCRUM-1280; every price now comes from the offer catalogue below.

### Offer Pricing

```typescript
import { getOfferPricing, getOfferVariant, isVariantReady } from "@/app/lib/offerData";

const pricing = getOfferPricing("both", "monthly-sub");
// Returns: { price: 74.99, perShot: 1.87, perDay: 3.74, shotCount: 40, compareAtPrice: 89.99, freeShots: 16, firstOrderShots: 56, ... }

const variant = getOfferVariant("flow", "quarterly-sub");
// Returns: { variantId: "gid://shopify/ProductVariant/...", sellingPlanId: "gid://shopify/SellingPlan/..." }

const ready = isVariantReady("both", "quarterly-sub"); // true
```

---

## Import Patterns

**Product content — always import from the barrel:**
```typescript
import { FormulaId, formulaContent, formatPrice } from "@/app/lib/productData";
```

**Prices, variants and selling plans — import from the offer catalogue:**
```typescript
import { OfferProduct, getOfferPricing, OFFER_PRODUCTS } from "@/app/lib/offerData";
```

**On the three PDPs, go through the adapter, not the catalogue directly:**
```typescript
import { getCadencePricingByFormula, getCadenceVariantByFormula } from "@/app/lib/cadenceData";
```

**Never import from content sub-modules directly** (e.g. don't import from `productHelpers.ts`; use the barrel).

---

## Dependency Graph

```
productTypes (foundation — no deps; re-exports ProtocolId/Tier from legacy)
    ↓
    ├→ productColors
    ├→ formulaContent
    ├→ productImages
    │
    └→ productHelpers (formatting only, no deps)
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
5. **Shopify GIDs live in mapping files:** `shopifyProductMapping.ts` for main-site content variants, `offerData.ts` for everything sellable

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/fetch-funnel-products.ts` | Fetch funnel product variant GIDs and selling plan GIDs from Shopify Storefront API | `npx tsx scripts/fetch-funnel-products.ts` |
