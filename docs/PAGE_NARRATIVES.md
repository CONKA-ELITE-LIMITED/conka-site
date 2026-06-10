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
