# CONKA Website – Project Overview

High-level structure and key systems for the CONKA marketing and e-commerce frontend.

## Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Hosting:** Vercel
- **Commerce:** Headless Shopify — Storefront API for cart; checkout on Shopify hosted pages (`cart.checkoutUrl`)

## Rough structure

- **Routes:** Home (`/`), product pages (`/conka-flow`, `/conka-clarity`, `/conka-both`), `/build-your-order`, `/go/[slug]` ad landings, professionals portal, account, static/content pages. `/protocol/[id]`, `/quiz`, `/shop` and the three `/funnel*` routes are deleted and permanently redirect. Account portal: see [docs/features/CUSTOMER_PORTAL.md](./CUSTOMER_PORTAL.md).
- **Layout:** Single root layout with global nav, footer, cart drawer, and analytics scripts (GA, Meta Pixel, Triple Pixel, Klaviyo).
- **State:** Cart and auth are global (CartContext, AuthContext). Cart is persisted by Shopify cart ID in `localStorage`.

## Cart and checkout

- **Cart state and API:** `app/context/CartContext.tsx` — creates/fetches cart via `app/api/cart`, exposes `addToCart`, `updateQuantity`, `removeItem`, `getCartItems`, and cart drawer open/close. Cart lines and totals come from Shopify Storefront API.
- **Cart UI:** `app/components/CartDrawer.tsx` — lists line items, quantities, totals; “Checkout” links to `cart.checkoutUrl` (Shopify hosted checkout). No custom checkout in this repo.
- **Checkout flow:** User clicks Checkout → redirect to Shopify; payment and order completion happen on Shopify. Purchase and AddPaymentInfo events occur there (or via Shopify’s Meta integration / thank-you handling).

## Analytics (high level)

- **Vercel Analytics:** Product intent — `purchase:add_to_cart` with product/source/location. Implemented in `app/lib/analytics.ts`; fired from `CartContext` after a successful add. The old `quiz:*` event family went with the `/quiz` route; the `/go/[slug]` landing quizzes have their own events (see `docs/features/LANDING_QUIZ_SYSTEM.md`).
- **Triple Whale (Triple Pixel):** E-commerce AddToCart only. Script in layout; `app/lib/tripleWhale.ts` fires from `CartContext` after successful add.
- **Meta Pixel:** Browser-side tracking in `app/layout.tsx`; extended by `app/lib/metaPixel.ts` for PageView (with deduplication), ViewContent, AddToCart, InitiateCheckout. Conversions API (CAPI) via `app/api/meta/events/route.ts` for server-side events and deduplication.
- **Google Analytics / Klaviyo:** Scripts in layout; GA for page/config, Klaviyo for sign-up/onsite.

See `docs/analytics/` for implementation and verification guides.

## Product Data

Product data (types, pricing, content, colors, helpers) is organized into focused modules with clear dependencies. See [`docs/product/PRODUCT_DATA.md`](../product/PRODUCT_DATA.md) for module structure, helper usage, and import patterns.
