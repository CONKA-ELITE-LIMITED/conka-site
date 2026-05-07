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
  subline: "Sharpest 9am–3pm · Dips from 6pm · 712 users · 30 months",
  chart: {
    variant: "line",
    yLabel: "vs. your daily average",
    insightNote: "Most people peak 9am–3pm. The evening dip is real and measurable.",
    dosingBands: [
      {
        x1: "07",
        x2: "13",
        label: "Flow · AM",
        fillColor: "rgba(255, 255, 255, 0.09)",
        swatchColor: "rgba(255, 255, 255, 0.60)",
      },
      {
        x1: "13",
        x2: "22",
        label: "Clear · PM",
        fillColor: "rgba(255, 255, 255, 0.04)",
        swatchColor: "rgba(255, 255, 255, 0.35)",
      },
    ],
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
      topic: "MORNING PEAK",
      value: "+0.47",
      context: "Most people are at their sharpest between 9am and noon — about half a point above their daily average.",
      caveat: "n=1,650 tests · 09-12",
    },
    {
      counter: "02.",
      topic: "EVENING DIP",
      value: "-0.82",
      context: "By 9pm, scores drop nearly a full point below the daily average — a real, measurable dip.",
      caveat: "n=818 tests · 21-24",
    },
    {
      counter: "03.",
      topic: "CONKA EFFECT",
      value: "+1.09",
      context: "On days Conka was taken, scores held above the daily average even during the evening dip — 1.09 points above the non-Conka curve.^^",
      caveat: "n=74 Conka tests · 18-21",
    },
  ],
  interpretation:
    "Your cognitive performance naturally rises and falls throughout the day. Most people hit their sharpest point between 9am and 3pm, then slide into a noticeable dip by evening — lowest around 9pm.^^",
  conkaSubSection: {
    headline: "Conka users hold their level when others drop.",
    body: "When we look at tests logged on Conka days, scores stay above the daily average exactly where the curve normally drops most: late afternoon and evening. Mid-morning — when scores naturally peak anyway — the gap nearly disappears. We can't control for every variable, but the pattern is consistent across all four dip windows.",
    caveat:
      "247 Conka-tagged tests across the dip windows · directional consistency across all four windows · users may differ in unmeasured ways",
  },
  methodology:
    "Per-user deviation from personal mean. Each test compared to that user's daily average across all hours. 7,593 tests across 712 users between November 2023 and May 2026. Timestamps treated as UK local time (timezone not stored).",
};

// ─── Mental Fatigue & Readiness ───────────────────────────────────────────────

const mentalFatigue: ReportData = {
  id: "mental-fatigue",
  topicCode: "APP-01",
  eyebrowConcept: "Mental fatigue",
  hook: "When you feel foggy, the test scores agree.",
  subline: "501 users · 6,282 entries · 18 months",
  chart: {
    variant: "bar",
    yLabel: "points lost vs. your best days",
    insightNote: "The more fatigued you are, the bigger the performance drop.",
    points: [
      { label: "Moderate", value: -1.5, meta: "n=245" },
      { label: "Severe", value: -1.6, meta: "n=73" },
      { label: "Exhausted", value: -2.6, meta: "n=26" },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "AVERAGE COST",
      value: "-1.8 pts",
      context: "On average, fatigued days cost users 1.8 points off their personal best — a measurable dip you can feel before the test starts.",
      caveat: "n=260 users · 1,248 fatigued tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+24ms",
      context: "Reaction time slows by about 6% when fatigued — not huge, but enough to notice on anything that requires a quick response.",
      caveat: "n=123 users",
    },
    {
      counter: "03.",
      topic: "SELF-MATCH",
      value: "-2.7 pts",
      context: "On days users said they weren't at their best, scores were 2.7 points below their personal peak — the data agreed with them.",
      caveat: "n=78 users · 395 tests",
    },
  ],
  interpretation:
    "The data backs up what you already sense: feeling foggy actually costs you. Fatigued days show a real and consistent dip in both score and reaction time — and the worse the fatigue, the bigger the drop.^^",
  conkaSubSection: {
    headline: "Faster reaction times on Conka days.",
    body: "When fatigued-day tests are split by whether Conka was logged, the Conka days show 41ms faster reaction times on average.^^ At 15 users this is an early signal, not a controlled trial — but the direction is consistent.",
    caveat:
      "n=15 users with both conditions · directional, not statistically conclusive · accuracy delta is mixed at this sample size",
  },
  ingredientBridge: {
    intro:
      "App data on Conka's effect for fatigue is directional. Independent peer-reviewed studies on the relevant ingredients show:",
    citations: [
      {
        ingredient: "Acetyl-L-Carnitine (ALCAR)",
        finding:
          "In one study, participants taking acetyl-L-carnitine showed improvements in psychomotor speed and attention, and reductions in mental fatigue (Malaguarnera et al. 2008).¶",
        pmid: "18937015",
        studyDesign: "Randomised controlled clinical trial",
        participants: "125 subjects",
        duration: "90 days",
      },
      {
        ingredient: "Rhodiola rosea",
        finding:
          "In one study, participants with fatigue syndrome taking Rhodiola rosea showed an anti-fatigue effect and improvements in mental performance (Olsson et al. 2009).¶",
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
  hook: "Stress costs more than most people realise.",
  subline: "12 users · 44 stress-day tests",
  chart: {
    variant: "bar",
    yLabel: "points lost vs. your calm days",
    insightNote: "Moderate stress costs more than a heavy night's drinking.",
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
      context: "On moderate-stress days, scores drop over 5 points from each person's calm-day baseline — one of the largest effects across the entire dataset.",
      caveat: "n=18 users · 58 tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+41ms",
      context: "Reaction time slows by 10% under stress — enough to feel on anything that needs a quick decision.",
      caveat: "n=12 users",
    },
    {
      counter: "03.",
      topic: "BACKGROUND COST",
      value: "53%",
      context: "More than half of all test sessions are taken under mild stress. It's not an occasional event — it's the default state.",
      caveat: "n=891 stress entries",
    },
  ],
  interpretation:
    "Stress is the single largest performance signal in the app data. Mild stress appears in more than half of all sessions — it's the background state, not an edge case. Under moderate stress, scores fall over 5 points and reaction times slow by 10%. The effect under moderate stress is comparable to a heavy night's drinking.",
  // No Conka sub-section: only 3 users had both conditions, below the threshold for a defensible per-user delta.
  ingredientBridge: {
    intro:
      "Only 3 users have stressed test days both with and without Conka. Per-user app data is below the threshold for a Conka-effect observation. Independent peer-reviewed studies on the stress-targeting ingredients in Conka show:",
    citations: [
      {
        ingredient: "Ashwagandha (Withania somnifera)",
        finding:
          "In one study, participants with chronic stress taking KSM-66 ashwagandha showed a reduction in perceived stress and serum cortisol levels (Chandrasekhar et al. 2012).¶",
        pmid: "23439798",
        studyDesign: "Prospective, randomised, double-blind, placebo-controlled",
        participants: "64 subjects with chronic stress",
        duration: "60 days",
      },
      {
        ingredient: "Lemon Balm (Melissa officinalis)",
        finding:
          "In one study, participants taking Lemon Balm showed reduced effects of laboratory-induced stress on anxiety ratings (Kennedy et al. 2006).¶",
        pmid: "16444660",
        studyDesign: "Randomised, double-blind, placebo-controlled, crossover",
        participants: "24 healthy volunteers",
        duration: "Single-dose sessions",
      },
      {
        ingredient: "Rhodiola rosea",
        finding:
          "In one study, participants taking Rhodiola rosea showed a reduced cortisol response to awakening stress and an anti-fatigue effect (Olsson et al. 2009).¶",
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
    yLabel: "points lost vs. your sober days",
    insightNote: "Under 6 drinks: no clear signal. Over 6: nearly 5 points lost.",
    points: [
      { label: "1-5 drinks", value: 0.7, meta: "no clear effect" },
      { label: "6+ drinks", value: -4.9, meta: "n=11" },
    ],
  },
  statCards: [
    {
      counter: "01.",
      topic: "6+ DRINKS",
      value: "-4.9 pts",
      context: "The morning after 6 or more drinks, scores drop nearly 5 points from each person's sober baseline — one of the largest single-cause drops in the dataset.",
      caveat: "n=11 users · 24 tests",
    },
    {
      counter: "02.",
      topic: "REACTION",
      value: "+29ms",
      context: "Hangover mornings slow reaction time by about 7% — enough to notice on anything that needs quick thinking.",
      caveat: "n=27 users · 113 hangover tests",
    },
    {
      counter: "03.",
      topic: "READINESS",
      value: "-16%",
      context: "People report feeling 16% less ready on hangover mornings. In this dataset, the test scores agree.",
      caveat: "n=8 users",
    },
  ],
  interpretation:
    "Light drinking (under 6 drinks) doesn't produce a consistent signal in this data. The effect appears clearly at 6 or more drinks: scores drop nearly 5 points, accuracy falls, and reaction time slows by 7%. If you've ever felt the next-day fog was real, this data suggests you were right.^^",
  conkaSubSection: {
    headline: "Faster on Conka hangover days.",
    body: "When hangover-day tests are split by whether Conka was logged, the Conka days show 56ms faster reaction times.^^ At 11 users this is directional — worth noting, not concluding from.",
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
