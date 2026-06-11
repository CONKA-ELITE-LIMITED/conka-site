/**
 * Data for AppV2TestJourney.
 * 2 beats — trust story: the test can't be gamed → improvement over 30 days.
 * The tracking/wellness story is owned by AppV2Engine ("Everything in").
 * Assets: AppTestDistractor, AppTestBreakdown.
 */

export type SectionData = {
  heading: string;
  body: string;
};

export const PHONE_SOURCES = [
  "/app/AppTestDistractor.png",
  "/app/AppTestBreakdown.png",
] as const;

export const SECTIONS_DATA: SectionData[] = [
  {
    heading: "Most cognitive tests get easier with practice. This one can't.",
    body: "The test measures how quickly your brain processes visual information: the same mechanism first affected by cognitive decline. Natural images mean there is no way to game it. Your score only improves if your brain actually improves.",
  },
  {
    heading: "See your brain improve over 30 days.",
    body: "Clinical data supports up to 16% improvement in cognitive performance on the recommended plan. The graph does not lie: you are either improving or you are not.",
  },
];

export const SECTION_TAB_LABELS = ["01 The Test", "02 Your Progress"];

export const PHONE_ALT_LABELS = [
  "Distractor test screen showing visual recognition",
  "Test breakdown screen showing progress over time",
];
