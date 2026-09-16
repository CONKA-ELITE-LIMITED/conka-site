# Science page narrative rework

Rework `/science` so a sceptic gets "does it work, and why?" in 60 seconds, with depth on tap for anyone who wants the sources. Move the page from Clinical to Simple DTC so it matches the rest of the site, and align its story with the home "Why CONKA exists" accordion.

Branch: `feature/science-page-narrative`

## Problem

`/science` has the right content in the wrong shape. It is dense, it uses the Clinical treatment (mono labels, square cards, "SCI-01" / "Fig. 01" tags) that the rest of the site has moved away from, and it leaves out our strongest evidence. The page leads its proof with the Revolut pilot (n=9) while the Harlequins randomised, double-blind, placebo-controlled trial (+14.86%, 80% improved) already runs on the PDP buy panel and all three listicles.

## Who it serves and why it matters

Data, production, 17 Aug to 16 Sep 2026 (Vercel Web Analytics):

| Metric | Value |
|--------|-------|
| `/science` visitors | 232 (292 pageviews), about 1.3% of site visitors |
| Referrer | 210 no referrer (direct or internal nav), 17 Google, 5 DuckDuckGo |
| Device | 64% desktop, 35% mobile |

So `/science` is a **consideration page for interested sceptics** who click "Science" in the nav, footer or from a PDP, not a traffic page. A better page lifts clicks through to the PDPs, but the absolute impact is modest. The larger upside is that the proof and explainer sections built here become portable modules for the PDPs and listicles (Future phase), where the traffic is.

Search context from existing SEO docs: about 3.8k impressions at position 5.1 with 0.6 to 0.7% CTR, attributed to the title and meta description.

## Approach

- Rebuild the page around the same arc as the home accordion (`app/lib/homeWhyContent.ts`): challenge, solution, how it works, research, measure it yourself.
- Two layers. The **top layer** is scannable: stats, icons, short copy, under about 150 words per section. The **depth layer** (doses, study design, references) sits behind accordions but stays in the server-rendered HTML for SEO and AEO.
- Credibility through study design shown as tags (randomised, double-blind, placebo, n=, duration), sources one click away, and university partner logos. Not through word count.

## Design language

**Simple DTC throughout.** Remove the `.brand-clinical` wrapper from `app/science/page.tsx`. This changes doctrine: update the per-surface authority table in `docs/branding/DESIGN_SYSTEM.md` §8.5, which currently assigns science surfaces to Clinical.

## Page arc

| # | Section | Home accordion row | Top layer | Depth layer |
|---|---------|--------------------|-----------|-------------|
| 1 | Hero | - | Answer-first H1 + BLUF passage; stat strip (+14.86% vs placebo, 80% improved, £500k+, 25+ clinical trials); trust icons | - |
| 2 | The challenge | 1 Challenge | 3 icon cards: fragmented attention, the caffeine crash, what most brain products get wrong; coffee vs CONKA app stat ("coffee alone barely moved measured cognition") | Sources + observational caveat |
| 3 | What are nootropics and adaptogens? | 2 Solution | One-sentence definition each (nootropics = today, adaptogens = over weeks), what they are made of, why nature makes these | Per-ingredient dose, benefit, reference |
| 4 | How CONKA works | 3 How it works | Flow AM / Clear PM, key actives per shot, links to PDPs | Full actives + references |
| 5 | The proof | 4 Research | Harlequins featured card (tags + CONKA vs placebo bar), Bristol Bears and Revolut secondary cards with honest design tags, Exeter as "in progress", university logos | Trial detail, ingredient references |
| 6 | The people | - | Named scientists by role, with photos | - |
| 7 | Measure it yourself | 5 Measure | Free app cognitive test; "7,593 tests across 712 people" credibility line | - |
| 8 | CTA | - | Flow + Clear together card (home accordion CTA pattern); `ReviewedDate` | - |

## Phases

| Phase | Description | Ticket |
|-------|-------------|--------|
| 1 | Spine + proof | SCRUM-1351 |
| 2 | Education | SCRUM-1352 |
| 3 | The people (starts when scientist assets land) | SCRUM-1353 |
| Future | FAQ + FAQPage JSON-LD; port proof card and nootropics/adaptogens explainer to PDPs and listicles; migrate PDP/listicle/home stats onto the shared content source | Future |

Build section by section: one section, visual review by the user, then commit.

### Phase 1: Spine + proof

1. **Data - `app/lib/scienceContent.ts`**
   - What: single source for stats (from `docs/conkaAppData/HIGH_LEVEL_STATS.md`), trial cards, references and section copy. Delete dead `app/lib/scienceData.ts` and `app/components/science/SynergyChart.tsx` (verify unreferenced first).
   - Complexity: Small
2. **Icons - extend `app/components/landing/icons.tsx`**
   - What: flask, brain, shield, people, chart, placebo icons in the existing inline SVG style. No icon library (`react-icons` is installed but unused; do not adopt it).
   - Complexity: Small
3. **Page - remove Clinical, mechanical DTC pass**
   - What: drop `.brand-clinical`; apply the §8.5 clinical-to-DTC map to the sections not yet rebuilt so the page is coherent at every deploy.
   - Files: `app/science/page.tsx`, `app/components/science/*`
   - Complexity: Medium
4. **Hero rebuild**
   - What: answer-first H1 + BLUF passage, stat strip, trust icons, replace `/lifestyle/CreationOfConkaBlack.jpg` with an existing SCRUM-1348 render.
   - Files: `app/components/science/ScienceHero.tsx`
   - Complexity: Medium
5. **Proof section**
   - What: featured Harlequins card with design tags and a CONKA (+14.86%) vs placebo (-0.69%) comparison bar; Bristol Bears (vs own baseline) and Revolut (real-world) secondary cards; Exeter as "in progress" with design only, no results; university logos; depth layer via native `<details>` or the HomeWhyAccordion `grid-rows` pattern. Replaces `EvidenceLadder`.
   - Complexity: Large
6. **CTA + analytics**
   - What: Flow + Clear together card linking to `/conka-both`; `science_cta_click` Vercel Analytics event with `location`; keep `ReviewedDate`.
   - Complexity: Small
7. **SEO + docs**
   - What: title and meta description rewrite; §8.5 authority table; `/science` entry in `docs/PAGE_NARRATIVES.md`; `docs/CHANGELOG.md`.
   - Complexity: Small

### Phase 2: Education

1. **The challenge** - replaces `ScienceDifferent`. 3 icon cards + coffee vs CONKA stat with caveat line (source `docs/conkaAppData/coffee-conka-cognition-report.md`). Medium.
2. **What are nootropics and adaptogens?** - replaces `TwoSystemModel` + `ScienceEducation` / `ScienceAdaptogens` / `ScienceNootropics` / `ScienceExplainer`. Answer-first definitions that double as AEO passages; ingredient depth layer with one human study per active, the study's dose and a PubMed link (from `app/lib/ingredientsData.ts`, never our own amounts). Large.
3. **How CONKA works** - replaces `RealisedSolution`. Actives named without amounts. PDP links. Medium.
4. **Measure it yourself** - science-specific DTC section; `AppInsightsCallout` stays untouched for `/app`. Small.
5. **Cleanup** - delete replaced science components and update `app/components/science/index.ts`. Small.

### Phase 3: The people

- Named scientists by role in the research (not a scientific board or ambassadors), with photos. Blocked on the user sourcing assets. Founders stay out; that story belongs on `/our-story`.

## Decisions

| Decision | Rationale |
|----------|-----------|
| Simple DTC, no Clinical | Page diverges from the rest of the site; depth layer carries the evidence density instead of the visual treatment |
| `HIGH_LEVEL_STATS.md` is the source of truth for figures and framing | Supersedes the retired science-rebuild plan's wording rules; "proven against placebo" follows the PDP precedent |
| Lead proof with Harlequins | Only randomised, double-blind, placebo-controlled trial; already the lead stat on PDP and listicles |
| Reuse "£500k+" and "25+ clinical trials" verbatim from `homeWhyContent.ts` | Consistency with home |
| Exeter shown as "in progress", no results | Still unpublished (confirmed 16 Sep 2026) |
| Coffee vs CONKA app data in the challenge section, with observational caveat | Our own data, directly on-message against caffeine |
| No amounts from our formula at all: no per-shot totals and no per-ingredient mg | Per-ingredient amounts are patented (with the total they are the formula) and the totals are disputed (`docs/TODO.md` item 9). The ingredient depth layer shows each study's dose, labelled as the study's, which the formula disclosure rule allows. This replaced the original per-serving dose wording in SCRUM-1352 |
| No people section until assets exist, no founders | No placeholders; founder story lives on `/our-story` |
| Standing rules kept | No formula-share percentages; Durham fly trial never presented as human evidence; BLUF passages and `ReviewedDate` survive (SCRUM-1149); `/ingredients` stays separate |

## Rabbit holes

- **Stat reconciliation across surfaces.** PDP, listicles and home each hard-code figures. Only `/science` consumes `scienceContent.ts` in this work; migrating others is Future.
- **Depth-layer creep.** Sources, doses and study design only. No full-paper dumps (the Magic Mind failure mode: detail exposes weak designs and buries strong ones).
- **Disputed mg totals.** Dropped, so no dependency on the formulator.

## No-gos

- No new photography; use existing renders.
- No changes to `AppInsightsCallout` or `/app`.
- No merge with `/ingredients`.
- No A/B test; volume is too low. Judge on CTA click-through and qualitative review.

## Risks

- Mobile at 390px: stat strip and trial comparison bar must stay legible; tap targets on accordions at least 44px.
- Removing `.brand-clinical` changes radii and typography on every un-rebuilt section at once; the Phase 1 mechanical pass must catch invisible text and broken layouts before deploy.
- Accordion content must remain in the HTML (no conditional render) so the depth layer stays indexable.

## Measurement

- `science_cta_click` events / `/science` visitors, before vs after (no baseline event exists today, so the first two weeks after Phase 1 set it).
- Organic CTR on `/science` in Search Console after the title and meta rewrite.

## Research references

Competitor patterns studied 16 Sep 2026:

- **Nomio** (`drinknomio.com/en-gb/pages/science`): people first (named scientists, institutions), study cards with plain-English title + design tags + one finding, sources as links.
- **Neutonic** (`neutonic.com/en-us/pages/what-are-nootropics`): definition in the first sentence, then a four-group "what they are made of" breakdown.
- **The Functional Mushroom Co.**: a "why nature makes these" story makes an unfamiliar category intuitive.
- **Magic Mind**: headline stats in two formats (average change and % who improved) are worth stealing; the full-paper dump is not.

## Related docs and code

- `docs/conkaAppData/HIGH_LEVEL_STATS.md` - trial figures and framing
- `app/lib/homeWhyContent.ts`, `app/components/home/HomeWhyAccordion.tsx` - messaging and accordion pattern
- `docs/branding/DESIGN_SYSTEM.md` §8.5 - Simple DTC spec and clinical-to-DTC map
- `docs/PAGE_NARRATIVES.md` - `/science` entry
- `docs/branding/BRAND_VOICE.md` - proof table and copy rules
- Prior rebuild: SCRUM-1067 to SCRUM-1070, SCRUM-1076 (plan retired, recoverable from git history as `science-page-rebuild.md`)

## Jira tickets

| Ticket | Title | Phase |
|--------|-------|-------|
| SCRUM-1351 | Science page Phase 1: Simple DTC spine, hero and proof section | 1 |
| SCRUM-1352 | Science page Phase 2: challenge, nootropics and adaptogens explainer, how CONKA works, measure it yourself | 2 |
| SCRUM-1353 | Science page Phase 3: the people behind the research | 3 |
