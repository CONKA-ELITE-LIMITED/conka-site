Analytics verification for /review (Step 3 -- loaded only when the diff touches cart, checkout, tracking, or a new conversion surface).

Attribution accuracy directly affects ad spend efficiency. A silent analytics failure can waste thousands in Meta ad spend through broken CAPI deduplication or missing conversion signals. All four systems fail silently by design; code review is the only way to catch it.

**Read the relevant analytics source files before checking:**
- `app/lib/analytics.ts` -- Vercel Analytics typed helpers
- `app/lib/metaPixel.ts` -- Meta Pixel and CAPI client helpers
- `app/lib/tripleWhale.ts` -- Triple Whale helpers
- `app/api/meta/events/route.ts` -- CAPI server route
- `app/context/CartContext.tsx` -- where cart mutation events fire
- `app/layout.tsx` -- script load order (only if the change adds routes or scripts)

---

## The 4-System Checklist

### System 1: Vercel Analytics

- [ ] Events use named helper functions from `app/lib/analytics.ts` (not raw `track()` calls with ad-hoc names)
- [ ] Event names follow the `namespace:action` pattern (`purchase:add_to_cart`, `cart:upsell_shown`)
- [ ] All required properties are passed per each helper's TypeScript signature
- [ ] `trackPurchaseAddToCart` fires after every successful `addToCart` mutation
- [ ] New custom events (if any) added to typed helpers in `analytics.ts`, not inlined at callsite
- [ ] `safeTrack` wrapper is used throughout -- no unguarded `track()` calls that could throw

### System 2: Triple Whale

- [ ] `trackAddToCart` from `app/lib/tripleWhale.ts` fires after every successful cart add
- [ ] `productId` and `variantId` are passed as Shopify GIDs (the helper calls `extractNumericId` internally)
- [ ] `window.TriplePixel` guard is in place -- the helper handles the script not yet loaded
- [ ] TriplePixel script loads in `app/layout.tsx` (not removed or commented out)
- [ ] No direct `window.TriplePixel()` calls outside the helper (would bypass GID extraction)

### System 3: Meta Pixel (client-side)

- [ ] `NEXT_PUBLIC_META_PIXEL_ID` env var is set (the `hasPixelId()` guard silently no-ops if missing)
- [ ] PageView fires on each full page load
- [ ] ViewContent fires on product page mount -- passes `content_ids` as numeric Shopify IDs via `toContentId()`
- [ ] AddToCart fires after successful cart mutation -- passes `value`, `currency`, `content_ids`
- [ ] InitiateCheckout fires when user clicks through to Shopify checkout
- [ ] All calls go through `trackWithDedup` -- not raw `window.fbq()` (deduplication requires the `eventID` option)
- [ ] `fbq` script is loaded in `app/layout.tsx` before any event fires

### System 4: Meta CAPI (server-side deduplication)

- [ ] Every client Pixel event has a matching CAPI call with the **same `event_id`**
- [ ] `event_id` is generated once per event in `trackWithDedup` and passed to both `window.fbq` and `sendToCAPI`
- [ ] `event_time` is a Unix timestamp in seconds (not milliseconds)
- [ ] `event_source_url` is set from the `referer` header in the CAPI route
- [ ] `user_data.fbp` is read from the `_fbp` cookie via `getFbp()` and forwarded to CAPI
- [ ] `META_CAPI_ACCESS_TOKEN` env var is set server-side (never `NEXT_PUBLIC_`)
- [ ] CAPI route returns 200 even on Meta API errors (client must never fail because of CAPI)
- [ ] Event names match the allowlist in `route.ts`: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`

---

## Common Failure Patterns

| Symptom | Likely Cause |
|---------|-------------|
| CAPI receives events but Meta deduplication fails | `event_id` on Pixel call and CAPI call do not match -- both must use the same ID generated once in `trackWithDedup` |
| Triple Whale not recording adds | `window.TriplePixel` not yet loaded when event fires; check script load order in `layout.tsx` |
| Meta Pixel fires but CAPI silent | `META_CAPI_ACCESS_TOKEN` env var missing server-side; check Vercel env config for the environment |
| Vercel Analytics missing events | `track()` called inside a Server Component (requires `'use client'`); or wrong event name format |
| AddToCart analytics on upsell but not direct add | Two separate add paths exist; check both `CartContext.addToCart` and any direct cart API calls |
| ViewContent fires on wrong pages | `trackMetaViewContent` placed in a shared layout instead of the specific product page component |
| No `_fbp` cookie forwarded to CAPI | Cookie blocked by browser or consent banner; also check `getFbp()` regex against actual cookie name |

**Severity guide:** CAPI deduplication issues are always Critical (highest revenue impact). A missing event on a conversion action is Critical. A naming-pattern deviation is Minor. Env-var checks that cannot be verified from code get flagged as "verify in Vercel env config", not passed silently.
