# AEO Content Shape (SEO/AEO Phase 9)

**Jira:** SCRUM-1149
**Status:** In progress (structural pass + /app-insights evidence underway; narrative BLUF section-by-section)
**Design system:** brand-base (all six pages; no premium- classes, no migration)

## Problem

The content pages read as marketing prose that warms up before making its point and leans on cross-paragraph pronouns ("it", "this", "he"). Answer engines (ChatGPT, Perplexity, Google AI Overviews) grab the top of a text block and read passages in isolation, so those sections never get quoted or cited. This retrofits the shape, answer-first openings, self-contained passages, and honest review dates, without changing the substance.

Acquisition play: organic and AI-answer-engine discovery surfacing CONKA in cited answers. Indirect CRO, not a funnel change.

## In-scope pages

`/science`, `/why-conka`, `/ingredients`, `/our-story`, `/app`, and `/app-insights` (added this pass). `/faq` is already BLUF and is excluded.

## Requirements

1. **BLUF openings** — each major section leads with the direct answer or claim in its first sentence, reasoning after.
2. **Self-contained passages** — each paragraph names its subject ("CONKA Flow", "Ashwagandha", "Humphrey") rather than relying on a pronoun pointing back to an earlier passage.
3. **Honest freshness** — a visible "Reviewed <month year>" line per page, set only where a real review happened. Resolved governance gate: Rudh is the content owner and reviews each page as it is restructured, so July 2026 is honest for pages we actually pass through.

## Evidence leverage (light, per decision)

Source of truth: `CONKA_RealWorld_Evidence_Report.pdf` (APP-01 to APP-05; 712 users, 7,593 tests, 30 months). Its own citation and publishing note name `https://www.conka.io/app-insights` as its intended home.

Light approach chosen (not a full buildout):
- Sharpen evidence already on `/app-insights` and `/science` into answer-first, quotable lines.
- Add the instrument-validation stats where they strengthen an existing section: FDA-cleared, 93% sensitivity, 87.5% test-retest reliability, validated across 14 NHS Trusts (ADePT Study, PMC10533908; HRA ISRCTN95636074).
- Add the coffee-vs-CONKA finding (coffee alone approximately flat; lifts tracked with CONKA logging) where it fits.
- Add a downloadable-PDF citation link on `/app-insights`.

Full evidence-report presentation (the five patterns, figures, first-class white-paper asset) is deliberately deferred to a separate follow-up ticket, closer to Phase 6, not folded into Phase 9.

## Approach and phasing

- **Phase 9a (active, solo):** `ReviewedDate` component + safe mechanical fixes across the six pages (pronoun to named subject, promote an existing claim sentence to the lead, wire in freshness lines) + light `/app-insights` evidence sharpening and the citation link.
- **Phase 9b (active, section-by-section with Rudh):** interpretive BLUF rewrites of narrative copy on `/our-story` and `/app`, one section at a time, Rudh directing.
- **Future (separate ticket):** full evidence-report presentation / downloadable white-paper flow on `/app-insights`.

## Key components and data

- New: `app/components/ReviewedDate.tsx` (freshness line, `onLight`/`onDark` tone, machine-readable `<time>`).
- Copy lives in data files as much as prose: `app/lib/scienceData.ts`, `storyData.ts`, `whyConkaData.ts`, `formulaContent.ts`, `appInsightsData.ts`, plus section components under `app/components/{science,why-conka,ingredients,our-story,appv2,insights}/`.

## No-gos

- No new pages, no net-new marketing content beyond the light evidence leverage above.
- No claim meaning changed. Any sharpened claim moved to a lead sentence is more prominent, so a `/review-claims` pass is warranted afterwards; Rudh owns the compliance sign-off.
- Do not batch-rewrite brand narrative from Claude's own interpretation; narrative BLUF is section-by-section with Rudh.

## Rabbit holes

- Freshness dates on unreviewed pages. Only stamp a page we actually pass through this session.
- Evidence buildout scope-creep. Kept to light leverage + citation link; full report presentation is a separate ticket.
- Ingredient disclosure policy still applies: no per-ingredient mg or formula-share percentages in client code; study doses are labelled as the study's, never "per serving".

## References

- `docs/seo-aeo/README.md` (Phase 9 row; freshness governance gate).
- `docs/features/FAQ_SYSTEM.md` (schema == visible, claims anchors).
- Source PDF: `CONKA_RealWorld_Evidence_Report.pdf`.
