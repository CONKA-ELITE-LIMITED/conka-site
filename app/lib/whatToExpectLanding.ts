/**
 * "What to expect" milestone data for the PDP timeline (Flow / Clear / Both).
 * Day-based, outcome-led milestones shown under the full-bleed hero asset.
 */

export interface ExpectMilestone {
  day: string;
  title: string;
  body: string;
}

export const expectFlow: ExpectMilestone[] = [
  {
    day: "Day 1",
    title: "Calm, sharper focus",
    body: "Less mental chatter and easier concentration, often within the first shot.",
  },
  {
    day: "Day 7",
    title: "Stress feels manageable",
    body: "Adaptogens build day on day, so mornings feel smoother and pressure lighter.",
  },
  {
    day: "Day 30",
    title: "Focus that compounds",
    body: "Steadier energy, clearer thinking, and fewer afternoon dips.",
  },
];

export const expectClear: ExpectMilestone[] = [
  {
    day: "Day 1",
    title: "The fog lifts",
    body: "Complex tasks get easier from the first shot as oxidative stress drops.",
  },
  {
    day: "Day 7",
    title: "Thinking sharpens",
    body: "Antioxidant capacity builds daily, so mental fatigue feels lighter.",
  },
  {
    day: "Day 30",
    title: "Clarity established",
    body: "Reliable mental clarity and focus, not just a short-lived boost.",
  },
];

export const expectBoth: ExpectMilestone[] = [
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
