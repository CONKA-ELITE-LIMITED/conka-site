# Landing Page Claims Compliance Log

> **Last updated:** 2026-04-14
> **Context:** Marketing/compliance review identified non-compliant health claims on `/start` landing page. Changes required under UK/EU food supplement regulations (EFSA 1924/2006, FIC 1169/2011).
> **Scope:** Landing page (`/start`) + shared components used on landing page. This log feeds into main site updates later.
>
> **⚠️ 2026-04-13 update — ingredient dosages:** Items referencing specific mg values (Lemon Balm 300mg, Ashwagandha 600mg, Glutathione 250mg, etc.) are based on older research-dose figures and are **incorrect** against the formulation spec supplied 2026-04-13. Actual per-shot doses are: Lemon Balm 1,500mg, Ashwagandha 1,500mg, Glutathione 500mg, Vitamin C 2,500mg, Vitamin B12 1.5mg. See [FORMULATION_SPEC.md](../../../product/FORMULATION_SPEC.md) for the authoritative per-shot values. Decision pending on whether landing page shows mg at all (scientist advises no mg on herbals).

---

## Anchor Symbol Reference

| Symbol | Category | Summary |
|--------|----------|---------|
| `†` | Clinically dosed | Dosages match published studies on individual ingredients |
| `††` | EFSA claims | Vitamin C + B12 authorised health claims |
| `‡` | Reviews | Loox verified post-purchase review collection |
| `§` | Bottles sold | Cumulative sales figure as of date |
| `¶` | Research | Ingredient-level studies, not product-level |
| `^^` | Cognitive test | Cognetivity test — FDA cleared, Cambridge, 93% sensitivity |
| `*` | Guarantee | 100-day satisfaction guarantee terms |

---

## Change Log

### LandingHero.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 1 | `Clinically dosed.` | `Clinically dosed.†` | AMBER — add anchor | † | Done |
| 2 | `500+ verified reviews` | `500+ verified reviews‡` | Needs verification footnote | ‡ | Done |
| 3 | `Over 150,000 bottles sold` | `Over 150,000 bottles sold§` | Needs date footnote | § | Done |

### LandingBenefits.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 4 | `+18%` (headline stat) | Removed — icon only | RED — % health claim | — | Done |
| 5 | `+42%` (headline stat) | Removed — icon only | RED — % health claim | — | Done |
| 6 | `-56%` (headline stat) | Removed — icon only | RED — % health claim | — | Done |
| 7 | `+40%` (headline stat) | Removed — icon only | RED — % health claim | — | Done |
| 8 | Study detail (Focus) | "In one study, participants taking Lemon Balm showed improvements in calmness and alertness (Kennedy et al. 2003)¶" | Observational reframing | ¶ | Done |
| 9 | Study detail (Sleep) | "In one study, participants taking KSM-66 Ashwagandha reported improvements in sleep quality (Salve et al. 2019)¶" | Observational reframing | ¶ | Done |
| 10 | Study detail (Stress) | "In one study, participants taking KSM-66 Ashwagandha showed a reduction in perceived stress (Chandrasekhar et al. 2012)¶" | Observational reframing | ¶ | Done |
| 11 | Study detail (Thinking) | "Vitamin C contributes to normal psychological function†† — CONKA Clear provides Vitamin C alongside Glutathione (Sinha et al. 2018)¶" | EFSA claim + observational | ††, ¶ | Done |
| 12 | `Tap a benefit to see the science.` | `Tap a benefit to see the research.` | Softer framing | — | Done |

#### Phase 1: Benefit titles + ingredient subtitles redesign (2026-04-07, SCRUM-850)

Approach: Keep benefit titles (conversion value) but move ingredient names + dosages to subtitle. Benefit title is a standalone concept, not directly attributed to the ingredient -- reducing AMBER risk while keeping conversion power.

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 39 | Section heading: `Why 150,000+ bottles and counting.§` | `What's working inside every shot.` | Frames ingredient content; curiosity-led, not a claim | — | Done |
| 40 | Card subtitle: `Stay locked in for longer` | `Lemon Balm Extract · 300mg` | Ingredient + dosage replaces vague benefit subtitle | — | Done |
| 41 | Card subtitle: `Wake up ready for the day` | `Ashwagandha · 600mg` | Ingredient + dosage replaces vague benefit subtitle | — | Done |
| 42 | Card subtitle: `Pressure doesn't rattle you` | `Glutathione · 250mg` | Ingredient + dosage replaces vague benefit subtitle | — | Done |
| 43 | Card subtitle: `Better decision making, all day` | `Vitamin C + B Vitamins` | Ingredient name replaces vague benefit subtitle | — | Done |

### LandingProductSplit.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 13 | `Sharp thinking under pressure` | `Supports mental clarity††` | Anchor to EFSA Vitamin C claim | †† | Done |
| 14 | `Overnight brain recovery` | `Evening wind-down ritual` | "Brain recovery" is mechanism claim | — | Done |
| 15 | `Cellular detox + repair` | `Cellular renewal + recovery` | RED — "detox" not authorised | — | Done |

### LandingWhatsInside.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 16 | `CONKA Clear boosts cerebral blood flow and key neurotransmitters with Glutathione and Alpha GPC, so you think clearly under pressure and recover overnight.` | `CONKA Clear combines nootropics like Alpha GPC and Glutathione with Vitamin C, which contributes to normal psychological function†† and the reduction of tiredness and fatigue.††` | RED — mechanism claim → EFSA claims | †† | Done |
| 17 | `Taking both daily creates a compounding effect. CONKA Flow generates AMPK for energy, CONKA Clear provides glutathione precursors for recovery. The combination is more effective than either alone.` | `Designed to work as a daily pair. CONKA Flow provides your morning foundation with adaptogens, while CONKA Clear supports your evening with nootropics and antioxidants. A complete daily routine in two shots.` | RED — comparative efficacy + mechanism claims | — | Done |
| 18 | `clinically dosed.` | `clinically dosed.†` | AMBER — add anchor | † | Done |

### LandingGuarantee.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 19 | `See the difference, or get your money back.` | `See for yourself.` | "See the difference" implies health improvement | — | Done |
| 20 | `16%` / `Average improvement in 30 days` | `93%` / `Test sensitivity` | RED — quantified health outcome → test credibility stat | ^^ | Done |
| 21 | Full body copy (performance promise) | Measurement tool framing with test validation (FDA cleared, Cambridge) | Satisfaction-based, app as transparency tool | ^^, * | Done |
| 22 | `*Complete at least 3 tests per week for 4 weeks to qualify for the guarantee.` | `*30-day satisfaction guarantee for first-time customers. Contact support@conka.co.uk for a full refund within 30 days of your first order.` | Decouple from performance promise | * | Done |

### LandingFAQ.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 23 | `...to boost cerebral blood flow and cellular repair. Together they enhance your brain's own systems rather than overriding them.` | `...alongside Vitamin C, which contributes to normal psychological function and the protection of cells from oxidative stress.†† Together they support your daily cognitive routine rather than relying on stimulants.` | RED — mechanism claims | †† | Done |
| 24 | `Most people notice a clearer mind and calmer focus within 30 minutes...` (full speed-of-effect paragraph) | `Everyone responds differently. Some people notice they feel calmer and more focused early on, while for others it takes a few weeks...` | RED — speed-of-effect + timeframe claims | — | Done |
| 25 | `feel the difference` (FAQ 6) | `not satisfied` | Minor — implied health claim | — | Done |
| 26 | `satisfied with your results` (FAQ 8) | `not satisfied` | Minor — implied outcomes | — | Done |
| 27 | `60-day money-back guarantee` (FAQ 6) | `30-day money-back guarantee` | Align to 30 days | — | Done |
| 28 | `Try CONKA for up to 60 days` (FAQ 8) | `Try CONKA for up to 30 days` | Align to 30 days | — | Done |

### LandingProof.tsx

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 29 | `Verified performance data.` | `Measured with a clinically validated test.^^` | Conveys test credibility without health claim | ^^ | Done |
| 30 | `Real people. Real tests. All measured via the CONKA app.` | `Cognitive test scores measured using the CONKA app's FDA-cleared assessment, developed from Cambridge University research. Individual results — many factors may influence test performance.` | Test validation + caveat | — | Done |
| 31 | `average cognitive improvement` | `average change in test scores^^` | "Improvement" is a health claim | ^^ | Done |

### CaseStudiesDataDriven.tsx (shared — global change)

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 32 | `Verified Performance Data` | `Measured with a clinically validated test.` | Same reframing as LandingProof | — | Done |
| 33 | `Real People. Real tests. Real improvements.` | `Cognitive test scores measured using the CONKA app's FDA-cleared assessment, developed from Cambridge University research. Individual results — many factors may influence test performance.^^` | Test validation + caveat | ^^ | Done |
| 34 | `Average Improvement` | `Avg. Change in Test Scores^^` | "Improvement" is a health claim | ^^ | Done |
| 35 | `Cognitive improvement` (photo overlay) | `Change in test score` | Neutral label | — | Done |
| 36 | Old footnote | Strengthened: test validation details (FDA, 93% sensitivity, 87.5% reliability) + "do not constitute health claims" | Compliance + credibility | ^^ | Done |

### NEW: LandingDisclaimer.tsx

| # | Description | Status |
|---|-------------|--------|
| 37 | Created new AG1-style disclaimer footer with all anchor definitions | Done |
| 38 | Integrated into app/start/page.tsx as final section | Done |

### Phase D: LandingWhatItDoes.tsx copy refresh (2026-04-13)

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 44 | Title: `What CONKA does.` | `Daily habit. Lifelong benefits.` | Magic Mind habit framing per Johnny feedback; no claim | — | Done |
| 45 | Tile 1: `Clinically-studied ingredients for your daily focus and clarity routine. Stay locked in past 2pm instead of reaching for another coffee.` | `Stay locked in past 2pm without reaching for another coffee.` | Drop hedging; observational framing retained | — | Done |
| 46 | Tile 2: `All-day mental energy without caffeine, jitters, or crashes. Adaptogens help your body manage the demands of a full day, not just the first few hours.` | `Mental energy that lasts the full day. No caffeine, no crash.` | Drop hedging ("help", "not just"); no change to claim surface | — | Done |
| 47 | Tile 3: `Long-term investment in your brain, not just a quick fix. Vitamin C contributes to the protection of cells from oxidative stress.†† A daily routine built for the years ahead.` | `A daily routine built for the years ahead. Vitamin C contributes to the protection of cells from oxidative stress.††` | Tightened; retains EFSA Vitamin C claim + anchor | †† | Done |

### NEW: IngredientsPanel.tsx (Phase D — factual disclosure)

| # | Description | Anchor | Status |
|---|-------------|--------|--------|
| 48 | New native per-product modal launched from `LandingProductSplit` tiles | — | Done |
| 49 | Supplement facts table sourced from `docs/product/FORMULATION_SPEC.md` via `app/lib/supplementFacts.ts` — factual disclosure, no new claims | — | Done |
| 50 | %NRV column shown on Clear only (Vit C 3,125%, Vit B12 60,000%); hidden on Flow (no authorised nutrients) | †† | Done |
| 51 | Functional-group headings use observational phrasing; EFSA claims (psychological function, reduction of tiredness & fatigue) anchored to Vit C + B12 on Clear panel | †† | Done |
| 52 | **Explicit mg amounts removed** from both the data module and the panel. Ingredient order preserved — descending concentration is the standard supplement-facts convention, so relative quantity is still communicated. Competitive IP protection. Only %NRV retained on Clear's Vit C and B12 (required to substantiate EFSA claims). Also extended Ingredients modal trigger to `LandingWhatsInside` ProductMini tiles for parity with `LandingProductSplit`. | †† | Done |

### CaseStudiesDataDriven.tsx — metric label revision (2026-04-13)

| # | Old Text | New Text | Reason | Anchor | Status |
|---|----------|----------|--------|--------|--------|
| 53 | Tile label: `Change in test score` (for Total Score metric) | `Cognitive function` (Total Score), `Cognitive speed` (Speed), `Cognitive accuracy` (Accuracy) | Labels describe what the Cognetivity CognICA test measures, not a product-driven claim. Total Score as a proxy for cognitive function is peer-reviewed (Modarres et al., Front Aging Neurosci 2023, doi:10.3389/fnagi.2023.1243316) and the test is FDA-cleared as a cognitive assessment (21 CFR 882.1470). Percentage reads as change in that measurement. `^^` test-validation anchor and global disclaimer footer remain | ^^ | Done |
| 54 | LandingWhatItDoes tile descriptions (entries 45-47) | Reverted to pre-Phase D longer copy on user call. Title "Daily habit. Lifelong benefits." kept. Vit C †† anchor retained on Brain Health tile. | Preference for fuller copy on this section | †† | Done |

### Phase E: LandingWhatItDoes merge + 100-day guarantee (2026-04-14, SCRUM-877)

`LandingWhatsInside.tsx` and `IngredientAccordion.tsx` deleted. Merged into `LandingWhatItDoes.tsx` so each pillar tile carries its own ingredient evidence. `LandingGuarantee.tsx` resurrected as dedicated 100-day section between Timeline and FAQ. Magic Mind copy adapted to CONKA voice.

| # | Description | Anchor | Status |
|---|-------------|--------|--------|
| 55 | Merged tiles preserve all 3 study observations from old `IngredientAccordion`: Lemon Balm (Kennedy 2003, PMID 12888775), Ashwagandha (Chandrasekhar 2012, PMID 23439798), Vitamin C / Glutathione (Sinha 2018, PMID 29559699). Each ported verbatim with `¶` research anchor. | ¶ | Done |
| 56 | `††` EFSA anchor preserved on (a) Brain Health tile body Vitamin C reference, (b) Vitamin C ingredient pill, (c) Vitamin B12 ingredient pill, (d) Vitamin C study observation (Sinha 2018). No regression vs old `LandingWhatsInside`. | †† | Done |
| 57 | Tap-to-reveal default-collapsed. Per-tile "See the research" trigger button. Reveal panel shows observational study quote + PMID identifier. No quantified health claims surfaced. | ¶ | Done |
| 58 | `LandingGuarantee.tsx` title: `{GUARANTEE_DAYS}-Day Risk Free Trial` (templated from `app/lib/offerConstants.ts`, currently renders "100-Day Risk Free Trial"). No quantified health claim. | — | Done |
| 59 | `LandingGuarantee.tsx` body: "Try CONKA for 100 days. If your mental performance doesn't noticeably improve, we'll refund your purchase completely. No return necessary." Phrasing is **subjective satisfaction language** — "noticeably improve" is the customer's own perception, not a quantified or substantiated outcome. Offered as a refund condition, not a product claim. `*` anchor retained on the sentence. | * | Done |
| 60 | Bullet list (4): "Free UK shipping", "Money back guarantee", "No return required", "Nothing to lose (other than brain fog and burnout)". Logistical / commercial facts only. No health claim. | — | Done |
| 61 | CTA: "Try it 100% Risk Free Now". Offer language ("risk free") is a refund-policy descriptor, not a safety or efficacy claim. | — | Done |
| 62 | Footnote: "*First-time customers only. Contact info@conka.io within 100 days of your first order for a full refund." Templated from `GUARANTEE_DAYS`. Refund mechanic only. | * | Done |
| 63 | App phone mockup retained on right column (no copy attached). The cognitive-score visual stands as implicit proof the guarantee is credible without an explicit `^^` claim in this section. | — | Done |
| 64 | Old `LandingGuarantee` entries 19–22 (30-day guarantee era) superseded by entries 58–63. The 30-day → 100-day shift was made earlier in `offerConstants.ts`; this is the first time the section ships to `/start`. | * | Done |

---

## Compliance Checklist

- [x] All RED items removed or replaced
- [x] All AMBER items resolved (card titles replaced with ingredient names in Phase 1, SCRUM-850)
- [x] All GREEN additions in place
- [x] Disclaimer footer live on `/start`
- [x] CaseStudiesDataDriven global changes applied
- [x] Guarantee aligned to `GUARANTEE_DAYS` (100 days) from `offerConstants.ts` throughout
- [ ] Legal/compliance sign-off (pending review)

---

## Main Site TODO (for later)

The following pages use similar claims that will need the same treatment:
- Homepage (`/`) — testimonials, case studies section
- App page (`/app`) — case studies section (already fixed via shared component)
- Formula pages (`/conka-flow`, `/conka-clarity`) — ingredient claims, benefit descriptions
- Science page (`/science`) — study citations
- Main site footer — needs standard food supplement disclaimer added
