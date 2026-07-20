# Triple Whale Integration Guide

> **SUPERSEDED (Feb 2026 doc, flagged 2026-07-20).** Reconnection-era options; the reality is the client `TriplePixel` only, loaded in `app/components/DelayedAnalytics.tsx`. Current state: [README.md](README.md).

**Purpose:** Reconnect Triple Whale to your new Next.js site and decide what data to send.

**Current Situation:**
- ✅ Triple Whale connected to Shopify (e-commerce data)
- ✅ Used to have old Shopify frontend connected
- ❌ New Next.js site not yet connected to Triple Whale
- ✅ Vercel Analytics tracking quiz funnel

---

## Understanding the Setup

### What is a Drain?

A **drain** is Vercel's way of exporting analytics data to external services. Think of it like a pipe:
- **Vercel Analytics** → [Drain] → **Your Endpoint** → **Triple Whale**

### Is Triple Whale a Drain?

**No.** Triple Whale is a **destination** (where data goes), not a drain (the pipe itself).

You need:
1. **Vercel Drain** - Exports data from Vercel
2. **Bridge/Transform** - Converts Vercel format to Triple Whale format
3. **Triple Whale API/Webhook** - Receives the data

---

## Triple Whale Integration Options

### Option 1: Triple Pixel (Client-Side Tracking)

**How it works:**
- Add Triple Whale's tracking pixel to your site
- Events fire directly from browser to Triple Whale
- No drain needed

**Pros:**
- ✅ Simple setup
- ✅ Real-time tracking
- ✅ Built-in attribution

**Cons:**
- ❌ Separate from Vercel Analytics
- ❌ Need to track events twice (Vercel + Triple Whale)
- ❌ Client-side only

**When to use:**
- If you want Triple Whale as your primary analytics
- If you're okay tracking events in two places

---

### Option 2: Vercel Drain → Triple Whale API (Server-Side)

**How it works:**
- Vercel sends events to your drain endpoint
- Your endpoint transforms data to Triple Whale format
- Forward to Triple Whale API/webhook

**Pros:**
- ✅ Single source of truth (Vercel Analytics)
- ✅ Server-side (more reliable)
- ✅ Can transform/enrich data

**Cons:**
- ❌ More complex setup
- ❌ Need to maintain bridge code
- ❌ Requires Triple Whale API access

**When to use:**
- If you want Vercel as primary, Triple Whale for visualization
- If you need server-side tracking

---

### Option 3: Hybrid (Recommended for DTC)

**How it works:**
- Use Triple Pixel for e-commerce events (purchases, add-to-cart)
- Use Vercel Analytics for site behavior (quiz, navigation)
- Both feed into Triple Whale

**Pros:**
- ✅ Best of both worlds
- ✅ Triple Whale gets all data
- ✅ Vercel Analytics for technical insights

**Cons:**
- ❌ Two tracking systems
- ❌ Need to manage both

**When to use:**
- If Triple Whale is your primary DTC analytics
- If you want comprehensive tracking

---

## Recommended Setup for CONKA

### Current Situation

You have:
- ✅ Vercel Analytics tracking quiz funnel (just implemented)
- ✅ Triple Whale connected to Shopify (e-commerce backend)
- ❌ New Next.js frontend not connected to Triple Whale yet
- ✅ Need to reconnect Triple Whale to new site

### Best Approach: Hybrid (Recommended)

**Keep Vercel Analytics for:**
- Quiz funnel tracking (`quiz:started`, `quiz:completed`, etc.)
- Navigation events
- Technical/development insights

**Add Triple Pixel for:**
- E-commerce events (add-to-cart, purchase, checkout)
- Marketing attribution
- DTC business metrics (ROAS, CPA, product performance)

**Why this split?**
- Quiz data = user engagement/journey (better in Vercel for technical analysis)
- E-commerce data = revenue/business metrics (better in Triple Whale for DTC insights)
- Both systems work together without conflict

**1. Keep Vercel Analytics** for:
- Quiz funnel tracking
- Technical performance
- Development/debugging

**2. Use Triple Pixel** for:
- E-commerce events (add-to-cart, purchase)
- Marketing attribution
- DTC metrics (ROAS, CPA, etc.)

**3. Bridge Vercel → Triple Whale** (Optional):
- If you want quiz events in Triple Whale
- Transform Vercel events to Triple Whale format
- Send via Triple Whale API

---

## Step 1: Reconnect Triple Whale to New Site (Primary Task)

### Get Triple Pixel Code

1. Go to Triple Whale Dashboard
2. Navigate to **Settings → Pixel Settings** (or **Installation**)
3. Copy your Triple Pixel tracking code
4. It should look like a script tag with your Triple Whale ID

### Add Triple Pixel to Next.js Site

**File:** `app/layout.tsx`

Add Triple Pixel script in the `<head>` section (similar to Meta Pixel):

```typescript
{/* Triple Pixel */}
<Script
  id="triple-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      // Your Triple Pixel code from Triple Whale dashboard
      // Usually looks like: window.TW_* or similar
    `
  }}
/>
```

Or if Triple Whale provides a script URL:

```typescript
<Script
  src="https://triplewhale.com/pixel/your-pixel-id.js"
  strategy="afterInteractive"
  async
/>
```

### Track E-Commerce Events

You'll need to track key e-commerce events using Triple Pixel:

**Add to Cart:**
```typescript
// In your addToCart function (CartContext.tsx)
window.TW?.track('AddToCart', {
  productId: productId,
  variantId: variantId,
  quantity: quantity,
  price: price,
  // ... other product data
});
```

**Purchase/Checkout:**
```typescript
// On checkout success page
window.TW?.track('Purchase', {
  orderId: orderId,
  total: total,
  items: cartItems,
  // ... order data
});
```

**Note:** The exact Triple Pixel API may vary. Check Triple Whale documentation for the correct method names.

---

## Step 2: Should Quiz Data Go to Triple Whale?

### Recommendation: **No, keep quiz data in Vercel Analytics**

**Why:**
- ✅ Quiz data is about **user journey/engagement**, not revenue
- ✅ Vercel Analytics is better for **technical/development insights**
- ✅ Triple Whale is optimized for **e-commerce metrics** (ROAS, CPA, product performance)
- ✅ Avoids cluttering Triple Whale with non-revenue events
- ✅ Keeps systems focused on their strengths

**What to send to Triple Whale:**
- ✅ Add to cart events
- ✅ Purchase/checkout events
- ✅ Product page views (optional)
- ✅ Checkout started (optional)

**What to keep in Vercel:**
- ✅ Quiz funnel events
- ✅ Navigation events
- ✅ Site behavior/engagement

### Exception: If You Want Quiz → Purchase Attribution

**If you want to see "quiz completion → purchase conversion" in Triple Whale:**

Then you could send quiz completion events to Triple Whale as custom events:

```typescript
// After quiz completes
window.TW?.track('QuizCompleted', {
  recommendedProtocol: protocolId,
  sessionId: sessionId,
  // ... other quiz data
});
```

This would let you analyze in Triple Whale:
- "Do users who complete quiz convert better?"
- "Which recommended protocols lead to purchases?"

**But this is optional** - you can also analyze this by joining Vercel + Shopify data.

---

## Step 3: Setting Up Vercel → Triple Whale Bridge (Optional)

**Only needed if you want quiz events in Triple Whale.**

### Get Triple Whale API Credentials

### Step 1: Get Triple Whale API Credentials

1. Go to Triple Whale Dashboard
2. Navigate to Settings → API/Integrations
3. Get API key or webhook URL
4. Note the event format Triple Whale expects

### Step 2: Create Bridge Endpoint

**File:** `app/api/analytics/triple-whale/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

/**
 * Bridge: Vercel Analytics Drain → Triple Whale
 * 
 * Receives events from Vercel Analytics drain
 * Transforms to Triple Whale format
 * Forwards to Triple Whale API/webhook
 */

const TRIPLE_WHALE_API_URL = process.env.TRIPLE_WHALE_WEBHOOK_URL;
const TRIPLE_WHALE_API_KEY = process.env.TRIPLE_WHALE_API_KEY;

// Transform Vercel event to Triple Whale format
function transformToTripleWhale(vercelEvent: any) {
  return {
    event: vercelEvent.event,
    timestamp: vercelEvent.timestamp,
    properties: {
      ...vercelEvent.properties,
      // Add Triple Whale required fields
      url: vercelEvent.url,
      referrer: vercelEvent.referrer,
      // Map Vercel properties to Triple Whale format
    },
    // Add any Triple Whale-specific fields
  };
}

export async function POST(request: NextRequest) {
  try {
    const events = await request.json();
    const eventArray = Array.isArray(events) ? events : [events];
    
    if (!TRIPLE_WHALE_API_URL) {
      console.warn("Triple Whale webhook URL not configured");
      return NextResponse.json({ received: true, forwarded: false });
    }
    
    // Transform and forward each event
    const tripleWhaleEvents = eventArray.map(transformToTripleWhale);
    
    // Send to Triple Whale
    const response = await fetch(TRIPLE_WHALE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TRIPLE_WHALE_API_KEY && { "Authorization": `Bearer ${TRIPLE_WHALE_API_KEY}` }),
      },
      body: JSON.stringify(tripleWhaleEvents),
    });
    
    if (!response.ok) {
      console.error("Triple Whale API error:", await response.text());
    }
    
    return NextResponse.json({ 
      received: true, 
      forwarded: response.ok,
      eventCount: eventArray.length 
    });
  } catch (error) {
    console.error("Triple Whale bridge error:", error);
    return NextResponse.json(
      { error: "Failed to forward events" },
      { status: 500 }
    );
  }
}
```

### Step 3: Configure Vercel Drain

1. Deploy your code (with bridge endpoint)
2. Go to Vercel Dashboard → Project Settings → Analytics
3. Scroll to "Web Analytics Drains"
4. Add drain URL: `https://your-domain.com/api/analytics/triple-whale`
5. Save

### Step 4: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
TRIPLE_WHALE_WEBHOOK_URL=https://api.triplewhale.com/webhook/your-endpoint
TRIPLE_WHALE_API_KEY=your-api-key (if required)
```

---

## What Data Goes Where?

### Vercel Analytics (Keep)
- ✅ Quiz funnel events (`quiz:started`, `quiz:completed`, etc.)
- ✅ Navigation events
- ✅ Technical performance
- ✅ Development/debugging

### Triple Whale (Via Triple Pixel)
- ✅ E-commerce events (add-to-cart, purchase, checkout)
- ✅ Marketing attribution
- ✅ Product performance
- ✅ ROAS, CPA, revenue metrics

### Triple Whale (Via Bridge - Optional)
- ✅ Quiz events (if you want them in Triple Whale)
- ✅ Custom site behavior
- ✅ User journey data

---

## Questions to Ask Triple Whale Support

Before setting up the bridge, ask:

1. **Do you have a webhook/API endpoint for custom events?**
   - What's the URL format?
   - What authentication is required?

2. **What event format do you expect?**
   - JSON structure?
   - Required fields?
   - Property naming conventions?

3. **Can you accept server-side events?**
   - Or only client-side (Triple Pixel)?

4. **How do custom events appear in dashboards?**
   - Do they need to be pre-configured?
   - Can you query them with SQL/Moby?

---

## Recommended Next Steps

1. **Check Triple Whale Dashboard**
   - Look for Settings → API/Integrations
   - Find webhook or API documentation
   - Get credentials

2. **Decide on Approach**
   - **Option A:** Use Triple Pixel for everything (simpler)
   - **Option B:** Keep Vercel + Bridge to Triple Whale (more control)
   - **Option C:** Hybrid (recommended)

3. **If Using Bridge:**
   - Get Triple Whale API/webhook URL
   - Create bridge endpoint (see example above)
   - Configure Vercel drain
   - Test with sample events

4. **If Using Triple Pixel:**
   - Get Triple Pixel code from Triple Whale
   - Add to `layout.tsx` (similar to Meta Pixel)
   - Track events using Triple Pixel API
   - Keep Vercel Analytics for technical insights

---

## Current Recommendation

**For CONKA, I recommend:**

1. **Keep Vercel Analytics** as-is (quiz funnel tracking)
2. **Add Triple Pixel** for e-commerce events (if not already added)
3. **Bridge quiz events to Triple Whale** (optional, if you want quiz data there)

This gives you:
- ✅ Vercel Analytics for technical/development insights
- ✅ Triple Whale for DTC business metrics
- ✅ Both systems working together

---

**Next Steps:**
1. Check your Triple Whale dashboard for API/webhook options
2. Decide if you want quiz events in Triple Whale
3. Set up bridge if needed, or just use Triple Pixel

---

**Last Updated:** 2025-01-23
