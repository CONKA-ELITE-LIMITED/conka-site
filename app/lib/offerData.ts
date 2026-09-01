/**
 * Offer Catalogue (the selling data layer)
 *
 * The single source of truth for every surface that sells: prices, variant
 * mapping, display data, and upsell logic for the PDPs, cart drawer, account
 * portal, JSON-LD / meta descriptions, and the legacy Build Your Order and
 * trial landing flows. Pre-add UI prices come from here; cart and checkout
 * prices come from Shopify only (docs/development/CART_PRICING_SOURCE_OF_TRUTH.md).
 * Anchor and discount rules live in docs/ops/offerings-and-discounts.md.
 *
 * All 9 product/cadence combos (Flow, Clear, Both x Monthly Sub, OTP, Quarterly)
 * are live in Shopify. Variant IDs and selling plans are mapped below.
 *
 * Merged from the pre-consolidation app/lib/funnelData.ts and
 * app/(trial-b)/lib/funnelData.ts forks (SCRUM-1247); the live funnel-c
 * presentation won, plus the portal/JSON-LD helpers from the main fork.
 * Renamed from byoData.ts in SCRUM-1280.
 */

import { formatPrice, formulaImages, quarterlyImages } from "@/app/lib/productData";

// ============================================
// TYPES
// ============================================

export type OfferProduct = "both" | "flow" | "clear";
export type OfferCadence = "monthly-sub" | "monthly-otp" | "quarterly-sub" | "quarterly-otp";

/** True for the one-time cadences (no subscription, compulsory postage). */
export function isOtpCadence(cadence: OfferCadence): boolean {
  return cadence === "monthly-otp" || cadence === "quarterly-otp";
}

/**
 * The one-time twin of a cadence: the OTP offering the same shipment size as
 * the given plan. Drives the selection-aware "Buy it once" link (SCRUM-1285),
 * so the link always offers the one-time equivalent of the selected plan card.
 */
export function getOtpCadenceFor(cadence: OfferCadence): OfferCadence {
  return cadence === "quarterly-sub" || cadence === "quarterly-otp"
    ? "quarterly-otp"
    : "monthly-otp";
}

export interface OfferPricing {
  /** Total price for this combination */
  price: number;
  /** Price per shot — computed on PRICED shots (excludes free shots) */
  perShot: number;
  /** Price per day (shots per day × perShot) */
  perDay: number;
  /** Priced (billed) shots — the amount the price buys, excluding free shots */
  shotCount: number;
  /**
   * The discount anchor: the ALL-IN price a customer would pay today for the
   * same priced shots via the reference route (monthly-size one-time orders,
   * each with per-order postage). Every displayed "Save X%" and crossed-out
   * price derives from this field via getDisplayDiscount, which compares it
   * against this entry's all-in charged price; there is no declared-percentage
   * path. Absent on entries that are themselves the reference (single-formula
   * monthly one-time). Rules: docs/ops/offerings-and-discounts.md.
   */
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
  /**
   * Value attributed to the free bonus shots: freeShots x the £3.00 one-time
   * per-shot value, presented with a .99 ending (8 -> 23.99, 16 -> 47.99,
   * 20 -> 59.99). Display-only, pre-add: it is the struck RRP on the PDP
   * gift-stack tile (GiftValueStack) and never reaches a cart line. It is a
   * gift valuation, never part of a discount percentage.
   */
  freeShotsValue?: number;

  // ============================================
  // STARTER PACK (SCRUM-1283)
  // ============================================
  /**
   * Physical and digital extras included free with the first order, rendered as
   * a struck-RRP value stack (GiftValueStack). Display only: the RRPs never
   * reach a cart line or the checkout, per CART_PRICING_SOURCE_OF_TRUTH.md.
   * What actually ships is the variant's `custom.bundlecomposition` metafield,
   * so this list and that metafield must be kept in step by hand.
   * The free bonus shots are NOT listed here; they derive from freeShotsValue.
   */
  gifts?: OfferGift[];
  /**
   * Arranged pack shot for the full-width PDP starter-pack section
   * (StarterPackContents, SCRUM-1287). One per cadence, because the monthly and
   * quarterly packs hold different quantities. Display only, and it doubles as
   * the section's visibility switch: absent means the cadence ships no starter
   * pack and the page renders no section at all.
   */
  starterPackImage?: string;
}

/** One free row in the starter-pack value stack. */
export interface OfferGift {
  id: string;
  label: string;
  /** Struck RRP shown against the row (£). */
  rrp: number;
  /** Square thumbnail. Omit for rows with no product shot. */
  image?: string;
  /**
   * How the thumbnail fills its square tile. Square product photos crop fine on
   * the default "cover"; tall transparent renders (the app screen) need
   * "contain" so they are not cut off top and bottom.
   */
  imageFit?: "cover" | "contain";
}

export interface OfferVariantConfig {
  variantId: string;
  sellingPlanId?: string;
}

export interface UpsellOffer {
  headline: string;
  body: string;
  acceptLabel: string;
  declineLabel: string;
  upgradedProduct: OfferProduct;
  upgradedCadence: OfferCadence;
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

/**
 * The discount % to DISPLAY for a pricing entry: always derived from the
 * compare-at anchor, never declared. Compares ALL-IN totals: the entry's
 * charged price (price + baked postage on one-time entries; subscriptions
 * ship free so charged = price) against the all-in anchor, so the struck
 * price, the shown price and the badge are always mutually checkable.
 * Returns 0 when the entry has no anchor (it is itself the reference), so
 * callers can keep using `savePct > 0` to decide whether to show a badge.
 * Free bonus shots are a gift and never enter this percentage
 * (docs/ops/offerings-and-discounts.md).
 */
export function getDisplayDiscount(pricing: OfferPricing): number {
  if (pricing.compareAtPrice != null) {
    return getSavingsPercent(getChargedPrice(pricing), pricing.compareAtPrice);
  }
  return 0;
}

// "20 + 8 free" pricing model. perShot is computed on PRICED shots. Free
// shots / postage / app are shown as separate FREE line items, NOT rolled into
// an inflated "was". Single-formula one-time entries carry no compareAtPrice
// (they ARE the reference) but DO carry compulsory `postage`.
//
// ANCHORS (SCRUM-1258, ladder revision SCRUM-1285; rules in
// docs/ops/offerings-and-discounts.md):
// - Every comparison is ALL-IN TOTALS: compareAtPrice is the all-in cost of
//   the alternative, and getDisplayDiscount compares it against this entry's
//   all-in charged price (getChargedPrice). Postage is baked into displayed
//   one-time prices for now; the itemised split returns when SCRUM-1286
//   un-bakes shipping in Shopify.
// - The reference unit is the MONTHLY-SIZE ONE-TIME ORDER, all-in (product +
//   per-order postage). Anchors scale linearly from it: a quarterly offering
//   anchors to three such orders, each paying its own postage. This makes the
//   discount ladder ascend with quantity and commitment (the Magic Mind
//   pattern, decided by Rudh 28 Aug 2026): larger pack, bigger badge. The
//   quarterly one-time is itself a discounted offer (postage paid once, not
//   three times), so it carries its own badge and is never an anchor.
// - Both anchors reference the VALUE OF FLOW + CLEAR bought separately, not
//   the £89.99 Both box (PROVISIONAL, 2026-08-28: adjustable data, see the
//   ops doc's decision note).
// NOTE: free-shot counts (esp. quarterly) are still under review — single source of truth here.
const OTP_PRICE: Record<OfferProduct, number> = {
  both: 89.99,
  flow: 59.99,
  clear: 59.99,
};

/** Compulsory postage charged on one-time orders (subscriptions ship free). */
const OTP_POSTAGE = 9.99;

/**
 * Flow starter pack: what comes free in the box on a first subscription order
 * (SCRUM-1283). RRPs match the approved pack artwork. The bonus shots are not
 * here; they come from `freeShotsValue` so the shot count and its value stay
 * derived from one place.
 */
/**
 * Thumbnail for the bonus-shots tile. The shots are not an `OfferGift`, they
 * derive from `freeShots` / `freeShotsValue`, so their image has no gift entry
 * to live on. It sits here rather than in a component because two surfaces show
 * the tile: the PDP gift stack and the cart upsell.
 */
export const STARTER_SHOTS_IMAGE = "/formulas/starterPack/EightFlow.jpg";

const STARTER_PACK_GIFTS: OfferGift[] = [
  {
    id: "hat",
    label: "CONKA Hat",
    rrp: 19.99,
    image: "/formulas/starterPack/ConkaHat.jpg",
  },
  {
    id: "travel-pack",
    label: "Capsule Travel Pack",
    rrp: 28.99,
    image: "/formulas/starterPack/TravelPack.jpg",
  },
  {
    id: "app",
    label: "Full CONKA app access",
    rrp: 9.99,
    image: "/app/AppConkaRing.png",
    imageFit: "contain",
  },
];

/**
 * The reference one-off value for Both: one Flow box plus one Clear box
 * (£119.98). Deliberately NOT the £89.99 Both one-off box: the Both box is
 * itself a discount against buying the two singles, and this reference is what
 * makes the £3.00 per-shot valuation used across the site sourceable
 * (£119.98 / 40 shots = £3.00).
 */
const BOTH_REFERENCE_PRICE = OTP_PRICE.flow + OTP_PRICE.clear;

/**
 * The reference unit for every anchor: one monthly-size one-time order,
 * all-in (product price + one order's postage). £69.98 for a single formula
 * (the real FLOW/CLEAR-FUNNEL-20-OTP charge), £129.97 for Both (the Flow +
 * Clear reference value + postage). Every compare-at derives from this so
 * the discount ladder ascends with quantity.
 */
const MONTHLY_OTP_ALL_IN: Record<OfferProduct, number> = {
  flow: OTP_PRICE.flow + OTP_POSTAGE,
  clear: OTP_PRICE.clear + OTP_POSTAGE,
  both: BOTH_REFERENCE_PRICE + OTP_POSTAGE,
};

const OFFER_PRICING: Record<OfferProduct, Record<OfferCadence, OfferPricing>> = {
  both: {
    "monthly-sub": {
      price: 74.99,
      perShot: 1.87,
      perDay: 3.74,
      shotCount: 40,
      // One reference unit: the same shots bought once as Flow + Clear (one order's postage).
      compareAtPrice: MONTHLY_OTP_ALL_IN.both,
      freeShots: 16,
      firstOrderShots: 56,
      subsequentShots: 40,
      freeShotsValue: 47.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/BothStarterPack.jpg",
    },
    "monthly-otp": {
      price: OTP_PRICE.both,
      // One reference unit, all-in: one Flow box + one Clear box + one order's postage.
      compareAtPrice: MONTHLY_OTP_ALL_IN.both,
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
      // Three reference units: three monthly-size Flow + Clear orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.both,
      freeShots: 20,
      firstOrderShots: 140,
      subsequentShots: 140,
      freeShotsValue: 59.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/BothQuarterlyStarterPack.jpg",
    },
    "quarterly-otp": {
      // + postage = the £279.99 BOTH-120 charges. Same £2.25/shot as monthly one-time.
      price: 270.0,
      perShot: 2.25,
      perDay: 4.5,
      shotCount: 120,
      // Three reference units, all-in: three monthly-size Flow + Clear orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.both,
      postage: OTP_POSTAGE,
    },
  },
  flow: {
    "monthly-sub": {
      price: 39.99,
      perShot: 2.0,
      perDay: 2.0,
      shotCount: 20,
      // One reference unit: the same shots bought once (FLOW-FUNNEL-20-OTP charges £69.98).
      compareAtPrice: MONTHLY_OTP_ALL_IN.flow,
      freeShots: 8,
      firstOrderShots: 28,
      subsequentShots: 20,
      freeShotsValue: 23.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/FlowStarterPack.jpg",
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
      // Three reference units: three monthly-size one-time orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.flow,
      freeShots: 20,
      firstOrderShots: 80,
      subsequentShots: 80,
      freeShotsValue: 59.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/FlowQuarterlyStarterPack.jpg",
    },
    "quarterly-otp": {
      // + postage = the £189.99 FLOW-60 charges. Same £3.00/shot as monthly one-time.
      price: 180.0,
      perShot: 3.0,
      perDay: 3.0,
      shotCount: 60,
      // Three reference units, all-in: three monthly-size one-time orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.flow,
      postage: OTP_POSTAGE,
    },
  },
  clear: {
    "monthly-sub": {
      price: 39.99,
      perShot: 2.0,
      perDay: 2.0,
      shotCount: 20,
      // One reference unit: the same shots bought once (CLEAR-FUNNEL-20-OTP charges £69.98).
      compareAtPrice: MONTHLY_OTP_ALL_IN.clear,
      freeShots: 8,
      firstOrderShots: 28,
      subsequentShots: 20,
      freeShotsValue: 23.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/ClearStarterPack.jpg",
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
      // Three reference units: three monthly-size one-time orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.clear,
      freeShots: 20,
      firstOrderShots: 80,
      subsequentShots: 80,
      freeShotsValue: 59.99,
      gifts: STARTER_PACK_GIFTS,
      starterPackImage: "/formulas/starterPack/ClearQuarterlyStarterPack.jpg",
    },
    "quarterly-otp": {
      // + postage = the £189.99 CLEAR-60 charges. Same £3.00/shot as monthly one-time.
      price: 180.0,
      perShot: 3.0,
      perDay: 3.0,
      shotCount: 60,
      // Three reference units, all-in: three monthly-size one-time orders, each with postage.
      compareAtPrice: 3 * MONTHLY_OTP_ALL_IN.clear,
      postage: OTP_POSTAGE,
    },
  },
};

// ============================================
// VARIANT MAPPING (Shopify GIDs)
// ============================================
// "20 + 8 free" SKU mapping (new variants created 2026-06-25).
//   monthly-sub   → 28/56-shot FIRST-ORDER SKU; Loop swaps to the 20/40-shot SKU
//                   from order 2 (Loop monthly plan). Selling-plan GIDs unchanged
//                   — the same plans are being re-priced in Loop, not replaced.
//   monthly-otp   → dedicated one-time SKU (postage baked into the Shopify price;
//                   displayed here as price + postage, same checkout total).
//   quarterly-sub → 80/140-shot SKU (ships once, no swap).
//
// STARTER KIT (SCRUM-1287): every subscription cadence now points at a
// -STARTER- variant, which is the same shot count and the same price as the
// -FUNNEL- variant it replaced, plus a hat and a travel pack in the box. The
// contents are the variant's `custom.bundlecomposition` metafield, which
// Synergy explodes at pick time. Selling plans are untouched: the starter
// variants were attached to the same four Loop plans, whose pricing policy is
// a fixed £0.00 adjustment, so the charged price is the variant price either
// way. The one-time cadences ship no kit and keep their -FUNNEL- variants.
const OFFER_VARIANTS: Record<OfferProduct, Record<OfferCadence, OfferVariantConfig>> = {
  flow: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58560937296246", // FLOW-STARTER-28 (first order → Loop swaps to FLOW-FUNNEL-20)
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/58153768714614", // FLOW-FUNNEL-20-OTP
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58560941752694", // FLOW-STARTER-80
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
    "quarterly-otp": {
      variantId: "gid://shopify/ProductVariant/58457811550582", // FLOW-60 (Skio-era one-time, £189.99 postage baked in)
    },
  },
  clear: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58560971309430", // CLEAR-STARTER-28 (first order → Loop swaps to CLEAR-FUNNEL-20)
      sellingPlanId: "gid://shopify/SellingPlan/712527348086",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/58153768812918", // CLEAR-FUNNEL-20-OTP
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58560980615542", // CLEAR-STARTER-80
      sellingPlanId: "gid://shopify/SellingPlan/712527413622",
    },
    "quarterly-otp": {
      variantId: "gid://shopify/ProductVariant/58457854411126", // CLEAR-60 (Skio-era one-time, £189.99 postage baked in)
    },
  },
  both: {
    "monthly-sub": {
      variantId: "gid://shopify/ProductVariant/58560992805238", // BOTH-STARTER-56 (first order → Loop swaps to BOTH-FUNNEL-40)
      sellingPlanId: "gid://shopify/SellingPlan/712527479158",
    },
    "monthly-otp": {
      variantId: "gid://shopify/ProductVariant/58153768911222", // BOTH-FUNNEL-40-OTP
    },
    "quarterly-sub": {
      variantId: "gid://shopify/ProductVariant/58560994771318", // BOTH-STARTER-140
      sellingPlanId: "gid://shopify/SellingPlan/712527446390",
    },
    "quarterly-otp": {
      variantId: "gid://shopify/ProductVariant/58457864077686", // BOTH-120 (Skio-era one-time, £279.99 postage baked in)
    },
  },
};

// ============================================
// DISPLAY DATA
// ============================================

export interface OfferProductDisplay {
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

export const OFFER_PRODUCTS: Record<OfferProduct, OfferProductDisplay> = {
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

export interface OfferCadenceDisplay {
  label: string;
  subtitle: string;
  badge?: string;
  savingsLabel?: string;
  /** Shipping callout shown as a standalone badge on subscription cards */
  shippingCallout?: string;
  features: string[];
}

export const OFFER_CADENCES: Record<OfferCadence, OfferCadenceDisplay> = {
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
  "quarterly-otp": {
    label: "3-month supply, once",
    subtitle: "Single order, no subscription",
    features: [
      "Subscribe later and save more",
    ],
  },
};

// ============================================
// HERO IMAGES
// ============================================

/** Product-specific hero images (used in static mode for step 2) */
export const OFFER_HERO_IMAGES: Record<OfferProduct, { src: string; alt: string }> = {
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
const FUNNEL_PRODUCT_SLIDESHOW_BASE: Record<OfferProduct, { src: string }[]> = formulaImages;

/** Quarterly swaps the first slide to show the larger shipment */
const QUARTERLY_FIRST_SLIDE: Record<OfferProduct, { src: string }> = quarterlyImages;

/** Get slideshow images for a product, adjusted for cadence */
export function getOfferProductSlideshow(
  product: OfferProduct,
  cadence: OfferCadence,
): { src: string }[] {
  const base = FUNNEL_PRODUCT_SLIDESHOW_BASE[product];
  if (cadence === "quarterly-sub" || cadence === "quarterly-otp") {
    return [QUARTERLY_FIRST_SLIDE[product], ...base.slice(1)];
  }
  return base;
}

// ============================================
// VARIANT REVERSE-LOOKUP (single source of truth for GID detection)
// ============================================

const VARIANT_TO_PRODUCT = new Map<string, OfferProduct>();
const QUARTERLY_SUB_VARIANT_SET = new Set<string>();
const QUARTERLY_OTP_VARIANT_SET = new Set<string>();

for (const [product, cadences] of Object.entries(OFFER_VARIANTS) as Array<[OfferProduct, Record<OfferCadence, OfferVariantConfig>]>) {
  for (const [cadence, config] of Object.entries(cadences) as Array<[OfferCadence, OfferVariantConfig]>) {
    if (config.variantId) {
      VARIANT_TO_PRODUCT.set(config.variantId, product);
      if (cadence === "quarterly-sub") {
        QUARTERLY_SUB_VARIANT_SET.add(config.variantId);
      } else if (cadence === "quarterly-otp") {
        QUARTERLY_OTP_VARIANT_SET.add(config.variantId);
      }
    }
  }
}

/** Given a Shopify variant GID, return the CONKA product or null if not a known variant. */
export function detectOfferProduct(variantId: string): OfferProduct | null {
  return VARIANT_TO_PRODUCT.get(variantId) ?? null;
}

/** Given a variant GID and whether a sellingPlan is active, return the cadence. */
export function detectOfferCadence(variantId: string, hasSellingPlan: boolean): OfferCadence {
  if (QUARTERLY_OTP_VARIANT_SET.has(variantId)) return "quarterly-otp";
  if (QUARTERLY_SUB_VARIANT_SET.has(variantId)) return "quarterly-sub";
  return hasSellingPlan ? "monthly-sub" : "monthly-otp";
}

// ============================================
// HELPERS
// ============================================

export function getOfferPricing(
  product: OfferProduct,
  cadence: OfferCadence,
): OfferPricing {
  return OFFER_PRICING[product][cadence];
}

export function getOfferVariant(
  product: OfferProduct,
  cadence: OfferCadence,
): OfferVariantConfig | null {
  const config = OFFER_VARIANTS[product][cadence];
  if (!config || !config.variantId) return null;
  return config;
}

export function isVariantReady(
  product: OfferProduct,
  cadence: OfferCadence,
): boolean {
  const config = OFFER_VARIANTS[product][cadence];
  return Boolean(config?.variantId);
}

/** For "Both", get the price of buying Flow + Clear separately at the same cadence */
export function getBuySeparatelyPrice(cadence: OfferCadence): number {
  return OFFER_PRICING.flow[cadence].price + OFFER_PRICING.clear[cadence].price;
}

/** Get the cadence frequency label for cart attributes */
export function getCadenceFrequency(
  cadence: OfferCadence,
): string {
  switch (cadence) {
    case "monthly-sub":
      return "monthly";
    case "monthly-otp":
    case "quarterly-otp":
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
  product: OfferProduct,
  cadence: OfferCadence,
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

  // Both + quarterly OTP → Both + quarterly sub (SCRUM-1285: the one new
  // edge). Anchored on the all-in charged one-time price (postage baked into
  // the Skio-era SKU), the same way the cart upsell anchors otp_to_sub.
  if (product === "both" && cadence === "quarterly-otp") {
    if (!isVariantReady("both", "quarterly-sub")) return null;
    const currentCharged = getChargedPrice(getOfferPricing("both", "quarterly-otp"));
    const upgradePrice = getOfferPricing("both", "quarterly-sub").price;
    const savings = currentCharged - upgradePrice;
    return {
      headline: `Subscribe and save ${formatPrice(savings)}`,
      body: `You're paying ${formatPrice(currentCharged)} for a one-time order. Subscribe at ${formatPrice(upgradePrice)} every 3 months and save ${formatPrice(savings)} each delivery. Cancel or pause anytime.`,
      acceptLabel: `Subscribe at ${formatPrice(upgradePrice)}/3 months`,
      declineLabel: "No thanks, one-time is fine",
      upgradedProduct: "both",
      upgradedCadence: "quarterly-sub",
      priceDifference: upgradePrice - currentCharged,
      compareAtUpgrade: currentCharged,
      savingsAmount: savings,
      savingsLabel: `Save ${formatPrice(savings)} every 3 months`,
      image: bothImage,
      benefits: [
        `Save ${formatPrice(savings)} every 3 months`,
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
export function getOfferCTALabels(
  step: 1 | 2,
  product: OfferProduct,
  cadence: OfferCadence,
): { label: string; subLabel: string } {
  const pricing = getOfferPricing(product, cadence);
  const display = OFFER_PRODUCTS[product];

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
    case "monthly-otp":
    case "quarterly-otp": {
      const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
      return {
        label: `Buy once · ${formatPrice(pricing.price)}`,
        subLabel: savings > 0 ? `Save ${formatPrice(savings)}` : "",
      };
    }
  }
}

/**
 * The all-in price the variant actually charges at checkout. Shopify bakes
 * compulsory postage into the one-time SKUs, while OFFER_PRICING lists the
 * product price and `postage` separately (the itemised funnel-c presentation).
 * Any surface that states a single one-time price WITHOUT an itemised postage
 * line must use this, or it understates what the customer pays by £9.99.
 * Subscription entries have no postage, so this is a no-op for them.
 */
export function getChargedPrice(pricing: OfferPricing): number {
  return pricing.price + (pricing.postage ?? 0);
}

// ============================================
// VARIANT LOOKUP + PORTAL HELPERS
// (ported from the pre-merge app/lib/funnelData.ts fork; SCRUM-1247)
// ============================================

/**
 * Reverse lookup: given a Shopify variant GID, return the offer it belongs to.
 * Used by cart analytics (productMetadata) and the account portal to recognise
 * offer lines without hand-maintained tables.
 */
export function getOfferByVariantId(
  variantId: string,
): { product: OfferProduct; cadence: OfferCadence; pricing: OfferPricing } | null {
  for (const product of Object.keys(OFFER_VARIANTS) as OfferProduct[]) {
    for (const cadence of Object.keys(OFFER_VARIANTS[product]) as OfferCadence[]) {
      if (OFFER_VARIANTS[product][cadence].variantId === variantId) {
        return { product, cadence, pricing: OFFER_PRICING[product][cadence] };
      }
    }
  }
  return null;
}

// ============================================
// SUBSCRIPTION SWAP (account portal, SCRUM-1200)
// ============================================
// Loop's line-swap API reassigns the plan via the individual SELLING PLAN id
// (`sellingPlanId`), NOT the selling-plan group id. Verified empirically against
// live Loop on 2026-08-04: passing `sellingPlanGroupId` is silently ignored (the
// swapped line keeps its old plan — e.g. a single Clear left stuck on the
// "Monthly Dual" plan) and is rejected outright when combined with
// pricingType 'NEW' (UNPROCESSABLE_ENTITY). Passing the target `sellingPlanId`
// with pricingType 'NEW' correctly moves BOTH the plan and the line price.
//
// The plan GIDs already live in OFFER_VARIANTS (used at checkout), so there is no
// separate table to hand-maintain — this just extracts the numeric id Loop's
// swap body expects. Returns null if the cadence has no plan (e.g. one-time),
// so the route can 503 rather than send a bad swap.

/** Numeric selling-plan id for a same-cadence offer swap, or null if unset. */
export function getOfferSwapSellingPlanId(
  product: OfferProduct,
  cadence: OfferCadence,
): string | null {
  const gid = OFFER_VARIANTS[product]?.[cadence]?.sellingPlanId;
  if (!gid) return null;
  return gid.split("/").pop() ?? null;
}

/** Numeric Shopify variant id (Loop's swap body wants the number, not the GID). */
export function getOfferVariantNumericId(
  product: OfferProduct,
  cadence: OfferCadence,
): string | null {
  const cfg = OFFER_VARIANTS[product]?.[cadence];
  if (!cfg?.variantId) return null;
  return cfg.variantId.split("/").pop() ?? null;
}

/** The other two products at the same cadence — the valid swap targets. */
export function getSwapTargets(current: OfferProduct): OfferProduct[] {
  return (["flow", "clear", "both"] as OfferProduct[]).filter((p) => p !== current);
}

/**
 * Lowest and highest purchasable price across all cadences for a product,
 * plus the number of offers. Feeds the Product JSON-LD AggregateOffer so the
 * structured data stays in sync with OFFER_PRICING automatically (SCRUM-1133).
 * One-time entries add `postage` back because the Shopify variant price has
 * postage baked in — the structured data must match what the variant charges.
 */
export function getOfferPriceRange(product: OfferProduct): {
  low: number;
  high: number;
  count: number;
} {
  const prices = Object.values(OFFER_PRICING[product]).map(
    (p) => p.price + (p.postage ?? 0),
  );
  return {
    low: Math.min(...prices),
    high: Math.max(...prices),
    count: prices.length,
  };
}

/**
 * Lowest per-shot price across all cadences for a product (the cheapest
 * cadence, currently quarterly). Feeds the "From £X/shot" figure in the
 * money-page meta descriptions (SCRUM-1139) so they stay in sync with
 * OFFER_PRICING, the same way getOfferPriceRange feeds the Product JSON-LD.
 * When a price changes, also append a dated block to docs/PRICING_HISTORY.md.
 */
export function getOfferMinPerShot(product: OfferProduct): number {
  const perShots = Object.values(OFFER_PRICING[product]).map((p) => p.perShot);
  return Math.min(...perShots);
}
