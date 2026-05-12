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

The codebase has **two independent product data systems** — see `docs/PRODUCT_DATA.md` for the full module breakdown.

| System | Import from | Shopify mapping | Used by |
|--------|-------------|-----------------|---------|
| **Main site** | `@/app/lib/productData` | `shopifyProductMapping.ts` | PDP pages, cart |
| **Funnel** | `@/app/lib/funnelData` | Built into `funnelData.ts` | `/funnel` page only |

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

## Loop Subscriptions

### Overview
- Loop handles subscription lifecycle: billing, pause/resume, skip, cancel, plan changes
- **Shopify** = who the customer is + which contracts they have. **Loop** = what each subscription actually is and what happens when they interact with it.
- Integration approach: Loop Admin API called from Next.js API routes (server-side only)
- All subscription mutations go through: `app/api/auth/subscriptions/[id]/pause/route.ts`

### Key files
| File | Purpose |
|------|---------|
| `app/lib/loop.ts` | Loop API client (low-level helpers) |
| `app/hooks/useSubscriptions.ts` | Frontend hook — all subscription actions |
| `app/api/auth/subscriptions/[id]/pause/route.ts` | All subscription mutations (pause, resume, cancel, skip, change plan, edit multi-line) |
| `app/api/auth/subscriptions/route.ts` | GET subscriptions (hybrid Shopify + Loop) |
| `app/types/subscription.ts` | Shared TypeScript types |
| `docs/features/CUSTOMER_PORTAL.md` | Full feature documentation |

### Loop API reference
- **Docs:** https://developer.loopwork.co/reference/api-reference
- **Base URL:** `https://api.loopsubscriptions.com/admin/2023-10`
- **Auth header:** `X-Loop-Token: {LOOP_API_KEY}`
- **Rate limit:** 5 requests per second

### ID formats — critical gotcha

Loop uses **two different ID formats** depending on the endpoint:

| Format | Example | Used by |
|--------|---------|---------|
| `shopify-{numericId}` | `shopify-121614270838` | `GET /subscription/{id}`, line swap, pause, resume, cancel |
| Loop internal numeric ID | `10547807` | `PUT /frequency`, `POST /skipNext`, `POST /placeOrder` |

**Rule:** If an endpoint returns 404 with `shopify-{id}`, it likely needs the Loop internal ID. To get the internal ID, first `GET /subscription/shopify-{id}` and read `response.data.data.id`.

The `change-frequency` and `skip` actions in the codebase already follow this pattern — they GET the subscription first, extract the internal ID, then call the target endpoint.

### Endpoint reference (endpoints we use)

| Action | Method | Endpoint | ID format | Body |
|--------|--------|----------|-----------|------|
| Get subscription | GET | `/subscription/{id}` | `shopify-{id}` | — |
| Pause | POST | `/subscription/{id}/pause` | `shopify-{id}` | optional `pauseDuration` (`{ intervalCount, intervalType }`) |
| Resume | POST | `/subscription/{id}/resume` | `shopify-{id}` | — |
| Cancel | POST | `/subscription/{id}/cancel` | `shopify-{id}` | optional `comment`, `notifyCustomer` |
| **Skip next order** | POST | `/subscription/{id}/skipNext` | **Loop internal ID** | — |
| Swap line | PUT | `/subscription/{id}/line/{lineId}/swap` | `shopify-{id}` | `variantShopifyId`, `quantity`, `pricingType`, `sellingPlanGroupId` |
| Update frequency | PUT | `/subscription/{id}/frequency` | **Loop internal ID** | `billingPolicy`, `deliveryPolicy`, `nextBillingDateEpoch`, `discountType` |
| **Reschedule delivery** | POST | `/subscription/{id}/reschedule` | **Loop internal ID** | `newBillingDateEpoch`, optional `rescheduleFutureOrders` (default true), `notifyCustomer` (default true) |
| **Reactivate** | POST | `/subscription/{id}/reactivate` | **Loop internal ID** | — (no body) |
| **Place order now** | POST | `/subscription/{id}/placeOrder` | **Loop internal ID** | optional `preponeFutureOrder` (default true) |
| **Apply discount** | POST | `/subscription/{id}/discount` | **Loop internal ID** | `{ code: string }` |
| Get customer | GET | `/customer/{customerShopifyId}` | Shopify customer ID | — |
| Update payment method | POST | `/paymentMethod/{id}/update` (storefront API) | Loop payment method ID | — |

### Subscription data flow

```
Reading:
  Shopify Customer Account API → subscription contract IDs
  Loop Admin API (per contract) → full subscription details
  Merged response → frontend

Mutations:
  Frontend hook → POST /api/auth/subscriptions/[id]/pause (pause, resume, cancel, skip, change-frequency, edit-multi-line)
                → POST /api/auth/subscriptions/[id]/reschedule (reschedule delivery date)
  API route → converts to shopify-{id} → Loop Admin API
  (some endpoints: GET subscription first → extract Loop internal ID → then call endpoint)
```

### Working with subscriptions (Storefront API side)
- Subscription eligibility: Products with `sellingPlanGroups` on their Shopify listing are subscribable
- Selling plan data: available via Storefront API on the product's `sellingPlanGroups`
- Display logic:
  - IF product has selling plans → show subscription option with pricing
  - Show discount compared to one-time price
  - Let user toggle between one-time and subscription

### Key subscription fields (Storefront API)
```graphql
# In your product query, include:
sellingPlanGroups(first: 5) {
  edges {
    node {
      name
      sellingPlans(first: 5) {
        edges {
          node {
            id
            name
            options {
              name
              value
            }
            priceAdjustments {
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Subscription edge cases
- Product available as both one-time and subscription → user must explicitly choose
- Subscription-only products → hide the one-time option
- Subscription price vs one-time price → always show the savings clearly
- Cart with mixed items (subscription + one-time) → ensure both work through checkout
- **Legacy products:** Old subscriptions on legacy variants (e.g. "CONKA 1 (28 Shots)") will fail plan changes — must be manually migrated in Loop dashboard
- **Multi-line contracts:** Frequency changes on multi-line contracts can fail if lines have different selling plan groups — route returns a clear error directing to support

---

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
### Loop
- **ID format mismatch:** Some Loop endpoints accept `shopify-{id}`, others require Loop's internal numeric ID. If you get a 404, check the ID format first. See the ID formats table above.
- **Frequency endpoint uses Loop internal ID:** `PUT /subscription/{id}/frequency` returns 404 if you pass `shopify-{id}`. Always GET the subscription first and use `response.data.data.id`.
- **skipNext uses Loop internal ID:** Same as frequency — must resolve the internal ID first.
- **Loop does not accept `DAY` for frequency:** Use `WEEK`, `MONTH`, or `YEAR`. Bi-weekly = `WEEK` × 2.
- **`nextBillingDateEpoch` must be preserved:** When changing plan/frequency, always pass the existing next billing date back — never let it reset.
- **Redundant frequency updates rejected:** On multi-line contracts, Loop rejects a frequency update if the interval hasn't changed. Check before calling.
- **Cancel uses `comment`, not `cancellationReason`:** The `cancellationReason` field only appears in Loop responses. To send a reason, use `comment` in the request body.
- **Pause `pauseDuration` format:** `{ intervalCount: number, intervalType: 'DAY' | 'MONTH' | 'YEAR' | 'CUSTOM' }`. Loop does NOT accept `WEEK` as intervalType. Use `DAY` (with days = weeks × 7) for sub-month durations, `MONTH` for exact month multiples. Max pause is 3 billing cycles.
- **Reschedule has a dedicated endpoint:** Use `POST /subscription/{loopInternalId}/reschedule` — NOT `PUT /frequency`. The frequency endpoint validates selling plans against Shopify's product catalog, which fails on multi-line subscriptions where a variant's selling plan doesn't match the billing interval. The dedicated reschedule endpoint skips this validation entirely.
- **Reactivate uses Loop internal ID:** `POST /subscription/{loopInternalId}/reactivate` — no body needed. Must GET subscription first to resolve internal ID. Only works on cancelled subscriptions — not paused (use resume for paused). May fail if the product/variant has been discontinued since cancellation.
- **placeOrder uses Loop internal ID:** `POST /subscription/{loopInternalId}/placeOrder` — optional `preponeFutureOrder: true` shifts future deliveries forward. May fail if there's already an unfulfilled order.
- **Apply discount uses Loop internal ID:** `POST /subscription/{loopInternalId}/discount` with `{ code }`. The code must be a valid Shopify discount code configured for subscriptions. Loop validates against Shopify's rules (expiry, usage limits, product eligibility). The cancellation retention flow uses `RETENTION15` (15% off, 3 cycles, once per customer).
- **Rate limit:** 5 requests per second. The plan change flow makes 2-3 sequential calls — stay aware.

---

## References
- Next.js development: `./03-nextjs-development.md`
- Implementation workflow: `./02-implementation-workflow.md`
- Shopify Storefront API docs: https://shopify.dev/docs/api/storefront
- Loop Subscriptions docs: https://developer.loopwork.co/reference/api-reference
