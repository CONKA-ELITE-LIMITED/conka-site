# Cart logic

Concise overview of how the cart works in the app.

## Where it lives

- **State & API:** `app/context/CartContext.tsx` — cart state, persistence, and all cart actions.
- **UI:** `app/components/CartDrawer.tsx` — slide-out drawer: empty state, line items, upgrade tile, savings, subtotal, checkout. See [Drawer UI](#drawer-ui-cartdrawertsx).
- **Upsell:** `app/components/CartUpsellTile.tsx` + `app/lib/cartUpsell.ts` — one cart-level upgrade tile and its offer logic (`getCartUpsell`).
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

- There is **no custom checkout** in this repo. The drawer’s “Checkout” button is a `ConkaCTAButton` that, on click, fires Meta’s Initiate Checkout tracking and then redirects to `cart.checkoutUrl` (Shopify hosted checkout) via `window.location`. It renders as a `<button>` (not an anchor) because it needs the tracking-then-redirect step; the `sendBeacon`/CAPI keepalive survives the navigation.
- We do **not** send any event to Klaviyo from here. Klaviyo’s “Checkout Started” is sent by Shopify when they land on the checkout page.

## Drawer UI (`CartDrawer.tsx`)

The drawer only renders when `isOpen`. A **free-shipping banner** (“Free shipping on UK subscriptions”) sits under the header in every state.

### Empty state

Big “Your cart is empty” heading + the three products from `NAV_PRODUCTS` (shared with the Shop mega-menu) as square tiles with the time-of-day badge (`TIME_OF_DAY_BADGE`). The CTA is a `ConkaCTAButton` labelled “Shop CONKA” that closes the drawer and routes to `/conka-both`.

### Line item

Layout mirrors a simple DTC cart (Magic Mind aligned): unframed square image on the left; the right column holds the wrapping product name, an “N Bottles” line, and — when the offer includes bonus shots — a green **“+ X free”** badge on its own line. Below that, a bordered quantity group on the left and a trash-icon remove on the right. The upgrade tile is a single cart-level card rendered below the whole line list (not per line).

### Subscription pricing & savings

`getLineSavings(item)` computes the numbers for subscription lines only (one-time lines show just the price). It anchors on the **verifiable one-time price** for the same product — `getOfferPricing(product, "monthly-otp").price`, ×3 for quarterly (three months shipped at once). From that single anchor it derives, so they always reconcile:

- **Crossed-out “was”** — the OTP anchor.
- **Discount pill** — `round(1 − sub / anchor)` as “X% off”.
- **Recurring line** — grey, bold “X% off every month, forever” (“every 3 months” for quarterly), replacing the old Subscribe badge.

> Note: this deliberately differs from the PDP’s headline discount, which factors the free bottles in on a different basis. The cart favours an internally consistent, verifiable OTP anchor (e.g. Both £74.99 vs £99.98 → 25% off).

The displayed **price** always comes from Shopify (`getLineDisplayPrice`) so line prices match the Shopify subtotal; only the compare-at/percent are derived.

### Upgrade tile (`CartUpsellTile`, SCRUM-1201/1202)

One cart-level upgrade tile, not per line. `getCartUpsell(lines)` (`cartUpsell.ts`) returns a single offer or null. It shows only when the cart is **exactly one line**, that line is a recognised funnel product, and no upsell has been accepted yet (see suppression below). The map is one step, **never a chain**:

- **One-time → monthly subscription** (same product: Flow / Clear / Both)
- **Flow / Clear monthly → Both monthly**
- **Flow / Clear quarterly → Both quarterly**
- **Both** (any cadence) is terminal — no offer.

The tile is copy-only; all wording (headline, value line, an optional green highlight badge like “+16 free shots”, CTA) is built into the offer. There is no dismiss: it self-clears once the cart stops qualifying.

**Accepting = add-first swap.** `markUpsellAccepted` → `addToCart(target, quantity, sellingPlan, { source: "cart_upsell" })` → confirm the target landed in the returned cart → `removeItem(original)`. Add-first (not remove-first) because `addToCart` / `removeItem` swallow their errors and never reject, so a failed add must leave the original line untouched rather than orphan an empty cart; on that failure the accept flag is cleared. Fires `cart:upsell_shown` / `cart:upsell_accepted` (`{ type, product }`).

**Suppression / cooldown.** On accept, a `conka_cart_upsell` sessionStorage flag is set; while set, `getCartUpsell` returns null. This blocks a ladder (the just-upgraded single line would otherwise re-qualify for Both). The flag clears when the cart is **genuinely emptied** (`CartDrawer`, on a >0→0 transition so a page load can’t wipe it), re-enabling the upsell for a fresh cart; it also clears on a failed swap add.

**Attribution.** The accepted origin (`<type>:<fromProduct>`) is re-derived into a hidden `_upsell` cart attribute on every `addToCart` (same pattern as `_listicle_origin`), so upsell-influenced orders carry it as a note attribute through Shopify checkout.

### Footer

- **SAVINGS** row (green pill) sums subscription savings across the cart. Psychology threshold `CART_SAVINGS_VALUE_THRESHOLD` (£50): at/above it shows “£X off”, below it shows the blended “X% off”. Hidden when there are no subscription savings.
- **Subtotal (N items)** from `cart.cost.subtotalAmount`.
- Checkout `ConkaCTAButton` (see [Checkout](#checkout)) with a **100-Day Money-Back Guarantee** line beneath it.

## Clearing the cart (local only)

- `clearCart()` removes the cart ID from `localStorage` and sets cart state to `null`. Used after checkout completion (or similar) so the next visit doesn’t show the old cart. The cart still exists in Shopify until it expires; we just stop referencing it.

## Analytics (from cart actions)

- **Add to cart** (in `CartContext` after a successful add): Triple Whale `trackAddToCart`, Vercel Analytics `trackPurchaseAddToCart`, Meta Pixel (and CAPI) `trackMetaAddToCart`. Optional metadata: `location`, `source`, `sessionId` for funnel analysis.
- **Click to checkout** (in `CartDrawer` on the Checkout link): Meta `trackMetaInitiateCheckout` plus Vercel `cart:checkout_clicked` (`{ items, value }`, SCRUM-1243), both fired before the redirect to `cart.checkoutUrl`. `items` is the distinct LINE count; Meta's `num_items` on the same click is the summed QUANTITY, so the two differ by design. No Klaviyo event from the app.
- **Cart upsell** (on the upgrade tile): `cart:upsell_shown` on view, `cart:upsell_accepted` on accept (Vercel, `{ type, product }`). The accepted add carries `source: "cart_upsell"` plus a hidden `_upsell` cart attribute for per-order attribution.

## Add-to-cart call sites

- `addToCart(variantId, quantity?, sellingPlanId?, metadata?)` returns the updated cart (or `null` on failure, so callers like the upgrade tile can confirm the add landed). Used from product pages, protocol/formula pages, quiz results, and cart-related UI. Pass `metadata` where available (e.g. `location`, `source`) for analytics.
