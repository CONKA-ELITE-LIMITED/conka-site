/**
 * LEGACY: protocol subscription support.
 *
 * ⚠️  This is NOT a live product surface. Protocols were retired as a product in
 * the 2026 simplification (the offering is now Flow / Clear / Both). Everything
 * in this file exists for one reason: real customers still hold protocol
 * subscriptions in Shopify, and their renewals have to keep resolving to a
 * variant. Deleting it breaks billing and the account portal for those people.
 *
 * DO NOT build on this. Nothing new should import from here.
 * New product work belongs in productTypes / shopifyProductMapping.
 *
 * Consumers (all subscriber-support code, no product pages):
 *   - app/lib/productTypes.ts     (ProtocolId, only to keep the ProductId union)
 *   - app/lib/productMetadata.ts  (reverse lookup: Shopify variant ID -> product)
 *
 * The account portal (app/components/subscriptions/*) and the pause route
 * (app/api/auth/subscriptions/[id]/pause/route.ts) are the reason this exists,
 * but they carry their own protocol handling rather than importing from here.
 *
 * This module is a dependency leaf on purpose: it imports nothing from the
 * product modules, so productTypes can depend on it without a cycle.
 *
 * Retiring it entirely is "Phase 5" in
 * docs/development/featurePlans/asset-and-protocol-cleanup.md, which is NOT
 * planned. It only becomes possible once zero customers hold a protocol
 * subscription, which is an ops migration, not a code change.
 */

/** The four retired protocols: Resilience, Precision, Balance, Ultimate. */
export type ProtocolId = "1" | "2" | "3" | "4";

/** Subscription size tiers a protocol could be bought at. */
export type ProtocolTier = "starter" | "pro" | "max";

type ProtocolTierVariant = {
  variantId: string;
  /** Used for subscription purchases. */
  sellingPlanId: string;
};

type ProtocolTierVariants = Partial<
  Record<ProtocolTier, ProtocolTierVariant>
>;

/**
 * Real Shopify variant + selling plan IDs for the retired protocol products.
 *
 * These IDs are LIVE. An existing subscriber's renewal maps through this table.
 * Do not edit, reorder, or "tidy" the IDs.
 */
export const PROTOCOL_VARIANTS: Record<ProtocolId, ProtocolTierVariants> = {
  // Protocol 1 (Resilience)
  "1": {
    starter: {
      variantId: "gid://shopify/ProductVariant/56999240597878", // RESILIANCE_STARTER_4 - £14.99
      sellingPlanId: "gid://shopify/SellingPlan/711429882230", // 20% discount - £11.99
    },
    pro: {
      variantId: "gid://shopify/ProductVariant/56999240630646", // RESILIANCE_PRO_12 - £39.99
      sellingPlanId: "gid://shopify/SellingPlan/711429947766", // 20% discount - £31.99
    },
    max: {
      variantId: "gid://shopify/ProductVariant/56999240663414", // RESILIANCE_MAX_28 - £79.99
      sellingPlanId: "gid://shopify/SellingPlan/711429980534", // 20% discount - £63.99
    },
  },
  // Protocol 2 (Precision)
  "2": {
    starter: {
      variantId: "gid://shopify/ProductVariant/56999234503030", // PRECISION_STARTER_4 - £14.99
      sellingPlanId: "gid://shopify/SellingPlan/711429882230", // 20% discount - £11.99
    },
    pro: {
      variantId: "gid://shopify/ProductVariant/56999234535798", // PRECISION_PRO_12 - £39.99
      sellingPlanId: "gid://shopify/SellingPlan/711429947766", // 20% discount - £31.99
    },
    max: {
      variantId: "gid://shopify/ProductVariant/56999234568566", // PRECISION_MAX_28 - £79.99
      sellingPlanId: "gid://shopify/SellingPlan/711429980534", // 20% discount - £63.99
    },
  },
  // Protocol 3 (Balance)
  "3": {
    starter: {
      variantId: "gid://shopify/ProductVariant/56998884573558", // BALANCED_STARTER_4 - £14.99
      sellingPlanId: "gid://shopify/SellingPlan/711429882230", // 20% discount - £11.99
    },
    pro: {
      variantId: "gid://shopify/ProductVariant/56998884606326", // BALANCED_PRO_12 - £39.99
      sellingPlanId: "gid://shopify/SellingPlan/711429947766", // 20% discount - £31.99
    },
    max: {
      variantId: "gid://shopify/ProductVariant/56998884639094", // BALANCED_MAX_28 - £79.99
      sellingPlanId: "gid://shopify/SellingPlan/711429980534", // 20% discount - £63.99
    },
  },
  // Protocol 4 (Ultimate) - never had a starter tier
  "4": {
    pro: {
      variantId: "gid://shopify/ProductVariant/56999249478006", // ULTAMATE_PRO_28 - £79.99
      sellingPlanId: "gid://shopify/SellingPlan/711429947766", // 20% discount - £63.99
    },
    max: {
      variantId: "gid://shopify/ProductVariant/56999249510774", // ULTAMATE_MAX_56 - £144.99
      sellingPlanId: "gid://shopify/SellingPlan/711429980534", // 20% discount - £115.99
    },
  },
};
