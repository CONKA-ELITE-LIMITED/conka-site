# Brain-Age Quiz (/go/brain-age)

Part of the [landing conversion programme](./README.md). First real persona quiz on the shipped engine (quiz-format Phase 2). Copy by Luke, June 2026, for the ageing-brain persona (fear of mental decline, older audience).

**Status:** Phase 1 built 2026-06-12, awaiting visual review + /review-analytics.
**Appetite:** ~2 days, one PR.

## Problem

The persona landing programme needs its first real content quiz. Luke's brain-age flow is written, but the shipped engine only supports bucket scoring and a light theme. It cannot compute a brain-age number, mirror a previous answer, or render the reveal, cycle-loop, payoff or app-value screens his flow depends on.

## Approach

Extend the quiz engine (numeric brain-age scoring mode, config-flag dark theme, five new screen capabilities), then express Luke's full flow as one config file registered at `/go/brain-age`, persona `ageing-brain`.

## The flow (from Luke's copy)

Hook (dark, "What's your real brain age?", 2-minute promise, social proof line) -> Q1 age -> Q2 mental activity -> Q3 misplacing things -> Q4 names -> Q5 words -> [social proof: "YOU SAID" mirror + big % stat] -> Q6 sharp-vs-past (heaviest weight) -> Q7 fog -> [This isn't your fault + decline graph] -> [The cycle loop] -> Q8 learning -> Q9 sharpness slider (0-100, AVERAGE anchor) -> [Cost of waiting: their score, now vs later] -> Q10 what matters (segmentation only) -> Q11 ideal self (segmentation only) -> [REVEAL: real age vs brain age + turnaround curve] -> [How CONKA works: Flow AM / Clear PM] -> [Payoff orb: "switched on"] -> [Track it in the app: phone screenshots] -> [Today vs CONKA sharpness graph] -> [Commit screen] -> /funnel.

Copy correction applied when writing the config: Luke's "Conka 1 morning / Conka 2 evening (recovery)" was inferred from his swipe file; we write it as Flow in the morning, Clear in the afternoon/second dose, in our real product language.

## Scoring model

- Q1 answer carries a `baselineAge` (band midpoint).
- Q2-Q9 answers (and slider bands) carry `years` added or subtracted. Q6 weighting is just larger values in config, no special code.
- Brain age = baseline + gap, where gap = clamp(sum of years, gapMin, gapMax), default +3 to +12. The floor guarantees even good answers produce a small, honest gap so everyone has a reason to act.
- Q10 and Q11 score nothing; they exist for desire and segmentation (answers are already captured by `landing:answer_selected`).
- Result recommendation is always Both. `landing:completed` carries `brainAge` and `gap` instead of `resultBucket`.
- The number is a lifestyle self-assessment score, never presented as a medical measurement.

## Decisions

| Decision | Choice |
|----------|--------|
| Visual language | Dark theme for this quiz, honouring Luke's art direction, with neuro blue accent instead of the reference orange. Implemented as `theme: "dark"` config flag + scoped CSS variable overrides, nothing site-wide |
| Stats and numbers | Ship with Luke's placeholders, each marked `// PLACEHOLDER` in config; sourcing real numbers is Phase 2 and gates scaled spend |
| Ending | Commit screen -> `/funnel` (Both is already the funnel default, so no preselect param) |
| Recommendation | Always Both |
| Persona / slug | `ageing-brain` / `/go/brain-age` |
| App imagery | Existing screenshots: `public/app/AppConkaRing.png`, `AppTestBreakdown.png`, `AppLeaderboard.png` |
| Cycle loop reference | flowalarmclock "It's a cycle" screen: four nodes in a diamond around an accent centre, nodes appear one at a time, active ring + dashed accent arrow steps round on a timer |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Engine extensions + brain-age config + QA (one PR) | Built (2026-06-12); visual review + /review-analytics outstanding |
| 2 | Real numbers (customer count, word-loss %, rating) + Luke's offer/pricing screen | Future |

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

- No `/funnel` preselect param (Both is already the default there).
- No offer/pricing screen until Luke writes it; commit -> funnel is the v1 ending.
- No email gate, no Convex response storage, no orange accent, no chart library.
- Existing `quiz-template` behaviour and visuals untouched.

## Risks

- Dark-theme contrast on charts and muted text needs a deliberate pass, not just inverted opacities.
- Placeholder stats must not reach scaled spend; Phase 2 gates that.
- Dark quiz hands off to a light `/funnel`; accepted for v1.
- Meta Lead fires on the reveal as before; verify dedup with `/review-analytics` since `completed` props change.
- Brain-age framing stays a lifestyle score; the reveal and turnaround curves are illustrative, consistent with the existing line chart's "illustrative" caption pattern.

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
