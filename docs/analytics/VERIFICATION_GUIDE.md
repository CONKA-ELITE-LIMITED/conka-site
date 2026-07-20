# Analytics Verification Guide

> **SUPERSEDED (2026-07-20).** Use the **`/review-analytics`** skill to verify analytics. This guide carries pre-2026-06 assumptions (InitiateCheckout from the cart drawer, Purchase from Shopify checkout rather than our server webhook). Current state: [README.md](README.md).

**Purpose:** Step-by-step guide to verify that Triple Whale and Vercel Analytics are working correctly.

---

## Quick Verification Checklist

- [ ] Triple Pixel loaded (check browser console)
- [ ] AddToCart events fire (check console logs in development)
- [ ] Vercel Analytics events fire (check console logs in development)
- [ ] Events appear in Triple Whale dashboard
- [ ] Events appear in Vercel Analytics dashboard

---

## Method 1: Development Mode (Easiest)

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Open Browser DevTools

1. Open your site in browser (usually `http://localhost:3000`)
2. Open DevTools (F12 or Cmd+Option+I on Mac)
3. Go to **Console** tab

### Step 3: Check Triple Pixel Loaded

In the console, you should see:
- No errors about TriplePixel
- You can verify it's loaded by typing: `window.TriplePixel` (should return a function)

### Step 4: Add Item to Cart

1. Navigate to any product page (e.g., `/protocol/1` or `/conka-flow`)
2. Click "Add to Cart"
3. **Check Console** - You should see:

```
🐋 Triple Whale AddToCart: {item: "123456789", v: "987654321", q: 1, token: "..."}
📊 Analytics Event: purchase:add_to_cart {productType: "protocol", productId: "1", ...}
```

**What to look for:**
- ✅ Both console logs appear
- ✅ Triple Whale log shows numeric IDs (not GIDs)
- ✅ Vercel log shows product metadata

### Step 5: Verify Quiz Events (if testing quiz)

1. Go to `/quiz`
2. Start the quiz
3. **Check Console** - You should see:

```
📊 Analytics Event: quiz:started {source: "direct", sessionId: "...", ...}
📊 Analytics Event: quiz:question_viewed {questionNumber: 1, ...}
📊 Analytics Event: quiz:completed {recommendedProtocol: "1", ...}
```

---

## Method 2: Browser Network Tab (More Detailed)

### Step 1: Open Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "Fetch/XHR" or search for "analytics"

### Step 2: Add Item to Cart

1. Add an item to cart
2. **Check Network Tab** for requests:

**Triple Whale:**
- Look for requests to `api.config-security.com` or `conf.config-security.com`
- These are Triple Pixel tracking requests

**Vercel Analytics:**
- Look for requests to `vitals.vercel-insights.com` or similar
- These are Vercel Analytics events

**What to look for:**
- ✅ Requests are being sent (status 200)
- ✅ No failed requests (4xx or 5xx errors)

---

## Method 3: Triple Whale Dashboard

### Step 1: Log into Triple Whale

1. Go to your Triple Whale dashboard
2. Navigate to **Pixel Events** or **Add to Carts** section

### Step 2: Test Add to Cart

1. On your site, add an item to cart
2. Wait 1-2 minutes (events may take a moment to appear)
3. Refresh Triple Whale dashboard
4. **Check for:**
   - New AddToCart event appears
   - Event shows correct product ID and variant ID
   - Quantity is correct

### Step 3: Verify Event Data

Click on an event to see details:
- `item`: Should be numeric product ID
- `v`: Should be numeric variant ID
- `q`: Should be quantity (usually 1)
- `token`: Should be cart token (if provided)

**Note:** Events may take 1-5 minutes to appear in dashboard.

---

## Method 4: Vercel Analytics Dashboard

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Analytics** tab

### Step 2: View Events

1. Navigate to **Events** section
2. Look for custom events:
   - `purchase:add_to_cart`
   - `quiz:started`
   - `quiz:completed`
   - etc.

### Step 3: Verify Event Properties

Click on an event to see properties:
- `productType`: "formula" or "protocol"
- `productId`: "01", "02", "1", "2", "3", "4"
- `variantId`: Shopify GID
- `location`: "hero", "sticky_footer", etc.
- `source`: "quiz", "menu", "direct", etc.

**Note:** 
- Events appear in real-time in development
- Production events may take a few minutes
- Vercel Analytics Plus plan required for custom events

---

## Method 5: Production Testing

### Step 1: Deploy to Production

1. Push changes to main branch
2. Wait for Vercel deployment to complete

### Step 2: Test on Production Site

1. Visit your production site
2. Open DevTools (but console logs won't show in production)
3. Use Network tab to verify requests are being sent

### Step 3: Check Dashboards

1. **Triple Whale:** Check for new events (may take 1-5 minutes)
2. **Vercel Analytics:** Check Events section (may take a few minutes)

---

## Troubleshooting

### Issue: No Console Logs in Development

**Check:**
1. Are you running `npm run dev` (not production build)?
2. Is `NODE_ENV=development`?
3. Check browser console for errors

**Solution:**
- Make sure you're in development mode
- Check that console logging is enabled in `analytics.ts` and `tripleWhale.ts`

### Issue: TriplePixel Not Found

**Check:**
1. Is Triple Pixel script in `app/layout.tsx`?
2. Is script loading before tracking code runs?

**Solution:**
- Verify Triple Pixel script is in `<head>` section
- Check Network tab for script loading errors
- Try adding a delay: `setTimeout(() => trackAddToCart(...), 1000)`

### Issue: Events Not Appearing in Dashboards

**Check:**
1. Are events firing in console/network tab?
2. How long have you waited? (can take 1-5 minutes)

**Solution:**
- Verify events are being sent (check Network tab)
- Wait a few minutes and refresh dashboard
- Check for errors in Network tab (4xx/5xx responses)

### Issue: Wrong Data in Events

**Check:**
1. Are components passing metadata?
2. Is product metadata extraction working?

**Solution:**
- Check console logs for event properties
- Verify `extractProductMetadata()` is working
- Check that components are passing location/source/sessionId

---

## Quick Test Script

Run this in browser console to test tracking:

```javascript
// Test Triple Whale
if (window.TriplePixel) {
  window.TriplePixel('AddToCart', {
    item: '123456789',
    v: '987654321',
    q: 1
  });
  console.log('✅ Triple Whale test event sent');
} else {
  console.error('❌ TriplePixel not loaded');
}

// Test Vercel Analytics (if track function is available)
// Note: This may not work directly - use the actual tracking functions
```

---

## Expected Console Output (Development)

When everything is working, you should see:

```
🐋 Triple Whale AddToCart: {item: "57000187363702", v: "57000187363702", q: 1, token: "gid://shopify/Cart/..."}
📊 Analytics Event: purchase:add_to_cart {
  productType: "protocol",
  productId: "1",
  variantId: "gid://shopify/ProductVariant/56999240597878",
  packSize: "4",
  tier: "starter",
  purchaseType: "one-time",
  location: "unknown",
  source: "direct",
  price: 14.99
}
```

**Note:** `location: "unknown"` and `source: "direct"` are expected until components are updated to pass metadata.

---

## Verification Checklist

After testing, verify:

- [ ] Triple Pixel loads without errors
- [ ] AddToCart events fire in console (development)
- [ ] Events show correct product/variant IDs
- [ ] Events appear in Triple Whale dashboard (within 5 minutes)
- [ ] Events appear in Vercel Analytics dashboard (within a few minutes)
- [ ] Event properties are correct (productType, productId, etc.)

---

## Meta Pixel & Conversions API

For Meta (Facebook/Instagram) Ads and event coverage:

- **PageView** – Fires once per load (with deduplication) via `MetaPageViewTracker`.
- **ViewContent** – Fires on product/protocol pages (conka-flow, conka-clarity, protocol/[id]).
- **AddToCart** – Fires from `CartContext` after a successful add.
- **InitiateCheckout** – Fires when the user clicks “Checkout” in the cart drawer.

To get **≥75% event coverage** in Ads Manager, set `META_CAPI_ACCESS_TOKEN` in your environment so server-side events are sent. See `docs/analytics/META_PIXEL_AND_CAPI.md` and `.env.example` for setup. **Purchase** and **AddPaymentInfo** are sent from Shopify checkout (e.g. via Shopify’s Meta channel), not from this repo.

---

## Next Steps

Once verified:
1. Update components to pass metadata (location, source, sessionId)
2. Test again to verify metadata is being captured
3. Monitor dashboards for a few days to ensure events are consistent
4. Configure `META_CAPI_ACCESS_TOKEN` for Meta CAPI and (optionally) Shopify’s Meta channel for Purchase events
