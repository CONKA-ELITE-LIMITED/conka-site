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
