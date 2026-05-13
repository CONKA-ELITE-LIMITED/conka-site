---
name: review-analytics
description: Verify that all 4 analytics systems fire correctly after a new page or funnel change. Covers Vercel Analytics, Triple Whale, Meta Pixel, and Meta CAPI deduplication. Use after shipping any new page, funnel step, or cart mutation.
argument-hint: <page path | feature description | "all">
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# /review-analytics -- Are All 4 Systems Firing?

You are verifying the analytics health of a D2C e-commerce site where attribution accuracy directly affects ad spend efficiency. A silent analytics failure can waste thousands in Meta ad spend through broken CAPI deduplication or missing conversion signals.

This skill reviews **analytics implementation only**. For code quality, use `/review-code`. For legal compliance, use `/review-claims`.

---

## Quick Reference

```
/review-analytics app/funnel/        # Review funnel analytics
/review-analytics app/page.tsx       # Review a specific page
/review-analytics CartContext        # Review cart mutation events
/review-analytics all                # Full site audit
```

---

## Step 0: Continuity check (always run first)

**Signs you're continuing:** target files and analytics source files are already in context, responding to a fix after a recent audit.

**If continuing:** skip Step 1, jump to Step 2. **If starting fresh:** run all steps.

---

## Process

### Step 1: Gather Context (silent)

1. Read the target file(s) and their imports.
2. Read the relevant analytics source files:
   - `app/lib/analytics.ts` -- Vercel Analytics typed helpers
   - `app/lib/metaPixel.ts` -- Meta Pixel and CAPI client helpers
   - `app/lib/tripleWhale.ts` -- Triple Whale helpers
   - `app/api/meta/events/route.ts` -- CAPI server route
   - `app/context/CartContext.tsx` -- where cart mutation events fire
3. If the target includes new routes, check `app/layout.tsx` for script load order.

---

### Step 2: Run the 4-System Checklist

#### System 1: Vercel Analytics

- [ ] Events use named helper functions from `app/lib/analytics.ts` (not raw `track()` calls with ad-hoc names)
- [ ] Event names follow the `namespace:action` pattern (`purchase:add_to_cart`, `cart:upsell_shown`)
- [ ] All required properties are passed per each helper's TypeScript signature
- [ ] `trackPurchaseAddToCart` fires after every successful `addToCart` mutation
- [ ] New custom events (if any) added to typed helpers in `analytics.ts`, not inlined at callsite
- [ ] `safeTrack` wrapper is used throughout -- no unguarded `track()` calls that could throw

---

#### System 2: Triple Whale

- [ ] `trackAddToCart` from `app/lib/tripleWhale.ts` fires after every successful cart add
- [ ] `productId` and `variantId` are passed as Shopify GIDs (the helper calls `extractNumericId` internally)
- [ ] `window.TriplePixel` guard is in place -- the helper handles the case where the script has not yet loaded
- [ ] TriplePixel script loads in `app/layout.tsx` (check it has not been removed or commented out)
- [ ] No direct `window.TriplePixel()` calls outside the helper (would bypass GID extraction)

---

#### System 3: Meta Pixel (client-side)

- [ ] `NEXT_PUBLIC_META_PIXEL_ID` env var is set (the `hasPixelId()` guard in `metaPixel.ts` will silently no-op if missing)
- [ ] PageView fires on each full page load (check `app/layout.tsx` or a layout client component)
- [ ] ViewContent fires on product page mount -- passes `content_ids` as numeric Shopify IDs via `toContentId()`
- [ ] AddToCart fires after successful cart mutation -- passes `value`, `currency`, `content_ids`
- [ ] InitiateCheckout fires when user clicks through to Shopify checkout
- [ ] All calls go through `trackWithDedup` -- not raw `window.fbq()` calls (deduplication requires the `eventID` option)
- [ ] `fbq` script is loaded in `app/layout.tsx` before any event fires

---

#### System 4: Meta CAPI (server-side deduplication)

- [ ] Every client Pixel event has a matching CAPI call with the **same `event_id`**
- [ ] `event_id` is generated once per event in `trackWithDedup` and passed to both `window.fbq` and `sendToCAPI`
- [ ] `event_time` is a Unix timestamp in seconds (not milliseconds -- divide `Date.now()` by 1000)
- [ ] `event_source_url` is set from the `referer` header in the CAPI route
- [ ] `user_data.fbp` is read from the `_fbp` cookie via `getFbp()` and forwarded to CAPI
- [ ] `META_CAPI_ACCESS_TOKEN` env var is set server-side (never `NEXT_PUBLIC_`)
- [ ] CAPI route returns 200 even on Meta API errors (client must never fail because of CAPI)
- [ ] Allowed event names match the allowlist in `route.ts`: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `Purchase`

---

### Step 3: Common Failure Patterns

| Symptom | Likely Cause |
|---------|-------------|
| CAPI receives events but Meta deduplication fails | `event_id` on Pixel call and CAPI call do not match -- both must use the same ID generated once in `trackWithDedup` |
| Triple Whale not recording adds | `window.TriplePixel` not yet loaded when event fires; check script load order in `layout.tsx` |
| Meta Pixel fires but CAPI silent | `META_CAPI_ACCESS_TOKEN` env var missing server-side; check Vercel env config for the environment |
| Vercel Analytics missing events | `track()` called inside a Server Component (requires `'use client'`); or wrong event name format |
| AddToCart analytics on upsell but not direct add | Two separate add paths exist; check both `CartContext.addToCart` and any direct cart API calls |
| ViewContent fires on wrong pages | `trackMetaViewContent` placed in a shared layout instead of the specific product page component |
| No `_fbp` cookie forwarded to CAPI | Cookie blocked by browser or consent banner; also check `getFbp()` regex against actual cookie name |

---

### Step 4: Present the Audit

```
## Analytics Review: [target]

### System 1: Vercel Analytics -- Pass / Needs work / Fail
[Specific findings with file:line references]

### System 2: Triple Whale -- Pass / Needs work / Fail
[Specific findings]

### System 3: Meta Pixel -- Pass / Needs work / Fail
[Specific findings]

### System 4: Meta CAPI -- Pass / Needs work / Fail
[Specific findings]

### Issues (priority order)
1. [CAPI deduplication issues first -- highest revenue impact]
2. ...

### What's Working Well
- [Always include this section]
```

---

## Key Principles

- **CAPI deduplication is the highest-stakes check.** Broken deduplication means Meta counts both the pixel event and the CAPI event -- double-counting inflates reported conversions and degrades the algorithm's optimisation.
- **Silent failures are the enemy.** All four systems fail silently by design. The only way to catch failures is code review.
- **Env vars are infrastructure, not code.** A perfectly written analytics call with a missing env var sends nothing. Always verify both code and config.
- **Specificity is credibility.** Name the exact file, function, and line. "Analytics looks fine" is not a review.
- **Always acknowledge what is working.** The "What's Working Well" section is not optional.
- **Never use em dashes** in generated text.
