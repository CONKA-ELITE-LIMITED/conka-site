# AEO Free-Tool Runbook — mining raw demand without paying

**Status:** Active runbook. First forum pass run 2026-07-15; first Search Console pass run 2026-07-16 (results for both included below).
**Owner:** Rudh.
**Purpose:** A repeatable, no-cost way to fill the three gaps the automated search fan-out could not reach (see `aeo-demographic-query-research.md` → Methodology): (1) raw first-person user phrasings, (2) Google People Also Ask / autocomplete, (3) real demand ranking. Use this monthly to sharpen the content queue and to rank the P1 lanes by real demand before committing writing effort.

**Feeds:** the content queue in `aeo-demographic-query-research.md` (Phase 2) and the scorecard cohort in `aeo-scorecard.md`.

---

## The recommendation, in one line

Run **AnswerSocrates** (free, no login) for question breadth, then a **direct Reddit + community-forum** pass for raw voice, and check **Google Search Console** for what already reaches us. That free trio covers questions, phrasings, and real demand. Paid tools only buy hard volume numbers on top — defer them until a lane proves worth spending on.

---

## Why these tools, and what each one is actually for

| Tool | Cost | Fills which gap | Login? |
|------|------|-----------------|--------|
| **AnswerSocrates** | Free | PAA + autocomplete questions per seed, grouped by who/what/why/how/can — the breadth layer | No |
| **Direct Reddit search** | Free | The rawest first-person emotional phrasings; the crawler cannot reach Reddit, a human browser can | No (for search) |
| **Community/patient forums** | Free | Same raw voice as Reddit but indexed (Mumsnet, HealthUnlocked, Patient.info, Sherdog) — reachable even headless | No |
| **Google Search Console** | Free, ours | The truest signal: real queries already reaching conka.io, by theme. Rank lanes by this first | Google login |
| **AlsoAsked** (free tier ~3/day) | Free-ish | The nested PAA *tree* for the top seeds only | No |
| **Google Trends / Keyword Planner** | Free | Volume ranges + rising queries — the KD/volume tiebreaker | Google (Planner) |

Everything above is a scraper or view of the same two ground-truth sources: Google's own SERP features and community threads. Paid tools (KeywordsPeopleUse, Ahrefs, Semrush) add hard volume numbers, deep Reddit aggregation, and bulk export — nothing the free stack can't approximate for building a queue.

---

## The monthly routine (about 20 minutes)

Do this once a month per active lane (start with the P1 lanes: perimenopause, sport). Each step says exactly what to click and what to copy back into the queue.

### Step 1 — Google Search Console first (5 min)

> **Ran 2026-07-16: zero impressions in every lane.** Until content ships, Step 1 measures rather than ranks — run it for month-on-month movement, but take lane priority from Steps 2 and 3. Full results and the API method are below.

1. Open Search Console → the conka.io property → **Performance** → **Search results**.
2. Set the date range to the last 3 months. Add a **Query** filter containing the lane's core word (e.g. `menopause`, `concussion`, `brain fog`, `focus`).
3. Sort by Impressions. Copy any query that already shows impressions into the queue — these are real people already finding us for that theme, so they rank first.
4. Note the average position. Queries where we impress but sit at position 8+ are the fastest wins (demand exists, we just aren't answering it well yet).
5. Cross-reference against the baseline in `docs/seo-aeo/seo-search-console-baseline.md` so month-on-month movement is visible.

*Why first:* this is our own real demand data. It beats every tool because it is our actual audience, not an estimate.

### Step 2 — AnswerSocrates for question breadth (5 min)

1. Go to `answersocrates.com`. No login.
2. Enter the lane seed (e.g. `menopause brain fog`), set country to **United Kingdom**, search.
3. It returns questions grouped by *who / what / why / when / where / which / will / can / are / how*, plus prepositions (`for`, `with`, `without`, `vs`) and comparisons.
4. Export CSV (free) or copy the *why / how / can* groups — those hold the highest-intent informational questions.
5. Paste net-new questions (ones not already in the corpus) into the queue, tagged with the lane.

*If AnswerSocrates is down or gated:* use **AlsoAsked** free tier for the top 1–2 seeds to get the PAA tree, or read Google's own "People also ask" box directly by searching the seed in a normal browser and expanding the questions.

### Step 3 — Reddit + forums for raw voice (8 min)

1. In a normal browser, search Google: `site:reddit.com <seed> "brain fog"` (or the lane's core symptom). Open 3–4 threads.
2. Copy **thread titles and top-comment questions phrased in the first person** — "I", "my", "am I the only one", "please tell me this is normal". These become the emotional H1s the listicles never write.
3. Repeat on the indexed forums that reliably yield (see the first-run results below): Mumsnet (perimenopause, parents), HealthUnlocked CHADD board (ADHD), Patient.info (perimenopause), Sherdog (contact-sport brain health).
4. Add net-new phrasings to the queue and mark them "raw voice" — prefer these for the actual post H1 because they match how people speak.

### Step 4 — Volume as tiebreaker only (2 min)

1. For the 5–6 questions you are about to queue for a lane, check **Google Trends** (set region United Kingdom) to confirm interest is stable or rising, not dead.
2. Optionally check **Keyword Planner** for a volume range.
3. Use this only to order questions that are otherwise tied on lane and intent. Never let volume override an open-lane, question-shaped opportunity — that is the mistake the keyword map already makes.

### Step 5 — Feed it back

1. Add net-new questions to the content queue in `aeo-demographic-query-research.md` (Phase 2 table).
2. Add the queued questions to `aeo-scorecard.md` as the dated cohort (never edit the frozen v1 set).

---

## First-run results — Search Console pass (2026-07-16)

**Range:** 2026-04-15 to 2026-07-14 (92 days). **Property:** `https://www.conka.io/` (URL-prefix, not a domain property). **Method:** pulled via the Search Console API rather than the UI (see "Running Step 1 programmatically" below), so these are full result sets, not the UI's 1,000-row cap.

### Headline

| Metric | Value |
|---|---|
| Queries | 193 |
| Clicks | 945 |
| Impressions | 6,638 |
| Brand share | **99% of clicks, 90% of impressions** |
| True non-brand | **11 clicks in 3 months** |

The brand share is understated even at 99%. Of the 121 queries that survive a `conka` regex, roughly 70% are still brand: fuzzy misspellings (`ganka`, `jonka`, `kanka`, `xonka`, `synka`, `čonka`, `comka`, `chonka`) that Google matches to conka.io at positions 40 to 90. Genuine non-brand demand is a rounding error.

### Lane results — every P1/P2 lane is ZERO

| Lane | Queries | Impressions |
|---|---|---|
| Perimenopause | 0 | 0 |
| Sport / concussion / CTE | 0 | 0 |
| Brain fog | 0 | 0 |
| Focus / memory | 0 | 0 |
| ADHD | 0 | 0 |
| Ageing / dementia / cognitive decline | 0 | 0 |
| Nootropic / supplement | 18 | 62 (1 click, avg pos 11.8) |

Checked beyond the runbook's five seeds against the full demographic taxonomy (dementia, cognitive decline, anxiety, chronic fatigue, sleep, recovery, energy, subconcussion, reactions, rugby, boxing, F1/racing): **zero impressions across all of them.** The only lane with a pulse is the `nootropic shot(s)` head term.

### What Step 1 actually established

**GSC cannot rank the P1 lanes, and that is the finding.** It was meant to order perimenopause vs sport by real demand; it cannot distinguish zero from zero. This corroborates the scorecard's "named in 0 of 24" baseline from the retrieval side: CONKA is not weakly present in these lanes, it is absent. **Consequence: demote Step 1 for lanes we have not entered yet.** It is a *measurement* instrument, not a *ranking* one, until content exists. Rank from the corpus and strategic fit instead (Steps 2 and 3 carry that load for now), and re-run Step 1 as the month-on-month check once the queue ships.

### Four findings the lane framing missed

1. **`humphrey bodington` is the single best non-brand asset** — 89 impressions, **6 clicks = 55% of all non-brand clicks**, more than every product and category term combined. The founder outranks the brand's subject matter as an organic entity. Implication for blog author bylines and for whose name the evidence report publishes under.
2. **One legacy blog post is the entire content engine, and it is on the wrong platform.** The `controlled imagination / mental rehearsal / visualisation` cluster is 11 queries / ~127 impressions at positions 6 to 12, and every query lands on `/blogs/news/visualisation-mental-imagery-and-rehearsal` — a **Shopify-hosted** blog path, not the Next.js site. It is the only page generating non-brand impressions from informational content, and it out-earns the whole product surface on non-brand reach. **Action for the blog build:** decide the migration/redirect for this post before `/blog` ships. Losing it costs the one asset that demonstrably works. It also validates the blog thesis in miniature: one post, written once, beats the entire site on non-brand reach.
3. **We rank #1 for category head terms that have no volume** — `brain shot`, `cogni shot`, `brain formula`, `nootropic peptides`, and the competitor term `olly brain`, all at position 1.0, each with 1 to 5 impressions. We own the category vocabulary and the category vocabulary is empty. Strongest available evidence that head-term SEO is a dead end here and question-shaped long tail is the only route, which is what this programme already assumed.
4. **The US sees us and does not click.** GB: 3,864 impressions / 986 clicks / **25.5% CTR** / pos 3.6. US: 2,239 impressions / 75 clicks / **3.3% CTR** / pos 6.6. The US is 37% of impressions and converts 8x worse — a brand-awareness gap, relevant to any US ad spend.

*Curiosity, not yet a signal:* one impression at position 1 for *"what's the best nootropics brand for low-sugar functional shots?"* — a conversational, qualified, AI-assistant-shaped query. One impression is noise, but it is the exact query shape this programme targets and the first sighting of it in our data.

### Cheapest win found — not a content problem

`/science` earns **3,816 impressions at average position 5.1 but only 24 clicks (0.6% CTR)**. `/why-conka`: 1,858 impressions, 7 clicks (0.4%). Ranking fifth and being ignored is a title/meta problem, not a demand problem — the only place on the site where demand already exists and is being left on the table. Route to Phase 9 (`aeo-content-shape-phase-9.md`), which owns title/meta and answer-first framing on exactly these pages.

### Data caveat — do not quote these totals as site totals

Query-level impressions (6,638) undershoot the UI's 3-month figure (10.3K) because Google anonymises low-volume queries. But the **pages** pull sums to ~18.2K, which *overshoots* it. Part of that is the 92-day range vs the UI's "3 months", but not all of it. **Treat the UI's 10.3K / 1.32K as the site total** until the gap is reconciled. The lane and brand-share conclusions above are unaffected: they rest on ratios within the query set, not on absolute totals.

### Running Step 1 programmatically (optional, repeatable)

The UI export works and needs no setup. The API is faster, uncapped (25,000 rows vs the UI's 1,000), and re-runnable monthly without a browser. Cost: an OAuth credential.

```bash
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
gcloud services enable searchconsole.googleapis.com --project=conkaapp
gcloud auth application-default set-quota-project conkaapp
```

Then POST to `https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.conka.io%2F/searchAnalytics/query` with `{"startDate","endDate","dimensions":["query"],"rowLimit":25000,"type":"web"}`.

**Security note, read before running.** `gcloud auth application-default login` **cannot** issue a Search-Console-only credential: it hard-requires `cloud-platform`, a full read/write/delete scope over Google Cloud, and refuses to write the credential without it. There is no narrower ADC path. So this grants far more than the task needs. Mitigation used on this pass: consent, pull, then **revoke immediately** —

```bash
gcloud auth application-default revoke
```

Do not leave the credential live between passes. If that trade is unacceptable, use the manual UI export in Step 1 above; it costs ~20 minutes and grants nothing.

**Better long-term fix:** enable **Search Console → Settings → Bulk data export** to BigQuery. It needs no scope grant at all and lands the data where it can be queried directly. It is forward-only (no backfill), so it does nothing for the current month but makes every future pass a query instead of a chore. **Not yet enabled as of 2026-07-16** — worth doing at the next pass.

---

## First-run results — community-forum raw-voice pass (2026-07-15)

Run headless (Reddit and AnswerSocrates need the browser, which was not connected; these are the indexed forums reachable without it). Every row is a real thread with a live URL. Reply-count signals were not visible in search snippets, so they are omitted rather than invented. These are the raw-voice phrasings to prefer as post H1s.

### Perimenopause (Mumsnet + Patient.info)

| Verbatim thread title | Forum | URL |
|---|---|---|
| Perimenopause and losing words and memory - when you talk for a living | Mumsnet | mumsnet.com/talk/general_health/5348440 |
| Brain fog and tiredness: I have no idea how to do my job or think or make decisions | Mumsnet | mumsnet.com/talk/menopause/4493184 |
| What really works for perimenopause brain fog? | Mumsnet | mumsnet.com/talk/menopause/4545104 |
| What helps perimenopausal brain fog (and other symptoms)? | Mumsnet | mumsnet.com/talk/menopause/5035246 |
| My memory is awful | Mumsnet | mumsnet.com/talk/_chat/5021644 |
| Cure for brain fog/crap memory? | Mumsnet | mumsnet.com/talk/menopause/4338893 |
| AIBU to be worried about a sudden memory loss? | Mumsnet | mumsnet.com/talk/am_i_being_unreasonable/4540234 |
| Supplements that have helped brain fog/brain power | Mumsnet | mumsnet.com/talk/menopause/5181584 |
| Brain fog - how to help! Any magic supplements? | Mumsnet | mumsnet.com/talk/general_health/4257210 |
| Ginkgo Biloba and brain fog | Mumsnet | mumsnet.com/talk/menopause/4839954 |
| Feeling Braindead | Patient.info | patient.info/forums/discuss/feeling-braindead-632001 |
| Memory loss, brain fog, confusion w/perimenopause | Patient.info | community.patient.info/t/memory-loss-brain-fog-confusion-w-perimenopause/642959 |
| Brain fog....memory loss.... | Patient.info | patient.info/forums/discuss/brain-fog-memory-loss--336900 |

**Net-new hooks the authority pass missed:** the occupational-panic angle ("when you talk for a living", "no idea how to do my job") and the plea framing ("any magic supplements?", "cure for crap memory?"). Strong, specific P1 post angles.

### Sport / brain health (Sherdog — MMA/combat)

| Verbatim thread title | Forum | URL |
|---|---|---|
| can you get CTE from just training? | Sherdog | forums.sherdog.com/threads/3519877 |
| Can the right nutrition help prevent CTE? | Sherdog | forums.sherdog.com/threads/4376997 |
| Brain damage from sparring? | Sherdog | forums.sherdog.com/threads/4316863 |
| Got cracked in hard sparring, head doesn't feel the same 2+ weeks after | Sherdog | forums.sherdog.com/threads/3941801 |
| Head Pain after Sparring | Sherdog | forums.sherdog.com/threads/3771553 |
| Brain supplements? | Sherdog | forums.sherdog.com/threads/3774289 |
| Has anyone tried Alpha Brain that UFC fighters use? | Sherdog | forums.sherdog.com/threads/3352585 |
| Anyone here into nootropics? | Sherdog | forums.sherdog.com/threads/3656563 |

**Net-new hooks:** "Can the right nutrition help prevent CTE?" is a direct, unmet nutrition-intervention question in CONKA's exact lane. The hobbyist "just training" fear widens the audience beyond pro athletes. Alpha Brain is the named competitor to displace here.

### ADHD (HealthUnlocked CHADD board + Quora)

| Verbatim thread title | Forum | URL |
|---|---|---|
| ELVANSE/VYVANSE causing brainfog and zombie-like feeling | HealthUnlocked | healthunlocked.com/adult-adhd/posts/151939191 |
| Why do I experience severe brain fog and zombie focus after taking Vyvanse for 4-5 hours | HealthUnlocked | healthunlocked.com/adult-adhd/posts/145108435 |
| ADHD medication makes me sick when it wears off | HealthUnlocked | healthunlocked.com/adult-adhd/posts/146728986 |
| Are there herbal or non-prescription remedies that will address ADHD symptoms in an adult? | HealthUnlocked | healthunlocked.com/adult-adhd/posts/148196258 |
| ADHD medication alternatives? | HealthUnlocked | healthunlocked.com/adult-adhd/posts/149560103 |
| Vitamins and supplements and ADHD | HealthUnlocked | healthunlocked.com/adult-adhd/posts/151753321 |
| ADHD and memory recall — do meds help? | HealthUnlocked | healthunlocked.com/adult-adhd/posts/149713366 |
| Why does ADHD medication make me feel foggy like I'm trying to function underwater? | Quora | quora.com/Why-does-ADHD-medication-make-me-feel-foggy... |

**Net-new hooks:** **Elvanse** is the UK brand name for Vyvanse — none of the US authority pages used it, so it is an open UK-specific phrasing. The "zombie / underwater / foggy when it wears off" cluster is a vivid, high-emotion lane. All ADHD rows stay P3 (medication-adjacent, informational-only, do not product-target).

### Coverage and honest gaps for this run

- **Yielded:** Mumsnet, Patient.info, HealthUnlocked (CHADD Adult ADHD), Sherdog, one Quora thread — all with verbatim titles and live URLs.
- **Did not yield:** netmums.com (no indexed threads), rugbyforum.co.uk and The Student Room (only blog/research pages surfaced), menopausematters.co.uk forum (no individual indexed threads). Reddit and AnswerSocrates were not run this pass (browser not connected).
- **To close next pass:** connect the browser and run Reddit (r/Menopause, r/ADHD, r/Nootropics, r/rugbyunion) + AnswerSocrates for the PAA breadth layer. ~~plus the GSC step for real demand ranking~~ — GSC ran 2026-07-16 and returned zero for every lane; see the Search Console section above for why it cannot rank lanes we have not entered.

---

## What to do with these results

1. **Add the net-new hooks to the Phase 2 queue** as candidate H1s, tagged by lane and intent, P3 where medical. Prefer the raw forum phrasings over the tidier authority-page phrasings — they convert better because they match how people actually search and speak.
2. **Prioritise the two P1 lanes** (perimenopause occupational-panic angle; sport nutrition-prevents-CTE angle) — both are open, specific, and squarely on CONKA's proof.
3. **~~Rank by GSC next pass.~~ Superseded 2026-07-16.** GSC returned zero impressions for every lane, so it cannot rank them. Rank from the corpus, open-lane fit and strategic fit instead; re-run GSC as the month-on-month movement check once content ships. Continue to treat the corpus as "real and on-lane", not "highest-volume" — nothing so far has established magnitude.
4. **Resolve the Shopify blog post migration** (`/blogs/news/visualisation-mental-imagery-and-rehearsal`) with the blog build before `/blog` ships. It is the only proven non-brand content asset and it currently lives on Shopify.
5. **Route the `/science` CTR gap to Phase 9** — demand exists there today and is being wasted; cheaper than any new content.
