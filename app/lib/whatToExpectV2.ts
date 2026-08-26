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
    body: "Most people feel it within minutes: the mental chatter quiets and focus comes easily, without the jittery edge of caffeine.",
  },
  {
    title: "Next 4-8 Hours",
    body: "You settle into calm, locked-in work that holds for hours, as lemon balm and rhodiola keep the state steady. No spike, no wobble.",
  },
  {
    title: "No Crash Ever",
    body: "Nothing in Flow spikes you, so nothing drops you. Steady energy that is built, not borrowed.",
  },
  {
    title: "Week 1",
    body: "Pressure starts feeling lighter as ashwagandha builds, dropping cortisol by 28% in trials. Mornings begin smoother.",
  },
  {
    title: "Week 2+",
    body: "Your focus compounds into a new baseline: steadier energy, clearer thinking for longer, and afternoon dips that stop showing up.",
  },
];

const expectClear: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people feel the fog start to lift on the first shot, as Alpha GPC raises acetylcholine, the brain's signal for sharp recall.",
  },
  {
    title: "Next 4-8 Hours",
    body: "Thinking stays quick and clear through the day, as ginkgo lifts cerebral circulation: a 16% gain in cognition and attention in trials.",
  },
  {
    title: "No Crash Ever",
    body: "No stimulants are doing the lifting, so there is nothing to crash from. Just clean, clear-headed function.",
  },
  {
    title: "Week 1",
    body: "You'll notice the fog stays gone for longer. Antioxidant capacity builds day on day: glutathione stores rise and mental fatigue drops 35% in trials.",
  },
  {
    title: "Week 2+",
    body: "Clarity becomes your norm rather than a boost: sharper recall, calmer processing, a mind you can count on.",
  },
];

const expectBoth: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people feel both within minutes: the chatter quiets and thinking sharpens from the first shot.",
  },
  {
    title: "Next 4-8 Hours",
    body: "Calm, locked-in focus from Flow while Clear keeps recall quick. Two formulas working the same day.",
  },
  {
    title: "No Crash Ever",
    body: "Steady by design. Nothing spikes, nothing drops, no afternoon tax.",
  },
  {
    title: "Week 1",
    body: "You'll notice pressure feeling lighter and fatigue stops accumulating, as adaptogens lower the stress response and antioxidant stores build.",
  },
  {
    title: "Week 2+",
    body: "The full system compounds into a higher baseline: faster thinking, easier decisions, every day.",
  },
];

export const expectV2Header = {
  title: "What you'll feel, and when",
  subtitle: "From the first shot to a new baseline, this is the timeline.",
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
    src: "/formulas/both/BothShotSide.jpg",
    alt: "CONKA Flow and Clear shots, side profile",
  },
};
