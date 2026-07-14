/**
 * Product data barrel.
 * Re-exports from: productTypes, productColors, productPricing,
 * formulaContent, productHelpers.
 * Consumers keep importing from "@/app/lib/productData".
 *
 * Note: ProtocolId still lives in productTypes. It is legacy support for existing
 * protocol subscribers (Shopify variant mapping in shopifyProductMapping.ts and
 * productMetadata.ts), not a live product surface. Do not build on it.
 */

export * from "./productTypes";
export * from "./productColors";
export * from "./productPricing";
export * from "./formulaContent";
export * from "./productHelpers";
export * from "./productImages";
