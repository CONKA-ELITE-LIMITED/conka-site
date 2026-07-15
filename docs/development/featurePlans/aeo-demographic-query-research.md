# AEO Demographic Query Research

**Status:** Phase 1 complete (question corpus mined with provenance, 2026-07-15). Phase 2 active. Plan-doc only (no Jira).
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
| 1 | Demand mining + clustered question corpus | Done (2026-07-15) |
| 2 | Prioritised content queue + engine handoff | Not Started (active) |
| 3 | Ongoing refresh + feedback loop | Future |

Phases 1 and 2 are the deliverable; Phase 3 is the recurring operating cadence.

---

## Active phase task breakdown

### Phase 1: Demand mining + clustered question corpus — DONE

1. **[Research] Mine questions per demographic** — done. Ran a six-agent search fan-out (one per angle), each capturing full per-row provenance. See "Methodology" and "Phase 1 output" below.
2. **[Research] Dedupe and cluster by intent** — done. Consolidated to one sheet per angle, deduped, each row tagged Informational / Comparison / Purchase and flagged for claims risk.

### Phase 2: Prioritised content queue + engine handoff

3. **[Content] Build the prioritised queue**
   - What: one table. Per row: question (the post H1), demographic, intent, priority lane (P1/P2/P3), related product (flow / clear / both), supporting keyword + KD/volume as tiebreaker. Beachhead P1 lanes at the top.
   - Dependencies: Phase 1 corpus (done).
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

## Methodology — how the Phase 1 corpus was produced (2026-07-15)

Written so Phase 3 can repeat the exact pass and so anyone can scrutinise whether each question is genuine demand rather than a phrasing an agent invented.

### What was run

- **Six research subagents in parallel, one per demographic.** Each ran an independent Google WebSearch fan-out (12 to 16 queries per angle) and returned a table where every row carries: the verbatim question, intent, a claims-risk flag, the source type, the **specific source URL**, the exact search query used, and a demand signal **only where genuinely observed**.
- **Integrity rule enforced:** agents were told never to invent search-volume numbers. Where no numeric signal was observable (which was everywhere, see limitations), the signal is qualitative (SERP result density, a live Quora/forum thread, an active clinical trial) and labelled as such.
- **Seed themes per demographic** (each agent branched its queries from these):
  - *Productivity:* brain fog at work, focus for long periods, nootropics for productivity, natural focus supplements, afternoon energy crash, caffeine alternatives, deep work.
  - *ADHD:* supplements for adult ADHD, natural alternatives to Adderall/Vyvanse, focus without medication, Adderall off-days, ADHD brain fog, non-stimulant aids, dopamine naturally.
  - *Perimenopause:* perimenopause brain fog, menopause memory loss, word-finding in the 40s, brain-fog-vs-dementia, supplements for menopause brain fog, HRT vs supplements.
  - *Ageing brain:* memory loss in 40s/50s, word-finding with age, keep your brain sharp, normal-forgetfulness-vs-dementia, supplements for memory over 50, reversing decline, tip-of-the-tongue.
  - *Sport / brain health:* concussion recovery, supplements after head knocks, contact sport and CTE, protecting the brain in rugby/boxing/MMA, nootropics for athletes, WADA-safe supplements, return-to-play.
  - *Parents (informational-only):* helping a child concentrate, foods for brain development, sugar and focus, screen time and attention, omega-3 for kids, children's memory for school. No child-product angle.

### What worked (sources the corpus genuinely rests on)

- **Google organic SERP** — ranked-result titles and on-page FAQ headings from the pages currently winning each query (e.g. Cleveland Clinic, Healthline, Harvard Health, Mind Lab Pro FAQ blocks). These are real, and they are exactly the phrasings the incumbents target.
- **Quora** — indexed question threads surfaced in organic results (strong for ageing-brain word-finding and ADHD alternative-seeking; several captured verbatim).
- **Mumsnet** — real forum thread titles (strong for the parents angle; three threads captured verbatim).
- **Support forums** — e.g. an Alzheimer's Society thread for the ageing-brain "worried at 40" phrasing.
- **Authority / clinical sources** — CDC, USADA, Penn Memory Center, and live ClinicalTrials.gov studies (sport/concussion), which confirm the topic is real and active.

### What did NOT work (limitations — read before trusting demand magnitude)

- **Reddit is hard-blocked to the crawler.** WebSearch is US-biased and de-indexes Reddit; direct `reddit.com` fetches and `allowed_domains:[reddit.com]` queries returned 400/"no links" across every demographic. So the rawest first-person, emotional phrasings (r/menopause, r/ADHD, r/Nootropics, r/rugbyunion) and any comment-count engagement signal are **absent** from this pass.
- **Google "People Also Ask" boxes and autocomplete were never directly observed.** WebSearch returns ranked links, not SERP feature panels. Every "PAA" reference in the corpus is *inferred* from repeated identical phrasing across ranking pages, not a seen PAA box.
- **No search-volume data.** AnswerSocrates returned 404 / no access; AlsoAsked and KeywordsPeopleUse were not reachable through the tool; Quora view/answer counts 403 on fetch. GSC (our own real query data) was not consulted in this pass. So **demand magnitude is qualitative only** (SERP density, clustering, live threads) and must be validated before content spend.

### What this means for trust

- **Phrasing authenticity is HIGH** for rows citing a Quora / Mumsnet / forum URL (real user voice), **MEDIUM** for rows that are competitor FAQ or article titles (real target phrasings, but editorial, not raw user voice).
- **Demand magnitude is unproven.** Treat the whole corpus as "these questions are real and someone is competing for them", not "these are the highest-volume questions". Rank by true volume only after the free-tool pass below.

### The reproducible monthly pass (Phase 3), free stack in order

1. **Google Search Console (free, ours) — do this first.** Real queries already reaching conka.io, filtered by demographic theme. The truest signal we have; better than any tool because it is our actual audience. Baseline: `docs/analytics/seo-search-console-baseline.md`.
2. **Direct Reddit + Quora search in a browser (free).** Recovers the raw emotional phrasings this automated pass could not reach. This is the single biggest gap to close.
3. **AnswerSocrates (free).** PAA + autocomplete question harvest per seed theme.
4. **AlsoAsked free tier (~3 searches/day).** The nested PAA relationship tree for the top seeds only.
5. **Google Keyword Planner + Trends (free).** Volume ranges and rising queries — the KD/volume tiebreaker the plan calls for.
6. **Paid, only if a lane proves worth it.** KeywordsPeopleUse / Ahrefs / Semrush for hard volume numbers and Reddit/Quora aggregation at scale.

**Free vs paid, in one line:** the free stack (1 to 5) already covers the *questions*, the *PAA relationships*, and *our own real demand*; paid only buys hard volume numbers, deep Reddit aggregation, and bulk exports. Buy paid per-lane, not up front.

---

## Phase 1 output — clustered question corpus with provenance (2026-07-15)

Six angles, deduped and clustered within each, ~15 to 20 questions each. Columns: **Question** (verbatim where a real thread was cited); **Intent** normalised to Informational / Comparison / Purchase (agents' richer labels folded into these three); **Risk** (P3 = medical/high-claims, informational-only in Phase 2); **Source** (the specific URL the phrasing came from); **Signal** (observed demand indicator, qualitative only per the integrity rule). Every row's `Query used` and each angle's coverage/confidence notes are in the per-angle footers.

**Cross-demographic near-duplicate:** "Menopause memory loss: should you be worried?" appears in both perimenopause and ageing brain. Primary = perimenopause; do not write twice. The "do supplements / nootropics actually work?" skeptic query recurs in productivity, ADHD, ageing and sport — keep as distinct demographic-framed H1s but write from one shared evidence core.

### Productivity

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| How do I get rid of brain fog? | Informational | P3 | clevelandclinic.org/health/symptoms/brain-fog | Verbatim FAQ heading, top medical authority |
| What causes brain fog? | Informational | P3 | clevelandclinic.org/health/symptoms/brain-fog | Verbatim FAQ heading; full SERP of authorities |
| How long does brain fog last? | Informational | P3 | clevelandclinic.org/health/symptoms/brain-fog | Verbatim FAQ heading |
| Which supplements support mental clarity and sustained focus during long tasks? | Comparison | - | mindlabpro.com/blogs/nootropics/nootropics-productivity | Verbatim FAQ heading, top commercial page |
| What supplements can help with productivity and mental clarity? | Purchase | - | mindlabpro.com/blogs/nootropics/nootropics-productivity | Verbatim FAQ heading |
| What is the best nootropic stack for focus and memory in high-pressure work? | Comparison | - | mindlabpro.com/blogs/nootropics/nootropics-productivity | Verbatim FAQ heading, knowledge-worker framing |
| Do nootropics really boost productivity? | Informational | - | entrepreneur.com/living/do-nootropics-really-boost-productivity/364614 | Verbatim article title; clustered w/ 3 near-dups |
| Do nootropics work — pros, cons, how to spot quality? | Comparison | - | mindlabpro.com/blogs/nootropics/pros-and-cons-of-nootropics | Verbatim title in top organic results |
| How to concentrate for long hours without getting frustrated? | Informational | - | habitstrong.com/how-to-concentrate/ | Verbatim #1 organic result |
| Why can't I focus at work anymore? | Informational | - | flown.com/blog/deep-work/why-i-cant-focus | Whole SERP is this question (Atlassian, BetterUp) |
| Why am I unable to concentrate? | Informational | P3 | healthline.com/health/unable-to-concentrate | Verbatim Healthline title (medical framing) |
| Effective ways to improve focus while working from home? | Informational | - | quora.com/What-are-some-effective-ways-to-improve-focus...working-from-home | Real Quora thread in organic SERP |
| What is a caffeine crash? | Informational | - | healthline.com/nutrition/caffeine-crash | Verbatim title; SERP dominated by explainers |
| How to avoid a caffeine crash? | Informational | - | sfbaycoffee.com/blogs/articles/how-to-avoid-caffeine-crash | Verbatim title, clustered |
| How to prevent an afternoon energy crash? | Informational | - | mcpress.mayoclinic.org/nutrition-fitness/how-to-prevent-an-afternoon-crash-with-diet | Verbatim Mayo Clinic title |
| Caffeine alternatives for energy without the side effects? | Comparison | - | honehealth.com/edge/caffeine-alternatives/ | Verbatim title; "no jitters/crash" demand |
| How to get energy without caffeine? | Informational | - | share.upmc.com/2025/01/energy-boost/ | Verbatim title, clustered |
| Best evidence-based supplements for brain fog? | Purchase | - | healthline.com/nutrition/vitamins-for-brain-fog | Verbatim Healthline title; commercial SERP behind |
| What is the strongest nootropic for productivity in 2025-2026? | Comparison | - | mindlabpro.com/blogs/nootropics/nootropics-productivity | Verbatim FAQ heading, high purchase intent |

*Queries run:* brain fog at work reddit how to get rid of · how to focus for long periods deep work · best nootropics for productivity reddit · natural supplements for focus and concentration · afternoon energy crash how to avoid · caffeine alternatives for energy without crash · what causes brain fog and how to fix it · l-theanine and caffeine for focus reddit · nootropics for focus without caffeine site:reddit.com · how to improve concentration working from home · do nootropics actually work for productivity · how to concentrate for hours without getting distracted · why do I crash after coffee in the afternoon · how to have energy all day without caffeine jitters · why can't I concentrate at work anymore · supplements to reduce brain fog for adults.
*Coverage / confidence:* Strong SERP + two fetched FAQ blocks + one Quora thread. Reddit dead end (US-only, de-indexed); AnswerSocrates 404. Solid on phrasing authenticity, weak on magnitude — validate volume before spend.

### ADHD

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| Best natural supplement instead of Vyvanse for adult ADHD? | Comparison | P3 | goodrx.com/conditions/adhd/natural-adhd-supplements | Dense listicle cluster (GoodRx + 6 competitors) |
| Is there an over-the-counter substitute for Adderall? | Comparison | P3 | singlecare.com/blog/over-the-counter-adderall | Forbes Health + SingleCare; contested SERP |
| Is L-Tyrosine the new Adderall for ADHD? | Informational | P3 | psychcentral.com/adhd/does-l-tyrosine-help-adhd-symptoms | Exact H1 on PsychCentral + PYM; rebuttal pages rank |
| What should I take on days I don't take Adderall? | Informational | P3 | flown.com/blog/adhd/adderall-shortage-seven-ways | Multiple "drug holiday"/off-day articles rank |
| Why do I have brain fog when Adderall wears off? | Informational | P3 | choosingtherapy.com/adderall-crash/ | "Adderall crash/rebound/zombie" cluster page 1 |
| Does magnesium help with ADHD symptoms? | Informational | P3 | medicalnewstoday.com/articles/magnesium-and-adhd | MNT explainer + PubMed meta-analysis both rank |
| What's the omega-3 (EPA vs DHA) dosage for adult ADHD focus? | Informational | P3 | additudemag.com/adhd-omega-3-benefits/ | Dedicated dosing articles; specific long-tail |
| Can you manage ADHD with diet and supplements alone? | Informational | P3 | additudemag.com/how-to-treat-adhd | ADDitude + systematic review rank |
| What are the best supplements for adults with ADHD? | Purchase | P3 | additudemag.com/vitamins-minerals-adhd-treatment-plan/ | Multiple "top ADHD supplements 2025" listicles |
| How do I focus with ADHD without medication? | Informational | - | add.org/tips-for-focusing-with-adhd/ | 9 competing "manage ADHD without meds" guides |
| How can I increase dopamine naturally with ADHD? | Informational | - | add.org/adhd-dopamine/ | "Dopamine menu" concept; ADDA/WebMD/MNT rank |
| What helps ADHD brain fog without medication? | Informational | - | add.org/adhd-brain-fog/ | Dedicated hub pages (ADDA, Psychology Today) |
| What are the best non-stimulant focus supplements for ADHD? | Purchase | P3 | trygraymatter.com/blogs/science/top-focus-supplements-for-adhd | Supplement-brand blogs (citicoline/bacopa/saffron) |
| Does L-theanine help with ADHD focus? | Informational | P3 | forbes.com/health/mind/adderall-alternatives/ | Recurs as "caffeine + L-theanine" answer in OTC listicles |
| How do I cope with an Adderall crash / comedown? | Informational | P3 | choosingtherapy.com/adderall-crash/ | Large established "crash timeline/remedies" cluster |
| How do I manage ADHD during the Adderall shortage without meds? | Informational | P3 | nexusofhope.com/blog-how-to-navigate-the-adderall-shortage/ | Shortage-driven "7 ways" pieces |
| What is the ADHD "zombie effect" and how do I prevent it? | Informational | P3 | psychcentral.com/adhd/adhd-zombie-effect | Distinct named phenomenon, related result |

*Queries run:* reddit r/ADHD best supplements for adults · natural alternatives to Adderall reddit · how to focus without medication ADHD · supplements to take on Adderall off days reddit · what helps ADHD brain fog without medication · best natural supplement instead of Vyvanse · how to increase dopamine naturally for ADHD · non stimulant focus supplements for ADHD adults · what to take on days I don't take Adderall · does magnesium help with ADHD · L-tyrosine for ADHD does it work like Adderall · why do I have brain fog when Adderall wears off · manage ADHD with diet and supplements alone · OTC substitute for Adderall · omega 3 dosage for adult ADHD focus (+ 3 reddit queries that erred).
*Coverage / confidence:* Strong authority/listicle + PubMed provenance and article-title verbatim. Reddit + Quora hard-blocked (400) — no first-person threads or comment counts. AnswerSocrates not accessed. Medium confidence; run a manual Reddit + AlsoAsked pass to confirm raw phrasings before queueing. **Highest claims-risk angle** — nearly every row is P3 medication-adjacent.

### Perimenopause (P1 winnable lane)

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| What really works for perimenopause brain fog? | Purchase | - | mumsnet.com/talk/menopause/4545104-what-really-works-for-perimenopause-brain-fog | Live Mumsnet menopause-board thread (exact title) |
| Is perimenopause brain fog permanent? | Informational | P3 | semainehealth.com/blogs/science/is-perimenopause-brain-fog-permanent | Top result on the "permanent/dementia" query |
| Menopause memory loss: should you be worried? | Informational | P3 | health.clevelandclinic.org/memory-loss-in-middle-aged-women-is-it-age-or-menopause | Cleveland Clinic ranks page 1 |
| Is menopause related to dementia? | Informational | P3 | health.osu.edu/health/womens-health/link-between-menopause-and-dementia | ≥5 dementia-comparison pages on one SERP |
| Signs of dementia or menopausal brain fog — how do I tell? | Comparison | P3 | menopausespecialists.com/post/signs-of-dementia-or-menopausal-brain-fog | Recurring "fog vs dementia" cluster |
| Memory changes: is it menopause or Alzheimer's? | Comparison | P3 | texaschildrens.org/content/wellness/memory-changes-it-menopause-or-alzheimers | On the "worried 45 / early dementia" SERP |
| Does menopause brain fog go away? | Informational | - | thebettermenopause.com/en-us/blogs/the-better-gut-community/menopause-brain-fog | 10-result SERP on go-away/duration |
| How long does menopause brain fog last? | Informational | - | thebettermenopause.com/en-us/blogs/the-better-gut-community/menopause-brain-fog | Dense SERP (Harvard, GoodRx, Flo) |
| Why can't I find my words in my 40s? | Informational | - | expressable.com/learning-center/adults/how-menopause-can-affect-the-way-you-communicate | Word-finding + midlife research on SERP |
| Why do I forget words mid-sentence during menopause? | Informational | - | expressable.com/learning-center/adults/how-menopause-can-affect-the-way-you-communicate | Speech page ranks for word-retrieval query |
| Why do I keep forgetting things in perimenopause? | Informational | - | palomahealth.com/learn/understanding-peribrain | Study cited: forgetfulness peak 81.7% at 50-54 |
| How does menopause affect memory and concentration? | Informational | - | medicines.abbott.com/how-does-menopause-affect-memory-and-concentration/ | Recurs across two seeds |
| Can menopause brain fog affect my work and concentration? | Informational | - | theconversation.com/brain-fog-during-menopause-is-real-173150 | NHS-staff study; ~60% report difficulty |
| What are the best supplements for menopause brain fog? | Purchase | - | joinmidi.com/post/menopause-brain-fog-supplements | Heavy commercial SERP, 6+ listicles |
| What natural remedies work for brain fog without HRT? | Purchase | - | mpowder.store/blogs/journal/the-best-natural-remedies-for-brain-fog-in-perimenopause | Distinct "without HRT" cluster |
| Does HRT help brain fog? | Comparison | P3 | menopausecare.co.uk/blog/hrt-brain-fog | 9-result SERP mixing HRT + supplement + nootropic |
| Should I take HRT or supplements for menopause brain fog? | Comparison | P3 | honehealth.com/edge/best-supplements-for-menopause-brain-fog/ | HRT + supplement pages contest one SERP |

*Queries run:* reddit menopause perimenopause brain fog can't find words · is menopause brain fog permanent or dementia · supplements for menopause brain fog what helps · HRT vs supplements for brain fog does HRT help memory · perimenopause forgetting words mid sentence site:reddit.com · "is this normal" perimenopause memory so bad scared reddit · menopause brain fog mumsnet can't concentrate at work · why can't I find words in my 40s hormones menopause · r/Menopause brain fog "so bad"/"scared me" · does menopause brain fog go away how long · natural remedies perimenopause brain fog without HRT · perimenopause forgetting things at work early dementia 45.
*Coverage / confidence:* Dense contested SERPs on supplements, HRT, duration, dementia-fear. Only one true forum thread surfaced (Mumsnet, verbatim); Reddit returned nothing across 4 attempts. No volume data. Medium — lanes clearly live, but most "verbatim" rows are article/PAA-framed, not user voice.

### Ageing brain

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| Since my mid-40s I forget words when I need them, is this normal? | Informational | - | quora.com/Since-reaching-my-mid-40s-I-have-begun-having-problems-remembering-words | Indexed Quora thread (verbatim) |
| I forget mid-sentence what I'm saying — what is this? | Informational | - | quora.com/I-forget-things-easily-Even-when-Im-in-mid-sentence | Indexed Quora thread (verbatim) |
| Why do I always forget what I'm saying mid-sentence? | Informational | - | quora.com/Why-do-I-always-forget-what-Im-saying-midsentence | Indexed Quora thread (verbatim) |
| Do omega-3 and ginkgo biloba increase memory, and how? | Comparison | - | quora.com/Do-Omega-3-and-Ginkgo-biloba-increase-memory | Indexed Quora question |
| 40F and very concerned with my memory loss | Informational | P3 | forum.alzheimers.org.uk/threads/40-f-and-very-concerned-with-my-memory-loss.148247/ | Real dementia-support forum thread (verbatim) |
| Can I reverse memory loss? | Informational | P3 | portal-us.mocacognition.com/questions-and-answers/can-I-reverse-memory-loss | Dedicated Q&A from cognitive-test authority |
| Is it possible to reverse dementia or its memory-loss effects? | Informational | P3 | quora.com/Is-it-possible-to-reverse-dementia | Indexed Quora question |
| At what age does memory start to decline with aging? | Informational | - | int.livhospital.com/at-what-age-does-memory-start-to-decline-with-aging/ | Multiple pages rank for exact phrasing |
| Menopause memory loss: should you be worried? (see perimenopause) | Informational | - | health.clevelandclinic.org/memory-loss-in-middle-aged-women-is-it-age-or-menopause | Top result for 40s/50s "is it normal"; primary = perimenopause |
| Memory loss: is it forgetfulness or dementia? | Informational | P3 | henryford.com/blog/2025/07/memory-loss-forgetfulness-normal-or-dementia | SERP cluster of ~9 pages |
| Being forgetful: normal aging or signs of dementia? | Comparison | P3 | baptisthealth.net/baptist-health-news/being-forgetful-is-it-normal-aging-or-signs-of-dementia | Dense normal-vs-dementia cluster |
| Word-finding problems: normal aging or something else? | Informational | - | madisonspeechtherapy.com/blog/wordfindingproblems | ~8 pages rank on word-finding-and-aging |
| Difficulty finding words: when to worry? | Informational | - | e4aonline.com/understanding-difficulty-finding-words/ | Recurs across two queries |
| Can supplements improve your brain health? | Comparison | - | uhhospitals.org/blog/articles/2025/02/can-supplements-improve-your-brain-health | Ranks alongside systematic reviews |
| Do supplements to prevent cognitive decline actually work? | Comparison | - | pennmemorycenter.org/gcbh-supplements/ | Top result; strong counter-messaging demand |
| When should I be concerned about memory loss? | Informational | P3 | cedars-sinai.org/blog/concerned-about-memory-loss.html | SERP cluster on "when to worry" at 50 |
| What is normal forgetfulness at 50? | Informational | - | discoveryvillages.com/senior-living-blog/what-is-the-normal-forgetfulness-at-50/ | Ranks for age-specific phrasing |
| How to keep your brain sharp as you age? | Informational | - | health.harvard.edu/mind-and-mood/6-simple-steps-to-keep-your-mind-sharp-at-any-age | Large cluster (Harvard, Time, WebMD) |
| What are the best natural ways to improve memory and focus? | Purchase | - | napiers.net/blogs/news/what-are-the-best-natural-ways-to-improve-my-memory-and-focus | Question-form title on "natural, without meds" |

*Queries run:* memory loss in your 40s and 50s reddit is this normal · word finding difficulty getting worse with age forum · best supplements for memory over 50 reddit · how to keep your brain sharp as you age · tip of the tongue getting worse forgetting words age reddit · normal forgetfulness vs dementia signs to watch · why am I forgetting words mid sentence in my 40s quora · supplements to prevent cognitive decline do they actually work · can you reverse age related memory loss quora · at what age does memory start to decline · does ginkgo biloba or omega 3 help memory older adults · when should I be worried about memory loss age 50 · improve memory and focus naturally after 50 without medication.
*Coverage / confidence:* Best verbatim yield of the six — real Quora questions + an Alzheimer's Society forum thread. Reddit queries returned nothing; Quora counts 403; no volume data. Medium — on-persona and verified-real, but validate top ~6 against a keyword tool.

### Sport / brain health (P1 winnable lane)

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| What supplements help after a concussion? | Purchase | P3 | theneuroclinic.org/single-post/what-supplements-help-after-a-concussion | 8+ clinic/supplement pages rank |
| Best supplements for post-concussion syndrome brain fog? | Purchase | P3 | cognitivefxusa.com/blog/natural-remedies-for-post-concussion-syndrome | Dense competitive SERP |
| How long does brain fog last after a concussion? | Informational | P3 | swaymedical.com/articles/brain-fog-after-a-concussion | Multiple neuro clinics; recurring duration framing |
| Can a single concussion lead to lasting brain damage? | Informational | P3 | neurocenternj.com/blog/can-a-single-concussion-lead-to-lasting-brain-damage/ | Titled verbatim on ranking page |
| How many concussions is too many? | Informational | P3 | storelli.com/blogs/the-storelli-blog/how-many-concussions-too-many | Oxford study + brand pages rank |
| Does playing rugby cause brain damage? | Informational | P3 | quora.com/Does-playing-rugby-cause-brain-damage | Live Quora question + Oxford paper |
| Does heading a football cause brain damage? | Informational | P3 | magazine.columbia.edu/article/heading-soccer-ball-does-cause-brain-damage-experts-say | Columbia, WaPo, PMC all rank |
| What reduces the risk of brain damage in UFC/MMA fighting? | Informational | P3 | quora.com/What-can-be-done-to-reduce-the-risk-of-brain-damage-in-UFC-MMA-fighting | Live Quora thread |
| Can MMA training damage the brain for a hobbyist? | Informational | P3 | quora.com/Can-MMA-training-for-the-non-professional-trainee-be-damaging-to-the-brain | Live Quora thread (hobbyist angle) |
| How do I protect my brain as an MMA fighter? | Informational | P3 | mixedmartialartsconditioningassociation.com/how-to-protect-your-brain-as-an-mma-fighter/ | Dedicated how-to page ranks |
| What can I do to protect my brain / prevent CTE after contact sport? | Informational | P3 | health.harvard.edu/mind-and-mood/what-is-cte | Harvard + a "CTE prevention protocol" PDF rank |
| How much creatine should I take for concussion recovery? | Informational | P3 | completeconcussions.com/concussion-tips-information/creatine-and-concussion-recovery/ | Active ClinicalTrials.gov study + DoD paper |
| Does omega-3 protect the brain from repetitive head impacts? | Informational | P3 | concussionalliance.org/newsletter/2025/3/6/omega-3-fats-associated-with-lower-levels-of-neuroaxonal-injury | Active trial NCT01814527 + 2024 meta-analysis |
| How long after a concussion can I return to sport? | Informational | P3 | cdc.gov/heads-up/guidelines/returning-to-sports.html | CDC guideline + "21-day" study |
| Are nootropics WADA-safe / banned for athletes? | Informational | - | bscg.org/wada-prohibited-list-banned-drugs-and-supplement-risks | BSCG + Mind Lab Pro rank; phenylpiracetam flagged |
| Is creatine banned in sports? | Informational | - | usada.org/spirit-of-sport/athletes-need-know-creatine/ | USADA authority + brand explainers |
| How do I know if a supplement is batch-tested (Informed Sport)? | Comparison | - | sport.wetestyoutrust.com/about/frequently-asked-questions | Informed Sport, ITA, BSCG all rank |
| What are the best nootropics for athletes / focus before competition? | Comparison | - | mindlabpro.com/blogs/nootropics/nootropics-athletes | Very crowded commercial SERP (10+ listicles) |

*Queries run:* supplements after concussion recovery reddit rugby · best supplements for post concussion brain fog · how to protect your brain from CTE boxing reddit · nootropics for athletes WADA safe · creatine for brain injury concussion dose · post concussion brain fog how long does it last · rugby players brain damage worried should I quit · omega 3 dose concussion prevention athletes · does heading a football cause brain damage · supplement banned by WADA batch tested informed sport · how long after concussion can I return to sport · best nootropics for focus before competition athletes · MMA fighters reduce brain damage from sparring · how many concussions is too many · creatine banned WADA · protect my brain if I played contact sport CTE prevention.
*Coverage / confidence:* Strong — two live Quora threads, authority/certifier pages, and active clinical trials confirm real interest. Reddit fully blocked (400 on every attempt); no PAA boxes; no volumes. Medium-high on demand existence, low on exact magnitude.

### Parents (informational-only — entire set is P3, no product target)

| Question | Intent | Risk | Source | Signal |
|----------|--------|------|--------|--------|
| How can I get my child to do homework? | Informational | P3 | mumsnet.com/talk/am_i_being_unreasonable/5149869-how-can-i-be-better-at-making-my-child-do-homework | Mumsnet AIBU thread (verbatim) |
| How do you get a child to concentrate better? | Informational | P3 | mumsnet.com/talk/_chat/4954226-how-do-you-get-a-child-to-concentrate-better | Mumsnet _chat thread (verbatim) |
| Why can't my child focus in school? | Informational | P3 | oxfordlearning.com/why-cant-my-child-focus/ | Recurs across SERP + Child Mind Institute |
| My child is smart but can't focus — how can I help? | Informational | P3 | beyondbooksmart.com/executive-functioning-strategies-blog/my-child-is-smart-but-cant-focus | Same phrasing across 4+ pages |
| Are attention problems always ADHD? | Informational | P3 | childmind.org/article/not-all-attention-problems-are-adhd/ | Child Mind Institute cornerstone article |
| What foods help children's brain development and concentration? | Informational | P3 | health.choc.org/brain-boosting-foods-for-kids/ | Dense SERP cluster (Healthline, WebMD, UCLA) |
| What is the best breakfast for kids' concentration at school? | Informational | P3 | uchealth.org/today/breakfast-ideas-for-kids-fuel-the-brain-for-learning/ | Large SERP cluster; hospital blogs |
| Does sugar make my child hyperactive or affect focus? | Informational | P3 | medicalnewstoday.com/articles/medical-myths-does-sugar-make-children-hyperactive | "Medical myths"/debunk cluster |
| Does screen time affect children's attention span? | Informational | P3 | pubmed.ncbi.nlm.nih.gov/35430923/ | Systematic review + explainer pages |
| Does omega-3 help children's focus and concentration? | Informational | P3 | ncbi.nlm.nih.gov/pmc/articles/PMC3691187/ | UK DOLAB study widely cited |
| At what age can children take omega-3 supplements? | Informational | P3 | medicalnewstoday.com/articles/omega-3-for-kids | Strong cluster; NHS guidance |
| How much omega-3 / fish oil should a child take? | Informational | P3 | barebiology.com/pages/omega-3-for-children | Dosage cluster (EFSA 250mg cited) |
| Are focus / concentration supplements safe for children? | Informational | P3 | gojoynaturals.com/blogs/wellness-nutrition/focus-supplements-kids-guide | "Safety & Warnings" framing; experts urge paediatrician |
| Do vitamins help children's concentration and focus? | Informational | P3 | quora.com/What-are-the-best-focus-vitamins-for-kids | Quora Q + retail cluster |
| What are the best vitamins for kids' concentration? | Informational | P3 | gojoynaturals.com/blogs/wellness-nutrition/vitamins-kids-concentration | Multiple near-identical retail titles |
| How can I improve my child's memory for school? | Informational | P3 | oxfordlearning.com/11-ways-to-improve-memory-for-kids/ | Broad SERP + Child Mind working-memory article |
| How do I help a child with working memory issues? | Informational | P3 | childmind.org/article/how-to-help-kids-with-working-memory-issues/ | Child Mind + Understood dedicated articles |
| How do I increase my son's focus on his studies (11 yo)? | Informational | P3 | quora.com/What-can-I-do-to-increase-my-sons-focus-on-his-studies | Age-specific Quora variants (verbatim) |
| How do I softly improve an 8-year-old's focus without strictness? | Informational | P3 | quora.com/How-do-I-softly-enhance-a-child-s-focus-on-studies-without-strictness | Verbatim Quora question |
| My child won't focus at school — should I get an ADHD assessment? | Informational | P3 | mumsnet.com/talk/_chat/4911263-child-wont-focus-at-school | Mumsnet thread; users suggest ADHD waiting list |

*Queries run:* how can I help my child concentrate on homework mumsnet · foods that help children's brain development · does sugar affect kids focus · omega-3 for kids brain · screen time and attention span in children · supplements for children's focus are they safe · improve my child's memory for school · reddit ADHD parenting help child concentrate · what age can children take omega 3 NHS · why can't my child focus in school child mind institute · best breakfast for kids concentration · do vitamins help children's concentration · quora make my child concentrate on studies · mumsnet 7 year old can't concentrate school worried.
*Coverage / confidence:* Best forum yield — real Mumsnet (3 threads) + Quora (age-specific, verbatim) + authority pages. No PAA boxes observed; Reddit parenting query returned nothing; no volumes. Medium-high on phrasing authenticity, low on magnitude. Entire set stays informational-only; defer to paediatricians.

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
- **Mining depth (confirmed in Phase 1).** The automated search fan-out could not reach Reddit, could not observe Google PAA/autocomplete boxes, and produced no volume data. The rawest emotional phrasings and true demand ranking still require the free-tool + GSC human pass documented in the Methodology. Treat the corpus as "real and contested", not "volume-ranked", until that pass runs.
- **Refresh ownership.** Phase 3 is owned by Rudh. If the monthly refresh lapses, the queue goes stale and the scorecard feedback loop never closes.

## Resolved during scoping

- **Scope is the demand input, not the whole AEO operating system.** The blog surface is in build and the engine exists; the missing piece is the demographic question research that feeds the engine. This phase is that research plus the queue and handoff, nothing wider.
- **Owner of the recurring refresh (Phase 3):** Rudh.
- **Priority scheme reuses the scorecard's P1/P2/P3 lanes** rather than inventing a new one.
- **Tracking:** plan-doc only, no Jira. Internal research/content-ops work rather than a website feature.
- **Phase 1 executed 2026-07-15** via a six-agent search fan-out with full per-row provenance (source URL, query, observed signal). Method and its limitations are documented in "Methodology" so Phase 3 repeats it.

## Open questions

- **Community-mining depth — partly answered.** Phase 1 confirmed the in-house search fan-out is enough for a usable, provenance-backed corpus now, but it cannot reach Reddit, cannot see Google PAA/autocomplete, and returns no volume numbers. The paid/free community pass (GSC first, then direct Reddit/Quora, AnswerSocrates, AlsoAsked, Keyword Planner) is deferred to Phase 3 as the monthly sharpening step, not a blocker for Phase 2. Decide before Phase 2 prioritisation whether to run at least the free GSC + Reddit pass to rank the P1 lanes by real demand before committing content spend.

## References

- Strategy and audience mapping: `docs/seo-aeo/AEO_PLAYBOOK.md`
- Measurement instrument and the baseline this feeds: `docs/seo-aeo/aeo-scorecard.md`
- What is live on-site (foundation, Phases 1 to 10): `docs/seo-aeo/README.md`
- The blog surface this queue feeds (in build): `docs/development/featurePlans/blog-informational-content-surface.md`
- The engine-facing Notion contract (handoff target): `docs/development/featurePlans/blog-notion-engine-brief.md`
- Keyword map (volume/KD source to mine from, tiebreaker only): `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- SEO/AEO programme master plan: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Search Console baseline (the free GSC step in Phase 3): `docs/analytics/seo-search-console-baseline.md`

## Jira

None. Plan-doc-only tracking by decision (internal research/content-ops work). Convert to tickets only if the work later needs cross-team coordination.
