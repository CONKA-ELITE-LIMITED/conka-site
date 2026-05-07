# Mental Fatigue, Readiness, and Cognitive Performance: A CONKA App Data Report

**Analysis date:** May 2026
**Data range:** November 2024 -- May 2026
**Prepared from:** CONKA app user data (PostgreSQL)

---

## What This Report Is

Most people have had the experience of sitting down to do something important -- a work problem, a decision, a test -- and feeling like the gears are turning slowly. The question this report answers is: does that feeling reflect something real? And if your brain is running below its best, does taking Conka change the picture?

We used data from CONKA app users who log their mental state before every cognitive test. Before each test, users optionally rate two things: how mentally fatigued they currently feel, and how ready they feel to perform. We then compare those self-ratings against their actual test scores -- and separately look at whether taking Conka on those same low-state days is associated with any difference in performance.

This is observational data from real users in natural conditions -- not a clinical trial. We can identify consistent associations, not prove cause and effect. With 500+ users and thousands of data points spanning 18 months, the patterns are robust enough to be meaningful.

---

## How the Data Works

### Mental Fatigue

Before each test, users answer: *"How is your mental fatigue right now?"* The responses run from "sharp and focused" at one end to "severe mental fatigue" at the other. Each response is assigned a normalised score from 0 to 1, where 1 is optimal (no fatigue) and 0 is worst (severe fatigue):

| Response | Normalised score |
|----------|-----------------|
| Sharp and focused / No mental fatigue | 1.00 |
| Mild mental fatigue | 0.75 |
| Little foggy | 0.73 |
| Quite tired / Moderate mental fatigue | 0.50-0.53 |
| Mentally exhausted | 0.30 |
| Severe mental fatigue | 0.00 |

The normalisation is time-of-day aware -- feeling foggy at 7am means something different than at 3pm.

### Readiness

Users also answer: *"How ready do you feel right now?"* Three options: "Not feeling best" (0.25), "Good to go" (0.75), "Peak" (1.00).

### How the analysis works

We use a per-user delta approach. For each user, we calculate their personal average score on low-state days (fatigued or not feeling best) and compare it to their personal average on fresh/peak days. We average those individual deltas across all users.

This removes the confound of natural ability -- a user who naturally scores 90 and occasionally feels tired should not inflate the "tired" group, and a user who naturally scores 60 and is always fresh should not drag down the "fresh" group. The question is: how much does *your* score change relative to *your own normal* when your mental state changes?

To be included, a user must have tests in both conditions. This is the conservative requirement that keeps the analysis honest.

---

## The Data

| Metric | Mental Fatigue | Readiness |
|--------|---------------|-----------|
| Users with logged data | 501 | 479 |
| Total entries logged | 6,282 | 5,918 |
| Data range | Nov 2024 -- May 2026 | Nov 2024 -- May 2026 |
| Users in delta analysis | 260 | 224 |
| Impaired-state tests analysed | 1,248 | 878 |

### How users typically feel when testing

Most people test in a reasonable state -- the impaired-day data is real-world, not artificially induced:

**Mental Fatigue distribution:**
- Fresh (no fatigue / sharp): 28.7% of tests
- Mild fatigue: 40.9%
- Moderate fatigue (moderate / quite tired / little foggy): 26.0%
- Severe / exhausted: 4.4%

**Readiness distribution:**
- Good to go: 68.7%
- Not feeling best: 21.3%
- Peak: 10.1%

---

## Part 1: The Problem -- How Mental State Impairs Cognition

### Mental Fatigue

Comparing each user's fatigued tests (normalised < 0.75, covering moderate through severe fatigue) against their own fresh baseline (mild or better):

| Metric | Change when mentally fatigued |
|--------|-------------------------------|
| Total Score | **-1.8 points** |
| Accuracy | -0.7 points |
| Speed | **-1.5 points** |

*260 users, 1,248 fatigued tests vs personal fresh baseline.*

**Dose-response -- the deeper you go, the more it costs:**

| Fatigue level | Users | Tests | Score change | Accuracy change | Speed change |
|---------------|-------|-------|-------------|----------------|-------------|
| Moderate | 245 | 990 | -1.5 | -0.5 | -1.4 |
| Severe | 73 | 199 | -1.6 | -0.8 | -1.2 |
| Mentally exhausted | 26 | 59 | **-2.6** | **-1.7** | -1.0 |

The "mentally exhausted" signal is the most striking: a 2.6 point score drop and 1.7 point accuracy decline. Note the sample is smaller here (26 users, 59 tests) -- treat as directional.

**KPI breakdown -- what actually degrades:**

*Fatigued vs personal fresh baseline, 123 users with KPI data:*

| KPI | Unit | Change | What it means |
|-----|------|--------|--------------|
| Overall Score | % | -1.3% | Worse |
| Speed | milliseconds | **+24ms slower** | ~6% above baseline reaction time |
| Consistency | ratio | +0.01 | Slightly less consistent |
| Error Patterns | count | +0.62 | More errors per session |

Speed is the most sensitive metric to mental fatigue. On fatigued days, reaction time increases by around 24 milliseconds -- about a 6% degradation against the population baseline of 425ms. The errors and consistency signals are present but smaller.

**The honest nuance:** At the individual level, how fatigued you feel is a weak predictor of your absolute score in any single session (population-level Pearson r = 0.054). Performance has many inputs -- sleep, stress, time of day, noise, natural variability. The per-user delta analysis tells a more meaningful story: on your own worst fatigue days, you reliably underperform your own baseline. The effect is real but modest, and mental fatigue is one factor among several.

---

### Readiness

Comparing each user's "not feeling best" tests against their own "good to go" and "peak" baseline:

| Metric | Change when not feeling best |
|--------|------------------------------|
| Total Score | **-1.5 points** |
| Accuracy | -0.6 points |
| Speed | **-1.2 points** |

*224 users, 878 low-readiness tests.*

**Dose-response -- readiness predicts performance in order:**

*Users who have "peak" readiness tests as their personal ceiling:*

| Readiness level | Users | Tests | vs peak: Score | vs peak: Accuracy | vs peak: Speed |
|-----------------|-------|-------|---------------|-----------------|---------------|
| Good to go | 111 | 1,606 | -1.2 | -0.3 | -1.1 |
| Not feeling best | 78 | 395 | **-2.7** | **-1.0** | **-1.7** |

The ordering is clean: peak > good to go > not feeling best. Users who report not feeling their best score 2.7 points below their own peak days -- nearly twice the gap of "good to go."

**KPI breakdown:**

*Low-readiness vs high-readiness, 92 users with KPI data:*

| KPI | Unit | Change | What it means |
|-----|------|--------|--------------|
| Overall Score | % | -0.9% | Worse |
| Speed | milliseconds | **+27ms slower** | ~6% above baseline |
| Consistency | ratio | +0.01 | Slightly less consistent |
| Error Patterns | count | +0.43 | Slightly more errors |

The pattern mirrors mental fatigue almost exactly. Speed is again the most measurable KPI signal.

**Are users accurate about their own readiness?** The data says yes. The dose-response (peak > good to go > not feeling best) is consistent across 224 users. Users' gut sense of their own readiness is not random -- it reliably captures something real about their cognitive state on that day.

---

## Part 2: Conka's Role -- Does It Make a Difference on Impaired Days?

### Sample context

To compare "fatigued + took Conka" against "fatigued + did not take Conka" using the rigorous per-user method, we need users who have fatigued days both with and without Conka. That gives us:

- **Mental Fatigue:** 15 users with both conditions (82 Conka tests, 1,247 non-Conka tests)
- **Readiness:** 10 users with both conditions (29 Conka tests, 1,016 non-Conka tests)

These are small samples. The findings below are **directional signals** -- early evidence consistent with a meaningful effect, not a proven claim. We also include the raw group comparison across all users for context.

---

### Mental Fatigue: Fatigued days with vs without Conka

**Raw group comparison** *(all users -- more data, less rigorous because users differ)*:

| Group | Users | Tests | Avg total score | Avg accuracy | Avg speed |
|-------|-------|-------|----------------|-------------|----------|
| Fatigued, no Conka | 313 | 1,247 | 79.4 | 84.6 | 93.8 |
| Fatigued, took Conka | 21 | 82 | **82.2** | **85.1** | **96.6** |
| Difference | | | **+2.8** | +0.5 | +2.8 |

**Per-user delta** *(15 users with both conditions -- more rigorous)*:

| Metric | Change on fatigued days when taking Conka |
|--------|------------------------------------------|
| Total Score | **+2.0 points** |
| Accuracy | -0.8 points |
| Speed | **+3.1 points** |

**KPI breakdown** *(14 users, per-user delta)*:

| KPI | Unit | Change with Conka | Direction |
|-----|------|------------------|-----------|
| Overall Score | % | -1.1% | Mixed |
| Speed | milliseconds | **-41ms faster** | Better |
| Consistency | ratio | -0.01 | More consistent (better) |
| Error Patterns | count | +0.54 | Slightly more errors |

The speed signal is the most consistent finding: on fatigued days, users who took Conka reacted 41ms faster than their own fatigued-but-no-Conka days. The overall score is mixed across methods -- some metrics move in opposite directions between the score analysis and KPI analysis, which reflects noise at this sample size. The speed improvement is the number to lead with.

---

### Readiness: Low-readiness days with vs without Conka

**Raw group comparison:**

| Group | Users | Tests | Avg total score | Avg accuracy | Avg speed |
|-------|-------|-------|----------------|-------------|----------|
| Low readiness, no Conka | 284 | 1,016 | 78.9 | 83.6 | 94.1 |
| Low readiness, took Conka | 13 | 29 | **84.7** | **88.5** | **95.9** |
| Difference | | | **+5.8** | +4.9 | +1.8 |

**Per-user delta** *(10 users with both conditions)*:

| Metric | Change on low-readiness days when taking Conka |
|--------|------------------------------------------------|
| Total Score | **+2.1 points** |
| Accuracy | -1.1 points |
| Speed | **+3.7 points** |

The raw group comparison shows a striking 5.8 point difference. This is likely inflated by the small Conka group (13 users who may have been in a better underlying state), but the directional signal is consistent with the per-user delta. Both methods agree: on days when users feel unprepared, taking Conka is associated with higher scores. The per-user delta, being more conservative, puts the uplift at around 2 points.

---

### How to read these findings

The problem is clearly established: mental fatigue and low readiness are each associated with ~1.5-2.7 point personal score drops and meaningfully slower reaction times. This is consistent, replicated across two factors, and covers hundreds of users.

The Conka signal is promising: both analyses point in the same direction (+2.0-2.1 points, -41ms faster on fatigued days), but the per-user samples are small (10-15 users). The speed improvement on fatigued days (-41ms) is the most objective number, and is consistent with the broader pattern seen in the alcohol analysis (where Conka was associated with -56ms faster reaction time on hangover days).

---

## Summary

| Finding | Strength |
|---------|---------|
| Mental fatigue (any level) associated with -1.8 pt personal score drop | **Strong** -- 260 users, 1,248 tests, consistent |
| "Mentally exhausted" associated with -2.6 pt drop | **Moderate** -- 26 users, directional |
| Speed most affected KPI on fatigued days (+24ms, ~6% slower) | **Strong** -- 123 users, consistent |
| Low readiness ("not feeling best") associated with -2.7 pt drop vs own peak | **Strong** -- 78 users, 395 tests, clean dose-response |
| Speed most affected KPI on low-readiness days (+27ms, ~6% slower) | **Strong** -- 92 users, consistent |
| Conka on fatigued days associated with +2.0 pt score uplift | **Early signal** -- 15 users with both conditions |
| Conka on fatigued days associated with -41ms faster reaction time | **Early signal** -- 14 users, most objective metric |
| Conka on low-readiness days associated with +2.1 pt score uplift | **Early signal** -- 10 users with both conditions |

---

---

## Machine-Readable Summary (for AI parsing)

```
REPORT_TYPE: observational_data_analysis
TOPIC: mental_fatigue_and_readiness_vs_cognitive_performance_with_conka_mitigation
APP: CONKA (cognition testing + supplement brand)
ANALYSIS_DATE: 2026-05
DATA_RANGE: 2024-11-12 to 2026-05-06

FACTORS:
  mental_fatigue:
    factor_id: 4
    direction: negative (1.0 = optimal/no fatigue, 0.0 = worst/severe)
    normalization: custom time-of-day-aware function
    users_with_data: 501
    total_entries: 6282
    threshold_fatigued: normalized_value < 0.75
    threshold_fresh: normalized_value >= 0.75

  readiness:
    factor_id: 6
    direction: positive (1.0 = peak, 0.25 = not feeling best)
    normalization: step_function
    users_with_data: 479
    total_entries: 5918
    threshold_low: normalized_value < 0.75
    threshold_high: normalized_value >= 0.75

CONKA_FACTOR:
  factor_id: 1
  key: conka_intake
  took_conka: raw_value != 'none'
  no_conka: raw_value = 'none' OR NULL

METHODOLOGY: per_user_delta
  requirement: user must have tests in both conditions

MENTAL_FATIGUE_PROBLEM:
  users_in_analysis: 260
  fatigued_tests: 1248
  overall_delta:
    total_score: -1.8
    accuracy: -0.7
    speed_points: -1.5
  by_severity:
    moderate (245 users, 990 tests): score -1.5, accuracy -0.5, speed -1.4
    severe (73 users, 199 tests): score -1.6, accuracy -0.8, speed -1.2
    exhausted (26 users, 59 tests): score -2.6, accuracy -1.7, speed -1.0
  kpi_deltas (123 users):
    overall_score_pct: -1.29
    speed_ms: +24.13 (slower)
    consistency: +0.01
    error_patterns: +0.62
  pearson_r_avg: 0.054 (weak -- performance is multi-factorial)

READINESS_PROBLEM:
  users_in_analysis: 224
  low_readiness_tests: 878
  overall_delta:
    total_score: -1.5
    accuracy: -0.6
    speed_points: -1.2
  by_level (vs peak baseline):
    good_to_go (111 users, 1606 tests): score -1.2, accuracy -0.3, speed -1.1
    not_feeling_best (78 users, 395 tests): score -2.7, accuracy -1.0, speed -1.7
  kpi_deltas (92 users):
    overall_score_pct: -0.87
    speed_ms: +26.98 (slower)
    consistency: +0.01
    error_patterns: +0.43

CONKA_MITIGATION_FATIGUE:
  users_with_both_conditions: 15
  conka_tests: 82
  no_conka_tests: 1247
  per_user_delta (15 users):
    total_score: +2.0
    accuracy: -0.8 (mixed)
    speed_points: +3.1
  raw_group_comparison:
    no_conka (313 users, 1247 tests): avg_total 79.4, avg_speed 93.8
    took_conka (21 users, 82 tests): avg_total 82.2, avg_speed 96.6
    raw_difference: +2.8 pts, +2.8 speed
  kpi_delta_per_user (14 users):
    overall_score_pct: -1.12 (mixed signal)
    speed_ms: -41.09 (faster -- best signal)
    consistency: -0.01 (more consistent)
    error_patterns: +0.54 (slightly worse)
  confidence: early_signal (n=15)

CONKA_MITIGATION_READINESS:
  users_with_both_conditions: 10
  conka_tests: 29
  no_conka_tests: 1016
  per_user_delta (10 users):
    total_score: +2.1
    accuracy: -1.1 (mixed)
    speed_points: +3.7
  raw_group_comparison:
    no_conka (284 users, 1016 tests): avg_total 78.9, avg_speed 94.1
    took_conka (13 users, 29 tests): avg_total 84.7, avg_speed 95.9
    raw_difference: +5.8 pts (likely inflated by small Conka group)
  confidence: early_signal (n=10)

KEY_MARKETING_FINDINGS:
  problem: "Mental fatigue linked to 1.8 pt personal score drop and 24ms slower reaction time"
  problem: "Not feeling best linked to 2.7 pt drop vs own peak days"
  conka_signal: "On fatigued days, Conka users reacted 41ms faster (14 users, directional)"
  conka_signal: "On fatigued days, Conka associated with +2 point score uplift (15 users, early signal)"

HONEST_CAVEATS:
  - "Conka mitigation samples are small (10-15 users with both conditions)"
  - "Per-user delta for accuracy is mixed -- speed is the most consistent Conka signal"
  - "Fatigue and readiness are correlated -- not fully independent signals"
  - "Individual fatigue-to-score Pearson r = 0.054 -- performance has many inputs"
```
