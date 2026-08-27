/**
 * Canonical per-product supplement-facts records.
 *
 * Source of truth: docs/product/FORMULATION_SPEC.md (2026-04-13).
 * Purpose: factual disclosure panel rendered in `IngredientsPanel` on the
 * landing page. Separate from `ingredientsData.ts` (research-dose storytelling)
 * and `formulaContent.ts` (legacy percentages — pending sync).
 *
 * Competitive IP protection: per-ingredient mg amounts are deliberately NOT
 * shipped to the client. Ingredient ORDER is preserved — standard supplement-
 * facts convention lists ingredients in descending order of concentration, so
 * relative quantity is still communicated without exposing the formula.
 * Only Vitamin C and Vitamin B12 carry %NRV values (needed to substantiate
 * the authorised EFSA claims).
 *
 * Claims compliance:
 * - Only Vitamin C and Vitamin B12 carry authorised EFSA claims.
 * - Anchor `††` on EFSA-backed nutrient references.
 * See docs/branding/CLAIMS_COMPLIANCE.md.
 */

export type SupplementFacts = {
  productId: "flow" | "clear";
  servingSize: string;
  ingredientsParagraph: string;
  nutrients: Array<{
    name: string;
    source: string;
    nrv: string;
  }>;
  actives: Array<{
    name: string;
    source: string;
  }>;
  base: Array<{ name: string; role: string }>;
};

const FLOW: SupplementFacts = {
  productId: "flow",
  servingSize: "1 shot (30ml)",
  ingredientsParagraph:
    "CONKA Flow is a 30ml herbal shot combining six adaptogens and botanicals in a vegetable-glycerin and water base. Caffeine-free, vegan, non-GMO, and free from all declarable allergens.",
  nutrients: [],
  actives: [
    { name: "Lemon Balm (Melissa officinalis, leaf)", source: "Herbal extract" },
    { name: "Ashwagandha (Withania somnifera, root)", source: "Herbal extract" },
    { name: "Turmeric (Curcuma longa, root)", source: "Herbal extract" },
    { name: "Rhodiola rosea (root)", source: "Herbal extract" },
    { name: "Bilberry (Vaccinium myrtillus, fruit)", source: "Fruit extract" },
    { name: "Black Pepper (Piper nigrum, fruit)", source: "Spice extract" },
  ],
  base: [
    { name: "Vegetable glycerin", role: "Liquid base" },
    { name: "Water", role: "Liquid base" },
    { name: "Polysorbate-80", role: "Solubiliser" },
    { name: "Potassium sorbate", role: "Preservative" },
    { name: "Lemon essential oil", role: "Natural flavouring" },
  ],
};

const CLEAR: SupplementFacts = {
  productId: "clear",
  servingSize: "1 shot (30ml)",
  ingredientsParagraph:
    "CONKA Clear is a 30ml daily shot combining Vitamin C and Vitamin B12 with a blend of amino acids, cholinergics, and botanicals in a water base. Caffeine-free, vegan, non-GMO, and free from all declarable allergens.",
  nutrients: [
    { name: "Vitamin C††", source: "Natural sources (fruit)", nrv: "3,125%" },
    { name: "Vitamin B12††", source: "Bacterial fermentation", nrv: "60,000%" },
  ],
  actives: [
    { name: "L-Alpha-GPC", source: "Sunflower lecithin" },
    { name: "Glutathione", source: "Amino acid tripeptide" },
    { name: "N-Acetyl Cysteine", source: "Amino acid derivative" },
    { name: "Acetyl-L-Carnitine", source: "Amino acid derivative" },
    { name: "Ginkgo biloba (leaf)", source: "Herbal extract" },
    { name: "Lecithin", source: "Sunflower" },
    { name: "Alpha Lipoic Acid", source: "Fatty acid" },
  ],
  base: [
    { name: "Water", role: "Liquid base" },
    { name: "Lemon juice powder", role: "Natural flavouring" },
    { name: "Lemon essential oil", role: "Natural flavouring" },
    { name: "Potassium sorbate", role: "Preservative" },
    { name: "Sodium benzoate", role: "Preservative" },
  ],
};

export const SUPPLEMENT_FACTS: Record<"flow" | "clear", SupplementFacts> = {
  flow: FLOW,
  clear: CLEAR,
};

export function getSupplementFacts(product: "flow" | "clear"): SupplementFacts {
  return SUPPLEMENT_FACTS[product];
}
