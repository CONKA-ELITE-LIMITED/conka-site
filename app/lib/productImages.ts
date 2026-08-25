/**
 * Product image carousel configurations.
 * Single source of truth for all product page slideshows.
 */

export interface ProductImage {
  src: string;
}

/**
 * Latest-generation bottle renders — the canonical product shot per offering.
 * When a new asset generation lands, add the file and update the paths here;
 * every surface (nav, landers, showcases, listicles, BYO) follows automatically.
 * Flow/Clear are portrait 1:2 (750×1500); Both is square (1000×1000).
 */
export const bottleRenders: Record<"flow" | "clear" | "both", ProductImage & { alt: string }> = {
  flow: { src: "/formulas/labelV2/FlowThin.jpg", alt: "CONKA Flow bottle" },
  clear: { src: "/formulas/labelV2/ClearThin.jpg", alt: "CONKA Clear bottle" },
  both: { src: "/formulas/labelV2/BothPair.jpg", alt: "CONKA Flow and Clear bottles" },
};

/** Quarterly box images — shown as first slide when quarterly cadence is selected in the funnel. */
export const quarterlyImages: Record<"flow" | "clear" | "both", ProductImage> = {
  flow: { src: "/formulas/conkaFlow/FlowQuarterly.jpg" },
  clear: { src: "/formulas/conkaClear/ClearQuarterly.jpg" },
  both: { src: "/formulas/both/BothQuarterly.jpg" },
};

/** Carousel image arrays for formula product pages (Flow, Clear) and the Both/Balance offering. */
export const formulaImages: Record<"flow" | "clear" | "both", ProductImage[]> = {
  flow: [
    { src: "/formulas/conkaFlow/FlowBox.jpg" },
    { src: "/formulas/conkaFlow/FlowIngredients.jpg" },
    { src: "/formulas/both/BothHow.jpg" },
    { src: "/formulas/both/BothDailyUse.jpg" },
    { src: "/formulas/both/AppProof.jpg" },
    { src: "/formulas/both/BothClinicallyProven.jpg" },
    { src: "/formulas/both/BothTestimonial.jpg" },
    { src: "/formulas/conkaFlow/FlowNutrition.jpg" },
  ],
  clear: [
    { src: "/formulas/conkaClear/ClearBox.jpg" },
    { src: "/formulas/conkaClear/ClearIngredients.jpg" },
    { src: "/formulas/both/BothHow.jpg" },
    { src: "/formulas/both/BothDailyUse.jpg" },
    { src: "/formulas/both/AppProof.jpg" },
    { src: "/formulas/both/BothClinicallyProven.jpg" },
    { src: "/formulas/both/BothTestimonial.jpg" },
    { src: "/formulas/conkaClear/ClearNutrition.jpg" },
  ],
  both: [
    { src: "/formulas/both/BothBox.jpg" },
    { src: "/formulas/both/BothHow.jpg" },
    { src: "/formulas/both/BothDailyUse.jpg" },
    { src: "/formulas/both/AppProof.jpg" },
    { src: "/formulas/conkaFlow/FlowIngredients.jpg" },
    { src: "/formulas/conkaClear/ClearIngredients.jpg" },
    { src: "/formulas/both/BothTestimonial.jpg" },
    { src: "/formulas/conkaFlow/FlowNutrition.jpg" },
    { src: "/formulas/conkaClear/ClearNutrition.jpg" },
  ],
};
