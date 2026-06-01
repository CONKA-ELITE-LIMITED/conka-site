// Why CONKA — seven proof cards.
//
// Each reason is consumable in ~3 seconds collapsed (number, outcome-led
// headline, one line, asset) with a story-led expanded panel for depth.
// No named clubs, athletes, or companies: we do not have standing
// permission to name partner organisations publicly.

export interface WhyConkaStat {
  value: string;
  caption: string;
}

export interface WhyConkaReason {
  id: number;
  /** Outcome-led headline, e.g. "Improves...", "Built...", "Measured...". */
  headline: string;
  /** One sentence visible in the collapsed card. */
  oneLine: string;
  /** Asset shown in the collapsed card and enlarged in the expanded panel. */
  asset: string;
  assetAlt: string;
  /** "contain" for assets with no background (phone mockups, renders). */
  assetFit?: "cover" | "contain";
  /** Headline stat for the expanded panel. */
  stat?: WhyConkaStat;
  /** Expanded prose: the story that connects the proof to the claim. */
  story: string;
  /** Card 4 only: render app store install buttons in the expanded panel. */
  showAppButtons?: boolean;
}

export const whyConkaReasons: WhyConkaReason[] = [
  {
    id: 1,
    headline: "Built on research, not advertising",
    oneLine:
      "Over £500,000 of our own capital into clinical research with leading UK universities.",
    asset: "/story/Screenshot_2025-11-10_171922.webp",
    assetAlt: "CONKA research and development",
    stat: {
      value: "25+",
      caption: "clinical trials completed with high-performing organisations",
    },
    story:
      "Working with neuroscientists at Durham and Cambridge universities, every ingredient is backed by peer-reviewed research: 32 studies indexed in PubMed. The first professional sport trial showed a 16% increase in brain performance compared to placebo. We do the hard research and bottle it into a simple daily shot.",
  },
  {
    id: 2,
    headline: "Trusted where focus can't fail",
    oneLine:
      "Olympic medallists, world champions, and executives use CONKA on the days that matter most.",
    asset: "/testimonials/athlete/DanNortonNB.jpg",
    assetAlt: "Olympic medallist who uses CONKA",
    assetFit: "contain",
    stat: {
      value: "+36%",
      caption: "the largest individual cognitive improvement measured to date",
    },
    story:
      "CONKA is used across professional rugby, boxing, motorsport, and Olympic programmes, plus the boardrooms and trading floors where decisions carry the same weight. Every batch is Informed Sport tested, the certification professional athletes require before anything goes near their system.",
  },
  {
    id: 3,
    headline: "Natural ingredients, made in Britain",
    oneLine:
      "Ashwagandha, Rhodiola, Ginkgo and 13 more, extracted without alcohol and bottled in the UK.",
    asset: "/ingredients/renders/Ashwagandha.jpg",
    assetAlt: "Ashwagandha root, one of CONKA's natural ingredients",
    stat: {
      value: "16",
      caption: "natural active ingredients across the two formulas",
    },
    story:
      "Typical herbal tinctures use alcohol as a solvent. For professional athletes that's a compromise, so Dr. Shankar Katekhaye invented an alcohol-free extraction method that delivers faster absorption with nothing performance-compromising. Every batch is manufactured in the UK to GMP standards.",
  },
  {
    id: 4,
    headline: "Measured, not marketed",
    oneLine:
      "A 5-minute Cambridge-built cognitive test shows you exactly what's changing in your brain.",
    asset: "/app/AppConkaRing.png",
    assetAlt: "The CONKA app cognition test showing a score of 92",
    assetFit: "contain",
    stat: {
      value: "100,000+",
      caption: "cognitive tests completed through the CONKA app",
    },
    story:
      "The CONKA app includes the Integrated Cognitive Assessment, developed in partnership with Cambridge University: an unlearnable, language-independent test of brain processing speed. Take CONKA daily, test whenever you want, and watch your own data move. We don't ask you to trust us.",
    showAppButtons: true,
  },
  {
    id: 5,
    headline: "Results you can verify",
    oneLine:
      "+22% cognitive speed in men, +33% in women, in placebo-controlled trials.",
    asset: "/lifestyle/flow/FlowConkaRing.jpg",
    assetAlt: "CONKA Flow with the app's cognition ring",
    stat: {
      value: "+16%",
      caption: "overall cognitive efficiency vs placebo",
    },
    story:
      "These numbers come from controlled trials and the app's real-user dataset, not from marketing copy. Individual case studies have shown improvements up to +36% in total cognitive scores, with memory improvements of +63% for specific ingredients in published research.",
  },
  {
    id: 6,
    headline: "Born from a career-ending injury",
    oneLine:
      "One founder's rugby career was ended by concussion. The system he needed didn't exist, so they built it.",
    asset: "/TwoFounders.jpg",
    assetAlt: "CONKA founders Harry Glover and Humphrey Bodington",
    stat: {
      value: "6",
      caption: "years of development before the first bottle was sold",
    },
    story:
      "Harry Glover and Humphrey Bodington met as university teammates. Harry went on to play England Sevens; Humphrey's career was ended by repeated concussions and months of cognitive fog with no clear solution. CONKA started as his recovery and became a system for anyone who depends on their brain.",
  },
  {
    id: 7,
    headline: "Risk-free for 100 days",
    oneLine:
      "Try CONKA for up to 100 days. If you don't feel and measure the difference, full refund.",
    asset: "/formulas/both/BothHero.jpg",
    assetAlt: "CONKA Flow and Clear bottles",
    stat: {
      value: "100",
      caption: "days to feel the difference, or your money back",
    },
    story:
      "No returns, no hassles, no questions. Subscriptions can be paused, skipped, or cancelled anytime, and UK shipping is free. The only thing you have to lose is the fog.",
  },
];
