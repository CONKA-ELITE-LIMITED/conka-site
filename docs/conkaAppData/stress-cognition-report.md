# Stress and Cognitive Performance: A CONKA App Data Report

**Analysis date:** May 2026
**Data range:** December 2025 -- May 2026
**Prepared from:** CONKA app user data (PostgreSQL)

---

## What This Report Is

Stress is often treated as a productivity problem -- something that affects your mood, your sleep, your relationships. What it does to your actual cognitive performance in the moment is less often talked about. This report looks at what happens to measurable brain performance when users are under stress, and asks whether taking Conka on those days makes any difference.

We used data from CONKA app users who log their stress level before each cognitive test. Before every test, users optionally rate their current stress: no stress, mild, moderate, high, or severe. We compare those self-ratings against their actual test scores -- and then look at the subset of stressed days where users did or did not take Conka.

This is observational data from real users in natural conditions, not a clinical trial. With 93 users and nearly 900 data points, the problem-side signal is clear. The Conka-side data is thinner -- we are transparent about that below.

---

## How the Data Works

### The stress question

Before each test, users answer: *"What is your current stress level?"* Five options from no stress to severe. Each maps to a normalised score from 0 to 1, where 1 is optimal (no stress) and 0 is worst (severe stress). The normalisation is time-of-day aware:

| Response | Normalised score | % of all entries |
|----------|-----------------|-----------------|
| No stress | 1.00 | 28.8% |
| Mild stress | 0.73 | 53.1% |
| Moderate stress | 0.48 | 15.7% |
| High stress | 0.21 | 1.3% |
| Severe stress | 0.02 | 1.0% |

Most users are in a mild stress state when they test -- the background hum of everyday life. The moderate-to-severe group (18%) represents meaningfully elevated stress, and that is where the signal is clearest.

### How the analysis works

Per-user delta methodology: for each user, we compute their personal average score on stressed days and compare it to their personal average on no-stress days. We average those individual deltas across all users.

This removes individual ability differences -- a naturally high-performing user who sometimes feels stressed should not drag down or inflate the group. The question is: how much does *your* score change relative to *your own no-stress baseline* when you are under stress?

To be included, a user must have tests logged in both conditions. For the core stressed-vs-baseline analysis, we used moderate stress or above (normalised score ≤ 0.5) as the impaired group, and no stress (normalised = 1.0) as the clean baseline.

---

## The Data

| Metric | Value |
|--------|-------|
| Users with stress logged | 96 |
| Users with stress data linked to a cognitive test | 93 |
| Total stress entries | 891 |
| Data range | Dec 2025 -- May 2026 |
| Users in per-user delta analysis (stressed vs no-stress) | 12 |
| Stressed tests in analysis | 44 |

The smaller number of users in the per-user delta (12) reflects the conservative requirement: a user must have both stressed and no-stress test days to be included. Many users who track stress have only logged mild or no-stress days.

---

## Part 1: The Problem -- How Stress Impairs Cognition

### Overall effect

Comparing each user's moderate-to-severe stress tests (normalised ≤ 0.5) against their own no-stress baseline:

| Metric | Change under moderate/severe stress |
|--------|-------------------------------------|
| Total Score | **-3.8 points** |
| Accuracy | **-2.2 points** |
| Speed | **-2.7 points** |

*12 users, 44 stressed tests vs personal no-stress baseline.*

This is the largest effect size across all three reports in this series. A nearly 4-point personal score drop on stressed days is more than double the mental fatigue effect (-1.8 pts) and significantly larger than the readiness effect (-1.5 pts).

### Dose-response -- more stress, more damage

| Stress level | Users | Tests | Score change | Accuracy change | Speed change |
|-------------|-------|-------|-------------|----------------|-------------|
| Mild | 35 | 238 | -1.8 | -0.6 | -2.1 |
| Moderate | 18 | 58 | **-5.4** | **-2.7** | **-3.6** |
| High | 3 | 8 | **-7.6** | **-6.6** | -1.3 |
| Severe | 2 | 4 | +3.1 | +3.2 | 0.0 |

The dose-response is clear through mild, moderate, and high stress. Moderate stress alone is associated with a 5.4 point personal score drop -- nearly a 7% degradation from personal baseline. High stress pushes that to 7.6 points.

The severe stress result (+3.1) is a statistical artefact: only 2 users, 4 tests. Too small to draw any conclusion -- do not read it as "severe stress improves performance."

The mild stress signal (-1.8 pts) is meaningful in its own right: 53% of all test sessions are taken under mild stress. The cumulative cognitive cost of everyday background stress -- modest per session but persistent -- is the most practically significant finding in this dataset.

### KPI breakdown -- what stress actually does to the brain

*Stressed (moderate/severe) vs personal no-stress baseline, 12 users:*

| KPI | Unit | Change under stress | What it means |
|-----|------|---------------------|--------------|
| Overall Score | % | **-2.2%** | Worse |
| Speed | milliseconds | **+41ms slower** | ~10% above baseline reaction time |
| Consistency | ratio | +0.06 | Meaningfully less consistent |
| Error Patterns | count | **+1.05** | One extra error per session |

Speed and consistency take the largest KPI hits. On stressed days, reaction time increases by 41 milliseconds -- roughly a 10% degradation against the population baseline of 425ms. Consistency worsens by 0.06 points on the ratio scale, suggesting stress introduces erratic variation into performance beyond just slowing it down. Users also make on average one additional error per session.

Stress does not just slow you down. It makes you less consistent and less accurate -- a broader degradation than fatigue or low readiness, both of which mainly show up in speed.

### Stress compounds other factors

Stress rarely arrives alone. On days when users report moderate or higher stress, the same wellness snapshots reveal a coherent broader pattern: mental fatigue is slightly elevated, sleep quality tends to be reduced, and hydration is lower. The cognitive cost shown above is likely a combined effect -- stress as the primary signal, amplified by the other factors it tends to bring with it. The data cannot separate these contributions cleanly, which is the honest caveat.

---

## Part 2: Conka's Role -- Does It Make a Difference on Stressed Days?

### The data limitation upfront

To run a rigorous per-user comparison (stressed + Conka vs stressed + no Conka, within the same users), we need users who have stressed days both with and without Conka. Only **3 users** meet this condition -- below the threshold for a reportable per-user delta.

What we have instead is a raw group comparison: 7 users who took Conka on stressed days vs 21 users who did not. These are different people, so the comparison is confounded by natural ability differences. Read accordingly.

### Raw group comparison on stressed days

*(All users -- 7 vs 21 -- different people, not controlled)*

| Group | Users | Tests | Avg total score | Avg accuracy | Avg speed |
|-------|-------|-------|----------------|-------------|----------|
| Stressed, no Conka | 21 | 42 | 80.0 | 85.3 | 93.5 |
| Stressed, took Conka | 7 | 28 | **89.1** | **89.4** | **99.7** |
| Difference | | | **+9.1** | **+4.1** | **+6.2** |

**KPI comparison on stressed days:**

| KPI | Unit | No Conka | With Conka | Difference |
|-----|------|----------|-----------|-----------|
| Overall Score | % | 85.4 | 89.3 | +3.9% |
| Speed | milliseconds | 434.5ms | **327.9ms** | **-107ms faster** |
| Consistency | ratio | 0.30 | 0.20 | More consistent |
| Error Patterns | count | 7.0 | **5.1** | **-1.9 fewer errors** |

The differences are large -- particularly the speed gap (107ms) and error reduction (1.9 per session). However, **these numbers should not be cited as a Conka effect.** With only 7 vs 21 users and no way to compare individuals against themselves, the gap most likely reflects the fact that these are different groups of users with different baseline abilities, not a controlled effect of the supplement.

### What this section tells us

The direction of these numbers is consistent with what we see in the fatigue and alcohol reports -- where controlled comparisons (per-user delta) do show meaningful Conka signals of +2-4 points and -40-56ms. The stress data is simply too sparse for the per-user method to work.

The honest conclusion: we cannot currently say what Conka does on stressed days from this data alone. What we can say is that the problem (stress impairs cognition by up to 5.4 points and 41ms) is well-evidenced, and the directional pattern from other reports suggests Conka warrants a closer look as cognitive stress compounds. More data, specifically users who test on stressed days both with and without Conka, would resolve this.

---

## Summary

| Finding | Strength |
|---------|---------|
| Moderate/severe stress associated with -3.8 pt personal score drop | **Moderate** -- 12 users, 44 tests, consistent direction |
| Moderate stress specifically: -5.4 pt drop | **Moderate** -- 18 users, 58 tests |
| Speed most affected KPI on stressed days (+41ms, ~10% above baseline) | **Moderate** -- 12 users, consistent |
| Stress introduces +1 extra error per session and measurably worse consistency | **Moderate** -- 12 users |
| Mild stress (53% of all sessions): -1.8 pt persistent background cost | **Strong** -- 35 users, 238 tests |
| Conka on stressed days: raw gap of +9.1 pts, -107ms | **Confounded** -- different users, not per-user controlled, do not cite as causal |
| Per-user Conka mitigation on stressed days | **Insufficient data** -- only 3 users with both conditions |

---

---

## Machine-Readable Summary (for AI parsing)

```
REPORT_TYPE: observational_data_analysis
TOPIC: stress_vs_cognitive_performance_with_conka_signal
APP: CONKA (cognition testing + supplement brand)
ANALYSIS_DATE: 2026-05
DATA_RANGE: 2025-12-11 to 2026-05-06

FACTOR:
  stress_level:
    factor_id: 12
    direction: negative (1.0 = optimal/no stress, 0.0 = worst/severe stress)
    normalization: custom time-of-day-aware function
    users_with_data: 96
    users_with_linked_tests: 93
    total_entries: 891
    response_distribution:
      none: 28.8% (norm: 1.00)
      mild: 53.1% (norm: ~0.73)
      moderate: 15.7% (norm: ~0.48)
      high: 1.3% (norm: ~0.21)
      severe: 1.0% (norm: ~0.02)

CONKA_FACTOR:
  factor_id: 1
  took_conka: raw_value != 'none'

METHODOLOGY:
  approach: per_user_delta
  stressed_threshold: normalized_value <= 0.5 (moderate through severe)
  baseline_threshold: normalized_value = 1.0 (no stress only)
  requirement: user must have tests in both conditions

STRESS_PROBLEM:
  users_in_analysis: 12
  stressed_tests: 44
  overall_delta (moderate/severe vs no-stress):
    total_score: -3.8
    accuracy: -2.2
    speed_points: -2.7
  by_level (vs no-stress personal baseline):
    mild (35 users, 238 tests): score -1.8, accuracy -0.6, speed -2.1
    moderate (18 users, 58 tests): score -5.4, accuracy -2.7, speed -3.6
    high (3 users, 8 tests): score -7.6, accuracy -6.6, speed -1.3
    severe (2 users, 4 tests): score +3.1 -- NOISE, too small to interpret
  kpi_deltas (12 users, moderate/severe vs no-stress):
    overall_score_pct: -2.15
    speed_ms: +40.90 (slower)
    consistency: +0.06 (less consistent)
    error_patterns: +1.05 (more errors)
  notable: stress effect (-3.8 pts) is larger than fatigue (-1.8) and readiness (-1.5)
  notable: mild stress persists across 53% of all test sessions

CONKA_MITIGATION:
  users_with_both_conditions: 3
  per_user_delta: NOT_REPORTABLE (below minimum threshold of 10)
  raw_group_comparison:
    no_conka (21 users, 42 tests): avg_total 80.0, avg_acc 85.3, avg_speed 93.5
    took_conka (7 users, 28 tests): avg_total 89.1, avg_acc 89.4, avg_speed 99.7
    raw_difference: +9.1 pts total, +4.1 acc, +6.2 speed
  kpi_raw_comparison:
    speed_ms: 434.5ms (no_conka) vs 327.9ms (conka) -- diff -106.6ms
    consistency: 0.30 vs 0.20 -- diff -0.07
    error_patterns: 7.0 vs 5.1 -- diff -1.86
  confidence: CONFOUNDED -- different user groups, not per-user controlled
  caution: do NOT cite raw group difference as a Conka effect

KEY_MARKETING_FINDINGS:
  problem: "Moderate stress linked to 5.4 pt personal score drop and 41ms slower reaction time"
  problem: "53% of all cognitive tests taken under mild stress -- background cognitive cost"
  problem: "Stress degrades consistency and increases errors, not just speed"
  conka_signal: "Raw data direction consistent with other reports but insufficient for controlled claim on stress"

HONEST_CAVEATS:
  - "Per-user Conka delta not possible -- only 3 users have stressed days both with and without Conka"
  - "Raw group comparison is confounded by natural ability differences between users"
  - "Severe stress result (+3.1) is noise from 2 users -- do not interpret"
  - "High stress sample (3 users, 8 tests) is directional only"
  - "Stress compounds with fatigue, sleep, and hydration -- effect is likely multi-factorial"
```
