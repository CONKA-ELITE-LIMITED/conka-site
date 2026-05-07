import type { ReportData } from "./appInsightsTypes";

/**
 * Source: docs/conkaAppData/*.md (machine-readable summaries) and SOURCES.md
 * for ingredient PMID citations. All numbers traceable to the source reports.
 *
 * Filtered out for being noise / not meaningful:
 * - "Conka intake +10% on hangover days" (behaviour, not effect)
 * - Sleep -0.2% (negligible)
 * - Severe stress +3.1 (statistical artefact from n=2)
 */

// ─── Time of Day ──────────────────────────────────────────────────────────────

const timeOfDay: ReportData = {
  id: "time-of-day",
  topicCode: "APP-01",
  eyebrowConcept: "Time of day",
  hook: "Your brain runs on a curve.",
  subline: "Peak 09-15 · Dip 18-21 · 712 users · 30 months",
  chart: {
    variant: "line",
    yLabel: "Score deviation from personal average",
    points: [
      { hour: 7, hourLabel: "07", noConka: -0.09, conka: 1.71 },
      { hour: 10, hourLabel: "10", noConka: 0.47, conka: 0.55 },
      { hour: 13, hourLabel: "13", noConka: 0.43, conka: 1.87 },
      { hour: 16, hourLabel: "16", noConka: -0.08, conka: 1.29 },
      { hour: 19, hourLabel: "19", noConka: -0.61, conka: 0.48 },
      { hour: 22, hourLabel: "22", noConka: -0.82, conka: -0.06 },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "PEAK",
      value: "+0.47",
      context: "Mid-morning is the strongest sustained performance window.",
      caveat: "n=1,650 tests · 09-12",
    },
    {
      counter: "02.",
      topic: "TROUGH",
      value: "-0.82",
      context: "Late evening is the worst sustained performance window.",
      caveat: "n=818 tests · 21-24",
    },
    {
      counter: "03.",
      topic: "DIP UPLIFT",
      value: "+1.09",
      context: "Conka users score above their daily average exactly where the curve dips.",
      caveat: "n=74 Conka tests · 18-21",
    },
  ],
  interpretation:
    "The brain does not run flat. Performance peaks from late morning through early afternoon and dips through the evening to a low around 9pm. Where caffeine sharpens the morning peak and steepens the crash, Conka users hold higher through the dip windows.",
  conkaSubSection: {
    headline: "A flatter curve, not a higher spike.",
    body: "Conka users show their largest performance gap exactly where the natural curve dips most: late afternoon and evening. Mid-morning, when most people peak, the gap shrinks to nothing because everyone scores well there. The signal is sustained baseline, not stronger morning hit.",
    caveat:
      "247 Conka tests across the dip windows · directional consistency across all four windows · users may differ in unmeasured ways",
  },
  methodology:
    "Per-user deviation from personal mean. Each test compared to that user's daily average across all hours. 7,593 tests across 712 users between November 2023 and May 2026. Timestamps treated as UK local time (timezone not stored).",
};

// ─── Mental Fatigue & Readiness ───────────────────────────────────────────────

const mentalFatigue: ReportData = {
  id: "mental-fatigue",
  topicCode: "APP-01",
  eyebrowConcept: "Mental fatigue",
  hook: "When your brain feels off, it really is.",
  subline: "501 users · 6,282 entries · 18 months",
  chart: {
    variant: "bar",
    yLabel: "Score change vs personal fresh baseline (points)",
    points: [
      { label: "Moderate", value: -1.5, meta: "n=245" },
      { label: "Severe", value: -1.6, meta: "n=73" },
      { label: "Exhausted", value: -2.6, meta: "n=26" },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "FATIGUE",
      value: "-1.8 pts",
      context: "Score drop on fatigued days vs each user's own fresh baseline.",
      caveat: "n=260 users · 1,248 fatigued tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+24ms",
      context: "Slower reaction time when mentally fatigued, around 6% above baseline.",
      caveat: "n=123 users",
    },
    {
      counter: "03.",
      topic: "READINESS",
      value: "-2.7 pts",
      context: "Score drop on “not feeling best” days vs each user's own peak.",
      caveat: "n=78 users · 395 tests",
    },
  ],
  interpretation:
    "Self-reported fatigue and low readiness are not just feelings. On their own worst fatigue days, users reliably underperform their own baseline by 1-3 points and react around 6% slower. The effect is real, modest, and consistent across hundreds of users.",
  conkaSubSection: {
    headline: "On fatigued days, Conka users react 41ms faster.",
    body: "Per-user delta on the same users' fatigued-with-Conka vs fatigued-without-Conka tests. Speed is the most consistent KPI signal across this analysis and the alcohol report.",
    caveat:
      "n=15 users with both conditions · directional, not statistically conclusive · accuracy delta is mixed at this sample size",
  },
  ingredientBridge: {
    intro:
      "App data on Conka effect for fatigue is directional. Independent peer-reviewed studies on the relevant ingredients show:",
    citations: [
      {
        ingredient: "Acetyl-L-Carnitine (ALCAR)",
        finding:
          "Significantly improved cognitive function, attention, psychomotor speed, and reduced mental fatigue (P<0.001).",
        pmid: "18937015",
        studyDesign: "Randomised controlled clinical trial",
        participants: "125 subjects",
        duration: "90 days",
      },
      {
        ingredient: "Rhodiola rosea",
        finding:
          "Anti-fatigue effect that increased mental performance and decreased the cortisol response to awakening stress.",
        pmid: "19016404",
        studyDesign: "Phase III randomised, double-blind, placebo-controlled",
        participants: "60 individuals with fatigue syndrome",
        duration: "28 days",
      },
    ],
  },
  methodology:
    "Per-user delta method. Each user compared against their own fresh-day baseline. 260 users meeting the both-conditions threshold. Data from November 2024 to May 2026.",
};

// ─── Stress ───────────────────────────────────────────────────────────────────

const stress: ReportData = {
  id: "stress",
  topicCode: "APP-01",
  eyebrowConcept: "Stress",
  hook: "Stress is a 5-point cognitive tax.",
  subline: "12 users · 44 stressed tests · Per-user delta",
  chart: {
    variant: "bar",
    yLabel: "Score change vs personal no-stress baseline (points)",
    points: [
      { label: "Mild", value: -1.8, meta: "n=35" },
      { label: "Moderate", value: -5.4, meta: "n=18" },
      { label: "High", value: -7.6, meta: "n=3" },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "MODERATE",
      value: "-5.4 pts",
      context: "Score drop under moderate stress vs each user's no-stress baseline.",
      caveat: "n=18 users · 58 tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+41ms",
      context: "Slower reaction time under stress, around 10% above baseline.",
      caveat: "n=12 users",
    },
    {
      counter: "03.",
      topic: "PREVALENCE",
      value: "53%",
      context: "Of all test sessions are taken under mild stress: a persistent background tax.",
      caveat: "n=891 stress entries",
    },
  ],
  interpretation:
    "The largest single effect across all four reports. Moderate stress costs over 5 points of personal score and 41ms of reaction time. Stress also degrades consistency and accuracy, not only speed. Mild stress shows up in over half of all test sessions: a persistent background cost, not a rare event.",
  // No Conka sub-section: only 3 users had both conditions, below the threshold for a defensible per-user delta.
  ingredientBridge: {
    intro:
      "Only 3 users have stressed test days both with and without Conka. Per-user app data is below the threshold for a Conka-effect claim. Independent peer-reviewed studies on the stress-targeting ingredients in Conka show:",
    citations: [
      {
        ingredient: "Ashwagandha (Withania somnifera)",
        finding:
          "Significant reduction in stress scores (P<0.0001) and serum cortisol levels (P=0.0006).",
        pmid: "23439798",
        studyDesign: "Prospective, randomised, double-blind, placebo-controlled",
        participants: "64 subjects with chronic stress",
        duration: "60 days",
      },
      {
        ingredient: "Lemon Balm (Melissa officinalis)",
        finding:
          "Ameliorated negative effects of laboratory-induced stress on anxiety ratings.",
        pmid: "16444660",
        studyDesign: "Randomised, double-blind, placebo-controlled, crossover",
        participants: "24 healthy volunteers",
        duration: "Single-dose sessions",
      },
      {
        ingredient: "Rhodiola rosea",
        finding:
          "Decreased cortisol response to awakening stress alongside an anti-fatigue effect.",
        pmid: "19016404",
        studyDesign: "Phase III randomised, double-blind, placebo-controlled",
        participants: "60 individuals",
        duration: "28 days",
      },
    ],
  },
  methodology:
    "Per-user delta. Stressed days (moderate stress or higher, normalised score ≤ 0.5) compared to each user's no-stress baseline. 12 users met the both-conditions threshold. Data from December 2025 to May 2026.",
};

// ─── Alcohol ──────────────────────────────────────────────────────────────────

const alcohol: ReportData = {
  id: "alcohol",
  topicCode: "APP-01",
  eyebrowConcept: "Alcohol",
  hook: "What a hangover actually does to your brain.",
  subline: "65 users · 638 entries · 6 months",
  chart: {
    variant: "bar",
    yLabel: "Score change vs personal sober baseline (points)",
    points: [
      { label: "1-5 drinks", value: 0.7, meta: "noise" },
      { label: "6+ drinks", value: -4.9, meta: "n=11" },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "HEAVY",
      value: "-4.9 pts",
      context: "Score drop the morning after 6 or more drinks the night before.",
      caveat: "n=11 users · 24 tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+29ms",
      context: "Slower reaction time on any hangover day, around 7% above baseline.",
      caveat: "n=27 users · 113 hangover tests",
    },
    {
      counter: "03.",
      topic: "READINESS",
      value: "-16%",
      context: "Self-reported readiness drop on hangover mornings.",
      caveat: "n=8 users",
    },
  ],
  interpretation:
    "Below 6 drinks the data is noisy: small samples per cell, individual variation dominates. The reliable signal emerges at 6 or more drinks the night before, where users score nearly 5 points below their personal baseline and accuracy drops by over 4 points.",
  conkaSubSection: {
    headline: "On hangover days, Conka users react 56ms faster.",
    body: "Per-user delta on the same users' hangover-with-Conka vs hangover-without-Conka tests. Speed is the most objective signal in this comparison.",
    caveat:
      "n=11 users with both conditions · directional, not statistically conclusive · sample may have followed lighter drinking nights",
  },
  methodology:
    "Per-user delta. Hangover days (1+ drinks the previous night) compared to each user's sober baseline. 27 users met the both-conditions threshold for the core analysis. Data from December 2025 to May 2026.",
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const APP_INSIGHTS_REPORTS: ReportData[] = [
  timeOfDay,
  mentalFatigue,
  stress,
  alcohol,
];

export const APP_INSIGHTS_BY_ID = {
  "time-of-day": timeOfDay,
  "mental-fatigue": mentalFatigue,
  stress: stress,
  alcohol: alcohol,
} as const;

/** Page-level totals for the hero strapline. */
export const APP_INSIGHTS_TOTALS = {
  users: 712,
  tests: 7593,
  monthsSpan: 30,
  reportCount: APP_INSIGHTS_REPORTS.length,
} as const;
