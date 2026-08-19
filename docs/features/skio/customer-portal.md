# Skio Customer Portal (embedded iframe)

How the Skio hosted customer portal is embedded in the headless storefront at **`/account/manage`**, auto-logged-in via a server-signed magic link. Built in Phase 3 (SCRUM-1221); auto-login **verified end-to-end 2026-08-19** on the skio-integration preview (a logged-in customer lands on their subscription, no Skio email-login screen), after the endpoint was corrected to `/a/account/shopify-login` in SCRUM-1227.

## Approach

Skio's Customer Portal v3 (cpv3) is designed to be embedded cross-domain in headless setups. We render it in a full-bleed iframe; the portal handles all subscription management (skip / swap / pause / cancel / address / payment) inside the iframe, themed in the Skio dashboard (our CSS cannot reach in).

## Auth flow (why there are two logins, and why the customer only sees one)

1. Customer signs into conka.io once via our **Shopify Customer Account API** OAuth (`/account/login`). This is the identity source.
2. `/account/manage` calls `GET /api/auth/skio-portal`, which reads the authenticated customer, parses the **numeric** id out of the Shopify GID, computes `hash = md5(numericId + SKIO_STORE_ID_HASH)` server-side, and returns the iframe `src`.
3. The iframe loads Skio's portal already logged in via that hash, so the customer **never sees Skio's own email-code login**.

Removing our login is not possible: it is the SSO that powers the seamless Skio auto-login. `SKIO_STORE_ID_HASH` stays server-side (exposing it would let anyone forge a login for any customer).

## Signed src route

`app/api/auth/skio-portal/route.ts` (Node runtime, for `crypto.md5`):
- Returns `500` if `SKIO_STORE_ID_HASH` / shop id are unconfigured; `401` if not authenticated / no customer; `502` on a transient Customer Account API failure; `400` if the id is non-numeric.
- Builds `https://cpv3.skio.com/a/account/shopify-login?hostname=&shop=&email=&id=&totalSpent=&hash=`.
- **Endpoint = `/a/account/shopify-login`** (the auto-login flow). NOT `/a/account/login`, which is Skio's standard passwordless email login and renders the "email login / Email does not exist" screen (SCRUM-1227). Host stays `cpv3.skio.com` (Customer Portal v3; `storefront-iframe.skio.com` is v2).
- **`hostname` = `shop.conka.io`** (see gotcha below). `shop` = `conka-6770.myshopify.com`. `totalSpent = 0`: display-only in the portal, not part of the hash. Skio asked for the real value, but the Customer Account API has no lifetime-spend field (`amountSpent` is Admin-only), so we send `0`.

## Frontend

- `app/account/manage/page.tsx` (metadata, noindex) renders `SkioPortalFrame.tsx` (client): fetches the signed src, handles loading / signed-out (redirect to `/account/login`) / error, and renders a **full-bleed** iframe (`h-100dvh`, header on top, iframe fills the rest edge-to-edge and scrolls internally).
- `/account` **redirects to `/account/manage`** when the flag is on (`app/account/page.tsx`), and the header account icon links there too (`NavigationDesktop`/`NavigationMobile`), so the portal is the single account surface. When the flag is off, `/account` keeps the Loop list unchanged.
- CSP: `next.config.ts` adds `Content-Security-Policy: frame-src 'self' https://cpv3.skio.com` scoped to `/account/manage` only.

## Dashboard config (one-time)

- **Publish the portal.** In `dashboard.skio.com/portal-settings`, customize + click **Publish**. An unpublished (Draft) portal renders the shell but hangs on content.
- **Theme** to CONKA: Brand/buttons/links -> navy `#1B2757`, Background -> white, Success -> green `#1A7F4F`. Splash/banner image must be PNG/JPG/SVG/GIF (not WebP); hard-refresh after saving (branding caches).

## Gotchas (all hit + resolved during the Phase 3 spike)

- **`hostname` must be `shop.conka.io`.** Skio's portal calls `get-site-by-domain-or-hostname` to resolve the store; it **400s** on both a Vercel preview URL and the myshopify domain, and only resolves on the Shopify **primary domain** `shop.conka.io`. The route defaults to that; override with `SKIO_PORTAL_HOSTNAME`.
- **`DEV_MOCK_AUTH` cannot drive the portal** (its id is non-numeric, and there is no `customer_access_token`). Test on a preview or prod with a real login.
- **Preview login needs setup:** the preview's `/api/auth/callback` must be registered as a Callback URI in the Headless channel's Customer Account API application setup, and `SHOPIFY_REDIRECT_URI` (Preview scope only) pins the redirect to the branch-alias callback so it survives Vercel's per-deploy hosts (`app/lib/customerAuthRedirect.ts`, honored by `authorize`/`callback`).
- **The customer must exist in Skio** (have a subscription) for the portal to show anything; auto-login into a non-existent Skio customer falls back to Skio's login form.
