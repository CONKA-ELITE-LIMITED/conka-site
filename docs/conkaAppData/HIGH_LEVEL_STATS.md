# CONKA — High-Level Performance Stats

A single-page reference of the headline numbers from CONKA's cognitive trials and app data. Use this as the source of truth for marketing, landing pages, and partner handoffs. Every figure traces back to a trial report or dataset in this folder.

---

## The four headline stats

```
+14.86%   Sharper cognitive performance, proven against placebo
80%       improved cognitive performance on CONKA
+19.3%    Sharper focus in professional athletes
75%       improved cognitive function in under 3 weeks
```

---

## The trials behind them

### +14.86% and 80% — Harlequins F.C.
**The gold standard. Randomised, double-blind, placebo-controlled.**

- 29 professional rugby players, 6 weeks
- CONKA group improved cognitive performance **+14.86%**
- Placebo group **declined -0.69%**
- **80%** of fully-tracked athletes improved their cognitive scores; the placebo group did not
- Memory +10.0%, focus +7.6% in the CONKA group
- Statistically significant on the core processing-accuracy metric (p = 0.0018)
- The CONKA group took **60% more physical contact** during the trial and still came out sharper
- Source: `HarlequinsTrialReport.pdf`

This is the strongest asset. It earns "clinically proven" and the placebo contrast holds up.

### +19.3% — Bristol Bears
**Within-subjects (each player vs their own baseline).**

- 15 professional rugby players, 13 weeks
- Focus improved **+19.3%**
- Cognition up **+7.9%** across all tests; processing speed +3.9%; memory +7.9%
- Statistically significant across the tests (p < 0.05)
- No control group, so frame as "measured" rather than "vs placebo"
- Source: `BristolBearsTrialReport.pdf`

### 75% — Revolut
**Real-world workplace trial.**

- 9 employees, 18 days
- **75%** improved their cognitive scores
- One participant scored a perfect 100
- Reaction times 20-25% faster by the end of the trial
- Bridges the story from elite sport to the everyday customer
- Source: `REVOLUT_TRIAL_MARCH26.md`

---

## Coffee vs CONKA (app data)

**Observational analysis of real app users who log caffeine and CONKA alongside their cognitive tests. Associations, not a controlled trial.**

```
~0       coffee alone barely moved measured cognition (reaction time slipped ~13ms)
+4 pts   cognitive score when CONKA is added to coffee (64% of users improved)
+2.1     cognitive score on CONKA overall (60% of users improved)
368ms    fastest average reaction measured (coffee + CONKA) vs 430ms coffee alone
```

- **Coffee alone does little.** Flat measured scores vs no caffeine, reaction time ~13ms slower, response control slightly weaker. Best-powered finding (within-person, n = 104-222).
- **Adding CONKA to coffee: +4.0 total score, 64% of users improved**, with fewer errors (within-person, n = 22, directional).
- **CONKA overall: +2.1 total score, 60% of users improved** (within-person, n = 47).
- **Every best score has CONKA in it.** All twelve metrics peak in a CONKA group; the lift tracks CONKA, not caffeine.
- Group averages (total score): Neither 81.0, Coffee 80.6, CONKA 85.4, CONKA + coffee 86.4. Reaction: 368ms (CONKA + coffee) vs 430ms (coffee).
- Source: `coffee-conka-cognition-report.md`

**Framing notes:**
- Lead with total score and % improved (the defensible within-person numbers), not the millisecond figure.
- Reaction speed: quote raw group averages ("fastest average we measured"), never an implied per-person speed gain. Within-person the ms gain sits in a minority of users.
- Always attach the caveat: observational and self-reported, consumption groups self-selected. CONKA-only (n = 12) and dose cells are exploratory.

---

## Credibility anchor

**7,593 cognitive tests across 712 people, over 30 months of real app data.**

Not a hero stat, but a strong trust line near a proof section or footer. Backs the whole claim set. Source: `app/lib/appInsightsData.ts` and the aggregate cognition reports in this folder (`stress-`, `mental-fatigue-readiness-`, `alcohol-`, `time-of-day-cognition-report.md`).

---

## Framing notes

- **Lead with Harlequins (+14.86%).** It is the only randomised double-blind placebo-controlled trial, so it carries "clinically proven" and the placebo contrast.
- **Pair +14.86% with 80%** — same trial. The percentage uplift is the number people trust; the 80% is the number people feel.
- **Bristol Bears** carries the focus story; strong but no placebo group.
- **Revolut** is the "works for you, not just Olympians" bridge.
- All figures are stated exactly as the source reports them. Nothing is inflated.
