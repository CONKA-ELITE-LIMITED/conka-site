import type { OfferConfig } from "./offer-types";

/**
 * £14.99 weekly Flow 4 box (SCRUM-1343).
 * Plan and decisions: docs/development/featurePlans/trial-box/README.md.
 *
 * Shopify: FLOW-BOX-4 at a £29.98 base price, on the Skio "4 Shots - Weekly"
 * plan at 50% off, which charges £14.99. Bought without the plan (the buy-once
 * link) it charges the base price. If either number changes in Shopify, change
 * `box` here in the same PR so the page never shows a price the checkout does
 * not charge.
 */
export const flowFourBox: OfferConfig = {
  format: "offer",
  slug: "flow-4-box",
  title: "CONKA Flow 4 Box",
  formulaId: "01",
  productName: "Flow",
  offerId: "flow_box_4",
  box: {
    shots: 4,
    price: 14.99,
    compareAtPrice: 29.98,
    variantId: "gid://shopify/ProductVariant/58714075136374", // FLOW-BOX-4
    sellingPlanId: "gid://shopify/SellingPlan/712985543030", // Skio 4 Shots - Weekly
  },
  guaranteeDays: 30,
  // Rendered from design/pdp-slides/slides/t0.html. "50% off for life" is burned in.
  galleryLead: "/formulas/mmPdpAssetsV2/FlowTrialBox.jpg",
  // Condensed from Phil B.'s review in app/lander/sections/Reviews/reviews.data.ts.
  review: {
    quote:
      "I was getting through the day on five coffees and still hitting a wall by 4pm... Swapped my afternoon coffees for Flow and the difference was immediate.",
    name: "Phil B.",
    avatar: "/lander/reviews/PhilB.jpg",
  },
  tile: {
    name: "4 shots",
    badge: "Easiest way to start",
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
