# Page Narratives

A living map of the story each page tells, section by section. Use it to see a page's intended arc at a glance and spot the weakest section to improve or replace next.

This is **current-state**, not build history. For why a page was built a certain way, see `docs/development/featurePlans/`. Keep this file lightweight: one table per page, update it whenever a page's section order or a section's job changes.

**Health key**
- Strong: does its job, premium, converts. Leave alone.
- OK: works but could be sharper. Improve when there's time.
- Weak: underperforming, off-thesis, or a spec-sheet dump. Replace or rework.

---

## /science

**Audience:** mid-funnel believer-maker. Already interested (arrives from a PDP or nav), but doubtful. Needs the doubt dismantled before buying.
**Posture:** convince the sceptic. Confident transparency, teach don't flex. No pricing or Shop Now here; the buy happens downstream on the PDP.
**Story arc:** Problem -> there is a natural solution, but unrealised -> here is how it works -> here is the solution we actually built (Flow and Clear, after the investment and clinical research) -> and the evidence base keeps growing.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`ScienceHero`) | State the thesis and promise to prove it | OK | Sets up "how we prove it" |
| 2 | The Problem (`ScienceDifferent`) | Why most brain products fail | OK | The tension the page resolves |
| 3 | The Unrealised Natural Solution (`TwoSystemModel`) | Two systems exist in nature (adaptogens = resilience, nootropics = acute), but raw and unoptimised that potential stays on the shelf | OK | Intro reframed to "latent solution"; tees up the realisation (SCRUM-1076) |
| 4 | The Education (`ScienceEducation`) | How the mechanisms actually work; why dose and quality matter | Strong | Layered disclosure |
| 5 | The Realised Solution (`RealisedSolution`) | Flow and Clear as the payoff: render-led product cards, a proof strip of citable facts, 3 hero actives folded in per product, soft CTA to each PDP plus an "all 16 actives" link to /ingredients | OK | Shipped SCRUM-1076. Replaced the standalone `ScienceIngredients` catalogue so the products lead and the actives are supporting proof |
| 6 | The Growing Evidence Base (`EvidenceLadder`) | Four rungs of confidence, framed forward: breadth and depth still compounding | OK | Intro reframed to "growing" (SCRUM-1076) |
| 7 | Real-World Proof (`AppInsightsCallout`) | Real-user cognitive data; bridge to the app | OK | Link-out, should not pull focus |

**Weakest link right now:** sections 1 and 2 (Hero, Problem) are the next candidates to sharpen now that the spine resolves into the product payoff. The former weak link, the standalone `ScienceIngredients` catalogue, was dissolved into the product-led `RealisedSolution` cards in SCRUM-1076.

---

## /app

**Audience:** top-to-mid-funnel sceptic, plus the existing customer. The app is free, so the page is not selling a supplement, it is selling belief in measurement. It proves CONKA can be trusted by showing you can measure the thing every other brand only claims.
**Posture:** show, don't tell. Earn credibility through a real, can't-be-gamed test and real user and athlete data. The CTA is "download / take the test," not "buy." This is a trust-and-proof engine that feeds the funnel and retains buyers.
**Story arc:** we don't tell you how you feel, we show you -> you cannot improve what you cannot measure -> here is a test that can't be gamed -> here is the full instrument (the gold standard) -> try it yourself right now -> here is what 700+ real users and pro athletes actually show -> download it free.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`AppHero`) | State the thesis: "Everyone tells you how you should feel. We show you." | OK | Strong line; the phone-ring asset proves it instantly |
| 2 | Why / Origin (`AppOrigin`) | "You cannot improve what you cannot measure." Humphrey's scan story earns the measurement obsession | OK | Founder credibility; lab reference generalised to "a Neuro Lab" |
| 3 | How it works (`AppStickyPhoneBlock`) | "Four features. One outcome: measurable brain performance." Mechanism deep-dive: the test can't be gamed, daily variance explained, 30-day trend | OK | Sticky phone; the "can't be gamed" beat is the killer differentiator |
| 4 | What it is (`AppFeaturePanel`) | "The Gold Standard of Cognitive Testing." Four feature tabs: Score, Test, Compete, Rewards | OK | Overlaps section 3 (see backlog #1) |
| 5 | Try it (`CognitiveTestIsland`) | "Measure your cognitive performance." Live in-page test, instant benchmarked result | Strong | The most on-thesis moment on the page: it shows instead of telling |
| 6 | Real-world proof (`AppInsightsCallout`) | "Curious what 700+ users actually show?" Bridge to /app-insights | OK | Link-out, should not pull focus |
| 7 | Proof cluster (`AppWidgetGrid`) | Research stats + download + lifestyle + athlete data | OK | Four jobs in one grid; risks reading as a dump (see backlog #2) |
| 8 | Download (`AppDownloadSection`) | "Start measuring your brain today." Free, no subscription | OK | Clean conversion layer |

**Weakest link right now:** sections 3 and 4 do nearly the same job back-to-back (two four-item, phone-mockup feature tours), so the page spends three consecutive sections (3, 4, 5) on "what the test is" before any proof lands.

**Improvement backlog** (highest-leverage first, not yet scoped):
1. **Collapse the 3/4 redundancy.** `AppStickyPhoneBlock` and `AppFeaturePanel` are structurally the same beat (a 4-up feature tour with phone mockups). Either merge them, or split their jobs: section 3 keeps "why you can trust the score (can't be gamed)" and section 4 becomes lighter or folds into the try-it moment. Goal: proof lands sooner.
2. **Make the bridge back to the product explicit.** The page never closes the loop the science page opens ("measure your brain -> watch CONKA move the number"). The athlete data and 16% improvement stat sit inside the section 7 grid but are not framed as "this is CONKA working, measured." A free app shouldn't hard-sell, but one framing line would convert better than none.
3. **De-dump the section 7 grid.** `AppWidgetGrid` carries four unrelated jobs (research, download, lifestyle, athletes) in one surface. Once #2 is decided, reconsider whether athlete proof deserves to stand on its own rather than as a grid tile.
