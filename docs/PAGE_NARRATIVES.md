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
**Story arc:** we don't tell you how you feel, we show you -> you cannot improve what you cannot measure -> here is the gold-standard test that can't be gamed -> and around it an engine: everything in (Apple Health, Screen Time), patterns out (what is true for you), down to the millisecond -> try it yourself right now -> here is the clinical and athlete proof, and CONKA moves the number -> the app keeps you testing -> download it free.

The page is GSAP-driven (scroll-scrubbed pinned journey, count-up stats, masked reveals); all motion falls back to static layouts under prefers-reduced-motion and on mobile the journey stacks.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`AppV2Hero`) | State the thesis: "Everyone tells you how you should feel. We show you." Live score ring draws and counts to 92 | OK | The count-up makes the thesis kinetic; same copy as before |
| 2 | Why / Origin (`AppV2Origin`) | "You cannot improve what you cannot measure." Headline brightens word-by-word on scroll; Humphrey's scan story | OK | Founder credibility; lab reference generalised to "a Neuro Lab" |
| 3 | How it works (`AppV2TestJourney`) | "The Gold Standard of Cognitive Testing." Pinned 2-beat trust journey (can't be gamed -> 30-day improvement), scroll scrubs the phone screens | OK | Trimmed to two beats; the tracking story moved to the engine section |
| 4 | The engine (`AppV2Engine`) | "Everything in. Patterns out. Down to the millisecond." Three acts: Apple Health + Screen Time inputs wire into the score, the patterns engine shows what is true for you, per-test forensics and long-term trends | OK | The intelligence/personalisation beat: lab-grade insight without a lab. Connector-line draw on desktop, count-up stats |
| 5 | Try it (`CognitiveTestIsland`) | "Measure your cognitive performance." Live in-page test, instant benchmarked result | Strong | The most on-thesis moment on the page: it shows instead of telling |
| 6 | Proof (`AppV2Proof`) | Count-up research stats, explicit product bridge ("The app shows you the number. CONKA moves it.") with equal Flow/Clear links, athlete strip | OK | Closes the loop the science page opens; athletes stand on their own now |
| 7 | Real-world data (`AppInsightsCallout`) | "Curious what 700+ users actually show?" Bridge to /app-insights | OK | Link-out, should not pull focus |
| 8 | Habit (`AppV2BeyondTest`) | Compete + Rewards: "A test you'll actually keep taking." | OK | Retention beat placed after proof so it doesn't delay it |
| 9 | Download (`AppV2Download`) | "Start measuring your brain today." Free, no subscription | OK | Clean conversion layer with decorative scroll-drawn ring |

**Weakest link right now:** unproven, the rebuild shipped June 2026. Watch the pinned journey (section 3) on real devices: pinned scroll sections are the most device-sensitive pattern on the page, and on mobile it falls back to a plain stacked list that has had less design attention than the desktop scrub.
