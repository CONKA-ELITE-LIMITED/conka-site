# Listicle Copy-Framing Review (vs Magic Mind + IM8)

**Date:** 2026-07-22
**Status:** Analysis only. No copy changed. This documents discrepancies against two reference landing pages and what we might do about them.
**Scope:** the three persona listicles (`productivity-listicle.ts`, `adhd-listicle.ts`, `brain-ageing-listicle.ts`) and the shared renderer.

## Reference pages reviewed

**Magic Mind** (direct competitor, nootropic shot) - `/pages/mental-performance-shot-lp...`
- Hero: "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026". Numbered listicle promise, confident market-leader tone.
- Product-led. Each of 10 points pairs a pain with a benefit. Second-person "you" ("Your bank account will thank you").
- Proof is thin: scale ("10,000,000+ bottles shipped"), founder/celebrity names, an award, money-back. No citations, no star rating on the page.
- Offer: "58% off", "LIMITED TIME", repeated product-selector CTAs ("choose this variant if...").

**IM8 GLP-1** (the stronger template, already referenced in CLAUDE.md) - `/pages/glp1`
- Hero: "7 Reasons Not to Do Your GLP-1 Without IM8". Loss-framed listicle promise. Subhead opens with the problem and a "nobody warns you" gap: "The medication does its job. What nobody warns you about is what eating half as much does to your hair, your energy, your muscle."
- Every section opens with a specific, visceral, second-person pain moment ("Three months in, you catch your reflection and something's off. The hair is collecting in the shower drain."), then pivots to the solution.
- Proof is layered: star rating + review count + "Backed by over 300 clinicians" in the hero; outcome stats ("95% felt more energy, 85% better digestion, 80% improved sleep"); named expert quotes (Dr Amy Shah, Dr Dawn Mussallem); a certification finale (NSF Certified for Sport, "280+ substances screened").
- A concrete cost-comparison table ("Replace 16 supplements", "$315/mo vs IM8 $78/mo, saves $2,844+/year").
- Escalating CTAs, subscription tier labels ("BEST VALUE" / "MOST POPULAR"), countdown timer, guarantee repeated, future-gift retention calendar.

## Where we are already strong (do not over-correct)

- **Citations.** We carry real PMIDs/DOIs under claims and ingredient tiles. Magic Mind has zero citations; IM8 cites lightly. Keep this; it is a genuine trust edge.
- **Interactivity.** Our ADHD symptom explainer and Brain Ageing men/women toggle are more engaging than either competitor's static listicle. The symptom explainer in particular already follows IM8's best move (symptom to mechanism to ingredient).
- **Real trial data + university research** (rugby RCT, Durham ageing study) beats Magic Mind's unbacked claims.
- **Guarantee** is present across all three (100-day).

## Discrepancies and what we might do

Priority key: P1 = high conversion lever and low lift (plumbing often already exists), P2 = worthwhile, P3 = test/nice-to-have.

### P1. The comparison and cost tables are built but unused
- `ListicleConfig` already has `comparison` and `costBreakdown` fields, and the renderer already renders them. All three listicles leave them empty, so we ship none of the concrete "vs" or ROI math both references lean on hard.
- IM8's cost table is one of its strongest levers; Magic Mind runs an ROI angle ("your bank account will thank you").
- We already own the argument: our own FAQ says CONKA "works out cheaper per day than the coffee it tends to replace". That is a ready-made cost-comparison story we are not showing.
- **Do:** populate `costBreakdown` (CONKA per-day vs daily coffee/energy-drink spend, annual saving) and/or `comparison` (CONKA vs caffeine: crash, ceiling, dependency, measurability). Productivity is the obvious first page for the coffee-cost table.

### P1. Hero subhead is a product summary, not a problem hook
- Our subheads describe the product ("Two caffeine-free daily shots: Flow to start the day sharp, Clear to replace the afternoon coffee..."). IM8's subhead opens with the problem and a "nobody warns you" gap before the product.
- Our hero headlines did move to strong question-led hooks (e.g. "Is Forgetting Words Mid-Sentence a Sign of Dementia?"), which is good, but the subhead then drops the tension instead of deepening it.
- **Do:** rewrite each subhead to lead with the reader's specific pain / the gap nobody told them, then the product. Keep it one to two lines.

### P1. No authority / clinician signal in the hero
- IM8 hero: "Backed by over 300 clinicians from FrontrowMD" next to the star rating. Ours shows rating + review count + daily users, but no third-party authority line.
- We have the raw material (universities, Informed Sport, the CognICA/Cambridge test, Dr Tina Peers appears inside a Brain Ageing testimonial) but surface none of it as a hero authority cue.
- **Do:** add an authority line or laurel to the hero (e.g. university-developed test, clinician association, or a "developed with" credential). Note claims/verifiability is the user's pass.

### P2. Section openings are not consistently pain-first
- IM8's discipline: every section opens on a visceral, specific, second-person pain, then the fix. Ours is mixed.
- Examples that already do it well: Productivity 02 ("The lunch slump sends you back for another coffee"), 05 ("Interrupted sleep, all-nighters before a deadline, that's life").
- Examples that open solution/benefit-first and could be re-pointed: Productivity 03 ("This isn't a temporary spike, it's a daily system that compounds") and Brain Ageing 03 (same opener) lead with the mechanism, not the fear of decline.
- **Do:** audit each `reason.body` so the first sentence is the reader's pain, specific and in second person, before the solution.

### P2. Proof is present but not escalated into dedicated moments
- IM8 turns proof into sections: outcome stats, named expert quotes, a certification finale. Ours has stat bands and citations but:
  - **Outcome-phrased user stats.** IM8 uses "95% felt more energy". Our stat bands mix vs-placebo and %-improvement numbers, which read more clinical than felt-benefit. Consider adding a felt-outcome stat framing where we have the data.
  - **Named expert endorsement.** We have no named clinician/expert quote (only universities and an indirect Dr Tina Peers mention). Consider a named-expert proof block.
  - **Certification as a moment.** Informed Sport is only a trust pill and ticker item. IM8 makes NSF a whole "gold standard in purity" section. Consider elevating Informed Sport into a short proof section.

### P2. Offer and CTA strategy is softer than both references
- Both competitors: discount framing ("58% off", "Save 30%"), tier labels ("BEST VALUE" / "MOST POPULAR"), urgency (countdown), repeated CTAs between sections, guarantee repeated.
- Ours: a single hero CTA string, one bridge CTA, one sticky bar. No price anchor or saving shown in-copy, no tier labeling in the copy layer, no urgency, no mid-page CTA repetition.
- **Do (product decision, not just copy):** decide how aggressive to go. Cheapest wins: add a saving/price anchor to the CTA area and repeat a CTA mid-listicle. Bigger: tier labels and a time-bound offer. Note we deliberately avoid single-product emphasis (memory: two equal Flow/Clear cards), so tiering should be by cadence, not by product.

### P3. "N reasons" scannability promise was dropped from the heroes
- Both references keep a numbered "N reasons" promise in the H1 (comprehensive, comparison-ready). We moved to question-led H1s. Question-led is a valid and arguably fresher hook, but we lost the "here is a list" contract, while the pages are still literally numbered listicles.
- **Do:** treat this as an A/B question, not a fix. Test a numbered-promise H1 (or loss-framed "Reasons not to...") against the current question-led H1 per persona.

### P3. Tone could be more second-person and confident
- Magic Mind "treats the product as market leader, not challenger" and is relentlessly "you"-framed. Our copy is confident-clinical (correct for our brand) but sometimes describes rather than addresses the reader.
- **Do:** on the next copy pass, push second-person address and remove hedged/descriptive phrasing where it dilutes confidence, without losing the clinical credibility that is our differentiator.

## Suggested sequencing (if pursued)

1. Populate `costBreakdown` + `comparison` on Productivity first (P1, plumbing exists, no new components).
2. Rewrite the three hero subheads to problem-first + add a hero authority line (P1).
3. Pain-first audit of every `reason.body` (P2).
4. Decide offer/CTA aggressiveness with the user; add a saving anchor + mid-page CTA (P2).
5. Optional proof-moment additions (expert quote, Informed Sport section) and the H1 A/B (P2/P3).

## References
- Configs: `app/lib/landings/{productivity,adhd,brain-ageing}-listicle.ts`
- Renderer + unused `comparison`/`costBreakdown` zones: `app/components/go/listicle/ListicleRenderer.tsx`, `app/lib/landings/listicle-types.ts`
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Template upgrade plan: `docs/development/featurePlans/listicle-template-upgrade.md`
