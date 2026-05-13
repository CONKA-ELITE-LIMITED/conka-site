# Mobile Subscription Integration

Reference guide for replicating or extending the customer portal's subscription management in a native or cross-platform mobile app. Covers auth, data flow, the subscription API contract, and mutation patterns.

---

## Mental model

Three services are involved. The key insight for mobile: Loop has **two API tiers** — the Admin API (which the web portal uses server-side) and a Storefront API that is safe to call from a mobile client.

| Service | What it does | Auth | Mobile-safe? |
|---|---|---|---|
| **Shopify Customer Account API** | Identifies the customer, returns their subscription contract IDs, orders, profile | OAuth 2.0 PKCE bearer token | Yes — call directly from device |
| **Loop Admin API** | Full subscription management with admin scope | `X-Loop-Token` static server key | **No — never put on device** |
| **Loop Storefront API** | Customer's own subscriptions only — view + mutations | Session token (24h, customer-scoped) issued by your backend | Yes — safe to call from device |

### Recommended mobile pattern

```
1. Customer logs in via Shopify OAuth (PKCE on device)
   → device holds Shopify access_token

2. Device sends Shopify token to your backend
   → backend verifies it, extracts Shopify customer ID

3. Backend calls Loop: POST /generate-session-token (with admin X-Loop-Token)
   → returns short-lived Loop session token scoped to that customer

4. Backend returns Loop session token to device

5. Device calls Loop Storefront API directly with session token
   → view subscriptions, pause, resume, cancel, skip, etc.
```

The Loop admin key never leaves the server. The device only ever holds two tokens: the Shopify bearer token and the Loop session token.

---

## Authentication

### Shopify Customer Account API — OAuth 2.0 PKCE

The web portal flow:

```
App → /api/auth/authorize → generates PKCE + state → redirect to Shopify login
Shopify → /api/auth/callback?code=…&state=… → exchange code → set HTTP-only cookies
GET /api/auth/session → reads cookie → returns { authenticated, customer }
```

**For mobile** the flow is the same but cookies don't work natively. Shopify explicitly defines a **"Mobile client"** type in their OAuth docs:

1. Open Shopify's OAuth URL in a system browser (`ASWebAuthenticationSession` on iOS, `Custom Tabs` on Android)
2. Capture the redirect via a **custom URI scheme** — Shopify requires the format `shop.{shopId}.{anything}://callback` for mobile clients (not `https://` or `localhost`)
3. Exchange the auth code — mobile clients are PKCE-only (no client secret, no server needed for the exchange)
4. Store `access_token` and `refresh_token` in OS secure storage — **Keychain on iOS, Keystore on Android** (Shopify mandates this)
5. Pass `Authorization: {access_token}` as a header on subsequent API calls
6. Refresh using `grant_type=refresh_token` before expiry

There is no official Shopify mobile SDK for Customer Account auth. Use your platform's OAuth library (e.g. [AppAuth](https://appauth.io/) for iOS/Android) or implement PKCE manually. The `@shopify/customer-api-client` npm package provides OAuth helpers and could be used in React Native.

**Checkout Kit** (`ShopifyCheckoutSheetKit`) is a separate official SDK for rendering Shopify-hosted checkout in a native webview. It accepts a `customerAccessToken` to prefill checkout for authenticated buyers — so it slots in after you have a token, but it is not an auth SDK.

**Useful endpoints (Customer Account API):**

```
Base URL: https://shopify.com/{shopId}/account/customer/api/2024-10/graphql
Auth: Authorization: {customer_access_token}
```

Key queries:

```graphql
# Get customer profile
query {
  customer {
    id
    email
    firstName
    lastName
    defaultAddress { address1 city zip country }
  }
}

# Get subscription contract IDs (ownership proof)
query {
  customer {
    subscriptionContracts(first: 50) {
      nodes {
        id
        status
        nextBillingDate
        billingPolicy { interval intervalCount { count } }
        lines(first: 10) {
          nodes { id name quantity currentPrice { amount currencyCode } }
        }
      }
    }
  }
}

# Get orders
query {
  customer {
    orders(first: 20) {
      nodes {
        id
        name
        processedAt
        financialStatus
        fulfillmentStatus
        totalPrice { amount currencyCode }
      }
    }
  }
}
```

---

## Subscription data flow

### Reading subscriptions

The web portal uses a hybrid approach. Replicate this on your mobile backend:

```
1. Call Shopify Customer Account API with customer token
   → returns list of subscription contract IDs + basic Shopify data

2. For each contract ID, call Loop Admin API (server-side, with Loop key):
   GET https://api.loopsubscriptions.com/admin/2023-10/subscription/shopify-{numericId}
   X-Loop-Token: {LOOP_API_KEY}

3. Merge: use Shopify for contract ownership / IDs, use Loop for everything else
   (product details, price, interval, billing dates, payment method, fulfillment flags)

4. Return merged list to mobile client
```

**If Loop fails** for a contract, fall back to Shopify-only data (status, dates, basic product info). Mark it `dataSource: 'shopify-fallback'` so the UI can handle degraded state.

### Normalized subscription object

This is what your mobile client should receive per subscription:

```typescript
{
  id: string                    // Shopify GID: "gid://shopify/SubscriptionContract/123"
  shopifyNumericId: string      // "123" — used in API calls
  loopId: number                // Loop's internal numeric ID — needed for some mutations
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  nextBillingDate: string       // ISO date "2026-05-20"
  createdAt: string
  updatedAt: string

  product: {
    id: string
    title: string               // e.g. "Conka Flow - Pro - 12"
    variantTitle: string        // e.g. "Pro · 12 shots"
    quantity: number
    image: string | null        // URL
  }

  price: {
    amount: string              // "31.99"
    currencyCode: string        // "GBP"
  }

  interval: {
    value: number               // e.g. 2
    unit: 'week' | 'month' | 'day'
  }

  // Multi-line contracts (Flow + Clear in one subscription)
  lines: Array<{
    id: string
    productTitle: string
    variantTitle: string
    price: number
    quantity: number
    variantShopifyId: number
  }>
  isMultiLine: boolean

  // Fulfillment state (from Loop order tracking)
  hasUnfulfilledOrder: boolean
  unfulfilledOrdersCount: number
  completedOrdersCount: number | null
  totalOrdersPlaced: number | null

  // Payment method (from Loop)
  paymentMethod: {
    id: number
    brand: string | null        // "Visa"
    lastDigits: string | null   // "4242"
    expiryMonth: number | null
    expiryYear: number | null
    status: 'safe' | 'expiring_soon' | 'expired' | null
  } | null

  // Active discounts applied (excluding shipping-only)
  discounts: Array<{
    title: string
    value: number
    isActive: boolean
    type: string
  }>

  // Price summary with discounts applied
  totalLineItemPrice: number | null
  totalLineItemDiscountedPrice: number | null

  dataSource: 'loop' | 'shopify-fallback'
}
```

---

## Mutation API

All mutations are authenticated: verify the customer token before calling Loop.

The `[id]` in all routes below is the Shopify **numeric** contract ID (not the GID).

### Consolidated actions endpoint

`POST /api/auth/subscriptions/[id]/pause` (named pause for historical reasons — handles all actions)

| `action` | Additional body fields | What it does |
|---|---|---|
| `pause` | `pauseWeeks?: number` | Pause for N weeks (1–12). Loop auto-resumes after period. |
| `resume` | — | Resume on existing scheduled date |
| `resume-now` | `resumeNowEpoch: number` | Resume + reschedule to ~3 days from now |
| `cancel` | `reason?: string` | Cancel subscription. Sends customer email. |
| `skip` | — | Skip next upcoming order |
| `reactivate` | — | Reactivate a cancelled subscription |
| `place-order` | — | Place an immediate order now (shifts next billing date forward) |
| `apply-discount` | `discountCode: string` | Apply a Shopify discount code to the subscription |
| `change-frequency` | `plan: 'starter'\|'pro'\|'max'`, `protocolId?: string` | Change tier/protocol (single-line) |
| `edit-multi-line` | `lines: LineEdit[]`, `plan?: string` | Edit each line's product/size (multi-line) |

### Reschedule (separate route)

`POST /api/auth/subscriptions/[id]/reschedule`

```json
{ "newBillingDateEpoch": 1747612800 }
```

Valid range: min 3 days from now, max one billing cycle from current next billing date.

---

## Loop API gotchas

These will burn you if you don't know them:

1. **Two ID formats.** Most endpoints accept `shopify-{numericId}`. Some (skipNext, frequency, reschedule, reactivate, placeOrder, discount) require Loop's **internal numeric ID**. Resolve by GETting the subscription first — `loopData.id` is the internal ID.

2. **Pause duration uses DAY not WEEK.** Loop does not accept `WEEK` as an interval type for pause. Convert weeks to days (`weeks × 7`) and use `intervalType: 'DAY'`.

3. **Frequency endpoint uses internal ID.** `PUT /subscription/{loopInternalId}/frequency` returns 404 if you pass `shopify-{id}`.

4. **Skip frequency update if interval unchanged.** On multi-line edits, Loop rejects redundant frequency calls. Check whether interval/intervalCount actually changed before calling it.

5. **`nextBillingDateEpoch` must always be set on frequency updates** to avoid resetting the billing clock.

6. **Loop interval values:** Frequency updates accept `WEEK`, `MONTH`, `YEAR` — not `DAY`.

---

## Product / plan mappings

If you need to support plan changes from mobile, these are the verified variant and selling plan IDs:

### Selling plans (cadence)

| Plan | Tier | Interval | SellingPlanId | SellingPlanGroupId |
|---|---|---|---|---|
| starter | Weekly | WEEK × 1 | 711429882230 | 98722480502 |
| pro | Bi-weekly | WEEK × 2 | 711429947766 | 98722546038 |
| max | Monthly | MONTH × 1 | 711429980534 | 98722578806 |

### Product variants

| Protocol/Formula | Tier | Variant ID | SKU |
|---|---|---|---|
| Flow | starter (4) | 57000187363702 | FLOW_TRIAL_4 |
| Flow | pro_8 (8) | 56999967785334 | FLOW_TRIAL_8 |
| Flow | pro (12) | 56999967752566 | FLOW_TRIAL_12 |
| Flow | max (28) | 56999967818102 | FLOW_TRIAL_28 |
| Clear | starter (4) | 57000418607478 | CLEATR_TRIAL_4 |
| Clear | pro_8 (8) | 57000418640246 | CLEAR_TRIAL_8 |
| Clear | pro (12) | 57000418673014 | CLEAR_TRIAL_12 |
| Clear | max (28) | 57000418705782 | CLEAR_TRIAL_28 |

*(Protocol variants also exist — see `CUSTOMER_PORTAL.md` for the full table if still needed.)*

---

## Retention / cancellation flow

The web portal has a 3-step cancellation modal with retention offers. Replicate the logic:

1. **Reason selection** — customer picks a reason
2. **Retention offer** — based on reason:
   - "Too expensive" → apply `RETENTION15` discount code (15% off next 3 deliveries) via `apply-discount` action
   - "Not seeing results / No longer needed" → suggest pause
   - "Too frequent / Too infrequent" → suggest plan change
3. **Final confirmation** — if customer declines retention offer, confirm cancellation

If applying the retention discount fails (code expired/already used), show error and let customer retry or continue to cancel.

---

## Payment method management

Payment method updates are sent via email — no card data passes through the app.

```
GET  /api/auth/subscriptions/payment-methods        → fetch customer's methods from Loop
PUT  /api/auth/subscriptions/payment-methods/[id]   → trigger Loop's update-payment email
```

Loop calls:
- `GET /admin/2023-10/customer/{shopifyNumericCustomerId}` → returns `paymentMethods[]`
- `PUT /admin/2023-10/paymentMethod/{paymentMethodId}` → sends secure update link email

Display the primary `safe` method. Show amber warning if `expiring_soon` (within 60 days), red if `expired`.

---

## Loop Storefront API

This is the key difference from the web portal architecture. The Storefront API is customer-scoped and designed for client-facing use.

### Getting a session token

Your backend generates one per customer login:

```
POST https://api.loopsubscriptions.com/admin/2023-10/generate-session-token
X-Loop-Token: {LOOP_API_KEY}
Content-Type: application/json

{ "customerShopifyId": "7302843334829" }
```

Returns a session token valid for 24 hours. Regenerate on expiry (tie it to the customer's Shopify token refresh cycle).

### Calling the Storefront API from the device

```
Base URL: https://api.loopsubscriptions.com/storefront/
Auth: Authorization: Bearer {loop_session_token}
      or X-Loop-Session-Token: {loop_session_token}
      (check Loop docs for exact header — their storefront auth is distinct from admin)
```

The Storefront API covers:
- View customer's subscriptions (replaces the Shopify + Loop admin hybrid GET)
- All standard subscription mutations: pause, resume, cancel, skip, reschedule, swap product, change frequency

This means on mobile you may not need the Shopify + Loop hybrid GET at all — the Loop Storefront API returns the customer's subscriptions directly, no Shopify contract ID lookup needed.

**Important:** Loop's own customer portal is a webview embed. They explicitly support custom-built portals via the Storefront API.

---

## Backend architecture recommendation for mobile

### Option A — Thin token-exchange backend (recommended)

The mobile app handles Shopify auth directly (PKCE on device). Your backend only issues Loop session tokens.

```
Mobile App (Shopify PKCE → access_token stored in Keychain/Keystore)
    ↓  POST /mobile/loop-session  { shopify_access_token }
Your Backend
    ├── Verify Shopify token → GET customer ID
    └── POST Loop /generate-session-token → return loop_session_token to app

Mobile App (now has both tokens)
    ├── Shopify Customer Account API  →  profile, orders
    └── Loop Storefront API           →  subscriptions + all mutations
```

### Option B — Backend proxy (matches existing web portal)

The app sends the Shopify token to your backend, which proxies all calls.

```
Mobile App
    ↓  Authorization: {shopify_access_token}
Your Backend (existing Next.js routes or a dedicated service)
    ├── Verify Shopify token
    ├── Fetch subscriptions → Shopify GQL + Loop Admin API (hybrid, as web portal does)
    └── Mutations → Loop Admin API
         X-Loop-Token: {LOOP_API_KEY}  ← server-side only, never in mobile bundle
```

The existing `/api/auth/subscriptions/*` routes could be reused with minor changes to accept `Authorization` header instead of cookies. This is faster to ship but means all subscription calls go through your server rather than directly to Loop.

---

## Which approach to use

| | Option A (token exchange) | Option B (backend proxy) |
|---|---|---|
| Loop API used | Storefront (customer-scoped) | Admin (server-side) |
| Server load | Low — only token issuance | Higher — all API calls proxied |
| Latency | Lower — mobile calls Loop directly | Higher — extra hop through your server |
| Implementation effort | Higher — new Loop Storefront API integration | Lower — reuse existing web routes |
| Safety | Loop admin key never touched by mobile path | Loop admin key on your server (same as today) |

If you're building a full native app with good subscription UX, Option A is the right architecture. If you need to ship fast and the existing web backend is stable, Option B works and can be migrated to A later.

---

## Key files (web portal reference)

| Area | File |
|---|---|
| Auth context | `app/context/AuthContext.tsx` |
| Subscriptions hook | `app/hooks/useSubscriptions.ts` |
| GET subscriptions (hybrid) | `app/api/auth/subscriptions/route.ts` |
| Subscription mutations | `app/api/auth/subscriptions/[id]/pause/route.ts` |
| Reschedule | `app/api/auth/subscriptions/[id]/reschedule/route.ts` |
| Payment methods | `app/api/auth/subscriptions/payment-methods/route.ts` |
| Subscription types | `app/types/subscription.ts` |

Full customer portal doc: `docs/features/CUSTOMER_PORTAL.md`
