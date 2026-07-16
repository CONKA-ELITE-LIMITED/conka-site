# Attribution Robustness — Meta CAPI + Triple Whale for headless Shopify

**Status:** Phase 1 scoped (active). Phases 2-4 future.
**Owner:** Rudh. **Branch:** `analytics-capi-resilience`.
**Related:** `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` (prior work), `docs/analytics/META_PIXEL_AND_CAPI.md`, `docs/analytics/TRIPLE_WHALE_INTEGRATION.md`.

## Problem

Prior work made the **Purchase** event resilient (server-side `orders/paid` webhook to Meta CAPI). The **upper funnel** (PageView, ViewContent, AddToCart) was never given the same resilience: it is still browser-pixel-only. When the Meta pixel is blocked, we send Meta nothing above Purchase.

Symptom seen in production: a Meta Purchase with no AddToCart, no InitiateCheckout, and no Triple Whale journey. Not a `/go` bug — the shared helper makes it site-wide; `/go` ad landings just expose it because that traffic is the most pixel-hostile.

### Root cause (grounded in code)
- `trackWithDedup` (`app/lib/metaPixel.ts`) early-returns the **whole function** — browser event AND CAPI send — when `isPixelAvailable()` is false. Powers AddToCart + ViewContent.
- `MetaPageViewTracker.tsx` independently gates PageView: it only calls `trackMetaPageView()` from inside `tryFire()`, which requires `window.fbq`. Pixel never loads → no PageView at all.
- `captureFbcFromUrl()` already runs independently of the pixel, so `_fbc` (ad-click id) is captured even when blocked. The identity is there; we just don't use it for upper-funnel server events.

### Why it matters (research-backed)
- Meta's **official** recommendation is a redundant Pixel + CAPI setup where CAPI is an **independent fallback**, not just a dedup mirror. ([Meta docs](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/))
- iOS/paid-social coverage loss is large: ~30-50% of iPhone conversions go unreported pixel-only; ATT opt-in ~25-35%; ad-blockers 25-40%; Safari ITP caps JS cookies at 7 days. Paid social is the hardest-hit channel. ([Cometly](https://www.cometly.com/post/conversion-tracking-ios-limitations), [Adjust](https://www.adjust.com/blog/att-opt-in-rates-2025/))
- Meta optimization needs ~50 conversions/adset in a rolling 7-day window to exit the learning phase; higher CAPI coverage directly increases countable events toward that. ([Pigeon Digital](https://www.pigeondigital.com/insight/facebook-ads-learning-phase-50-conversions-rule-2026))
- **Server-only events do not double-count** — dedup keys on `event_id` + `event_name` (48h window); with no browser twin there is nothing to merge. So the fix is safe. ([Meta docs](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/))

> **Framing (adversarial review, 2026-07-16):** Meta's stance is "send both browser + server for the same event with a shared `event_id`," not "fire server only as a fallback." Our change is compatible — we keep sending both when the pixel is present; we just stop *suppressing* the server event when it is absent. Do not deliberately suppress the browser event.

## Recommended direction

Research verdict for a small team already running an `orders/paid` CAPI webhook: **harden our own first-party CAPI** (source of truth) and add Shopify's **native Customer Events pixel** on the hosted checkout for browser-side checkout events + dedup. Skip Meta CAPI Gateway and Elevar (mirror-only / costly, no headless server-data advantage). ([Enalitica](https://enalitica.com/blog/meta-capi-gateway), [Polar](https://www.polaranalytics.com/post/meta-capi-for-shopify-setup-guide-and-why-it-beats-browser-pixels))

---

## Phase 1 — Decouple CAPI from pixel availability (ACTIVE, ticketed)

Make CAPI fire independently of the browser pixel for all events, so blocked traffic still reports the upper funnel.

**Changes**
1. `trackWithDedup` (`metaPixel.ts`): split the gate. Browser `fbq('track', ...)` stays gated on `isPixelAvailable()`. The `sendToCAPI(...)` call runs whenever `isProductionHost() && hasPixelId()`, regardless of pixel presence. Same `event_id` still generated once and shared, so dedup is intact when the pixel does fire.
2. `MetaPageViewTracker.tsx`: fire the CAPI PageView even when `window.fbq` never appears. Keep polling for `fbq` for the browser twin, but do not withhold the server event on the 5s timeout.
3. EMQ hardening (low cost, high leverage): attach hashed email as `em`/`external_id` on client CAPI events when a logged-in customer is known (`AuthContext`). Email is the single strongest match key. ([CustomerLabs](https://www.customerlabs.com/blog/improve-your-event-match-quality-from-ok-to-great/))

**Non-goals:** no change to the Purchase webhook, no new vendor, no checkout-side work.

**Verification (how we prove it)**
- Meta **Test Events** with the pixel blocked (DevTools block `connect.facebook.net`, or an in-app browser): confirm AddToCart / ViewContent / PageView still arrive, tagged server. ([Meta Test Events](https://en-gb.facebook.com/business/help/1624255387706033))
- With the pixel unblocked: confirm each action still shows as **one** deduplicated event, not two.
- After a few days live: Events Manager shows upper-funnel event volume and server coverage up; **EMQ holds ≥7** on Purchase/AddToCart. Regression signal = dedup ratio or EMQ drop.

**Risk:** low. Server-only cannot double-count; change is a few lines and reversible.

---

## Phase 2 — Shopify native Customer Events pixel on checkout (FUTURE)

The hosted checkout (`shop.conka.io`) is Shopify-sandboxed; we cannot inject JS or read our `_fbp`/`_fbc` cookies there. Shopify's native **Customer Events / web pixel** is the only sanctioned browser-side tracking on checkout and is free. Adds browser-side InitiateCheckout / AddPaymentInfo / Purchase with hashed data + dedup against our server events. ([Polar](https://www.polaranalytics.com/post/meta-capi-for-shopify-setup-guide-and-why-it-beats-browser-pixels), [Simo Ahava](https://www.simoahava.com/analytics/cookie-access-with-shopify-checkout-sgtm/))

Note: cookies scoped to `.conka.io` DO reach `shop.conka.io`, but the sandbox blocks reading them — so identity must keep travelling via **cart/note_attributes** (already implemented), not cookie reads at checkout.

## Phase 3 — Triple Whale server-side signal + subscription hygiene (FUTURE)

Triple Whale gets only a client-side (deferred) AddToCart from us and no server signal; its Shopify sync records orders but journeys go empty when the pixel is blocked. Also mis-buckets Loop rebills.

- **No server-side purchase/ATC feed exists (adversarial review REFUTED this).** Triple Whale's Data-In API ingests Orders/Products/Subscriptions/Customers and *lead-style* offline events only; it is **not** a channel to supplement the client Triple Pixel with funnel Purchase/ATC. Do not architect this phase around a server feed. ([TW Data-In use cases](https://triplewhale.readme.io/reference/data-in-api-use-cases))
- **Realistic TW fix is client-side reliability, not a server feed:** the attribution backbone is the Triple Pixel, so the lever is making it load reliably (it is currently deferred behind first-interaction/4s in `DelayedAnalytics.tsx` and silently no-ops if `window.TriplePixel` is not ready). Options: load it earlier, or fire ATC/Purchase through TW's queued API so events aren't dropped pre-load. TW's Shopify/Orders sync remains the revenue source of truth. ([TW headless install](https://kb.triplewhale.com/en/articles/6266255-adding-the-triple-pixel-to-a-headless-store-or-custom-website))
- **Subscription split:** tag Shopify/Loop orders first-vs-recurring so TW's pixel table and Meta both exclude rebills from acquisition. TW `is_new_customer` matches on customer_id/email/phone. ([TW is_new_customer](https://triplewhale.readme.io/docs/is-new-customer), [TW subscription tags](https://kb.triplewhale.com/en/articles/8207872-can-i-track-subscription-order-tags))
- **Meta rebill routing:** send Loop renewals to Meta as a **separate CAPI custom event** (e.g. `recurring_purchase`) instead of dropping them, and optimise acquisition campaigns on the first-order/new-customer signal only. (Our webhook currently skips rebills via `checkout_token` — good enough for "don't count as acquisition"; this phase is the richer version.) ([Converge](https://www.runconverge.com/connections/loop-meta))

## Phase 4 — Monitoring (FUTURE)

Periodic check (extend `/review-analytics`): EMQ trend per event, server-event coverage, dedup ratio. Alert on a sudden EMQ or dedup-rate drop (signals mismatched IDs or lost match keys).

---

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| SCRUM-1153 | [Analytics & Data] Decouple Meta CAPI from browser-pixel availability | Phase 1 | To Do |

## Decision log
- **2026-07-16** — Scoped after finding the pixel-gating flaw during a Triple Whale attribution investigation. Chose "harden own CAPI + Shopify native checkout pixel" over Gateway/Elevar. Phase 1 ticketed; 2-4 documented only.
