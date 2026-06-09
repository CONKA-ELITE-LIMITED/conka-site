"use client";

import { track } from "@vercel/analytics/react";

/**
 * CONKA Analytics System
 * 
 * Type-safe, centralized analytics tracking for Vercel Analytics.
 * All events are structured to answer key business questions about
 * the quiz funnel and conversion journey.
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
 * Determine quiz source from referrer and current page
 */
function getQuizSource(): string {
  if (typeof window === "undefined") return "direct";
  
  const referrer = document.referrer;

  // Check if coming from internal pages
  if (referrer) {
    const referrerUrl = new URL(referrer);
    const referrerPath = referrerUrl.pathname;
    
    if (referrerPath.includes("/quiz")) return "quiz_retake";
    if (referrerPath.includes("/protocol")) return "protocol_page";
    if (referrerPath.includes("/conka-flow") || referrerPath.includes("/conka-clarity")) return "product_page";
    if (referrerPath === "/" || referrerPath === "") return "homepage";
    if (referrerPath.includes("/shop")) return "shop_page";
  }
  
  // Check UTM parameters
  const utm = getUTMParams();
  if (utm.utm_source) {
    return `utm_${utm.utm_source}`;
  }
  
  return "direct";
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

// ===== QUIZ FUNNEL TRACKING =====

/**
 * Track quiz started
 * Phase 1A: Core funnel
 */
export function trackQuizStarted(params: {
  sessionId: string;
  referrer?: string;
  userAgent?: string;
}): void {
  const source = getQuizSource();
  const utm = getUTMParams();
  const timestamp = Date.now();
  
  // Store quiz start data for later events
  if (typeof window !== "undefined") {
    sessionStorage.setItem("quizStartTime", timestamp.toString());
    sessionStorage.setItem("quizSource", source);
    sessionStorage.setItem("quizSessionId", params.sessionId);
  }
  
  safeTrack("quiz:started", {
    source,
    referrer: params.referrer || document.referrer || "direct",
    sessionId: params.sessionId,
    timestamp,
    userAgent: params.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : undefined),
    previousPage: params.referrer || undefined,
    ...utm,
  });
}

/**
 * Track question viewed
 * Phase 1C: Drop-off diagnostics
 */
export function trackQuizQuestionViewed(params: {
  questionNumber: number;
  questionId: string;
  sessionId: string;
  totalQuestions: number;
  timeOnPage: number;
  previousAnswerTime?: number;
  isReturning?: boolean;
}): void {
  const progress = Math.round((params.questionNumber / params.totalQuestions) * 100);
  
  safeTrack("quiz:question_viewed", {
    questionNumber: params.questionNumber,
    questionId: params.questionId,
    sessionId: params.sessionId,
    timeOnPage: params.timeOnPage,
    totalQuestions: params.totalQuestions,
    progress,
    previousAnswerTime: params.previousAnswerTime,
    isReturning: params.isReturning || false,
  });
}

/**
 * Track answer selected
 * Phase 1C: Drop-off diagnostics (optional, alongside Convex)
 */
export function trackQuizAnswerSelected(params: {
  questionNumber: number;
  questionId: string;
  answerValue: string;
  answerLabel: string;
  sessionId: string;
  timeSpentMs: number;
  isFirstAttempt: boolean;
  measures: string;
}): void {
  safeTrack("quiz:answer_selected", {
    questionNumber: params.questionNumber,
    questionId: params.questionId,
    answerValue: params.answerValue,
    answerLabel: params.answerLabel,
    sessionId: params.sessionId,
    timeSpentMs: params.timeSpentMs,
    isFirstAttempt: params.isFirstAttempt,
    measures: params.measures,
  });
}

/**
 * Track quiz completed
 * Phase 1A: Core funnel
 */
export function trackQuizCompleted(params: {
  recommendedProtocol: "1" | "2" | "3" | "4";
  totalQuestions: number;
  sessionId: string;
  completionRate: number;
  topMatchScore: number;
  secondMatchScore?: number;
}): void {
  // Calculate time spent
  let timeSpentSeconds = 0;
  if (typeof window !== "undefined") {
    const startTime = sessionStorage.getItem("quizStartTime");
    if (startTime) {
      timeSpentSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    }
  }
  
  const source = typeof window !== "undefined" 
    ? sessionStorage.getItem("quizSource") || "unknown"
    : "unknown";
  
  safeTrack("quiz:completed", {
    recommendedProtocol: params.recommendedProtocol,
    totalQuestions: params.totalQuestions,
    timeSpentSeconds,
    sessionId: params.sessionId,
    source,
    completionRate: params.completionRate,
    topMatchScore: params.topMatchScore,
    secondMatchScore: params.secondMatchScore,
  });
}

/**
 * Track results page viewed
 * Phase 1A: Core funnel
 */
export function trackQuizResultsViewed(params: {
  recommendedProtocol: "1" | "2" | "3" | "4";
  topMatchScore: number;
  sessionId: string;
  allProtocolScores: Array<{ protocolId: string; percentage: number; totalPoints: number }>;
  quizCompletionTime: number;
}): void {
  // Calculate time to results
  let timeToResults = 0;
  if (typeof window !== "undefined") {
    const startTime = sessionStorage.getItem("quizStartTime");
    if (startTime) {
      timeToResults = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    }
  }
  
  const source = typeof window !== "undefined"
    ? sessionStorage.getItem("quizSource") || "unknown"
    : "unknown";
  
  const isReturning = typeof window !== "undefined"
    ? sessionStorage.getItem("quizResultsViewed") === "true"
    : false;
  
  // Mark as viewed
  if (typeof window !== "undefined") {
    sessionStorage.setItem("quizResultsViewed", "true");
  }
  
  safeTrack("quiz:results_viewed", {
    recommendedProtocol: params.recommendedProtocol,
    topMatchScore: params.topMatchScore,
    sessionId: params.sessionId,
    timeToResults,
    source,
    allProtocolScores: JSON.stringify(params.allProtocolScores),
    quizCompletionTime: params.quizCompletionTime,
    isReturning,
  });
}

/**
 * Track CTA clicked from results page
 * Phase 1B: Results → product intent
 */
export function trackQuizResultCTAClicked(params: {
  recommendedProtocol: "1" | "2" | "3" | "4";
  ctaType: "view_protocol" | "add_to_cart" | "explore_other" | "retake_quiz";
  sessionId: string;
  location: "results_page" | "sticky_footer";
  destination?: string;
  topMatchScore: number;
}): void {
  // Calculate time on results page
  let timeOnResults = 0;
  if (typeof window !== "undefined") {
    const resultsViewTime = sessionStorage.getItem("quizResultsViewTime");
    if (resultsViewTime) {
      timeOnResults = Math.floor((Date.now() - parseInt(resultsViewTime)) / 1000);
    } else {
      // Store view time if not already stored
      sessionStorage.setItem("quizResultsViewTime", Date.now().toString());
    }
  }
  
  const source = typeof window !== "undefined"
    ? sessionStorage.getItem("quizSource") || "unknown"
    : "unknown";
  
  safeTrack("quiz:result_cta_clicked", {
    recommendedProtocol: params.recommendedProtocol,
    ctaType: params.ctaType,
    sessionId: params.sessionId,
    location: params.location,
    destination: params.destination,
    timeOnResults,
    source,
    topMatchScore: params.topMatchScore,
  });
}

// ===== APP PAGE TRACKING =====

/**
 * Track that the app data insights section entered the viewport.
 * Fires once per page load when the section reaches 50% visibility.
 */
export function trackAppDataInsightsViewed(): void {
  safeTrack("app:data_insights_viewed", {
    timestamp: Date.now(),
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

// ===== PURCHASE INTENT TRACKING =====

/**
 * Detect source for add-to-cart events
 * Returns "quiz" if user came from quiz, "direct" otherwise
 * Note: Menu source requires Phase 2 navigation tracking
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
