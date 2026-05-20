# Customer Portal (Account)

Concise overview of the customer/account portal: authentication, subscriptions, profile, and how Shopify and Loop work together.

## Purpose and stack

The account portal lets customers:

- View and edit **profile** (name, email, address)
- View **order history**
- View **subscriptions** and perform **subscription actions** (Edit Plan, Pause Subscription, Resume Subscription, Skip next order, Reschedule Delivery, Cancel Subscription, update payment method)

**Stack:**

- **Shopify:** Product catalog, cart, hosted checkout, **customer identity** (OAuth via Customer Account API), and the **list of subscription contracts** per customer.
- **Loop:** Subscription lifecycle and recurring billing. Loop is the **source of truth** for subscription state (product, price, interval, next billing date, fulfillment flags). All subscription **mutations** go through the Loop Admin API; Loop syncs back to Shopify.

**Shopify = who the customer is + which contracts they have. Loop = what each subscription actually is and what happens when they interact with it.**

---

## Authentication flow

Login uses **Shopify Customer Account API** (OAuth 2.0 with PKCE). Session is stored in HTTP-only cookies.

```mermaid
sequenceDiagram
  participant User
  participant App as Next.js app
  participant Shopify as Shopify OAuth
  participant Callback as /api/auth/callback

  User->>App: Click Login
  App->>App: /api/auth/authorize: PKCE, state, nonce → cookies
  App->>Shopify: Redirect to Shopify login
  Shopify->>User: Email OTP / login UI
  User->>Shopify: Complete login
  Shopify->>Callback: Redirect with code, state
  Callback->>Callback: Validate state, exchange code (code_verifier)
  Callback->>Callback: Set cookies: customer_access_token, customer_id_token, customer_token_expires
  Callback->>User: Redirect to /account
```

- **Login:** `window.location.href = '/api/auth/authorize'` → generates PKCE, redirects to Shopify.
- **Callback:** `/api/auth/callback` validates state, exchanges code for tokens, sets cookies, redirects to `/account`.
- **Session:** `GET /api/auth/session` reads the `customer_access_token` cookie and fetches customer profile from Shopify. Returns `authenticated` and `customer` (id, email, firstName, lastName, defaultAddress).
- **Logout:** `GET /api/auth/logout` clears auth cookies.

**Key files:**

- [`app/context/AuthContext.tsx`](../app/context/AuthContext.tsx) — exposes `customer`, `loading`, `isAuthenticated`, `logout`, `login`, `checkSession`.

---

## Testing Shopify auth on a preview branch

Shopify Customer Account API **does not allow** `localhost` or `http` URLs as callback URIs. You cannot test the OAuth login flow on a local dev server directly.

**The solution: use your Vercel branch preview URL.**

Every branch pushed to Vercel gets a stable URL in the format:

```
https://{project}-git-{branch-name}-{team}.vercel.app
```

This URL stays the same for the lifetime of the branch regardless of how many times you push. Use this — not the per-deployment URL (which changes on every push).

### Steps

**1. Find your branch URL**

In Vercel → Deployments, find your branch deployment and look under **Domains** for the URL containing your branch name:

```
conka-shopify-git-your-branch-name-conka.vercel.app
```

**2. Add it to Shopify**

In Shopify → Headless → Customer Account API → Application setup:

- **Callback URI(s):** `https://{your-branch-url}/api/auth/callback`
- **Javascript origin(s):** `https://{your-branch-url}`

Hit **Save**.

**3. Set the environment variable in Vercel**

In Vercel → Settings → Environment Variables:

| Key                   | Value                       | Environment |
| --------------------- | --------------------------- | ----------- |
| `NEXT_PUBLIC_APP_URL` | `https://{your-branch-url}` | Preview     |

Scope it to your specific branch if possible. Trigger a redeploy so the variable is picked up.

**4. Test**

Open `https://{your-branch-url}/account` in your browser. Login completes via Shopify OAuth and redirects back to your preview URL. Monitor live logs in Vercel → Deployments → Functions.

**5. Cleanup**

When the branch is merged, remove the callback URI from Shopify to keep the allowlist clean.

### Dev mock sign-in (UI-only local development)

To work on the account portal UI without Shopify OAuth:

1. In `.env.local` set:
   - `DEV_MOCK_AUTH=true`
   - `NEXT_PUBLIC_DEV_MOCK_AUTH=true`
2. Restart the dev server.
3. Open `/account/login` and click **Use mock account (dev)**. Session and protected routes return mock/empty data — no Shopify or Loop calls.
4. Sign out clears the mock cookie.

Mock is only active when `NODE_ENV === 'development'` and `DEV_MOCK_AUTH === 'true'`. Never set in production.

---

## Subscription data flow

### Reading subscriptions

1. **Shopify** Customer Account API returns the logged-in customer's subscription contract IDs via `customer { subscriptionContracts(first: 50) }`.
2. **Loop** Admin API is called for each contract using `shopify-{numericId}` format to get real subscription details: product, variant, price, interval, next billing date, lines, fulfillment flags.
3. The merged response is returned as a single list. If Loop fails for a contract, the route falls back to Shopify-only data.

**API:** `GET /api/auth/subscriptions` — [`app/api/auth/subscriptions/route.ts`](../app/api/auth/subscriptions/route.ts)

### Subscription actions

Most mutations go through one consolidated route: `POST /api/auth/subscriptions/[id]/pause`

Reschedule has its own dedicated route: `POST /api/auth/subscriptions/[id]/reschedule`

| Action            | Body                                                                                                       | Loop endpoint used                              | Route |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----- |
| Pause             | `{ action: 'pause', pauseWeeks?: number }`                                                                 | `POST /subscription/{shopify-id}/pause`         | `/pause` |
| Resume            | `{ action: 'resume' }`                                                                                     | `POST /subscription/{shopify-id}/resume`        | `/pause` |
| Resume now        | `{ action: 'resume-now', resumeNowEpoch: number }`                                                        | `POST .../resume` + `POST .../reschedule`       | `/pause` |
| Cancel            | `{ action: 'cancel', reason?: string }`                                                                    | `POST /subscription/{shopify-id}/cancel`        | `/pause` |
| Skip              | `{ action: 'skip' }`                                                                                       | `POST /subscription/{loopInternalId}/skipNext`  | `/pause` |
| Change plan       | `{ action: 'change-frequency', plan: 'starter' \| 'pro' \| 'max', protocolId?: '1'\|'2'\|'3'\|'4' }`      | `PUT .../line/{lineId}/swap` + `PUT .../frequency` | `/pause` |
| Edit multi-line   | `{ action: 'edit-multi-line', lines: LineEdit[], plan?: 'starter' \| 'pro' \| 'max' }`                     | `PUT .../line/{lineId}/swap` (per line) + `PUT .../frequency` | `/pause` |
| Reactivate        | `{ action: 'reactivate' }`                                                                                 | `POST /subscription/{loopInternalId}/reactivate` | `/pause` |
| Place order now   | `{ action: 'place-order' }`                                                                                | `POST /subscription/{loopInternalId}/placeOrder` | `/pause` |
| Apply discount    | `{ action: 'apply-discount', discountCode: string }`                                                       | `POST /subscription/{loopInternalId}/discount`   | `/pause` |
| Reschedule        | `{ newBillingDateEpoch: number }`                                                                          | `POST /subscription/{loopInternalId}/reschedule` | `/reschedule` |

The `[id]` is the Shopify subscription contract ID (GID or numeric). The route converts it to Loop's `shopify-{numericId}` format. Some Loop endpoints (skipNext, frequency, reschedule) require Loop's internal numeric ID — the route GETs the subscription first to resolve this.

**Pause behaviour:** Clicking "Pause Subscription" opens a cycle-based duration picker modal (`PauseModal.tsx`) offering 1, 2, or 3 billing cycles based on the subscription's interval (e.g. monthly → 1/2/3 months, bi-weekly → 2/4/6 weeks). The selected duration is sent as `pauseWeeks` in the request body. The server converts this to Loop's `pauseDuration` format (`{ intervalCount, intervalType: 'DAY' | 'MONTH' }`) — note that Loop does NOT accept `WEEK` as an intervalType; sub-month durations use `DAY` with days = weeks × 7. Loop auto-resumes the subscription after the selected period. Customers can resume manually at any time.

**Resume behaviour:** Clicking "Resume" on a paused subscription opens the `ResumeModal.tsx` with two options: (1) **Resume now** — sets the next billing date to ~3 days from today (fulfillment lead time) so the customer gets a delivery soon; this calls `resume` then `reschedule` server-side. (2) **Resume on scheduled date** — keeps the existing (paused) next billing date; this calls `resume` only. If the scheduled date is already within a few days of now, the "resume now" option is hidden since both options would be effectively the same. Footer copy reminds the customer they can always reschedule after resuming. The server action `resume-now` is gracefully degraded: if the reschedule step fails after a successful resume, the subscription is still active and the customer is told they can reschedule manually.

**Cancel behaviour:** The cancellation flow has a three-step modal: (1) reason selection, (2) retention offer, (3) final confirmation. The retention step shows a tailored alternative based on the reason:

- **"Too expensive"** → offers 15% off next 3 deliveries via `RETENTION15` discount code (applied automatically via Loop Admin API). On success the modal closes and the subscription card refreshes to show the discount. On failure (code expired, already used, etc.) an error is shown and the customer can retry or continue cancelling.
- **"Not seeing results" / "No longer needed"** → suggests pausing.
- **"Too frequent" / "Too infrequent"** → suggests editing the plan.

If the customer accepts the alternative, the cancel modal closes and the relevant action (discount application / pause modal / edit modal) executes. If they decline, they proceed to final confirmation. The customer's cancellation reason is sent as `comment` (Loop's field name — not `cancellationReason`, which is only in responses). Loop sends a cancellation confirmation email to the customer (`notifyCustomer: true`). The final confirmation step also tells the customer they can reactivate later.

**Retention discount code (`RETENTION15`):** Created in Shopify as a product discount: 15% off subscriptions, limited to 3 recurring payments, one use per customer, cannot combine with other discounts. The code is hardcoded in `CancellationModal.tsx` — if changed in Shopify, update the constant in the component.

**Reactivate behaviour:** Cancelled subscriptions show a "Reactivate" button on the past subscriptions card. Clicking it opens `ReactivateModal.tsx` which explains that billing will resume on the original schedule. The server calls `POST /subscription/{loopInternalId}/reactivate` (Loop internal ID — resolved via GET first, same pattern as skip/frequency). On success, the subscription moves back to the active section. Error handling accounts for discontinued products — if the product/variant no longer exists, the error message directs the customer to start a new subscription.

**Place order now behaviour:** Active subscription cards show an "Order Now" button (hidden when there's already an unfulfilled order, using the existing `hasUnfulfilledOrder` flag). Clicking it opens `PlaceOrderModal.tsx` which warns that the next scheduled delivery will shift forward. The server calls `POST /subscription/{loopInternalId}/placeOrder` with `preponeFutureOrder: true` (Loop internal ID). On success, subscription data is refreshed to show the updated next billing date.

**Apply discount behaviour:** Active subscription cards show an "Apply promo code" link that expands into an inline input field. The customer enters a Shopify discount code and clicks Apply. The server resolves the Loop internal ID, then calls `POST /subscription/{loopInternalId}/discount` with `{ code }` (Admin API, `X-Loop-Token` auth). On success, the subscription data refreshes to show the new discount in the active discounts display. Error messages from Loop (invalid code, expired, etc.) are shown inline. The input auto-uppercases the code and supports Enter to submit.

**Skip behaviour:** Skips the next upcoming order. The route resolves the Loop internal ID first (skipNext requires it), then calls `POST /subscription/{loopInternalId}/skipNext`.

**Reschedule behaviour:** Clicking "Reschedule Delivery" on an active subscription opens a date picker modal (`RescheduleModal.tsx`). The reschedule window is **interval-aware**: minimum 3 days from now (fulfillment lead time), maximum one billing cycle from the current next billing date (e.g. 14 days for bi-weekly, 30 days for monthly). This prevents pushing a delivery past the next cycle boundary, which would be confusing. For longer delays, customers should use Skip or Pause instead. The modal shows a schedule shift warning: _"This will shift your entire delivery schedule. All future deliveries will follow from this new date."_ The server GETs the subscription to resolve the Loop internal ID and billing policy (for date validation), then calls Loop's dedicated `POST /subscription/{loopInternalId}/reschedule` with `newBillingDateEpoch` and `rescheduleFutureOrders: true`. This endpoint changes the next billing date without going through the frequency endpoint, so it has no selling plan validation — it works correctly on multi-line subscriptions regardless of variant/interval configuration. If the subscription has an unfulfilled order, the modal warns that rescheduling affects the following delivery. The card's "Next delivery" date updates immediately on success.

**Error handling:** All Loop API errors are logged server-side with full details. Client responses contain only user-friendly messages — no internal Loop data is exposed.

**Implementation:**
- [`app/api/auth/subscriptions/[id]/pause/route.ts`](../app/api/auth/subscriptions/[id]/pause/route.ts) — pause, resume, cancel, skip, change-frequency, edit-multi-line, reactivate, place-order, apply-discount
- [`app/api/auth/subscriptions/[id]/reschedule/route.ts`](../app/api/auth/subscriptions/[id]/reschedule/route.ts) — reschedule delivery date

---

## Plan change (change-frequency)

### How it works

When a customer changes tier or protocol on a **single-line** subscription, the backend performs two sequential Loop API calls.

**Step 1 — Swap line:**

```
PUT /admin/2023-10/subscription/shopify-{id}/line/{lineId}/swap
```

Updates the product variant and price. Uses `PROTOCOL_VARIANTS` to resolve the target variant ID and `PLAN_CONFIGURATIONS` for the `sellingPlanGroupId`.

**Step 2 — Update frequency:**

```
PUT /admin/2023-10/subscription/{loopInternalId}/frequency
```

Updates the billing and delivery interval. Uses Loop's **internal numeric ID** (e.g. `10547807`) — **not** the `shopify-{id}` format. This ID is extracted from the Step 1 GET response (`subscriptionData.data.id`).

Body:

```json
{
  "billingPolicy": { "interval": "WEEK", "intervalCount": 2 },
  "deliveryPolicy": { "interval": "WEEK", "intervalCount": 2 },
  "nextBillingDateEpoch": 1234567890,
  "discountType": "OLD"
}
```

`nextBillingDateEpoch` is always set to the subscription's **existing** next billing date, so a plan change never resets the billing clock. Interval must be `WEEK`, `MONTH`, or `YEAR` — Loop does not accept `DAY`. Bi-weekly = `WEEK` × 2.

**Important:** Step 2 uses the Loop internal ID, not the Shopify-prefixed ID. This is a known gotcha — the frequency endpoint returns 404 if you pass `shopify-{id}`.

### Verified product and plan mappings

These are verified against Shopify and must be kept in sync if products change.

**`PROTOCOL_VARIANTS`**

| Protocol       | Tier    | Variant ID     | SKU                  |
| -------------- | ------- | -------------- | -------------------- |
| 1 — Resilience | starter | 56999240597878 | RESILIANCE_STARTER_4 |
| 1 — Resilience | pro     | 56999240630646 | RESILIANCE_PRO_12    |
| 1 — Resilience | max     | 56999240663414 | RESILIANCE_MAX_28    |
| 2 — Precision  | starter | 56999234503030 | PRECISION_STARTER_4  |
| 2 — Precision  | pro     | 56999234535798 | PRECISION_PRO_12     |
| 2 — Precision  | max     | 56999234568566 | PRECISION_MAX_28     |
| 3 — Balance    | starter | 56998884573558 | BALANCED_STARTER_4   |
| 3 — Balance    | pro     | 56998884606326 | BALANCED_PRO_12      |
| 3 — Balance    | max     | 56998884639094 | BALANCED_MAX_28      |
| 4 — Ultimate   | pro     | 56999249478006 | ULTAMATE_PRO_28      |
| 4 — Ultimate   | max     | 56999249510774 | ULTAMATE_MAX_56      |
| flow           | starter | 57000187363702 | FLOW_TRIAL_4         |
| flow           | pro_8   | 56999967785334 | FLOW_TRIAL_8         |
| flow           | pro     | 56999967752566 | FLOW_TRIAL_12        |
| flow           | max     | 56999967818102 | FLOW_TRIAL_28        |
| clear          | starter | 57000418607478 | CLEATR_TRIAL_4       |
| clear          | pro_8   | 57000418640246 | CLEAR_TRIAL_8        |
| clear          | pro     | 57000418673014 | CLEAR_TRIAL_12       |
| clear          | max     | 57000418705782 | CLEAR_TRIAL_28       |

**`PLAN_CONFIGURATIONS`**

| Plan    | Interval  | SellingPlanId | SellingPlanGroupId |
| ------- | --------- | ------------- | ------------------ |
| starter | WEEK × 1  | 711429882230  | 98722480502        |
| pro     | WEEK × 2  | 711429947766  | 98722546038        |
| max     | MONTH × 1 | 711429980534  | 98722578806        |

### Edit plan modal — single-line subscriptions

The modal behaviour is driven by **subscription type** (derived from the subscription's product title):

| Type                                                    | What can change                                      | Boundary                                   |
| ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------ |
| **Protocol** (Resilience, Precision, Balance, Ultimate) | Switch protocol and/or pack size (starter/pro/max)   | Cannot switch to Flow/Clear single formula |
| **Flow or Clear** (single formula)                      | Switch formula and/or pack size (4, 8, 12, 28 shots) | Cannot switch to a protocol bundle         |

Crossing the boundary (protocol ↔ single formula) is not supported in the modal. The UI states this clearly and directs the customer to cancel and start a new subscription from the shop.

### Edit plan modal — multi-line subscriptions

Multi-line contracts use `MultiLineEditModal.tsx`, which provides a per-line product/size picker and a shared delivery schedule display.

**Cadence is auto-derived — not user-selectable.** The delivery frequency is set to the plan of the largest pack across all lines:

- ≤ 4 shots → Starter (weekly)
- 5–12 shots or 8-shot formula → Pro (bi-weekly)
- ≥ 28 shots → Max (monthly)

Example: a contract with a 12-shot line and a 28-shot line → monthly cadence (28 shots forces it).

**Frequency update is skipped when the interval is unchanged.** After swapping each line's variant, the route checks whether the target interval/intervalCount differs from the current billing policy. If they match, `PUT /frequency` is skipped entirely — Loop rejects redundant frequency updates on multi-line contracts. If the cadence genuinely changes (e.g. both lines drop to 4-shot → weekly), the frequency call is made with `nextBillingDateEpoch` set to the existing next billing date to preserve the schedule.

**Next billing date is always preserved.** `nextBillingDateEpoch` is fetched from Loop before any mutation and passed back on every frequency update. A plan or product change never resets the billing clock.

### Verifying a plan change

After any subscription action, check Vercel function logs for:

**Skip:**
```
[SKIP] Input: {numericId} -> Loop format: shopify-{numericId}
[SKIP] Using Loop internal ID: {loopInternalId}
[Loop API] POST .../subscription/{loopInternalId}/skipNext
[Loop API] Response 200: {"success":true,"message":"Upcoming order skipped successfully"...}
```

**Single-line plan change:**
```
[Loop plan-update][shopify-{id}] Step 1: GET subscription
[Loop plan-update][shopify-{id}] Step 2: PUT swap line
[Loop plan-update][shopify-{id}] Step 3: PUT frequency using Loop internal ID: {loopInternalId}
[Loop plan-update][shopify-{id}] PUT frequency OK
```

**Multi-line (interval unchanged):**
```
[Loop edit-multi-line][shopify-{id}] Swapping line {lineId}: product=... size=... variant=...
[Loop edit-multi-line][shopify-{id}] Skipping PUT frequency — interval unchanged (MONTH × 1)
```

**Multi-line (interval changing):**
```
[Loop edit-multi-line][shopify-{id}] Swapping line {lineId}: ...
[Loop edit-multi-line][shopify-{id}] PUT frequency using Loop internal ID: {loopInternalId}
[Loop edit-multi-line][shopify-{id}] PUT frequency OK
```

**Reschedule:**
```
[RESCHEDULE] Input: {numericId} -> Loop format: shopify-{numericId}
[RESCHEDULE] Loop internal ID: {loopInternalId}, interval: WEEK × 2, cycleDays: 14
[Loop API] POST .../subscription/{loopInternalId}/reschedule
[RESCHEDULE] Success
```

**Reactivate:**
```
[REACTIVATE] Input: {numericId} -> Loop format: shopify-{numericId}
[REACTIVATE] Using Loop internal ID: {loopInternalId}
[Loop API] POST .../subscription/{loopInternalId}/reactivate
[Loop API] Response 200: {"success":true,...}
```

**Place order now:**
```
[PLACE-ORDER] Input: {numericId} -> Loop format: shopify-{numericId}
[PLACE-ORDER] Using Loop internal ID: {loopInternalId}
[Loop API] POST .../subscription/{loopInternalId}/placeOrder
[Loop API] Response 200: {"success":true,"message":"Order placed successfully",...}
```

**Apply discount:**
```
[APPLY-DISCOUNT] Input: {numericId} -> Loop format: shopify-{numericId}
[APPLY-DISCOUNT] Using Loop internal ID: {loopInternalId}
[APPLY-DISCOUNT] Applying discount code: {CODE}
[Loop API] POST .../subscription/{loopInternalId}/discount
[Loop API] Response 200: {"success":true,...}
```

Then confirm in Loop's dashboard that both the product/variant and billing interval match the selection.

### Legacy product subscriptions

Customers whose subscriptions were created on old legacy products (e.g. "CONKA 1 (28 Shots)", SKU `staple_trialbox_28`) will get a frequency update failure because those variants have a different selling plan group ("Subscribe and Save") that doesn't match the current plan configurations.

**Resolution:** Manually migrate affected subscriptions in the Loop dashboard to the correct current protocol variant. Audit Loop for any active subscriptions still on legacy variants before going live.

---

## Payment method

### How it works

Payment methods are fetched per customer (not per subscription) using the Loop Admin API with the existing `LOOP_API_KEY`.

**Step 1 — Fetch customer and payment methods:**

```
GET /admin/2023-10/customer/{customerShopifyId}
X-Loop-Token: LOOP_API_KEY
```

Returns the customer's full profile including a `paymentMethods` array with `id`, `card.brand`, `card.lastDigits`, `card.expiryMonth`, `card.expiryYear`, and `status`.

The Shopify customer ID is extracted from the session (GID format `gid://shopify/Customer/7302843334829` → numeric `7302843334829`).

**Step 2 — Trigger update email:**

```
PUT /admin/2023-10/paymentMethod/{paymentMethodId}
X-Loop-Token: LOOP_API_KEY
```

Loop emails the customer a secure link to update their card. No card data is handled by the portal — Loop manages PCI compliance entirely.

### UI behaviour

The primary (first `safe`) payment method is shown on each active subscription card:

```
💳  Visa  ····  4242    Expires 01/28   [Update payment method]
```

Status indicators:

- `safe` — no warning
- `expiring_soon` (within 60 days) — amber warning
- `expired` — red warning with prompt to update

On clicking Update:

1. Button shows loading state
2. On success: _"Check your email — we've sent a secure link to update your card."_ (auto-dismisses after 8 seconds, button disabled for 30 seconds to prevent spam)
3. On failure: _"Something went wrong. Please contact sales@conka.io."_

**API routes:**

- `GET /api/auth/subscriptions/payment-methods` — fetches customer payment methods from Loop
- `PUT /api/auth/subscriptions/payment-methods/[id]` — triggers update email

**Hook:** `app/hooks/usePaymentMethods.ts` — exposes `paymentMethods`, `loading`, `primaryMethod`, `triggerUpdateEmail(id)`.

---

## Profile and orders

- **Profile:** Edit Profile modal on the account dashboard. POSTs to `/api/auth/customer/update` with `firstName`, `lastName`, `phone`, `address`. The update route reads the `customer_access_token` cookie and calls the **Customer Account API** (same endpoint as session and orders: `https://shopify.com/{shopId}/account/customer/api/2024-10/graphql`). Email is read-only in the modal — Shopify manages email via its own account flow, not the Customer Account API `customerUpdate` mutation. `CustomerUpdateInput` only supports `firstName` and `lastName`; phone number is set via `CustomerAddressInput.phoneNumber` on the address mutation. Address handling: if the customer already has a default address (queried via `customer { defaultAddress { id } }`), the route uses `customerAddressUpdate`; otherwise it uses `customerAddressCreate`. Both mutations accept a `defaultAddress: Boolean` parameter to set/keep the address as default in a single call (no separate `customerDefaultAddressUpdate` mutation in the Customer Account API). `CustomerAddressInput` uses `territoryCode` (ISO country code, e.g. "GB") and `zoneCode` (province/state code) — the route maps frontend country names to ISO codes via `COUNTRY_CODE_MAP`.

  **Loop subscription address sync (critical):** Updating the address in Shopify is *not enough*. Loop stores the shipping address **separately on each subscription contract**, captured when the subscription was created, and never re-reads Shopify's default address. After any successful Shopify write (name, phone, or address), the route re-reads the customer's canonical state from Shopify (name + default address) and mirrors it to every **active or paused** Loop subscription via the Loop Admin API: `PUT /admin/2023-10/subscription/{loopInternalId}/address` (`X-Loop-Token` auth). Reading canonical state rather than trusting the request body means a name-only or phone-only edit syncs just as reliably as a full address edit. Each contract's Loop internal ID is resolved with a `GET /subscription/shopify-{numericId}` first. The sync is skipped when the Shopify address write itself failed (Shopify still holds the old address, so a sync would push stale data). The Loop sync is best-effort — if it fails, the Shopify save still stands and the response reports a **partial success** (`results.subscriptions`) so the customer is told their address saved but the subscription delivery address needs support. Without this step, a customer who updates their address still has every future delivery shipped to the old one. Log prefix: `[CUSTOMER-UPDATE][loop]`.
- **Orders:** `GET /api/auth/orders` — uses Customer Account API with the session cookie to fetch the customer's order list and count.

---

## Key file reference

| Area                           | File                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Auth context                   | [`app/context/AuthContext.tsx`](../app/context/AuthContext.tsx)                                                           |
| Subscriptions hook             | [`app/hooks/useSubscriptions.ts`](../app/hooks/useSubscriptions.ts)                                                       |
| Payment methods hook           | [`app/hooks/usePaymentMethods.ts`](../app/hooks/usePaymentMethods.ts)                                                     |
| Account dashboard              | [`app/account/page.tsx`](../app/account/page.tsx)                                                                         |
| Subscriptions list & actions   | [`app/account/subscriptions/page.tsx`](../app/account/subscriptions/page.tsx)                                             |
| Edit plan modal (single-line)  | [`app/components/subscriptions/EditSubscriptionModal.tsx`](../app/components/subscriptions/EditSubscriptionModal.tsx)     |
| Edit plan modal (multi-line)   | [`app/components/subscriptions/MultiLineEditModal.tsx`](../app/components/subscriptions/MultiLineEditModal.tsx)           |
| Pause duration modal           | [`app/components/subscriptions/PauseModal.tsx`](../app/components/subscriptions/PauseModal.tsx)                           |
| Resume options modal           | [`app/components/subscriptions/ResumeModal.tsx`](../app/components/subscriptions/ResumeModal.tsx)                         |
| Reschedule delivery modal      | [`app/components/subscriptions/RescheduleModal.tsx`](../app/components/subscriptions/RescheduleModal.tsx)                 |
| Reactivate subscription modal  | [`app/components/subscriptions/ReactivateModal.tsx`](../app/components/subscriptions/ReactivateModal.tsx)                 |
| Place order now modal          | [`app/components/subscriptions/PlaceOrderModal.tsx`](../app/components/subscriptions/PlaceOrderModal.tsx)                 |
| Order card (with Order Again)  | [`app/components/orders/OrderCard.tsx`](../app/components/orders/OrderCard.tsx)                                           |
| GET subscriptions (hybrid)     | [`app/api/auth/subscriptions/route.ts`](../app/api/auth/subscriptions/route.ts)                                           |
| Subscription actions           | [`app/api/auth/subscriptions/[id]/pause/route.ts`](../app/api/auth/subscriptions/[id]/pause/route.ts)                     |
| Reschedule delivery            | [`app/api/auth/subscriptions/[id]/reschedule/route.ts`](../app/api/auth/subscriptions/[id]/reschedule/route.ts)           |
| Payment methods — fetch        | [`app/api/auth/subscriptions/payment-methods/route.ts`](../app/api/auth/subscriptions/payment-methods/route.ts)           |
| Payment methods — update email | [`app/api/auth/subscriptions/payment-methods/[id]/route.ts`](../app/api/auth/subscriptions/payment-methods/[id]/route.ts) |
| Loop API client                | [`app/lib/loop.ts`](../app/lib/loop.ts)                                                                                   |
| Subscription types             | [`app/types/subscription.ts`](../app/types/subscription.ts)                                                               |
