# Headless Shopify + Meta Attribution — Diagnosis & Fix

**Status:** Diagnosis complete (2026-05-29). **Phases 1 + 2 done** (config). Phases 3 + 4 (code) pending.

## Progress log
- **2026-05-29 — Phase 1 done.** Added `shop` CNAME → `shops.myshopify.com` in **Vercel DNS** (conka.io's DNS is hosted by Vercel, not GoDaddy — registrar is GoDaddy but nameservers are Vercel). Set `shop.conka.io` as the **primary domain** in Shopify, so checkout now serves from `shop.conka.io`. Cookie split resolved.
  - *Gotcha:* a first attempt 404'd (`DEPLOYMENT_NOT_FOUND`) because the tester's network (Tailscale → upstream resolver) had a stale cached answer pointing `shop.conka.io` at Vercel's edge. Authoritative DNS (Google/Cloudflare) was already correct → Shopify. Verify from a clean network (phone on cellular), not a Tailscale/VPN path.
- **2026-05-29 — Phase 2 done.** A redirect script already existed in the theme's `layout/theme.liquid` but was broken two ways: (1) it only fired when `hostname.includes('myshopify.com')` — false now that the primary is `shop.conka.io`, so it never ran; (2) a stray `}` made it a syntax error. Replaced with a wrap-safe array-based version that bounces all storefront pages to `www.conka.io` while keeping `/a/` (Loop portal), `/apps/`, `/account`, `/policies/`, `/checkout`, and Shopify internals on Shopify. The store uses **classic customer accounts** (theme renders `customers` templates with a "← Back to CONKA" header), so `/account` must stay on Shopify.
**Owner context:** Meta ads were spending without learning. This doc captures what was actually wrong, why, and the fix plan. Read this before touching anything in the Meta / Shopify / pixel stack.

---

## TL;DR

The pixel wiring is **correct** — there is one unified pixel (`1138202151698404`) and ads, site, and CAPI all point at it. The problem is **not** a misconfigured or mismatched pixel.

The problem is that **checkout runs on a different domain from the storefront**, which breaks the Meta cookies (`_fbp` / `_fbc`) that connect an ad click to the eventual purchase. Meta receives the Purchase events but can't attribute them to the ad that drove them, so the optimisation algorithm can't learn, and spend is wasted.

The fix is to **(1)** put checkout on a `conka.io` subdomain so the cookies are shared, **(2)** neutralise the legacy theme, and **(3)** add a first-party server-side Purchase event with proper identity matching.

---

## How the system is wired

| Layer | Domain / location | Role |
|-------|-------------------|------|
| Storefront (headless) | `www.conka.io` (Vercel) | Next.js app. Fires PageView, ViewContent, AddToCart, InitiateCheckout (pixel + our CAPI route). |
| Checkout | `conka-6770.myshopify.com` (Shopify primary domain) | Shopify-hosted checkout. Fires checkout events incl. **Purchase** via the Facebook & Instagram sales channel. |
| Pixel / dataset | Meta dataset **"CONKA Web Traffic" = `1138202151698404`** | Single pixel. Integrations: Conversions API + Meta Pixel. Ads optimise toward it for Purchase. |

Frontend pixel ID is set in `NEXT_PUBLIC_META_PIXEL_ID` (`.env.local` and Vercel prod): `1138202151698404`.

### What we verified during diagnosis
- Website fires to pixel `1138202151698404` (env, prod, and pixel init in `app/layout.tsx`).
- Meta dataset "CONKA Web Traffic" **is** `1138202151698404`, receiving events, both browser + server integrations connected.
- Live ad campaigns optimise toward "CONKA Web Traffic" (`1138202151698404`), event = **Purchase**.
- The empty dataset **`1430628298839184` "CONKA Dashboard" (0 events, no integrations) is a stray decoy** — not used by anything. Ignore it.

**Conclusion: one pixel, correctly connected everywhere. No mismatch.**

---

## Root cause: the checkout-domain cookie split

Meta attributes conversions using two first-party cookies:
- **`_fbp`** — a browser/session ID the pixel sets on first visit.
- **`_fbc`** — derived from the `fbclid` URL parameter on an ad click. **This is the ad-click identifier; attribution depends on it.**

Both are scoped to a domain. Today:

```
Ad click → www.conka.io        sets _fbp + _fbc on  .conka.io
Browse / AddToCart             pixel + CAPI fire on .conka.io  ✅ has _fbp/_fbc
Click "Checkout"  →  conka-6770.myshopify.com   ← DIFFERENT registrable domain
Purchase (Shopify FB channel)  fires on .myshopify.com         ❌ NO _fbc, mismatched _fbp
```

So the Purchase event reaches Meta **without the ad-click identifier**. Meta can't connect "this purchase" to "that ad click," so:
- Attribution under-reports (Shopify/Triple Whale show sales Meta doesn't claim).
- The optimisation algorithm gets little/no Purchase signal it can act on → it can't find more buyers → CPAs rise and spend is wasted.

This is the classic headless-Shopify attribution break. It is a **domain/cookie** problem, not a pixel problem.

### Contributing factors
- **No `fbclid` → `_fbc` capture or propagation.** The ad-click ID is dropped on landing and never carried into the cart/order, so even server-side matching has only email/phone to work with (good for identity, weak for *ad attribution*).
- **No first-party server-side Purchase webhook.** Only the Shopify Facebook channel fires Purchase. We have no backend Purchase event we control (the only webhook today is `app/api/webhooks/revolut`).
- **Possible event duplication.** Frontend `InitiateCheckout` + the channel's `checkout_started` can both reach the pixel with no shared `event_id`, adding noise.

### What about Checkout Extensibility?
You **cannot** paste arbitrary tracking `<script>` into Shopify checkout anymore (`checkout.liquid` is deprecated). The only sanctioned ways to track on checkout are: (a) **Customer Events / web pixels**, (b) the **Facebook & Instagram channel** (already installed), and (c) **server-side order webhook → CAPI** (the robust path we'll add). Fixing the domain is what makes (a)/(b) attributable; (c) is the belt-and-suspenders.

---

## The fix plan

### Phase 1 — Move checkout to `shop.conka.io` (config; highest leverage)
DNS at **GoDaddy**, domain settings in **Shopify**. Once checkout shares the `conka.io` parent domain with the storefront, `_fbp`/`_fbc` are shared and Meta can stitch ad → browse → purchase. See the step-by-step in the runbook section below.

### Phase 2 — Neutralise the legacy theme (config)
Convert the published theme to a **redirect-to-`www.conka.io`** theme. This also fixes the checkout logo, which currently links back to the old Shopify storefront instead of the headless site. The theme is **not** load-bearing for checkout; it's a legacy leftover and a potential home for a rogue duplicate pixel.

### Phase 3 — First-party Purchase via order webhook → CAPI (code)
Add `app/api/webhooks/shopify/orders` subscribed to `orders/create` (or `orders/paid`):
- Send **Purchase** to Meta CAPI for pixel `1138202151698404`.
- Use the **Shopify order ID as `event_id`** so it deduplicates against the channel's Purchase.
- Include hashed email/phone + `fbp`/`fbc` (from order attributes) as `user_data` for matching.
- Filter renewals (Loop subscription rebills) so recurring charges aren't counted as new acquisitions.

Model it on the existing CAPI route `app/api/meta/events/route.ts`.

### Phase 4 — Capture & propagate ad-click identity (code)
- On landing, read `fbclid` from the URL and build `_fbc`.
- Attach `_fbp`/`_fbc` as **cart attributes** (the attributes path already exists in `app/api/cart/route.ts`) so they reach the order and feed Phase 3's matching.

### Phase 5 — Verify
- Meta Events Manager → **Test Events** for a full purchase.
- Run the `/review-analytics` skill.
- Confirm: Purchase arrives, dedup works (no doubled events), Event Match Quality improves.

---

## Phase 1 runbook — checkout on `shop.conka.io`

> Outward-facing, somewhat hard to reverse. Do it in a quiet window and test in a private browser afterwards.

1. **GoDaddy:** add a DNS record
   - Type: **CNAME**
   - Name/Host: `shop`
   - Value/Points to: `shops.myshopify.com`
   - TTL: default. (Propagation: minutes to ~1 hour.)
2. **Shopify Admin → Settings → Domains:** `shop.conka.io` is already listed (was "Invalid DNS"). Click **Verify/Refresh** until it shows **Connected**.
3. Set **`shop.conka.io` as the primary domain.** Checkout follows the primary domain, so `cart.checkoutUrl` will then return `shop.conka.io/...`.
   - *Shopify Plus note:* there is a dedicated checkout-domain setting; you can point checkout at `shop.conka.io` without changing the primary domain.
4. **Safe for the headless storefront:** `www.conka.io` points to Vercel, so Shopify's domain redirects never touch storefront traffic.
5. **Verify:** add to cart on `www.conka.io`, click Checkout → URL should be `shop.conka.io`. In DevTools → Application → Cookies, confirm `_fbp` is now visible on both `www.conka.io` and `shop.conka.io`.

## Phase 2 runbook — redirect theme

> Online Store → Themes. **Duplicate the live theme first** as a backup before editing.

1. Online Store → Themes → **••• → Duplicate** (backup).
2. Edit the **published** theme → **Edit code** → `layout/theme.liquid`.
3. Immediately after the opening `<head>`, add a redirect to the headless site. (`theme.liquid` loads only on online-store pages — home, products, collections, cart — **not** on checkout/order-status, so this never interferes with checkout.)
   ```liquid
   <script>
     (function () {
       // Headless: bounce all Shopify online-store pages to the real storefront.
       location.replace("https://www.conka.io" + location.pathname + location.search);
     })();
   </script>
   ```
4. **Test:** visit `https://shop.conka.io` → should bounce to `www.conka.io`. Then complete a full test checkout and confirm it still works end-to-end, and that the checkout **logo** now lands you on the headless site.
5. *Watch-out:* if classic customer-account pages are theme-rendered, confirm `/account` links still resolve sensibly (the headless site has its own `/account`).

---

## Quick reference
- Frontend pixel/CAPI: `app/lib/metaPixel.ts`, `app/api/meta/events/route.ts`, `app/components/MetaPageViewTracker.tsx`
- Checkout handoff: `app/components/CartDrawer.tsx` (`cart.checkoutUrl`), `app/lib/funnelCheckout.ts`
- Cart attributes (for Phase 4): `app/api/cart/route.ts`
- Pixel ID: `NEXT_PUBLIC_META_PIXEL_ID = 1138202151698404`
- Ad account: `act=1410444020671113` · Dataset: "CONKA Web Traffic" = `1138202151698404`
- Decoy to ignore: dataset `1430628298839184` "CONKA Dashboard" (0 events)
