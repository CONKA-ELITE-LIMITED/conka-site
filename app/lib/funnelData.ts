/**
 * Funnel Page — Data Layer
 *
 * Types, pricing, variant mapping, display data, and upsell logic
 * for the product funnel page (/funnel).
 *
 * All 9 product/cadence combos (Flow, Clear, Both x Monthly Sub, OTP, Quarterly)
 * are live in Shopify. Variant IDs and selling plans are mapped below.
 */

import { formatPrice, formulaImages, quarterlyImages } from "./productData";

// ============================================
// TYPES
// ============================================

export type FunnelProduct = "both" | "flow" | "clear";
export type FunnelCadence = "monthly-sub" | "monthly-otp" | "quarterly-sub";

export interface FunnelPricing {
  /** Total price for this combination */
  price: number;
  /** Price per shot */
  perShot: number;
  /** Price per day (shots per day × perShot) */
  perDay: number;
  /** Total shots included */
  shotCount: number;
  /** Crossed-out compare-at price (the one-time price for the same product; absent on one-time entries) */
  compareAtPrice?: number;
}

export interface FunnelVariantConfig {
  variantId: string;
  sellingPlanId?: string;
}

export interface UpsellOffer {
  headline: string;
  body: string;
  acceptLabel: string;
  declineLabel: string;
  upgradedProduct: FunnelProduct;
  upgradedCadence: FunnelCadence;
  /** What the customer actually pays extra */
  priceDifference?: number;
  /** What the added product would cost on its own (crossed-out reference price) */
  compareAtUpgrade?: number;
  /** Total savings vs buying separately or vs current selection */
  savingsAmount?: number;
  /** Savings as a label (e.g. "Save £29 vs buying separately") */
  savingsLabel?: string;
  /** Product image for the upsell card */
  image?: { src: string; alt: string };
  /** Benefit bullets with tick marks */
  benefits?: string[];
  /** Per-shot price hero block (product upgrades only) */
  perShotHero?: {
    /** Per-shot price the user committed to on the previous screen */
    currentPerShot: number;
    /** Per-shot price after upgrading to Both */
    upgradedPerShot: number;
    /** Human-readable extra cost label, e.g. "+£30/mo" */
    extraCostLabel: string;
    /** Savings % vs buying the added product separately */
    savingsPercent: number;
    /** Name of the product being added */
    addedProductName: string;
  };
  /** Social nudge line shown beneath decline button */
  socialNudge?: string;
}

// ============================================
// PRICING MATRIX (3 products × 3 cadences)
// ============================================
// Pricing from COGS analysis (2026-03-27). All 9 product × cadence variants are live in Shopify.

/** Savings percentage vs the compare-at (one-time) price */
export function getSavingsPercent(price: number, compareAtPrice: number): number {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// One-time prices double as the compare-at anchor on subscription entries —
// a price the buyer can see and verify on the same page. One-time entries
// carry no compareAtPrice (they ARE the reference price). Quarterly anchors
// against 3 one-time boxes.
const OTP_PRICE: Record<FunnelProduct, number> = {
  both: 129.99,
  flow: 79.99,
  clear: 79.99,
};

const FUNNEL_PRICING: Record<FunnelProduct, Record<FunnelCadence, FunnelPricing>> = {
  both: {
    "monthly-sub": {
      price: 89.99,
      perShot: 1.61,
      perDay: 3.22,
      shotCount: 56,
      compareAtPrice: OTP_PRICE.both,
    },
    "monthly-otp": {
      price: OTP_PRICE.both,
      perShot: 2.32,
      perDay: 4.64,
      shotCount: 56,
    },
    "quarterly-sub": {
      price: 229.99,
      perShot: 1.37,
      perDay: 2.74,
      shotCount: 168,
      compareAtPrice: OTP_PRICE.both * 3,
    },
  },
  flow: {
    "monthly-sub": {
      price: 59.99,
      perShot: 2.14,
      perDay: 2.14,
      shotCount: 28,
      compareAtPrice: OTP_PRICE.flow,
    },
    "monthly-otp": {
      price: OTP_PRICE.flow,
      perShot: 2.86,
      perDay: 2.86,
      shotCount: 28,
    },
    "quarterly-sub": {
      price: 149.99,
      perShot: 1.79,
      perDay: 1.79,
      shotCount: 84,
      compareAtPrice: OTP_PRICE.flow * 3,
    },
  },
  clear: {
    "monthly-sub": {
      price: 59.99,
      perShot: 2.14,
      perDay: 2.14,
      shotCount: 28,
      compareAtPrice: OTP_PRICE.clear,
    },
    "monthly-otp": {
      price: OTP_PRICE.clear,
      perShot: 2.86,
      perDay: 2.86,
      shotCount: 28,
    },
    "quarterly-sub": {
      price: 149.99,
      perShot: 1.79,
      perDay: 1.79,
      shotCount: 84,
      compareAtPrice: OTP_PRICE.clear * 3,
    },
  },
};

// ============================================
// VARIANT MAPPING (Shopify GIDs)
// ============================================
// Funnel-specific products created 2026-03-27.
// Monthly uses 28-shot (Flow/Clear) or 56-shot (Both) variant.
// Quarterly uses 84-shot (Flow/Clear) or 168-shot (Both) variant.
// Selling plans: Single = Flow/Clear, Dual = Both.

const FUNNEL_VARIANTS: Record<FunnelProduct, Record<FunnelCadence, FunnelVariantConfig>> = {
  flow: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/57568795918710",
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/57568795918710",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/57568795951478",
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
  },
  clear: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/57568517489014",
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/57568517489014",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/57568746930550",
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
  },
  both: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/57568809976182",
      sellingPlanId: "gid://shopify/SellingPlan/712527479158",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/57568809976182",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/57568810008950",
      sellingPlanId: "gid://shopify/SellingPlan/712527446390",
    },
  },
};

// ============================================
// DISPLAY DATA
// ============================================

export interface FunnelProductDisplay {
  name: string;
  label: string;
  tagline: string;
  shotCount: number;
  description: string;
  /** Small product thumbnail for the card */
  thumbnail: string;
  badge?: string;
  /** Accent colour for the card (warm for Flow, cool for Clear, gradient for Both) */
  accent: string;
  /** Time-of-day indicator */
  timeLabel: string;
  timeEmoji: string;
  features: string[];
}

export const FUNNEL_PRODUCTS: Record<FunnelProduct, FunnelProductDisplay> = {
  both: {
    name: "Both",
    label: "Flow + Clear",
    tagline: "The complete daily system",
    shotCount: 56,
    description: "The complete protocol. Flow sharpens your morning. Clear sustains your afternoon. Together they cover the full day.",
    thumbnail: "/formulas/both/BothShots.jpg",
    badge: "Most Popular",
    accent: "#378ADD",
    timeLabel: "AM + PM",
    timeEmoji: "☀️🌙",
    features: [
      "Lowest price per shot",
      "Free shipping for subscribers",
      "Informed Sport Certified",
    ],
  },
  flow: {
    name: "Flow",
    label: "CONKA Flow",
    tagline: "Morning foundation",
    shotCount: 28,
    description: "Take it in the morning. Calm, sustained focus without caffeine. Your brain on before the day starts.",
    thumbnail: "/formulas/conkaFlow/FlowNoBackground.png",
    accent: "#F59E0B",
    timeLabel: "Morning",
    timeEmoji: "☀️",
    features: [
      "Caffeine-free, no crash",
      "Free shipping for subscribers",
      "UK patented (GB2629279)",
    ],
  },
  clear: {
    name: "Clear",
    label: "CONKA Clear",
    tagline: "Afternoon clarity",
    shotCount: 28,
    description: "Take it in the afternoon. Clears the 2pm fog and sustains output. The shot for the second half of your day.",
    thumbnail: "/formulas/conkaClear/ClearNoBackground.png",
    accent: "#0369a1",
    timeLabel: "Afternoon",
    timeEmoji: "☀️",
    features: [
      "Vitamin C for psychological function††",
      "Free shipping for subscribers",
      "Glutathione + Alpha GPC",
    ],
  },
};

export interface FunnelCadenceDisplay {
  label: string;
  subtitle: string;
  badge?: string;
  savingsLabel?: string;
  /** Shipping callout shown as a standalone badge on subscription cards */
  shippingCallout?: string;
  features: string[];
}

export const FUNNEL_CADENCES: Record<FunnelCadence, FunnelCadenceDisplay> = {
  "monthly-sub": {
    label: "1-month supply",
    subtitle: "Delivered monthly, cancel anytime",
    badge: "Most Popular",
    shippingCallout: "Free shipping on every delivery",
    features: [
      "Cancel or pause anytime, no lock-in",
    ],
  },
  "monthly-otp": {
    label: "Try once",
    subtitle: "Single order, no subscription",
    features: [
      "Subscribe later and save 25% or more",
    ],
  },
  "quarterly-sub": {
    label: "3-month supply",
    subtitle: "Lowest price per shot",
    savingsLabel: "Best Value",
    shippingCallout: "Free shipping",
    features: [
      "Cancel or pause anytime",
      "Lowest cost per shot across all plans",
    ],
  },
};

// ============================================
// HERO IMAGES
// ============================================

/** Product-specific hero images (used in static mode for step 2) */
export const FUNNEL_HERO_IMAGES: Record<FunnelProduct, { src: string; alt: string }> = {
  both: {
    src: "/formulas/both/BothBox.jpg",
    alt: "CONKA Flow and Clear — your AM and PM brain performance system",
  },
  flow: {
    src: "/formulas/conkaFlow/FlowBox.jpg",
    alt: "CONKA Flow — morning focus and calm formula",
  },
  clear: {
    src: "/formulas/conkaClear/ClearBox.jpg",
    alt: "CONKA Clear — afternoon clarity and recovery formula",
  },
};

/** Step 2: Slideshow images per product (carousel) — sourced from central config */
const FUNNEL_PRODUCT_SLIDESHOW_BASE: Record<FunnelProduct, { src: string }[]> = formulaImages;

/** Quarterly swaps the first slide to show the larger shipment */
const QUARTERLY_FIRST_SLIDE: Record<FunnelProduct, { src: string }> = quarterlyImages;

/** Get slideshow images for a product, adjusted for cadence */
export function getFunnelProductSlideshow(
  product: FunnelProduct,
  cadence: FunnelCadence,
): { src: string }[] {
  const base = FUNNEL_PRODUCT_SLIDESHOW_BASE[product];
  if (cadence === "quarterly-sub") {
    return [QUARTERLY_FIRST_SLIDE[product], ...base.slice(1)];
  }
  return base;
}

// ============================================
// VARIANT REVERSE-LOOKUP (single source of truth for GID detection)
// ============================================

const VARIANT_TO_PRODUCT = new Map<string, FunnelProduct>();
const QUARTERLY_VARIANT_SET = new Set<string>();

for (const [product, cadences] of Object.entries(FUNNEL_VARIANTS) as Array<[FunnelProduct, Record<FunnelCadence, FunnelVariantConfig>]>) {
  for (const [cadence, config] of Object.entries(cadences) as Array<[FunnelCadence, FunnelVariantConfig]>) {
    if (config.variantId) {
      VARIANT_TO_PRODUCT.set(config.variantId, product);
      if (cadence === "quarterly-sub") {
        QUARTERLY_VARIANT_SET.add(config.variantId);
      }
    }
  }
}

/** Given a Shopify variant GID, return the CONKA product or null if not a known variant. */
export function detectFunnelProduct(variantId: string): FunnelProduct | null {
  return VARIANT_TO_PRODUCT.get(variantId) ?? null;
}

/** Given a variant GID and whether a sellingPlan is active, return the cadence. */
export function detectFunnelCadence(variantId: string, hasSellingPlan: boolean): FunnelCadence {
  if (QUARTERLY_VARIANT_SET.has(variantId)) return "quarterly-sub";
  return hasSellingPlan ? "monthly-sub" : "monthly-otp";
}

// ============================================
// HELPERS
// ============================================

export function getOfferPricing(
  product: FunnelProduct,
  cadence: FunnelCadence,
): FunnelPricing {
  return FUNNEL_PRICING[product][cadence];
}

export function getOfferVariant(
  product: FunnelProduct,
  cadence: FunnelCadence,
): FunnelVariantConfig | null {
  const config = FUNNEL_VARIANTS[product][cadence];
  if (!config || !config.variantId) return null;
  return config;
}

export function isVariantReady(
  product: FunnelProduct,
  cadence: FunnelCadence,
): boolean {
  const config = FUNNEL_VARIANTS[product][cadence];
  return Boolean(config?.variantId);
}

/** For "Both", get the price of buying Flow + Clear separately at the same cadence */
export function getBuySeparatelyPrice(cadence: FunnelCadence): number {
  return FUNNEL_PRICING.flow[cadence].price + FUNNEL_PRICING.clear[cadence].price;
}

/** Get the cadence frequency label for cart attributes */
export function getCadenceFrequency(
  cadence: FunnelCadence,
): string {
  switch (cadence) {
    case "monthly-sub":
      return "monthly";
    case "monthly-otp":
      return "one-time";
    case "quarterly-sub":
      return "quarterly";
  }
}

// ============================================
// UPSELL LOGIC
// ============================================

/**
 * Upsell logic for Product > Cadence > Checkout flow.
 *
 * All upsells trigger at checkout (after the user has chosen both product
 * and cadence). Two categories:
 *
 * 1. Product upgrades: Flow/Clear → Both (the user picked a single product,
 *    we offer the pair at a discount vs buying separately).
 * 2. Cadence upgrades: OTP → subscription, monthly → quarterly (the user
 *    picked Both but a less committed cadence, we offer more savings).
 *
 * Priority: product upgrade first (higher AOV impact), then cadence upgrade.
 */
export function getUpsellOffer(
  product: FunnelProduct,
  cadence: FunnelCadence,
): UpsellOffer | null {
  const bothImage = { src: "/formulas/both/BothBox.jpg", alt: "CONKA Flow and Clear — AM and PM brain performance" };

  // --- Product upgrades: single product → Both ---

  // Flow → Both (add Clear)
  if (product === "flow") {
    if (!isVariantReady("both", cadence)) return null;
    const currentPricing = getOfferPricing("flow", cadence);
    const clearAlonePrice = getOfferPricing("clear", cadence).price;
    const bothPricing = getOfferPricing("both", cadence);
    const priceDiff = bothPricing.price - currentPricing.price;
    const savingsVsSeparate = clearAlonePrice - priceDiff;
    const savingsPercent = Math.round((savingsVsSeparate / clearAlonePrice) * 100);
    const extraCostLabel = cadence === "monthly-sub"
      ? `+${formatPrice(priceDiff)}/mo`
      : cadence === "quarterly-sub"
        ? `+${formatPrice(priceDiff)}/qtr`
        : `+${formatPrice(priceDiff)}`;
    return {
      headline: "Get the full system?",
      body: "Your morning is covered. Your afternoon holds. That's the full protocol.",
      acceptLabel: "Upgrade to Both",
      declineLabel: "No thanks, just Flow",
      upgradedProduct: "both",
      upgradedCadence: cadence,
      priceDifference: priceDiff,
      compareAtUpgrade: clearAlonePrice,
      savingsAmount: savingsVsSeparate,
      savingsLabel: `Save ${formatPrice(savingsVsSeparate)} vs adding Clear separately`,
      image: bothImage,
      perShotHero: {
        currentPerShot: currentPricing.perShot,
        upgradedPerShot: bothPricing.perShot,
        extraCostLabel,
        savingsPercent,
        addedProductName: "Clear",
      },
      benefits: [
        `Save ${savingsPercent}% vs buying separately`,
        "Flow sharpens the morning. Clear holds the afternoon",
        "One decision. Full day covered",
      ],
      // TODO: Verify "30 days" figure against actual subscription data before publishing
      socialNudge: "Most people who start with Flow switch to Both within 30 days.",
    };
  }

  // Clear → Both (add Flow)
  if (product === "clear") {
    if (!isVariantReady("both", cadence)) return null;
    const currentPricing = getOfferPricing("clear", cadence);
    const flowAlonePrice = getOfferPricing("flow", cadence).price;
    const bothPricing = getOfferPricing("both", cadence);
    const priceDiff = bothPricing.price - currentPricing.price;
    const savingsVsSeparate = flowAlonePrice - priceDiff;
    const savingsPercent = Math.round((savingsVsSeparate / flowAlonePrice) * 100);
    const extraCostLabel = cadence === "monthly-sub"
      ? `+${formatPrice(priceDiff)}/mo`
      : cadence === "quarterly-sub"
        ? `+${formatPrice(priceDiff)}/qtr`
        : `+${formatPrice(priceDiff)}`;
    return {
      headline: "Get the full system?",
      body: "Your morning is covered. Your afternoon holds. That's the full protocol.",
      acceptLabel: "Upgrade to Both",
      declineLabel: "No thanks, just Clear",
      upgradedProduct: "both",
      upgradedCadence: cadence,
      priceDifference: priceDiff,
      compareAtUpgrade: flowAlonePrice,
      savingsAmount: savingsVsSeparate,
      savingsLabel: `Save ${formatPrice(savingsVsSeparate)} vs adding Flow separately`,
      image: bothImage,
      perShotHero: {
        currentPerShot: currentPricing.perShot,
        upgradedPerShot: bothPricing.perShot,
        extraCostLabel,
        savingsPercent,
        addedProductName: "Flow",
      },
      benefits: [
        `Save ${savingsPercent}% vs buying separately`,
        "Flow sharpens the morning. Clear holds the afternoon",
        "One decision. Full day covered",
      ],
      // TODO: Verify "30 days" figure against actual subscription data before publishing
      socialNudge: "Most people who start with Clear switch to Both within 30 days.",
    };
  }

  // --- Cadence upgrades: Both selected, offer better cadence ---

  // Both + OTP → Both + monthly sub
  if (product === "both" && cadence === "monthly-otp") {
    if (!isVariantReady("both", "monthly-sub")) return null;
    const currentPrice = getOfferPricing("both", "monthly-otp").price;
    const upgradePrice = getOfferPricing("both", "monthly-sub").price;
    const savings = currentPrice - upgradePrice;
    return {
      headline: `Subscribe and save ${formatPrice(savings)}/mo`,
      body: `You're paying ${formatPrice(currentPrice)} for a one-time order. Subscribe at ${formatPrice(upgradePrice)}/mo and save ${formatPrice(savings)} every month. Cancel or pause anytime.`,
      acceptLabel: `Subscribe at ${formatPrice(upgradePrice)}/mo`,
      declineLabel: "No thanks, one-time is fine",
      upgradedProduct: "both",
      upgradedCadence: "monthly-sub",
      priceDifference: upgradePrice - currentPrice,
      compareAtUpgrade: currentPrice,
      savingsAmount: savings,
      savingsLabel: `Save ${formatPrice(savings)} every month`,
      image: bothImage,
      benefits: [
        `Save ${formatPrice(savings)} every month`,
        "Cancel or pause anytime, no lock-in",
        "Free UK shipping on every delivery",
      ],
    };
  }

  // Both + monthly sub → Both + quarterly
  if (product === "both" && cadence === "monthly-sub") {
    if (!isVariantReady("both", "quarterly-sub")) return null;
    const monthlyTotal = getOfferPricing("both", "monthly-sub").price * 3;
    const quarterlyPrice = getOfferPricing("both", "quarterly-sub").price;
    const savings = monthlyTotal - quarterlyPrice;
    return {
      headline: "Go quarterly, save more",
      body: `3 months delivered at once for ${formatPrice(quarterlyPrice)} instead of ${formatPrice(monthlyTotal)}. Lowest price per shot, fewer deliveries.`,
      acceptLabel: `Go quarterly at ${formatPrice(quarterlyPrice)}`,
      declineLabel: "No thanks, monthly is fine",
      upgradedProduct: "both",
      upgradedCadence: "quarterly-sub",
      priceDifference: quarterlyPrice - monthlyTotal,
      compareAtUpgrade: monthlyTotal,
      savingsAmount: savings,
      savingsLabel: `Save ${formatPrice(savings)} vs 3x monthly`,
      image: bothImage,
      benefits: [
        `Save ${formatPrice(savings)} vs 3 months of monthly`,
        "Lowest price per shot across all plans",
        "Cancel or pause anytime",
      ],
    };
  }

  // Both + quarterly → no upsell (best option already selected)
  return null;
}

// ============================================
// CTA LABELS
// ============================================

/**
 * Compute dynamic CTA label + sub-label for the funnel.
 *
 * Step 1 (product selection): reflects selected product + per-shot price.
 * Step 2 (plan selection): reflects cadence + total price + key reassurance.
 *
 * All values are derived from the pricing matrix so they stay in sync.
 */
export function getFunnelCTALabels(
  step: 1 | 2,
  product: FunnelProduct,
  cadence: FunnelCadence,
): { label: string; subLabel: string } {
  const pricing = getOfferPricing(product, cadence);
  const display = FUNNEL_PRODUCTS[product];

  if (step === 1) {
    const label = `Get for ${formatPrice(pricing.perShot)}/shot`;

    if (product === "both") {
      const separatePrice = getBuySeparatelyPrice(cadence);
      const savings = separatePrice - pricing.price;
      const subLabel = `// ${display.label} · save ${formatPrice(savings)}`;
      return { label, subLabel };
    }

    return { label, subLabel: `// ${display.label} · ${pricing.shotCount} shots/mo` };
  }

  // Step 2 — cadence-specific labels
  switch (cadence) {
    case "monthly-sub": {
      const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
      return {
        label: `${formatPrice(pricing.price)}/mo`,
        subLabel: savings > 0 ? `Save ${formatPrice(savings)}` : "",
      };
    }
    case "quarterly-sub": {
      const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
      return {
        label: `${formatPrice(pricing.price)}/quarter`,
        subLabel: savings > 0 ? `Save ${formatPrice(savings)}` : "",
      };
    }
    case "monthly-otp": {
      const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
      return {
        label: `Buy once · ${formatPrice(pricing.price)}`,
        subLabel: savings > 0 ? `Save ${formatPrice(savings)}` : "",
      };
    }
  }
}
