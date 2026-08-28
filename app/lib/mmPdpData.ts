/**
 * Per-formula configuration for the Magic Mind-style PDP heroes
 * (ProductHeroV3 / ProductHeroMobileV3) and their ingredient-benefit section.
 * Flow ("01"), Clear ("02"), and Both ("03").
 */

import type { ProductHeroId } from "./productTypes";
import { getSupplementFacts } from "./supplementFacts";
import { pickFaqItems } from "./faqContent";

const ASSET_BASE = "/formulas/mmPdpAssets";

/** Rectangular (7:5) gallery assets in presentation order. The research /
 *  third-party / comparison / athlete / risk-free slides are shared. */
export const MM_GALLERY_ASSETS: Record<ProductHeroId, string[]> = {
  "01": [
    // Starter pack bundle shot leads: the whole offer (box, shots, hat, travel
    // pack, app) is visible before any copy is read. SCRUM-1282.
    `${ASSET_BASE}/FlowStarterPack.jpg`,
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
      ingredientIds: ["lemon-balm", "alpha-gpc", "ginkgo"],
    },
    {
      id: "sustained-energy",
      title: "Sustained energy",
      subhead: "Steady energy across the full cognitive day.",
      ingredientIds: ["rhodiola", "alcar", "vitamin-b12"],
    },
    {
      id: "brain-health",
      title: "Brain health",
      subhead: "Neuroprotection and antioxidant defense, morning to evening.",
      ingredientIds: ["turmeric", "glutathione", "bilberry"],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Ingredient tile badges (SCRUM-1262, Phase 3a)
 *
 * Two lines. The first is the layman outcome, the second the mechanism.
 *
 * Line 1 is DERIVED from OUTCOME_BUCKETS rather than authored again, so the
 * grid's badge and the bucket a card belongs to can never disagree. It repeats
 * across tiles on purpose: it is what makes the grid cluster visually by what
 * each ingredient does, now that the three bucket headings are gone.
 *
 * `ingredientsData.functionalCategory` is deliberately NOT the source. It has
 * five values across the whole dataset, so four of the nine Clear tiles would
 * read "Neuroprotection", and it is too technical to lead with.
 *
 * Line 2 is unproven copy and expected to iterate. It lives here so a rewrite,
 * or dropping the second line entirely, is a data change and never a component
 * change.
 * ------------------------------------------------------------------------- */

/** Ingredients that serve no single outcome bucket get their line 1 here. */
const BADGE_OUTCOME_FALLBACK: Record<string, string> = {
  // The absorption enhancer: it multiplies the others rather than driving an
  // outcome of its own, so it sits in no bucket.
  "black-pepper": "Absorption",
};

/** Ingredient id -> the mechanism line, shown under the outcome. */
export const INGREDIENT_BADGE_MECHANISM: Record<string, string> = {
  // Flow
  "lemon-balm": "Calm",
  turmeric: "Memory",
  ashwagandha: "Stress reduction",
  rhodiola: "Anti-fatigue",
  bilberry: "Vision support",
  "black-pepper": "Absorption",
  // Clear
  glutathione: "Master antioxidant",
  "alpha-gpc": "Acetylcholine",
  nac: "Detox support",
  ginkgo: "Circulation",
  alcar: "Mental energy",
  "vitamin-c": "Antioxidant",
  ala: "Antioxidant recycling",
  "vitamin-b12": "Brain ageing",
  lecithin: "Neuronal membranes",
};

export interface IngredientBadge {
  /** Layman outcome, from OUTCOME_BUCKETS. */
  outcome: string;
  /** Mechanism, more technical, shown as the second line. */
  mechanism?: string;
}

/**
 * The badge for one ingredient on one product page.
 *
 * Falls back gracefully: an ingredient in no bucket uses the fallback map, and
 * one in neither returns no outcome rather than throwing, so adding an
 * ingredient to ingredientsData cannot break the grid.
 */
export function getIngredientBadge(
  formulaId: ProductHeroId,
  ingredientId: string,
): IngredientBadge {
  const bucket = OUTCOME_BUCKETS[formulaId].find((b) =>
    b.ingredientIds.includes(ingredientId),
  );

  return {
    outcome: bucket?.title ?? BADGE_OUTCOME_FALLBACK[ingredientId] ?? "",
    mechanism: INGREDIENT_BADGE_MECHANISM[ingredientId],
  };
}

/* ---------------------------------------------------------------------------
 * PDP disclosure rows: taste and how-to-take (SCRUM-1262)
 *
 * Only the SINGLE-formula variants are written here. Both ("03") reuses the
 * canonical FAQ answers verbatim, so the two-product version of each answer
 * exists exactly once in the codebase.
 *
 * Why these are not simply the FAQ entries: `/faq` renders all of FAQ_ITEMS and
 * builds its FAQPage schema from the same array, so adding `taste-flow` and
 * `taste-clear` ids would put three near-identical taste questions on the hub
 * and three near-duplicate Q&As into the structured data. The FAQ therefore has
 * to stay product-agnostic, and a product page cannot use a product-agnostic
 * answer: on /conka-flow, a Taste row that talks about Clear is answering a
 * question the visitor did not ask.
 *
 * So the split is deliberate, and the duplication it costs is one short string
 * per single-formula row. When the canonical answer changes, check whether the
 * Flow and Clear variants below need the same change.
 * ------------------------------------------------------------------------- */
const faqAnswer = (id: string) => pickFaqItems(id)[0].answer;

export const PDP_DISCLOSURE_COPY: Record<
  ProductHeroId,
  { taste: string; howToTake: string }
> = {
  "01": {
    taste:
      "Earthy and slightly sweet, led by turmeric. It pours as a yellowish-brown liquid.",
    howToTake:
      "One 30ml shot, straight from the bottle, with or without food. We recommend the morning, for calm focus and jitter-free energy through the day. There is no caffeine in it, so it works whenever you need it.",
  },
  "02": {
    taste:
      "Bright and citrus, made with real lemon juice and lemon essential oil.",
    howToTake:
      "One 30ml shot, straight from the bottle, with or without food. We recommend the afternoon, for clear thinking through the second half of the day. There is no caffeine in it, so it works whenever you need it.",
  },
  "03": {
    taste: faqAnswer("taste"),
    howToTake: faqAnswer("how-to-take"),
  },
};

/** Optional subline override where the SEO heading needs trimming for display
 *  (Both drops its ", Morning to Evening" tail). Falls back to seoHeading. */
export const LEDE_SUBLINE: Partial<Record<ProductHeroId, string>> = {
  "03": "The Complete Daily Brain Shot System",
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
