import type { OfferConfig } from "./offer-types";

/**
 * £14.99 weekly Clear 4 box (SCRUM-1343). Same offer as flow-4-box.ts, wired
 * to Clear: formula "02", CLEAR-BOX-4 and its own hero image. Everything else
 * (gallery slides, ingredients, what to expect, comparison, FAQ, the monthly
 * upsell to CLEAR-STARTER-20) follows from `formulaId`.
 *
 * Shopify: CLEAR-BOX-4 at a £29.98 base price, on the same Skio "4 Shots -
 * Weekly" plan as Flow at 50% off, which charges £14.99. Bought without the
 * plan (the buy-once link) it charges the base price. If either number changes
 * in Shopify, change `box` here in the same PR.
 */
export const clearFourBox: OfferConfig = {
  format: "offer",
  slug: "clear-4-box",
  title: "CONKA Clear 4 Box",
  formulaId: "02",
  productName: "Clear",
  offerId: "clear_box_4",
  box: {
    shots: 4,
    price: 14.99,
    compareAtPrice: 29.98,
    variantId: "gid://shopify/ProductVariant/58714000163190", // CLEAR-BOX-4
    sellingPlanId: "gid://shopify/SellingPlan/712985543030", // Skio 4 Shots - Weekly
  },
  guaranteeDays: 30,
  // Rendered from design/pdp-slides/slides/ct0.html. "50% off for life" is burned in.
  galleryLead: "/formulas/mmPdpAssetsV2/ClearTrialBox.jpg",
  // Condensed from Aaron H.'s review in app/lib/customerTestimonials.ts: the
  // afternoon swap is Clear's slot. No review in our data names Clear alone.
  review: {
    quote:
      "I used to rely on coffee to get through it, but that third cup always came with a trade-off... Swapping that for Conka in the afternoon has made a real difference.",
    name: "Aaron H.",
    avatar: "/lander/reviews/AaronH.jpg",
  },
  tile: {
    name: "4 shots",
    badge: "Best value",
    details: [
      "Delivered weekly",
      "Free UK shipping",
      "Pause or skip anytime",
      "Cancel anytime",
    ],
    footer: "50% off every box, not just the first",
    cta: "Checkout - £14.99",
    renewal: "Then £14.99 every week until you cancel.",
  },
  sticky: {
    label: "4 shots, £14.99/week",
    cta: "Checkout - £14.99",
  },
};
