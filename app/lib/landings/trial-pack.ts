import type { OfferConfig } from "./offer-types";
import { buildTrialPackFaqs } from "./trial-pack-faq";

/**
 * CONKA trial pack (SCRUM-1343; Both only since SCRUM-1467).
 * How it works: docs/features/GO_LANDING_PAGES.md (offer format).
 *
 * One product, Both, in two pack sizes: 1 box (BOTH-BOX-4, 2 Flow + 2 Clear)
 * or 2 boxes (BOTH-BOX-8, one line of 2 x BOTH-BOX-4, so one Skio contract).
 * Synergy packs every 4-shot trial box as 2 Flow + 2 Clear, which is why the
 * Flow-only and Clear-only trials were retired. Either size moves onto the Both
 * monthly starter plan (BOTH-STARTER-40) `conversionDays` after the order. A
 * week, not the pack's length: delivery can take most of the first days, and
 * nobody should be billed for monthly before they have tried the pack. Monthly,
 * one-time and reference figures come from offerData; only the trial fields
 * live here.
 *
 * Options render as a row of tiles in this order, with `defaultOption`
 * preselected.
 *
 * `price` is display only; the charge is the variant's one-time price less the
 * Skio trial plan's percentage (29.98 - 56.67% = 12.99, 59.96 - 68.33% = 18.99,
 * checked against a Storefront cart 29 Sep 2026). Change a price here and that
 * plan's percentage in Skio together, or the page and checkout disagree. Trial
 * checkout refuses to run for an option whose `sellingPlanId` is null.
 */
export const trialPack: OfferConfig = {
  format: "offer",
  // /go/trial-pack (the Meta campaign URL) redirects to the /go/pl-v1
  // listicle, whose CTAs land here (next.config.ts).
  slug: "trial-pack-v2",
  title: "CONKA Trial Pack",
  conversionDays: 7,
  defaultOption: "both_8shot",
  options: [
    {
      id: "both_4shot",
      label: "1 box",
      summary: "4 shots, 2 Flow and 2 Clear, to try both.",
      heroId: "03",
      shots: 4,
      price: 12.99,
      referencePrice: 29.98,
      variantId: "gid://shopify/ProductVariant/58818005926262", // BOTH-BOX-4
      // Skio 4-shot "Weekly Subscription", 56.67% off, shared with the retired
      // FLOW-BOX-4 / CLEAR-BOX-4 trials; its Journey keys on the product.
      sellingPlanId: "gid://shopify/SellingPlan/712985543030",
      tileImage: "/formulas/mmPdpAssetsV2/TrialTileOneBox.jpg",
      // Rendered from design/pdp-slides bt1 (57% seal) and tp2 (4 shots, Both
      // monthly figures, £74.99/month).
      galleryLead: "/formulas/mmPdpAssetsV2/BothTrialOneBoxV1.jpg",
      explainerSlide: "/formulas/mmPdpAssetsV2/TrialPackHowItWorksOneBoxV1.jpg",
    },
    {
      id: "both_8shot",
      label: "2 boxes",
      summary: "8 shots, 4 days of Flow each morning and Clear each afternoon.",
      heroId: "03",
      shots: 8,
      price: 18.99,
      referencePrice: 59.96,
      variantId: "gid://shopify/ProductVariant/58717657989494", // BOTH-BOX-8
      // Skio 8-shot "Weekly Subscription" (its own group), 68.33% off.
      sellingPlanId: "gid://shopify/SellingPlan/712986788214",
      tileImage: "/formulas/mmPdpAssetsV2/TrialTileTwoBoxes.jpg",
      // Rendered from design/pdp-slides bt0 (68% seal) and tp1 (8 shots, Both
      // monthly figures, £74.99/month).
      galleryLead: "/formulas/mmPdpAssetsV2/BothTrialTwoBoxV5.jpg",
      explainerSlide: "/formulas/mmPdpAssetsV2/TrialPackHowItWorksV4.jpg",
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
