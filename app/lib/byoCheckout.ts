/**
 * Build Your Order — Isolated Checkout Flow
 *
 * Creates a fresh Shopify cart, fires analytics, and returns the
 * checkout URL for redirect. Completely independent of the global
 * CartContext — the Build Your Order flow never opens the cart drawer.
 */

import {
  type ByoProduct,
  type ByoCadence,
  getOfferVariant,
  getOfferPricing,
  getCadenceFrequency,
} from "./byoData";
import { trackMetaAddToCart, trackMetaInitiateCheckout, toContentId, buildMetaCartAttributes } from "@/app/lib/metaPixel";
import { trackAddToCart as trackTripleWhaleAddToCart } from "@/app/lib/tripleWhale";
import { trackPurchaseAddToCart } from "@/app/lib/analytics";

interface ByoCheckoutParams {
  product: ByoProduct;
  cadence: ByoCadence;
  upsellAccepted: boolean;
  /**
   * Order attribution tag, written to the cart's `_source` attribute and the
   * `purchase:add_to_cart` event (flows into Shopify and Triple Whale).
   * Required, never defaulted: a hardcoded default once made every funnel-c
   * order look like a funnel-b order and revenue could not be attributed.
   * The live flow passes BYO_SOURCE (app/build-your-order/defaults.ts).
   */
  source: string;
}

interface ByoCheckoutSuccess {
  checkoutUrl: string;
}

interface ByoCheckoutError {
  error: string;
}

export type ByoCheckoutResult = ByoCheckoutSuccess | ByoCheckoutError;

export function isByoCheckoutError(
  result: ByoCheckoutResult,
): result is ByoCheckoutError {
  return "error" in result;
}

export async function byoCheckout(
  params: ByoCheckoutParams,
): Promise<ByoCheckoutResult> {
  const { product, cadence, upsellAccepted, source } = params;

  // 1. Look up variant
  const variant = getOfferVariant(product, cadence);
  if (!variant) {
    return {
      error: "This product combination isn't available yet. Please choose a different option.",
    };
  }

  // 2. Get pricing for analytics
  const pricing = getOfferPricing(product, cadence);

  // 3. Create cart via existing API. Cart-level _fbp/_fbc (the ad-click
  // identifiers) ride along so the order carries them for the server-side
  // Purchase webhook — the funnel checkout is isolated from CartContext, so it
  // must attach them itself via the same shared helper.
  const cartAttributes = buildMetaCartAttributes();
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        variantId: variant.variantId,
        quantity: 1,
        sellingPlanId: variant.sellingPlanId || undefined,
        attributes: [
          { key: "_source", value: source },
          { key: "_plan_frequency", value: getCadenceFrequency(cadence) },
          { key: "_upsell_accepted", value: String(upsellAccepted) },
          { key: "_selected_product", value: product },
        ],
        ...(cartAttributes.length > 0 && { cartAttributes }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        error: errorData?.error || "Something went wrong. Please try again.",
      };
    }

    const data = await response.json();
    const checkoutUrl = data?.cart?.checkoutUrl;

    if (!checkoutUrl) {
      return { error: "Could not create checkout. Please try again." };
    }

    // 4. Fire analytics (non-blocking — don't await, don't let failures block checkout)
    fireAnalytics({
      variantId: variant.variantId,
      product,
      cadence,
      price: pricing.price,
      source,
    });

    return { checkoutUrl };
  } catch {
    return { error: "Network error. Please check your connection and try again." };
  }
}

/** Fire all analytics events. Non-blocking, fails silently. */
function fireAnalytics(params: {
  variantId: string;
  product: ByoProduct;
  cadence: ByoCadence;
  price: number;
  source: string;
}): void {
  const { variantId, product, cadence, price, source } = params;
  const contentId = toContentId(variantId);
  const purchaseType = cadence === "monthly-otp" ? "one-time" : "subscription";

  try {
    // Meta Pixel — AddToCart + InitiateCheckout, fired here (on our domain) at
    // the checkout click. Headless checkout is offsite on Shopify, so the pixel
    // cannot fire IC there; both use sendBeacon/CAPI-keepalive to survive the
    // redirect that follows.
    trackMetaAddToCart({
      content_ids: [contentId],
      value: price,
      currency: "GBP",
      num_items: 1,
    });
    trackMetaInitiateCheckout({
      content_ids: [contentId],
      value: price,
      currency: "GBP",
      num_items: 1,
    });

    // Triple Whale
    trackTripleWhaleAddToCart({
      productId: variantId,
      variantId,
      quantity: 1,
    });

    // Vercel Analytics
    trackPurchaseAddToCart({
      productType: "formula",
      productId: product,
      variantId,
      purchaseType,
      location: "funnel_cta",
      source,
      price,
    });
  } catch {
    // Analytics should never block checkout
  }
}
