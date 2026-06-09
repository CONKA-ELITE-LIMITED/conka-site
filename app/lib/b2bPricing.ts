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

/**
 * Gross (VAT-inclusive) per-box price: the amount the club actually pays. B2B is
 * priced ex-VAT (tier price + 20%). The Shopify B2B variants are priced at the
 * gross ENTRY rate, and the pay-by-invoice route discounts down to the gross tier
 * price. Shopify is configured to collect UK VAT inclusively (20%) (Road B), so it
 * extracts the VAT from the gross at checkout, and the Shopify-to-Xero connector
 * mirrors that VAT onto the Xero invoice (net + 20% VAT). The connector does NOT
 * derive VAT on its own: Shopify must charge it (UK VAT enablement is SCRUM-1060).
 * See docs/development/featurePlans/b2b-xero-invoicing.md.
 */
export function getB2BGrossPerBox(tier: B2BTier): number {
  return Math.round(tier.pricePerBox * (1 + B2B_VAT_RATE) * 100) / 100;
}

/**
 * Per-shot cost (ex VAT) for a tier: the per-box price divided by the shots in a
 * box. The shot is the neutral unit - it makes no assumption about how a team
 * deploys it (one a day, Flow plus Clear, training days only), so it reframes a
 * large order total into a small, defensible number without overclaiming. Used
 * by the value callout on /professionals.
 */
export function getB2BPerShot(tier: B2BTier): number {
  const shotsPerBox = B2B_PRODUCTS.flow.shotsPerBox;
  return Math.round((tier.pricePerBox / shotsPerBox) * 100) / 100;
}

export interface B2BNextTier {
  tier: B2BTier;
  boxesAway: number; // boxes still needed to reach it
  savingPerBox: number; // ex-VAT per-box saving vs the current tier
}

/**
 * The next cheaper tier and how far away it is, for the "you are N boxes from
 * the next price" nudge. Returns null when already in the top tier. Based on the
 * COMBINED box total, like the tiers themselves.
 */
export function getB2BNextTier(boxes: number): B2BNextTier | null {
  const qty = Math.max(0, Math.floor(boxes));
  const current = getB2BTier(qty);
  const idx = B2B_TIERS.findIndex((t) => t.label === current.label);
  const next = B2B_TIERS[idx + 1];
  if (!next) return null;
  return {
    tier: next,
    boxesAway: Math.max(1, next.minBoxes - qty),
    savingPerBox: current.pricePerBox - next.pricePerBox,
  };
}
