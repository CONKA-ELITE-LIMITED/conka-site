/**
 * Shared data for AppStickyPhoneBlock (desktop) and AppStickyPhoneBlockMobile.
 */

export type SectionData = {
  eyebrow?: string;
  heading: string;
  body: string;
  footnote?: string;
  stats?: { value: string; label: string; source?: string }[];
};

export const PHONE_SOURCES = [
  "/app/AppConkaRing.png",
  "/app/AppWellness.png",
  "/app/AppTestBreakdown.png",
  "/app/AppLeaderboard.png",
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
      { value: "14", label: "NHS Trusts in clinical validation trials", source: "HRA validation study, ISRCTN95636074" },
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
  },
  {
    heading: "See where you rank against thousands of athletes. Globally.",
    body:
      "Football, F1, rugby, ultra running — the same leaderboard. Press and hold any user to send a challenge. " +
      "Add friends, track trends, and prove it.",
  },
];

export const SECTION_TAB_LABELS = ["01 The Test", "02 What You Track", "03 Your Progress", "04 Compete"];
