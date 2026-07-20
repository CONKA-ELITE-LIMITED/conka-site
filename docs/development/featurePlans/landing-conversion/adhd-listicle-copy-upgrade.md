# ADHD Listicle: Keyword-Led Copy Upgrade

**Status:** Scoped, not built. Copy drafted below is strongly recommended, review before implementation.
**Scale:** B (Standard). Copy-only, no component or layout changes.
**Tracking:** This doc + [SCRUM-1170](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1170) (Sprint 29, Website & CRO, To Do).
**Owner file:** `app/lib/landings/adhd-listicle.ts` (config, copy-only) + `app/lib/faqContent.ts` (FAQ selection / one new canonical item).

---

## Why this matters

`adhd-listicle.ts` is a noindex paid-Meta landing page (the first persona in the landing-conversion programme). Its current copy was drafted from intuition around supplied reason bullets (2026-06-12), never validated against how ADHD buyers actually talk or search. We ran keyword research (AnswerSocrates + volume enrichment) to close that gap. This upgrade re-points the hero and reasons at the language and angle the data says converts, so more of the paid click-through turns into checkout.

**Lens:** pure CRO / acquisition. This page cannot rank (noindex), so the research is used for *message-market fit*, not SEO.

---

## Part 1: The AnswerSocrates research method (reusable)

This is the repeatable process for every future persona (women/hormonal, professionals, students, etc.). Documented so the next one is a copy-paste of the workflow, not a reinvention.

1. **Account:** AnswerSocrates, free tier = **3 searches/day**. One "search" = one seed keyword.
2. **Seed choice.** Pick seeds that each unlock a *different layer* of the page: one commercial/objection seed, one problem-language seed, one differentiator seed. Do not spend a seed on a bare category term (`adhd`) — the autocomplete tree is mostly diagnosis noise.
3. **Export.** AnswerSocrates returns Google autocomplete + People-Also-Ask questions grouped by grammar (what/why/how/can/does) as a CSV. Grammar grouping is useless for copy.
4. **Enrich with volume.** The raw CSV has no search volume. Run it through a volume tool (as done here → `output.xlsx`, adds Volume / CPC / Competition per keyword). **Volume is the deciding signal; variant-count is a trap** (see corrections below).
5. **Re-cluster by intent, not lexeme.** Volume tools cluster by shared words, which buries intent. Re-aggregate by buyer intent (natural, safety, best/which, does-it-work, with-meds, etc.).
6. **Read as message-fit, not ranking.** For a noindex LP, high volume = the framing your Meta audience resonates with; high CPC = angles competitors already pay to convert on.

**Seeds run so far:** `adhd supplements` (2026-07-20, `AnswerSocrates-GB-en-adhd-supplements-2026-07-20.csv` → `output.xlsx`).
**Recommended next seeds:** `adhd naturally` (deepens the dominant natural cluster) and `adhd motivation` (task-initiation language for Reason 1). Not `adhd without medication` — see correction 1.

---

## Part 2: Findings (GB, volume-weighted)

738 keywords, ~75k total monthly volume. Re-aggregated by buyer intent:

| Intent | Volume | Read |
|---|---|---|
| **Natural / non-stimulant** | **10,380** | 🟢 Dominant framing. `adhd supplements natural` 3,600, `natural adhd supplements for adults` 2,400 |
| **Safety / side effects** | 8,480 | 🟢 But it's *stimulant-meds anxiety* — `adhd pills side effects` 8,100. The wedge, not product demand |
| **Best / which / top** | 6,390 | 🟢 Commercial shortlisting |
| **Focus / concentration** | 900 | 🟡 Present, smaller than assumed |
| **Do they work / evidence** | 120 | 🔴 An objection to answer, NOT a demand signal |
| **Without / instead of meds** | 10 | 🔴 Dead phrasing (intent lives under "natural") |
| **Women / hormonal** | 520 | 🔵 Future persona (menopause/perimenopause/PMDD/estrogen) |

**High-CPC (where money converts):** `supplements to take with adhd medication` £8.97 · `over the counter adhd supplements` £7.71 · `adhd supplements for adults` £3.61. Advertisers pay most for the natural / OTC / adult cluster.

**Google People-Also-Ask (answer these verbatim):** "What supplements work best for ADHD?" · "How to naturally help ADHD?" (480) · "How to fix ADHD without meds?" · "What is the 24 hour rule for ADHD?" (niche, skip).

### Two corrections to our pre-data assumptions
1. **"Without medication" was wrong as an angle *word*.** It ranked huge on variant-count but ~10 on real volume. The intent is real and large; buyers just phrase it **"natural,"** not "without meds." Lead with "natural / non-stimulant."
2. **Skepticism is an objection, not a hook.** "Does it work / evidence" is only 120 volume. Keep the proof (stats band) as an *objection-handler*, do not build the hero around it.

### The positioning the data points to
> **A natural, non-stimulant way to focus** — for people frustrated or nervous about ADHD **stimulant side effects**, who are already shopping "best" natural options.

---

## Part 3: Recommended copy

All drafts respect: no em dashes, two-equal-products rule (never spotlight Flow over Clear), and the existing claim posture (supports focus; not a medicine; does not treat ADHD).

### Hero

**Headline (recommended):**
> 6 Reasons People With ADHD Are Switching to a Natural, Caffeine-Free Way to Finally Get Started, Focused and Calm

**Headline (tighter alt):**
> 6 Reasons ADHD Brains Are Choosing a Natural, Non-Stimulant Shot Over Another Coffee

**Subcopy (recommended):**
> Two caffeine-free daily shots, no stimulants and nothing habit-forming. Flow for the won't-start mornings, Clear for the afternoon dip, with an app that scores your focus so you can watch it work. Steady focus and calm without the jitters, crash or comedown.

**Laurel:** keep as-is (World's Largest consumer brain-research project, 1,000+ ADHD brains).

**Trust pills:** swap the middle pill so the non-stimulant promise sits in the trust row.
Current: `Zero caffeine` · `Informed Sport Certified` · `100-day guarantee`
Recommended: `Zero caffeine` · **`Non-stimulant`** · `100-day guarantee`
(Keep the Informed Sport pill if the row can hold four; on mobile keep three.)

**Ticker:** add one non-stimulant token. Recommended set:
`ZERO CAFFEINE` · **`NON-STIMULANT`** · `INFORMED SPORT CERTIFIED` · `MADE IN THE UK` · `100-DAY GUARANTEE` · `2-MINUTE BRAIN TEST`

### Reason 1 — task initiation (rewrite: adopt "ADHD paralysis")

`adhd paralysis` and `executive dysfunction` are the words buyers use for this exact pain.

**Headline (keep):** Finally Start the Thing You've Been Avoiding
**Body (recommended):**
> That stuck, can't-begin feeling has a name: ADHD paralysis. It isn't laziness, it's an ADHD brain running low on the focus chemical that gets you moving, so the task slides and the morning disappears. Flow, your caffeine-free morning shot, supports that exact spark with no stimulant, and most people feel it within minutes: the task that felt like a locked door opens.

### Reason 4 — the 2PM crash (light tweak: add the stimulant-side-effect wedge)

**Headline (keep):** Kill the 2PM Crash (Without More Coffee)
**Body (recommended):**
> The 2pm slump, jitters and fog are baked into caffeine, and an ADHD brain feels the swing harder. Conka has zero caffeine and no stimulant, so there is nothing to spike from, nothing to crash off, and none of the side effects that come with the stimulant route: steady focus all day, and Clear in the evening winds you down instead of leaving you wired.

### Reasons 2, 3, 5, 6 — keep

Reason 2 (restlessness) already carries "focus and calm at once with no caffeine" — on-message, leave. Reasons 3 (word recall), 5 (mental noise) and 6 (consistency/app) are symptom-led and still strong. No change. Natural/non-stimulant is carried in the hero, pills, ticker and FAQ rather than forced into every reason.

---

## Part 4: FAQ upgrade

The persona `faqIds` resolve against the single source in `app/lib/faqContent.ts`. Current list:
`caffeine`, `adhd-medication`, `adhd-replacement`, `results`, `how-to-take`, `guarantee`.

**Problem:** it does not answer the two biggest searched intents — "is it natural / non-stimulant" and "side effects vs ADHD meds" — and omits the does-it-actually-work objection.

**Recommended `faqIds` (reordered to lead with the arrival intent):**
```ts
faqIds: [
  "natural-non-stimulant",  // NEW — the dominant "natural" cluster + PAA "how to naturally help ADHD"
  "adhd-replacement",       // is this instead of meds
  "adhd-medication",        // can I take it alongside meds (high-CPC intent)
  "side-effects",           // stimulant-anxiety wedge — no jitters/spikes/crashes
  "do-nootropics-work",     // the does-it-actually-work objection
  "results",                // how fast
  "how-to-take",
  "guarantee",
]
```

**New canonical FAQ item to add to `FAQ_ITEMS`** (category `about`; keeps the careful posture of the existing entries):
```ts
{
  id: "natural-non-stimulant",
  question: "Is CONKA a natural, non-stimulant way to focus?",
  answer:
    "Yes. Both CONKA formulas are built on naturally derived adaptogens and nootropics, contain no caffeine and no stimulants, and nothing habit-forming. There is nothing to spike from and nothing to crash off, which is why it supports steady focus and calm across the day rather than a short hit followed by a slump. It is a food supplement that supports everyday focus, not a medicine and not a treatment for ADHD.",
  category: "about",
},
```

> Note: `natural-non-stimulant` is a general-audience answer worth having in the shared source, so it can also serve the home/PDP surfaces later. If we would rather keep the "natural" wording landing-only, define it inline on the listicle config instead of in `faqContent.ts` (the `FaqEntry` shape supports a config-supplied entry). Recommendation: add it to `faqContent.ts` so schema and copy stay single-sourced.

---

## Implementation notes

- **Files:** `app/lib/landings/adhd-listicle.ts` (hero, ticker, trust pills, Reason 1 + 4 bodies, `faqIds`). `app/lib/faqContent.ts` (one new `FAQ_ITEMS` entry). No component, route, or CSS changes.
- **Mobile:** trust row stays three pills on mobile (drop Informed Sport pill below `sm`, keep Zero caffeine / Non-stimulant / Guarantee). Headline is longer, confirm it does not wrap past three lines on a 360px viewport, tighten to the alt headline if it does.
- **Analytics:** none new. This page already fires the landing/AddToCart events through `CartContext`; copy changes do not touch the funnel. No tracking work in scope.
- **Build safety:** `faqContent.ts` throws at module load on an unknown id, so a typo in the new `faqIds` fails the build rather than silently dropping a question. Add the `natural-non-stimulant` item before referencing it.
- **Section-by-section review:** implement and visually review one block at a time (hero, then Reason 1, then Reason 4, then FAQ), user-directed, per the established page-upgrade workflow. Do not batch-ship all copy at once.

## Out of scope
- Any structural, layout, component or image/asset change.
- The other reasons (2, 3, 5, 6) and the stats band, review strip, product block, sticky bar.
- The other two persona seeds' research (`adhd naturally`, `adhd motivation`) — run next, may add a Reason-1 refinement.
- SEO/indexing work (page is noindex by design).

## Future work (not ticketed)
- **Women / hormonal persona** (520 vol: menopause, perimenopause, PMDD, estrogen) — a candidate next listicle, same method.
- Re-run this copy against the two remaining ADHD seeds once searched.

## Verification
- `npm run build` passes (proves the new `faqIds` all resolve).
- Hero renders the new headline/subcopy; trust row shows the Non-stimulant pill; ticker includes NON-STIMULANT.
- The listicle FAQ accordion renders the 8 questions in the new order, `natural-non-stimulant` first.
- Visual pass on 360px mobile: headline within three lines, trust pills not overflowing.
