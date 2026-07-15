# AEO Free-Tool Runbook — mining raw demand without paying

**Status:** Active runbook. First forum pass run 2026-07-15 (results included below).
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

### Step 1 — Google Search Console first (5 min, highest-value)

1. Open Search Console → the conka.io property → **Performance** → **Search results**.
2. Set the date range to the last 3 months. Add a **Query** filter containing the lane's core word (e.g. `menopause`, `concussion`, `brain fog`, `focus`).
3. Sort by Impressions. Copy any query that already shows impressions into the queue — these are real people already finding us for that theme, so they rank first.
4. Note the average position. Queries where we impress but sit at position 8+ are the fastest wins (demand exists, we just aren't answering it well yet).
5. Cross-reference against the baseline in `docs/analytics/seo-search-console-baseline.md` so month-on-month movement is visible.

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
- **To close next pass:** connect the browser and run Reddit (r/Menopause, r/ADHD, r/Nootropics, r/rugbyunion) + AnswerSocrates for the PAA breadth layer, plus the GSC step for real demand ranking.

---

## What to do with these results

1. **Add the net-new hooks to the Phase 2 queue** as candidate H1s, tagged by lane and intent, P3 where medical. Prefer the raw forum phrasings over the tidier authority-page phrasings — they convert better because they match how people actually search and speak.
2. **Prioritise the two P1 lanes** (perimenopause occupational-panic angle; sport nutrition-prevents-CTE angle) — both are open, specific, and squarely on CONKA's proof.
3. **Rank by GSC next pass.** Until the GSC step runs, treat these as "real and on-lane", not "highest-volume".
