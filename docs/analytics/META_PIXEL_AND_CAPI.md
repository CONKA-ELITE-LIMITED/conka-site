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
- **Ad-click identity:** `fbclid` is captured into the `_fbc` cookie on landing (`captureFbcFromUrl` in `metaPixel.ts`), and `_fbp`/`_fbc`/`conka_uid` are attached as **cart-level attributes** (`CartContext` and the funnel/lander checkouts → `app/api/cart/route.ts`) so they reach the order's note attributes, where the webhook reads them.
- **Visitor identity (`external_id`, SCRUM-1158):** `conka_uid` is a first-party UUID minted on first sight (`getOrCreateExternalId` in `metaPixel.ts`, cookie scoped `.conka.io`, 400 days) and sent as `external_id` on **every** event, so logged-out ad traffic carries a match key. The Purchase sends the same `conka_uid` (read from the order's note attributes) ahead of the Shopify customer id, which is what lets Meta join a visitor's anonymous AddToCart to their Purchase. `external_id` is always `conka_uid`, never the email hash: Meta only treats it as a match key when the same value recurs across a person's events, and email already matches on `em`. **Caveat:** Safari ITP caps JS-written cookies to 7 days, so the join holds within a week but not beyond (this already affects `_fbc`).
- **Dedup + idempotency:** the Shopify order ID is the `event_id`, shared with the channel's Purchase, so Meta merges them; a Shopify retry re-sends the same `event_id` and is deduped Meta-side (no local store needed).
- **Verifying dedup (important):** the numeric order id is the de-facto-standard `event_id` the channel uses, so this is very likely already correct. But the channel's exact `event_id` is undocumented and its checkout pixel is **sandboxed** — Meta Pixel Helper and Test Events cannot read it (Pixel Helper shows "No Pixels found" on the Shopify order-status page; that is expected, not a fault). So verify by **effect, not by reading the id**: after deploy, place one test order and watch the Purchase in Events Manager. If the Purchase count roughly **doubles**, the browser/server events are not merging → the `event_id` does not match the channel's → change the `eventId` in `app/api/webhooks/shopify/orders/route.ts` and redeploy (one-line fix).
- **Webhook URL:** `https://hooks.conka.io/api/webhooks/shopify/orders` — a dedicated Vercel subdomain, because Shopify blocks webhook URLs that match the store's own domains (`www.conka.io`, `shop.conka.io`, etc.).
- **Renewals / scope:** `isWebCheckoutOrder()` only sends Purchase for orders that came through the hosted web checkout — gated on **`checkout_token` present**. Subscription rebills (Loop/Skio/native), POS, and API/manual orders are created without a checkout, so they have no `checkout_token` and are skipped. The first subscription order is a real checkout (has a token), so it is kept. `checkout_token` is **domain-independent** (works for the headless storefront — checkout is the same Shopify web checkout regardless of domain). We deliberately do NOT also require `source_name === "web"`, since headless Storefront-API orders can report a non-"web" source and would be wrongly dropped.
  - **History (2026-06-19):** this check originally used `client_details` (browser IP / user-agent), assuming rebills have none. **Loop copies the original order's `client_details` onto every renewal**, so paid rebills leaked through and were sent to Meta as new Purchases — Meta over-counted (~10 events vs 2 real orders/week) and ingested £0.00 rebill values. Switched to `checkout_token` (Loop can't fake it). Full write-up: `HEADLESS_ATTRIBUTION_FIX.md` → "2026-06-19 — Purchase over-counting".
  - **Temporary verification logging** is in place on the skip + send paths; remove it once Vercel logs confirm renewals are skipped and real orders sent.

## Implementation Details

- **Client:** `app/lib/metaPixel.ts` – generates `event_id`, calls `fbq('track', ..., { eventID })`, and sends the same event to `POST /api/meta/events` (CAPI) with `event_id` and `user_data` (`fbp`, `fbc`, `external_id`, plus `email` when a customer is logged in).
- **Server:** `app/api/meta/events/route.ts` – forwards to Meta Graph API with `event_id`, `user_data`, and `event_source_url` for deduplication. Hashes `email` into `em` and `external_id` (SHA-256, trim + lowercase, identical to `hashNormalized` in `metaCapi.ts` so the two ends match), and adds `client_ip_address` / `client_user_agent`. If `META_CAPI_ACCESS_TOKEN` or pixel ID is missing, the route returns 200 and does nothing so the client never fails.
- **Deduplication:** Same `event_id` is sent with the pixel and with CAPI so Meta can merge them.
- **`_fbp` generation:** `fbevents.js` loads async, so events used to fire before Meta wrote `_fbp` and shipped without it. `ensureFbp()` now writes one in Meta's own format (`fb.1.<timestamp>.<10-digit random>`) when absent, never overwriting an existing value, so the pixel adopts ours rather than issuing a competing id.

## Environment Variables

- **`NEXT_PUBLIC_META_PIXEL_ID`** – Meta Pixel ID (required for pixel and CAPI).
- **`META_CAPI_ACCESS_TOKEN`** – Server-only; used by the CAPI route and the order webhook. Without it, CAPI is skipped but the site still works.
- **`SHOPIFY_WEBHOOK_SECRET`** – Server-only; the signing secret shown in Shopify Admin → Settings → Notifications → Webhooks. Used to verify the `orders/paid` webhook HMAC. Without it the webhook returns 200 and sends nothing.
- **`META_TEST_EVENT_CODE`** – Optional, server-only. When set, the server-side Purchase is routed to the Events Manager **Test Events** tab for verification. Set it temporarily while testing, then unset it for production.

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
