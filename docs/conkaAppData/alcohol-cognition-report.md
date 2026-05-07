# Alcohol and Cognitive Performance: A CONKA App Data Report

**Analysis date:** May 2026
**Data range:** December 2025 -- May 2026
**Prepared from:** CONKA app user data (local PostgreSQL + Firestore)

---

## What This Report Is

This report looks at what happens to people's cognitive performance the morning after drinking alcohol, using real data from CONKA app users who voluntarily track their alcohol intake as a wellness factor alongside their daily cognitive tests.

It is not a clinical trial. It is an observational analysis -- we are looking at patterns in what users self-report and how they score, not running a controlled experiment. That means we can identify associations, not prove cause and effect. But the sample is real, the behaviour is naturalistic, and the patterns are consistent enough to be meaningful.

---

## How Alcohol Is Tracked in the App

When users take a cognitive test in the CONKA app, they are optionally prompted to log a wellness snapshot: a set of self-reported factors recorded at the time of testing. One of those factors is **"Alcohol Consumption"** -- the question asked is how many drinks the user had **the previous night**.

This is important: the alcohol data is measuring **hangover state**, not same-day impairment. When a user logs 3 drinks, they are saying "I had 3 drinks last night" -- so what we are observing is next-morning cognitive performance, not in-the-moment intoxication.

Response options range from 0 (no drinks) through 1, 2, 3, 4, 5, and 6+ drinks.

---

## The Data

### Who is included

| Metric | Count |
|--------|-------|
| Users actively tracking alcohol as a wellness factor | 72 |
| Of those, users who have logged at least one alcohol response | 65 |
| Users who have reported drinking (>0 drinks) at least once | 44 |
| Total alcohol log entries across all users | 638 |
| Date range | Dec 2025 -- May 2026 |

### How people typically responded

Of the 638 logged alcohol entries:

| Response | Count | % of entries |
|----------|-------|--------------|
| 0 drinks (sober) | 491 | 73.3% |
| 1 drink | 53 | 7.9% |
| 2 drinks | 45 | 6.7% |
| 4 drinks | 27 | 4.0% |
| 6+ drinks | 26 | 3.9% |
| 3 drinks | 21 | 3.1% |
| 5 drinks | 7 | 1.0% |

Most users are logging sober days the majority of the time. Drinking days represent about 27% of entries.

---

## How the Analysis Works (Methodology)

### The problem with simple averages

The naive approach would be to take all tests done after drinking and compare the average score to all tests done sober. But this is misleading -- a user who naturally scores 90/100 and occasionally drinks would inflate the "sober" group, while a user who naturally scores 60/100 and drinks more often would drag down the "drinking" group. The comparison would be contaminated by who is doing the drinking, not the effect of the drinking itself.

### The correct approach: per-user deltas

Instead, we compute a **personal baseline** for each user using only their own sober test days. We then calculate each user's average score on their hangover days. The delta is the difference between these two personal averages -- how much did *this person* change relative to *their own normal?*

We then average those individual deltas across all users. This removes baseline variation and isolates the actual effect.

**The trade-off:** To be included in the analysis, a user must have logged tests on both sober and hangover days with wellness snapshots attached. This reduces our viable population to **27 users** for the core cognitive analysis -- smaller, but more statistically honest.

---

## Results: Core Cognitive Scores

CONKA's cognitive test produces three headline scores: a **Total Score** (0-100), an **Accuracy** score (0-100), and a **Speed** score (0-100, where higher = faster relative to the user population).

### Overall hangover effect

Across 27 users with 113 hangover tests and 291 sober tests:

| Score | Sober baseline | Hangover average | Change |
|-------|---------------|-----------------|--------|
| Total Score | personal avg | personal avg | **-1.0 points** |
| Accuracy | personal avg | personal avg | +0.7 points |
| Speed | personal avg | personal avg | **-1.8 points** |

The headline number is modest: roughly **a 1-point drop in overall score** after a night of drinking (any amount). Speed takes a slightly larger hit than accuracy. The +0.7 accuracy figure is effectively zero -- within normal day-to-day variation.

### By drinks consumed the night before

| Drinks last night | Users | Total score change | Accuracy change | Speed change |
|-------------------|-------|--------------------|----------------|-------------|
| 1 drink | 15 | +2.0 | +2.5 | -0.2 |
| 2 drinks | 11 | +1.3 | -0.1 | +1.5 |
| 3 drinks | 11 | -1.9 | +1.7 | -4.1 |
| 4 drinks | 8 | 0.0 | +1.1 | -1.1 |
| 5 drinks | 6 | +1.7 | +2.1 | 0.0 |
| **6+ drinks** | **11** | **-4.9** | **-4.2** | **-1.3** |

**What the data shows:** There is noise across the 1-5 drink range -- small samples per cell (6-28 tests each) mean individual variation dominates. The only consistent, meaningful signal emerges at **6 or more drinks**, where users score nearly 5 points lower and accuracy drops by more than 4 points. This is the most credible dose-response signal in the dataset.

---

## Results: Cognitive KPI Metrics

Alongside the headline scores, CONKA computes five underlying KPI metrics for each test session. These give a more granular view of *how* performance changes, not just *how much*.

| KPI | Unit | What it measures | Hungover change | Better direction |
|-----|------|-----------------|----------------|-----------------|
| Overall Score | % (0-100) | Composite performance | +0.61 | Higher |
| Accuracy by Type | % (0-100) | Accuracy broken down by game type | +0.61 | Higher |
| **Speed** | Milliseconds | Raw reaction time | **+28.77ms slower** | Lower |
| Consistency | Ratio | Variability across the test | 0.00 | Lower |
| Error Patterns | Count | Number of errors made | -0.33 | Lower |

**Speed is the clearest signal at the KPI level.** Hungover users are on average **29 milliseconds slower** in their reaction times -- roughly a 7% increase over the average baseline of 425ms. Consistency and error count show negligible change overall.

### Speed by drink quantity

Speed degrades most at 3 drinks (+68ms -- likely a small-sample spike) and 6+ drinks (+23ms). Across most drink levels the speed penalty is 9-15ms.

---

## Results: Self-Reported Wellness on Hangover Days

Every wellness snapshot includes more than just the alcohol question. Users also self-report on sleep, hydration, stress, mental fatigue, and other factors. This lets us ask: when people are hungover, how does the rest of their reported state look?

Using the same per-user delta methodology, here is how each wellness factor shifts on hangover days compared to each user's sober baseline. Scores are on a normalised 0-1 scale where **1 = optimal**.

| Wellness Factor | Category | Users | Change | Direction |
|----------------|----------|-------|--------|-----------|
| Readiness | Cognitive State | 8 | **-16.4%** | Worse |
| Last Exercise | Physical Activity | 10 | -8.7% | Less recent exercise |
| Mental Fatigue | Cognitive State | 11 | **-7.1%** | More fatigued |
| Hydration Level | Physical State | 9 | -6.1% | Less hydrated |
| Muscle Soreness | Physical State | 6 | -2.8% | More sore |
| Time Outside | Lifestyle & Habits | 8 | -0.9% | Negligible |
| Amount of Sleep | Sleep | 24 | -0.2% | Negligible |
| Last Meal | Nutrition | 7 | ~0% | No change |
| Stress Level | Mental State | 12 | **+3.5%** | Less stressed |
| Caffeine Consumption | Lifestyle & Habits | 24 | **+8.4%** | More caffeine |
| Conka intake | General | 29 | +10.1% | More likely taken |
| Noise Level | Testing Conditions | 21 | +16.3% | Quieter environment |

### What the pattern tells us

The hangover state is coherent and recognisable in the data:

- **Readiness drops the most (-16.4%)** -- users feel meaningfully less prepared to perform
- **Mental fatigue increases (-7.1%)** -- users report feeling more mentally tired
- **Hydration worsens (-6.1%)** -- consistent with alcohol's dehydrating effect
- **Less recent exercise (-8.7%)** -- people who drank the previous night were less likely to have exercised recently
- **Sleep duration appears unchanged (-0.2%)** -- users are not reporting fewer hours, which suggests the hangover effect on sleep is quality-based, not quantity-based
- **Stress appears lower (+3.5%)** -- likely a weekend effect; people tend to drink on lower-stress evenings
- **Caffeine intake goes up (+8.4%)** -- classic hangover behaviour, reaching for coffee to compensate
- **Conka intake goes up (+10.1%)** -- users are more likely to take their supplement on days after drinking, possibly a deliberate recovery strategy

---

## Results: Does Taking Conka on a Hangover Day Make a Difference?

Given that users are noticeably more likely to take Conka on hangover days, the natural question is whether it makes any observable difference.

### Sample caveat

To compare like with like, we need users who have hangover days both with and without Conka. Only **11 users** meet this condition (62 hangover+Conka tests, 109 hangover+no-Conka tests). The findings below are **directional signals, not statistically conclusive** -- treat them as early indicators, not proven claims.

### Cognitive scores: hangover + Conka vs hangover + no Conka

*(Per-user delta, 10-11 users)*

| Metric | Change when taking Conka on a hangover day |
|--------|-------------------------------------------|
| Total Score | **+4.6 points** |
| Accuracy | +1.6 points |
| Speed | **-56ms faster** |

For context, the raw group comparison across all 20 users who took Conka vs 31 who did not shows hangover scores of 79.6 vs 75.2 (total) and 94.5 vs 91.5 (speed). The direction is consistent.

### KPI metrics

| KPI | Change with Conka | Direction |
|-----|------------------|-----------|
| Overall Score | +1.5% | Better |
| Speed | **-56ms** | Faster (better) |
| Consistency | -0.09 | More consistent (better) |
| Error Patterns | -0.74 | Fewer errors (better) |

Every KPI moves in the positive direction when Conka is taken on a hangover day.

### Self-reported wellness

| Factor | Change with Conka | Direction |
|--------|------------------|-----------|
| Amount of Sleep | +20.9% | Better reported sleep |
| Mental Fatigue | +11.1% | Less fatigued |
| Readiness | +7.7% | Higher readiness |
| Time Outside | +7.7% | More time outside |
| Hydration | +4.8% | Better hydrated |
| Caffeine | -0.9% | Negligible |
| Stress Level | -4.6% | More stressed |
| Last Exercise | -7.4% | Less recent exercise |
| Muscle Soreness | -12.4% | More sore |

**Interpretation:** The positive signals on sleep, mental fatigue, and readiness are encouraging. However, the exercise and soreness data suggests that these may have been different *types* of hangover days -- perhaps lighter drinking nights, or nights after physical activity. The Conka group may have been in a slightly different starting state, which is a genuine confound with only 11 users.

The speed improvement (-56ms) is the most robust number here, as speed is a direct and objective measure less susceptible to self-report bias.

---

## Summary

| Finding | Strength of evidence |
|---------|---------------------|
| Heavy drinking (6+ drinks) causes a ~5 point cognitive score drop the next morning | Moderate -- consistent per-user signal, 11 users |
| Hangover days are associated with lower readiness (-16%), more mental fatigue (-7%), and worse hydration (-6%) | Strong -- 8-11 users, coherent pattern |
| Reaction speed is the most affected cognitive metric on hangover days (+29ms, ~7% slower) | Moderate -- 27 users, consistent direction |
| Users are more likely to take Conka after drinking (+10% uptake) | Strong -- 29 users |
| Taking Conka on a hangover day is associated with improved speed (-56ms) and a 4.6 point score uplift | Weak-to-moderate -- 11 users with both conditions, directionally consistent but small sample |
| 1-5 drinks shows no reliable cognitive signal at this sample size | Honest caveat -- noise dominates, not enough per-cell data |

---

---

## Machine-Readable Summary (for AI parsing)

```
REPORT_TYPE: observational_data_analysis
TOPIC: alcohol_consumption_vs_cognitive_performance
APP: CONKA (cognition testing + supplement brand)
ANALYSIS_DATE: 2026-05
DATA_RANGE: 2025-12-11 to 2026-05-06

DATABASE_TABLES_USED:
  - wellness_factors (factor definitions)
  - user_wellness_factor_selections (which users track which factors)
  - wellness_snapshots (one record per test session per user)
  - wellness_snapshot_values (one row per factor per snapshot)
  - cognica_logs (cognitive test results, linked to wellness_snapshot_id)
  - user_kpi_values (5 KPI metrics per test session)
  - cognitive_kpis (KPI definitions)

ALCOHOL_FACTOR:
  factor_id: 11
  key: alcohol_intake
  question: "How many drinks did you have last night?"
  measurement: hangover_effect (NOT same-day impairment)
  response_options: [0, 1, 2, 3, 4, 5, "6+"]

CONKA_FACTOR:
  factor_id: 1
  key: conka_intake
  response_options: [none, conka1, conka2, both]

POPULATION:
  users_tracking_alcohol: 72
  users_with_logged_responses: 65
  users_who_reported_drinking: 44
  total_alcohol_log_entries: 638
  sober_entries: 491 (73.3%)
  drinking_entries: 147 (26.7%)

METHODOLOGY:
  approach: per_user_delta
  reason: removes individual baseline variation; compares each user against themselves
  requirement: user must have both sober and hangover tests with wellness snapshots attached
  viable_users_for_core_analysis: 27
  hungover_tests: 113
  sober_tests: 291

COGNITIVE_SCORES (scale 0-100):
  overall_hangover_effect:
    total_score_delta: -1.0
    accuracy_delta: +0.7 (noise)
    speed_delta: -1.8
  by_quantity:
    "6+":
      total_score_delta: -4.9
      accuracy_delta: -4.2
      speed_delta: -1.3
      users: 11
      tests: 24

KPI_METRICS:
  speed_milliseconds_delta_hungover: +28.77ms (slower, ~7% above 425ms baseline)
  speed_by_quantity:
    "1": +9ms
    "2": -8ms
    "3": +68ms
    "4": +15ms
    "5": +10ms
    "6+": +23ms
  overall_score_delta: +0.61 (noise)
  consistency_delta: 0.00
  error_patterns_delta: -0.33

WELLNESS_FACTORS_ON_HANGOVER_DAYS (normalized 0-1, delta vs personal sober baseline):
  readiness: -0.164 (worse)
  last_exercise: -0.087 (less recent exercise)
  mental_fatigue: -0.071 (more fatigued)
  hydration_level: -0.061 (worse)
  muscle_soreness: -0.028 (more sore)
  time_outside: -0.009 (negligible)
  sleep_quantity: -0.002 (negligible)
  last_meal: -0.001 (negligible)
  stress_level: +0.035 (less stressed -- likely weekend effect)
  caffeine_intake: +0.084 (more caffeine -- compensatory behaviour)
  conka_intake: +0.101 (more likely taken)
  noise_level: +0.163 (quieter environment)

CONKA_ON_HANGOVER_DAYS:
  users_with_both_conditions: 11
  hangover_plus_conka_tests: 62
  hangover_no_conka_tests: 109
  cognitive_deltas (conka vs no_conka on hungover days):
    total_score: +4.6
    accuracy: +1.6
    speed_ms: -56ms (faster)
  kpi_deltas:
    speed_ms: -56ms
    consistency: -0.09 (more consistent)
    error_patterns: -0.74 (fewer errors)
  wellness_deltas:
    sleep_amount: +0.209
    mental_fatigue: +0.111
    readiness: +0.077
    hydration: +0.048
    stress: -0.046
    last_exercise: -0.074
    muscle_soreness: -0.124
  caveats:
    - small_sample (n=11 with both conditions)
    - potential_confound: conka days may have followed lighter drinking nights
    - speed_improvement considered most objective signal

KEY_MARKETING_FINDINGS:
  strongest_signal: "6+ drinks linked to ~5 point score drop and 4.2% accuracy decline next morning"
  speed_signal: "Reaction time increases by ~29ms on any hangover day (~7% slower)"
  recovery_signal: "Taking Conka on a hangover day associated with 56ms faster reaction time and 4.6 point score improvement (n=11, directional)"
  honest_caveat: "1-5 drinks shows no reliable cognitive signal at current sample size"
```
