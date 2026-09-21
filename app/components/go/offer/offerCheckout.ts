/**
 * Offer page straight-to-checkout helper (/go offer format, SCRUM-1343).
 *
 * Creates a fresh Shopify cart with the exact variant and selling plan the page
 * showed, then redirects to Shopify-hosted checkout. It never touches the site
 * cart drawer. Modelled on app/lander/sections/BuyBoxes/lander-checkout.ts, and
 * like it deliberately avoids byoCheckout(), which re-resolves its own variant
 * from the four BYO cadences and knows nothing about trial packs.
 *
 * Line attributes (CART_ATTRIBUTES.md) separate the orders once they reach
 * Shopify and conka-lab:
 * - `_source`       always "trial_pack"
 * - `_offer_choice` the selected option: "flow", "clear" or "both"
 * - `_purchase`     "trial" (trial pack, converts to monthly) or "one_time" (buy-once link)
 *
 * Those three are LINE attributes, and conka-lab's Shopify ingest does not read
 * line attributes at all (SCRUM-1382). So the CART also carries
 * `_listicle_origin`, the order-level key the pipeline already parses, which is
 * what lets the Landing Pages view count this page's orders without waiting on
 * that ingest change (SCRUM-1381).
 */

import {
  buildMetaCartAttributes,
  toContentId,
  trackMetaAddToCart,
  trackMetaInitiateCheckout,
} from "@/app/lib/metaPixel";
import { trackAddToCart as trackTripleWhaleAddToCart } from "@/app/lib/tripleWhale";
import { trackCartCheckoutClicked, trackPurchaseAddToCart } from "@/app/lib/analytics";
import type { OfferProduct } from "@/app/lib/offerData";
import type { OfferOptionId } from "@/app/lib/landings/offer-types";

export type OfferPurchaseType = "trial" | "one_time";

export const OFFER_SOURCE = "trial_pack";

export interface OfferCheckoutArgs {
  product: OfferProduct;
  option: OfferOptionId;
  purchase: OfferPurchaseType;
  /** This offer page's landing slug, e.g. "trial-pack". Half of the
   *  `_listicle_origin` token; passed in rather than hardcoded because the
   *  offer format is a template and a second offer page must not report as
   *  the first one. */
  slug: string;
  /** Section that carried the CTA ("hero", "sticky", "otp"), for analytics. */
  section: string;
  variantId: string;
  /** Required for "trial": the Skio plan that converts the pack to monthly. */
  sellingPlanId?: string;
  /** Pre-add display price, for analytics only. */
  price: number;
  /** Shots in the trial pack, sent as the add-to-cart pack size. */
  packSize?: "4" | "8";
}

export async function offerCheckout(args: OfferCheckoutArgs): Promise<void> {
  // Fail closed: a trial pack bought without its plan would sell at the base
  // price and never convert, which is the one outcome this page must not ship.
  if (args.purchase === "trial" && !args.sellingPlanId) {
    throw new Error(`Trial selling plan not configured for "${args.option}"`);
  }

  // `<slug>-<section>`, the same shape the listicles' useListicleSrc builds, so
  // conka-lab's known-slug split reads it without a special case. Ordered after
  // the Meta identity attributes purely for readability; Shopify does not care.
  const cartAttributes = [
    ...buildMetaCartAttributes(),
    { key: "_listicle_origin", value: `${args.slug}-${args.section}` },
  ];

  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "create",
      variantId: args.variantId,
      quantity: 1,
      ...(args.sellingPlanId && { sellingPlanId: args.sellingPlanId }),
      attributes: [
        { key: "_source", value: OFFER_SOURCE },
        { key: "_offer_choice", value: args.option },
        { key: "_purchase", value: args.purchase },
      ],
      // Always non-empty now that the origin rides here, so no length guard.
      cartAttributes,
    }),
  });
  if (!res.ok) throw new Error(`Cart create failed: ${res.status}`);

  const data = await res.json();
  const url = data?.cart?.checkoutUrl;
  if (!url) throw new Error("No checkout URL returned from /api/cart");

  // Fail closed on the cart Shopify actually built, not just on config. When
  // Shopify rejects a selling plan, /api/cart silently retries without it and
  // still returns 200 (with a `warning`), which would sell the trial pack at
  // its full one-time price and never convert. Refuse unless the line carries
  // the exact trial plan.
  if (args.purchase === "trial") {
    const line = data.cart.lines?.edges?.[0]?.node as
      | { sellingPlanAllocation?: { sellingPlan?: { id?: string } } | null }
      | undefined;
    const appliedPlanId = line?.sellingPlanAllocation?.sellingPlan?.id;
    if (data.warning || appliedPlanId !== args.sellingPlanId) {
      throw new Error(
        `Trial plan not applied for "${args.option}": expected ${args.sellingPlanId}, got ${appliedPlanId ?? "none"}`,
      );
    }
  }

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

    // The dashboard's bottom funnel stage, as in byoCheckout: one line, the
    // charged value, fired immediately before the redirect (keepalive survives it).
    trackCartCheckoutClicked({ items: 1, value: args.price });

    trackPurchaseAddToCart({
      productType: "formula",
      productId: args.product,
      variantId: args.variantId,
      packSize: args.packSize,
      purchaseType: args.purchase === "trial" ? "subscription" : "one-time",
      location: `offer_${args.section}`,
      source: OFFER_SOURCE,
      price: args.price,
    });
  } catch {
    // Analytics should never block checkout.
  }
}
