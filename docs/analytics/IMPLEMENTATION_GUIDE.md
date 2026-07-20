# CONKA Analytics Implementation Guide

> **SUPERSEDED (Feb 2026 doc, flagged 2026-07-20).** Predates the headless attribution rebuild. The Vercel funnel taxonomy is now owned by [FUNNEL_EVENTS.md](FUNNEL_EVENTS.md) and the Meta side by [META_PIXEL_AND_CAPI.md](META_PIXEL_AND_CAPI.md). Start at [README.md](README.md). Kept for history.

**Purpose:** Comprehensive, clarity-inducing analytics tracking for data-driven decision making in a DTC e-commerce environment.

**Platform:** Vercel Analytics (Plus Plan - 8 properties per event, 24 months history, UTM support)

**Strategy:** Dual-tracking approach

- **Convex:** Detailed quiz response data (question-by-question analysis)
- **Vercel Analytics:** Conversion funnel tracking (discovery → purchase journey)

---

## Table of Contents

1. [Overview](#overview)
2. [Rollout map (phases → states)](#rollout-map-phases--states)
3. [Phase 1: Quiz Funnel](#phase-1-quiz-funnel) ⭐ **START HERE**
4. [Phase 2: Navigation & Discovery](#phase-2-navigation--discovery)
5. [Phase 3: Product Pages](#phase-3-product-pages)
6. [Phase 4: Purchase Intent](#phase-4-purchase-intent)
7. [Phase 5: Engagement & Content](#phase-5-engagement--content)
8. [Implementation Notes](#implementation-notes)

---

## Overview

### What We're Tracking

**Conversion Funnel:**

```
Discovery → Landing → Quiz (optional) → Results → Product View → Add to Cart → Checkout
```

**Key Areas:**

1. **Quiz Journey** - Measure quiz effectiveness and conversion
2. **Navigation** - Understand how users discover products
3. **Product Pages** - Track engagement and preference patterns
4. **Purchase Intent** - Monitor conversion funnel
5. **Content Engagement** - Identify what drives decisions

### Why This Matters

**Business Questions We'll Answer:**

- Does the quiz drive purchases? What's the conversion rate?
- Which products/protocols convert best?
- Where do users drop off in the funnel?
- Which navigation paths drive the most conversions?
- What content sections drive engagement?
- Subscription vs one-time purchase preferences?

**Decision-Making Value:**

- Optimize quiz flow and questions
- Improve navigation UX
- A/B test product pages
- Optimize pricing/pack size strategy
- Identify content that converts

---

## Rollout map (phases → states)

This guide is designed to be **shipped incrementally**. Each phase is broken into **states** so you can always answer:

- **What do we do next?**
- **What do we learn immediately?**
- **When is this “done enough” to move on?**

### How to use this map

- If you’re unsure what to implement next, pick the **highest phase** where you’re not yet at State C.
- If you need to diagnose drop-off, prioritize states marked **(diagnostics)**.
- If you need to improve conversion rate quickly, prioritize states marked **(conversion)**.

### Current recommendation order (most DTC-impact first)

**Phase 1 (Quiz funnel)** → **Phase 4 (Add-to-cart + cart view)** → **Phase 2 (Navigation)** → **Phase 3 (Product page engagement)** → **Phase 5 (Content)**

### Rollout checklist (tick as you ship)

- ✅ **Phase 1A (conversion)**: Quiz start → complete → results viewed - **Completed 2026-01-23**
- ✅ **Phase 1B (conversion)**: Results CTAs clicked - **Completed 2026-01-23**
- ✅ **Phase 1C (diagnostics)**: Question-level drop-off / time-per-question - **Completed 2026-01-23**

- 🟡 **Phase 4A (conversion)**: Add to cart (with product context + source) - **In Progress 2026-01-23**
  - ✅ Infrastructure: Tracking functions implemented, events firing
  - ✅ Triple Whale AddToCart tracking working
  - ✅ Vercel Analytics purchase:add_to_cart tracking working
  - ⚠️ Components not yet passing metadata (location, source, sessionId)
  - ⚠️ Events currently using default values ("unknown" location, "direct" source)
- **Phase 4B (conversion)**: Cart viewed / opened
- **Phase 4C (diagnostics)**: Option selection → add-to-cart attribution

- **Phase 2A (discovery)**: Shop menu opened
- **Phase 2B (discovery)**: Shop menu section hover
- **Phase 2C (discovery/conversion)**: Shop menu item click + CTA clicks

- **Phase 3A (baseline)**: Product page view (formula + protocol)
- **Phase 3B (conversion support)**: Product option selected (tier/pack/purchase type)
- **Phase 3C (diagnostics)**: Section viewed (scroll depth / content engagement)

- **Phase 5A (diagnostics)**: Key component viewed (case studies / testimonials / benefits)
- **Phase 5B (diagnostics)**: FAQ expand
- **Phase 5C (diagnostics)**: Testimonial/case-study view details (athlete / protocol mapping)

---

## Phase 1: Quiz Funnel ⭐ **START HERE**

**Priority:** Highest - This is your primary conversion tool

**Goal:** Measure quiz effectiveness and conversion from quiz → purchase

**Status:** ✅ **COMPLETED** (2026-01-23)

- Phase 1A: ✅ Implemented
- Phase 1B: ✅ Implemented
- Phase 1C: ✅ Implemented

**Implementation Notes:**

- All events track `sessionId` for correlation with Convex data
- Source tracking extracts from referrer and UTM parameters
- Time tracking uses sessionStorage for cross-page persistence
- CTA tracking includes location (results_page vs sticky_footer)
- Question tracking includes return visits and time-per-question

### Phase 1 states (ship in this order)

#### Phase 1A — Minimal quiz funnel (conversion)

**Do**

- Track **`quiz:started`**
- Track **`quiz:completed`**
- Track **`quiz:results_viewed`**
- Store and reuse **`quizSessionId`**, **quiz start timestamp**, and **quiz source** (so later events can reference them)

**You get (immediately)**

- Quiz start rate, completion rate, time-to-complete
- Results view rate
- Breakdown by UTM/referrer/source

**Exit criteria**

- You can produce a weekly chart of: `started → completed → results_viewed`
- You can segment those rates by **source** (quiz entry point / UTMs)

**Next**

- Go to **Phase 1B** if you want to improve results-page conversion
- Or jump to **Phase 4A** if you want to measure revenue intent (add-to-cart) ASAP

#### Phase 1B — Results → product intent (conversion)

**Do**

- Track **`quiz:result_cta_clicked`** for:
  - View protocol
  - Add to cart (if available on results)
  - Explore other protocols

**You get (immediately)**

- Which results-page CTA drives the highest click-through
- How long users spend on results before acting

**Exit criteria**

- You can report: results-page CTR by CTA type + recommended protocol

**Next**

- Go to **Phase 4A** (add-to-cart) to tie quiz → purchase intent together
- Or go to **Phase 1C** if completion is low and you need drop-off diagnostics

#### Phase 1C — Drop-off diagnosis (diagnostics)

**Do**

- Track **`quiz:question_viewed`** (and optionally Vercel-side `quiz:answer_selected` if you want _journey_ reporting there too)

**You get (immediately)**

- Exact questions where people abandon
- Time-per-question and “confusion” signals

**Exit criteria**

- You can rank questions by: view count, abandonment, time spent

**Next**

- Use Convex (answers) + Vercel (drop-off timing) together to change copy/ordering/questions

---

### Phase 1 events (reference)

#### 1. `quiz:started`

**What:** User begins the quiz

**When:** On quiz page mount (first question visible)

**Properties (8):**

```typescript
{
  source: string,              // "menu", "homepage_cta", "product_page", "direct"
  referrer: string,            // UTM params or page path
  sessionId: string,           // Link to Convex session (from useQuizAnalytics)
  timestamp: number,           // Unix timestamp
  userAgent?: string,          // Browser/device info
  previousPage?: string,       // Where they came from
  utm_source?: string,         // UTM tracking
  utm_medium?: string          // UTM tracking
}
```

**Why Track:**

- Measure quiz entry points
- Calculate quiz start rate by source
- Identify which traffic sources drive quiz engagement
- Link to Convex session for detailed analysis

**Implementation Location:**

- `app/quiz/page.tsx` - On component mount, after Convex session starts

---

#### 2. `quiz:question_viewed`

**What:** User views a specific question

**When:** When question changes (useEffect on currentQuestionIndex)

**Properties (8):**

```typescript
{
  questionNumber: number,      // 1, 2, 3, etc.
  questionId: string,          // Unique question identifier
  sessionId: string,           // Link to Convex
  timeOnPage: number,          // Seconds since last question
  totalQuestions: number,      // Total questions in quiz
  progress: number,            // Percentage complete (questionNumber / totalQuestions)
  previousAnswerTime?: number, // Time spent on previous question
  isReturning?: boolean       // Did they go back to this question?
}
```

**Why Track:**

- Identify drop-off points (which questions cause abandonment)
- Measure time per question (engagement indicator)
- Find confusing questions that take too long
- Calculate completion rate by question

**Implementation Location:**

- `app/quiz/page.tsx` - In useEffect that tracks currentQuestionIndex

---

#### 3. `quiz:answer_selected`

**What:** User selects an answer

**When:** When handleAnswerSelect is called

**Properties (8):**

```typescript
{
  questionNumber: number,      // Current question
  questionId: string,           // Question identifier
  answerValue: string,          // Selected answer value
  answerLabel: string,          // Human-readable answer
  sessionId: string,           // Link to Convex
  timeSpentMs: number,          // Milliseconds on this question
  isFirstAttempt: boolean,     // Did they change their answer?
  measures: string             // What this question measures (from quizData)
}
```

**Why Track:**

- Measure answer patterns (which answers are most common)
- Identify questions where users change answers (confusion indicator)
- Link to Convex for detailed response analysis
- Calculate average time per answer

**Implementation Location:**

- `app/quiz/page.tsx` - In handleAnswerSelect callback

**Note:** You already track this in Convex. Add Vercel tracking alongside for conversion funnel analysis.

---

#### 4. `quiz:completed`

**What:** User finishes the quiz and sees results

**When:** When quiz is submitted and results are calculated

**Properties (8):**

```typescript
{
  recommendedProtocol: "1" | "2" | "3" | "4",  // Top match
  totalQuestions: number,       // Total questions answered
  timeSpentSeconds: number,     // Total time from start to completion
  sessionId: string,            // Link to Convex
  source: string,               // Where quiz was started
  completionRate: number,       // Questions answered / total (usually 1.0)
  topMatchScore: number,        // Percentage match for recommended protocol
  secondMatchScore?: number     // Second best match for comparison
}
```

**Why Track:**

- Measure quiz completion rate (started → completed)
- Calculate average completion time
- Identify which recommended protocols are most common
- Link to results page view for conversion tracking

**Implementation Location:**

- `app/quiz/page.tsx` - In handleSubmit callback, after results calculated

---

#### 5. `quiz:results_viewed`

**What:** User views the quiz results page

**When:** On quiz results page mount

**Properties (8):**

```typescript
{
  recommendedProtocol: "1" | "2" | "3" | "4",  // Top match
  topMatchScore: number,        // Percentage match
  sessionId: string,            // Link to Convex
  timeToResults: number,         // Seconds from quiz start to results view
  source: string,               // Where quiz was started
  allProtocolScores: string,    // JSON string of all protocol scores
  quizCompletionTime: number,   // Time spent in quiz
  isReturning?: boolean         // Did they come back to results?
}
```

**Why Track:**

- Measure results page engagement (completed → viewed results)
- Calculate time from quiz start to results view
- Identify if users return to results page
- Link to product page views for conversion tracking

**Implementation Location:**

- `app/quiz/results/page.tsx` - On component mount, after results loaded

---

#### 6. `quiz:result_cta_clicked`

**What:** User clicks a CTA from results page

**When:** When user clicks "View Protocol", "Add to Cart", or "Explore Other Protocols"

**Properties (8):**

```typescript
{
  recommendedProtocol: "1" | "2" | "3" | "4",  // What was recommended
  ctaType: "view_protocol" | "add_to_cart" | "explore_other",
  sessionId: string,            // Link to Convex
  location: "results_page" | "sticky_footer",  // Where CTA was clicked
  destination?: string,         // Where they're going (protocol ID, etc.)
  timeOnResults: number,        // Seconds on results page before click
  source: string,               // Where quiz was started
  topMatchScore: number         // Match score for recommended protocol
}
```

**Why Track:**

- Measure conversion from results to product interest
- Identify which CTAs are most effective
- Calculate click-through rate from results
- Link to product page views and add-to-cart events

**Implementation Location:**

- `app/quiz/results/page.tsx` - In handleProtocolSelect, handleAddToCart, and other CTA handlers

---

### Phase 1 Metrics to Calculate

**Quiz Effectiveness:**

- Quiz start rate: `quiz:started` / total visitors
- Quiz completion rate: `quiz:completed` / `quiz:started`
- Results engagement: `quiz:results_viewed` / `quiz:completed`
- CTA click rate: `quiz:result_cta_clicked` / `quiz:results_viewed`

**Conversion Funnel:**

- Quiz → Purchase: `purchase:add_to_cart` (where source = "quiz") / `quiz:completed`
- Results → Product View: `product:page_view` (where source = "quiz") / `quiz:results_viewed`

**Time Metrics:**

- Average quiz completion time
- Average time to results
- Average time on results page before CTA click

---

## Phase 2: Navigation & Discovery

**Priority:** High - Understand how users find products

**Goal:** Measure navigation effectiveness and discover which paths drive conversions

### Phase 2 states (ship in this order)

#### Phase 2A — Menu opens baseline (discovery)

**Do**

- Track **`navigation:shop_menu_open`**

**You get**

- How often the shop mega-menu is used
- Which pages trigger shop exploration

**Exit criteria**

- You can report menu open rate by page + device (desktop/mobile)

**Next**

- Phase 2B (what users explore inside the menu)

#### Phase 2B — Menu exploration (discovery)

**Do**

- Track **`navigation:shop_menu_section_hover`**

**You get**

- Which section gets attention (protocols vs formulas vs quiz)

**Exit criteria**

- You can report section share-of-attention and typical exploration sequence

**Next**

- Phase 2C (click-through to destinations)

#### Phase 2C — Menu + CTA click-through (discovery/conversion)

**Do**

- Track **`navigation:shop_menu_item_click`**
- Track **`navigation:cta_click`** for key CTAs (homepage, product pages, results page, nav)

**You get**

- Which menu items/CTAs actually drive traffic (and later conversion)

**Exit criteria**

- You can rank: menu items clicked, CTAs clicked, and destination pages reached

**Next**

- Pair with **Phase 3A** (product page views) and **Phase 4A** (add-to-cart) to measure conversion by navigation path

---

### Phase 2 events (reference)

### Events to Track

#### 1. `navigation:shop_menu_open`

**What:** User opens the shop mega menu (desktop hover or mobile click)

**When:** When shopDropdownOpen becomes true

**Properties (8):**

```typescript
{
  source: "desktop" | "mobile",  // Device type
  trigger: "hover" | "click",    // How menu was opened
  currentPage: string,            // Page path where menu opened
  referrer?: string,              // Where they came from
  timestamp: number,              // When menu opened
  scrollPosition?: number,        // How far down page
  utm_source?: string,            // UTM tracking
  utm_medium?: string            // UTM tracking
}
```

**Why Track:**

- Measure menu engagement (how often users open it)
- Identify which pages drive menu opens
- Compare desktop vs mobile behavior
- Calculate menu open rate

**Implementation Location:**

- `app/components/navigation/Navigation.tsx` - When shopDropdownOpen changes to true

---

#### 2. `navigation:shop_menu_section_hover`

**What:** User hovers over a section in the shop menu (protocols, formulas, quiz)

**When:** When hoveredSection changes

**Properties (8):**

```typescript
{
  section: "protocols" | "formulas" | "quiz",  // Which section
  source: "desktop" | "mobile",
  timeSinceMenuOpen: number,     // Seconds since menu opened
  previousSection?: string,      // Previous section (if changed)
  menuOpenDuration: number,     // Total time menu has been open
  currentPage: string,            // Page path
  position?: number,              // Section position (1, 2, 3)
  isFirstHover: boolean           // First section hovered?
}
```

**Why Track:**

- Identify which sections get the most attention
- Measure section engagement patterns
- Find which sections users explore before clicking
- Calculate hover-to-click conversion

**Implementation Location:**

- `app/components/navigation/Navigation.tsx` - When hoveredSection changes

---

#### 3. `navigation:shop_menu_item_click`

**What:** User clicks an item in the shop menu (protocol, formula, quiz, learn more link)

**When:** When user clicks a ProtocolCard, FormulaCardCompact, quiz link, or learn more link

**Properties (8):**

```typescript
{
  itemType: "protocol" | "formula" | "quiz" | "learn_more",  // What was clicked
  itemId: string,              // Protocol ID ("1", "2", etc.) or Formula ID ("01", "02")
  section: "protocols" | "formulas" | "quiz",  // Which menu section
  source: "desktop" | "mobile",
  destination: string,         // URL or path they're going to
  timeInMenu: number,          // Seconds menu was open before click
  hoveredSection: string,      // Which section was visible when clicked
  position?: number            // Item position in grid/list
}
```

**Why Track:**

- Measure which items get clicked most (product popularity)
- Identify which menu sections drive traffic
- Calculate menu engagement → click conversion
- Compare quiz clicks vs direct product clicks

**Implementation Location:**

- `app/components/navigation/ProtocolCard.tsx` - In onClick handler
- `app/components/navigation/FormulaCardCompact.tsx` - In onNavigate handler
- `app/components/navigation/ShopMegaMenuContent.tsx` - In quiz and learn more link handlers

---

#### 4. `navigation:cta_click`

**What:** User clicks any CTA button throughout the site

**When:** When user clicks buttons like "Buy CONKA", "Find Your Protocol", "Start Protocol", etc.

**Properties (8):**

```typescript
{
  ctaText: string,             // Button text or identifier
  location: string,            // "homepage_hero", "footer", "protocol_page", "results_page"
  destination: string,         // URL or anchor they're going to
  source: "desktop" | "mobile",
  currentPage: string,         // Page path where CTA was clicked
  scrollPosition?: number,     // How far down page
  referrer?: string,          // Where they came from
  utm_source?: string         // UTM tracking
}
```

**Why Track:**

- Measure CTA effectiveness across the site
- Identify which CTAs drive the most clicks
- Calculate click-through rates by location
- A/B test CTA copy and placement

**Implementation Location:**

- Various components with CTA buttons:
  - `app/page.tsx` - Homepage CTAs
  - `app/protocol/[id]/page.tsx` - Protocol page CTAs
  - `app/quiz/results/page.tsx` - Results page CTAs
  - Footer components

---

### Phase 2 Metrics to Calculate

**Navigation Effectiveness:**

- Menu open rate: `navigation:shop_menu_open` / total page views
- Section engagement: `navigation:shop_menu_section_hover` / `navigation:shop_menu_open`
- Click-through rate: `navigation:shop_menu_item_click` / `navigation:shop_menu_open`
- CTA click rate: `navigation:cta_click` / page views

**Conversion by Path:**

- Menu → Product view: `product:page_view` (where source = "menu") / `navigation:shop_menu_item_click`
- CTA → Conversion: `purchase:add_to_cart` (where source matches CTA) / `navigation:cta_click`

---

## Phase 3: Product Pages

**Priority:** High - These are where purchase decisions are made

**Goal:** Measure product page engagement and identify what drives conversions

### Phase 3 states (ship in this order)

#### Phase 3A — Product page baseline (baseline)

**Do**

- Track **`product:page_view`** for formula + protocol pages

**You get**

- Which products/protocols are being viewed, and from where (quiz/menu/direct/cta)

**Exit criteria**

- You can report product page views by source and by product/protocol

**Next**

- Phase 3B (preferences) or Phase 4A (add-to-cart) if not done yet

#### Phase 3B — Preference signals (conversion support)

**Do**

- Track **`product:option_selected`** (pack size / tier / purchase type)

**You get**

- What users prefer before purchasing (subscription vs one-time, tier selection, pack sizes)

**Exit criteria**

- You can report top option selections and how often users change options before add-to-cart

**Next**

- Phase 4A (add-to-cart) to connect preference → conversion

#### Phase 3C — Content engagement depth (diagnostics)

**Do**

- Track **`product:section_view`** (hero/benefits/case studies/faq/etc.)

**You get**

- Which content is actually seen (vs just present on the page)

**Exit criteria**

- You can compare converters vs non-converters on “sections viewed”

**Next**

- Phase 5 (component-level engagement) for deeper content insights

---

### Phase 3 events (reference)

### Events to Track

#### 1. `product:page_view`

**What:** User views a product or protocol page

**When:** On page mount (useEffect with empty deps)

**Properties (8):**

```typescript
{
  pageType: "formula" | "protocol",  // Type of product page
  pageId: string,                     // "01", "02" (formulas) or "1", "2", "3", "4" (protocols)
  source: "quiz" | "menu" | "direct" | "cta" | "other",  // How they got here
  referrer?: string,                  // Previous page or UTM
  sessionId?: string,                 // Quiz session ID if from quiz
  timestamp: number,                   // When page viewed
  utm_source?: string,                // UTM tracking
  utm_medium?: string                 // UTM tracking
}
```

**Why Track:**

- Measure product page traffic by source
- Calculate quiz → product view conversion
- Identify which products get the most views
- Track traffic sources and attribution

**Implementation Location:**

- `app/protocol/[id]/page.tsx` - On component mount
- `app/conka-flow/page.tsx` - On component mount
- `app/conka-clarity/page.tsx` - On component mount

---

#### 2. `product:section_view`

**What:** User scrolls to and views a specific section of a product page

**When:** When section enters viewport (Intersection Observer)

**Properties (8):**

```typescript
{
  pageType: "formula" | "protocol",
  pageId: string,
  section: "hero" | "benefits" | "case_studies" | "faq" | "calendar" | "ingredients",
  timeOnPage: number,          // Seconds since page load
  scrollDepth: number,         // Percentage of page scrolled
  source: string,               // How they got to page
  isMobile: boolean,           // Device type
  previousSection?: string     // Previous section viewed
}
```

**Why Track:**

- Identify which sections get the most attention
- Measure content engagement depth
- Find which sections users spend time on
- Calculate scroll depth and engagement

**Implementation Location:**

- `app/protocol/[id]/page.tsx` - Use Intersection Observer on section elements
- `app/conka-flow/page.tsx` - Use Intersection Observer on section elements
- `app/conka-clarity/page.tsx` - Use Intersection Observer on section elements

**Implementation Note:** Use Intersection Observer API to track when sections enter viewport. Track once per page load (not on every scroll).

---

#### 3. `product:option_selected`

**What:** User changes pack size, tier, or purchase type (subscription vs one-time)

**When:** When selectedPack, selectedTier, or purchaseType changes

**Properties (8):**

```typescript
{
  pageType: "formula" | "protocol",
  pageId: string,
  optionType: "pack_size" | "tier" | "purchase_type",  // What changed
  selectedValue: string,        // New value ("12", "pro", "subscription")
  previousValue?: string,       // Previous value (if changed)
  timeOnPage: number,           // Seconds since page load
  source: string,               // How they got to page
  location: string,             // Where option was changed ("hero", "sticky_footer")
  hasViewedPricing?: boolean    // Did they view pricing section?
}
```

**Why Track:**

- Measure preference patterns (which options are most popular)
- Identify which options users explore before purchasing
- Calculate option change frequency (indicates consideration)
- A/B test pricing and option presentation

**Implementation Location:**

- `app/protocol/[id]/page.tsx` - In setSelectedTier and setPurchaseType handlers
- `app/conka-flow/page.tsx` - In setSelectedPack and setPurchaseType handlers
- `app/conka-clarity/page.tsx` - In setSelectedPack and setPurchaseType handlers

---

### Phase 3 Metrics to Calculate

**Product Page Performance:**

- Page view rate by source: `product:page_view` grouped by source
- Section engagement: `product:section_view` / `product:page_view`
- Average sections viewed per page
- Scroll depth distribution

**Option Preferences:**

- Most selected pack sizes
- Subscription vs one-time preference
- Tier selection patterns
- Option change frequency

**Conversion Indicators:**

- Product view → Add to cart: `purchase:add_to_cart` / `product:page_view`
- Section views → Add to cart: Correlation between sections viewed and conversion

---

## Phase 4: Purchase Intent

**Priority:** Critical - Direct conversion tracking

**Goal:** Measure purchase funnel and identify conversion drivers

**Status:** 🟡 **IN PROGRESS** (2026-01-23)

- Phase 4A: 🟡 Infrastructure complete, components need metadata updates

### Phase 4 states (ship in this order)

#### Phase 4A — Add-to-cart with context (conversion)

**Status:** 🟡 **IN PROGRESS** (2026-01-23)

**Completed:**

- ✅ Tracking infrastructure implemented in `app/lib/analytics.ts`
- ✅ Triple Whale AddToCart tracking implemented in `app/lib/tripleWhale.ts`
- ✅ Product metadata extraction implemented in `app/lib/productMetadata.ts`
- ✅ CartContext updated to fire both tracking events after successful cart update
- ✅ `addToCart` function signature extended to accept optional metadata parameter

**Remaining:**

- ⚠️ Update components to pass metadata when calling `addToCart`:
  - `app/quiz/results/page.tsx` - Pass location ("results_page" | "sticky_footer"), source ("quiz"), sessionId
  - `app/protocol/[id]/page.tsx` - Pass location ("hero" | "sticky_footer"), source ("direct" | "quiz" | "menu")
  - `app/conka-flow/page.tsx` - Pass location ("hero" | "sticky_footer"), source ("direct" | "menu")
  - `app/conka-clarity/page.tsx` - Pass location ("hero" | "sticky_footer"), source ("direct" | "menu")
  - `app/formula-01/page.tsx` - Pass location ("hero" | "sticky_footer"), source ("direct" | "menu")
  - Other components calling `addToCart` - Add metadata where applicable

**Do**

- Track **`purchase:add_to_cart`** with full context (product, option, source, location)

**You get**

- The single most important DTC metric: **purchase intent** by product + source + option

**Exit criteria**

- You can answer: “Which product + option + source drives the most add-to-carts?”

**Next**

- Phase 4B to measure cart engagement and abandonment signals

#### Phase 4B — Cart viewed / opened (conversion)

**Do**

- Track **`purchase:cart_viewed`**

**You get**

- Add-to-cart → cart-open rate (a strong intent quality check)

**Exit criteria**

- You can report: cart opens per add-to-cart, by source and product

**Next**

- Phase 4C (if you want attribution from option-selection → add-to-cart)

#### Phase 4C — Option → add-to-cart attribution (diagnostics)

**Do**

- Ensure option selection events can be tied to add-to-cart in reporting (via consistent `pageId`, `pageType`, and session/source fields)

**You get**

- Which option changes are “good” (lead to add-to-cart) vs “confusing” (lead to exits)

**Exit criteria**

- You can compare converters vs non-converters on option exploration patterns

**Next**

- Consider tracking checkout initiation/completion (outside scope of this doc unless you add a checkout redirect event)

---

### Phase 4 events (reference)

### Events to Track

#### 1. `purchase:add_to_cart`

**What:** User adds an item to cart

**When:** When addToCart function succeeds

**Properties (8):**

```typescript
{
  productType: "formula" | "protocol",  // Type of product
  productId: string,                  // "01", "02", "1", "2", "3", "4"
  variantId: string,                   // Shopify variant ID
  packSize?: "4" | "8" | "12" | "28", // For formulas
  tier?: "starter" | "pro" | "max",   // For protocols
  purchaseType: "subscription" | "one-time",
  location: string,                    // "hero", "sticky_footer", "results_page", "calendar"
  source: "quiz" | "menu" | "direct" | "cta",  // How they got here
  price: number,                       // Product price
  sessionId?: string                   // Quiz session ID if from quiz
}
```

**Why Track:**

- Measure conversion rate by product
- Identify which options convert best
- Calculate conversion by source (quiz vs direct)
- Track average order value
- Measure location effectiveness (where add-to-cart was clicked)

**Implementation Location:**

- `app/context/CartContext.tsx` - In addToCart function, after successful cart update ✅ **DONE**
- Components calling `addToCart` - Pass metadata parameter ⚠️ **TODO**

**Implementation Status:**
✅ **Infrastructure Complete** (2026-01-23)

- `addToCart` function signature extended to accept optional metadata object
- Tracking functions implemented and firing automatically
- Product metadata extraction working (productType, productId, packSize, tier)

⚠️ **Components Need Updates:**

- Components currently calling `addToCart` without metadata
- Events are firing but using default values ("unknown" location, "direct" source)
- Need to update components to pass metadata:
  ```typescript
  addToCart(variantId, quantity, sellingPlanId, {
    location: "hero", // or "sticky_footer", "results_page", "calendar"
    source: "quiz", // or "menu", "direct", "cta"
    sessionId: quizSessionId, // if from quiz
  });
  ```

**Files to Update:**

- `app/quiz/results/page.tsx` - Has location and sessionId available, needs to pass them
- `app/protocol/[id]/page.tsx` - Add location and source detection
- `app/conka-flow/page.tsx` - Add location and source detection
- `app/conka-clarity/page.tsx` - Add location and source detection
- `app/formula-01/page.tsx` - Add location and source detection
- Other components with add-to-cart buttons

---

#### 2. `purchase:cart_viewed`

**What:** User opens the cart drawer

**When:** When cart drawer opens (isOpen becomes true)

**Properties (8):**

```typescript
{
  itemCount: number,            // Number of items in cart
  totalValue: number,           // Total cart value
  hasSubscription: boolean,      // Does cart contain subscription items?
  source: "add_to_cart" | "manual" | "auto",  // How cart was opened
  currentPage: string,           // Page where cart was opened
  timeSinceAddToCart?: number,  // Seconds since last add-to-cart (if applicable)
  cartItems: string,             // JSON string of cart items (productIds)
  isFirstView: boolean           // First time viewing cart this session?
}
```

**Why Track:**

- Measure cart engagement
- Calculate add-to-cart → cart view rate
- Identify cart abandonment patterns
- Measure time between add-to-cart and cart view

**Implementation Location:**

- `app/context/CartContext.tsx` - When setIsOpen(true) is called
- `app/components/CartDrawer.tsx` - On component mount (if needed)

---

#### 3. `purchase:option_selected`

**What:** User changes an option (pack size, tier, purchase type) on a product page

**When:** When selectedPack, selectedTier, or purchaseType changes

**Properties (8):**

```typescript
{
  pageType: "formula" | "protocol",
  pageId: string,
  optionType: "pack_size" | "tier" | "purchase_type",
  selectedValue: string,
  previousValue?: string,
  timeOnPage: number,
  source: string,
  location: string,              // Where option was changed
  hasAddedToCart: boolean        // Did they add to cart after this change?
}
```

**Why Track:**

- Measure option exploration patterns
- Identify which options lead to purchases
- Calculate option change → add-to-cart conversion
- A/B test option presentation

**Implementation Location:**

- Same as `product:option_selected` (Phase 3)
- **Note:** This is the same event as `product:option_selected`. Consider consolidating or using different event names for clarity.

---

### Phase 4 Metrics to Calculate

**Conversion Rates:**

- Add-to-cart rate: `purchase:add_to_cart` / `product:page_view`
- Cart view rate: `purchase:cart_viewed` / `purchase:add_to_cart`
- Source conversion: `purchase:add_to_cart` grouped by source

**Product Performance:**

- Conversion by product: `purchase:add_to_cart` grouped by productId
- Conversion by option: `purchase:add_to_cart` grouped by packSize/tier/purchaseType
- Average order value: Average price from `purchase:add_to_cart`

**Funnel Analysis:**

- Product view → Add to cart → Cart view → Checkout (if checkout tracking added)

---

## Phase 5: Engagement & Content

**Priority:** Medium - Optimization and content insights

**Goal:** Identify which content drives engagement and conversions

### Phase 5 states (ship in this order)

#### Phase 5A — Component baseline (diagnostics)

**Do**

- Track **`engagement:component_view`** for the highest-signal components (case studies, testimonials, benefits)

**You get**

- Which trust/education content is actually being seen

**Exit criteria**

- You can report component view rates by page + device

**Next**

- Phase 5B for objection handling (FAQs)

#### Phase 5B — Objection signals (diagnostics)

**Do**

- Track **`engagement:faq_expand`**

**You get**

- What users worry about (shipping, subscription, ingredients, etc.)

**Exit criteria**

- You can rank FAQs by opens and correlate with conversion

**Next**

- Phase 5C if you want granular social-proof reporting

#### Phase 5C — Social proof granularity (diagnostics)

**Do**

- Track **`engagement:testimonial_view`** with athlete/protocol mapping where possible

**You get**

- Which stories resonate (and correlate with add-to-cart)

**Exit criteria**

- You can rank testimonials/case studies by attention and conversion correlation

**Next**

- Use this to curate/reorder social proof on product pages

---

### Phase 5 events (reference)

### Events to Track

#### 1. `engagement:component_view`

**What:** User views a key component (testimonials, case studies, benefits, etc.)

**When:** When component enters viewport (Intersection Observer)

**Properties (8):**

```typescript
{
  componentType: "testimonials" | "case_studies" | "benefits" | "ingredients" | "faq",
  location: string,              // Page path
  timeOnPage: number,            // Seconds since page load
  scrollDepth: number,           // Percentage of page scrolled
  source: string,                // How they got to page
  isMobile: boolean,             // Device type
  componentId?: string,          // Specific component identifier
  previousComponent?: string     // Previous component viewed
}
```

**Why Track:**

- Identify which content components get attention
- Measure content engagement depth
- Find which testimonials/case studies drive interest
- Calculate content → conversion correlation

**Implementation Location:**

- Various components throughout the site:
  - Testimonials components
  - Case studies components
  - Benefits sections
  - Ingredients sections

---

#### 2. `engagement:faq_expand`

**What:** User expands an FAQ item

**When:** When FAQ item is expanded (onClick handler)

**Properties (8):**

```typescript
{
  faqCategory: string,           // FAQ category (Science, Shipping, Subscription, etc.)
  faqQuestion: string,           // Question text or ID
  location: string,               // Page path
  timeOnPage: number,            // Seconds since page load
  source: string,                 // How they got to page
  isMobile: boolean,              // Device type
  scrollDepth: number,            // How far down page
  previousFaqExpanded?: string    // Previous FAQ expanded
}
```

**Why Track:**

- Identify which questions users have
- Measure FAQ engagement
- Find common concerns or questions
- Calculate FAQ → conversion correlation

**Implementation Location:**

- `app/page.tsx` - In FAQ expand handler (setExpandedFaq)
- FAQ components on product pages

---

#### 3. `engagement:testimonial_view`

**What:** User views a specific testimonial or case study

**When:** When testimonial/case study enters viewport or is clicked

**Properties (8):**

```typescript
{
  athleteName?: string,          // Athlete/professional name
  testimonialType: "athlete" | "professional" | "customer",
  location: string,               // Page path
  timeOnPage: number,            // Seconds since page load
  source: string,                 // How they got to page
  isMobile: boolean,              // Device type
  componentType: "testimonial" | "case_study",
  protocolId?: string            // Associated protocol (if applicable)
}
```

**Why Track:**

- Identify which testimonials get attention
- Measure social proof effectiveness
- Find which athletes/professionals resonate
- Calculate testimonial → conversion correlation

**Implementation Location:**

- Testimonials components
- Case studies components

---

### Phase 5 Metrics to Calculate

**Content Engagement:**

- Component view rate: `engagement:component_view` / page views
- FAQ engagement: `engagement:faq_expand` / page views
- Testimonial engagement: `engagement:testimonial_view` / page views

**Content Effectiveness:**

- Component views → Conversion: Correlation between component views and add-to-cart
- FAQ engagement → Conversion: Do users who expand FAQs convert better?

---

## Implementation Notes

### Session Linking (Convex ↔ Vercel)

**Strategy:** Use the same `sessionId` in both systems to correlate data.

**Implementation:**

```typescript
// In quiz page
const { sessionId } = useQuizAnalytics(); // From Convex
sessionStorage.setItem("quizSessionId", sessionId);

// When tracking with Vercel
const sessionId = sessionStorage.getItem("quizSessionId");
trackEvent({
  name: "quiz:completed",
  properties: {
    sessionId: sessionId, // Links to Convex data
    // ...
  },
});
```

**Benefits:**

- Correlate Vercel conversion events with Convex detailed quiz data
- Answer: "Which quiz answers lead to purchases?"
- Answer: "Do users who spend more time on question X convert better?"

---

### Source Tracking

**Strategy:** Track where users come from at each stage.

**Implementation:**

```typescript
// When quiz starts
const source = document.referrer || "direct";
sessionStorage.setItem("quizSource", source);

// When viewing results
const quizSource = sessionStorage.getItem("quizSource");
trackEvent({
  name: "quiz:results_viewed",
  properties: {
    source: quizSource, // Where quiz was started
    // ...
  },
});
```

---

### Time Tracking

**Strategy:** Track time between stages for funnel analysis.

**Implementation:**

```typescript
// When quiz starts
sessionStorage.setItem("quizStartTime", Date.now().toString());

// When quiz completes
const startTime = parseInt(sessionStorage.getItem("quizStartTime") || "0");
const timeSpent = Math.floor((Date.now() - startTime) / 1000);

trackEvent({
  name: "quiz:completed",
  properties: {
    timeSpentSeconds: timeSpent,
    // ...
  },
});
```

---

### Event Naming Convention

**Format:** `category:action`

**Examples:**

- `quiz:started`
- `navigation:shop_menu_open`
- `product:page_view`
- `purchase:add_to_cart`
- `engagement:component_view`

**Benefits:**

- Groups events in Vercel Analytics dashboard
- Clear hierarchy and organization
- Easy to filter and analyze

---

### Property Naming

**Guidelines:**

- Use snake_case for property names
- Be consistent across events
- Use descriptive names
- Include units in names when applicable (e.g., `timeSpentSeconds`, not `time`)

**Examples:**

- ✅ `timeSpentSeconds` (clear unit)
- ✅ `productId` (descriptive)
- ❌ `time` (unclear unit)
- ❌ `id` (not descriptive)

---

### Error Handling

**Strategy:** Fail silently in production, log in development.

**Implementation:**

```typescript
try {
  trackEvent(event);
} catch (error) {
  if (process.env.NODE_ENV === "development") {
    console.error("Analytics tracking error:", error);
  }
  // Fail silently in production
}
```

---

### Testing

**Strategy:** Test analytics in development before deploying.

**Checklist:**

- [ ] Events fire at correct times
- [ ] Properties are correct
- [ ] Session linking works
- [ ] Source tracking works
- [ ] Time tracking is accurate
- [ ] No console errors

---

## Next Steps

1. **Start with Phase 1** (Quiz Funnel) - Highest priority
2. **Implement Phase 2** (Navigation) - Understand discovery
3. **Add Phase 3** (Product Pages) - Measure engagement
4. **Complete Phase 4** (Purchase Intent) - Track conversions
5. **Finish with Phase 5** (Engagement) - Optimize content

**After Implementation:**

- Set up Vercel Analytics dashboards
- Review data weekly
- Identify optimization opportunities
- Iterate based on insights

---

## Questions to Answer with Analytics

**Quiz Effectiveness:**

- Does the quiz drive purchases?
- Which recommended protocols convert best?
- Do users who complete the quiz faster convert better?
- Which entry points drive the most quiz completions?

**Product Performance:**

- Which products/protocols convert best?
- Which pack sizes/tiers are preferred?
- Subscription vs one-time conversion rates?

**Navigation:**

- Which menu items drive traffic?
- Quiz vs direct navigation conversion rates?
- Which CTAs are most effective?

**Content:**

- Which content sections drive engagement?
- Which testimonials/case studies resonate?
- Do users who engage with content convert better?

---

**Last Updated:** 2025-01-23
**Version:** 1.0
