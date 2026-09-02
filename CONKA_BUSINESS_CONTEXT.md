# CONKA Business Context Document

Extracted from the conkaWebsite codebase. All values are real — prices, IDs, copy, and URLs taken directly from source code.

---

## 1. PRODUCT INFORMATION

### Products Sold

**Two Individual Formulas:**

| Product | Formula ID | Tagline | Theme |
|---------|-----------|---------|-------|
| CONKA Flow | 01 | Caffeine-Free Focus | ENERGY |
| CONKA Clarity (Clear) | 02 | Peak Performance Boost | CLARITY |

**Four Protocols (Bundles):**

| Protocol | Name | Subtitle | Best For |
|----------|------|----------|----------|
| 1 | Resilience | For those who want more focus | Recovery Focus, Stress Management, Daily Wellness |
| 2 | Precision | For those that feel foggy | Peak Performance, Mental Endurance, Cognitive Enhancement |
| 3 | Balance | Alternate daily between Flow and Clarity | Balanced Approach, All-Rounders, Hybrid Athletes |
| 4 | Ultimate | Take Flow and Clarity both daily | Elite Performance, Maximum Results, No Compromise |

### Product Positioning & Claims

**CONKA Flow:**
- "Daily support for your nervous system and focus, so you can stay sharp without the jitters or the crash."
- Designed for daily cognitive enhancement
- Patent: GB2629279
- Taste: Honey + Citrus with a hint of turmeric
- When to take: Morning with or without food; coffee replacement for sustained energy
- Key stats: +18% focus, +42% sleep quality, -56% stress, +17% sustained energy

**CONKA Clarity:**
- "When you need your brain at its best, CONKA Clear boosts cerebral blood flow and key neurotransmitters, so you think clearly under pressure."
- Strategic enhancement for high-stakes moments
- Taste: Lemons
- When to take: 30-60 minutes before peak performance moments, or evening for recovery
- Key stats: +63% memory & attention, +57% brain blood flow, +40% mental detox, -42% anxiety

### Pricing

**Individual Formulas (both same price):**

| Pack Size | One-Time | Per Shot | Subscription (20% off) | Per Shot | Interval |
|-----------|----------|----------|----------------------|----------|----------|
| 4-pack | £14.99 | £3.75 | £11.99/week | £3.00 | Weekly |
| 8-pack | £28.99 | £3.62 | £23.19/bi-weekly | £2.90 | Bi-weekly |
| 12-pack | £39.99 | £3.33 | £31.99/bi-weekly | £2.67 | Bi-weekly |
| 28-pack | £79.99 | £2.86 | £63.99/monthly | £2.29 | Monthly |

**Protocol Pricing (Protocols 1-3):**

| Tier | One-Time | Subscription | Shots |
|------|----------|-------------|-------|
| Starter | £14.99 | £11.99/week | 4 |
| Pro | £39.99 | £31.99/bi-weekly | 12 |
| Max | £79.99 | £63.99/monthly | 28 |

**Protocol 4 (Ultimate) — No Starter tier:**

| Tier | One-Time | Subscription | Shots |
|------|----------|-------------|-------|
| Pro | £79.99 | £63.99/bi-weekly | 28 (dual formula) |
| Max | £144.99 | £115.99/monthly | 56 (dual formula) |

**B2B Pricing (per box, ex-VAT subscription):**
- Starter (1–10 boxes): £61.00
- Squad (11–25 boxes): £55.00
- Elite (26+ boxes): £50.00

### Protocol Compositions (Shots per Week)

| Protocol | Tier | Flow/Week | Clarity/Week | Total |
|----------|------|-----------|--------------|-------|
| Resilience | Starter/Pro/Max | 3/5/6 | 1/1/1 | 4/6/7 |
| Precision | Starter/Pro/Max | 1/1/1 | 3/5/6 | 4/6/7 |
| Balance | Starter/Pro/Max | 2/3/4 | 2/3/3 | 4/6/7 |
| Ultimate | Pro/Max | 6/7 | 6/7 | 12/14 |

### Ingredients

**CONKA Flow (by weight %):**
- Lemon Balm (Leaves) — 26.7%
- Ashwagandha (Plant) — 26.7% (KSM-66, 600mg)
- Turmeric (Root) — 25.4%
- Rhodiola rosea (Root) — 9.4% (576mg)
- Bilberry (Berries) — 9.4%
- Black Pepper (Root) — 0.5%

**CONKA Clarity (by weight %):**
- Vitamin C — 50.46%
- Alpha GPC (Seeds) — 16.11%
- Glutathione (Amino acid) — 10.07% (250mg)
- N-Acetyl Cysteine (Amino acid) — 10.07%
- Acetyl-L-Carnitine (Amino acid) — 5.04%
- Ginkgo Biloba (Leaves) — 3.02%
- Lecithin (Seeds) — 1.51%
- Lemon Essential Oil — 0.60%
- Alpha Lipoic Acid — 0.20%
- Vitamin B12 — 0.03%

### Shopify Variant IDs

**Flow (one-time):** 4pk `57000187363702` · 8pk `56999967785334` · 12pk `56999967752566` · 28pk `56999967818102`
**Clarity (one-time):** 4pk `57000418607478` · 8pk `57000418640246` · 12pk `57000418673014` · 28pk `57000418705782`

**Selling Plans:** Weekly `711429882230` · Bi-weekly `711429947766` · Monthly `711429980534`

### Product Images

- Flow: `/formulas/ConkaFlowColour.jpg`, `/CONKA_01.jpg`
- Clarity: `/formulas/ConkaClearColour.jpg`, `/CONKA_06.jpg`
- Protocols: `/protocols/ResilienceRed.jpg`, `/protocols/PrecisionPurple.jpg`, `/protocols/BalanceGreen.jpg`, `/protocols/UltimatePink.jpg`
- Ingredient assets: `/ingredients/flow/` and `/ingredients/clear/` directories

### Product Colors & Gradients

| Product | Color | Gradient |
|---------|-------|----------|
| Flow | Amber (#f59e0b) | Yellow (#ffde59) → Orange (#ff914d) |
| Clarity | Soft Blue (#94b9ff) | Mint (#cdffd8) → Soft Blue (#94b9ff) |
| Resilience | — | Orange (#ff914d) → Red (#ff3131) |
| Precision | — | Pink (#ffcafb) → Purple (#896ebe) |
| Balance | — | Green (#c9ffbe) → Teal (#3a9f7e) |
| Ultimate | — | Yellow (#fff7ad) → Pink (#ffa9f9) |

---

## 2. CUSTOMER JOURNEY & CRO

### Site Routes / Funnel

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, athlete carousel, product grid, testimonials, why CONKA, FAQ |
| `/quiz` | 10-question product recommendation quiz |
| `/quiz/results` | Recommended protocol with scores, tier selector, add-to-cart |
| `/conka-flow` | Flow product detail page |
| `/conka-clarity` | Clarity product detail page |
| `/protocol/[id]` | Protocol detail pages (1-4) |
| `/shop` | All formulas showcase |
| `/professionals` | B2B professional portal |
| `/app` | Mobile app landing page with download links |
| `/science` | Science & research page |
| `/our-story` | Founder story |
| `/why-conka` | Value proposition page |
| `/ingredients` | Ingredient detail page |
| `/case-studies` | Athlete case studies |
| `/win` | Contest/giveaway email capture |
| `/account` | Customer account portal |
| `/account/subscriptions` | Subscription management |

### Primary Conversion Path (Quiz-Driven)

1. Homepage → "Take the Quiz" CTA
2. `/quiz` → 10 questions with progress bar
3. Submit → Loading animation
4. `/quiz/results` → Recommended protocol + all scores
5. Select tier (Starter/Pro/Max) + purchase type toggle (subscription saves 20%)
6. "Add to Cart" → Cart drawer opens
7. "Checkout" → Shopify-hosted checkout

### Secondary Conversion Path (Direct Product)

1. Homepage scroll → Product Grid or nav link
2. Product page → Pack size + purchase type selector
3. "Add to Cart" (from hero or sticky footer)
4. Cart drawer → Checkout

### Quiz Flow Details

**10 Questions:**
1. "Do you experience brain fog throughout the day?"
2. "Do you have a mid-afternoon energy crash?"
3. "Do you have difficulties falling asleep at night?"
4. "How many times per week do you train intensely?"
5. "What best describes your primary athletic focus?"
6. "Do you regularly experience head impacts or collisions?"
7. "How would you rate your memory?"
8. "Are you currently taking any cognitive or wellness supplements?"
9. "How cognitively demanding is your typical day?"
10. "What's your #1 goal with CONKA?"

Each answer scores 0-3 points toward each of the 4 protocols. Results show percentage match and recommended protocol.

### Email Capture Mechanics

1. **Win/Giveaway Page** (`/win`) — Contest email capture, stores in Convex, subscribes to Klaviyo list `WBbMia`
2. **Cognitive Test Email Gate** — Email required before starting cognitive test, consent checkbox: "I agree to receive my cognitive test results via email"
3. **Barrys Partnership Form** — Contest-based email capture with discount CTA
4. **Footer Newsletter** — "Never miss out—sign up for newsletters from CONKA. Tips, research and offers. No spam."

### Social Proof Elements

- **Athlete Credibility Carousel** — Auto-scrolling strip of athlete testimonials
- **Testimonials Section** — Auto-scrolling cards, product-specific filtering (Flow, Clarity, Protocol)
- **Trust/Assurance Banner:**
  - Informed Sport Certified
  - Free UK Shipping on Subscriptions
  - Cancel Anytime
  - 60-Day Money-Back Guarantee
- **Case Studies** — Athlete case studies with before/after data, filterable by sport
- **Founders Section** — Team photos and bios
- **Stats:** 4.7/5 stars (500+ reviews), 150,000 bottles sold, 1,000+ app users

### Sticky Purchase Footer

- Always-visible CTA when scrolling product/protocol pages
- Pack size + tier selectors
- Subscription vs one-time toggle
- Mobile-optimized variant (`StickyPurchaseFooterMobile`)

### Discount & Promotional Offers

- **Subscription discount:** Automatic 20% off vs one-time (displayed as "SAVE 20%" green badge)
- **RETENTION15:** 15% off next 3 deliveries — triggered during cancellation flow for "too expensive" reason
- **Banner system:** `BannerDesktop` / `BannerMobile` components support promo code copy-to-clipboard, marquee layout, urgent highlighting

### A/B Tests

- **No explicit A/B test infrastructure found.** However, the codebase supports variant props on Hero ("default"/"dark"), product grid layouts (mobile/tablet/desktop), and analytics session tracking that could support experimentation.

### Exit Intent

- **No explicit exit-intent popup.** Retention is handled by sticky purchase footer (always visible), cancellation modals with winback offers, and "Retake Quiz" re-engagement loop.

### Mobile vs Desktop

- Breakpoints: Mobile <768px, Tablet 768-1024px, Desktop ≥1024px
- Mobile-specific components: `ProductGridMobile`, `HeroMobile`, `WhatToExpectMobile`, `StickyPurchaseFooterMobile`, `KeyBenefitsMobile`, `WhyConkaWorksMobile`
- Touch-optimized buttons, vertical scrolling emphasis, hidden decorative dividers

---

## 3. SHOPIFY & E-COMMERCE

### Shopify Configuration

- **Store Domain:** `conka-6770.myshopify.com`
- **Storefront API Version:** `2025-10`
- **Public Access Token:** `99b077c7dac39ab9dc5f64b4dcc88502`
- **Customer Account Client ID:** `2ffc8429-5053-42ff-94ed-e5d2e3b36f76`
- **Shop ID:** `69347049757`
- **API Client:** `@shopify/storefront-api-client` v1.0.9

### Checkout

- **No custom checkout** — entirely Shopify-hosted via `cart.checkoutUrl`
- Payment, shipping, tax all managed by Shopify
- Discount codes entered at Shopify checkout (native functionality)
- No intermediate payment processing

### Cart Behavior

- **Persistence:** Cart ID in `localStorage` as `shopify_cart_id`; cart data lives in Shopify
- **Cart API:** `POST /api/cart` with actions: `create`, `add`, `update`, `updateMultiple`, `remove`
- **Checkout redirect:** `cart.checkoutUrl` from Shopify Cart API
- **Post-checkout:** `clearCart()` removes localStorage reference only

**Cart Line Item Attributes (LTV Tagging):**
- `source`: "quiz" | "product_page" | "protocol_page" | "product_grid" | "professional_portal" | "direct"
- `plan_frequency`: "weekly" | "biweekly" | "monthly" (for subscriptions)

**B2B Tier Normalization:**
- Automatic tier recalculation after every cart mutation
- Tier bands: Starter 1-10 boxes | Squad 11-25 boxes | Elite 26+ boxes
- Ultimate Protocol = 2 boxes per unit for tier calculation
- All items in cart normalized to same tier (separate B2B variant IDs per tier)
- VAT message for B2B: "Prices include VAT at 20%. Please email info@conka.io for an invoice after purchase."

**Subscription Retry Logic:** If variant doesn't support selling plan, automatically retries as one-time purchase.

### Discount Code Logic

- **No custom discount code application for one-time purchases** — handled natively by Shopify at checkout
- **Subscription discounts** applied via Loop API: `POST /subscription/{loopId}/discount` with `{ code: 'CODE' }`
- **Retention discount** (RETENTION15): Applied from CancellationModal during churn prevention

### Order Fulfillment

- Orders fetched via Shopify Customer Account API for display in `/account`
- No custom fulfillment logic in codebase
- Loop manages recurring subscription order creation automatically

### Shopify Apps/Plugins

- **Loop Subscriptions** — All subscription management (billing, pausing, cancellation, plan changes)
- No other Shopify apps detected in codebase

---

## 4. SUBSCRIPTION & RETENTION

### Platform: Loop Subscriptions

- **API Version:** `2023-10`
- **Base URL:** `https://api.loopsubscriptions.com/admin/2023-10`
- **Auth:** `X-Loop-Token` header

### Subscription Plans

| Plan | Interval | Selling Plan ID | Selling Plan Group ID |
|------|----------|----------------|----------------------|
| Starter | Weekly | 711429882230 | 98722480502 |
| Pro | Bi-weekly | 711429947766 | 98722546038 |
| Max | Monthly | 711429980534 | 98722578806 |

### Subscription Statuses

`active` → `paused` → `active` (auto-resume)
`active` → `cancelled` → `active` (manual reactivation)
`active` → `expired`

### Cancellation Flow (3-Step Modal)

**Step 1 — Reason Selection:**
1. Too expensive
2. Not seeing results
3. Deliveries too frequent
4. Deliveries too infrequent
5. Switching to a different product
6. No longer needed
7. Other reason

**Step 2 — Retention Offer (reason-dependent):**

| Reason | Offer | Action |
|--------|-------|--------|
| Too expensive | "How about 15% off? We'd love you to stay. 15% off your next 3 deliveries — no strings attached." | Apply `RETENTION15` discount code |
| Not seeing results | "Take a break instead?" | Open pause modal |
| No longer needed | "Pause for a while instead?" | Open pause modal |
| Too frequent | "Adjust your delivery schedule?" | Open edit modal |
| Too infrequent | "Get deliveries more often?" | Open edit modal |
| Switching product / Other | No offer | Proceed to confirmation |

**Step 3 — Final Confirmation:** Cancellation processed with reason, Loop sends email notification.

### Churn Reduction Mechanics

1. **Pause instead of cancel** — 1-3 billing cycles, auto-resumes after duration
2. **RETENTION15 discount** — 15% off next 3 deliveries, one use per customer
3. **Flexible plan/frequency changes** — Switch tiers, protocols, or intervals
4. **Reactivation** — Cancelled subscriptions can be restored anytime from account page
5. **Skip next order** — Skip without cancelling
6. **Reschedule delivery** — Move next delivery date (min 3 days, max 1 cycle)
7. **Place order now** — Trigger immediate delivery, shifts schedule forward

### Customer Portal Features

| Action | Implementation |
|--------|---------------|
| View subscriptions | Hybrid: Shopify contract IDs + Loop details |
| Pause | 1-3 billing cycles with estimated resume date |
| Resume | Resume on scheduled date or resume immediately |
| Cancel | 3-step modal with retention offers |
| Skip next order | Single click |
| Change plan | Swap variant + update frequency |
| Edit multi-line | Per-line product swaps for multi-product subscriptions |
| Reactivate | Restore cancelled subscription |
| Place order now | Immediate delivery trigger |
| Apply discount | Enter discount code |
| Reschedule | Date picker (3 days to 1 cycle) |
| Payment methods | View status (safe/expiring/expired), trigger update email |

### App Connection

- NOT FOUND — No explicit connection between website subscriptions and the CONKA mobile app

---

## 5. TRACKING, ANALYTICS & ADS

### Analytics Tools

| Tool | ID/Key | Implementation |
|------|--------|----------------|
| Google Analytics (GA4) | `G-LGP5PMY2QC` | Script in `layout.tsx`, browser-side |
| Meta Pixel | `1138202151698404` | Script in `layout.tsx`, browser-side |
| Meta CAPI | Server-side | `/api/meta/events` with Graph API v21.0 |
| Triple Whale (TriplePixel) | — | Script in `layout.tsx`, headless mode, Shopify domain |
| Vercel Analytics | — | `@vercel/analytics/react` component |
| Klaviyo | `XtXD9Q` (public) | Script in `layout.tsx` + API routes |

### Conversion Events by Platform

**Vercel Analytics (custom events):**
- `quiz:started` — Quiz entry
- `quiz:question_viewed` — Per-question with timing
- `quiz:answer_selected` — Answer selection
- `quiz:completed` — Quiz submission with match scores
- `quiz:results_viewed` — Results page with completion time
- `quiz:result_cta_clicked` — CTA interactions (view_protocol, add_to_cart, retake_quiz)
- `purchase:add_to_cart` — Full product/source/session context

**Meta Pixel (browser-side):**
- `PageView` — Every page via `MetaPageViewTracker`
- `ViewContent` — Product/protocol page loads
- `AddToCart` — Cart additions (with deduplication event_id)
- `InitiateCheckout` — Checkout button click (all cart items + total value)

**Meta CAPI (server-side):**
- Same events as Meta Pixel with `event_id` deduplication
- User data: `fbp` cookie, user agent, source URL
- Endpoint: `POST /api/meta/events`

**Triple Whale:**
- `AddToCart` only — product ID, variant ID, quantity, cart token

**Klaviyo:**
- `Website Short Test Submitted` — Cognitive test score, accuracy, speed
- List subscription events via profile creation

### UTM Parameter Handling

- `utm_source` and `utm_medium` extracted from URL in `analytics.ts`
- Stored in sessionStorage for quiz source attribution
- UTM parameters take precedence over referrer-based attribution
- Passed to all Vercel Analytics events

### Attribution Model

- Session-based attribution tracking user journey from quiz entry through purchase
- Sources tracked: `quiz`, `product_page`, `protocol_page`, `shop_page`, `homepage`, `quiz_retake`, `utm_{source}`, `direct`
- Session ID stored in `sessionStorage.quizSessionId`

### Ad Platforms

- **Meta/Facebook** — Pixel + CAPI
- **Google** — GA4 only (no Google Ads conversion tracking found)
- **Triple Whale** — Shopify-native attribution

### NOT FOUND

- No TikTok Pixel
- No Snapchat Pixel
- No Pinterest Pixel
- No Google Ads conversion tracking
- No Segment (mentioned in privacy policy but not implemented)
- No GTM (GA4 loaded directly)
- No Amplitude/Mixpanel

---

## 6. EMAIL & MARKETING AUTOMATION

### Platform: Klaviyo

- **Public Key:** `XtXD9Q`
- **Script:** `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=XtXD9Q`
- **Master List ID:** `WBbMia`

### Integration Points

1. **Footer Newsletter Signup** — Subscribes to master list, source: `"win_free_month"`
2. **Win Page Contest** (`/win`) — Email capture → Convex duplicate check → Klaviyo list subscription
3. **Cognitive Test Completion** — Tracks `Website Short Test Submitted` event with score/accuracy/speed
4. **Cognitive Test Email Gate** — Captures email with consent before test starts
5. **Barrys Partnership Form** — Contest email capture

### Key Flows

- **Welcome/Newsletter** — Triggered by list subscription
- **Cognitive test results** — Triggered by `Website Short Test Submitted` event
- **Winback/Retention** — NOT FOUND as Klaviyo flow; handled by Loop + CancellationModal instead

### SMS Marketing

- NOT FOUND — No SMS integration in codebase

### Support Email

- `info@conka.io` — the single public contact address for the whole site.
  Defined once in `COMPANY.email` (`app/lib/site.ts`) and re-exported as
  `SUPPORT_EMAIL` from `app/lib/supportEmail.ts`. B2B enquiries are the only
  exception: they route to the named account owner in `app/lib/b2bData.ts`.

---

## 7. WEBSITE TECH STACK & INFRASTRUCTURE

### Framework & Dependencies

- **Framework:** Next.js 16.0.7 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5
- **CSS:** Tailwind CSS 4 (with `@tailwindcss/postcss`)
- **Database:** Convex 1.31.3
- **Commerce:** `@shopify/storefront-api-client` 1.0.9
- **Validation:** Zod 4.3.5
- **Charts:** Recharts 3.5.1
- **Icons:** React Icons 5.5.0

### Hosting & Deployment

- **Hosting:** Vercel
- **Domain:** www.conka.io
- **Analytics:** Vercel Analytics 1.6.1

### CMS

- NOT FOUND — No headless CMS. All content is in TypeScript data files (`formulaContent.ts`, `protocolContent.ts`, `whyConkaData.ts`, `storyData.ts`, `quizData.ts`)

### External Services

| Service | Purpose | Connection |
|---------|---------|------------|
| Shopify | Commerce (cart, checkout, customers, orders) | Storefront API + Customer Account API |
| Loop Subscriptions | Subscription management | REST API |
| Convex | Database (contest entries, quiz results) | `https://reliable-pigeon-576.convex.cloud` |
| Klaviyo | Email marketing | REST API + script tag |
| Google Analytics | Web analytics | GA4 script tag |
| Meta | Ad tracking | Pixel script + CAPI server-side |
| Triple Whale | Shopify attribution | Script tag |

### Security Headers (next.config.ts)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Redirects (Permanent)

- `/blogs/*` → `https://www.conka.io/why-conka`
- `/products/*` → `/protocol/3`
- `/formula-01` → `/conka-flow`
- `/formula-02` → `/conka-clarity`
- `/help` → `/account/login`

### Fonts

- Poppins (400, 500, 600, 700) — general body
- Syne — premium display
- DM Sans — premium body
- Caveat — handwriting accents
- IBM Plex Mono — monospace

---

## 8. BRAND & MESSAGING

### Brand Voice

Scientific, premium, performance-focused. Speaks to high achievers. Clinical language backed by PMID citations. Tone is confident but not hyperbolic — uses measured claims with specific percentages.

### Key Value Propositions

1. **"£500,000+ in Research Investment"** — "We put the majority of our money into research—third-party studies and our own trials" (Durham University & Cambridge University partnerships)
2. **"Used by Elite Performers"** — Olympians, Premier League athletes, C-suite executives (Bank of America, Skyscanner, Bristol Rugby, Team GB)
3. **"Natural UK Manufacturing"** — Premium botanical ingredients, alcohol-free extraction, Informed Sport tested, Made in Britain
4. **"Measurable Results"** — Cambridge University cognitive testing app (5-minute ICA test); 16-36% cognitive improvements documented
5. **"The only supplement you can measure working"** — Differentiator tied to CONKA App

### Hero Headlines

- Rotating adjectives: "Clearer", "Calmer", "Focused", "Sharper", "Steadier", "Sustained", "Confident" + "Brain Performance"
- "Science-backed brain performance shots. Trusted by high performers."
- CTA: "Find Your Formula"

### Target Audience

- High-performance athletes (rugby, Olympic sports, combat sports)
- C-suite executives and knowledge workers
- People experiencing brain fog, energy crashes, stress
- Concussion recovery / brain health seekers
- Premium supplement buyers who want science-backed products

### Taglines & Key Phrases

- "Premium daily nootropic brain shot supplements"
- "Raising what's possible for human performance"
- "Caffeine-Free Focus" (Flow)
- "Peak Performance Boost" (Clarity)
- "Build Resilience, Stay Sharp" (Protocol 1)
- "Peak Cognition, Zero Burnout" (Protocol 2)
- "The Best of Both Worlds" (Protocol 3)
- "Maximum Power, Every Day" (Protocol 4)
- "The only supplement you can measure working"

### Competitor Positioning

- NOT FOUND — No direct competitor mentions in the codebase. Positioning is differentiated through measurability (cognitive testing app) and clinical evidence (university partnerships, PMID citations).

---

## 9. LEGAL & COMPLIANCE

### Cookie Consent

- **NOT FOUND** — No cookie consent banner implementation in codebase

### Privacy Policy

- **Location:** `/conkaapp-privacy-policy` route
- **Company:** CONKA ELITE LIMITED (doing business as CONKA)
- **Last updated:** August 28, 2025
- **Mentions:** GA4, Meta Pixel, Klaviyo, Segment (Segment not actually implemented)
- **Covers:** Personal information collection, usage, and sharing for website services

### Health/Supplement Disclaimers

- **No explicit supplement disclaimers found** (e.g., "not intended to diagnose, treat, cure, or prevent any disease")
- All marketing uses "clinical study" language with PMID citations, not medical claims
- Focus on "cognitive enhancement" and "brain performance," not treatment language
- FDA reference is for the cognitive testing app ("FDA cleared medical device"), not supplements

### Terms of Service

- NOT FOUND — No terms of service page in the codebase

### Age Restrictions

- NOT FOUND — No age gate or age verification in the codebase

---

## 10. CONNECTIONS TO THE CONKA APP

### App Landing Page

- **Route:** `/app`
- **iOS App Store:** `https://apps.apple.com/gb/app/conka-app/id6450399391`
- **Google Play:** `https://play.google.com/store/apps/details?id=com.conka.conkaApp&hl=en_GB`

### App Features (from website copy)

- 3-minute cognitive test (unlearnable, language-independent)
- Wellness tracking with sleep & exercise integration
- Measurable progress tracking against own data over time
- Powered by Cambridge University research, FDA cleared
- Free to use (no subscription required for core features)

### App Stats

- 1,000+ active users
- 16% average improvement in 30 days
- Available free on iOS & Android

### Cross-Promotion

- **App Download Section** component (`AppDownloadSection.tsx`) embedded in product pages
- **Cognitive Test App Promo** component (`CognitiveTestAppPromo.tsx`) — shows after web-based cognitive test
- **App Install Buttons** component (`AppInstallButtons.tsx`) with store badges
- Copy: "The only supplement you can measure working" ties product purchase to app usage

### Shared Accounts / Data

- **NOT FOUND** — No shared authentication between website (Shopify Customer Account API) and mobile app
- No deeplink handling, QR codes, or universal links found in the codebase
- Website and app appear to operate as independent systems with no data sync

---

*Document generated from codebase analysis. "NOT FOUND" indicates gaps where no implementation exists in the current codebase.*
