/**
 * B2B teams pricing - display model (no Shopify IDs).
 *
 * Tiered per-box pricing for the /professionals order page. These numbers drive
 * the on-page display only. The price actually charged is set by Shopify's
 * automatic quantity-break discounts on the B2B products (SCRUM-1056); the two
 * must be kept in sync. Variant GIDs live server-side in app/api/b2b/cart.
 *
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

export type B2BProductKey = "flow" | "clear";

export interface B2BProductDisplay {
  key: B2BProductKey;
  name: string;
  shotsPerBox: number;
  blurb: string;
  image: string;
  imageAlt: string;
}

export const B2B_PRODUCTS: Record<B2BProductKey, B2BProductDisplay> = {
  flow: {
    key: "flow",
    name: "CONKA Flow",
    shotsPerBox: 28,
    blurb: "Morning focus and drive for the whole squad.",
    image: "/formulas/box/FlowBox.jpg",
    imageAlt: "A box of CONKA Flow next to a single shot bottle",
  },
  clear: {
    key: "clear",
    name: "CONKA Clear",
    shotsPerBox: 28,
    blurb: "Afternoon clarity and calm under load.",
    image: "/formulas/box/ClearBox.jpg",
    imageAlt: "A box of CONKA Clear next to a single shot bottle",
  },
};

export const B2B_PRODUCT_ORDER: B2BProductKey[] = ["flow", "clear"];

export interface B2BTier {
  label: string;
  minBoxes: number;
  maxBoxes: number | null;
  pricePerBox: number; // ex VAT, GBP
}

/**
 * Quantity bands apply to the COMBINED box total (Flow + Clear), and the chosen
 * tier price applies to every box in the order. The Shopify automatic discounts
 * (SCRUM-1056) must therefore trigger on total cart quantity, not per variant.
 */
export const B2B_TIERS: B2BTier[] = [
  { label: "Entry", minBoxes: 1, maxBoxes: 24, pricePerBox: 59 },
  { label: "Squad", minBoxes: 25, maxBoxes: 49, pricePerBox: 52 },
  { label: "Institutional", minBoxes: 50, maxBoxes: null, pricePerBox: 45 },
];

export const B2B_VAT_RATE = 0.2;

/** Tier for a given box quantity. Zero/negative falls back to the entry tier. */
export function getB2BTier(boxes: number): B2BTier {
  const qty = Math.max(0, Math.floor(boxes));
  for (const tier of B2B_TIERS) {
    if (qty >= tier.minBoxes && (tier.maxBoxes === null || qty <= tier.maxBoxes)) {
      return tier;
    }
  }
  return B2B_TIERS[0];
}

export function perShotPrice(pricePerBox: number, shotsPerBox: number): number {
  return pricePerBox / shotsPerBox;
}
