# Headless Shopify + Meta Attribution — Diagnosis & Fix

**Status:** Diagnosis complete (2026-05-29). **Phases 1 + 2 done** (domain + theme). Now verifying attribution in Meta + completing the headless-specific setup Shopify normally does for you. Phases 3 + 4 (code) pending.

## Progress log
- **2026-05-29 — Phase 1 done.** Added `shop` CNAME → `shops.myshopify.com` in **Vercel DNS** (conka.io's DNS is hosted by Vercel, not GoDaddy — registrar is GoDaddy but nameservers are Vercel). Set `shop.conka.io` as the **primary domain** in Shopify, so checkout now serves from `shop.conka.io`. Cookie split resolved.
  - *Gotcha:* a first attempt 404'd (`DEPLOYMENT_NOT_FOUND`) because the tester's network (Tailscale → upstream resolver) had a stale cached answer pointing `shop.conka.io` at Vercel's edge. Authoritative DNS (Google/Cloudflare) was already correct → Shopify. Verify from a clean network (phone on cellular), not a Tailscale/VPN path.
- **2026-05-29 — Phase 2 done.** A redirect script already existed in the theme's `layout/theme.liquid` but was broken two ways: (1) it only fired when `hostname.includes('myshopify.com')` — false now that the primary is `shop.conka.io`, so it never ran; (2) a stray `}` made it a syntax error. Replaced with a wrap-safe array-based version that bounces all storefront pages to `www.conka.io` while keeping `/a/` (Loop portal), `/apps/`, `/account`, `/policies/`, `/checkout`, and Shopify internals on Shopify. The store uses **classic customer accounts** (theme renders `customers` templates with a "← Back to CONKA" header), so `/account` must stay on Shopify.
- **2026-06-01 — Meta config pass complete; root cause isolated to code.** Worked through the Events Manager / Ads Manager checks (section "Action checklist" below). Outcome: the entire Meta *configuration* layer is now ruled out. **(A1)** The apex domain `conka.io` was NOT verified (only the legacy `conka-6770.myshopify.com` was) — verified it via a DNS TXT record in Vercel; cascades to `www.` + `shop.`. **(A2)** AEM is auto-managed post-verification and was not flagged. **(A5)** Ads point at the correct single pixel `1138202151698404` with a 7-day-click window; Purchase ROAS reads "—" everywhere (zero attributed sales = the symptom). The stray `Conka's pixel` `964605425225904` is a dead/empty legacy pixel, not a second split. **Meta's own "9 actions" panel independently confirmed the cause: the server sends low `fbc` coverage through CAPI, 50% of Purchase price data is malformed, and Pixel↔CAPI dedup is weak.** Also found Vercel preview deploys (`*.vercel.app`) firing the prod pixel and polluting data quality. **Net: the remaining fix is code — Phases B1 (server Purchase webhook → CAPI) + B2 (capture/propagate `fbclid`/`_fbc`) + new B3 (gate pixel to prod host).**
- **2026-06-19 — Purchase OVER-counting found + fixed (rebills leaking).** Marketing flagged Meta reporting far more purchases than real (e.g. ~10 events in a week vs 2 genuine new orders). Traced to the `orders/paid` webhook: its rebill filter used `client_details`, but **Loop copies the original checkout's `client_details` onto every renewal**, so paid subscription rebills passed the check and were sent to Meta as brand-new Purchases (also explains the "50% malformed Purchase price" flag — the £0.00 rebills). Confirmed via Vercel logs: webhook live, receiving paid orders, **zero "Skipping" logs** despite ~25 rebills that week. **Fix:** `isWebCheckoutOrder` now gates on `checkout_token` + `source_name === "web"` (the reliable "a human just checked out" signal Loop can't fake) instead of `client_details`. Temporary verification logging added to both the skip and send paths. See the dedicated section at the bottom of this doc.
**Owner context:** Meta ads were spending without learning. This doc captures what was actually wrong, why, and the fix plan. Read this before touching anything in the Meta / Shopify / pixel stack.

---

## Action checklist (post-domain-fix) — work through top to bottom

The domain fix (Phases 1 + 2) was the prerequisite. These are the remaining things a native Shopify storefront does for you automatically that we now own manually. Ordered by leverage. **Tick each as we confirm it.**

### A. Meta setup checks (config — do these in the browser, no code)
- [x] **A1. Domain verification** — `conka.io` verified in Business Settings → Brand Safety → Domains. *(Covers `www.` + `shop.` — registrable-domain level.)* ✅ 2026-06-01
- [x] **A2. Aggregated Event Measurement (AEM)** — auto-managed once `conka.io` verified; not flagged by Meta. Recheck in 24h once domain events flow. ✅ 2026-06-01
- [ ] **A3. Test Events** — run one real end-to-end purchase; confirm Purchase arrives with good Event Match Quality and `fbc`/`fbp`/email present.
- [ ] **A4. Deduplication** — browser + server Purchase events dedupe (shared `event_id`); no doubled Purchases.
- [x] **A5. Ad Manager sanity** — campaign optimises for `Purchase` against `1138202151698404`; attribution window confirmed (7-day click / 1-day view). ✅ 2026-06-01 (clean)
- [ ] **A6. Source check** — confirm the weekend orders actually came from ad clicks (UTMs / Triple Whale), not organic/direct. If organic, "no attribution" is correct, not a bug.

### B. Headless code work still pending (Phases 3 + 4 below)
> Ticketed 2026-06-01 under the `meta-tracking-hardening.md` plan. Build push = SCRUM-1043 (Phase 1 hygiene) + B1 + B2 + B3, one branch off `main`.
- [ ] **B1. Server-side order webhook → CAPI** (Phase 3a) — robust, iOS-proof Purchase. Replaces what Shopify's channel does server-side. **→ SCRUM-1046**
- [ ] **B2. Capture + propagate `fbclid`/`_fbc`** (Phase 3b) — feeds B1's matching. **→ SCRUM-1047**
- [ ] **B3. Gate pixel + CAPI to production host only** — Vercel preview/branch deploys (`*.vercel.app`) currently fire the prod pixel `1138202151698404`, polluting the dataset and dragging down data quality. Only fire Meta pixel/CAPI when host is `www.conka.io` (prod). *(Found 2026-06-01 via Events Manager → Actions → "Confirm domains that belong to you": `conka-shopify-git-cant-change-frequency-conka.vercel.app`, `conka-shopify-irg8tbf1-conka.vercel.app`. Do NOT allowlist these in Meta.)* **→ SCRUM-1048**

### C. Verify
- [ ] **C1.** Full purchase shows attributed in Ads Manager after fix has been live a few days.

> **Findings log** (fill in as we go):
> - A1: **PROBLEM FOUND (2026-06-01).** Apex `conka.io` is NOT verified and not even listed. Domains list only contains `conka-6770.myshopify.com` (the legacy/redirect domain — appears multiple times, one verified, rest junk duplicates) and `shop.conka.io`. Events fire from `www.conka.io` + `shop.conka.io`, so nothing relevant is verified. **Action: add + verify apex `conka.io` via DNS TXT in Vercel DNS (cascades to www + shop). Then clean up duplicate myshopify entries.** ✅ **DONE 2026-06-01** — added TXT `facebook-domain-verification=8wexm78q225osczne6g2sarlh984j8` in Vercel DNS (apex), confirmed live on 8.8.8.8 + 1.1.1.1, `conka.io` now shows Verified. (Duplicate `conka-6770.myshopify.com` entries still in list — low-priority cleanup later.)
> - A2: **AUTO-HANDLED (2026-06-01), recheck in 24h.** AEM web-event config is not exposed in the dataset Settings (current Meta UI auto-manages it once the domain is verified) and Meta's actions list did NOT flag AEM/domain — so default events incl. Purchase are enrolled. Dataset Settings → Conversions API panel confirms direct CAPI integration is set up with a Dataset Quality API token (the existing `app/api/meta/events/route.ts` token can be reused for B1's server webhook — no new Meta setup needed). Events Manager shows **"£1,093 ad spend affected by low data quality"** on the CONKA Web Traffic dataset, plus a **"Top actions to improve quality score — View all actions (9)"** panel (Meta's own prioritised fix list — using it to drive A2–A4). **NEW finding (RESOLVED 2026-06-01):** a third dataset **`Conka's pixel` = `964605425225904`** exists alongside CONKA Web Traffic (`1138202151698404`) and the known decoy CONKA Dashboard (`1430628298839184`). Checked its Overview: **No integrations, no websites, no catalogs, no activity in 300 days.** It's a dead legacy pixel — NOT a second split. Treat like the decoy and ignore. (Will still confirm no campaign names it as its conversion dataset during A5.)
> - A3: _pending (Test Events) — defer until B1/B2 code is in._
> - A4: _confirmed as a gap (2026-06-01)._ Meta Actions list: "64.1% lower cost per result by improving Pixel→CAPI coverage for InitiateCheckout" + "improve deduplication keys for pixel/CAPI" → browser+server events not pairing/deduping well. Fix lands with B1/B2.
>
> **Meta's own "9 actions" diagnosis (Events Manager → Actions, 2026-06-01) — strongly validates the code phases:**
> - 🔴 **Low `fbc` coverage through CAPI** (server not sending the ad-click ID). Meta: similar advertisers sending `fbc` saw ~+100% reported conversions. → **This is the core attribution gap. = B2 (Phase 4).**
> - 🔴 **50% of Purchase price data has formatting issues / missing values** → hurts ROAS calc (~7% ROAS upside). NEW. Purchase events ARE arriving but half have malformed value/currency. Check source (Shopify FB channel vs our events) + fix in B1.
> - 🟠 **Pixel↔CAPI coverage/dedup low** for InitiateCheckout + ViewContent → ~64% lower CPA at 75% coverage. = A4 / B1.
> - ⚪ AEM / "verify domain" NOT flagged → A1 likely auto-configured default events incl. Purchase (good). A2 = quick confirm only.
> - ⚪ "Connect business-chat activity" — not relevant (no click-to-message ads), ignore.
> - A5: **CONFIRMED CLEAN (2026-06-01).** Ad sets use **7-day click / 1-day view** (default — not a too-narrow window). Ad-level Tracking points at the correct dataset **CONKA Web Traffic `1138202151698404`** (not the dead pixel, not the decoy). Bid: Highest volume → Conversions/Purchase. **Purchase ROAS column = "—" on all rows = zero attributed purchases** (the symptom). Edits dated ~May 29 (post domain-fix). Ad URL params are Triple Whale only (`tw_source`/`tw_adid`); Meta auto-appends `fbclid` to click URLs, so B2 can read it from the landing URL with no ad change.
> - A6: _pending — cross-check weekend orders vs ad clicks (Triple Whale / UTMs) to confirm they weren't organic._
>
> **Milestone (2026-06-01):** Entire Meta *config* layer ruled out as the cause — domain verified (A1), correct single pixel (A5), attribution window fine (A5), no rogue pixels (3rd-pixel dead). Root cause = **server-side `fbc`/CAPI gap → code Phases B1 + B2.**

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

---

## 2026-06-19 — Purchase over-counting (subscription rebills leaking) — FIXED

**Symptom.** Meta reported far more purchases than actually happened — ~10 Purchase events in a week against **2 genuine new orders** (Events Manager Purchase count even exceeded Initiate Checkout, which is structurally impossible for real on-site buyers). Purchase integration showed **Conversions API only**, so the source was server-side, not the browser pixel.

**Root cause.** `app/api/webhooks/shopify/orders/route.ts` sends a CAPI Purchase for each `orders/paid`, and filtered out rebills with `isWebCheckoutOrder()` — which checked for `client_details` (browser IP / user-agent), on the assumption that subscription rebills are created server-side and have none. **That assumption is false for Loop: Loop copies the original order's `client_details` onto every renewal.** So each *paid* monthly renewal passed the filter and was sent to Meta as a brand-new Purchase. The £0.00 renewal orders being sent this way are also the source of the earlier "50% of Purchase price data malformed" flag. (£0.00 rebills that don't capture payment don't fire `orders/paid`, which is why it was ~10 and not all ~25 rebills.)

**Evidence (Vercel runtime logs, `conka-shopify`, prod).** Webhook live and returning 200s on `hooks.conka.io`; **zero `"[Shopify webhook] Skipping non-checkout order"` logs across 7 days** despite ~25 rebill orders → nothing was being filtered; every paid order (incl. renewals) was forwarded.

**Fix.** `isWebCheckoutOrder()` now gates on **`checkout_token` present AND `source_name === "web"`** — a genuine hosted-checkout completion (incl. a customer's *first* subscription order) has a `checkout_token`; API-created rebills/POS/manual orders do not, and Loop cannot fake it. Added `checkout_token` + `source_name` to the `ShopifyOrder` interface. Added **temporary verification logging** on both the skip path (logs `sourceName`, `hasCheckoutToken`) and the send path (logs `orderId`, `sourceName`, `value`).

**Verification (do this, then remove the temp logging).**
1. After deploy, watch Vercel logs (`conka-shopify`, prod, filter `[Shopify webhook]`) over the next day: real web orders should log **"Sending Purchase"**, monthly renewals should log **"Skipping non-checkout order"** with `hasCheckoutToken: false`.
2. In Events Manager, confirm the Purchase event count falls to roughly match real new orders.
3. Once confirmed, delete the two `TEMP verification logging` blocks in the webhook route.

**Watch-out.** This fix assumes Loop rebills have no `checkout_token`. That's the expected Shopify behaviour (no checkout occurred), but the first day of logs is what *proves* it — don't remove the temp logging until step 1 confirms a real renewal was skipped.
