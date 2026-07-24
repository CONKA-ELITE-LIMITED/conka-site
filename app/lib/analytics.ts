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
 * Product/cadence are typed loosely here on purpose: the two funnel data
 * modules (`app/lib/funnelData` and `app/(trial-b)/lib/funnelData`) each
 * declare their own unions, and analytics must not depend on either.
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
export function trackFunnelProductChanged(params: {
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
export function trackFunnelCadenceChanged(params: {
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
 * The `?src=` origin token a /go listicle appends to its outbound PDP links.
 *
 * Sanitised deliberately: this value lands in an analytics property straight
 * from the URL, so anyone can put anything in it. Anything that is not a plain
 * slug-and-section token is discarded rather than allowed to pollute the
 * dashboard with junk dimensions.
 */
function getListicleSrc(): string | null {
  if (typeof window === "undefined") return null;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (!raw) return null;

  return /^[a-z0-9_-]{1,96}$/i.test(raw) ? raw : null;
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
  productType: "formula" | "protocol";
  productId: string;  // "01", "02", "1", "2", "3", "4"
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
