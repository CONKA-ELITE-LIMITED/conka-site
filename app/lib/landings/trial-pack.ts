import type { OfferConfig } from "./offer-types";
import { buildTrialPackFaqs } from "./trial-pack-faq";

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
 * `price` is display only; the charge is the variant's one-time price less the
 * Skio trial plan's percentage (29.98 - 56.67% = 12.99, 59.96 - 68.33% = 18.99,
 * checked against Shopify 15 Sep 2026). Change a price here and that plan's
 * percentage in Skio together, or the page and checkout disagree. Trial checkout
 * refuses to run for an option whose `sellingPlanId` is null.
 */
export const trialPack: OfferConfig = {
  format: "offer",
  slug: "trial-pack",
  title: "CONKA Trial Pack",
  conversionDays: 7,
  defaultOption: "both",
  options: [
    {
      id: "flow",
      label: "Flow",
      heroId: "01",
      shots: 4,
      price: 12.99,
      variantId: "gid://shopify/ProductVariant/58714075136374", // FLOW-BOX-4
      // Skio "Weekly Subscription", 56.67% off, shared with Clear.
      sellingPlanId: "gid://shopify/SellingPlan/712985543030",
      galleryLead: "/formulas/mmPdpAssetsV2/FlowTrialBoxV3.jpg",
      // Rendered from design/pdp-slides ftp1 (Flow monthly figures, £39.99/month).
      explainerSlide: "/formulas/mmPdpAssetsV2/FlowTrialHowItWorksV2.jpg",
    },
    {
      id: "clear",
      label: "Clear",
      heroId: "02",
      shots: 4,
      price: 12.99,
      variantId: "gid://shopify/ProductVariant/58714000163190", // CLEAR-BOX-4
      // Skio "Weekly Subscription", 56.67% off, shared with Flow.
      sellingPlanId: "gid://shopify/SellingPlan/712985543030",
      galleryLead: "/formulas/mmPdpAssetsV2/ClearTrialBoxV3.jpg",
      // Rendered from design/pdp-slides ctp1 (Clear monthly figures, £39.99/month).
      explainerSlide: "/formulas/mmPdpAssetsV2/ClearTrialHowItWorksV2.jpg",
    },
    {
      id: "both",
      label: "Flow + Clear",
      heroId: "03",
      shots: 8,
      price: 18.99,
      variantId: "gid://shopify/ProductVariant/58717657989494", // BOTH-BOX-8
      // Skio 8-shot "Weekly Subscription" (its own group), 68.33% off.
      sellingPlanId: "gid://shopify/SellingPlan/712986788214",
      galleryLead: "/formulas/mmPdpAssetsV2/BothTrialBoxV4.jpg",
      // Rendered from design/pdp-slides tp1 (Both monthly figures, £74.99/month).
      explainerSlide: "/formulas/mmPdpAssetsV2/TrialPackHowItWorksV3.jpg",
      badge: "Best value",
    },
  ],
  offerFaqs: { title: "How the trial works", build: buildTrialPackFaqs },
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
        "I do find myself gravitating to Clear more; I am noticing measurable improvements in my tasks.",
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
