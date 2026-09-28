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

**Reasons are doors, not benefits** (Nuropod pattern): each one is a moment the reader hits their limit, so any reader finds their own row and skims the rest. Final copy lives in `app/lib/landings/productivity-v2-listicle.ts`.

| # | Zone | Visual (existing asset) |
|---|---|---|
| Hero | H1 "Your brain has a limit. Raise it." + subcopy naming load, focus, age. CTA "Save {percent}% and try it risk-free" | v1 hero image, unchanged |
| - | Proof wall | Partner logo band |
| - | Reasons header: "7 Moments Your Brain Hits Its Limit" (also `title`) | Text |
| 1 | When Your To-Do List Outlasts Your Focus | `focusBars` |
| 2 | When You'd Normally Reach for Another Coffee | `dayEnergyCurve` |
| 3 | When Starting Is the Hardest Part (ADHD bridge) | Flow neuron video |
| 4 | When the Same Workload Feels Heavier Than It Used To (ageing bridge) | Shane Corstorphine quote tile |
| 5 | When a Bad Night Follows You Into the Morning | `researchBacked` |
| - | Review strip | v1's three reviews |
| 6 | When You Get Home With Nothing Left | Friends-laughing photo |
| 7 | When You Want Proof, Not a Feeling | `measureTile` + press marquee |
| - | Bridge: the 100-day guarantee as the close, CTA "Try CONKA Risk-Free" | Dark CTA card |
| - | Product, proof tier, FAQ | Unchanged from v1. Sticky CTA "Try it risk-free" |

**CTAs are offer plus risk reversal everywhere**, since that fits every door.

**Bridge rule** for reasons 3 and 4: the headline names the shared moment, the body names the condition.

## Next copy lever: a day-to-day anchor

Brain performance is subjective, so the benefit needs grounding in one tangible, everyday thing (Magic Mind's is the to-do list melting). Candidates to decide: the afternoon (get your afternoon back), the end of the list, having something left for the evening. Once chosen, it threads through the hero, CTAs and door bodies. Also considered from teardowns: a Grüns-style switch framing against coffee, and a MASA-style one-line "quick answer" under the reasons header (needs a small type addition).

## Template for the ADHD and brain-ageing variants

| Part | Shared | Per persona |
|---|---|---|
| Thesis, doors 1, 2, 5, 6, 7, guarantee bridge, CTAs | ✓ | |
| Hero H1 + subcopy | | ADHD leads on focus, brain-ageing on age |
| Doors 3 and 4 | | The persona's own door gets more detail and moves to door 1; the other door stays |
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
