/**
 * Product data barrel.
 * Re-exports from: productTypes, productColors, productPricing,
 * formulaContent, productHelpers.
 * Consumers keep importing from "@/app/lib/productData".
 *
 * This barrel is the live product surface: formulas (Flow / Clear) and Both.
 *
 * It deliberately does NOT export anything protocol-related. Protocols are
 * retired as a product; what remains is legacy support for customers who still
 * hold a protocol subscription, and it is quarantined in
 * app/lib/legacy/protocolSubscriptions.ts. If you find yourself wanting
 * ProtocolId or PROTOCOL_VARIANTS from here, you almost certainly want neither.
 */

export * from "./productTypes";
export * from "./productColors";
export * from "./productPricing";
export * from "./formulaContent";
export * from "./productHelpers";
export * from "./productImages";
