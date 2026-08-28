/**
 * Product Metadata Extraction
 *
 * Resolves a Shopify variant GID to the product metadata our analytics events
 * carry (productType, productId, packSize, tier).
 *
 * THIS FUNCTION IS TOTAL: it always returns metadata, never null. That is
 * deliberate (SCRUM-1244). It previously returned null on an unrecognised
 * variant, and its one caller read null as "skip tracking", so when the
 * catalogue moved to funnel variants every live add-to-cart stopped being
 * tracked and nothing surfaced the problem: 86 visitors provably had a cart
 * line in a week while only 3 `purchase:add_to_cart` events fired.
 *
 * A lookup miss is now data ("unknown"), not silence.
 */

import { getOfferByVariantId, type OfferProduct } from "./offerData";
import { FORMULA_VARIANTS } from "./shopifyProductMapping";
import type { FormulaId, PackSize } from "./productData";

// LEGACY: the protocol branch below exists for customers who still hold a
// protocol subscription. See app/lib/legacy/protocolSubscriptions.ts.
import { PROTOCOL_VARIANTS } from "./legacy/protocolSubscriptions";
import type {
  ProtocolId,
  ProtocolTier,
} from "./legacy/protocolSubscriptions";

export interface ProductMetadata {
  /** "unknown" means the variant resolved against no table. See UNKNOWN_PRODUCT_ID. */
  productType: "formula" | "protocol" | "unknown";
  productId: string;  // "01", "02", "03" (formulas) or "1".."4" (protocols)
  packSize?: PackSize;
  tier?: ProtocolTier;
}

/**
 * Fallback `productId` when a variant matched no table AND carried no usable
 * GID (an empty variantId). An unmapped variant that DOES have a GID keeps it
 * as its `productId`, so the specific variant is identifiable from the data.
 *
 * To find catalogue changes that outran this mapping, filter on
 * `productType eq 'unknown'`, not on this value.
 */
export const UNKNOWN_PRODUCT_ID = "unknown";

/**
 * The live offer catalogue uses "flow" / "clear" / "both"; analytics has always
 * keyed formulas numerically ("01" Flow, "02" Clear), and "03" is Both, matching
 * ProductHeroId. Kept in sync by the type: adding a OfferProduct fails the build
 * here rather than silently emitting an unmapped event.
 */
const OFFER_PRODUCT_TO_ID: Record<OfferProduct, string> = {
  flow: "01",
  clear: "02",
  both: "03",
};

/**
 * Extract product metadata from a variant ID.
 *
 * Resolution order, most authoritative first:
 *
 * 1. **The live offer catalogue** (`getOfferByVariantId` over `OFFER_VARIANTS`).
 *    Every current buy path resolves its variant through `getOfferVariant`, so
 *    this covers everything the site sells today. It is the same table checkout
 *    reads, which is the point: it cannot go stale without checkout breaking
 *    loudly first, unlike an analytics-only mapping that rots in silence.
 * 2. **Legacy formula TRIAL variants** - historical carts and old links.
 * 3. **Legacy protocol variants** - customers still holding a protocol sub.
 * 4. **Unknown** - returns `productType: "unknown"` with the raw variant GID as
 *    `productId`, so the event still fires and the gap is visible in the data.
 *
 * @param variantId - Shopify variant GID (e.g. "gid://shopify/ProductVariant/...")
 * @returns Product metadata. Never null.
 */
export function extractProductMetadata(variantId: string): ProductMetadata {
  // 1. The live offer catalogue - everything the site currently sells.
  const offer = getOfferByVariantId(variantId);
  if (offer) {
    return {
      productType: "formula",
      productId: OFFER_PRODUCT_TO_ID[offer.product],
      // packSize is deliberately omitted: funnel offers ship 20 / 28 / 80 shots
      // and PackSize only allows "4" | "8" | "12" | "28". Reporting a wrong size
      // is worse than reporting none, and `purchaseType` already separates
      // subscription from one-time on the event.
    };
  }

  // 2. Legacy formula TRIAL variants (historical carts, old links).
  for (const formulaId of ["01", "02"] as FormulaId[]) {
    const formulaVariants = FORMULA_VARIANTS[formulaId];
    if (!formulaVariants) continue;

    for (const [packSize, mappedVariantId] of Object.entries(formulaVariants)) {
      if (mappedVariantId === variantId) {
        return {
          productType: "formula",
          productId: formulaId,
          packSize: packSize as PackSize,
        };
      }
    }
  }

  // 3. Legacy protocol variants (customers still holding a protocol sub).
  for (const protocolId of ["1", "2", "3", "4"] as ProtocolId[]) {
    const protocolVariants = PROTOCOL_VARIANTS[protocolId];
    if (!protocolVariants) continue;

      for (const [tier, tierVariant] of Object.entries(protocolVariants)) {
      if (tierVariant?.variantId === variantId) {
        // Extract pack size from tier (starter=4, pro=12, max=28)
        // Note: Protocol 4 max has 56 shots, but PackSize type only allows "4" | "8" | "12" | "28"
        // So we'll use "28" as the closest match for max tiers
        let packSize: PackSize | undefined;
        if (tier === "starter") {
          packSize = "4";
        } else if (tier === "pro") {
          packSize = "12";
        } else if (tier === "max") {
          packSize = "28"; // Use 28 as standard max, even though Protocol 4 max is 56
        }

        return {
          productType: "protocol",
          productId: protocolId,
          tier: tier as ProtocolTier,
          packSize: packSize,
        };
      }
    }
  }

  // 4. Unrecognised. Return metadata anyway so the event still fires and the
  // gap shows up as data. The raw GID goes in productId so an unmapped variant
  // can be identified from the dashboard without a code change.
  return {
    productType: "unknown",
    productId: variantId || UNKNOWN_PRODUCT_ID,
  };
}
