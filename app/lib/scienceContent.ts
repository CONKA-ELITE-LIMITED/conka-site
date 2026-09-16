/* ============================================================================
 * scienceContent (SCRUM-1351)
 *
 * Copy and figures for the /science page, kept as data so the page can be
 * re-worded without touching components, and so the proof modules can later be
 * reused on the PDPs and listicles (see
 * docs/development/featurePlans/science-page-narrative.md, Future phase).
 *
 * Every trial figure here traces to docs/conkaAppData/HIGH_LEVEL_STATS.md and
 * is stated exactly as the source reports it. Do not round, combine or add a
 * figure that is not in that doc. "£500k+" and "25+ clinical trials" are
 * reused word for word from the home "why" accordion (homeWhyContent.ts).
 *
 * Standing rules (carried from the SCRUM-1067 rebuild):
 *  - Exeter results are unpublished: design only, never results.
 *  - The Durham formulation work is a model-organism preprint. It is never
 *    presented as human evidence.
 *  - No formula-share percentages anywhere on the page.
 * ========================================================================== */

export interface ScienceStat {
  value: string;
  label: string;
}

export const SCIENCE_HERO = {
  /** H1, split so the accent phrase renders in the outlined pill. */
  headingLead: "The science behind a",
  headingAccent: "sharper mind",
  /**
   * Answer-first (BLUF) passage, SCRUM-1149. Self-contained so an answer
   * engine can quote it in isolation: no pronoun that leans on another line.
   */
  lede: "In a randomised, double-blind, placebo-controlled trial, professional athletes taking CONKA improved their cognitive performance by 14.86% in six weeks, while the placebo group declined.",
  body: "CONKA is two daily shots of clinically dosed nootropics and adaptogens, with zero caffeine. This page shows how they work and the trials behind them.",
  stats: [
    { value: "+14.86%", label: "Cognitive performance vs placebo" },
    { value: "80%", label: "Of fully tracked athletes improved" },
    { value: "25+", label: "Clinical trials" },
    { value: "£500k+", label: "Invested in research" },
  ] satisfies ScienceStat[],
} as const;

export type TrialIcon = "randomised" | "blind" | "placebo" | "people" | "duration";

export interface TrialTag {
  label: string;
  icon: TrialIcon;
}

export interface TrialCard {
  id: string;
  name: string;
  context: string;
  tags: TrialTag[];
  headline: ScienceStat;
  /** Rendered inline after the value ("+7.9% cognition..."), so labels start lower case. */
  supporting: ScienceStat[];
  /** One honest line on what the design can and cannot show. */
  note: string;
}

export const FEATURED_TRIAL = {
  name: "Harlequins F.C.",
  context: "Professional rugby players",
  tags: [
    { label: "Randomised", icon: "randomised" },
    { label: "Double-blind", icon: "blind" },
    { label: "Placebo-controlled", icon: "placebo" },
    { label: "29 players", icon: "people" },
    { label: "6 weeks", icon: "duration" },
  ] satisfies TrialTag[],
  conka: { value: 14.86, label: "CONKA" },
  placebo: { value: -0.69, label: "Placebo" },
  supporting: [
    { value: "80%", label: "Of fully tracked athletes improved" },
    { value: "+10.0%", label: "Memory" },
    { value: "+7.6%", label: "Focus" },
  ] satisfies ScienceStat[],
  callout:
    "The CONKA group also took 60% more physical contact during the trial, and still came out sharper.",
  method: [
    "Players were randomly split into a CONKA group and a placebo group.",
    "Double-blind means neither the players nor the researchers knew who was taking CONKA and who was taking the placebo until the trial ended.",
    "The improvement on the core processing-accuracy measure was statistically significant (p = 0.0018), meaning it is very unlikely to be down to chance.",
  ],
} as const;

export const SUPPORTING_TRIALS: TrialCard[] = [
  {
    id: "bristol-bears",
    name: "Bristol Bears",
    context: "Professional rugby players",
    tags: [
      { label: "15 players", icon: "people" },
      { label: "13 weeks", icon: "duration" },
    ],
    headline: { value: "+19.3%", label: "Focus" },
    supporting: [
      { value: "+7.9%", label: "cognition across all tests" },
      { value: "+3.9%", label: "processing speed" },
    ],
    note: "No placebo group: each player was measured against their own starting scores. Statistically significant across the tests (p < 0.05).",
  },
  {
    id: "revolut",
    name: "Revolut",
    context: "Workplace trial",
    tags: [
      { label: "9 employees", icon: "people" },
      { label: "18 days", icon: "duration" },
    ],
    headline: { value: "75%", label: "Improved their cognitive scores" },
    supporting: [{ value: "20 to 25%", label: "faster reaction times by the end" }],
    note: "A small real-world trial with no placebo group. It is an early signal that the effect carries from elite sport into an ordinary working day.",
  },
];

export const IN_PROGRESS_TRIAL = {
  name: "University of Exeter",
  context: "Athletes and defence personnel",
  tags: [
    { label: "Randomised crossover", icon: "randomised" },
    { label: "Double-blind", icon: "blind" },
    { label: "Placebo-controlled", icon: "placebo" },
    { label: "60+ participants", icon: "people" },
    { label: "8 weeks", icon: "duration" },
  ] satisfies TrialTag[],
  body: "Measuring attention, processing speed and short-term memory three times a week through the CONKA app. The trial is in write-up, and we will share the results once they are peer-reviewed and published.",
} as const;

export interface ResearchPartner {
  name: string;
  logo: string;
  role: string;
}

export const RESEARCH_PARTNERS: ResearchPartner[] = [
  {
    name: "Durham University",
    logo: "/logos/UniversityOfDurham.png",
    role: "Early formulation research (preprint, laboratory model)",
  },
  {
    name: "University of Cambridge",
    logo: "/logos/UniversityOfCambridge.png",
    role: "The cognitive test behind the CONKA app",
  },
  {
    name: "University of Exeter",
    logo: "/logos/UniversityOfExeter.png",
    role: "Human trial, in write-up",
  },
];

export interface IngredientReference {
  ingredient: string;
  finding: string;
  /** PubMed id, rendered as a link. */
  pmid: string;
}

/** Peer-reviewed research on six of the actives. PMIDs moved here from RealisedSolution. */
export const INGREDIENT_REFERENCES: IngredientReference[] = [
  { ingredient: "Ashwagandha", finding: "Lower cortisol and a steadier stress response", pmid: "23439798" },
  { ingredient: "Rhodiola rosea", finding: "Less mental fatigue under sustained load", pmid: "19016404" },
  { ingredient: "Lemon balm", finding: "Calm without sedation", pmid: "16444660" },
  { ingredient: "Alpha-GPC", finding: "Raised acetylcholine, behind focus and recall", pmid: "12882463" },
  { ingredient: "Ginkgo biloba", finding: "Supported blood flow to the brain", pmid: "19395013" },
  { ingredient: "N-acetyl cysteine", finding: "Rebuilt glutathione against oxidative stress", pmid: "18436195" },
];

export interface LiteratureReference {
  citation: string;
  topic: string;
}

/** Further literature, carried word for word from the retired EvidenceLadder. */
export const LITERATURE_REFERENCES: LiteratureReference[] = [
  { citation: "Kennedy et al., 2003", topic: "Lemon balm, mood and cognition" },
  { citation: "Mix & Crews, 2002", topic: "Ginkgo biloba, cognitive function" },
  { citation: "Whyte & Williams, 2015", topic: "Bilberry, cognitive performance" },
  { citation: "Bowtell et al., 2017", topic: "Cerebral blood flow" },
  { citation: "Dodd et al., 2015", topic: "Cerebral blood flow" },
  { citation: "Kennedy, 2019", topic: "Phytochemicals for cognition and sport" },
];

export const SCIENCE_CTA = {
  heading: "The evidence is in. Now test it on yourself.",
  body: "Take Flow in the morning and Clear in the afternoon, then track your own scores in the CONKA app.",
} as const;
