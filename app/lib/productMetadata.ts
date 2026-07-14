/**
 * Product Metadata Extraction
 * 
 * Helper functions to extract product metadata (productType, productId, packSize, tier)
 * from Shopify variant IDs by reverse-looking up the variant mapping.
 */

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
  productType: "formula" | "protocol";
  productId: string;  // "01", "02" (formulas) or "1", "2", "3", "4" (protocols)
  packSize?: PackSize;
  tier?: ProtocolTier;
}

/**
 * Extract product metadata from variant ID
 * 
 * Reverse-looks up the variant ID in FORMULA_VARIANTS and PROTOCOL_VARIANTS
 * to determine product type, ID, pack size, and tier.
 * 
 * @param variantId - Shopify variant GID (e.g., "gid://shopify/ProductVariant/...")
 * @returns Product metadata or null if not found
 */
export function extractProductMetadata(variantId: string): ProductMetadata | null {
  // Check formulas first
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

  // Check protocols
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

  // Not found in mappings
  return null;
}
