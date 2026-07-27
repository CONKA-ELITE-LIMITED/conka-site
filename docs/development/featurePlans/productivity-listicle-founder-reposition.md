# Productivity Listicle - Founder Reposition

**Status:** Scoped, not started
**Scale:** B (standard, ~1.5-2 days, mostly collaborative copy)
**Owner file:** `app/lib/landings/productivity-listicle.ts`
**Design language:** Simple DTC (acquisition surface)
**Related:** SCRUM-1176 (proof-tier rebuild + productivity athlete cutout TODO), `docs/analytics/LISTICLE_PERFORMANCE.md`

## Problem

The productivity listicle keeps only **17%** of tracked entries past the first fold, versus 45% (ADHD) and 35% (brain-ageing). It is the weakest opening of the three persona listicles. The paid traffic arrives from founder-driven Meta creative (two founders, Humphrey talking-head, Olympic-training origin) that sells an emotive, personal story, then lands on a clinical mechanism hook ("the 11am fog... it's a fuel problem"). That message-match break bounces people before any proof loads.

The page still pulls the most raw purchases of the three (6 in the 24-27 Jul window) but on middling CVR (1.0%). The volume is doing the work, not the page. On-page CTA clicks concentrate in the hero and the persistent sticky bar, so the body reasons' real job is retention (keeping people scrolling far enough for the sticky bar to catch them). That is exactly where this page fails.

Two structural weaknesses:
1. **The hero is weak** and does not match the founder-led ad.
2. **The reasons fall flat** - they read as generic caffeine-versus-focus comparisons rather than anything that resonates with the persona.

## Who it serves

Cold Meta traffic from founder-driven creative: the "life juggler" who is doing a great deal and wants to do it well, without socialising or bad nights taxing their ambition.

## Business impact

Fixing the first fold lifts the retention that feeds the sticky bar (where clicks actually happen), so the same ad spend converts harder. Directly serves acquisition CVR. The clean, first-party signal to watch post-change is first-fold retention (17% baseline); Meta-attributed purchases are directional only at this n.

## Approach

Double down on the listicle format ("X reasons why [persona] [outcome] on CONKA"). Keep the proof skeleton that actually sells (stats band, review strip, app-proof, guarantee). Reposition the **hero + first fold** into founder-origin and life-juggler emotion, and rewrite the reasons so they stop being generic caffeine fights and become persona-resonant (doing more and doing it well, socialising without the tax, the founders' cheat code). Reposition the entry and re-skin the reasons; do not rebuild the page into a story.

Copy is the substance of this work and is written collaboratively, informed by AnswerSocrates keyword research on the productivity / "doing it all" / founder terms.

## Constraints (from research)

- **No founder-story block exists** and `quoteBand` was removed. A founder narrative is composed from existing pieces: `reason` blocks carrying a founder `image` asset, the `athleteQuote` asset (repurposed for a founder quote), and the proof-tier `feature`. A bespoke founder block would be net-new component work (Future).
- **Hero renderer is image-only** (`ListicleRenderer.tsx` branches `kind==="image"` explicitly). A founder photo hero is zero-code. A talking-head video hero needs a renderer change and a sourced clip we do not have (Future).
- **Assets on disk:** `/TwoFounders.jpg` (both founders, hero pick), `/lifestyle/CreationOfConka.jpg` (origin), `/lifestyle/GirlsLaughing.jpg` (social), `/lifestyle/ConkaAtWorkDesk.jpg` (juggling). No Humphrey/Harry talking-head still or solo founder video exists.
- **Story material is canonical** in `app/lib/storyData.ts`: Harry Glover (England Sevens / Olympic rugby) and Humphrey Bodington (career ended by concussions) built the research at Durham, invested GBP 500K+ own capital, collapsed 14 capsules per day into one shot, tested with Cambridge cognitive technology across 25+ trials at +16% versus placebo. "Olympic Training Programmes" is a listed tested environment.

## Recommended new arc

| Slot | Now | Proposed |
|------|-----|----------|
| Hero | "11am fog... fuel problem", desk photo | Founder photo (`TwoFounders.jpg`) plus founder / life-juggler headline and subcopy. Keep counted listicle title. |
| Reason 1 | CONKA focus beats caffeine (crashChart) | REPLACE with founder-origin "cheat code": Harry built it with Humphrey while training as a full-time Olympic athlete. Founder `image` asset. This is the bounce fix. |
| Reason 2 | Stay sharp through the afternoon | REFRAME to the life-juggler: doing a lot and doing it well; keep the afternoon-hold proof underneath. |
| statsBand | keep | keep |
| Reason 5 (booze / bad nights) | buried at slot 6 | MOVE UP and reframe to socialise without the tax: do not let a big social life cost you your ambition. Same ingredient stack. |
| Reasons 3 / 4 / 6 / 7 (compounds, app-proof, trials, guarantee) | keep | keep - the proof spine, de-genericised where a reason reads as a plain caffeine comparison. |
| Proof `feature` | Jack Willis placeholder | Founder quote (Humphrey), coordinated with SCRUM-1176. |

Founder split: Harry anchors the origin reason (the Olympic "cheat code" is his story); Humphrey anchors the proof-feature quote (the ads use his talking-head). Both then appear.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Hero + first-fold reposition (founder-photo hero, founder-origin Reason 1) | Not Started |
| 2 | Thread angles + resequence + de-genericise reasons + founder proof quote | Not Started |
| 3 | Talking-head video hero (renderer change + sourced clip) | Future |
| 4 | Bespoke founder-story block (portrait + multi-beat + pull-quote) | Future |

### Phase 1 tasks

1. **Copy (collab) - Hero + Reason 1.** Run AnswerSocrates on productivity / "doing it all" / founder terms with the user; agree H1 (keeps counted listicle form), subcopy, and the founder-origin reason copy. Complexity: Medium (the real work). Files: none yet.
2. **Config - Hero asset + copy.** Swap `hero.asset` to `TwoFounders.jpg` (image, zero-code), update `title` / `headline` / `subcopy`. Small. `productivity-listicle.ts`.
3. **Config - Reason 1 replace.** Founder-origin "cheat code" reason with a founder `image` asset. Small. `productivity-listicle.ts`.

### Phase 2 tasks

4. **Copy (collab) - life-juggler + socialising reasons.** Co-write; kill generic caffeine framing where it does not serve the persona. Medium.
5. **Config - resequence + reframe.** Reorder the `body` array, reframe reasons 2 and 5, renumber `n`. Small. `productivity-listicle.ts`.
6. **Proof feature to founder quote.** Coordinate with SCRUM-1176 to avoid colliding on the proof tier. May need a non-athlete variant in `ListicleRenderer.tsx`. Small.
7. **Analytics continuity.** Confirm section-tracking labels still fire cleanly after the reorder so first-fold retention is re-measurable against the 17% baseline. Small.

## Rabbit holes

- **Story mode swallowing the sell.** Cap founder narrative at hero + 1-2 reasons; the proof spine stays.
- **Building a founder block.** Compose from `reason` + `image` / `athleteQuote` + proof `feature`. A new component is Phase 4, not now.
- **Video hero.** Renderer change plus a missing asset. Explicitly Phase 3.

## No-gos

- No renderer video work this pass.
- No new bespoke block this pass.
- No touching the classic-PDP CTA routing (separate, larger lever tracked in `docs/analytics/LISTICLE_PERFORMANCE.md`).
- Not moving off the listicle format - the counted "X reasons" structure stays.

## Risks

- Attribution is Meta-looser and n is small (6 purchases), so read any purchase re-test as directional. Track first-fold retention (first-party) as the real signal.
- The founder photo must read as "founders," not stock. Confirm `TwoFounders.jpg` crops well at the hero aspect on mobile (390px).

## Jira tickets

| Key | Title | Phases | Status |
|-----|-------|--------|--------|
| SCRUM-1187 | [Website & CRO] Productivity listicle: founder reposition of hero + reasons | 1 + 2 (active) | To Do |

- Epic: SCRUM-763 (Website & CRO). Sprint 29.
- Linked "Relates to" SCRUM-1176 (proof-tier rebuild) - coordinate on the proof `feature` swap.
- Phases 3 and 4 are Future; not ticketed.
