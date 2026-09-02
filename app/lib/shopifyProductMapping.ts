/**
 * Shopify Product Variant Mapping
 *
 * This file maps internal product identifiers to Shopify variant GIDs.
 *
 * HOW TO GET VARIANT IDs:
 * 1. Create products in Shopify Admin
 * 2. Go to Products > [Product] > Variants
 * 3. Click on a variant and find the ID in the URL, or use Shopify's GraphQL API
 * 4. Format: "gid://shopify/ProductVariant/XXXXXXXXXX"
 *
 * IMPORTANT: Leave as empty strings until products are created in Shopify.
 * The cart system will validate and show errors for missing variant IDs.
 */

import { FormulaId, PackSize, PurchaseType } from "./productData";

// ============================================
// INDIVIDUAL FORMULA VARIANTS
// ============================================


// Extended pack sizes for individual formulas (includes 8 and 28)
type FormulaPackSize = "4" | "8" | "12" | "28";

// Selling plan mapping by pack size
export const FORMULA_SELLING_PLANS: Record<FormulaPackSize, string> = {
  "4": "gid://shopify/SellingPlan/711429882230", // 4x shots weekly
  "8": "gid://shopify/SellingPlan/711429947766", // 8x shots bi-weekly (uses Pro plan)
  "12": "gid://shopify/SellingPlan/711429947766", // 12x shots bi-weekly
  "28": "gid://shopify/SellingPlan/711429980534", // 28x shots monthly
};

export const FORMULA_VARIANTS: Record<
  FormulaId,
  Record<FormulaPackSize, string>
> = {
  // CONKA Flow (Formula 01) - CONFIGURED
  "01": {
    "4": "gid://shopify/ProductVariant/57000187363702", // FLOW_TRIAL_4 - £14.99
    "8": "gid://shopify/ProductVariant/56999967785334", // FLOW_TRIAL_8 - £28.99
    "12": "gid://shopify/ProductVariant/56999967752566", // FLOW_TRIAL_12 - £39.99
    "28": "gid://shopify/ProductVariant/56999967818102", // FLOW_TRIAL_28 - £79.99
  },
  // CONKA Clear (Formula 02) - CONFIGURED
  "02": {
    "4": "gid://shopify/ProductVariant/57000418607478", // CLEAR_TRIAL_4 - £14.99
    "8": "gid://shopify/ProductVariant/57000418640246", // CLEAR_TRIAL_8 - £28.99
    "12": "gid://shopify/ProductVariant/57000418673014", // CLEAR_TRIAL_12 - £39.99
    "28": "gid://shopify/ProductVariant/57000418705782", // CLEAR_TRIAL_28 - £79.99
  },
};

// Protocol variants are NOT here. They are retired-product support for existing
// subscribers and live in ./legacy/protocolSubscriptions.

// Subscription discount percentage (for visual display)
export const SUBSCRIPTION_DISCOUNT_PERCENT = 20;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the Shopify variant ID for an individual formula
 * For subscriptions, also returns the selling plan ID
 */
export function getFormulaVariantId(
  formulaId: FormulaId,
  packSize: PackSize,
  purchaseType: PurchaseType,
): { variantId: string; sellingPlanId?: string } | null {
  // Cast packSize to FormulaPackSize (formulas support 4, 8, 12, 28)
  const variantId =
    FORMULA_VARIANTS[formulaId]?.[
      packSize as keyof (typeof FORMULA_VARIANTS)["01"]
    ];
  if (!variantId) return null;

  if (purchaseType === "subscription") {
    const sellingPlanId =
      FORMULA_SELLING_PLANS[packSize as keyof typeof FORMULA_SELLING_PLANS];
    return { variantId, sellingPlanId };
  }

  return { variantId };
}
