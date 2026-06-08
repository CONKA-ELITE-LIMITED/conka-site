/**
 * Shopify variant GIDs for the two B2B products (Flow + Clear).
 *
 * Server-side only: imported by the card-checkout (`/api/b2b/cart`) and
 * pay-by-invoice (`/api/b2b/invoice-order`) routes, never by client components.
 *
 * These are plain constants, not env vars. They are not secret (the same GIDs
 * appear in any Storefront cart and in the checkout URL), and they do not vary
 * by environment - there is one prod Shopify store and the variants are stable.
 * So there is nothing to set in Vercel. If the B2B products are ever recreated,
 * update these ids here.
 */
export const B2B_VARIANTS: Record<"flow" | "clear", string> = {
  flow: "gid://shopify/ProductVariant/58019580084598",
  clear: "gid://shopify/ProductVariant/58019586834806",
};
