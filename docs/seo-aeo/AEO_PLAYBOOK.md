# AEO Playbook (aligned to current state)

**Goal:** get CONKA named by Claude, ChatGPT, Perplexity and Google AI Overviews when a buyer asks a real question.
**Status:** the on-site foundation is built. What remains is content, measurement and off-site corroboration.
**Source:** adapted from Humphrey's July 2026 "CONKA AEO Playbook (v3)" (`docs/development/featurePlans/CONKA_AEO_Playbook.docx`), corrected against what actually shipped in SEO/AEO Phases 1 to 10 (`docs/seo-aeo/README.md`).
**Last reviewed:** 2026-07-15.

---

## 0. Read this first: how AEO differs from SEO, and what has changed since the playbook was written

SEO matches keywords on a page to a query and ranks a link. AEO (Answer Engine Optimisation) is different: Claude, ChatGPT, Perplexity and Google's AI Overviews rarely show your page. They either **retrieve-then-synthesise** (run a live search, read several sources, write the answer in their own words) or **answer from memory** (no search; you are named only if you were prominent enough across the open web at training time). So the goal is not "rank a page for a keyword," it is **become the answer.** Two things drive that: how cleanly the site states machine-extractable facts, and how much off-site corroboration exists. Models trust triangulated facts far more than a brand's claims about itself.

**Where the original playbook is now out of date.** The playbook's founding premise was "CONKA's proof is locked up as un-extractable marketing prose, with no schema." That was true at the SEO baseline. It is no longer true. Between then and now the site shipped:

- Self-referencing canonicals, per-page metadata on every money page (Phases 1, 2).
- `Product`, `FAQPage`, `Organization` and `WebSite` JSON-LD, with the brand expressed as one verifiable entity carrying the Companies House number, VAT ID and registered address (Phases 3, 7, and SCRUM-1148).
- A `/faq` answer surface built from one source of truth, curated per page (Phase 10).
- Answer-first (BLUF) openings and self-contained passages retrofitted onto `/science`, `/why-conka`, `/ingredients`, `/our-story`, `/app` and `/app-insights`, each with a visible review date (Phase 9).
- `robots.ts`, `sitemap.ts` and `llms.txt`, with all AI crawlers deliberately allowed (Phases 5, 8).

So the playbook's "Phase 0: make the site machine-readable" is, for the most part, **already banked.** The technical foundation is not the gap. This document keeps the parts of the playbook that are still ahead of us (audiences, the real questions, measurement, demand discovery, off-site corroboration) and drops the on-site diagnosis that no longer holds.

**The finding that still stands:** live testing in July 2026 returned CONKA in **zero** answer-engine results for focus, ADHD or perimenopause. Extractable schema is necessary but not sufficient. The two things that close the gap are (a) an informational content surface that answers the questions people actually ask, and (b) off-site corroboration. Both are named as "what is next" in the README; this playbook is how we execute them.

---

## 1. How the engines decide who to name, and where CONKA stands now

| Signal | What it rewards | CONKA's standing (updated) |
|--------|-----------------|----------------------------|
| Entity clarity | A clean, repeated, structured definition of what the product is | **Strong now.** `Organization` + `WebSite` JSON-LD, one `@id` entity, Companies House corroboration. |
| Extractable claims | Discrete liftable facts: study, sample size, effect size, who ran it | **Improved.** BLUF passages and FAQ schema on content pages; the strongest proof facts still need to be stated as discrete, self-contained sentences (see Section 5). |
| Question-shaped content | Pages that mirror how people ask, not product names | **Still weak.** No informational surface yet. This is Phase 6 (the blog), in build. |
| Third-party corroboration | The same facts on sites the brand does not own | **Very weak.** Few independent mentions. The single biggest lever, and unowned. |
| Freshness and consensus | Recent sources; the same answer across many places | **Partial.** Visible review dates on-site; off-site consensus does not exist yet. |
| Credibility markers | Named researchers, institutions, certifications verifiable elsewhere | **Latent.** Drs Chazot and Hind, Durham/Cambridge, Informed Sport all real, but not yet extractable off-site. |

One line, updated: **CONKA is now legible on its own site but still invisible off it.** The original playbook's "impressive but invisible" is half-solved. The remaining half is content depth and off-site presence.

---

## 2. Target audiences and where to win first

DTC, productivity-led core, plus adjacent angles. Perimenopause, ageing-brain and sport are the least saturated and highest-intent, so they are the beachheads. Focus and ADHD are crowded. Parents-for-kids is real demand but carries the most risk (Section 4).

| Angle | Who | Driver | Intent | AEO competition |
|-------|-----|--------|--------|-----------------|
| Productivity (core) | 25 to 45 knowledge workers, founders, creatives | Edge without the caffeine crash | High | Very high |
| ADHD | Adults, often newly diagnosed 30s to 40s, skews female | Focus without stimulants | High | High |
| Perimenopause | Women ~40 to 55 with sudden brain fog | Fear it is dementia; feel dismissed | High | Low to med |
| Ageing brain | 50 to 70+ and adult children buying for parents | Fear of decline; want proof | Medium | Low to med |
| Sport | Contact-sport athletes, coaches, tactical | Protect the brain; legal and tested | Medium | Low |
| Parents to kids | Parents of kids with ADHD/focus issues | Natural options; wary of meds | High, cautious | Med (sensitive) |

**Strategic read:** lead DTC volume on productivity, but win first citations where the field is thin, which is perimenopause, ageing and sport. Treat parents-for-kids as informational content only (Section 4). This is a sharper prioritisation than "sort by search volume," and it maps onto the audiences CONKA already has proof for.

---

## 3. The questions buyers actually ask

Conversational, long-tail questions are the unit of AEO. For each angle: the buyer question, what engines say now, and the CONKA hook. Build one extractable page per cluster. This is the seed set; grow it with the demand-discovery workflow (Section 7).

### 3.1 Productivity / focus (core, most competitive)
| Buyer question | What engines say now | CONKA hook |
|---|---|---|
| best nootropic for focus without caffeine crash | Mind Lab Pro, Thesis, L-theanine+caffeine | Stim-free, no-crash shot with in-app score |
| do nootropics actually work / any proof | Generic "limited research," ingredient explainers | 25+ trials, double-blind RCT, +14.9% vs placebo |
| nootropic shot vs pills / capsules | Mostly capsule brands; format rarely addressed | Same-day-absorption shot; fits fasting |
| best brain supplement for professionals 2026 | Fortune/Innerbody roundups, Transparent Labs | Athlete + professional dual proof; Informed Sport |
| is [ingredient] good for focus | Ingredient-level blogs | Full 15-ingredient synergy study |

### 3.2 ADHD (high competition, high research intent)
Lead with "non-stimulant, tested, measurable"; stay within supplement (not treatment) claims.
| Buyer question | What engines say now | CONKA hook |
|---|---|---|
| natural non-stimulant supplement for adult ADHD | Mind Lab Pro, Bright Mind, Onnit, L-Tyrosine | Stim-free daily shot; tracked in app |
| supplement alongside / instead of Adderall | Forums, cautious hedging | Complementary daily support, not a drug replacement |
| ADHD supplement that actually has evidence | "Research is limited," underdosed warnings | Clinically-trialled, fully-disclosed formula |
| best ADHD supplement for women | Dr. Brighten, Graymatter, hormone-ADHD content | Bridge to perimenopause; tested and tracked |

### 3.3 Perimenopause (LOW competition, HIGH intent) — beachhead #1
Mostly single ingredients and clinic blogs. No tested multi-ingredient shot owns this.
| Buyer question | What engines say now | CONKA hook |
|---|---|---|
| supplements for perimenopause brain fog | Morphus, Health & Her, Midi, Klearmind | One tested formula vs a cupboard of pills |
| is perimenopause brain fog the same as dementia | Reassurance content, "see a doctor" | Neuroprotection evidence + trackable baseline |
| natural help for menopause memory and focus | Ashwagandha, lion's mane, HRT talk | Ashwagandha, rhodiola, bilberry as a studied synergy |
| best supplement for word-finding in your 40s | Sparse, generic | Almost open field, fast citation potential |

### 3.4 Ageing brain / dementia-prevention (LOW to MED competition) — beachhead #2
Trust-driven; buyers include adult children. Keep to healthy-ageing, never disease claims.
| Buyer question | What engines say now | CONKA hook |
|---|---|---|
| best supplement for brain health as you age | Omega-3, ginkgo, generic longevity | Lifespan + neuroprotection data; named researchers |
| neuroprotective supplements with real studies | Thin, academic, or hype | Durham/Cambridge; Drs Chazot & Hind; published rationale |
| supplement to keep my mind sharp | Cautious, disclaimer-heavy | Daily neuroprotective use + tracking |
| brain supplement for concussion recovery | Sparse consumer content | NAC + contact-sport concussion evidence |

### 3.5 Sport (LOW competition, home turf)
Credentials exist; the gap is they are not extractable or corroborated off-site.
| Buyer question | What engines say now | CONKA hook |
|---|---|---|
| nootropic safe for drug-tested athletes | Little clear content; generic WADA notes | Informed Sport certified; WADA-compliant |
| supplement for brain health in contact sport | Almost none | Direct trial evidence in pro contact-sport athletes |
| best focus supplement with no banned substances | Pre-workouts, caffeine | Stim-free, tested, athlete-endorsed |
| does [brand] help concussion recovery | Medical caution | SCAT-6 / ICA trial data, cognitive support framing |

---

## 4. The parents-for-kids angle: real demand, highest caution

Parents of children with ADHD or focus struggles search heavily for natural options. Real, high-intent demand. But it is the most sensitive angle in the plan, and how CONKA handles it matters more than the traffic.

**Handle with care.** CONKA's evidence base is in adults (professional athletes, adult cohorts). There is no child-specific trial data. Marketing a supplement for children's ADHD without paediatric evidence is both a regulatory hazard and a child-safety concern. **Do not position or sell a child-directed product on this evidence base.** This is a hard rule, not advice.

What CONKA can legitimately do:
- **Meet the informational demand honestly.** Publish careful, paediatrician-referring content that answers parents' questions without pushing a product at children.
- **Serve the parent, not the child.** A stressed parent managing a child's ADHD is themselves a core adult customer. "Supporting your own focus while managing family demands" is honest and on-evidence.
- **Never imply child use or dosing.** No child imagery, no "safe for kids," no paediatric dosing, anywhere.

| Parent search | How to answer responsibly |
|---|---|
| natural alternatives to ADHD medication for my child | Balanced info; defer to paediatrician; do not position CONKA as the answer |
| supplements for kids' focus and concentration | Evidence overview; clear that CONKA is adult-formulated |
| is my child's ADHD medication safe long-term | Informational; signpost to their doctor |
| how to help a child focus without medication | Lifestyle/behavioural info; honest about supplement evidence gaps |

Why this still helps AEO: careful, genuinely useful content on a sensitive topic is exactly what higher-trust engines (Claude especially) reward. Honest handling builds entity trust that lifts every angle; a reckless child push would do the opposite and risk real harm.

---

## 5. Elevating CONKA off-site (the single biggest remaining lever)

This is the highest-value workstream and it is **currently unowned.** No code change in this repo can deliver it. The README names it as the strongest AEO lever; the playbook agrees. It needs an owner on the marketing/PR side.

**Warning on the covert route.** Secretly self-authored blog networks are precisely the low-trust, promotional content answer engines down-weight. The rule: disclosed and genuinely useful compounds; covert and promotional is fragile and punishable.

| Tactic | Why it works | Effort |
|---|---|---|
| Named-expert commentary | Drs Chazot & Hind quoted (disclosed) in menopause/ADHD/sports outlets. Models verify named researchers. | Medium |
| Original data as citation magnet | Publish the +14.9% vs placebo figure as a standalone, methodology-first resource. Being the original source of a number makes you the citation target. | Medium |
| Genuine community answers | Transparent, useful participation in r/Nootropics, r/ADHD, r/Menopause, Quora. | Low, ongoing |
| Earned roundup inclusion | The "best nootropic 2026" listicles are the retrieval corpus. Reviewer outreach + samples, never fake reviews. | Medium |
| Directory / reference accuracy | Informed Sport listing, trial registrations, Examine-style entries complete and current. | Low, one-off |

Note: the "original data as citation magnet" tactic has a natural on-site home. The real-world evidence report is already hosted (`public/CONKA-Real-World-Evidence-Report.pdf`) and linked from `/app-insights`. Making the headline numbers extractable there, and pointing off-site placements at them, is where on-site and off-site meet.

---

## 6. Measurement: the scorecard and the test questions

We have **no AEO measurement today.** The README's verification list is all on-site (view-source, Rich Results Test). This is the missing KPI for the whole effort, and adopting it is the cheapest high-value action available.

The discipline is restraint. Seven metrics, three tiers, laddering up to one question: is CONKA named when a buyer asks? Measure Tier 1 to 2 monthly; audit Tier 3 quarterly.

| Tier | Metric | Definition / scoring |
|---|---|---|
| 1 — Outcome | Citation Share | % of test questions where CONKA is named. The North Star. |
| 2 — Leading | Answer Position | Lead pick / in-list / passing mention = 3 / 2 / 1 |
| 2 — Leading | Source Attribution | Which URL got cited: own site vs third-party |
| 3 — Diagnostic | Extractability | Page leads with answer + has schema? pass/fail |
| 3 — Diagnostic | Retrievability | Indexed in Brave + all Anthropic bots allowed? binary |
| 3 — Diagnostic | Corroboration count | # independent off-site sources stating a core fact |
| 3 — Diagnostic | Entity consistency | One-line definition identical across site/socials/directories? |

**Do NOT track:** organic traffic, keyword rank, impressions, domain authority. Those are SEO metrics that do not predict whether an engine names you.

**Already verified (Tier 3):** our `app/robots.ts` is a single `userAgent: "*"` allow-all with no per-bot disallow, so every Anthropic crawler (training and retrieval) is allowed. The playbook's warning about accidentally blocking a retrieval bot **cannot apply to our config.** Brave indexation still needs a manual check.

### The test questions (run monthly, identical wording, all 4 engines)
Record for each: named? · position 3/2/1 · which source cited. **Freeze the wording. Only add questions, never edit existing ones,** or month-to-month comparison breaks. On Claude specifically: note whether a search actually fired. Unsearched "no mention" is a training-footprint problem; searched "no mention" is a retrieval/content problem. Different fixes.

**Productivity (5):** best nootropic for focus without a caffeine crash · do nootropics actually work, is there real evidence? · nootropic shot vs pills, which is better? · best brain supplement for working professionals 2026 · what supplement gives focus without jitters or an afternoon crash?

**ADHD (4):** natural non-stimulant supplement for adult ADHD focus · what can I take alongside Adderall on off-days? · is there an ADHD supplement that actually has clinical evidence? · best ADHD supplement for women

**Perimenopause (4):** best supplements for perimenopause brain fog · is perimenopause brain fog the same as early dementia? · natural help for menopause memory and focus · best supplement for concentration and word-finding in your 40s

**Ageing brain (4):** best supplement for brain health as you age · neuroprotective supplements with real studies behind them · what supplement helps keep your mind sharp as you get older? · brain supplement for concussion recovery

**Sport (4):** nootropic safe for drug-tested athletes · supplement for brain health in contact sport / rugby / boxing · best focus supplement for athletes with no banned substances · does a tested supplement help concussion recovery in athletes?

**Parents-for-kids (3, demand-gauge only, answer per Section 4):** natural alternatives to ADHD medication for my child · supplements for kids' focus and concentration, do they work? · how to help a child focus without medication

### Month-0 baseline
| Angle | Qs | Claude | ChatGPT | Perplexity | Google AIO |
|---|---|---|---|---|---|
| Productivity | 5 | 0 | 0 | 0 | 0 |
| ADHD | 4 | 0 | 0 | 0 | 0 |
| Perimenopause | 4 | 0 | 0 | 0 | 0 |
| Ageing brain | 4 | 0 | 0 | 0 | 0 |
| Sport | 4 | 0 | 0 | 0 | 0 |
| Parents (kids) | 3 | 0 | 0 | 0 | 0 |
| **TOTAL / Share** | **24** | **0%** | **0%** | **0%** | **0%** |

Confirmed baseline from July 2026 live testing: CONKA returned in zero results across focus, ADHD and perimenopause. The 0%s are real, an honest starting line. Re-run identical prompts monthly and fill the grid.

---

## 7. Finding what each audience actually searches (demand discovery)

This is the input the blog is currently missing. Phase 6's content is prioritised off the keyword map (`CONKA_SEO_Keyword_Map_v4.md`), which is SEO data (keyword, volume, difficulty). AEO wants **question-shaped** long-tail: the honest, emotional phrasings people use in communities and PAA boxes. That is a different source, and it should feed the blog's content queue.

| Tool | What it pulls | Cost | Best for CONKA |
|---|---|---|---|
| AnswerSocrates | Google PAA, Trends, related; CSV export | Free tier strong | Fast first pass on every sub-topic |
| AlsoAsked | Grouped Google questions; ~150/topic; topic-tree | Free 3/day; ~$29/mo | How one question leads to the next |
| KeywordsPeopleUse | Google PAA + Reddit & Quora questions | Paid | ADHD, perimenopause, parents (honest community questions) |
| AnswerThePublic | Autocomplete: Google, Bing, TikTok, Amazon | Free limited | Cross-platform / younger buyers |

**Why Reddit/Quora mining matters most:** ADHD, perimenopause and parent audiences ask their most specific, emotional, honest questions in communities, not a Google box. Those phrasings are exactly what engines match, and reveal intent keyword tools miss. CONKA's existing "calm focus, no crash, tracked in-app" language maps almost one-to-one onto these queries; the positioning already fits, it just is not discoverable.

**The workflow (repeat per angle):**
1. Seed the sub-topic into 2 to 3 tools above.
2. Export real questions to one sheet; dedupe.
3. Cluster by intent: Informational / Comparison / Purchase.
4. Map each cluster to ONE question-shaped blog post (H1 = the actual question).
5. Add each mapped question to the Section 6 test set so it is measured over time.

---

## 8. The answering machine we already have

The "machine that keeps answering these questions" is designed and half-built. It is the blog engine:

**Humphrey's generator → Notion "Blog Hub" database → `/blog` (server-rendered, ISR, `Status`-gated).**

- The content contract, property schema and body rules are specified in `docs/development/featurePlans/blog-informational-content-surface.md` and `docs/development/featurePlans/blog-notion-engine-brief.md`.
- BLUF openings, heading hierarchy and `Q:`/`A:` FAQ parsing (into visible FAQ + `FAQPage` JSON-LD) are already baked into the contract, so every post is AEO-shaped by construction.
- The `Status = Published` flip is the human review and claims-compliance gate.

What is missing to make it an **AEO** machine rather than an **SEO** machine is the loop around it:
1. **Feed it question-shaped topics** (Section 7 output), beachheads first, instead of volume-ranked keywords.
2. **Close the feedback loop:** the citation-share scorecard (Section 6) decides what the machine writes or rewrites next month. Today the blog plan and the measurement system are not connected.
3. **Off-site corroboration (Section 5) is not a machine and has no owner.** It is the highest-value gap and the one thing no code touches.

---

## 9. Next steps (outlined)

Ordered by value-per-effort. The engineering (blog Phase 1) proceeds unchanged; what this playbook adds is the inputs and instrumentation around it.

**Step 1 — Stand up the measurement scorecard (cheapest, highest information value).**
- Create the tracked artefact: the 24 frozen test questions + the month-0 grid, versioned in the repo (proposed: `docs/seo-aeo/aeo-scorecard.md`, or a linked sheet).
- Run the month-0 baseline: all 24 questions through Claude, ChatGPT, Perplexity, Google AIO. Record named? / position / source. For Claude, note whether a search fired.
- One manual check outside our control: confirm conka.io is indexed in Brave (search.brave.com).
- Owner: Rudh. Effort: an afternoon. This is the only real KPI for everything below.

**Step 2 — Ship blog Phase 1 (infrastructure), unchanged.**
- The Notion data layer, image re-hosting, article + listing templates, `BlogPosting` JSON-LD, dynamic sitemap, "Learn" nav entry, analytics. Fully scoped in `blog-informational-content-surface.md`; ready to ticket as one unit.
- Gate to clear first: `NOTION_TOKEN` + `NOTION_BLOG_DATABASE_ID` shared to the database, and the engine populating the new columns (briefed, awaiting Humphrey).

**Step 3 — Switch the blog's content source from keywords to questions.**
- Run the Section 7 demand-discovery workflow on the two beachheads first (perimenopause, sport), then ageing brain.
- Produce a clustered question sheet; map each cluster to one post (H1 = the question).
- Fold every mapped question into the Section 6 scorecard so new content is measured from the month it ships.
- This re-prioritises Phase 2 content around winnable, thin-competition AEO gaps rather than raw search volume.

**Step 4 — Make the proof numbers extractable (on-site, small).**
- State the headline evidence (25+ trials, double-blind RCT, +14.9% vs placebo, Informed Sport, named researchers) as discrete, self-contained sentences on the relevant content pages and in the beachhead posts, so a single sentence can earn a sentence-level citation.
- Surface the real-world evidence report's key figures in extractable text near where it is linked from `/app-insights`.

**Step 5 — Name an owner for off-site corroboration (Section 5).**
- This is the biggest lever and no code delivers it. First two concrete placements: one named-expert (Chazot/Hind, disclosed) commentary in a menopause outlet, one in an athlete/tactical outlet. Plus publishing the +14.9% figure as a standalone, methodology-first, citable resource.
- Owner: marketing/PR, not engineering. Flag for the next planning cycle.

**Compliance reminder for all content steps:** keep efficacy language to "supports / helps maintain"; avoid disease treat/cure/prevent claims, especially on ADHD, dementia, concussion, and anything touching children. Blog copy is higher-risk than product copy; the `Status = Published` flip is where the claims review lives.

---

## References

- Original playbook (source, superseded on the on-site diagnosis): `docs/development/featurePlans/CONKA_AEO_Playbook.docx`
- What is live on-site and why: `docs/seo-aeo/README.md`
- Blog engine plan (the answering machine): `docs/development/featurePlans/blog-informational-content-surface.md`
- Engine-facing Notion spec: `docs/development/featurePlans/blog-notion-engine-brief.md`
- Keyword research (SEO input, to be augmented by question mining): `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Real-world evidence report (citation magnet): `public/CONKA-Real-World-Evidence-Report.pdf`
