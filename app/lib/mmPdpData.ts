/**
 * Per-formula configuration for the Magic Mind-style PDP heroes
 * (ProductHeroV3 / ProductHeroMobileV3) and their ingredient-benefit section.
 * Flow ("01"), Clear ("02"), and Both ("03").
 */

import type { ProductHeroId } from "./productTypes";
import { getSupplementFacts } from "./supplementFacts";

const ASSET_BASE = "/formulas/mmPdpAssets";

/** Rectangular (7:5) gallery assets in presentation order. The research /
 *  third-party / comparison / athlete / risk-free slides are shared. */
export const MM_GALLERY_ASSETS: Record<ProductHeroId, string[]> = {
  "01": [
    `${ASSET_BASE}/FlowMmHero.jpg`,
    `${ASSET_BASE}/FlowSharperMind.jpg`,
    `${ASSET_BASE}/FlowMmIngredients.jpg`,
    `${ASSET_BASE}/SevenYearsResearch.jpg`,
    `${ASSET_BASE}/Clear3rdPartyTesting.jpg`,
    `${ASSET_BASE}/ConkaVsOther.jpg`,
    `${ASSET_BASE}/JackWillisReview.jpg`,
    `${ASSET_BASE}/RiskFreeTrial.jpg`,
  ],
  "02": [
    `${ASSET_BASE}/ClearMmHero.jpg`,
    `${ASSET_BASE}/ClearSharperMind.jpg`,
    `${ASSET_BASE}/ClearMmIngredients.jpg`,
    `${ASSET_BASE}/SevenYearsResearch.jpg`,
    `${ASSET_BASE}/Clear3rdPartyTesting.jpg`,
    `${ASSET_BASE}/ConkaVsOther.jpg`,
    `${ASSET_BASE}/JackWillisReview.jpg`,
    `${ASSET_BASE}/ClearRiskFree.jpg`,
  ],
  "03": [
    `${ASSET_BASE}/BothMmHero.jpg`,
    `${ASSET_BASE}/BothSharperMind.jpg`,
    `${ASSET_BASE}/FlowMmIngredients.jpg`,
    `${ASSET_BASE}/ClearMmIngredients.jpg`,
    `${ASSET_BASE}/SevenYearsResearch.jpg`,
    `${ASSET_BASE}/Clear3rdPartyTesting.jpg`,
    `${ASSET_BASE}/ConkaVsOther.jpg`,
    `${ASSET_BASE}/JackWillisReview.jpg`,
    `${ASSET_BASE}/RiskFreeTrial.jpg`,
  ],
};

export interface OutcomeBucket {
  id: string;
  title: string;
  subhead: string;
  /** Ingredient ids (from ingredientsData) shown in this bucket, in order. */
  ingredientIds: string[];
}

/** Ingredients grouped under three Magic Mind-style outcome headings. Both shows
 *  a curated subset across Flow + Clear (the full list lives on /ingredients). */
export const OUTCOME_BUCKETS: Record<ProductHeroId, OutcomeBucket[]> = {
  "01": [
    {
      id: "mental-performance",
      title: "Mental performance",
      subhead: "Sharper focus, calm attention, and recall.",
      ingredientIds: ["lemon-balm", "ashwagandha"],
    },
    {
      id: "sustained-energy",
      title: "Sustained energy",
      subhead: "Steady mental energy and stress resilience, without the crash.",
      ingredientIds: ["rhodiola"],
    },
    {
      id: "brain-health",
      title: "Brain health",
      subhead: "Protects neurons and supports long-term cognition.",
      ingredientIds: ["turmeric", "bilberry"],
    },
  ],
  "02": [
    {
      id: "mental-performance",
      title: "Mental performance",
      subhead: "Sharper recall and clear thinking under pressure.",
      ingredientIds: ["alpha-gpc", "ginkgo", "lecithin"],
    },
    {
      id: "sustained-energy",
      title: "Sustained energy",
      subhead: "Cellular energy to carry the afternoon.",
      ingredientIds: ["alcar", "vitamin-b12"],
    },
    {
      id: "brain-health",
      title: "Brain health",
      subhead: "Antioxidant defense that clears the fog.",
      ingredientIds: ["glutathione", "nac", "vitamin-c", "ala"],
    },
  ],
  "03": [
    {
      id: "mental-performance",
      title: "Mental performance",
      subhead: "Calm morning focus and sharp afternoon recall.",
      ingredientIds: ["lemon-balm", "alpha-gpc"],
    },
    {
      id: "sustained-energy",
      title: "Sustained energy",
      subhead: "Steady energy across the full cognitive day.",
      ingredientIds: ["rhodiola", "alcar"],
    },
    {
      id: "brain-health",
      title: "Brain health",
      subhead: "Neuroprotection and antioxidant defense, morning to evening.",
      ingredientIds: ["turmeric", "glutathione"],
    },
  ],
};

/** Ingredient id -> partner ingredient folded into its card (not its own accordion). */
export const INGREDIENT_PARTNERS: Record<ProductHeroId, Record<string, string>> = {
  "01": { turmeric: "black-pepper" },
  "02": {},
  "03": {},
};

/** Condensed lede description (the images now carry the fuller story). */
export const LEDE_DESCRIPTION: Record<ProductHeroId, string> = {
  "01": "Powered by 6 clinically-dosed adaptogens in a fast-absorbing liquid shot, with zero caffeine and zero crash.",
  "02": "Powered by 10 clinically-dosed actives in a fast-absorbing liquid shot, including Alpha GPC and Ginkgo Biloba for cerebral blood flow.",
  "03": "Two clinically-dosed liquid shots covering the full cognitive day, without stimulants or a crash.",
};

/** Written-out ingredient list for the PDP. Both returns a labelled line per
 *  formula ("Flow:" / "Clear:"); Flow/Clear return a single unlabelled line. */
export function getPdpIngredientList(
  formulaId: ProductHeroId,
): { label?: string; text: string }[] {
  const listFor = (product: "flow" | "clear") => {
    const facts = getSupplementFacts(product);
    return [...facts.actives, ...facts.base].map((i) => i.name).join(", ");
  };
  if (formulaId === "03") {
    return [
      { label: "Flow:", text: listFor("flow") },
      { label: "Clear:", text: listFor("clear") },
    ];
  }
  return [{ text: listFor(formulaId === "02" ? "clear" : "flow") }];
}
