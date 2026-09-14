/**
 * Offer page straight-to-checkout helper (/go offer format, SCRUM-1343).
 *
 * Creates a fresh Shopify cart with the exact variant and selling plan the page
 * showed, then redirects to Shopify-hosted checkout. It never touches the site
 * cart drawer. Modelled on app/lander/sections/BuyBoxes/lander-checkout.ts, and
 * like it deliberately avoids byoCheckout(), which re-resolves its own variant
 * from the four BYO cadences and knows nothing about the weekly trial box.
 *
 * Line attributes (CART_ATTRIBUTES.md) are what separate a trial order from an
 * upsold monthly order once they reach Shopify and conka-lab:
 * - `_source`       always "trial_box"
 * - `_offer`        the config's offerId, e.g. "flow_trial_4"
 * - `_offer_choice` "trial" or "monthly" (took the upsell)
 */

import {
  buildMetaCartAttributes,
  toContentId,
  trackMetaAddToCart,
  trackMetaInitiateCheckout,
} from "@/app/lib/metaPixel";
import { trackAddToCart as trackTripleWhaleAddToCart } from "@/app/lib/tripleWhale";
import { trackPurchaseAddToCart } from "@/app/lib/analytics";
import type { OfferProduct } from "@/app/lib/offerData";

export type OfferChoice = "trial" | "monthly";

export const OFFER_SOURCE = "trial_box";

export interface OfferCheckoutArgs {
  product: OfferProduct;
  offerId: string;
  choice: OfferChoice;
  /** Section that carried the CTA ("hero", "steps", "sticky"), for analytics. */
  section: string;
  variantId: string;
  sellingPlanId: string;
  /** Pre-add display price, for analytics only. */
  price: number;
  /** Shots in the first shipment, sent as the add-to-cart pack size. */
  packSize: "4" | "28";
}

export async function offerCheckout(args: OfferCheckoutArgs): Promise<void> {
  const cartAttributes = buildMetaCartAttributes();

  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "create",
      variantId: args.variantId,
      quantity: 1,
      sellingPlanId: args.sellingPlanId,
      attributes: [
        { key: "_source", value: OFFER_SOURCE },
        { key: "_offer", value: args.offerId },
        { key: "_offer_choice", value: args.choice },
      ],
      ...(cartAttributes.length > 0 && { cartAttributes }),
    }),
  });
  if (!res.ok) throw new Error(`Cart create failed: ${res.status}`);

  const data = await res.json();
  const url = data?.cart?.checkoutUrl;
  if (!url) throw new Error("No checkout URL returned from /api/cart");

  fireAnalytics(args);

  window.location.href = url;
}

/** Non-blocking and silent on failure: analytics must never block checkout. */
function fireAnalytics(args: OfferCheckoutArgs): void {
  try {
    // AddToCart + InitiateCheckout fire here, on our domain, at the checkout
    // click: headless checkout is offsite on Shopify, so the pixel cannot fire
    // IC there. Same pattern as byoCheckout.
    const meta = {
      content_ids: [toContentId(args.variantId)],
      value: args.price,
      currency: "GBP",
      num_items: 1,
    };
    trackMetaAddToCart(meta);
    trackMetaInitiateCheckout(meta);

    trackTripleWhaleAddToCart({
      productId: args.variantId,
      variantId: args.variantId,
      quantity: 1,
    });

    trackPurchaseAddToCart({
      productType: "formula",
      productId: args.product,
      variantId: args.variantId,
      packSize: args.packSize,
      purchaseType: "subscription",
      location: args.choice === "monthly" ? "offer_upsell" : `offer_${args.section}`,
      source: OFFER_SOURCE,
      price: args.price,
    });
  } catch {
    // Analytics should never block checkout.
  }
}
