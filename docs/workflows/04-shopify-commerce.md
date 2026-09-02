# Shopify and Commerce Conventions

> **Purpose:** This document defines how to work with Shopify, the cart/checkout flow, Loop Subscriptions, and other commerce-related logic. Reference this whenever building or modifying anything that touches product data, pricing, cart, checkout, or subscriptions.

---

## When to use this document

- Working with product data (display, filtering, search)
- Modifying the cart or anything near checkout
- Working with Shopify metafields
- Implementing or modifying subscription functionality (Loop)
- Adding or changing collection/product pages
- Dealing with pricing, variants, or inventory

---

## Shopify API usage

### Which API to use

| API | Use when | Access |
|-----|----------|--------|
| **Storefront API** | Reading product data, collections, cart operations, customer data for display | Public token, safe in client-exposed code (but prefer server-side) |
| **Admin API** | Writing data, managing inventory, processing webhooks, accessing order data | Secret token, server-side ONLY (API routes, Server Actions) |

### Storefront API setup
- Client location: `app/lib/shopify.ts`
- Access token: `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (env var)
- Endpoint: `https://[STORE].myshopify.com/api/[VERSION]/graphql.json`

### GraphQL query conventions
- All queries live in: `app/lib/shopifyQueries.ts`
- All response types live in: `app/types/`
- Name queries descriptively: `getProduct`, `getCollection`, `getCart`, etc.
- Always request only the fields you need — Shopify rate-limits based on query cost
- Use fragments for shared field sets across queries

```graphql
# Example: keep queries focused
# ✅ Good — only fetches what the product card needs
fragment ProductCard on Product {
  id
  title
  handle
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}

# ❌ Bad — fetches everything "just in case"
query { product(handle: $handle) { ...everything } }
```

---

## Product data architecture

The codebase has **two independent product data systems** — see `docs/product/PRODUCT_DATA.md` for the full module breakdown.

| System | Import from | Shopify mapping | Used by |
|--------|-------------|-----------------|---------|
| **Main site** | `@/app/lib/productData` | `shopifyProductMapping.ts` | PDP pages, cart |
| **Funnel** | `@/app/lib/offerData` | Built into `offerData.ts` | `/build-your-order` page only |

**Key rule:** These systems are intentionally separate. The funnel has its own Shopify products (tagged `funnel`), its own selling plans, its own variant GIDs, and its own checkout flow (bypasses CartContext). Do not merge them.

### Funnel Shopify products

3 products, each with 2 variants (monthly size + quarterly size). 4 Loop selling plans apply fixed-amount discounts:

| Product | Monthly variant (base/OTP) | Quarterly variant (base) | Monthly sub price | Quarterly sub price |
|---------|---------------------------|-------------------------|-------------------|---------------------|
| CONKA Flow AM | 28 shots @ £79.99 | 84 shots @ £229.99 | £59.99 (-£20) | £149.99 (-£80) |
| CONKA Clear PM | 28 shots @ £79.99 | 84 shots @ £229.99 | £59.99 (-£20) | £149.99 (-£80) |
| CONKA Flow + Clear | 56 shots @ £129.99 | 168 shots @ £389.99 | £89.99 (-£40) | £229.99 (-£160) |

Quarterly variant base prices exist only to make the Loop discount math work — they're never shown as OTP.

### Fetching Shopify GIDs

```bash
npx tsx scripts/fetch-funnel-products.ts
```

Queries the Storefront API for products tagged `funnel` and outputs all variant GIDs and selling plan GIDs. Use this after creating or modifying funnel products in Shopify Admin.

---

## Product data patterns

### Product display hierarchy
```
Product
├── title, description, handle
├── images[] — use featuredImage for cards, images for PDP gallery
├── variants[]
│   ├── id, title, sku
│   ├── price, compareAtPrice
│   ├── availableForSale
│   └── selectedOptions[] (Size, Colour, etc.)
├── options[] — the option definitions (Size: [S, M, L, XL])
├── metafields[] — custom data (ingredients, specs, subscription info, etc.)
└── collections[] — which collections this product belongs to
```

### Metafields
- Metafield definitions: `[LIST YOUR KEY METAFIELDS OR LINK TO SHOPIFY ADMIN]`
- Access pattern:
```tsx
// In your Storefront API query
metafield(namespace: "custom", key: "your_key") {
  value
  type
}

// In your component — always handle null
const metafieldValue = product.metafield?.value;
```

### Key metafields in this project
| Namespace | Key | Type | Purpose |
|-----------|-----|------|---------|
| `[namespace]` | `[key]` | `[type]` | `[what it's for]` |
| `[namespace]` | `[key]` | `[type]` | `[what it's for]` |

> **Fill this table with your actual metafield definitions.**

---

## Variant selection

### How variant selection should work
1. Product page loads with either the first available variant or a default
2. User selects options (Size, Colour, etc.)
3. The selected combination maps to a specific variant ID
4. Price, availability, and images update based on the selected variant
5. "Add to Cart" uses the selected variant ID

### Implementation pattern
```tsx
// Track selected options in state
const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

// Find the matching variant
const selectedVariant = product.variants.find(variant =>
  variant.selectedOptions.every(
    option => selectedOptions[option.name] === option.value
  )
);

// Use selectedVariant for price display and add-to-cart
```

### Edge cases to always handle
- **Variant not available (sold out):** Show as disabled, don't allow add to cart
- **Only one variant:** Hide the option selector, pre-select it
- **Variant-specific images:** Update the image gallery when variant changes
- **Compare-at price:** Show original price crossed out when on sale

---

## Cart operations

### Cart architecture
- Cart is managed via Shopify Storefront API (cart object)
- Cart ID is stored in: `localStorage` under key `shopify_cart_id`
- Cart operations location: `app/context/CartContext.tsx` (client), `app/api/cart/route.ts` (API proxy)

### Cart operations
| Operation | API | Notes |
|-----------|-----|-------|
| Create cart | `cartCreate` mutation | When no cart exists yet |
| Add item | `cartLinesAdd` mutation | Always use variant ID, not product ID |
| Update quantity | `cartLinesUpdate` mutation | Set quantity to 0 to remove |
| Remove item | `cartLinesRemove` mutation | Alternative to updating quantity to 0 |
| Get cart | `cart` query | Fetch on page load to display cart state |
| Apply discount | `cartDiscountCodesUpdate` | Accepts discount codes |

### Cart rules
1. **Always check `availableForSale`** before allowing add-to-cart
2. **Handle cart expiry** — Shopify carts expire after 10 days of inactivity
3. **Optimistic UI** — update the cart UI immediately, revert on API error
4. **Cart count in header** — should update in real-time after add/remove
5. **Never store sensitive data in the cart** — it's client-accessible

---

## Checkout

### Critical rules
- **DO NOT build custom checkout** — use Shopify's hosted checkout (`cart.checkoutUrl`)
- Redirect to `cart.checkoutUrl` when user clicks "Checkout"
- Any customisation happens via Shopify checkout settings or Shopify Functions, NOT in Next.js code
- Post-checkout: use Shopify webhooks for order processing (not polling)

### Checkout URL pattern
```tsx
// In your checkout button
const handleCheckout = () => {
  if (cart?.checkoutUrl) {
    window.location.href = cart.checkoutUrl;
  }
};
```

---

## Subscriptions (Skio)

Skio owns every subscription contract. Loop was decommissioned on 2026-09-02 and
its API client, routes and portal UI are deleted from this repo.

**Canonical reference:** `docs/development/featurePlans/skio-migration.md`. Read it
before touching subscriptions, `/account` or selling plans. Section 6 has the
selling plans and variants, section 7 the env vars and code map, section 8 the
customer portal.

### What you need to know here

- **We do not manage subscriptions in this codebase.** Skio's embedded portal at
  `/account/manage` is the whole experience. There is no subscription mutation
  API of ours to call.
- **Pricing model.** Skio plans are **percentage off** the variant's one-time
  price, never Set price (Skio ignores Set price under Shopify market prices,
  which risks international overcharge). So the variant price IS the one-time
  price and the plan supplies the discount. A variant with no plan attached sells
  at full price.
- **Selling plan GIDs** live in `app/lib/offerData.ts` (`SKIO_OFFER_VARIANTS`).
  `LEGACY_OFFER_VARIANTS` in the same file is reverse-lookup only, so migrated
  Loop-era lines still resolve to a product. Do not sell from it.
- **Bundle variants** carry `custom.bundlecomposition`, which Synergy explodes at
  pick time. A subscription variant without it reaches the 3PL as a plain SKU and
  has to be hand-fixed on every order.


## Pricing display

### Rules
1. **Always format prices consistently** — use a shared formatter
2. **Include currency code** — don't assume GBP/USD
3. **Handle compare-at prices** — show original crossed out, sale price highlighted
4. **Subscription pricing** — show per-delivery price AND savings vs one-time

### Price formatting utility
```tsx
// Location: app/lib/productData.ts (formatPrice helper)
// Should handle:
// - Currency formatting based on currencyCode
// - Locale-appropriate number formatting
// - "From £X" for products with price ranges
// - Sale price display (was / now)
```

---

## Collection and product listing

### Collection pages
- Fetch collection + products via Storefront API
- Support pagination (cursor-based, using Shopify's `after` parameter)
- Support filtering: `[YOUR_FILTERING_APPROACH — Shopify filters, custom, etc.]`
- Support sorting: `[YOUR_SORTING_OPTIONS]`

### Product card consistency
- Every product card should use the same component: `[PATH_TO_PRODUCT_CARD]`
- Required data: title, handle, featured image, price range, availability
- Link to: `/products/[handle]`

---

## Webhooks (if applicable)

- Webhook handler location: `[PATH_TO_WEBHOOK_ROUTES — e.g., app/api/webhooks/]`
- Always verify webhook signatures (HMAC validation)
- Process asynchronously where possible — return 200 quickly
- Key webhooks used:

| Webhook | Purpose | Handler |
|---------|---------|---------|
| `[e.g., orders/create]` | `[Purpose]` | `[Path]` |
| `[e.g., products/update]` | `[Purpose]` | `[Path]` |

---

## Common gotchas

### Shopify
- Cart checkout URLs expire — always use `cart.checkoutUrl` from the latest cart fetch
- Metafield values are always strings — parse JSON metafields carefully
### Skio

- **Migrated contracts keep their history but not Loop's attribution.** Original
  start dates and cycle counts carry through; custom fields and Loop's own
  attribution do not.
- **Rebills send no Meta Purchase event.** Recurring attribution is acquisition
  only, matching Loop. Skio's native Triple Whale integration is the cheap way to
  get recurring visibility.
- **Skio stamps one order tag** (`Subscription First Order`) where Loop stamped
  eight. Nothing automated should key on order tags; see
  `docs/development/CART_ATTRIBUTES.md`.

---

## References
- Next.js development: `./03-nextjs-development.md`
- Implementation workflow: `./02-implementation-workflow.md`
- Shopify Storefront API docs: https://shopify.dev/docs/api/storefront
- Loop Subscriptions docs: https://developer.loopwork.co/reference/api-reference
