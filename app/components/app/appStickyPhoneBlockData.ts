/**
 * Shared data for AppStickyPhoneBlock (desktop) and AppStickyPhoneBlockMobile.
 * 3 sections — mechanism story: how the test works → daily tracking → improvement over time.
 * Assets: AppTestDistractor, AppWellness, AppTestBreakdown (no overlap with AppFeaturePanel).
 */

export type SectionData = {
  heading: string;
  body: string;
};

export const PHONE_SOURCES = [
  "/app/AppTestDistractor.png",
  "/app/AppWellness.png",
  "/app/AppTestBreakdown.png",
] as const;

export const SECTIONS_DATA: SectionData[] = [
  {
    heading: "Most cognitive tests get easier with practice. This one can't.",
    body: "The test measures how quickly your brain processes visual information — the same mechanism first affected by cognitive decline. Natural images mean there is no way to game it. Your score only improves if your brain actually improves.",
  },
  {
    heading: "Your score changes every day. Now you'll know why.",
    body: "Log sleep, stress, caffeine, training — and see how each one shifts your cognitive score. The app connects cause and effect so you can adjust what is actually moving the needle.",
  },
  {
    heading: "See your brain improve over 30 days.",
    body: "Clinical data supports up to 16% improvement in cognitive performance on the recommended plan. The graph does not lie — you are either improving or you are not.",
  },
];

export const SECTION_TAB_LABELS = ["01 The Test", "02 Track & Log", "03 Your Progress"];

export const PHONE_ALT_LABELS = [
  "Distractor test screen showing visual recognition",
  "Wellness log screen showing daily tracking",
  "Test breakdown screen showing progress over time",
];

export const FIG_LABELS = [
  "Fig. 02 · The Test",
  "Fig. 03 · Wellness log",
  "Fig. 04 · Your progress",
];
