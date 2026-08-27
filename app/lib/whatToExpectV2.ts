/**
 * "What to expect" V2 milestone data for the PDP scroll timeline
 * (Flow / Clear / Both).
 *
 * Copy style (learned from the Gray Matters reference): the reader's felt
 * experience is the subject ("Most people feel...", "You'll notice..."),
 * mechanism trails behind "as", concrete daily moments over abstract states,
 * plus our trial numbers. Timing logic maps to the ingredients: fast actors
 * (Lemon Balm, Rhodiola, Alpha GPC, Ginkgo) carry the early beats; builders
 * (Ashwagandha, the antioxidant stack) carry Week 1+.
 */

export interface ExpectV2Milestone {
  title: string;
  body: string;
}

export type ExpectV2ProductId = "01" | "02" | "both";

const expectFlow: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people experience a calmer, sharper focus within minutes, without the jittery edge of caffeine.",
  },
  {
    title: "Next 4-8 Hours",
    body: "A heightened flow state as lemon balm and rhodiola settle the noise. Experience calm, focused, long-lasting productive work.",
  },
  {
    title: "No Crash Ever",
    body: "Stress-busting adaptogens create a steady, energised state without a crash. Built, not borrowed.",
  },
  {
    title: "Week 1",
    body: "You'll notice pressure feeling lighter and less fatigue in the afternoons, as ashwagandha drops cortisol by 28% in trials.",
  },
  {
    title: "Week 2+",
    body: "Your focus compounds as adaptogens regulate cortisol and stress: steadier energy, clearer thinking, a new baseline.",
  },
];

const expectClear: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people experience the fog starting to lift within minutes of the first shot.",
  },
  {
    title: "Next 4-8 Hours",
    body: "Thinking stays quick and clear as Alpha GPC raises acetylcholine and ginkgo lifts cerebral circulation. A calm, clear-headed state that lasts.",
  },
  {
    title: "No Crash Ever",
    body: "No stimulants are doing the lifting, so there is nothing to crash from. Just clean, clear function.",
  },
  {
    title: "Week 1",
    body: "You'll notice more clarity in the mornings and the fog staying gone for longer, as antioxidant capacity builds day on day. Brain fog is a thing of the past.",
  },
  {
    title: "Week 2+",
    body: "Your cognitive stamina improves as glutathione stores rise and mental fatigue drops 35% in trials. Clarity becomes your norm, not a boost.",
  },
];

const expectBoth: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people experience a mental uplift within minutes.",
  },
  {
    title: "Next 4-8 Hours",
    body: "A heightened flow state from the synergistic effects of both formulas. Experience a calm, focused, long-lasting productive state of mind.",
  },
  {
    title: "No Crash Ever",
    body: "Plant-based energy and stress-busting adaptogens create a steady, energised state without a crash.",
  },
  {
    title: "Week 1",
    body: "You'll notice increases in productivity due to less fatigue in the afternoons and more clarity in the mornings. Brain fog is a thing of the past.",
  },
  {
    title: "Week 2+",
    body: "Your cognitive stamina improves as nootropics boost acetylcholine and neurogenesis, while adaptogens enhance your mood by regulating cortisol and stress.",
  },
];

export const expectV2Header = {
  title: "What you'll feel, and when",
  subtitle: "Enhance focus, energy, and clarity, one sip at a time.",
};

export const expectV2Milestones: Record<ExpectV2ProductId, ExpectV2Milestone[]> = {
  "01": expectFlow,
  "02": expectClear,
  both: expectBoth,
};

export interface ExpectV2Asset {
  /** Portrait-friendly render for the desktop sticky column. */
  src: string;
  alt: string;
}

export const expectV2Asset: Record<ExpectV2ProductId, ExpectV2Asset> = {
  "01": {
    src: "/formulas/conkaFlow/FlowShotSide.jpg",
    alt: "CONKA Flow shot, side profile",
  },
  "02": {
    src: "/formulas/conkaClear/ClearShotSide.jpg",
    alt: "CONKA Clear shot, side profile",
  },
  both: {
    // 810x1013, so it lands on the column's 4:5 frame exactly, no letterboxing.
    src: "/formulas/both/BothIngredients.jpg",
    alt: "CONKA Flow and Clear shots on a steel plinth, surrounded by lemon balm, citrus, turmeric root, blueberries and sunflower",
  },
};
