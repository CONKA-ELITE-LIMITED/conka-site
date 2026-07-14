/**
 * Product data barrel.
 * Re-exports from: productTypes, productColors, productPricing,
 * formulaContent, productHelpers.
 * Consumers keep importing from "@/app/lib/productData".
 *
 * Note: ProtocolId and protocolPricing still live in productTypes/productPricing.
 * They are legacy support for existing protocol subscribers (the account portal
 * and Shopify variant mapping), not a live product surface.
 */

export * from "./productTypes";
export * from "./productColors";
export * from "./productPricing";
export * from "./formulaContent";
export * from "./productHelpers";
export * from "./productImages";
