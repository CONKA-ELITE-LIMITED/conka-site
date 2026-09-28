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

## Page, top to bottom (as built)

Reasons are **categories of reason to buy** (Grüns pattern): a category eyebrow, a concrete outcome headline, one hard fact as the bold payoff. Final copy lives in `app/lib/landings/productivity-v2-listicle.ts`.

| # | Zone | Visual |
|---|---|---|
| - | Navy "Fueling High Performers at:" bar + logo marquee | Partner logos |
| Hero | "Discover the natural way to stay sharp all day." (v1 line, stand-in) + subcopy naming load, focus, age; CTA "Save {percent}% and try it risk-free"; avatar proof row | v1 hero image |
| - | Reasons header: "7 Reasons 5,000+ People Have Made CONKA Part of Their Routine" (also `title`) | Text |
| 1 | Focus · All-Day Energy and Focus, Without the Crash | Crash chart tile |
| 2 | Stress · Stay Calm When Everything Lands at Once | Focus bars tile |
| 3 | Motivation · Start the Tasks You Keep Putting Off (ADHD as one example) | Flow video + Lemon Balm, Rhodiola tiles |
| - | Review strip | Three customer reviews |
| 4 | Memory · Stop Losing Words Mid-Sentence (from 30) | Shane quote + Turmeric, Bilberry tiles |
| 5 | Convenience · Fits Around Your Day, Whatever Time It Starts | `public/listicle/RoutineTwoShotsV1.jpg` |
| 6 | Value · Costs Less Than Your Daily Coffee | CONKA vs coffee tile |
| 7 | Proof · See It Work, or Get Your Money Back | App score tile + store buttons, press marquee |
| - | Bridge band: "Make it part of your routine. 100 days, risk-free." | Navy band |
| - | Buy box, Jack Willis, comparison table, UGC, FAQ; "button" sticky bar | Shared |

## Still open

- **Hero headline:** the v1 line is a stand-in; the new hero line is not settled.
- **Founder story:** now only a proof line in reason 5.
- **"5,000+ people"** in the title reuses the "5,000+ daily users" figure; BRAND_VOICE lists 5,000+ as tests. Confirm before scaling spend.
- **Inputs to sharpen copy:** Henry's winning ad hooks, AnswerSocrates phrasing.

## Template for the ADHD and brain-ageing variants

| Part | Shared | Per persona |
|---|---|---|
| Reasons 1, 2, 5, 6, 7, bridge band, CTAs, tiles | ✓ | |
| Hero H1 + subcopy | | ADHD leads on focus, brain-ageing on age |
| Reasons 3 and 4 | | The persona's own reason gets more detail and moves to reason 1; the other stays |
| Testimonials, proof feature | | Per persona |

## Decisions

- **New slug** `/go/productivity-v2` (GO_LANDING_PAGES.md: a new iteration is a new slug). v1 stays live, and Meta splits budget between the two.
- **Design language:** unchanged im8 Simple DTC. No component work.
- **Seven reasons**, following the agreed outline.

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
