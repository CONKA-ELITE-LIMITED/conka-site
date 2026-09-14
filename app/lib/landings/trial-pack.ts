import type { OfferConfig } from "./offer-types";

/**
 * CONKA trial pack (SCRUM-1343).
 * Plan and decisions: docs/development/featurePlans/trial-box/README.md.
 *
 * Flow, Clear or Both at a trial price, then Skio moves the contract onto that
 * product's monthly starter plan (FLOW-STARTER-20 / CLEAR-STARTER-20 /
 * BOTH-STARTER-40) `conversionDays` after the order. A week, not the pack's
 * length: delivery can take most of the first days, and nobody should be billed
 * for monthly before they have tried the pack. Monthly, one-time and reference
 * figures come from offerData; only the trial fields live here.
 *
 * Options render as a row of tiles in this order (Both last, as the
 * combination), with `defaultOption` preselected.
 *
 * Before launch: trial prices are placeholders, and every `sellingPlanId` must
 * be the Skio trial plan (trial checkout refuses to run while it is null).
 */
export const trialPack: OfferConfig = {
  format: "offer",
  slug: "trial-pack",
  title: "Try CONKA for a fraction of the price",
  conversionDays: 7,
  defaultOption: "both",
  options: [
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
    {
      id: "both",
      label: "Flow + Clear",
      heroId: "03",
      shots: 8,
      price: 18.99, // placeholder
      variantId: "gid://shopify/ProductVariant/58717657989494", // BOTH-BOX-8
      sellingPlanId: null, // Skio trial plan, not yet created
      galleryLead: "/formulas/mmPdpAssetsV2/BothTrialBox.jpg",
      badge: "Best value",
    },
  ],
  // Condensed from real reviews: Phil B. in app/lander/sections/Reviews/reviews.data.ts;
  // Ankita K. and Aaron H. in app/lib/customerTestimonials.ts ("academic"
  // dropped before "tasks" in Ankita's).
  reviews: [
    {
      quote:
        "I was getting through the day on five coffees and still hitting a wall by 4pm... Swapped my afternoon coffees for Flow and the difference was immediate.",
      name: "Phil B.",
      avatar: "/lander/reviews/PhilB.jpg",
    },
    {
      quote:
        "I think it's pretty easy to be sceptical of a product that says it can boost your brain in a shot... I do find myself gravitating to Clear more; I am noticing measurable improvements in my tasks.",
      name: "Ankita K.",
      avatar: "/lander/reviews/AnkitaK.jpg",
    },
    {
      quote:
        "I used to rely on coffee to get through it, but that third cup always came with a trade-off... Swapping that for Conka in the afternoon has made a real difference.",
      name: "Aaron H.",
      avatar: "/lander/reviews/AaronH.jpg",
    },
  ],
};
