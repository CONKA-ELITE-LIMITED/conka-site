# Meta Pixel & Conversions API (CAPI)

This doc describes how Meta tracking is implemented and how to get **Purchase** and **AddPaymentInfo** coverage (they occur on Shopify checkout, not in this repo).

> **Production host only (2026-06-01, SCRUM-1048).** The pixel and CAPI fire **only on `www.conka.io`**. On Vercel preview deploys (`*.vercel.app`) and localhost the pixel does not initialise and CAPI sends nothing, so dev/preview traffic never pollutes the production dataset. Gate: `isProductionHost()` in `app/lib/metaPixel.ts`, the host check in `MetaPageViewTracker`, the `host`-header check in the CAPI route, and the inline guard around the pixel snippet in `app/layout.tsx`.

## What This Repo Sends

| Event              | When / Where                                      | Deduplication      |
|--------------------|---------------------------------------------------|--------------------|
| **PageView**       | Every page load (client component after pixel)    | `event_id` + CAPI  |
| **ViewContent**    | Product/protocol pages (conka-flow, conka-clarity, protocol/[id]) | `event_id` + CAPI  |
| **AddToCart**      | After successful add in `CartContext`              | `event_id` + CAPI  |
| **Purchase**       | Server-side, `orders/paid` webhook (see below)     | order ID as `event_id` |

**InitiateCheckout is no longer fired by this frontend (2026-06-01, SCRUM-1043).** It is owned solely by the Shopify **Facebook & Instagram channel**, which fires it on the real checkout page. Firing it from both places caused double/triple counting with no shared `event_id`, so the two frontend fires (`CartDrawer`, `funnelCheckout`) were removed.

**Purchase** is sent **server-side** from this repo via a Shopify `orders/paid` webhook (see "Server-side Purchase" below). **AddPaymentInfo** is not sent by this repo (it occurs on Shopify checkout; rely on the channel if needed). The Shopify Facebook channel also sends its own Purchase from checkout — our server event uses the **Shopify order ID as `event_id`** so Meta deduplicates the two rather than double-counting.

## Server-side Purchase (Shopify orders/paid webhook)

Added 2026-06-01 (SCRUM-1046/1047) as the core of the headless attribution fix (see `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md`).

- **Route:** `app/api/webhooks/shopify/orders/route.ts` (`runtime = "nodejs"`). Verifies the Shopify HMAC (`X-Shopify-Hmac-Sha256`), filters subscription rebills, maps the order to a Purchase, and sends it to CAPI.
- **Send + hashing:** `app/lib/metaCapi.ts` — SHA-256 hashes `em`/`ph`/`fn`/`ln`/`ct`/`st`/`zp`/`country`/`external_id`, and sends raw `fbp`/`fbc` + `client_ip_address`/`client_user_agent` for match quality.
- **Ad-click identity:** `fbclid` is captured into the `_fbc` cookie on landing (`captureFbcFromUrl` in `metaPixel.ts`), and `_fbp`/`_fbc` are attached as **cart-level attributes** (`CartContext` → `app/api/cart/route.ts`) so they reach the order's note attributes, where the webhook reads them.
- **Dedup + idempotency:** the Shopify order ID is the `event_id`, shared with the channel's Purchase, so Meta merges them; a Shopify retry re-sends the same `event_id` and is deduped Meta-side (no local store needed).
- **Webhook URL:** `https://hooks.conka.io/api/webhooks/shopify/orders` — a dedicated Vercel subdomain, because Shopify blocks webhook URLs that match the store's own domains (`www.conka.io`, `shop.conka.io`, etc.).
- **Renewals:** `isSubscriptionRenewal()` skips Loop rebills (marked `TODO(verify)` — confirm the exact signal against a real recurring order).

## Implementation Details

- **Client:** `app/lib/metaPixel.ts` – generates `event_id`, calls `fbq('track', ..., { eventID })`, and sends the same event to `POST /api/meta/events` (CAPI) with `event_id` and optional `fbp` cookie.
- **Server:** `app/api/meta/events/route.ts` – forwards to Meta Graph API with `event_id`, `user_data.fbp`, and `event_source_url` for deduplication. If `META_CAPI_ACCESS_TOKEN` or pixel ID is missing, the route returns 200 and does nothing so the client never fails.
- **Deduplication:** Same `event_id` is sent with the pixel and with CAPI so Meta can merge them. The `_fbp` cookie is sent as `user_data.fbp` when available to improve matching.

## Environment Variables

- **`NEXT_PUBLIC_META_PIXEL_ID`** – Meta Pixel ID (required for pixel and CAPI).
- **`META_CAPI_ACCESS_TOKEN`** – Server-only; used by the CAPI route and the order webhook. Without it, CAPI is skipped but the site still works.
- **`SHOPIFY_WEBHOOK_SECRET`** – Server-only; the signing secret shown in Shopify Admin → Settings → Notifications → Webhooks. Used to verify the `orders/paid` webhook HMAC. Without it the webhook returns 200 and sends nothing.

---

## Where to get `META_CAPI_ACCESS_TOKEN`

You **generate** the token in **Meta Events Manager** (you don’t get it from an external provider). Use the same Pixel you use for the site.

1. Open **Events Manager**: [business.facebook.com/events_manager2](https://business.facebook.com/events_manager2) (or **Meta Business Suite** → **Events Manager**).
2. Select the **Pixel** you use for this site (the one whose ID is in `NEXT_PUBLIC_META_PIXEL_ID`).
3. Open the **Settings** tab for that Pixel.
4. Find the **Conversions API** section and the **“Set up manually”** area.
5. Click **“Generate access token”** and follow the pop-up. Copy the token and store it securely.
6. *(Optional)* In the Pixel **Overview** tab, click **“Manage Integrations”** → **“Manage”** next to Conversions API so Meta creates the CAPI app and system user (no App Review needed).

**Notes:**

- Only users with **developer** access to the Business can see **“Generate access token”**.
- This token is for **server-side** use only. Put it in `META_CAPI_ACCESS_TOKEN` in your environment (e.g. Vercel env vars) and never expose it in client code or in `NEXT_PUBLIC_*` variables.
- If you prefer to use your own app and system user, you can generate a token in **Business Settings** → assign the Pixel to a system user → **Generate Token** for that user. Same token goes into `META_CAPI_ACCESS_TOKEN`.

Official reference: [Meta Conversions API – Get Started](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started).
