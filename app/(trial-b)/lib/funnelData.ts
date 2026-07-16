/**
 * Funnel Page — Data Layer
 *
 * Types, pricing, variant mapping, display data, and upsell logic
 * for the product funnel page (/funnel).
 *
 * All 9 product/cadence combos (Flow, Clear, Both x Monthly Sub, OTP, Quarterly)
 * are live in Shopify. Variant IDs and selling plans are mapped below.
 */

import { formatPrice, formulaImages, quarterlyImages } from "@/app/lib/productData";

// ============================================
// TYPES
// ============================================

export type FunnelProduct = "both" | "flow" | "clear";
export type FunnelCadence = "monthly-sub" | "monthly-otp" | "quarterly-sub";

export interface FunnelPricing {
  /** Total price for this combination */
  price: number;
  /** Price per shot — computed on PRICED shots (excludes free shots) */
  perShot: number;
  /** Price per day (shots per day × perShot) */
  perDay: number;
  /** Priced (billed) shots — the amount the price buys, excluding free shots */
  shotCount: number;
  /** Crossed-out compare-at "was" value (value stack: OTP + bonus-shot value + postage). Absent on one-time entries. */
  compareAtPrice?: number;

  // ============================================
  // OFFER TRIAL (B) — "20 + 8 free" model fields
  // Values mirror the client mockups (conka_funnel.html / conka_lander.html).
  // DISPLAY-ONLY for now; Shopify fulfilment of free shots is TBD (see fulfilment spec).
  // ============================================
  /** Bonus shots given free. Monthly = first order only; quarterly = every cycle. */
  freeShots?: number;
  /** Total shots in the FIRST shipment (priced + free). */
  firstOrderShots?: number;
  /** Total shots delivered each cycle after the first (monthly recurring = priced only). */
  subsequentShots?: number;
  /** Compulsory postage on one-time orders (£). Absent/0 = free postage (subscriptions). */
  postage?: number;
  /** Value attributed to the free bonus shots (freeShots × OTP per-shot), for the "was" stack. */
  freeShotsValue?: number;
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

// OFFER TRIAL (B) — "20 + 8 free" pricing model.
// perShot is computed on PRICED shots. compareAtPrice is the REAL one-time (OTP)
// price for the same shots — a verifiable "was" the buyer can see on the OTP
// option (monthly anchors against 1 one-time box, quarterly against 3). Free
// shots / postage / app are shown as separate FREE line items, NOT rolled into
// an inflated "was". One-time entries carry no compareAtPrice (they ARE the
// reference) but DO carry compulsory `postage`.
// NOTE: free-shot counts (esp. quarterly) are still under review — single source of truth here.
const OTP_PRICE: Record<FunnelProduct, number> = {
  both: 89.99,
  flow: 59.99,
  clear: 59.99,
};

/** Compulsory postage charged on one-time orders (subscriptions ship free). */
const OTP_POSTAGE = 9.99;

const FUNNEL_PRICING: Record<FunnelProduct, Record<FunnelCadence, FunnelPricing>> = {
  both: {
    "monthly-sub": {
      price: 74.99,
      perShot: 1.87,
      perDay: 3.74,
      shotCount: 40,
      compareAtPrice: OTP_PRICE.both,
      freeShots: 16,
      firstOrderShots: 56,
      subsequentShots: 40,
      freeShotsValue: 47.99,
    },
    "monthly-otp": {
      price: OTP_PRICE.both,
      perShot: 2.25,
      perDay: 4.5,
      shotCount: 40,
      postage: OTP_POSTAGE,
    },
    "quarterly-sub": {
      price: 149.99,
      perShot: 1.25,
      perDay: 2.5,
      shotCount: 120,
      compareAtPrice: OTP_PRICE.both * 3,
      freeShots: 20,
      firstOrderShots: 140,
      subsequentShots: 140,
      freeShotsValue: 59.99,
    },
  },
  flow: {
    "monthly-sub": {
      price: 39.99,
      perShot: 2.0,
      perDay: 2.0,
      shotCount: 20,
      compareAtPrice: 59.99,
      freeShots: 8,
      firstOrderShots: 28,
      subsequentShots: 20,
      freeShotsValue: 23.99,
    },
    "monthly-otp": {
      price: OTP_PRICE.flow,
      perShot: 3.0,
      perDay: 3.0,
      shotCount: 20,
      postage: OTP_POSTAGE,
    },
    "quarterly-sub": {
      price: 109.99,
      perShot: 1.83,
      perDay: 1.83,
      shotCount: 60,
      compareAtPrice: 179.97,
      freeShots: 20,
      firstOrderShots: 80,
      subsequentShots: 80,
      freeShotsValue: 59.99,
    },
  },
  clear: {
    "monthly-sub": {
      price: 39.99,
      perShot: 2.0,
      perDay: 2.0,
      shotCount: 20,
      compareAtPrice: 59.99,
      freeShots: 8,
      firstOrderShots: 28,
      subsequentShots: 20,
      freeShotsValue: 23.99,
    },
    "monthly-otp": {
      price: OTP_PRICE.clear,
      perShot: 3.0,
      perDay: 3.0,
      shotCount: 20,
      postage: OTP_POSTAGE,
    },
    "quarterly-sub": {
      price: 109.99,
      perShot: 1.83,
      perDay: 1.83,
      shotCount: 60,
      compareAtPrice: 179.97,
      freeShots: 20,
      firstOrderShots: 80,
      subsequentShots: 80,
      freeShotsValue: 59.99,
    },
  },
};

// ============================================
// VARIANT MAPPING (Shopify GIDs)
// ============================================
// Variant mapping, re-pointed 2026-07-16 at the rebuilt funnel products.
//
// This file serves LIVE traffic: next.config.ts 307s /lander -> /lander-b and
// /start -> /start-b, so these GIDs are what real customers cart.
//
// The previous GIDs (FLOW-FUNNEL-28 etc.) are DELETED in Shopify — the three
// funnel products were rebuilt, so every variant was reissued with a new id and
// cartCreate answered "The merchandise with id ... does not exist" for all nine.
// Values below were read live from Shopify (`npx tsx scripts/fetch-funnel-products.ts`,
// tag:funnel), not carried over from the old comments — the SKU names moved
// products too (FLOW-FUNNEL-28 now belongs to the B2B Team Box), so the id is the
// only reliable key.
//
//   flow  → CONKA Flow         gid://shopify/Product/15790363410806 (conka-flow)
//   clear → CONKA Clear        gid://shopify/Product/15790363443574 (conka-clear)
//   both  → CONKA Flow + Clear gid://shopify/Product/15790363476342 (conka-flow-clear-1)
//
// monthly-otp is UNMAPPED: the rebuilt products expose only two variants each,
// both subscription. There is no one-time SKU in Shopify to point at, and the
// one-time price here (product + £9.99 postage) matches no live variant.
// `getOfferVariant` returns null for it, so callers must not offer it.
const FUNNEL_VARIANTS: Record<
  FunnelProduct,
  Partial<Record<FunnelCadence, FunnelVariantConfig>>
> = {
  flow: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58171575927158", // FLOW-SUB-20 · Flow - 20 Shots · £39.99
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58171576025462", // FLOW-SUB-60 · Flow - 60 Shots · £109.99
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
  },
  clear: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58171576156534", // CLEAR-SUB-20 · Clear - 20 Shots (Monthly) · £39.99
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58171576254838", // CLEAR-SUB-60 · Clear - 60 Shots · £109.99
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
  },
  both: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58171576353142", // BOTH-SUB-40 · Both - 40 Shots (Monthly) · £74.99
      sellingPlanId: "gid://shopify/SellingPlan/712527479158",
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58171576451446", // BOTH-SUB-120 · Both - 120 Shots · £149.99
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
