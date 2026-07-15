# AEO Scorecard

The measurement instrument for the AEO programme. Run it monthly, record the results, watch the trend. Companion to `docs/seo-aeo/AEO_PLAYBOOK.md` (strategy) and `docs/seo-aeo/README.md` (what is live on-site).

**North Star:** Citation Share, the % of the frozen question set where CONKA is named by an answer engine.

**Question set:** v1, frozen 2026-07-15. 24 questions across 6 angles. **Freeze rule: never edit an existing question, only add new ones** (as labelled later cohorts), or month-to-month comparison breaks.

---

## What this measures, and what it does not

- **It is an index, not a population estimate.** Citation Share is `named / 24` against a hand-built list, so "8%" means 8% of *this list*, not 8% of real buyer demand. The trustworthy signal is the **change over time**, not the absolute level. Do not report the absolute number as market coverage.
- **The question set is author-written, not demand-mined.** v1 is a directional scaffold. A demand-mining pass (playbook Section 7: AnswerSocrates / AlsoAsked / Reddit + Quora) should add a second labelled cohort once the beachhead content ships. At 0% baseline, precision is not binding; detecting movement off zero does not need surgically-mined phrasing.
- **Two baselines, two methods.** The **live-engine** baseline (Tier 1, below) requires a human to query Claude, ChatGPT, Perplexity and Google AIO and read the synthesized answers. It cannot be automated honestly. The **retrieval-corpus** baseline (captured 2026-07-15 via web search) is a legitimate proxy: if CONKA appears nowhere in the retrievable sources, no retrieval engine can cite it. Both currently read zero.

---

## Baseline headline (2026-07-15)

| Metric | Value | Method |
|--------|-------|--------|
| Citation Share (live engines) | **0%** | Confirmed July 2026 live testing across focus, ADHD, perimenopause (Humphrey). Re-run monthly, all 24 x 4 engines. |
| Retrieval presence | **0 / 24** | Web search per question, 2026-07-15. CONKA (conka.io) surfaced in none. |
| Retrievability (bots) | **Pass** | `app/robots.ts` is `userAgent: "*"` allow-all; every Anthropic crawler allowed. Brave index status still to confirm manually. |
| Entity consistency | Strong on-site | `Organization` + `WebSite` JSON-LD, one `@id`, Companies House corroboration (README Phase 7). |

**Read:** the on-site foundation is built, but CONKA is absent from the retrievable web for every buyer question. This is a content-and-corroboration gap, not a technical one.

---

## Tier 1: Citation Share grid (the monthly live run)

Run each of the 24 questions, identical wording, through **Claude, ChatGPT, Perplexity, Google AI Overviews**. Record per cell the count of questions in that angle where CONKA is named. For Claude, note whether a search actually fired (unsearched "no mention" = training-footprint problem; searched "no mention" = retrieval/content problem).

| Angle | Qs | Claude | ChatGPT | Perplexity | Google AIO |
|-------|----|--------|---------|------------|------------|
| Productivity | 5 | 0 | 0 | 0 | 0 |
| ADHD | 4 | 0 | 0 | 0 | 0 |
| Perimenopause | 4 | 0 | 0 | 0 | 0 |
| Ageing brain | 4 | 0 | 0 | 0 | 0 |
| Sport | 4 | 0 | 0 | 0 | 0 |
| Parents (kids) | 3 | 0 | 0 | 0 | 0 |
| **TOTAL / Share** | **24** | **0%** | **0%** | **0%** | **0%** |

*Baseline row = month 0 (2026-07-15). Copy this table under a new dated heading each month; do not overwrite.*

---

## Tier 2/3: retrieval baseline + competitive map (captured 2026-07-15)

Per question: does CONKA surface, who owns the answer now, and a priority. Priority is derived from the corpus, not intent:
- **P1 Winnable** — no strong branded product owns it; incumbents are weak brand blogs or an open gap. Best content targets.
- **P2 Contested** — a strong brand incumbent already ranks; displaceable but harder.
- **P3 Informational-only** — locked by health-authority / academic / behavioural content with no product entry point. Answer to build entity trust (playbook Section 4), do not expect a product to rank, and mind claims risk.

### Productivity / focus
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 1 | best nootropic for focus without a caffeine crash | No | Mind Lab Pro / Seed / Cereflex (brand blogs) + Innerbody/Fortune roundups | P2 |
| 2 | do nootropics actually work, is there real evidence? | No | BBC Science Focus, The Conversation, WebMD, PMC (skeptical science/academic) | P3 |
| 3 | nootropic shot vs pills, which is better? | No | **Magic Mind** (shot brand) + Noobru, Solti | P1 (format match; direct competitor to displace) |
| 4 | best brain supplement for working professionals | No | GoodRx, Kaiser (authority) + Mind Lab Pro (capsule brands) | P2 |
| 5 | what supplement gives focus without jitters or an afternoon crash? | No | Graymatter, NeuroGum, BrainMD, Seed (brand blogs) | P2 |

### ADHD
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 6 | natural non-stimulant supplement for adult ADHD focus | No | Dr Brighten, Elevating Minds (clinician blogs) + Graymatter | P2 |
| 7 | what can I take alongside Adderall on off-days? | No | Cleveland Clinic, Medical News Today, GoodRx (drug-interaction authority) | P3 |
| 8 | is there an ADHD supplement that actually has clinical evidence? | No | NCCIH/NIH, PMC meta-analyses, clinic blogs | P3 |
| 9 | best ADHD supplement for women | No | Noops (brand), The Good Trade, Dr Brighten, PMC | P2 |

### Perimenopause (beachhead #1)
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 10 | best supplements for perimenopause brain fog | No | Midi, Dr Brighten, Klearmind (clinic blogs); no tested multi-ingredient shot owns it | **P1 (open lane)** |
| 11 | is perimenopause brain fog the same as early dementia? | No | Psychology Today, Dementia UK, MenoHealth (reassurance authority) | P3 |
| 12 | natural help for menopause memory and focus | No | MPowder, Womaness (menopause brands already rank), Napiers | P2 |
| 13 | best supplement for concentration and word-finding in your 40s | No | Mind Lab Pro, Life Extension (generic focus); the "word-finding" specificity is unaddressed | **P1 (open gap)** |

### Ageing brain (beachhead #2)
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 14 | best supplement for brain health as you age | No | GoodRx, WebMD, hospital blogs + Life Extension | P3 |
| 15 | neuroprotective supplements with real studies behind them | No | PMC, Frontiers, ScienceDirect (primary academic) | P3 (hardest; but where CONKA's named-researcher proof could earn a citation) |
| 16 | what supplement helps keep your mind sharp as you get older? | No | WebMD + Baptist/Kaiser/Geisinger (debunking-leaning authority) | P3 |
| 17 | brain supplement for concussion recovery | No | Mind Lab Pro + concussion/PT clinic blogs; ingredient-led, no UK shot | **P1 (open, CONKA concussion origin)** |

### Sport (home turf)
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 18 | nootropic safe for drug-tested athletes | No | Mind Lab Pro (brand blog) + BSCG/WADA generic guidance | P2 (Informed Sport is CONKA's direct wedge) |
| 19 | supplement for brain health in contact sport, rugby, boxing | No | Academic omega-3 reviews (Edinburgh Rugby 28% DHA trial recurs); no branded product owns it | **P1 (open lane)** |
| 20 | best focus supplement for athletes with no banned substances | No | Mind Lab Pro, Cover Three, Cereflex + BarBend roundups | P2 |
| 21 | does a tested supplement help concussion recovery in athletes? | No | PubMed, rehab-clinic blogs; ingredient-led, no product | P3 |

### Parents to kids (demand-gauge only, answer per playbook Section 4)
| # | Question | CONKA? | Owns it now | Priority |
|---|----------|--------|-------------|----------|
| 22 | natural alternatives to ADHD medication for my child | No | WebMD, Healthline, Dr Roseann + PMC RCTs | P3 (informational only; never position a child product) |
| 23 | supplements for kids' focus and concentration, do they work? | No | NHC, GOJOY, Seeking Health (kids-supplement retailers) + Quora | P3 (informational only) |
| 24 | how to help a child focus without medication | No | Mayo, CDC, APA, KidsHealth (behavioural authority); no product entry | P3 (informational only) |

---

## Strategic read from the baseline

1. **The incumbents win on owned blog content, not proof.** Mind Lab Pro surfaces across every angle (productivity, ADHD, ageing, sport) purely via its own blog. It does not have CONKA's 25+ trials or Informed Sport. It has a blog and CONKA does not. This is the single strongest validation of the Phase 6 blog engine: the moat is content volume, and it is winnable.
2. **The shot format is owned by Magic Mind (Q3), the one query where CONKA has a structural match.** A "shot vs pills / vs Magic Mind" comparison is a direct, high-leverage first post.
3. **Four genuinely open P1 lanes** with no strong branded incumbent: perimenopause brain fog (10), word-finding in your 40s (13), brain-health-in-contact-sport (19), and concussion recovery (17, where CONKA's origin story is on-point). Start beachhead content here.
4. **P3 health-authority-locked queries are not product targets.** Dementia-vs-brain-fog, keep-mind-sharp, Adderall off-days, ADHD clinical evidence and all three parent queries are owned by Mayo/CDC/NIH/major-publisher content. Answer them informationally to build entity trust; a product page will not rank and the claims risk is highest here.
5. **The one academic query worth a long shot (15):** "neuroprotective supplements with real studies" pulls PubMed. It is the hardest to enter, but it is also the only place CONKA's named-researcher, published-rationale proof (Drs Chazot & Hind, Durham/Cambridge) could plausibly earn a sentence-level citation if stated as discrete extractable facts.

---

## How to run it each month

1. Copy the Tier 1 grid under a new dated heading (`## Month N — YYYY-MM-DD`). Do not overwrite the baseline.
2. Run all 24 questions, verbatim, through Claude, ChatGPT, Perplexity, Google AIO. Record named? / position (3 lead, 2 in-list, 1 passing) / which URL cited. For Claude, note search-fired.
3. Update Citation Share and note which sources cited CONKA (own site vs third-party, the Tier 2 signal that shows whether the blog or off-site corroboration is doing the work).
4. Quarterly: re-run the retrieval-corpus check (can be delegated to web search) to see whether CONKA has entered the corpus for the P1 lanes.
5. Add newly-mined questions only as a **new labelled cohort** with its own start month. Never edit the v1 set.

## Change log
- **2026-07-15** — v1 frozen. 24 questions, retrieval baseline captured (0/24 present), live-engine baseline 0% (confirmed July 2026). Year-stamp removed from the "working professionals" question before freezing.
