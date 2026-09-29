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
| - | Reasons header: eyebrow "Get ahead. Stay ahead.", "6 Reasons 5,000+ People Have Made CONKA Part of Their Routine" (also `title`) | Text |
| 1 | Composure · Stay Calm in the Chaos of Life | Focus bars tile |
| 2 | Motivation · You're Not Lazy. Your Brain Is Underfuelled. | Athlete + professional score cards, Lemon Balm, Rhodiola tiles, Morehen quote |
| - | Review strip | Three customer reviews |
| 3 | Memory · You're Not Losing It. Your Brain Is Just Overloaded. | Shane quote + Turmeric, Bilberry tiles |
| 4 | Convenience · Fits Around Your Day, Whatever Time It Starts | `public/listicle/RoutineTwoShotsV3.jpg` |
| 5 | Value · Costs Less Than Your Daily Coffee | CONKA vs coffee tile |
| 6 | Proof · See It Work, or Get Your Money Back | App score tile + store buttons, press marquee |
| - | Bridge band: "Make it part of your routine. 100 days, risk-free." | Navy band |
| - | Buy box, Jack Willis, comparison table, UGC, FAQ; "button" sticky bar | Shared |

## Still open

- **More bullish logos and social proof:** team wants it, deliberately deferred to a later pass.

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

- **New slug** `/go/productivity-v2` (GO_LANDING_PAGES.md: a new iteration is a new slug).
- **v1 slug now serves v2 (28 Sep):** `/go/productivity-listicle` holds a frozen copy of the v2 config under its own slug, because the live Meta campaign points there and repointing ads would reset learning. v2 stays the working copy; a winning iteration is copied back to v1 deliberately. The old v1 copy lives in git history.
- **Design language:** unchanged im8 Simple DTC. No component work.
- **Six reasons** (team feedback, 28 Sep): the Focus / crash-chart reason was cut, Stress leads, and Motivation and Memory reframe the reader's worry ("not lazy", "not losing it") as the shared problem.
- **Copy follows the `conka-messaging` skill** (`.claude/skills/conka-messaging/`): experience not biology (no cortisol or dopamine), no named conditions, Flow first / Clear before it counts.

## No-gos

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

## Round 2: formal team feedback (28 Sep 2026)

Supersedes the six-reason page above once built. Copy stays on the `conka-messaging` skill; conditions are implied, never named. Build section by section.

| Zone | Change | Needs |
|---|---|---|
| Hero | New image; CTAs (hero, bridge, sticky) move to brand green `#1a7f4f` with new copy ("Get ahead, risk-free for 100 days" direction); Trustpilot logo; no "nootropics" anywhere | Pinterest image, Trustpilot logo |
| 01 Composure | Copy stays. Bar graph with athlete photos under the bars (main-site athlete pattern, e.g. Bamford) | Athlete photos exist in `public/caseStudies/` |
| 02 Motivation | You're not lazy, your brain isn't built for the pace of change. "To-do list melting away" visual (Magic Mind style). Expert voice: Dr James Morehen (England Rugby performance nutritionist), "fuel gap" quote with headshot. Keep ingredient tiles | Signed-off quote wording |
| 03 Memory | Your memory isn't getting worse, you take in more information than any generation before. Brain adapts 7x faster before 25. Shane quote with Skyscanner logo; "Official Brain Performance Partner of Bristol Bears" lockup | Skyscanner logo, Bristol Bears lockup, source for "7x" |
| 04 Caffeine Index | Absorbs Convenience and Value: coffee vs CONKA tile reframed around caffeine, plus the rebuilt routine image | Routine image re-render |
| 05 Guarantee | Try CONKA for 100 days; if you don't like it, your money back | |
| Confidence | "Why are we so confident?" then a carousel of 7 / 30 / 90-day CognICA score change, CONKA users vs non-users | CognICA data (Rudh sourcing) |

**Routine image values** (`design/listicle-assets/routine.html`): "Flow first. Clear before it counts." / FLOW · Shot before screen · Start the day composed and in control / CLEAR · The 5 minutes before the important meeting · Sharp on demand, when it counts / Zero caffeine · No powders · No capsules. Drops "afternoon", "the fog lifts" and "no crash".

**Round 2 follow-ups (28 Sep):** "Why are we so confident?" and "Prove It to Yourself" merged into reason 6 (trial cards, then the guarantee and app buttons in one bar; the app score tile is gone). Jack Willis proof feature removed, since athletes now lead reason 1.

**Bristol Bears lockup (pending):** the club wordmark is at https://www.bristolbearsrugby.com/wp-content/uploads/2023/03/Footer-Logo.svg (removed from `public/logos/` until the lockup is built).

## Round 3: Henry's Figma notes (29 Sep 2026)

Source: Figma `zz2DcQuRiX19WFtRUNc0Ml` (annotated mobile screenshots). Built on `productivity-v2` only; the live `productivity-listicle` copy is untouched.

- **Fixed reason shape:** tag, headline, short body, one visual, bold payoff. Social proof sits between reasons as bands, never inside one. Ingredient tiles and the Morehen pull quote are gone from the reasons.
- **Hero:** "The Viral Brain Shot That Keeps You Sharp All Day." (static ads convert when naming the product like social proof), shorter subcopy, Trustpilot wordmark in place of the counts, "Thousands" instead of "5,000+", logo band "Improving brain performance at:" alternating corporate (Nike, Revolut, Skyscanner, Goldman Sachs, BA, Equinox) and big-name sport.
- **01:** focus chart zoomed (axis from 90), no caption repeating the stat.
- **02:** "Motivation Comes From a Fuelled Mind" (ad data: "not lazy" gets no traffic). Visual is the Morehen quote card: "Performance Nutritionist", England Rugby crest, Henry's quote wording.
- **03:** "Feeling Slow? Your Brain Is Just Overloaded.", payoff "CONKA Clear supports the moments that count."
- **04:** routine image V4: "5 minutes before the big moment", "0 Caffeine. 0 Sugar. 0 Calories."
- **05:** "toll on your brain", plus "CONKA works 18.1% better than caffeine*" (Alpha-GPC vs caffeine, DOI 10.1186/1550-2783-12-S1-P41).
- **06:** "Tested by the Best. Built for You." Athlete cards moved here (Bamford, Jack Willis, Finn Russell alternating with Revolut and Bank of America). Trial cards simplified to one format (who, figure, zoomed two-bar chart), detail links to `/app-insights` until trial write-ups exist there.
