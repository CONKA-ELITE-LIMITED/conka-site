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

// LEGACY: protocols are subscriber support, not a live product.
// Read app/lib/legacy/protocolSubscriptions.ts before touching anything below
// that mentions them.
import { PROTOCOL_VARIANTS } from "./legacy/protocolSubscriptions";
import type {
  ProtocolId,
  ProtocolTier,
} from "./legacy/protocolSubscriptions";

export { PROTOCOL_VARIANTS };

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

/** Loop plan ID → frequency for LTV tagging (cart line attributes). */
const SELLING_PLAN_FREQUENCY: Record<string, "weekly" | "biweekly" | "monthly"> = {
  "711429882230": "weekly",
  "711429947766": "biweekly",
  "711429980534": "monthly",
};

/**
 * Map selling plan GID (or numeric ID) to plan frequency for cart attributes.
 * Returns undefined for one-time (no selling plan) or unknown plan.
 */
export function getPlanFrequency(
  sellingPlanId: string | undefined
): "weekly" | "biweekly" | "monthly" | undefined {
  if (!sellingPlanId) return undefined;
  const match = sellingPlanId.match(/\d+/);
  const numeric = match ? match[0] : sellingPlanId;
  return SELLING_PLAN_FREQUENCY[numeric];
}

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

// ============================================
// TRIAL PACK VARIANTS (one-time only, home page)
// These are the smaller trial packs for first-time buyers
// ============================================

type TrialPackSize = "4" | "8" | "12";

export const TRIAL_PACK_VARIANTS: Record<
  FormulaId,
  Record<TrialPackSize, string>
> = {
  // CONKA Flow Trial Packs - CONFIGURED
  "01": {
    "4": "gid://shopify/ProductVariant/57000187363702", // FLOW_TRIAL_4 - £14.99
    "8": "gid://shopify/ProductVariant/56999967785334", // FLOW_TRIAL_8 - £28.99
    "12": "gid://shopify/ProductVariant/56999967752566", // FLOW_TRIAL_12 - £39.99
  },
  // CONKA Clear Trial Packs - CONFIGURED
  "02": {
    "4": "gid://shopify/ProductVariant/57000418607478", // CLEAR_TRIAL_4 - £14.99
    "8": "gid://shopify/ProductVariant/57000418640246", // CLEAR_TRIAL_8 - £28.99
    "12": "gid://shopify/ProductVariant/57000418673014", // CLEAR_TRIAL_12 - £39.99
  },
};

// ============================================
// PROTOCOL VARIANTS (LEGACY)
// ============================================
// PROTOCOL_VARIANTS is defined in ./legacy/protocolSubscriptions and re-exported
// above. It maps existing subscribers' renewals to real Shopify variants.

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

/**
 * Get the Shopify variant ID for a trial pack
 */
export function getTrialPackVariantId(
  formulaId: FormulaId,
  packSize: TrialPackSize,
): string | null {
  const variantId = TRIAL_PACK_VARIANTS[formulaId]?.[packSize];
  return variantId || null;
}

/**
 * Get the Shopify variant ID for a protocol
 * For one-time purchases, only returns variantId
 * For subscriptions, returns both variantId and sellingPlanId
 */
export function getProtocolVariantId(
  protocolId: ProtocolId,
  tier: ProtocolTier,
  purchaseType: PurchaseType,
): { variantId: string; sellingPlanId?: string } | null {
  const tierVariant = PROTOCOL_VARIANTS[protocolId]?.[tier];
  if (!tierVariant || !tierVariant.variantId) return null;

  if (purchaseType === "subscription") {
    return {
      variantId: tierVariant.variantId,
      sellingPlanId: tierVariant.sellingPlanId || undefined,
    };
  }

  // One-time purchase - no selling plan
  return { variantId: tierVariant.variantId };
}

/**
 * Check if a variant ID is configured (not empty)
 */
export function isVariantConfigured(variantId: string | null): boolean {
  return variantId !== null && variantId !== "";
}

/**
 * Validate that all required variant IDs are configured
 * Useful for debugging during setup
 */
export function getUnconfiguredVariants(): string[] {
  const unconfigured: string[] = [];

  // Check formulas
  for (const formulaId of ["01", "02"] as FormulaId[]) {
    for (const packSize of ["4", "8", "12", "28"] as PackSize[]) {
      for (const purchaseType of [
        "subscription",
        "one-time",
      ] as PurchaseType[]) {
        const variantData = getFormulaVariantId(
          formulaId,
          packSize,
          purchaseType,
        );
        if (!isVariantConfigured(variantData?.variantId || null)) {
          unconfigured.push(
            `Formula ${formulaId} - ${packSize}-pack - ${purchaseType}`,
          );
        }
      }
    }
  }

  // Check trial packs
  for (const formulaId of ["01", "02"] as FormulaId[]) {
    for (const packSize of ["4", "8", "12"] as TrialPackSize[]) {
      const variantId = getTrialPackVariantId(formulaId, packSize);
      if (!isVariantConfigured(variantId)) {
        unconfigured.push(`Trial Pack ${formulaId} - ${packSize}-pack`);
      }
    }
  }

  // Check protocols
  for (const protocolId of ["1", "2", "3", "4"] as ProtocolId[]) {
    const tiers =
      protocolId === "4"
        ? (["pro", "max"] as ProtocolTier[])
        : (["starter", "pro", "max"] as ProtocolTier[]);

    for (const tier of tiers) {
      for (const purchaseType of [
        "subscription",
        "one-time",
      ] as PurchaseType[]) {
        const variantData = getProtocolVariantId(
          protocolId,
          tier,
          purchaseType,
        );
        if (!isVariantConfigured(variantData?.variantId || null)) {
          unconfigured.push(
            `Protocol ${protocolId} - ${tier} - ${purchaseType}`,
          );
        }
      }
    }
  }

  return unconfigured;
}
