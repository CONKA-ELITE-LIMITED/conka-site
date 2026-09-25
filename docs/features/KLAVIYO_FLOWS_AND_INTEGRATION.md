# Klaviyo flows, integrations & triggers

Concise reference for what is triggered in Klaviyo, from where, and how.

## Integration overview

- **Onsite popups / sign-up forms** are handled by **Alia** (Shopify app), not by Klaviyo's onsite script. Alia's `embed.js` loads via the deferred marketing loader (`app/components/DelayedAnalytics.tsx`) and syncs signups to the master list `WBbMia` through Alia's own native OAuth integration with Klaviyo (configured in the Alia dashboard, no Klaviyo code in this repo). The legacy Klaviyo onsite script in `app/layout.tsx` is commented out (disabled 2026-05-26) and should stay that way.

  **Why it was disabled, so nobody re-enables it.** Every Klaviyo signup form had
  been set to draft, so `klaviyo.js` loaded on every page and rendered nothing,
  while still costing **~360ms of main thread** and **re-injecting Google Fonts
  site-wide**. Re-adding the script reintroduces that regression for zero
  benefit, since Alia now owns the popup.

  **`WBbMia` must stay on single opt-in** (Klaviyo → Lists & Segments → list
  Settings → Consent). Alia signups go live immediately on single opt-in, which
  matches the legacy popup behaviour; switching it to double opt-in silently
  breaks the capture without any error surfacing. It is the same master "new
  users" list the footer newsletter signup feeds via
  `app/api/klaviyo/subscribe/route.ts`.
- **Backend** uses `KLAVIYO_PRIVATE_KEY` for server-side APIs: subscribe to lists, track events. The cognitive test result is sent by the CONKA app server, not this site (see `COGNITIVE_TEST.md`).
- **Shopify → Klaviyo**: The Klaviyo app on Shopify sends checkout/order events to Klaviyo. Our headless site does **not** send cart or checkout events to Klaviyo; checkout-related metrics come from Shopify when the customer is on Shopify’s hosted checkout.

## What we trigger from this app (into Klaviyo)

| Trigger / action | Where | How | Why |
|------------------|--------|-----|-----|
| **/app test email gate passed** | `app/lib/klaviyo.ts` `subscribeAppTestSignup` → `POST /api/klaviyo/app-test-signup` | Fires on email submit, before the test runs. Upserts the profile with `source: app_test`, then a subscription job records `SUBSCRIBED` email marketing consent (`custom_source: app_test`) and adds the profile to `WBbMia`. The route refuses a request without `consent: true` | Captures test signups even if they drop out mid-test. The gate checkbox ("Email me my results and news from CONKA") is the marketing consent |
| **Cognitive test completed** | `app/lib/klaviyo.ts` `submitWebTestResult` → `POST https://conka.app/api/klaviyo/web-test-complete` | The CONKA app server reads the scores from its own `test_stats` and sends "Website Short Test Submitted" (`latest_website_score`, `latest_website_accuracy`, `latest_website_speed`, `latest_website_test_date`, `source`, `source_page`), as soon as the test completes. Idempotent per email and test | Carries the score onto the profile. List membership and consent come from the gate step above, not this event. Flow `Udp9BE` (template `XNeUCC`) prints the score lines; see `COGNITIVE_TEST.md` |
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
