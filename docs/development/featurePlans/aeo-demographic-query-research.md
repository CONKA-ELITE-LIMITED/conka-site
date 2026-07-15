# AEO Demographic Query Research

**Status:** Scoped, plan-doc only (no Jira). Not started.
**Owner:** Rudh.
**Part of:** The SEO / AEO programme. This is the demand-input workstream that feeds the Phase 6 blog. Strategy lives in `docs/seo-aeo/AEO_PLAYBOOK.md`; the measurement instrument is `docs/seo-aeo/aeo-scorecard.md`; what is already live on-site is `docs/seo-aeo/README.md`.
**Created:** 2026-07-15.

---

## Problem

Humphrey has a blog-generation engine, and the `/blog` surface is being built (see `blog-informational-content-surface.md`), but neither has a demand-driven queue to write from. The only existing content input is the keyword map (`CONKA_SEO_Keyword_Map_v4.md`), which is a volume/KD gap-audit of head terms ("what are nootropics" KD 49, "vitamins for brain fog" KD 29), not the real conversational questions our specific demographics ask.

The July 2026 baseline (`aeo-scorecard.md`) confirmed CONKA is named in 0 of 24 answer-engine test questions and, from the retrieval side, is absent from the retrievable web for every one. The same baseline showed the incumbents (Mind Lab Pro, Magic Mind and others) win on **content volume, not proof**. So the bottleneck is no longer the on-site foundation (built, Phases 1 to 10) or the blog infrastructure (in build). It is the input: what do we point the engine at?

This phase produces that input: the mined, clustered, prioritised questions our audiences actually ask, aimed at the open lanes the baseline already found.

## Who it serves

Cold, non-brand organic searchers and AI answer engines at the top of the funnel, across the six demographics (productivity, ADHD, perimenopause, ageing brain, sport, and parents as an informational-only angle), routed to the PDPs via the blog's in-article CTAs. Pure acquisition.

## Business impact

Unblocks the cheapest acquisition channel available and reduces dependence on paid Meta traffic over time. Without this research, the blog build ships an empty machine. With it, the engine has a prioritised, demographic-targeted content queue. Success is measured against the scorecard: movement in Citation Share on the queued questions, and (secondary) non-brand organic impressions against the Search Console baseline.

## Appetite

- **Phases 1 to 2 (the research + queue):** a few days of focused research. Much of the mining can be run via search fan-out (the method already used to capture the scorecard retrieval baseline), supplemented by the community tools where depth matters.
- **Phase 3 (ongoing refresh):** a lightweight recurring monthly job owned by Rudh, not a fixed budget.

## Design system

N/A. This is a research and content-planning deliverable, not UI. The blog's rendering and design system are owned by the separate blog build (`blog-informational-content-surface.md`, brand-base).

---

## Approach

For each demographic, mine the real questions people ask (search fan-out plus the playbook's Reddit/Quora/PAA tooling where the rawest phrasings live), dedupe, and cluster by intent. Turn the corpus into a single prioritised content queue where each row is a planned post: the question becomes the post H1, tagged with demographic, intent, priority lane, related product, and a supporting keyword. Align that row format to what Humphrey's engine consumes so a queue row drops straight into a Notion draft. Feed the queued questions back into the scorecard as a new labelled cohort so new content is measured from the month it ships.

Priority uses the lane scheme already established in the scorecard:
- **P1 Winnable** — no strong branded product owns it (the open lanes: perimenopause brain fog, word-finding in your 40s, brain-health-in-contact-sport, concussion recovery). Write these first.
- **P2 Contested** — a strong brand incumbent already ranks; displaceable but harder.
- **P3 Informational-only** — locked by health-authority / academic / behavioural content with no product entry point (dementia-vs-brain-fog, Adderall off-days, all parent queries). Answer to build entity trust; do not product-target, and treat as highest claims risk.

Volume and KD from the keyword map are a **tiebreaker only**. Question-shaped demand and open lanes lead. The point is not to rebuild the keyword map.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Demand mining + clustered question corpus | Not Started (active) |
| 2 | Prioritised content queue + engine handoff | Not Started (active) |
| 3 | Ongoing refresh + feedback loop | Future |

Phases 1 and 2 are the deliverable; Phase 3 is the recurring operating cadence.

---

## Active phase task breakdown

### Phase 1: Demand mining + clustered question corpus

1. **[Research] Mine questions per demographic**
   - What: for each of the six angles, gather the real questions people ask. Search / PAA fan-out (runnable in-house, as per the scorecard baseline), supplemented by the community tools (AnswerSocrates, AlsoAsked, KeywordsPeopleUse, AnswerThePublic) where emotional phrasings matter most (ADHD, perimenopause, parents). Beachheads first (perimenopause, sport, ageing), then core (productivity, ADHD), parents as informational-only.
   - Cap: roughly 15 to 20 clustered questions per demographic. Do not chase every phrasing.
   - Dependencies: none (the scorecard's P1 lanes and the playbook's Section 7 workflow are the starting map).
   - Complexity: Medium.
   - Output: a raw question sheet per angle.

2. **[Research] Dedupe and cluster by intent**
   - What: consolidate to one sheet, deduped, each question tagged Informational / Comparison / Purchase and mapped to a demographic.
   - Dependencies: task 1.
   - Complexity: Small.

### Phase 2: Prioritised content queue + engine handoff

3. **[Content] Build the prioritised queue**
   - What: one table. Per row: question (the post H1), demographic, intent, priority lane (P1/P2/P3), related product (flow / clear / both), supporting keyword + KD/volume as tiebreaker. Beachhead P1 lanes at the top.
   - Dependencies: task 2.
   - Complexity: Medium.
   - Deliverable: in this plan doc or a linked sheet.

4. **[Content] Engine handoff contract**
   - What: confirm each queue row maps cleanly onto the Notion Blog Hub fields the engine reads (`Blog name`, `Slug`, `Meta description`, `Related products`, `Topic`, `Angle`), so a queue row becomes a draft with no re-keying.
   - Dependencies: task 3. Reference: `blog-notion-engine-brief.md`.
   - Complexity: Small.

5. **[Measurement] Add a scorecard cohort**
   - What: add the queued questions to `aeo-scorecard.md` as a dated v2 cohort. Never edit the frozen v1 set.
   - Dependencies: task 3. Reference: `aeo-scorecard.md` (freeze-and-add rule).
   - Complexity: Small.

---

## Rabbit holes

- **Over-mining.** Chasing every phrasing per demographic. Cap the set, beachheads first, ship the queue rather than perfect it.
- **Volume bias creeping back.** KD/volume is a tiebreaker only. Question-shaped demand and open lanes lead. This phase must not become a second keyword map.
- **Rebuilding the blog.** This phase produces content inputs, not infrastructure. The Notion schema, block conversion and rendering are the blog build's job.

## No-gos

- **Not building the blog surface.** Separate workstream, in build (`blog-informational-content-surface.md`).
- **Not writing the posts.** Humphrey's engine writes them from the queue; the owner publishes via the Notion `Status` gate.
- **Not the off-site corroboration workstream.** The single strongest AEO lever, but it has no code path and no owner. It stays flagged in the playbook (Section 5), not scoped here.
- **No child-directed content.** The parents demographic is informational-only, deferring to paediatricians, per playbook Section 4. No child product, imagery, or dosing.
- **No editing the frozen scorecard v1 questions.** New questions are added as a labelled cohort only.

## Risks

- **Handoff mismatch.** If the queue format does not map onto the engine's Notion input, the research does not flow through. Task 4 de-risks this early.
- **Claims exposure.** Perimenopause, dementia and ADHD questions carry the highest claims risk. The queue must carry the P3 "informational-only, do not product-target" flag so the engine and the publish-gate review treat those correctly. Blog copy is higher-risk than product copy; the Notion `Status = Published` flip is where the claims review lives.
- **Mining depth.** Search fan-out approximates community phrasing, but the rawest, most emotional questions live in Reddit and Quora. The plan notes where the paid community tools add real depth beyond an in-house search pass (especially ADHD, perimenopause, parents).
- **Refresh ownership.** Phase 3 is owned by Rudh. If the monthly refresh lapses, the queue goes stale and the scorecard feedback loop never closes.

## Resolved during scoping

- **Scope is the demand input, not the whole AEO operating system.** The blog surface is in build and the engine exists; the missing piece is the demographic question research that feeds the engine. This phase is that research plus the queue and handoff, nothing wider.
- **Owner of the recurring refresh (Phase 3):** Rudh.
- **Phase 1 is a task to be picked up later**, not run inline during scoping.
- **Priority scheme reuses the scorecard's P1/P2/P3 lanes** rather than inventing a new one.
- **Tracking:** plan-doc only, no Jira. Internal research/content-ops work rather than a website feature.

## Open questions

- **Community-mining depth for Phase 1:** run what is possible via in-house search fan-out first and mark where the paid tools (AnswerSocrates / AlsoAsked / KeywordsPeopleUse) would add depth, or wait until the full paid pass can be run. A start-with-fan-out approach gets a usable queue sooner; the paid pass sharpens the ADHD / perimenopause / parents phrasings later. Decide at task 1.

## References

- Strategy and audience mapping: `docs/seo-aeo/AEO_PLAYBOOK.md`
- Measurement instrument and the baseline this feeds: `docs/seo-aeo/aeo-scorecard.md`
- What is live on-site (foundation, Phases 1 to 10): `docs/seo-aeo/README.md`
- The blog surface this queue feeds (in build): `docs/development/featurePlans/blog-informational-content-surface.md`
- The engine-facing Notion contract (handoff target): `docs/development/featurePlans/blog-notion-engine-brief.md`
- Keyword map (volume/KD source to mine from, tiebreaker only): `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- SEO/AEO programme master plan: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`

## Jira

None. Plan-doc-only tracking by decision (internal research/content-ops work). Convert to tickets only if the work later needs cross-team coordination.
