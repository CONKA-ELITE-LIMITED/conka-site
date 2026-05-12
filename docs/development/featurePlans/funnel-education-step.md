# Funnel -- Education-First 4-Step Flow

## Problem

The current funnel (`/funnel`) is a 2-step flow: product selector then cadence selector. Two months of live data show poor conversion. Cold Meta traffic hits a price before understanding what they are buying, and bounces. An education step before product selection should increase intent and improve conversion.

## Who it serves

Cold paid Meta traffic with no prior brand awareness.

## Business impact

Direct conversion improvement on the primary acquisition funnel. More educated buyers also mean lower return rates and better LTV.

## Appetite

1.5 days

## Approach

Extend the existing 2-step client-side state machine to 4 steps. Step 1 is a new education slide with progressive disclosure. Steps 2 and 3 are upgraded versions of the existing product and cadence selectors. Step 4 is a new summary screen with an app upsell section and a single checkout CTA.

**Design system:** `brand-clinical` (brand-base.css) -- matches existing funnel

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Core 4-step flow | Not Started |
| 2 | Per-step analytics | Not Started |
| 3 | "Both" full enablement (if any Shopify work needed later) | Future |

---

## Phase 1 -- Core 4-step flow (ACTIVE)

### Tasks

1. **[State] Extend step machine from 2 to 4 steps**
   - Add `education` (step 1) and `summary` (step 4); renumber existing steps to 2 and 3
   - Update back/forward navigation and step indicator
   - Complexity: Small
   - Files: `app/funnel/FunnelClient.tsx`, step indicator component

2. **[Component] EducationStep -- new step 1**
   - Two cards (Flow and Clear) with 2-3 line benefit summary and expandable "learn more" section
   - Pull copy from existing `formulaContent` in `productData.ts`
   - Progressive disclosure: CSS-only collapsible, no library
   - Single "Continue" CTA at the bottom
   - Complexity: Medium
   - Files: new `app/funnel/steps/EducationStep.tsx`

3. **[Component] ProductSelector upgrade -- step 2**
   - Lead with formula name and benefit headline, not price
   - Price moves to smaller supporting line below the card
   - Both is the recommended/hero option
   - Complexity: Small-Medium
   - Files: existing product selector component in `app/funnel/`

4. **[Component] SummaryStep -- new step 4**
   - Section (a): order recap -- product name, cadence, delivery frequency, savings vs one-time
   - Section (b): app section -- personalised brain insights, 100-day guarantee, the Cade app
   - Section (c): single "Buy now" CTA -- adds to cart, redirects to `cart.checkoutUrl`
   - CTA must be sticky or above fold on mobile (390px)
   - Complexity: Medium-Large
   - Files: new `app/funnel/steps/SummaryStep.tsx`

5. **[Data] funnelData summary helpers**
   - Add `getSummaryDetails(product, cadence)` returning: formatted price, delivery frequency label, savings amount vs one-time, first delivery text
   - Keeps SummaryStep dumb
   - Complexity: Small
   - Files: `app/lib/funnelData.ts`

---

## Phase 2 -- Per-step analytics (ACTIVE)

### Tasks

6. **[Analytics] Step entry events**
   - Fire `funnel_step_view` Vercel Analytics event on each step mount with `{ step: 1|2|3|4, product?, cadence? }`
   - Step 4 also fires `InitiateCheckout` Meta Pixel event on CTA click (not mount)
   - Complexity: Small
   - Files: `app/funnel/FunnelClient.tsx`, `app/lib/analytics.ts`, `app/lib/metaPixel.ts`

---

## Rabbit holes

- **Education copy:** Use existing `formulaContent` from productData -- do not write net-new copy in this scope. Iterate after launch.
- **Step animations:** CSS `opacity` + `translateY` only. No animation library.
- **Delivery schedule visualization:** Single line of text only ("Your first box ships within 3 days, then monthly"). No calendar or timeline.

## No-gos

- No URL-per-step routing (client-side state only)
- No new Shopify API calls (use existing cart flow)
- No A/B testing infrastructure
- No changes to landing page or any other page

## Risks

- Mobile progressive disclosure: expandable sections need min 44px touch targets. Test at 390px before marking done.
- Analytics event naming: align `funnel_step_view` naming with Kristian's dashboard spec before Phase 2 ships.

## Open questions

- Pricing in step 2: muted (still present, smaller) vs hidden entirely. Recommendation: muted -- hiding and revealing in summary can feel like bait-and-switch.
- Education copy source: use existing `formulaContent` for now and iterate after launch.

---

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| SCRUM-966 | Funnel -- Education-first 4-step flow | 1 | To Do |
| SCRUM-967 | Funnel -- Per-step drop-off analytics | 2 | To Do |
