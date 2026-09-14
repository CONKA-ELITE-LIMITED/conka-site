import type { OfferConfig } from "./offer-types";

/**
 * £14.99 weekly Flow trial box (SCRUM-1343).
 * Plan and decisions: docs/development/featurePlans/trial-box/README.md.
 *
 * Shopify: FLOW-BOX-4 at a £29.98 base price, on the Skio "4 Shots - Weekly"
 * plan at 50% off, which charges £14.99. If either number changes in Shopify,
 * change `trial` here in the same PR so the page never shows a price the
 * checkout does not charge.
 */
export const flowTrial: OfferConfig = {
  format: "offer",
  slug: "flow-trial",
  title: "CONKA Flow trial box",
  product: "flow",
  productName: "Flow",
  offerId: "flow_trial_4",
  trial: {
    shots: 4,
    price: 14.99,
    compareAtPrice: 29.98,
    variantId: "gid://shopify/ProductVariant/58714075136374", // FLOW-BOX-4
    sellingPlanId: "gid://shopify/SellingPlan/712985543030", // Skio 4 Shots - Weekly
  },
  hero: {
    eyebrow: "CONKA Flow trial box",
    headline: "Steady focus, without the caffeine crash.",
    subline:
      "One 30ml shot each morning. Adaptogens like Ashwagandha and Lemon Balm, no caffeine, no jitters.",
    image: {
      src: "/formulas/box/FlowBox.jpg",
      alt: "A box of CONKA Flow shots",
      width: 1500,
      height: 1000,
    },
  },
  tile: {
    name: "4-shot trial box",
    bullets: [
      "4 shots of Flow, delivered every week",
      "Free UK delivery",
      "Pause, skip or cancel anytime",
    ],
    cta: "Start for £14.99",
    renewal: "Then £14.99 every week until you cancel.",
  },
  benefits: {
    title: "Why people swap their morning coffee for Flow",
    items: [
      {
        title: "Calm, steady focus",
        body: "Adaptogens including Ashwagandha and Lemon Balm take the edge off without dulling you.",
      },
      {
        title: "No caffeine, no crash",
        body: "Energy that holds through the morning, and nothing to keep you awake at night.",
      },
      {
        title: "Measured, not guessed",
        body: "+28.96% average cognitive score improvement across 150+ tested users.",
      },
    ],
  },
  steps: {
    title: "How the trial works",
    items: [
      {
        title: "Your box arrives",
        body: "Order before 2pm and it ships the same day. Most UK orders arrive in 1 to 2 working days.",
      },
      {
        title: "Take one shot each morning",
        body: "Straight from the bottle, with or without food.",
      },
      {
        title: "Then decide",
        body: "Stay weekly, switch to monthly from £2 a shot, or cancel from your account.",
      },
    ],
  },
  faqIds: ["how-to-take", "taste", "results"],
  offerFaqs: [
    {
      id: "trial-billing",
      question: "When am I charged?",
      answer:
        "£14.99 today for your first box, then £14.99 each week when your next box ships. Delivery is free on every box.",
    },
    {
      id: "trial-cancel",
      question: "How do I cancel?",
      answer:
        "From your account, anytime. There is no contract, no minimum term and no cancellation fee, and you can pause or skip a week instead.",
    },
  ],
  sticky: {
    label: "4 shots, £14.99/week",
    cta: "Start for £14.99",
  },
};
