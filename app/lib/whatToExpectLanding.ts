/**
 * "What to expect" milestone data for the PDP timeline (Flow / Clear / Both).
 * Day-based, outcome-led milestones shown under the full-bleed hero asset.
 */

export interface ExpectMilestone {
  day: string;
  title: string;
  body: string;
}

const expectFlow: ExpectMilestone[] = [
  {
    day: "Day 1",
    title: "Calm, sharper focus",
    body: "The mental chatter quiets and concentration comes easily, often within the first shot. You settle into deep, focused work without the jittery edge of caffeine.",
  },
  {
    day: "Day 7",
    title: "Stress feels manageable",
    body: "As the adaptogens build day on day, your mornings start smoother and pressure feels lighter. You meet a busy schedule with a steadier, calmer head.",
  },
  {
    day: "Day 30",
    title: "Focus that compounds",
    body: "Energy holds steadier, thinking stays clearer for longer, and the afternoon dips fade. The benefits compound into a new baseline you can rely on every day.",
  },
];

const expectClear: ExpectMilestone[] = [
  {
    day: "Day 1",
    title: "The fog lifts",
    body: "The mental fog lifts and complex tasks get easier from the very first shot, as antioxidants go to work dialling down the oxidative stress that clouds your thinking.",
  },
  {
    day: "Day 7",
    title: "Thinking sharpens",
    body: "As antioxidant capacity builds through the week, mental fatigue feels lighter and your thinking sharpens. The afternoon reset becomes something you look forward to.",
  },
  {
    day: "Day 30",
    title: "Clarity established",
    body: "Reliable mental clarity and focus become the norm rather than a short-lived boost, with sharper recall and a calmer, clearer mind supporting you long term.",
  },
];

const expectBoth: ExpectMilestone[] = [
  {
    day: "Day 1",
    title: "Focus & Clarity",
    body: "Experience laser-sharp focus and steady, jitter-free energy that eliminates procrastination and helps you maintain deep concentration for hours.",
  },
  {
    day: "Day 7",
    title: "Resilience",
    body: "Feel a profound shift in your response to stress as mental fatigue disappears and consistent motivation becomes your new normal.",
  },
  {
    day: "Day 30",
    title: "Better Brain",
    body: "Your cognitive baseline has permanently elevated. Problems feel simpler, thinking flows faster, and decisions come naturally in every area of life.",
  },
];

export type ExpectProductId = "01" | "02" | "both";

export const expectMilestones: Record<ExpectProductId, ExpectMilestone[]> = {
  "01": expectFlow,
  "02": expectClear,
  both: expectBoth,
};

export interface ExpectAsset {
  /** 16:9 landscape crop for lg and up. */
  desktop: string;
  /** 4:5 portrait crop for below lg. */
  mobile: string;
  alt: string;
}

export const whatToExpectAsset: Record<ExpectProductId, ExpectAsset> = {
  "01": {
    desktop: "/formulas/whatToExpect/FlowWhatToExpect.jpg",
    mobile: "/formulas/whatToExpect/FlowWhatToExpectMobile.jpg",
    alt: "CONKA Flow, your brain optimised after 30 days",
  },
  "02": {
    desktop: "/formulas/whatToExpect/ClearWhatToExpect.jpg",
    mobile: "/formulas/whatToExpect/ClearWhatToExpectMobile.jpg",
    alt: "CONKA Clear, your brain optimised after 30 days",
  },
  both: {
    desktop: "/formulas/whatToExpect/BothWhatToExpect.jpg",
    mobile: "/formulas/whatToExpect/BothWhatToExpectMobile.jpg",
    alt: "CONKA Flow and Clear, your brain optimised after 30 days",
  },
};
