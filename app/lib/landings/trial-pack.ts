import type { OfferConfig } from "./offer-types";

/**
 * CONKA trial pack (SCRUM-1343).
 * Plan and decisions: docs/development/featurePlans/trial-box/README.md.
 *
 * Flow, Clear or Both for a few days, then Skio moves the contract onto that
 * product's monthly starter plan (FLOW-STARTER-20 / CLEAR-STARTER-20 /
 * BOTH-STARTER-40) `conversionDays` after the order. Monthly and one-time
 * figures come from offerData; only the trial fields live here.
 *
 * Before launch: trial prices are placeholders, and every `sellingPlanId` must
 * be the Skio trial plan (trial checkout refuses to run while it is null).
 */
export const trialPack: OfferConfig = {
  format: "offer",
  slug: "trial-pack",
  title: "CONKA Trial Pack",
  trialDays: 4,
  conversionDays: 7,
  defaultOption: "both",
  options: [
    {
      id: "both",
      label: "Flow + Clear",
      heroId: "03",
      shots: 8,
      price: 18.99, // placeholder
      variantId: "gid://shopify/ProductVariant/58717657989494", // BOTH-BOX-8
      sellingPlanId: null, // Skio trial plan, not yet created
      badge: "Best value",
    },
    {
      id: "flow",
      label: "Flow",
      heroId: "01",
      shots: 4,
      price: 12.99, // placeholder
      variantId: "gid://shopify/ProductVariant/58714075136374", // FLOW-BOX-4
      sellingPlanId: null, // Skio trial plan, not yet created
      galleryLead: "/formulas/mmPdpAssetsV2/FlowTrialBox.jpg",
    },
    {
      id: "clear",
      label: "Clear",
      heroId: "02",
      shots: 4,
      price: 12.99, // placeholder
      variantId: "gid://shopify/ProductVariant/58714000163190", // CLEAR-BOX-4
      sellingPlanId: null, // Skio trial plan, not yet created
      galleryLead: "/formulas/mmPdpAssetsV2/ClearTrialBox.jpg",
    },
  ],
  // Condensed from Phil B.'s review in app/lander/sections/Reviews/reviews.data.ts.
  review: {
    quote:
      "I was getting through the day on five coffees and still hitting a wall by 4pm... Swapped my afternoon coffees for Flow and the difference was immediate.",
    name: "Phil B.",
    avatar: "/lander/reviews/PhilB.jpg",
  },
};
