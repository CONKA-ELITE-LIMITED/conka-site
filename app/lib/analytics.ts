"use client";

import { track } from "@vercel/analytics/react";

/**
 * CONKA Analytics System
 * 
 * Type-safe, centralized analytics tracking for Vercel Analytics.
 * All events are structured to answer key business questions about
 * the landing funnels and conversion journey.
 * 
 * Performance: All tracking is async and non-blocking. Errors fail silently.
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Extract UTM parameters from URL
 */
function getUTMParams(): { utm_source?: string; utm_medium?: string } {
  if (typeof window === "undefined") return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
  };
}

/**
 * Safe tracking wrapper - fails silently in production
 */
// Vercel's track() expects AllowedPropertyValues; `any` keeps callers flexible.
// no-explicit-any is downgraded to warn for cases like this.
function safeTrack(eventName: string, properties: Record<string, any>): void {
  if (typeof window === "undefined") return;
  
  try {
    track(eventName, properties);
    
    // Log events in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Analytics Event:", eventName, properties);
    }
  } catch (error) {
    // Fail silently in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Analytics tracking error:", error);
    }
  }
}

// ===== LANDING SYSTEM TRACKING (/go/[slug]) =====

/**
 * Shared identity props carried on every /go landing event so per-page
 * funnels (which quiz, how far people get) read directly out of Vercel.
 */
interface LandingEventBase {
  slug: string;
  persona: string;
  format: string;
  sessionId: string;
}

/** Fires once on mount of a /go landing page. */
export function trackLandingStarted(params: LandingEventBase): void {
  const utm = getUTMParams();
  safeTrack("landing:started", {
    ...params,
    referrer:
      typeof document !== "undefined"
        ? document.referrer || "direct"
        : "direct",
    ...utm,
  });
}

/** Fires on every screen change; screenIndex is the drop-off marker. */
export function trackLandingScreenViewed(
  params: LandingEventBase & {
    screenIndex: number;
    screenId: string;
    screenKind: string;
    totalScreens: number;
  },
): void {
  safeTrack("landing:screen_viewed", {
    ...params,
    progress: Math.round(
      (params.screenIndex / Math.max(params.totalScreens - 1, 1)) * 100,
    ),
  });
}

export function trackLandingAnswerSelected(
  params: LandingEventBase & {
    screenId: string;
    questionNumber: number;
    totalQuestions: number;
    answerLabel: string;
    answerValue: string;
  },
): void {
  safeTrack("landing:answer_selected", params);
}

export function trackLandingCompleted(
  params: LandingEventBase & {
    resultBucket: string;
    totalQuestions: number;
    timeSpentSeconds: number;
    /** Brain-age scoring mode only */
    brainAge?: number;
    brainAgeGap?: number;
  },
): void {
  safeTrack("landing:completed", params);
}

export function trackLandingResultsViewed(
  params: LandingEventBase & {
    resultBucket: string;
    brainAge?: number;
    brainAgeGap?: number;
  },
): void {
  safeTrack("landing:results_viewed", params);
}

export function trackLandingCtaClicked(
  params: LandingEventBase & { resultBucket: string; destination: string },
): void {
  safeTrack("landing:cta_clicked", params);
}

// ===== LISTICLE TRACKING (/go/[slug], format: "listicle") =====

/**
 * Listicle events carry EXACTLY two properties, respecting the two-property
 * budget documented under FUNNEL TRACKING below: `slug` (which page) and
 * `section` (which part of it).
 *
 * The CTA's position is folded INTO `section` rather than sent as a third
 * property, and nothing is packed into a delimited string. That means one
 * query grouped by `eventData/slug` + `eventData/section` returns the whole
 * matrix with no post-processing:
 *
 *   by=["eventData/slug","eventData/section"]
 *   filter=eventName eq 'listicle:cta_clicked'
 *
 * Section ids are produced by `sectionId()` / `SECTION` in
 * app/components/go/listicle/listicleAnalytics.tsx.
 */
interface ListicleEventBase {
  /** Landing slug, e.g. "adhd-listicle" */
  slug: string;
  /** Body block ("reason_3") or fixed zone ("hero", "bridge", "sticky") */
  section: string;
}

/**
 * Fires once per section per pageview, when that section scrolls into view.
 *
 * This is the DENOMINATOR for the click event. Without it, clicks per section
 * mostly measure how many people scrolled far enough to reach the section, so
 * a low count cannot separate a weak section from a rarely-reached one.
 */
export function trackListicleSectionViewed(params: ListicleEventBase): void {
  safeTrack("listicle:section_viewed", params);
}

/** Fires on CTA click, tagged with the section that carried the CTA. */
export function trackListicleCtaClicked(params: ListicleEventBase): void {
  safeTrack("listicle:cta_clicked", params);
}

/**
 * Fires when a visitor operates an interactive block (symptom picker, segment
 * toggle), i.e. an *active-intent* signal rather than a scroll-past. The choice
 * is folded into `section` (`symptom_<label>`, `segment_<label>`), the same way
 * the CTA position is, so it still respects the two-property budget:
 *
 *   by=["eventData/slug","eventData/section"]
 *   filter=eventName eq 'listicle:interaction'
 *
 * Only presses fire, never the pre-selected default, so a toggle's default
 * option is under-counted relative to the one visitors switch to.
 */
export function trackListicleInteraction(params: ListicleEventBase): void {
  safeTrack("listicle:interaction", params);
}

// ===== CART UPSELL TILE TRACKING (CartDrawer, SCRUM-1201) =====

/**
 * The single-tile cart upsell events. Two properties only (the analytics
 * budget): `type` is the upgrade kind, `product` is the formula the shopper
 * already had (the FROM product), so "flow -> both" and "clear -> both" stay
 * separable without a third property.
 */
interface CartUpsellEvent {
  type: "otp_to_sub" | "single_to_both";
  product: string;
}

/** Fires once when the upsell tile becomes visible in the cart drawer. */
export function trackCartUpsellShown(params: CartUpsellEvent): void {
  safeTrack("cart:upsell_shown", params);
}

/** Fires when the shopper accepts the upsell (before the cart swap runs). */
export function trackCartUpsellAccepted(params: CartUpsellEvent): void {
  safeTrack("cart:upsell_accepted", params);
}

/**
 * The cart path's checkout stage (SCRUM-1243). Fires on a successful Checkout
 * press in the drawer, immediately before the redirect to Shopify-hosted
 * checkout, alongside Meta's InitiateCheckout.
 *
 * Two properties only (the analytics budget): `items` is the number of distinct
 * cart LINES and `value` is the cart subtotal. Note this differs from the Meta
 * InitiateCheckout fired on the same click, whose `num_items` is the summed
 * QUANTITY across lines: a 2-line cart holding 3 units reports items=2 here and
 * num_items=3 there. Both are correct for their own dashboards; do not
 * reconcile them.
 *
 * Currency is deliberately omitted rather than packed in, since the store sells
 * in GBP only; if that changes, pack it into `value` as a string rather than
 * adding a third property.
 *
 * Safe to fire immediately before `window.location.href`: Vercel's insights
 * script posts custom events with `keepalive: true` (verified against the live
 * script, 2026-08-24), so the request survives the navigation. Do NOT "fix"
 * this by deferring the redirect behind a setTimeout; the delay is not needed
 * and it would slow the path to checkout.
 */
export function trackCartCheckoutClicked(params: {
  items: number;
  value: number;
}): void {
  safeTrack("cart:checkout_clicked", {
    items: params.items,
    value: params.value,
  });
}

// ===== B2B PORTAL TRACKING =====

/**
 * Track a B2B teams enquiry submission.
 * Fires once on successful submit of the /professionals application form.
 */
export function trackB2BApplicationSubmitted(params: {
  sport: string;
  squadSize: string;
}): void {
  safeTrack("b2b_application_submitted", {
    sport: params.sport,
    squadSize: params.squadSize,
  });
}

/**
 * Track a B2B order heading to Shopify checkout.
 * Fires when "Buy now" successfully creates a cart on the order page.
 */
export function trackB2BCheckoutStarted(params: {
  totalBoxes: number;
  subtotalExVat: number;
  hasPO: boolean;
}): void {
  safeTrack("b2b_checkout_started", {
    totalBoxes: params.totalBoxes,
    subtotalExVat: params.subtotalExVat,
    hasPO: params.hasPO,
  });
}

/**
 * Track a B2B pay-by-invoice request.
 * Fires when "Pay by invoice" successfully creates a Shopify draft order and
 * sends the invoice on the order page.
 */
export function trackB2BInvoiceRequested(params: {
  totalBoxes: number;
  subtotalExVat: number;
  hasPO: boolean;
}): void {
  safeTrack("b2b_invoice_requested", {
    totalBoxes: params.totalBoxes,
    subtotalExVat: params.subtotalExVat,
    hasPO: params.hasPO,
  });
}

// ===== FUNNEL TRACKING (/funnel, /funnel-b, /funnel-c) =====

/**
 * Which funnel emitted the event.
 *
 * Deliberately a PROPERTY, not part of the event name. All three funnels fire
 * the same `funnel:*` names and are told apart by grouping on `variant`
 * (dashboard drill-down, or `by=eventData/variant` via the Web Analytics API).
 * Baking the variant into the name (`funnelc:*`) would fragment every query and
 * make step-to-step drop-off impossible to compare across variants.
 */
export type FunnelVariant = "a" | "b" | "c";

/**
 * Product/cadence are typed loosely here on purpose: the data layer
 * (`app/lib/byoData`) declares its own unions, and analytics must not
 * depend on it.
 */
interface FunnelContext {
  variant: FunnelVariant;
  product: string;
  cadence: string;
}

/**
 * THE TWO-PROPERTY BUDGET.
 *
 * Vercel Web Analytics allows 2 custom properties per event on Pro (8 only with
 * the Web Analytics Plus add-on). The client SDK does NOT enforce this: it sends
 * whatever you give it and the limit is applied inside Vercel's ingestion/query
 * layer, where the behaviour is undocumented. Extra properties may therefore be
 * silently unqueryable.
 *
 * So every helper below sends EXACTLY two properties: `variant`, plus one packed
 * context field. Product and cadence are packed into a single `config` string
 * rather than sent as separate properties. Split on "|" when analysing.
 *
 * Do not add a third property to any of these without first confirming the plan
 * has the Plus add-on.
 */
function funnelConfig(product: string, cadence: string): string {
  return `${product}|${cadence}`;
}

/** Fires once on funnel mount. `config` is the pre-selected default offer. */
export function trackFunnelViewed(params: FunnelContext): void {
  safeTrack("funnel:viewed", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/**
 * Fires when a user advances PAST a step. This is the drop-off signal.
 *
 * Call sites must fire this only from explicit forward-intent handlers, and must
 * guard against repeats. See the callers for the ref-guard pattern: the funnels
 * drive steps through history.pushState, so a `useEffect` on the step value
 * would re-fire on every browser back/forward, and the shared `goToStep` helper
 * is also the BACKWARD handler.
 */
export function trackFunnelStepCompleted(
  params: FunnelContext & { step: number },
): void {
  safeTrack(`funnel:step${params.step}_completed`, {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Formula switch. `change` packs from>to so both fit one property. */
export function trackByoProductChanged(params: {
  variant: FunnelVariant;
  from: string;
  to: string;
}): void {
  safeTrack("funnel:product_changed", {
    variant: params.variant,
    change: `${params.from}>${params.to}`,
  });
}

/** Plan switch. `change` packs from>to so both fit one property. */
export function trackByoCadenceChanged(params: {
  variant: FunnelVariant;
  from: string;
  to: string;
}): void {
  safeTrack("funnel:cadence_changed", {
    variant: params.variant,
    change: `${params.from}>${params.to}`,
  });
}

/** Checkout button pressed (before any upsell interstitial). */
export function trackFunnelCtaClicked(params: FunnelContext): void {
  safeTrack("funnel:cta_clicked", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/**
 * Cart created, redirecting to Shopify. Price is deliberately NOT sent: it would
 * be a third property, and revenue is already carried by `purchase:add_to_cart`,
 * Meta and Triple Whale.
 */
export function trackFunnelCheckout(params: FunnelContext): void {
  safeTrack("funnel:checkout", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Checkout failed before redirect. `reason` is the user-facing error string. */
export function trackFunnelCheckoutFailed(params: {
  variant: FunnelVariant;
  reason: string;
}): void {
  safeTrack("funnel:checkout_failed", {
    variant: params.variant,
    reason: params.reason,
  });
}

/** Upsell sheet shown. `config` is the ORIGINAL offer, before any upgrade. */
export function trackFunnelUpsellShown(params: FunnelContext): void {
  safeTrack("funnel:upsell_shown", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Upsell taken. `config` is the UPGRADED offer, so it reads as the outcome. */
export function trackFunnelUpsellAccepted(params: FunnelContext): void {
  safeTrack("funnel:upsell_accepted", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Upsell explicitly declined (user continued to checkout with the original). */
export function trackFunnelUpsellDeclined(params: FunnelContext): void {
  safeTrack("funnel:upsell_declined", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Upsell dismissed without choosing (backdrop/close). Not a checkout. */
export function trackFunnelUpsellDismissed(params: FunnelContext): void {
  safeTrack("funnel:upsell_dismissed", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Nutrition/spec modal opened. Unreachable in funnel-c; used by /funnel + b. */
export function trackFunnelNutritionViewed(params: FunnelContext): void {
  safeTrack("funnel:nutrition_viewed", {
    variant: params.variant,
    config: funnelConfig(params.product, params.cadence),
  });
}

/** Backward navigation within the funnel. `step` is the step being LEFT. */
export function trackFunnelBackNav(params: {
  variant: FunnelVariant;
  step: number;
}): void {
  safeTrack("funnel:back_nav", {
    variant: params.variant,
    step: params.step,
  });
}

/** A disclosure/accordion was opened. `id` identifies which one. */
export function trackFunnelAccordionOpened(params: {
  variant: FunnelVariant;
  id: string;
}): void {
  safeTrack("funnel:accordion_opened", {
    variant: params.variant,
    id: params.id,
  });
}

/**
 * TEMPORARY — delete once read.
 *
 * Vercel documents a 2-property limit on Pro but never says what happens when
 * you exceed it, the SDK does not enforce it, and no first-hand account exists
 * anywhere. This fires ONE event carrying four properties so we can settle it
 * empirically: query it grouped by `probeC` / `probeD` (dashboard drill-down or
 * `by=eventData/probeC`).
 *
 *   - all four queryable  -> the limit is display/query-side only; we can relax
 *                            the two-property budget above.
 *   - only two come back  -> extras are dropped at ingestion; the budget stays,
 *                            and the result tells us WHICH two survive.
 *   - event missing       -> over-limit events are rejected outright.
 *
 * Costs nothing: billing counts events, not properties.
 */
export function trackFunnelPropertyProbe(variant: FunnelVariant): void {
  safeTrack("funnel:probe", {
    variant,
    probeB: "b",
    probeC: "c",
    probeD: "d",
  });
}

// ===== PURCHASE INTENT TRACKING =====

/**
 * Detect source for add-to-cart events.
 * Returns "quiz" if user came from the (now removed) legacy quiz,
 * "direct" otherwise. Kept because product pages use it for source
 * tagging; with the quiz gone it effectively always returns "direct".
 */
export function getAddToCartSource(): string {
  if (typeof window === "undefined") return "direct";
  
  // Check if from quiz (sessionStorage)
  if (sessionStorage.getItem("quizSessionId")) {
    return "quiz";
  }
  
  // Check referrer
  if (document.referrer && document.referrer.includes("/quiz")) {
    return "quiz";
  }
  
  // Default
  return "direct";
}

/**
 * Session-scoped key holding the listicle `?src=` token across a within-tab
 * navigation, so a PDP add-to-cart still knows its origin after the URL param
 * has been dropped. Mirrors how `_fbc` persists the ad-click id.
 */
const LISTICLE_SRC_KEY = "listicle_src";

/**
 * A raw `src` token is valid only if it is a plain slug-and-section string.
 * Anything else lands in an analytics property and a Shopify cart attribute
 * straight from the URL, so it is discarded rather than allowed to pollute the
 * data with attacker-controlled junk.
 */
function isValidListicleSrc(raw: string): boolean {
  return /^[a-z0-9_-]{1,96}$/i.test(raw);
}

/**
 * Persist the `?src=` token a /go listicle appended to its outbound PDP link.
 *
 * Called on landing so the origin survives a within-PDP navigation that drops
 * the param before the visitor adds to cart. Safe to call on every page load:
 * a no-op when there is no valid `src` in the URL.
 */
export function captureListicleSrc(): void {
  if (typeof window === "undefined") return;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (!raw || !isValidListicleSrc(raw)) return;

  try {
    window.sessionStorage.setItem(LISTICLE_SRC_KEY, raw);
  } catch {
    // sessionStorage unavailable (private mode); attribution simply degrades.
  }
}

/**
 * The `?src=` origin token a /go listicle appended to its outbound PDP links.
 *
 * Reads the live URL first, falling back to the value captured into
 * sessionStorage on landing (see captureListicleSrc), so attribution survives a
 * within-PDP navigation that drops the param.
 */
function getListicleSrc(): string | null {
  if (typeof window === "undefined") return null;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (raw && isValidListicleSrc(raw)) {
    // Write-through so a later add-to-cart on this same tab still has it.
    try {
      window.sessionStorage.setItem(LISTICLE_SRC_KEY, raw);
    } catch {
      // ignore
    }
    return raw;
  }

  try {
    const stored = window.sessionStorage.getItem(LISTICLE_SRC_KEY);
    return stored && isValidListicleSrc(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Coarse `source` for a purchase: where this visitor came FROM, as opposed to
 * `location`, which is where on the page they clicked.
 *
 * Deliberately coarse, because CartContext writes this to Shopify as a cart
 * line item property, and a property whose key does not start with "_" is
 * shown to the customer in checkout. Only clean, canonical values belong here.
 * The specific page and section go in `getPurchaseOrigin`, which stays
 * client-side.
 */
export function getPurchaseSource(): string {
  if (getListicleSrc()) return "listicle";

  return getAddToCartSource() === "quiz" ? "quiz" : "product_page";
}

/**
 * The exact `<slug>-<section>` that produced the click, for analytics only.
 *
 * Never written to Shopify: see getPurchaseSource. Undefined when the visitor
 * did not arrive from a listicle.
 */
export function getPurchaseOrigin(): string | undefined {
  return getListicleSrc() ?? undefined;
}

/**
 * Get quiz session ID if available
 */
export function getQuizSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem("quizSessionId") || undefined;
}

/**
 * Track add to cart event
 * Phase 4A: Purchase intent with context
 */
export function trackPurchaseAddToCart(params: {
  // "unknown" is a real, expected value: a variant that resolved against no
  // mapping still reports (SCRUM-1244), carrying its raw GID as productId.
  // Filter it in dashboards; do not assume it never occurs.
  productType: "formula" | "protocol" | "unknown";
  productId: string;  // "01", "02", "03", "1".."4", or a raw variant GID
  variantId: string;  // Shopify variant GID
  packSize?: "4" | "8" | "12" | "28";
  tier?: "starter" | "pro" | "max";
  purchaseType: "subscription" | "one-time";
  location: string;  // "hero", "sticky_footer", "results_page", "calendar"
  source: string;  // "quiz", "menu", "direct", "cta"
  price?: number;
  sessionId?: string;  // Quiz session ID
}): void {
  safeTrack("purchase:add_to_cart", {
    productType: params.productType,
    productId: params.productId,
    variantId: params.variantId,
    packSize: params.packSize,
    tier: params.tier,
    purchaseType: params.purchaseType,
    location: params.location,
    source: params.source,
    price: params.price,
    sessionId: params.sessionId,
  });
}
