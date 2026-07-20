# On-site email capture -> Meta CAPI enrichment (Alia)

Ticket: SCRUM-1169. Builds on SCRUM-1158 (upper-funnel identity).

## What this does

The Alia email-capture popup (loaded in `app/components/DelayedAnalytics.tsx`) lets a
logged-out ad visitor hand us an email and phone before checkout. We capture those
client-side and attach them to that visitor's Meta CAPI events, so AddToCart and
InitiateCheckout carry real match keys (`em`, `ph`) instead of only IP/UA. Because
`conka_uid` (external_id) already bridges anonymous events to the Purchase, Meta
retroactively upgrades the visitor's earlier events once the email lands.

Match quality only rises for the subset who sign up. Visitors who never submit the
popup are unaffected: the fields are simply absent.

## The flow

1. Visitor submits the Alia popup. Alia's web SDK fires a document CustomEvent:
   `alia:signup` with `detail.email` / `detail.phone`
   (`{ type, popupID, email?, phone?, campaignID, campaignTitle }`).
2. `app/components/AliaIdentityBridge.tsx` (mounted in `app/layout.tsx`) listens and
   calls `setCapturedIdentity(email, phone)` in `app/lib/metaPixel.ts`.
3. `setCapturedIdentity` validates and persists them to `.conka.io` cookies
   (`conka_em`, `conka_ph`) and mirrors the email into the in-memory `userEmail`.
4. Every later `trackWithDedup` event reads them (in-memory email first, else the
   cookie) and posts them to `/api/meta/events`.
5. `app/api/meta/events/route.ts` hashes email (`hashNormalized`) and phone
   (`hashPhone`, digits-only) with SHA-256 and sends `em` / `ph`. Raw values never
   reach the browser pixel.

## Design notes

- **Precedence:** a logged-in customer's email (`setMetaUserData`, from AuthContext)
  wins; the captured cookie is the fallback. Both hash to `em` identically.
- **Cookie decode:** `writeCookie` percent-encodes, so an email's `@` is stored as
  `%40`. `readCapturedCookie` decodes on read so the server hashes the real address.
- **Hashing parity:** the route's `hashPhone` mirrors `app/lib/metaCapi.ts` (the
  Purchase webhook) so upper-funnel `ph` and Purchase `ph` match.
- **Host gate unchanged:** events still fire only on `www.conka.io`.

## Known limitations

- Helps only the same browser going forward. Alia exposes no stored email, and ITP
  caps our `.conka.io` cookies at 7 days, same as `_fbp` / `_fbc` / `conka_uid`. A
  returning subscriber who cleared cookies or is past the cap is not re-identified.
- Expected EMQ lift is on the signed-up subset, not all cold traffic.

## Klaviyo / abandoned cart (Phase 2 finding)

No code was added for Klaviyo, and none is needed today:

- **Profile creation** already happens: Alia syncs signups to Klaviyo via its native
  OAuth integration (no Klaviyo code in this repo for it).
- **Client-side Klaviyo is disabled.** `klaviyo.js` / `_learnq` onsite is commented
  out in `app/layout.tsx` (all signup forms set to draft, 2026-05-26), so there is no
  client `klaviyo.identify()` to call on `alia:signup`. Only the server-side subscribe
  paths (`/api/klaviyo/subscribe`, cognitive-test tracking) remain.
- **Abandoned cart** is driven by Klaviyo's Shopify integration capturing "Started
  Checkout" on the hosted checkout (`shop.conka.io`), independent of Alia.

To power browse/cart-abandon flows earlier from an Alia signup, `klaviyo.js` would
need re-enabling first (a marketing decision). If that happens, add a
`klaviyo.identify({ email })` call inside the `alia:signup` handler.
