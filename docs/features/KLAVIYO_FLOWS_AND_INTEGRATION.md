# Klaviyo flows, integrations & triggers

Concise reference for what is triggered in Klaviyo, from where, and how.

## Integration overview

- **Onsite popups / sign-up forms** are handled by **Alia** (Shopify app), not by Klaviyo's onsite script. Alia's `embed.js` loads via the deferred marketing loader (`app/components/DelayedAnalytics.tsx`) and syncs signups to the master list `WBbMia` through Alia's own native OAuth integration with Klaviyo (configured in the Alia dashboard, no Klaviyo code in this repo). The legacy Klaviyo onsite script in `app/layout.tsx` is commented out (disabled 2026-05-26) and should stay that way.
- **Backend** uses `KLAVIYO_PRIVATE_KEY` for server-side APIs: subscribe to lists, track events (e.g. cognitive test). `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` is still used by the cognitive-test track call.
- **Shopify → Klaviyo**: The Klaviyo app on Shopify sends checkout/order events to Klaviyo. Our headless site does **not** send cart or checkout events to Klaviyo; checkout-related metrics come from Shopify when the customer is on Shopify’s hosted checkout.

## What we trigger from this app (into Klaviyo)

| Trigger / action | Where | How | Why |
|------------------|--------|-----|-----|
| **Cognitive test completed** | `app/lib/klaviyo.ts` → `POST /api/klaviyo/track-test` | Server calls Klaviyo Track API with email, score, accuracy, speed | Funnel/segmentation for quiz completers |
| **Subscribe to list (e.g. Win)** | `app/lib/klaviyo.ts` → `POST /api/klaviyo/subscribe` | Server creates/gets profile, adds to list via Klaviyo APIs | Newsletter / Win page sign-ups |

We do **not** send Added to Cart or Checkout Started from this app. Checkout Started is sent by **Shopify** when the customer lands on the Shopify checkout page.

## What Shopify sends to Klaviyo

| Metric / event | When | Where email comes from |
|----------------|------|-------------------------|
| **Checkout Started** | Customer lands on Shopify hosted checkout (after clicking “Checkout” and loading `cart.checkoutUrl`) | Entered on the Shopify checkout page; Shopify passes it to Klaviyo via the app integration |

So: we have email for “abandoned” flows only for people who reached checkout (Shopify captures it there and syncs to Klaviyo). We do not have email for people who only added to cart and never clicked Checkout.

---

## Flows we use (summary)

### Abandoned cart flow (trigger: Checkout Started)

- **What it is:** Acts as our abandoned-cart recovery. Triggered when someone **starts checkout** (i.e. reaches the Shopify checkout page and thus has given their email).
- **Trigger:** Metric **Checkout Started** (sent by Shopify to Klaviyo when the customer hits the Shopify checkout URL).
- **Re-entry:** Typically “allow re-entry after a time period” (e.g. 7 days) so the same person can re-enter if they start checkout again later without purchasing.
- **Profile filters (example):** Placed Order 0 times since starting the flow; person can receive email marketing (e.g. subscribed).
- **Why Checkout Started:** Add to cart on our site does not require or collect email, so we can’t email pure “add to cart” abandoners. We can only email people who reached checkout (abandoned **checkout**), which is what this flow does.

This doc can be extended with more flows (e.g. welcome, post-purchase) as they’re added.
