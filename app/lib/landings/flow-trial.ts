import type { OfferConfig } from "./offer-types";

/**
 * £14.99 weekly Flow trial box (SCRUM-1343).
 * Plan and decisions: docs/development/featurePlans/trial-box/README.md.
 *
 * Shopify: FLOW-BOX-4 at a £29.98 base price, on the Skio "4 Shots - Weekly"
 * plan at 50% off, which charges £14.99. Bought without the plan (the buy-once
 * link) it charges the base price. If either number changes in Shopify, change
 * `trial` here in the same PR so the page never shows a price the checkout does
 * not charge.
 */
export const flowTrial: OfferConfig = {
  format: "offer",
  slug: "flow-trial",
  title: "CONKA Flow Trial Box",
  formulaId: "01",
  productName: "Flow",
  offerId: "flow_trial_4",
  trial: {
    shots: 4,
    price: 14.99,
    compareAtPrice: 29.98,
    variantId: "gid://shopify/ProductVariant/58714075136374", // FLOW-BOX-4
    sellingPlanId: "gid://shopify/SellingPlan/712985543030", // Skio 4 Shots - Weekly
  },
  // Placeholder until the 4-shot box asset lands: swap the path, nothing else.
  galleryLead: "/formulas/box/FlowBox.jpg",
  // Condensed from Phil B.'s review in app/lander/sections/Reviews/reviews.data.ts.
  review: {
    quote:
      "I was getting through the day on five coffees and still hitting a wall by 4pm... Swapped my afternoon coffees for Flow and the difference was immediate.",
    name: "Phil B.",
    avatar: "/lander/reviews/PhilB.jpg",
  },
  tile: {
    name: "4 shots",
    badge: "Trial offer",
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
