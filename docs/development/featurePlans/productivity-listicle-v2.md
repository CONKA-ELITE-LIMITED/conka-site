# Productivity Listicle v2: "Your brain has a limit"

> Ticket: SCRUM-1470. Scope: copy, messaging and order of information. Components and imagery are reused from the existing listicles.

## Problem

Productivity is becoming the core Meta audience. The v1 page is written around identity ("high performers", founders, athletes), which turns away the ADHD and 40+ readers the same ads reach. v2 is written around a situation anyone recognises: your day asks more of your brain than it has to give.

## Thesis

**Your brain has a limit. CONKA raises it, so you get done what needs doing.**

The sentiment is fixed. The wording varies line to line (limit, capacity, bandwidth, headroom, tank, wall), so the copy never repeats one metaphor.

Three reasons people hit the limit:

| Cause | Who sees themselves | Where it appears on the core page |
|---|---|---|
| Load: too much on your plate | Productivity (core) | Headline level |
| Focus: can't lock in or get started | ADHD | Hero subcopy + reason 3 |
| Age: not as quick as you were | 40+ | Hero subcopy + reason 4 |

**Bridge rule** for reasons 3 and 4: condition, then mechanism, then the shared everyday problem, then CONKA. The headline names the shared problem; the body names the condition. Skimmers read headlines, so the productivity reader never feels the page is about someone else.

## Page, top to bottom

| # | Zone | Copy job | Visual (existing asset) |
|---|---|---|---|
| Hero | H1, subcopy, CTA, rating | State the limit, name all three causes, promise the gain | v1 hero image, unchanged |
| - | Proof wall | Institutional proof | Partner logo band (fixed zone) |
| - | Reasons header | List promise | Text only |
| 1 | Your Brain Runs Out Before Your Day Does | Thesis | `focusBars` (focus off vs on CONKA) |
| 2 | More Capacity, Without the Crash | Coffee borrows against the limit | `dayEnergyCurve` (from v1 reason 5) |
| 3 | Why Starting Is the Hardest Part | ADHD bridge | Flow neuron video `/videos/flow/FlowFloat.mp4` (from ADHD reason 2) |
| 4 | The Same Workload Gets Heavier Every Year | Ageing bridge | `athleteQuote`, Shane Corstorphine (from v1 reason 1) |
| 5 | Measure Your Limit, Then Watch It Move | A score, not a feeling | `measureTile` + press marquee (from v1 reason 6) |
| - | Review strip | Social proof mid-list | v1's three reviews (Aaron H., Sam J., Anthony Stodart) |
| 6 | Get It All Done and Still Have a Life | Spare capacity for the evening | `/lifestyle/GirlsLaughing.jpg` (from v1 reason 4) |
| 7 | 100 Days to Feel It, or Your Money Back | Risk reversal | `researchBacked` (from v1 reason 7) |
| - | Bridge, product, proof tier, FAQ, sticky bar | Unchanged from v1 | Unchanged from v1 |

## Copy

### Hero

- **H1:** Your brain has a limit. Raise it.
- **Subcopy:** Too much on, a mind that won't settle, or a brain that isn't as quick as it was. Coffee borrows against tomorrow. CONKA works from within to give your brain more capacity, so you get done what needs doing.
- **CTA:** Save {percent}% and raise your limit
- **Alternate H1s:** "Stop running your day on empty." / "More capacity for everything on your plate."

### Reasons header

- **Eyebrow:** unchanged from v1
- **Headline:** 7 Reasons to Raise Your Brain's Limit (also the page `title`)

### Reasons

1. **Your Brain Runs Out Before Your Day Does**
   Emails, meetings, decisions, the list at home. Each one draws on the same limited supply of focus, and by mid-afternoon it's spent. That isn't a willpower problem, it's biology. CONKA supports the pathways behind focus and mental energy from within, so there's more in the tank when the day asks for it.

2. **More Capacity, Without the Crash**
   Coffee doesn't raise your limit, it borrows against it, and the 3pm crash collects. CONKA is completely caffeine-free, and its ingredients delivered 18.1% faster mental processing than caffeine, so your capacity holds from the first task to the last. Citation carried from v1: DOI 10.1186/1550-2783-12-S1-P41.

3. **Why Starting Is the Hardest Part**
   ADHD brains run lower on dopamine, the chemical that turns "I should" into "I am". So starting a task feels like a fight. Plenty of people without ADHD know that fight on a heavy day. CONKA supports the pathways behind focus and drive, so getting started stops costing so much.

4. **The Same Workload Gets Heavier Every Year**
   Your brain doesn't fall off a cliff, it slowly loses speed, with decline measurable from around 45. The job doesn't get lighter, so the same load costs more each year. CONKA supports the recall and processing pathways that start to slip. Citation: Singh-Manoux et al., BMJ 2012 (Whitehall II). Proof: Shane's "same workload as I did in my 30s" quote tile.

5. **Measure Your Limit, Then Watch It Move**
   The v1 app reason, reframed around the limit: a score, not a feeling.

6. **Get It All Done and Still Have a Life**
   The v1 career-and-life reason, reframed as spare capacity left over for the evening.

7. **100 Days to Feel It, or Your Money Back**
   Unchanged from v1.

Reasons 5 and 6 get final copy in the build. All reasons are 50 to 80 words, statement titles, one idea (LISTICLE_SYSTEM.md copy standard).

## Template for the ADHD and brain-ageing variants

| Part | Shared | Per persona |
|---|---|---|
| Thesis, reasons 2, 5, 7 | ✓ | |
| Hero H1 + subcopy | | ADHD leads on focus, brain-ageing on age |
| Reasons 3 and 4 | | The persona's own bridge gets more detail and moves to reason 1; the other bridge stays |
| Testimonials, proof feature | | Per persona |

## Decisions

- **New slug** `/go/productivity-v2` (GO_LANDING_PAGES.md: a new iteration is a new slug). v1 stays live, and Meta splits budget between the two.
- **Design language:** unchanged im8 Simple DTC. No component work.
- **Seven reasons**, following the agreed outline.

## Open

- **Founder story:** held for review. If kept, it goes next to reason 1 as proof, not in the hero.
- **Hero image:** v1 image stays for now; any change is a separate decision.
- **Proof tier feature** (Jack Willis, framed as a high achiever): kept from v1 for now.
- **Inputs to sharpen copy later:** Henry's winning ad hooks, AnswerSocrates phrasing for the ADHD and ageing bridges.

## No-gos

- No edits to `/go/productivity-listicle` (v1).
- No new components or imagery in this ticket.
- No literal prices or discounts in the config (`{percent}` token only).

## Files

- `app/lib/landings/productivity-v2-listicle.ts` (new, copied from v1)
- `app/lib/landings/index.ts` (register)
- `docs/CHANGELOG.md`, `docs/analytics/LISTICLE_PERFORMANCE.md` timeline note

## Jira tickets

| Ticket | Title | Phase |
|---|---|---|
| SCRUM-1470 | Productivity listicle v2: core "your brain has a limit" messaging | 1 (active) |
| Future | ADHD and brain-ageing listicles rebuilt on the v2 template | 2 |
