/**
 * Shared data for AppStickyPhoneBlock (desktop) and AppStickyPhoneBlockMobile.
 * 3 sections — mechanism story: how the test works → daily tracking → improvement over time.
 * Assets: AppTestDistractor, AppWellness, AppTestBreakdown (no overlap with AppFeaturePanel).
 */

export type SectionData = {
  eyebrow?: string;
  heading: string;
  body: string;
  footnote?: string;
  stats?: { value: string; label: string; source?: string }[];
};

export const PHONE_SOURCES = [
  "/app/AppTestDistractor.png",
  "/app/AppWellness.png",
  "/app/AppTestBreakdown.png",
] as const;

export const SECTIONS_DATA: SectionData[] = [
  {
    eyebrow: "Not an intelligence test. A processing speed test.",
    heading: "Most cognitive tests get easier with practice. This one can't.",
    body:
      "The test measures how quickly your brain processes visual information — the same mechanism " +
      "that's first affected by cognitive decline. It uses natural images rather than words, " +
      "numbers, or patterns, so there's no way to learn it or game it. Your score only " +
      "improves if your brain actually improves.",
    footnote: "It does not measure intelligence — only how efficiently your brain processes what it sees.",
    stats: [
      { value: "93%", label: "Sensitivity detecting cognitive impairment", source: "ADePT Study, PMC10533908" },
      { value: "87.5%", label: "Test-retest reliability", source: "ADePT Study, PMC10533908" },
      { value: "14", label: "NHS Trusts in clinical validation trials", source: "HRA ISRCTN95636074" },
      { value: "2 min", label: "That's all it takes" },
    ],
  },
  {
    heading: "Your score changes every day. Now you'll know why.",
    body:
      "Log what matters — sleep, stress, caffeine, training — and see how it lines up with your cognitive score. " +
      "The app turns that loop into clear cause and effect so you can adjust what's actually moving the needle.",
  },
  {
    heading: "See your brain improve over 30 days.",
    body:
      "Clinical data supports up to 16% improvement in cognitive performance following the " +
      "recommended plan. The graph can't lie — you're either improving or you're not. Pairs with CONKA formulas to show what's working.",
    stats: [
      { value: "16%", label: "Cognitive improvement in 30 days", source: "Clinical data" },
    ],
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
