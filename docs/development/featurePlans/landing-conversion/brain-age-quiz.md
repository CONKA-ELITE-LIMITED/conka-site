# Brain-Age Quiz (/go/brain-age)

Part of the [landing conversion programme](./README.md). First real persona quiz on the shipped engine (quiz-format Phase 2). Copy by Luke, June 2026, for the ageing-brain persona (fear of mental decline, older audience).

**Status:** Phase 1 built and iterated with Rudh 2026-06-12 (3 visual rounds + code review, all on branch QUIZ-FUNNEL). Outstanding: Vercel preview walk at 390px, /review-analytics before spend, Phase 2 numbers.
**Appetite:** ~2 days, one PR.

## Problem

The persona landing programme needs its first real content quiz. Luke's brain-age flow is written, but the shipped engine only supports bucket scoring and a light theme. It cannot compute a brain-age number, mirror a previous answer, or render the reveal, cycle-loop, payoff or app-value screens his flow depends on.

## Approach

Extend the quiz engine (numeric brain-age scoring mode, config-flag dark theme, five new screen capabilities), then express Luke's full flow as one config file registered at `/go/brain-age`, persona `ageing-brain`.

## The flow (as shipped)

Hook (dark, "What's your real **brain age?**" accent headline, square brain-scan video loop, rating line) -> Q1 age -> Q2 mental activity -> Q3 misplacing things -> Q4 names -> Q5 words -> [social proof: "YOU SAID" pill + per-answer % stat] -> Q6 sharp-vs-past (heaviest weight) -> Q7 fog -> [This isn't your fault: same-origin supported/left-alone graph] -> [The cycle loop] -> Q8 learning -> Q9 sharpness slider (0-100, AVERAGE anchor) -> [Cost of waiting: their score mirrored + decline stat] -> Q10 what matters (segmentation only) -> Q11 ideal self (segmentation only) -> [analyzing beat] -> [REVEAL: real age vs brain age count-up + turnaround curve with dotted decay line; completion analytics + Meta Lead fire here; progress bar hits 100%] -> [How CONKA works: Flow/Clear product cards, taglines from productData] -> [Payoff orb] -> [Track it in the app: phone screenshot] -> [Commit screen, typed out character by character] -> straight to the Both PDP (/conka-both).

Changes from Luke's original sequence, agreed during iteration: the "Today vs with CONKA" reinforcement graph and the final results screen were cut (no value at that point; the commit button links straight out), and an analyzing beat was inserted before the reveal. Copy correction: Luke's "Conka 1 morning / Conka 2 evening (recovery)" became Flow AM / Clear second-half in our real product language.

## Scoring model

- Q1 answer carries a `baselineAge` (band midpoint).
- Q2-Q9 answers (and slider bands) carry `years` added or subtracted. Q6 weighting is just larger values in config, no special code.
- Brain age = baseline + gap, where gap = clamp(sum of years, gapMin, gapMax), default +3 to +12. The floor guarantees even good answers produce a small, honest gap so everyone has a reason to act.
- Q10 and Q11 score nothing; they exist for desire and segmentation (answers are already captured by `landing:answer_selected`).
- Recommendation is always Both; the journey ends on the Both PDP. `landing:completed` and `landing:results_viewed` fire at the reveal and carry `brainAge` + `brainAgeGap` alongside `resultBucket`.
- The number is a lifestyle self-assessment score, never presented as a medical measurement.

## Decisions

| Decision | Choice |
|----------|--------|
| Visual language | Dark theme for this quiz, honouring Luke's art direction, with neuro blue accent instead of the reference orange. Implemented as `theme: "dark"` config flag + scoped CSS variable overrides, nothing site-wide |
| Layout (iteration round) | Flow grammar copied deliberately: large logo, full-bleed gamefied progress bar (gradient + shimmer), question/title anchored directly under the bar, big stat/value typography, charts in gradient cards with glow and in-chart pills |
| Progress | Perceived curve, not linear: first quarter of screens fills half the bar, bar completes at the reveal and stays full after |
| Stats and numbers | Ship with placeholders, each marked `// PLACEHOLDER` in config; sourcing real numbers is Phase 2 and gates scaled spend. The word-loss stat varies by the user's own answer (`stat.byAnswer`, split sums to 100) |
| Ending | Commit screen links straight to the Both PDP `/conka-both` (results screen cut during iteration); completion analytics + Meta Lead fire at the reveal instead |
| Recommendation | Always Both |
| Persona / slug | `ageing-brain` / `/go/brain-age` |
| Hook video | `BrainScan.gif` converted to mp4/webm (~143KB) + poster, shown square under the headline (`videoAspect: "square"`) |
| App imagery | `public/app/AppConkaRing.png` on the app value screen, capped at 150px so the screen fits 390px |
| Product imagery | Mechanism screen shows Flow + Clear bottle shots as two equal white cards (AM · FLOW / PM · CLEAR), taglines pulled live from `productData` `formulaContent` |
| Cycle loop reference | flowalarmclock "It's a cycle" screen: four nodes in a diamond around an accent centre, nodes appear one at a time, active ring + dashed accent arrow steps round on a timer |
| Honesty edits | Hedging captions removed ("Illustrative...", "Directional, not a prediction"); the turnaround keeps honesty structural instead: a dotted decay line shows the do-nothing path, and both comparison lines share one origin |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Engine extensions + brain-age config + iteration rounds + code review | Built 2026-06-12; Vercel preview walk + /review-analytics outstanding |
| 2 | Real numbers + Luke's offer/pricing screen | Future |

Phase 2 placeholder list (all marked `// PLACEHOLDER` in `brain-age.ts`): hook social proof ("Trusted by 10,000+ sharp minds"), word-loss per-answer split (14/41/27/18), cost-of-waiting decline figure (23%).

## Phase 1 tasks

1. **[Data] Schema extensions** - `app/lib/landings/types.ts`: `theme?: "light" | "dark"` and `scoring?: { mode: "brain-age"; gapMin; gapMax }` on `LandingConfig`; `baselineAge?` / `years?` on question options and slider bands; `reveal` screen kind with `{realAge}` / `{brainAge}` interpolation; `cycle` chart type (nodes + centre label); `now-later` chart type sourcing a slider answer; `payoff` interstitial variant; `image?` and `mirror?: { questionId }` on interstitials; `anchor?` on sliders. Complexity: Medium.
2. **[Frontend] Dark theme** - tokenize hardcoded colours (`QUIZ_BG`, `text-black/*`, SVG strokes) into `--go-*` CSS variables; `.go-dark` override block in `app/brand-base.css`; engine applies the class from `config.theme`. Light template stays pixel-identical. Complexity: Medium. Files: `QuizEngine.tsx`, `QuizQuestion.tsx`, `QuizScreens.tsx`, `ComparisonChart.tsx`, `BarChart.tsx`, `brand-base.css`.
3. **[Frontend] CycleLoop component** - new `app/components/go/CycleLoop.tsx` per the reference above. SVG arcs, CSS transitions, reduced-motion safe. Complexity: Medium.
4. **[Frontend] Reveal screen + turnaround chart** - two beats: count-up real age vs brain age (computed), then an upward curve to a dot in the `go-draw` SVG language. Doubles as the results screen in brain-age mode (Both recommendation card + CTA). Depends on 1. Complexity: Medium.
5. **[Frontend] Small capabilities batch** - slider AVERAGE anchor tick; interstitial image slot (phone shots); "YOU SAID:" mirror tag; payoff orb (CSS radial-gradient glow, no asset); now-vs-later bars fed by the user's slider value. Depends on 1. Complexity: Medium. Files: `QuizQuestion.tsx`, `QuizScreens.tsx`, `BarChart.tsx`.
6. **[Engine] Brain-age scoring** - memo alongside bucket scoring per the model above; expose computed ages to reveal/interpolation; extend `landing:completed` props. Depends on 1. Complexity: Medium. Files: `QuizEngine.tsx`, `app/lib/analytics.ts`.
7. **[Data] The config** - new `app/lib/landings/brain-age.ts` with the full flow, registered in `index.ts`. Depends on 1-6. Complexity: Medium.
8. **[QA] Mobile + analytics pass** - 390px walkthrough (dark contrast, charts, first-screen padding), reduced-motion check, `/review-analytics` before spend. Depends on 7. Complexity: Small.

## Rabbit holes

- **Theming creep.** Hard cap: one config flag, one CSS variable override block. No site dark mode, no per-screen themes, no redesigned selected states.
- **Visual polish on cycle/orb/reveal.** Built in the existing restrained motion language; if a moment needs choreography to feel good, it ships simpler.
- **Interpolation generality.** Only `{realAge}`, `{brainAge}` and the mirror tag. No general templating engine.

## No-gos

- No offer/pricing screen until Luke writes it; commit -> Both PDP is the v1 ending.
- No email gate, no Convex response storage, no orange accent, no chart library.
- Existing `quiz-template` behaviour untouched (it inherits the layout/progress upgrades but stays light-themed).

## Risks

- Placeholder stats must not reach scaled spend; Phase 2 gates that.
- Dark quiz hands off to the light `/conka-both` PDP; accepted for v1 until the offer screen exists.
- Meta Lead now fires at the reveal (not a results screen); verify dedup with `/review-analytics` before spend.
- Brain-age framing stays a lifestyle score, never a medical measurement; curves are illustrative.

## References

- Programme: `docs/development/featurePlans/landing-conversion/README.md`, format plan `quiz-format.md`
- System mechanics: `docs/features/LANDING_QUIZ_SYSTEM.md`
- Engine: `app/components/go/`, schema `app/lib/landings/types.ts`
- Luke's copy: Notion (pasted into session 2026-06-12); flow captured above
- Cycle reference: flowalarmclock.com/pages/go

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1084 | [Website & CRO] Brain-age quiz landing page at /go/brain-age (dark theme, brain-age scoring, Luke's copy) | 1 | To Do |

Phase 2 (real numbers + offer screen) is ticketed when the content exists.
