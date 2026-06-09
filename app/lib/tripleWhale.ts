/**
 * Triple Whale Tracking Helpers
 * 
 * Client-side tracking functions for Triple Whale analytics.
 * Handles AddToCart events and ID extraction from Shopify GIDs.
 */

// Extend Window interface for TriplePixel
declare global {
  interface Window {
    TriplePixel?: (
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Extract numeric ID from Shopify GID format
 * 
 * Input: "gid://shopify/ProductVariant/57000187363702"
 * Output: "57000187363702"
 * 
 * If already numeric, returns as-is
 */
export function extractNumericId(gid: string): string {
  if (gid.includes('gid://shopify/')) {
    return gid.split('/').pop() || gid;
  }
  // Already numeric or unknown format
  return gid;
}

/**
 * Track AddToCart event in Triple Whale
 * 
 * @param params - AddToCart event parameters
 * @param params.productId - Shopify product GID (e.g., "gid://shopify/Product/...")
 * @param params.variantId - Shopify variant GID (e.g., "gid://shopify/ProductVariant/...")
 * @param params.quantity - Quantity added to cart
 * @param params.cartToken - Optional cart token for cart linking
 */
export function trackAddToCart(params: {
  productId: string;
  variantId: string;
  quantity: number;
  cartToken?: string;
}): void {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Optional: Skip tracking in development/preview to avoid polluting production data
  // Uncomment the lines below if you want to disable tracking in non-production
  // if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('vercel.app')) {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('🐋 Triple Whale AddToCart (skipped in dev):', params);
  //   }
  //   return;
  // }
  
  // Check if TriplePixel is loaded
  if (!window.TriplePixel) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Triple Whale: TriplePixel not loaded yet');
    }
    return;
  }

  try {
    // Extract numeric IDs from GIDs
    const itemId = extractNumericId(params.productId);
    const variantId = extractNumericId(params.variantId);

    // Build event payload
    const eventParams: Record<string, unknown> = {
      item: itemId,
      v: variantId,
      q: params.quantity,
    };

    // Add cart token if provided
    if (params.cartToken) {
      eventParams.token = params.cartToken;
    }

    // Fire TriplePixel event
    window.TriplePixel('AddToCart', eventParams);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🐋 Triple Whale AddToCart:', eventParams);
    }
  } catch (error) {
    // Fail silently in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Triple Whale tracking error:', error);
    }
  }
}
