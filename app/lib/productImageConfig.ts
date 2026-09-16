/**
 * Product Image Configuration
 * Images used in navigation menus, shop cards, and other navigation contexts.
 * Hero images are defined separately in heroImageConfig.ts
 */

import type { ProductHeroId } from "./productTypes";

// Product navigation images (for cards, menus)
export const productNavigationImages: Record<ProductHeroId, string> = {
  "01": "/formulas/conkaFlow/FlowHold.jpg",
  "02": "/formulas/conkaClear/ClearHold.jpg",
  "03": "/formulas/both/BothHold.jpg",
};

/**
 * Get the navigation image for Flow, Clear or Both
 */
export function getProductImage(productId: ProductHeroId): string {
  return productNavigationImages[productId];
}
