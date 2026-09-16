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

// ===== THE CHALLENGE (SCRUM-1352) =====
// Mirrors row 1 of the home "why" accordion (homeWhyContent.ts).

export type ChallengeIcon = "notification" | "bolt" | "question";

export const SCIENCE_CHALLENGE = {
  heading: "Modern life is quietly dismantling your attention",
  body: "The usual fixes make it worse. Here is what gets in the way of a sharp mind, and why caffeine is not the answer.",
  cards: [
    {
      icon: "notification",
      title: "Fragmented attention",
      body: "Notifications, endless screens and back-to-back demands split your focus dozens of times a day.",
    },
    {
      icon: "bolt",
      title: "The caffeine crash",
      body: "Caffeine buys an hour and charges interest: jitters, an afternoon slump and a worse night's sleep.",
    },
    {
      icon: "question",
      title: "Claims with nothing under them",
      body: "Most brain products make big promises with no study behind them and no way for you to check.",
    },
  ] satisfies { icon: ChallengeIcon; title: string; body: string }[],
} as const;

// ===== WHAT ARE NOOTROPICS AND ADAPTOGENS (SCRUM-1352) =====
// Mirrors row 2 of the home "why" accordion. Each definition is the first
// sentence of its card so it can be quoted in isolation (AEO).

export type CategoryIcon = "brain" | "leaf";

export interface CategoryExplainer {
  id: "nootropics" | "adaptogens";
  icon: CategoryIcon;
  name: string;
  timing: string;
  definition: string;
  analogy: string;
  /** Three actives shown as render tiles across the top of the card. */
  examples: { name: string; image: string }[];
}

export const CATEGORY_EXPLAINERS: CategoryExplainer[] = [
  {
    id: "nootropics",
    icon: "brain",
    name: "Nootropics",
    timing: "Work on the day",
    definition: "Nootropics are compounds that support how well your brain performs: how sharply you focus, how fast you process and how reliably you remember.",
    analogy: "Think of them as better fuel for the thinking itself.",
    examples: [
      { name: "Alpha GPC", image: "/ingredients/renders/AlphaGPC.jpg" },
      { name: "Ginkgo biloba", image: "/ingredients/renders/GinkgoBiloba.jpg" },
      { name: "Lecithin", image: "/ingredients/renders/Lecithin.jpg" },
    ],
  },
  {
    id: "adaptogens",
    icon: "leaf",
    name: "Adaptogens",
    timing: "Build over weeks",
    definition: "Adaptogens are natural plant extracts that help your body adapt to stress, easing an overworked stress response back toward balance instead of forcing it the way a stimulant does.",
    analogy: "Think of them as a thermostat for stress: they hold the room at a workable temperature.",
    examples: [
      { name: "Ashwagandha", image: "/ingredients/renders/Ashwagandha.jpg" },
      { name: "Rhodiola rosea", image: "/ingredients/renders/RhodiolaRosea.jpg" },
      { name: "Lemon balm", image: "/ingredients/renders/LemonBalm.jpg" },
    ],
  },
];

export const CATEGORY_INTRO = {
  linkLabel: "Explore every ingredient and its research",
  heading: "What are nootropics and adaptogens?",
  body: "Both are natural compounds studied for how they support the brain. They do different jobs, which is why CONKA uses both, alongside antioxidants, amino acids and vitamins that protect brain cells and help the actives absorb.",
  natureHeading: "Why nature makes them",
  nature: "Plants make these compounds to survive stress of their own: cold, drought, UV light and predators. Rhodiola grows in cold, high mountain regions, and ginkgo is one of the oldest tree species on Earth. Those same defence compounds are what researchers study in people.",
} as const;

// ===== HOW CONKA WORKS (SCRUM-1352) =====
// Mirrors row 3 of the home "why" accordion. Flow and Clear always at equal
// weight. Actives are named, never dosed.

export interface ShotExplainer {
  productId: "01" | "02";
  time: "morning" | "afternoon";
  timeLabel: string;
  job: string;
  href: string;
  linkLabel: string;
  actives: { name: string; role: string; image: string }[];
}

export const SCIENCE_HOW_IT_WORKS = {
  heading: "Two shots, built around how your day actually runs",
  body: "Flow and Clear work as one system rather than one dose repeated. Each is built for a different part of the day, with zero caffeine in either.",
  shots: [
    {
      productId: "01",
      time: "morning",
      timeLabel: "Morning",
      job: "Focus and calm energy for the first half of the day.",
      href: "/conka-flow",
      linkLabel: "See CONKA Flow",
      actives: [
        { name: "Ashwagandha", role: "Steadies the stress response", image: "/ingredients/renders/Ashwagandha.jpg" },
        { name: "Rhodiola rosea", role: "Pushes back on mental fatigue", image: "/ingredients/renders/RhodiolaRosea.jpg" },
        { name: "Lemon balm", role: "Calm without sedation", image: "/ingredients/renders/LemonBalm.jpg" },
        { name: "Turmeric", role: "Protects brain cells", image: "/ingredients/renders/Turmeric.jpg" },
      ],
    },
    {
      productId: "02",
      time: "afternoon",
      timeLabel: "Afternoon",
      job: "Clarity for the back half of the day, and a proper wind-down.",
      href: "/conka-clarity",
      linkLabel: "See CONKA Clear",
      actives: [
        { name: "Alpha GPC", role: "Supports focus and recall", image: "/ingredients/renders/AlphaGPC.jpg" },
        { name: "Ginkgo biloba", role: "Supports blood flow to the brain", image: "/ingredients/renders/GinkgoBiloba.jpg" },
        { name: "Acetyl-L-carnitine", role: "Fuels tired neurons", image: "/ingredients/renders/AcetylLCarnitine.jpg" },
        { name: "Vitamin C", role: "Protects against oxidative stress", image: "/ingredients/renders/VitaminC.jpg" },
      ],
    },
  ] satisfies ShotExplainer[],
} as const;

// ===== THE PEOPLE BEHIND THE RESEARCH (SCRUM-1353) =====
// Scientists only: founders belong on /our-story and are never listed here.
// Framed by role in the research, not as a "scientific board" or ambassadors.
// Names, photos and titles from the CONKA deck team slide; roles in our
// research from the team. Institutions checked against university staff
// profiles (Sept 2026): Vine, O'Malley and Halmai at Exeter, Glassbrook a
// former Durham postdoc. Katekhaye has no institution on record. Photos are 200px square crops, so render them no
// larger than ~100 CSS px.

export interface SciencePerson {
  name: string;
  role: string;
  institution?: string;
  photo: string;
}

export const SCIENCE_PEOPLE_INTRO = {
  heading: "The scientists behind CONKA",
  body: "CONKA is formulated and tested with scientists who study the brain, nutrition and human performance for a living.",
} as const;

export const SCIENCE_PEOPLE: SciencePerson[] = [
  { name: "Prof Karen Hind", role: "Chief Research Officer", institution: "Durham University", photo: "/science/people/karen-hind.webp" },
  { name: "Prof Paul Chazot", role: "Head of Nutritional Research", institution: "Durham University", photo: "/science/people/paul-chazot.webp" },
  { name: "Prof Sam Vine", role: "Head of High Performance, leads our Exeter human trial", institution: "University of Exeter", photo: "/science/people/sam-vine.webp" },
  { name: "Dr Callum O'Malley", role: "Runs our Exeter human trial", institution: "University of Exeter", photo: "/science/people/callum-omally.webp" },
  { name: "Dr Shankar Katekhaye", role: "Formulation scientist, developer of our alcohol-free extraction", photo: "/science/people/shankar-katekhaye.webp" },
  { name: "Dr Daniel Glassbrook", role: "Early formulation and safety research", institution: "Durham University", photo: "/science/people/daniel-glassbrook.webp" },
  { name: "Dr Barbara Halmai", role: "Research assistant", institution: "University of Exeter", photo: "/science/people/barbara-halmai.webp" },
];

// ===== MEASURE IT YOURSELF (SCRUM-1352) =====
// Row 5 of the home "why" accordion, framed forward (the research keeps
// going) rather than "don't trust us", which would undercut the trials above
// it. Test counts come from
// APP_INSIGHTS_TOTALS at render so they never drift from /app-insights.

export const SCIENCE_MEASURE = {
  heading: "We don't stop at the trials",
  body: "The CONKA app puts a two-minute FDA-cleared cognitive test in your pocket, derived from Cambridge research and used in NHS memory clinics. Every test adds to our real-world research on how sleep, stress, caffeine and CONKA affect the brain, and shows you your own score week by week.",
  points: [
    "Free, and takes two minutes",
    "Reads processing speed from natural images, so it cannot be gamed",
    "Tracks your score week over week, on CONKA and off it",
  ],
} as const;

export const SCIENCE_CTA = {
  heading: "The evidence is in. Now test it on yourself.",
  body: "Take Flow in the morning and Clear in the afternoon, then track your own scores in the CONKA app.",
} as const;
