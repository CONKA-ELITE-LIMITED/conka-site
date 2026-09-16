# /app page: "See CONKA working"

Scoped 2026-09-16. Tracking: Jira, one ticket per phase (see Phase table).

## Problem

`/app` reads as a clinical exam in App-Dark: "Gold Standard", "can't be gamed", the concussion story first. It scares away the people it should recruit.

The email-gated practice test already exists, but the email trap catches nothing:

- The email reaches Klaviyo only after the test completes, as the "Website Short Test Submitted" event. Anyone who enters an email and drops out is lost.
- The email is never added to a list and no marketing consent is recorded. `$first_name` is set to the email address.
- Nothing on the page is tracked: test clicks, email submits, results and store clicks fire no events, so we cannot see the funnel at all.

## Positioning

**Job of the page, in order:** 1) app download (acquisition), 2) email capture via the test, 3) CONKA purchase through credibility.

**Narrative (direction B, system-first):** the app is how you *see CONKA working*. We are moving away from "test for life". What matters is the early moments: take a baseline, start CONKA, retest. Those first weeks are the proof moment for the product and the CONKA experience.

**What a visitor should leave knowing:**
1. The app is free and gives you a baseline in about a minute. Not an exam.
2. Your score moves, and the first weeks on CONKA are where you see it.
3. The measure is serious (Cambridge-origin science, 5,000+ tests), stated lightly.
4. Real people's first 30 days, as proof.

**Aesthetic:** light, friendly, in the spirit of Oura (`ouraring.com/why-oura`, fanned phone screens on a warm light ground) and Bevel (`bevel.health`, soft pastel cards, one short headline, one line, one phone). Real phone screens sell the app.

## Design language

**Simple DTC, light.** `/app` leaves App-Dark. No new design language: Simple DTC gets close to Oura/Bevel with softer tints and calmer motion. `DESIGN_SYSTEM.md` §8.5/§10 update to match.

The motion reference in `MOTION_GUIDE.md` moves off `/app` to `/science` if its rebuild uses the shared helpers in `app/lib/motion.ts`, otherwise home. Confirm during Phase 2.

## Phases

| Phase | Description | Ticket |
|-------|-------------|--------|
| 1 | Test capture + funnel tracking (website) | SCRUM-1360 |
| 2 | /app redesign, section by section (website) | SCRUM-1361 |
| 3 | /science tracking: section reach + purchase `src` (website) | SCRUM-1362 |
| 4 | conka-lab ingestion of the /app and /science events (conka-lab repo) | SCRUM-1363 |
| Future | Website baseline carries into the app | Future |
| Future | Restyle `/app-insights` and the home app USP section | Future |
| Future | Put the test in front of paid traffic | Future |

Appetite: roughly 5 to 6 days total. Phase 1 about a day, Phase 2 three to four days, Phases 3 and 4 about half a day each.

## Phase 1: Test capture + funnel tracking

1. **Klaviyo list add at email submit** (Medium)
   - On email submit (before the test runs), add the profile to the master list `WBbMia` with consent, using the same consent pattern as SCRUM-1342. Tag `source: app_test`.
   - The "Website Short Test Submitted" event at the end stays: it carries the score metadata.
   - Stop setting `$first_name` to the email address.
   - Files: `app/components/cognitive-test/EmailCaptureForm.tsx`, `app/lib/klaviyo.ts`, `app/api/klaviyo/track-test/route.ts`, possibly `app/api/klaviyo/subscribe/route.ts`.
2. **Funnel events** (Small). Vercel Analytics, max two properties each, added to `app/lib/analytics.ts`:
   - `app:test_clicked`: the visitor starts the test flow.
   - `app:email_submitted`: the email gate is passed.
   - `app:results_viewed`: the score screen renders.
   - `app:store_clicked`: `platform` (ios / android), `location` (semantic placement id).
   - Pageviews come free. Files: `app/components/cognitive-test/*`, `app/components/AppInstallButtons.tsx`.
3. **Verify** (Small). One real signup end to end: profile on `WBbMia`, consent recorded, `source` set, score event still arrives. Each event visible in Vercel.

## Phase 2: /app redesign

Built one section at a time, with a visual review and commit per section. Needs 4 to 6 clean, current app screenshots (home score, test, results, trend, one feature), supplied at the start of this phase.

1. **Hero: "See CONKA working."** Fanned phone screens. Primary CTA download, secondary "Try the test".
2. **The loop: Baseline, CONKA, Retest.** Three pastel cards with a phone each (Day 1 baseline, Day 14 first shift, Day 30 your trend).
3. **Get your baseline.** The email-gated test, restyled around the Cognetivity iframe. Warm gate copy, drop the Clinical labels ("Step 01 · Email", "Fig. 07").
4. **Why the score is worth trusting.** Cambridge-origin science, 5,000+ tests, Humphrey's origin as one line.
5. **Proof: real first 30 days.** Score gains from `app/lib/caseStudiesData.ts`.
6. **More in the app.** Apple Health, patterns, rewards as feature cards.
7. **Final download CTA** plus a CONKA product link.
8. **Cleanup.** Remove the pinned scroll journey and progress rail, update metadata, update `DESIGN_SYSTEM.md`, `MOTION_GUIDE.md`, `PAGE_NARRATIVES.md`.

Files: `app/app/page.tsx`, `app/components/appv2/*` (restyle or replace), `app/components/cognitive-test/*` (styling and copy only), `app/components/AppInstallButtons.tsx`.

## Phase 3: /science tracking

Replaces the click count with the two questions that matter: how far people read, and whether reading leads to a purchase.

1. `science:section_viewed` (`section`), once per section per pageview, same pattern as `pdp:section_viewed`.
2. /science CTAs append `?src=science-<location>`. Fix `getPurchaseSource` in `app/lib/analytics.ts` so a science token does not report as `listicle` (it currently treats any valid `src` as a listicle).
3. Remove `science:cta_clicked` and `ScienceTrackClick` once the above is live.

Caveat: /science traffic is modest, so purchase attribution is a sense check, not a precise number.

## Phase 4: conka-lab ingestion (conka-lab repo)

At the very end, once Phases 1 and 3 events have data.

1. Add the `app:*` events and `science:section_viewed` to `TRACKED_EVENTS` in `convex/lib/vercelClient.ts`.
2. Add `/app` and `/science` to the tracked pages, with an /app funnel view (visitors, test clicks, emails, results, store clicks) and /science section reach.
3. Surface `science-*` purchase origins alongside listicle origins.
4. Confirm with the lab and Klaviyo that test signups land as consented profiles.

## Rabbit holes

- **The test iframe.** It is Cognetivity's; we style around it, never inside it.
- **Phone mockups.** Real screenshots in one simple phone frame. No 3D device renders.
- **Consent.** Reuse the SCRUM-1342 pattern. Do not create a second consent path alongside the Alia popup.

## No-gos

- Rebuilding the Cognetivity test engine.
- Changing `/app-insights` or the home app USP section.
- "Test for life" messaging.
- A new design language.
- Web-to-app baseline sync (Future).

## Risks

- **Screenshots gate Phase 2.** Quality of the redesign rides on them.
- **SDK host.** The test iframe loads from `conkasdkdev.cognetivity.com`. Confirm with Cognetivity that it is the production host before driving more traffic to the test.

## References

- `docs/PAGE_NARRATIVES.md` (/app entry)
- `docs/branding/DESIGN_SYSTEM.md` §8.5, §10
- `docs/development/MOTION_GUIDE.md`
- `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md`
- Prior rebuild: SCRUM-1072 to SCRUM-1075 (Done); original plan `app-page-rebuild.md` deleted in df8ea4af
- Consent pattern: SCRUM-1342

## Jira tickets

| Ticket | Title | Phase |
|--------|-------|-------|
| SCRUM-1360 | /app test: capture emails with consent at submit + funnel tracking | 1 |
| SCRUM-1361 | /app redesign: "See CONKA working" in light Simple DTC | 2 |
| SCRUM-1362 | /science tracking: section reach + purchase src attribution | 3 |
| SCRUM-1363 | conka-lab: ingest /app funnel and /science events | 4 |
