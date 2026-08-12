/**
 * Per-formula configuration for the Magic Mind-style PDP heroes
 * (ProductHeroV3 / ProductHeroMobileV3) and their ingredient-benefit section.
 * Flow ("01") and Clear ("02") only; Both ("03") keeps the legacy V2 hero.
 */

import type { FormulaId } from "./productData";

const ASSET_BASE = "/formulas/mmPdpAssets";

/** Rectangular (7:5) gallery assets in presentation order. Assets 4-7 are shared
 *  across formulas (research, third-party testing, comparison, athlete review). */
export const MM_GALLERY_ASSETS: Record<FormulaId, string[]> = {
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
};

export interface OutcomeBucket {
  id: string;
  title: string;
  subhead: string;
  /** Ingredient ids (from ingredientsData) shown in this bucket, in order. */
  ingredientIds: string[];
}

/** Ingredients grouped under three Magic Mind-style outcome headings. */
export const OUTCOME_BUCKETS: Record<FormulaId, OutcomeBucket[]> = {
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
};

/** Ingredient id -> partner ingredient folded into its card (not its own accordion). */
export const INGREDIENT_PARTNERS: Record<FormulaId, Record<string, string>> = {
  "01": { turmeric: "black-pepper" },
  "02": {},
};

/** Condensed lede description (the images now carry the fuller story). */
export const LEDE_DESCRIPTION: Record<FormulaId, string> = {
  "01": "Powered by 6 clinically-dosed adaptogens in a fast-absorbing liquid shot, with zero caffeine and zero crash.",
  "02": "Powered by 10 clinically-dosed actives in a fast-absorbing liquid shot, including Alpha GPC and Ginkgo Biloba for cerebral blood flow.",
};
