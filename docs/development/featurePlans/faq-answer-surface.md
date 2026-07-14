# FAQ Answer Surface

**Status:** Scoped, not ticketed. Plan doc only.
**Owner:** Rudh
**Part of:** The SEO / AEO programme (`docs/development/featurePlans/seo-aeo-metadata-foundation.md`). This is **Phase 10** of that programme, and the first phase whose bottleneck is content rather than code.
**Source inputs:** internal FAQ inventory and competitor benchmark, both run 2026-07-14 (findings below); `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`; `docs/analytics/seo-search-console-baseline.md`.
**Created:** 2026-07-14

---

## Problem

**Our FAQs are good at their job. Their job is the wrong one.**

We have 20 FAQ questions on indexable pages. Every one is written to close an objection for a visitor **already on the page**. Not one is written to answer a question someone **typed into a search box**. Those are different jobs, and only the second one earns an AI citation.

Three faults, all verified against the code and against live search results.

### 1. We do not answer the questions people actually ask

The demand-side research found the highest-confidence question clusters in this category are: **efficacy scepticism** ("do nootropics actually work", "is it placebo", "are the doses underdosed"), **safety and eligibility** ("are nootropics safe", "side effects", "can you take them with antidepressants", "are they addictive", "pregnant/breastfeeding"), **price** ("why is X so expensive"), and **tolerability** (taste, allergens, alcohol, drug tests).

Against that list, the site has:

- **Zero** questions about side effects. Not one, anywhere.
- **Zero** about who should not take CONKA.
- **Zero** about dependency, long-term use, or what happens when you stop.
- **Zero** about price.
- **Zero** about taste, allergens, or storage.
- The only medication question (`"Can I take CONKA alongside my ADHD medication?"`) lives on a **noindex** ad lander and its answer is "check with your GP". A non-answer, on an invisible page, to the exact person the page targets.

Meanwhile our single strongest trust asset, **Informed Sport certification against 280+ banned substances**, answers a real searched question ("will it show up on a drug test?") and appears **only on `/professionals`**. It is on none of the three consumer PDPs.

### 2. We contradict ourselves, which is how a source loses a citation

The same 7-question set exists in **three separate files**: `app/lib/faqContent.ts`, `app/lander/sections/FAQ/faq.data.ts`, and a byte-identical clone at `app/(trial-b)/lander-b/sections/FAQ/faq.data.ts`. Editing the canonical one silently does not update `/lander`.

Worse, the answers have drifted apart:

| Question | Answer A | Answer B | Answer C |
|---|---|---|---|
| Can I take it with coffee? | Flow PDP: use CONKA *instead* of coffee | Home FAQ: it works *alongside* your coffee | Productivity lander: yes, but you will drink less |
| How long until results? | Home: Day 1 / Day 14 / Day 30, +28.96% | Flow PDP: "within the first week", "2 to 4 weeks" | Listicles: "within minutes" |
| What if it doesn't work? | 100 days, no returns needed | Lander: expanded version | Listicles: a looser "risk-free" phrasing |

An answer engine reading our site cannot form a confident, consistent claim about CONKA. Inconsistency is precisely what stops an LLM citing a source.

### 3. We are structured but silent; the category is loud but unstructured

The competitor benchmark found something worth exploiting. **Every** brand checked (Magic Mind on both PDPs, IM8, Qualia, TruBrain, Thesis) has an FAQ accordion on its product page, and **not one of them has FAQPage schema on it**. Magic Mind's 47 schema'd questions are *all operational* (shipping, billing, returns), so their entire product and trust FAQ is invisible to answer engines.

**We already have FAQPage schema on all three PDPs, plus `/` and `/professionals`** (SCRUM-1133, SCRUM-1140). We have the pipe. We have almost nothing in it.

Symmetrically, the brands that *are* brave bury their bravery off-domain: Thesis's best content ("Will I become reliant on taking my blends?", "Can I take Thesis while on antidepressants, stimulants, and non-stimulant medications?") sits in a **Zendesk** subdomain; Heights's sits in **Gorgias**. They earn no SEO or AEO credit for it.

**Nobody in this category is both brave and structured. That is the opening.**

### Evidence from live search

Two probes run during scoping:

- **"are daily nootropic brain shots safe / side effects"** returns Mind Lab Pro's blog (twice), Vyvamind's blog, HealthyCell, WebMD. Competitor *content*, not competitor product pages. The citation battleground is answers, not storefronts.
- **"supplements for menopause brain fog"** returns an answer that says *"Adaptogens are the most targeted intervention for perimenopausal brain fog... Rhodiola rosea is particularly effective... ashwagandha supports cortisol regulation"* while citing Health & Her, Midi and The Better Menopause. **The answer engine is describing CONKA Flow's formula and recommending someone else.** That term is KD 22, vol 590, and the keyword map already flags it as our single biggest gap.

## Who it serves

Organic searchers at every funnel stage, and AI answer engines. Secondary but real: **conversion**. Safety, side-effect and price questions are the objections that stall a purchase. Answering them well serves acquisition and CRO at the same time, which is rare.

## Business impact

This is the **highest-leverage content work available**, and unlike the blog (Phase 6) it needs no content engine and no new content pipeline. The schema is already built and validated. This is pouring content into an existing, working pipe.

Measured against `docs/analytics/seo-search-console-baseline.md`: non-brand impressions, and the count of URLs drawing any impression (17 at baseline).

## Appetite

Roughly **three to four days total**, split across four phases that can ship independently. Phase 1 alone is half a day and is worth shipping on its own.

## Design system

`brand-base`. The `/faq` hub mirrors the `/science` page shell (`brand-clinical` wrapper, `Navigation`, `main`, `Footer`). Note the known `.brand-clinical` mobile hero gotcha: it zeros hero top padding on mobile, so the page needs an explicit `paddingTop` to clear the fixed nav.

---

## Decisions taken during scoping

Both were product-owner calls, made 2026-07-14.

### 1. Answer posture: specific, with a GP backstop

We answer the safety, side-effect, eligibility and interaction questions **properly**: naming the actual ingredients, saying who should not take CONKA, and addressing dependency and what happens when you stop. Each such answer closes with a "check with your GP or pharmacist if you take prescription medication" line, rather than *leading* with it and saying nothing else.

This is the Thesis and Qualia posture, and it is what earns the citation. The rejected alternative (deflect to a GP) is what every other brand does, produces a non-answer an LLM cannot cite, and is the reason our current ADHD-medication answer is worthless.

**This is a deliberate acceptance of regulatory exposure in exchange for differentiation.** The product owner owns the legality pass. `/review-claims` runs before publish.

### 2. Location: distributed **and** a `/faq` hub

Both, not either. The PDPs keep a short, conversion-focused FAQ (the objections that close a sale). A new `/faq` hub carries the **full** set with schema and becomes an indexable, citable answer surface in its own right. This is what IM8, AG1 and Qualia do.

The rejected alternatives: PDP-only would mean a 35-question accordion on a purchase page, which hurts conversion; hub-only would strip objection-handling from the page where the decision is actually made.

---

## Phases

| Phase | Description | Blocker | Appetite |
|-------|-------------|---------|----------|
| 1 | **Consolidate and de-contradict.** One source of truth, contradictions resolved, no new questions. | None | Half a day |
| 2 | **The `/faq` hub.** New page, the expanded question set, FAQPage schema, nav/footer entry. | Copy must be written | 1.5 days |
| 3 | **PDP and homepage FAQ tuning.** Curate each surface's subset from the single source; surface Informed Sport on the consumer PDPs; link through to the hub. | Phase 1 | Half a day |
| 4 | **Ingredient FAQs on `/ingredients`.** Per-ingredient Q&A with schema, targeting the highest-volume terms in the whole dataset. | Phase 1 | Half a day |

Ship as separate commits. Phase 1 is a pure refactor and is independently valuable: it fixes a latent bug (three files, one dataset) whether or not the rest happens.

---

## Phase 1: Consolidate and de-contradict

**Thesis.** Before adding 20 questions, stop the 20 we have from disagreeing with each other. This is engineering, needs no copy decisions beyond picking which of three existing answers is correct, and it is a prerequisite for every later phase.

1. **[Frontend] One FAQ source of truth**
   - `app/lib/faqContent.ts` becomes the only FAQ dataset. Delete `app/lander/sections/FAQ/faq.data.ts` and `app/(trial-b)/lander-b/sections/FAQ/faq.data.ts`, and point both landers at the canonical import.
   - Extend the `FaqItem` type with a `surfaces` field (which pages render it) and a `category` field (safety, efficacy, usage, commercial, ingredients). Each surface then selects its subset from one array rather than holding its own copy.
   - Complexity: Medium. Files: `app/lib/faqContent.ts`, the two lander data files (deleted), `app/lander/sections/FAQ/*`, `app/(trial-b)/lander-b/sections/FAQ/*`.

2. **[Copy] Resolve the three contradictions**
   - **Coffee:** pick one stance. Recommended: "Yes, CONKA Flow is caffeine-free so it works alongside coffee, though most people find they reach for fewer cups." That is true, non-preachy, and consistent with the caffeine-free positioning.
   - **Time to results:** pick one timeline. Recommended: the home FAQ's Day 1 / Day 14 / Day 30 framing, because it is the most specific and the only one backed by the +28.96% figure.
   - **Guarantee:** one wording of the 100-day guarantee everywhere.
   - Complexity: Small, but it needs a decision per contradiction.

3. **[Cleanup] `/go/listicle-template` serves lorem ipsum**
   - The route is registered in `app/lib/landings/index.ts` and builds, so `/go/listicle-template` is publicly reachable and serves six "Placeholder persona-locked question N?" headings answered with lorem ipsum. It is noindex, but it is live. Either unregister it from the index or gate it behind a dev-only check.
   - Complexity: Small.

**No-gos in Phase 1:** no new questions, no new pages, no schema changes. Pure consolidation, so it can ship and be reverted on its own.

---

## Phase 2: The `/faq` hub

**Thesis.** A dedicated, indexable, schema'd answer surface carrying the full question set, including the questions the rest of the category refuses to answer on-domain.

1. **[Frontend] `/faq` page**
   - Server component. Own metadata (title, description, OG, Twitter). Sections grouped by category, each with an H2; questions as H3 inside native `<details>` accordions (progressive disclosure, no client JS, the pattern `TeamFAQ.tsx` already uses).
   - Add to `app/sitemap.ts` **with its `sources` paths** (the sitemap derives `lastModified` from git over those paths), and to `public/llms.txt`.
   - Complexity: Medium. Files: `app/faq/page.tsx` (new), `app/components/faq/*` (new), `app/sitemap.ts`, `public/llms.txt`.

2. **[SEO] FAQPage JSON-LD for the hub**
   - Reuse `buildFaqSchema` from `app/lib/jsonLd.tsx`. Serialise the full set. Every question in the schema must also render visibly on the page: schema describing invisible content breaches Google's policy, and this is the rule that already governs `/` and `/professionals`.
   - Complexity: Small.

3. **[Content] Write the expanded question set**
   - This is the real work of the phase. Target roughly **35 to 40 questions**, up from 20. Every answer follows BLUF: the direct answer in the first sentence, the reasoning after. See "The question set" below.
   - Complexity: Large. This is a copy job, not an engineering one.

4. **[Frontend] Nav and footer entry**
   - Footer "Support" column gains an FAQ link. No nav change (the nav is deliberately lean).
   - Complexity: Small.

5. **[Verify]**
   - Rich Results Test and Schema.org validator on `/faq`: one FAQPage node, no errors. Every schema question present in the rendered HTML. Renders correctly at 390px. `/review-claims` pass before publish.

---

## The question set (Phase 2)

Existing questions are kept and reused. **New** questions are marked. Grouped as they will appear on the hub.

### About CONKA (existing, mostly)
- What makes CONKA different?
- What is the difference between Flow and Clear? Which should I take?
- What is in CONKA? *(new: links to `/ingredients`)*
- Is CONKA a medicine? *(new: it is a food supplement; sets the frame for every safety answer below)*

### Does it actually work (the scepticism cluster, mostly NEW)
- **Do nootropics actually work?** *(new)*
- **Does CONKA actually work, or is it placebo?** *(new. This is where the 150+ users / 5,000+ cognitive tests / +28.96% evidence goes. We have the best answer in the category to this question and we currently never ask it.)*
- **Are the ingredients clinically dosed, or underdosed?** *(new. "Underdosed" is a specific, recurring criticism of Magic Mind in third-party reviews. We answer it with per-serving doses.)*
- When will I notice results?
- **What if I don't feel anything?** *(new, distinct from the refund question: sets expectation before it becomes a refund)*

### Safety, side effects and eligibility (almost entirely NEW, and the differentiator)
- Is CONKA safe to take every day?
- **Are there any side effects?** *(new. We currently have nothing on this. Anywhere.)*
- **Who should not take CONKA?** *(new. Explicit exclusion list.)*
- **Can I take CONKA if I am pregnant or breastfeeding?** *(new: currently a buried clause in another answer)*
- **Can children or under-18s take CONKA?** *(new)*
- **Can I take CONKA with prescription medication?** *(new. Names the ingredients. GP backstop, not a GP deflection.)*
- **Can I take CONKA with ADHD medication?** *(new on an indexed page. Today this exists only on a noindex lander, as a non-answer.)*
- **Can I take CONKA with antidepressants or SSRIs?** *(new)*
- **Is CONKA addictive? Will I become reliant on it?** *(new. Thesis answers this; nobody else does.)*
- **What happens if I stop taking CONKA?** *(new)*
- **Are there long-term effects?** *(new)*
- **Will CONKA show up on a drug test? Does it contain banned substances?** *(new on consumer pages. Informed Sport, 280+ substances. Currently hidden on `/professionals`. This is our strongest trust answer and almost nobody in the category can match it.)*
- **Can I drink alcohol with CONKA?** *(new)*

### Taking it (existing, mostly)
- How do I take CONKA?
- When should I take Flow? When should I take Clear?
- Does CONKA contain caffeine? *(consolidate: currently only on noindex landers)*
- Can I take CONKA with coffee? *(the resolved answer from Phase 1)*
- **Can I take CONKA at night? Will it affect my sleep?** *(existing on Flow; promote it. This is a genuine competitive weapon: Magic Mind has 55mg caffeine and tells people to avoid it after 2pm. CONKA Clear is designed for the afternoon precisely because it is caffeine-free.)*
- **Do I need to cycle it or take breaks?** *(new. Qualia recommends 5 days on, 2 off. We should say plainly whether we do.)*
- **What does it taste like?** *(new. Tolerability is a repeat-purchase objection.)*
- **Is CONKA vegan / gluten-free / allergen-friendly?** *(new)*
- **How should I store it? Does it expire?** *(new)*

### Price, subscription and guarantee (the price question is NEW)
- **Why does CONKA cost what it costs?** *(new. "Why is Magic Mind so expensive" is the top "why" completion for the category leader, and only Qualia answers the equivalent. Answer it with the clinical-dose argument and the per-shot maths.)*
- What if it doesn't work for me? (100-day guarantee)
- **Can I cancel or pause my subscription?** *(new on an indexed page)*
- When will I receive my order?

### Ingredients (Phase 4 detail; the hub carries a summary and links out)
- What is Alpha GPC and what does it do?
- What is Ashwagandha and what does it do?
- What is Ginkgo Biloba and what does it do?
- What is Rhodiola and what does it do?

---

## Phase 3: PDP and homepage FAQ tuning

**Thesis.** The hub carries everything; the PDPs carry the subset that closes a sale. One source, different selections.

1. **[Frontend] Per-surface subsets**
   - Each surface selects from the single `FAQ_ITEMS` array by `surfaces` / `category`, rather than holding its own list. Keep PDP accordions to roughly 6 to 8 questions.
   - Complexity: Small. Depends on Phase 1.

2. **[Content] Surface the trust answers on consumer pages**
   - Add the Informed Sport / drug-test answer and the side-effects answer to the PDP subsets. These are the two highest-trust answers we have and neither is currently on a consumer product page.
   - Complexity: Small.

3. **[Frontend] "See all questions" link to `/faq`**
   - Every FAQ accordion ends with a link to the hub. Passes internal link signal to the new page and gives the visitor somewhere to go.
   - Complexity: Small.

---

## Phase 4: Ingredient FAQs on `/ingredients`

**Thesis.** `ginkgo biloba benefits` is 5,400/mo, the **highest-volume term in the entire keyword dataset**. Ashwagandha, Alpha GPC, Rhodiola and Lemon Balm all carry real demand. `/ingredients` currently has no FAQ and no FAQ schema, and the keyword map has flagged this as the site's biggest single opportunity since v4.

1. **[Content + Frontend] Per-ingredient Q&A**
   - For each of the main actives: what it is, what the evidence says it does, what dose CONKA uses, and any side effects or cautions. The dose is the differentiator: we can name a real per-serving figure where a proprietary-blend competitor cannot.
   - **Constraint:** per-ingredient *doses* are publishable. Formula-share *percentages* are not, and must never reach client code, rendered or otherwise.
   - Complexity: Medium (content-heavy).

2. **[SEO] FAQPage schema on `/ingredients`**
   - Reuse `buildFaqSchema`. `/ingredients` already has a sibling server layout from Phase 2 of the SEO programme, so the schema goes there.
   - Complexity: Small.

---

## Rabbit holes

- **Rebuilding `/ingredients` as a per-ingredient page hierarchy.** The keyword map has wanted per-ingredient H2 sections since v4, and a full rebuild (or a page per ingredient, as Qualia does with ~485 FAQ URLs) is a genuine option. It is also a page rebuild, not an FAQ. Phase 4 adds the Q&A to the existing page; the rebuild stays out.
- **Migrating to a help-desk platform** (Zendesk, Gorgias). Tempting for ops, and it is exactly the mistake Thesis and Heights made: their best content sits off-domain earning them nothing. Keep FAQs on `conka.io`, in the repo, with schema.
- **Answering every question the competitors answer.** IM8 publishes 51 and AG1 ~87, many of them operational filler ("Do you ship to P.O. boxes?"). Volume is not the goal; being the only brand that answers the *hard* questions on-domain, with schema, is.
- **Turning the FAQ into the blog.** The top-of-funnel problem questions (menopause brain fog, "how to get rid of brain fog fast", ADHD) are **not** FAQ material. They need articles. That is Phase 6.

## No-gos

- No help-desk or off-domain FAQ platform.
- No FAQ schema for content the page does not visibly render. This rule already governs `/` and `/professionals` and it is a Google policy line, not a preference.
- No per-ingredient formula-share percentages in client code, rendered or not.
- No `aggregateRating` or review markup anywhere in this work.
- No changes to `/go/*` FAQ copy beyond removing the lorem-ipsum template route. Those pages are noindex and out of the programme.
- No new questions in Phase 1.

## Risks

- **Claims and regulatory exposure is the real risk, and it is deliberate.** Answering medication, side-effect and eligibility questions specifically is the entire differentiator, and it is also where the exposure lives. The product owner has accepted this trade explicitly. Mitigation: `/review-claims` before publish, and a legal read on the safety cluster.
- **A 35-question accordion could hurt PDP conversion.** Mitigated by the hub: the PDPs keep 6 to 8, the hub carries the rest.
- **Answers going stale.** Prices, dosages and the guarantee appear in FAQ answers. Where a figure lives in code (`FUNNEL_PRICING`), derive it rather than hardcoding, exactly as the meta descriptions now do.
- **Thin or duplicated content.** A hub that merely repeats the PDP accordions verbatim adds little. The hub must be the *superset*, and the PDPs a genuine subset of it.

## Open questions

1. **Who writes the copy?** This is a substantial content job (roughly 20 new answers, several requiring real clinical care). It is the same bottleneck as Phase 9 and Phase 6: content, not code. If Humphrey's engine drafts them, the safety cluster still needs a human and a legal read.
2. **Do we cycle?** "Do I need to take breaks?" cannot be answered until someone decides what the truthful answer is. Qualia recommends 5 days on, 2 off; we currently say "safe every day", which is a stronger claim.
3. **Taste.** Nobody has written a truthful, non-defensive answer to "what does it taste like". Worth getting right; it is a repeat-purchase objection.

## References

- SEO / AEO programme archive: `docs/development/featurePlans/seo-aeo-metadata-foundation.md` (this is Phase 10)
- Canonical SEO / AEO reference: `docs/seo-aeo/README.md`
- Keyword research: `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Blog plan (where the top-of-funnel questions go): `docs/development/featurePlans/blog-informational-content-surface.md`
- FAQ sources today: `app/lib/faqContent.ts`, `app/lib/formulaContent.ts` (Flow/Clear `faq` arrays), `app/components/b2b/TeamFAQ.tsx`
- Schema builders: `app/lib/jsonLd.tsx` (`buildFaqSchema`, `JsonLd`)
- Brand voice and claims rules: `docs/branding/BRAND_VOICE.md`

## Jira

Not ticketed. Phase 1 is ready to ticket as a single unit whenever it is green-lit; Phases 2 to 4 should be ticketed as they become active. Epic: Website & CRO (SCRUM-763).
