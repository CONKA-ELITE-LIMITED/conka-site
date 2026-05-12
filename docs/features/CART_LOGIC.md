# Cart logic

Concise overview of how the cart works in the app.

## Where it lives

- **State & API:** `app/context/CartContext.tsx` — cart state, persistence, and all cart actions.
- **UI:** `app/components/CartDrawer.tsx` — slide-out drawer: line items, quantities, subtotal, “Checkout” link.
- **API route:** `app/api/cart/route.ts` — proxies to Shopify Storefront API (create, add, update, remove, get cart).

## Persistence

- Cart is stored in **Shopify**; we only store the **cart ID** in `localStorage` under `shopify_cart_id`.
- On load, we read that ID and call `GET /api/cart?cartId=...` to hydrate the cart (deferred via `requestIdleCallback` so we don’t block initial paint).
- If the cart ID is missing or the fetch fails (e.g. 404), we clear `localStorage` and treat as no cart.

## Actions (context → API → Shopify)

| Action | When | API body |
|--------|------|----------|
| **Create** | No `cartId` in memory or localStorage, or add/update returns 404 | `action: 'create'`, optional `variantId`, `quantity`, `sellingPlanId` |
| **Add** | User adds a product; we have a cart ID | `action: 'add'`, `cartId`, `variantId`, `quantity`, `sellingPlanId` |
| **Update** | User changes quantity of a line | `action: 'update'`, `cartId`, `lineId`, `quantity` |
| **Remove** | User removes a line (or quantity goes to 0) | `action: 'remove'`, `cartId`, `lineId` |

On successful create, we write `data.cart.id` to `localStorage`. All cart data (lines, cost, `checkoutUrl`) comes from the Shopify response.

## Checkout

- There is **no custom checkout** in this repo. The drawer’s “Checkout” button is a link to `cart.checkoutUrl` (Shopify hosted checkout).
- When the user clicks it (and the cart has items), we call Meta’s Initiate Checkout tracking; we do **not** send any event to Klaviyo from here. Klaviyo’s “Checkout Started” is sent by Shopify when they land on the checkout page.

## Clearing the cart (local only)

- `clearCart()` removes the cart ID from `localStorage` and sets cart state to `null`. Used after checkout completion (or similar) so the next visit doesn’t show the old cart. The cart still exists in Shopify until it expires; we just stop referencing it.

## Analytics (from cart actions)

- **Add to cart** (in `CartContext` after a successful add): Triple Whale `trackAddToCart`, Vercel Analytics `trackPurchaseAddToCart`, Meta Pixel (and CAPI) `trackMetaAddToCart`. Optional metadata: `location`, `source`, `sessionId` for funnel analysis.
- **Click to checkout** (in `CartDrawer` on the Checkout link): Meta `trackMetaInitiateCheckout` only. No Klaviyo event from the app.

## Add-to-cart call sites

- `addToCart(variantId, quantity?, sellingPlanId?, metadata?)` is used from product pages, protocol/formula pages, quiz results, and cart-related UI. Pass `metadata` where available (e.g. `location`, `source`) for analytics.
