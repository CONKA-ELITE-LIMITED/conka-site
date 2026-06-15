# Coffee, Conka, or Both: How Each Moves Measured Cognition — A CONKA App Data Report

**Headline (all findings, for slicing):** In CONKA app users, **coffee on its own barely shifts measured cognition and is associated with slightly slower reaction times and marginally weaker response control**; the gains in total score, response control and error rate **track with Conka, not caffeine**; **Conka adds roughly +4 points to total score on top of coffee** (64% of users improve); and **coffee + Conka shows the fastest raw reaction times of any group (368ms)** — though within-person that speed gain is concentrated in a minority of users, so it is a directional signal rather than a proven effect.

**Analysis date:** June 2026
**Data range:** November 2024 — June 2026
**Prepared from:** CONKA app user data (local PostgreSQL, synced from production)

---

## What This Report Is

This report asks a question every reader recognises: *what does my coffee actually do to my brain — and does Conka do something different?* It uses real CONKA app data from users who voluntarily log both their **caffeine** and their **Conka** intake as wellness factors at the moment they take a cognitive test.

It is **not a clinical trial**. It is an observational analysis — we look at patterns in what users self-report alongside how they score, not a controlled experiment. We can identify associations, not prove cause and effect. The behaviour is naturalistic and the dataset is real, but the consumption groups are self-selected and some cells are small. Every finding below carries an explicit strength-of-evidence rating, and this document is deliberately comprehensive: it surfaces **all twelve cognitive metrics across all four consumption groups**, by two methods, so it can be sliced different ways for different audiences and pages.

---

## How the Data Works

When a user takes a cognitive test, they are optionally prompted to log a wellness snapshot. Two of those factors matter here:

- **Caffeine** (factor 3). Two question variants exist: a yes/no form (the bulk of the data) and a "how long since your last caffeine" form. We treat **any caffeine today** (yes, or any "X ago" response) as **coffee**, and "no" / "haven't had one today" as **no coffee**.
- **Conka intake** (factor 1). Responses: `none`, `conka1`, `conka2`, `both`. We treat anything other than `none` as **Conka**.

Crossing these two gives the **2×2 consumption matrix**:

| Group | Coffee | Conka |
|-------|:------:|:-----:|
| **Neither** | — | — |
| **Coffee only** | ✓ | — |
| **Conka only** | — | ✓ |
| **Coffee + Conka** | ✓ | ✓ |

### The twelve metrics

Each test produces metrics in three families, all linked to the same test record:

| Family | Source | Metrics | Scale |
|--------|--------|---------|-------|
| Headline scores | `cognica_logs` | Total Score, Accuracy, Speed score | 0–100 |
| KPI metrics | `user_kpi_values` | Overall Score, Accuracy by Type, **Reaction Speed (ms)**, Consistency, Error Patterns | mixed |
| SDK radar | `cognica_metrics` | **Focus**, **Response Control**, Speed rating, Accuracy % | Focus/Control/Speed = 1–5 |

"Response control" and "focus maintenance" are the SDK radar axes `control_score` and `focus_score`.

### Two methods — and why both matter

1. **Raw group means.** Simply average each metric within each of the four groups. Easy to read and chart, but contaminated by *who* is in each group — a naturally sharp user who happens to take Conka inflates the Conka group.
2. **Per-user (within-person) deltas.** For each user present in two groups, compute their personal average in each and take the difference, then average those differences across users. This removes individual baseline variation and isolates the within-person effect. The trade-off is sample size: a user must appear in both groups to count.

Where the two methods disagree, **the per-user delta is the more honest number** — and we flag the disagreement rather than hide it.

---

## The Data: Who Is Included

| Metric | Count |
|--------|-------|
| Users who have logged a caffeine response | 490 |
| Users who have logged a Conka response | 166 |
| Assessment tests with a wellness snapshot | 5,795 |
| Tests with **both** coffee and Conka logged (used in the 2×2) | 501 |
| Date range | Nov 2024 — Jun 2026 |

All queries exclude practice tests (`assessment = true`) and require a non-null total score.

### Group sizes (the honest constraint)

| Group | Tests | Unique users | Evidence weight |
|-------|------:|-------------:|-----------------|
| Coffee only | 199 | 53 | Solid |
| Coffee + Conka | 197 | 30 | Solid |
| Neither | 66 | 32 | Moderate |
| **Conka only (no coffee)** | **39** | **12** | **Weak — directional only** |

The "Conka only" cell is small because most users who take Conka also drink coffee. Treat any Conka-only number as a directional signal, not a finding.

---

## Part 1: Raw Group Means — All Twelve Metrics

Average of each metric within each group. Bold marks the best group for that metric.

| Metric (better direction) | Neither | Coffee only | Conka only | Coffee + Conka |
|---|---:|---:|---:|---:|
| Total Score ↑ | 80.97 | 80.60 | 85.38 | **86.44** |
| Accuracy ↑ | 86.44 | 86.38 | **89.56** | 89.02 |
| Speed score ↑ | 93.53 | 93.18 | 95.62 | **97.12** |
| KPI Overall Score (%) ↑ | 86.36 | 86.33 | **89.38** | 88.83 |
| KPI Accuracy by Type (%) ↑ | 86.36 | 86.33 | **89.38** | 88.83 |
| KPI Reaction Speed (ms) ↓ | 424.65 | 429.79 | 397.87 | **368.40** |
| KPI Consistency (ratio) ↓ | 0.25 | 0.24 | **0.20** | 0.22 |
| KPI Error Patterns (count) ↓ | 6.57 | 6.60 | **5.10** | 5.38 |
| Focus (1–5) ↑ | 3.49 | 3.61 | **3.72** | 3.58 |
| Response Control (1–5) ↑ | 4.15 | 4.19 | 4.38 | **4.39** |
| Speed rating (1–5) ↑ | 2.71 | 2.95 | 2.95 | **3.05** |
| Accuracy % (SDK) ↑ | 86.36 | 86.27 | **89.38** | 88.77 |

**What jumps out:**

- **Coffee only ≈ Neither on every measured score.** Total score 80.60 vs 80.97, accuracy 86.38 vs 86.44, overall KPI 86.33 vs 86.36. On raw averages, drinking coffee looks indistinguishable from drinking nothing — and reaction time is actually 5ms *slower* (429.79 vs 424.65) and errors marginally higher.
- **Every "best" cell contains Conka.** All twelve metrics peak in either the Conka-only or Coffee+Conka group.
- **Reaction speed is the most dramatic spread:** 368ms (Coffee+Conka) vs 430ms (Coffee only) — a 61ms gap on raw averages.
- **Coffee's only standalone lift is on the subjective speed *rating*** (2.95 vs 2.71) and a small focus nudge — i.e. it *feels* faster more than it *scores* faster.

![All twelve metrics across the 2×2 (raw group means)](assets/coffee-conka/00_overview_panel.png)

*Note: y-axes in the panel are zoomed to make differences visible, so bar heights overstate the true magnitude. Read the numbers, not the bar ratios.*

---

## Part 2: Per-User Deltas — The Within-Person Truth

These remove "who is in each group" and ask: *when the same person changes their intake, what happens to their own scores?* Sample sizes are smaller and stated for every row.

### 2a. Main effects (best-powered)

**Coffee vs no coffee** (Conka ignored) — the largest, most reliable view of caffeine.

| Metric (better dir.) | Mean within-person delta | n users | % who improved |
|---|---:|---:|---:|
| Total Score ↑ | +0.23 | 222 | 57% |
| Accuracy ↑ | +0.34 | 222 | 59% |
| Speed score ↑ | −0.17 | 222 | 48% |
| KPI Reaction Speed (ms) ↓ | **+12.84 (slower)** | 104 | 58% slower |
| KPI Error Patterns ↓ | +0.28 (more) | 104 | 51% |
| Response Control ↑ | **−0.12 (worse)** | 104 | only 38% improved |
| Focus ↑ | +0.09 | 104 | 48% |

**Read:** With 104–222 users, the coffee main effect is **flat to slightly negative**. Scores don't move; reaction time gets ~13ms slower for the average person (58% slow down); response control drops for most (only 38% improve). This is the report's best-powered, most defensible finding: **coffee alone is not improving measured cognition in our users, and is mildly associated with slower, less controlled responding.**

**Any Conka vs none** (coffee ignored).

| Metric (better dir.) | Mean within-person delta | n users | % who improved |
|---|---:|---:|---:|
| Total Score ↑ | **+2.08** | 47 | 60% |
| Speed score ↑ | +2.00 | 47 | 62% |
| Accuracy ↑ | +0.80 | 47 | 43% |
| KPI Reaction Speed (ms) ↓ | −31.45 (faster) | 47 | only 28% improved |
| Response Control ↑ | −0.02 | 47 | 57% |
| KPI Error Patterns ↓ | −0.37 (fewer) | 47 | 49% |

**Read:** Conka's within-person signal is **positive on total score (+2.1, 60% of users improve)** and speed score. **Important honesty note:** the −31ms reaction-speed mean looks huge but only 28% of users actually got faster — the average is dragged by a few large improvers, so it is *not* a robust within-person claim. Lead with total score and the 60% improvement rate, not the millisecond figure.

### 2b. The interaction — does Conka add to coffee?

**Coffee + Conka vs Coffee only** (adding Conka on top of caffeine), n = 22.

| Metric (better dir.) | Mean delta | % improved |
|---|---:|---:|
| **Total Score ↑** | **+4.00** | **64%** |
| Speed score ↑ | +1.91 | 59% |
| KPI Error Patterns ↓ | −1.13 (fewer) | 59% |
| Accuracy ↑ | +2.51 | 32% |
| KPI Reaction Speed (ms) ↓ | −25.08 (faster) | 32% |
| Response Control ↑ | +0.07 | 55% |

**Read:** This is the cleanest "Conka earns its place next to coffee" story. Among 22 users with both a coffee-only and a coffee+Conka history, **adding Conka is associated with +4.0 total score and 64% of them improving**, plus fewer errors (59% improve). The accuracy and reaction-speed means are outlier-driven (only 32% improved), so quote the total-score and error figures.

### 2c. Smaller within-2×2 contrasts (directional only)

| Contrast | n users | Notable |
|---|---:|---|
| Coffee only − Neither | 20 | Total score −2.4; reaction +4.5ms slower; control −0.09. Coffee looks slightly negative within person. |
| Conka only − Neither | 8 | Focus +0.35, control +0.21 (62% improve each); too few users to weigh. |
| Coffee+Conka − Conka only | 7 | Adding coffee to Conka: little score change, reaction +19ms slower. Too few users. |
| Coffee+Conka − Neither | 10 | Reaction +7.8ms, focus +0.20, control +0.19; mixed, small. |

![Per-user deltas on headline metrics](assets/coffee-conka/00b_per_user_delta_headline.png)

---

## Part 3: Conka Dose Breakdown (Supporting)

Crossing coffee with the exact Conka response (`none` / `conka1` / `conka2` / `both`). Several cells are very small (n as low as 3 tests) — **this table is exploratory only**.

| Coffee | Conka level | Tests | Users | Total Score | Reaction ms | Resp. Control | Errors |
|--------|-------------|------:|------:|------:|------:|------:|------:|
| No | none | 66 | 32 | 80.97 | 424.65 | 4.15 | 6.57 |
| Yes | none | 199 | 53 | 80.60 | 429.79 | 4.19 | 6.60 |
| No | conka1 | 28 | 10 | 85.61 | 406.68 | 4.43 | 4.71 |
| Yes | conka1 | 126 | 25 | 86.04 | 375.68 | 4.38 | 5.33 |
| No | conka2 | 8 | 3 | 87.62 | 377.88 | 4.62 | 4.75 |
| Yes | conka2 | 51 | 12 | 86.61 | 364.96 | 4.44 | 5.59 |
| No | both | 3 | 2 | 77.33 | 369.00 | 3.33 | 9.67 |
| Yes | both | 20 | 9 | 88.50 | 331.30 | 4.32 | 5.10 |

**Directional read:** Within the coffee-drinking rows, the fastest reaction times appear at higher Conka doses (conka1 376ms → conka2 365ms → both 331ms), and total score climbs slightly with dose. A dose-response *shape* is visible but the per-cell samples are far too small to claim it.

---

## Part 4: Summary — Findings and Strength of Evidence

| Finding | Strength of evidence |
|---------|----------------------|
| Coffee alone does not improve measured cognitive scores (total/accuracy/overall ≈ no-caffeine) | **Strong** — 104–222 users, within-person, near-zero deltas |
| Coffee is associated with ~13ms slower reaction time and slightly worse response control within person | **Moderate** — 104 users, 58% slow down, 38% improve control |
| Conka is associated with +2.1 total score, with 60% of users improving | **Moderate** — 47 users, within-person |
| Adding Conka on top of coffee is associated with +4.0 total score (64% of users improve) and fewer errors | **Moderate** — 22 users, within-person, the key interaction signal |
| Coffee + Conka has the fastest raw reaction times of any group (368ms vs 430ms coffee-only) | **Moderate (raw) / Weak (within-person)** — large group gap, but within-person gain concentrated in a minority |
| Higher Conka dose tracks with faster reaction and higher score among coffee drinkers | **Weak** — dose-response shape visible, per-cell n too small |
| Conka-only group looks strong on accuracy/focus/control | **Weak** — only 12 users; directional only |

**Marketing-usable numbers (with the honest framing attached):**
- *"Coffee alone barely moved our users' cognitive scores — and reaction time actually slipped ~13ms."* (n=104–222, within-person)
- *"Adding Conka to coffee was associated with a +4-point cognitive score lift, with nearly two in three users improving."* (n=22, within-person, directional)
- *"Coffee-plus-Conka users posted the fastest average reaction times we measured — 368ms vs 430ms for coffee alone."* (raw group means; within-person the gain concentrates in a subset)

**The honest caveats, always attached:**
- Observational and self-reported; consumption groups are self-selected, not randomised.
- Conka-only and the dose cells are small (n = 2–12) and exploratory.
- Where raw means and within-person deltas disagree (notably reaction speed), the within-person number governs.

---

## How to Reproduce / Re-Run

- Analysis script: `personalScripts/coffee_conka_analysis/analyze.py` (read-only; venv: `conka_server/venv`)
- Outputs (CSV + PNG): `personalScripts/coffee_conka_analysis/output/`
  - `01_cell_means.csv` — raw group means, all metrics × 4 cells
  - `02_cell_counts.csv` — tests and users per cell
  - `03_dose_means.csv` — coffee × Conka-dose breakdown
  - `04_per_user_deltas.csv` — all 7 contrasts × 12 metrics, with n and % improved
  - `00_overview_panel.png`, `00b_per_user_delta_headline.png`, plus one chart per metric

Run: `conka_server/venv/bin/python3 personalScripts/coffee_conka_analysis/analyze.py`

---

## Machine-Readable Summary (for AI parsing)

```
REPORT_TYPE: observational_data_analysis
TOPIC: coffee_vs_conka_vs_both_cognitive_performance
APP: CONKA (cognition testing + supplement brand)
ANALYSIS_DATE: 2026-06
DATA_RANGE: 2024-11-13 to 2026-06-13

DATABASE_TABLES_USED:
  - cognica_logs (total_score, accuracy, speed; assessment=true)
  - wellness_snapshots / wellness_snapshot_values / wellness_factors
  - user_kpi_values / cognitive_kpis (overall, accuracy_by_type, speed_ms, consistency, errors)
  - cognica_metrics (focus_score, control_score, speed_score, accuracy_percent)

FACTORS:
  caffeine: {factor_id: 3, coffee = "yes"|"* ago"|"last 30 minutes"; no_coffee = "no"|"haven't had one today"}
  conka:    {factor_id: 1, values: [none, conka1, conka2, both]; conka = != none}

POPULATION:
  users_logged_caffeine: 490
  users_logged_conka: 166
  assessment_tests_with_snapshot: 5795
  tests_both_tracked_2x2: 501

GROUP_SIZES (tests / users):
  neither:        66 / 32
  coffee_only:    199 / 53
  conka_only:     39 / 12   # weak, directional only
  coffee_conka:   197 / 30

RAW_GROUP_MEANS:
  total_score:   {neither: 80.97, coffee: 80.60, conka: 85.38, both: 86.44}
  reaction_ms:   {neither: 424.65, coffee: 429.79, conka: 397.87, both: 368.40}  # lower better
  response_control_1_5: {neither: 4.15, coffee: 4.19, conka: 4.38, both: 4.39}
  focus_1_5:     {neither: 3.49, coffee: 3.61, conka: 3.72, both: 3.58}
  error_patterns:{neither: 6.57, coffee: 6.60, conka: 5.10, both: 5.38}  # lower better

PER_USER_DELTAS:
  coffee_main_effect (conka_ignored):
    n_users: 104-222
    total_score: +0.23 (57% improved)
    reaction_ms: +12.84 slower (58% slower)
    response_control: -0.12 (only 38% improved)
    verdict: flat_to_slightly_negative  # STRONGEST EVIDENCE
  conka_main_effect (coffee_ignored):
    n_users: 47
    total_score: +2.08 (60% improved)
    reaction_ms: -31.45 (ONLY 28% improved -> outlier-driven, not robust)
  add_conka_to_coffee (coffee_conka - coffee_only):
    n_users: 22
    total_score: +4.00 (64% improved)
    error_patterns: -1.13 (59% improved)
    verdict: key_interaction_signal_directional

KEY_FINDINGS:
  strongest: "Coffee alone does not improve measured cognition (n=104-222, within-person) and is associated with ~13ms slower reaction time + weaker response control"
  conka_signal: "Conka associated with +2.1 total score, 60% of users improve (n=47)"
  interaction: "Adding Conka to coffee associated with +4.0 total score, 64% improve, fewer errors (n=22, directional)"
  raw_speed: "Coffee+Conka fastest raw reaction time 368ms vs 430ms coffee-only; within-person gain concentrated in a subset"
  honest_caveat: "Conka-only (n=12) and dose cells (n=2-12) exploratory; raw-vs-delta disagreement on speed resolved in favour of within-person"
```
