# Listicle Copy-Framing Review (vs Magic Mind + IM8)

**Date:** 2026-07-22, refreshed 2026-07-23.
**Status:** Analysis only. No copy changed. This documents discrepancies against three reference landing pages and what we might do about them.
**Scope:** the three persona listicles (`productivity-listicle.ts`, `adhd-listicle.ts`, `brain-ageing-listicle.ts`) and the shared renderer.

**2026-07-23 context:** Humphrey rewrote the three personas' copy using Answer Socrates search / pain-point research. It surfaced genuinely better pain language, but introduced two regressions the rest of this doc now leads with: the pages read **verbose** and no longer read as a **listicle** (an "X reasons why" scannable list). This refresh adds a second IM8 reference (the shorter, tighter variant of the same product) as the model for the fix.

## Reference pages reviewed

**Magic Mind** (direct competitor, nootropic shot) - `/pages/mental-performance-shot-lp...`
- Hero: "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026". Numbered listicle promise, confident market-leader tone.
- Product-led. Each of 10 points pairs a pain with a benefit. Second-person "you" ("Your bank account will thank you").
- Proof is thin: scale ("10,000,000+ bottles shipped"), founder/celebrity names, an award, money-back. No citations, no star rating on the page.
- Offer: "58% off", "LIMITED TIME", repeated product-selector CTAs ("choose this variant if...").

**IM8 GLP-1 (variant A, long)** - `/pages/glp1`
- Hero: "7 Reasons Not to Do Your GLP-1 Without IM8". Loss-framed numbered listicle promise. Subhead opens with the problem and a "nobody warns you" gap: "The medication does its job. What nobody warns you about is what eating half as much does to your hair, your energy, your muscle."
- Seven numbered sections (01-07), 80-150 words each. Every section opens on a specific, visceral, second-person pain moment ("Three months in, you catch your reflection and something's off. The hair is collecting in the shower drain."), then pivots to the solution.
- **Every section title is a benefit or pain STATEMENT, never a question:** "Half the food means half the nutrients", "Maintain Energy & Mental Clarity Without Added Calories", "Replace 16 Separate Supplements for a Fraction of the Cost", "NSF Certified for Sport - The Gold Standard in Purity".
- Proof is layered: 4.8 stars / 22,104 reviews / "300+ clinicians from FrontrowMD" in the hero; outcome stats ("95% report more energy, 85% better gut health, 80% slept better"); named expert quotes (Dr Dawn Mussallem); certification finale (NSF Certified for Sport, "280+ substances screened").
- Concrete cost table: 7 supplement categories totalling $315/mo vs IM8 $78/mo, "$2,844+ annual saving".
- CTA "Save 30% + Get Free Welcome Gifts", tier labels "BEST VALUE" / "MOST POPULAR", 90-day guarantee.

**IM8 GLP-1 (variant B, tight)** - `/pages/protect-your-health-in-90-days-while-losing-weight` **(new reference, and the model for our fix)**
- Hero: "Your GLP-1 Works Better _with the Right Support_" (this variant drops the numbered promise, but the body is far more disciplined as a list).
- **Eight numbered reasons, each 50-80 words, one clean idea + a customer testimonial.** This is the tightness our pages have lost.
- **Every title is a short benefit STATEMENT:** "Protect Your Hard-Earned Muscle Mass", "Combat Fatigue with Cellular Energy", "Rehydrate and Replenish with Electrolytes", "Comprehensive Immune Support", "Trusted by Experts, Verified by Science". Zero questions.
- Each body opens on the pain in one clause, then the fix in one: "Rapid weight loss leads to muscle wasting. IM8's 1,165mg Essential Amino & Renew Complex preserves lean muscle." One mechanism, one dose, done.
- Same proof stack (4.9 / 11,000+ reviews / 95% recommend, 11 named advisors, NSF), same tiered pricing and 30% offer.

**The takeaway from variant B:** a listicle reason is a *statement titled, single-idea, ~60-word* unit. Our reasons are *question titled, multi-mechanism, 100-150 word* units. That is the whole gap.

## Where we are already strong (do not over-correct)

- **Citations.** We carry real PMIDs/DOIs under claims and ingredient tiles. Magic Mind has zero citations; IM8 cites lightly. Keep this; it is a genuine trust edge.
- **Interactivity.** Our ADHD symptom explainer and Brain Ageing men/women toggle are more engaging than either competitor's static listicle. Keep the *mechanism*; the problem is the *word count* inside them (see below), not that they exist.
- **Real trial data + university research** (rugby RCT, Durham ageing study) beats Magic Mind's unbacked claims.
- **Guarantee** is present across all three (100-day).
- **Pain language itself improved** in Humphrey's rewrite (e.g. ADHD "one more scroll turning into forty minutes, then a morning that starts already behind"). The raw material is good; it needs cutting and re-titling, not rewriting from scratch.

## Discrepancies and what we might do

Priority key: P1 = high conversion lever and low lift (plumbing often already exists), P2 = worthwhile, P3 = test/nice-to-have.

### P1 (NEW, the live concern). Reason headlines are search questions, not listicle titles
- The Answer Socrates rewrite turned reason headlines into the search queries themselves. FAQ/blog-shaped questions where a listicle wants a statement:
  - Productivity: "What Are the Long-Term Effects of Better Focus?", "Do Brain-Training Apps Actually Work?", "Which Brain Supplements Are Actually Proven to Work?"
  - ADHD: "Do Brain-Training Apps Actually Work?", "Which ADHD Brain Supplements Are Actually Proven to Work?"
  - Brain Ageing: "How to Protect Your Brain As You Age", "Do Brain-Training Apps Actually Work?", "What Causes the Afternoon Energy Slump?", "Which Brain Supplements Are Actually Proven to Work?"
- Both IM8 variants use only statements. A question headline asks the reader to do work and reads like an article; a statement headline *is* a reason and reads like a list.
- We already have proof this works in-file: the statement-titled reasons are the strongest scan on each page - "Stay Sharp Through the Afternoon", "Built for the Days You Didn't Sleep", "Struggling With Small Decisions", "Seamless Speech, Without the Hesitation".
- **The tension to resolve:** the questions exist for AEO / search intent, and we should not just bin that research. Fix = promote the pain/benefit **statement to the headline** (listicle voice) and **keep the search question** as the section eyebrow/tag or as the body's first line, so we keep the AEO hook without the FAQ read. The renderer already has a `tag` eyebrow per reason - the question can live there.
- **Do:** re-title every question-headed reason as a statement. Convert the four "Which/Do/What/How" reasons per the pattern above.

### P1 (NEW). Sections are verbose; trim to one idea + ~60 words
- Variant B holds every reason to 50-80 words and one mechanism. Ours routinely run 100-150 and stack two or three mechanisms plus citations into a single reason:
  - Productivity reason 03 (~90w) and reason 06 (~130w) each argue multiple points; reason 05 packs Rhodiola + Glutathione + a full ingredient grid.
  - ADHD `symptomExplainer` intro is ~150 words *before* the 10 sub-symptom cards each carry their own brain-mechanism paragraph + ingredient list. It is an encyclopedia entry, not a listicle opener.
  - Brain Ageing `segmentToggle` men's body (~90w) runs an aside about heavy compound lifts that dilutes the point.
- **Do:** cut each `reason.body` to a pain clause + a fix clause + at most one proof point. Push the second mechanism and the extra citation into the ingredient grid / asset, which already exists to carry that detail. Keep the interactive blocks but tighten their intros hard (the ADHD intro can lose half its length without losing meaning).

### P1 (NEW). The numbered spine is broken, so it doesn't read as a list
- IM8 numbers its reasons 01-08 in an unbroken run. Ours interleaves numbered reasons with unnumbered `statsBand`, `reviewStrip`, `segmentToggle` and `symptomExplainer` blocks, and the big interactive blocks are not numbered as reasons at all. The reader never gets a clean 1 -> 2 -> 3 scan, and no hero promises a count.
- ADHD is the worst: the huge `symptomExplainer` is reason 1, then the next visible number is 2 after a stats band, so the page's spine reads 1 ... (wall of text) ... 2, 3, 4, 5.
- **Do:** decide a single visible numbering that runs across all reason-type blocks (including `symptomExplainer` and `segmentToggle`), keep the interstitial stats/reviews unnumbered, and consider restoring an "N reasons" count to the hero so the list has a contract. This is a renderer + config decision, not just copy.

### P1. The comparison and cost tables are built but unused
- `ListicleConfig` already has `comparison` and `costBreakdown` fields, and the renderer already renders them. All three listicles leave them empty, so we ship none of the concrete "vs" or ROI math all references lean on hard.
- IM8's cost table is one of its strongest levers; Magic Mind runs an ROI angle ("your bank account will thank you").
- We already own the argument: our own FAQ says CONKA "works out cheaper per day than the coffee it tends to replace". That is a ready-made cost-comparison story we are not showing. (Note: Productivity reason 1's `crashChart` asset is commented as carrying a cost table - confirm whether that already covers this before duplicating.)
- **Do:** populate `costBreakdown` (CONKA per-day vs daily coffee/energy-drink spend, annual saving) and/or `comparison` (CONKA vs caffeine: crash, ceiling, dependency, measurability). Productivity is the obvious first page for the coffee-cost table.

### P1. Hero subhead is a product summary, not a problem hook
- Productivity and ADHD subheads describe the product ("Two caffeine-free daily shots: Flow to start the day sharp, Clear to replace the afternoon coffee..."). IM8's subhead opens with the problem and a "nobody warns you" gap before the product.
- Brain Ageing already does this better ("Not always what you fear, often just fatigue and mental overload...") - use it as the in-house template.
- **Do:** rewrite the Productivity and ADHD subheads to lead with the reader's specific pain / the gap nobody told them, then the product. Keep it one to two lines.

### P2. No authority / clinician signal in the hero
- IM8 hero: "Backed by over 300 clinicians from FrontrowMD" next to the star rating, plus a named advisor row. Ours shows rating + review count + daily users and a "World's Largest consumer brain-research project" laurel, but no third-party clinician/university authority line.
- We have the raw material (universities, Informed Sport, the CognICA/Cambridge test, Dr Tina Peers appears inside a Brain Ageing testimonial) but surface none of it as a hero authority cue.
- **Do:** add an authority line or laurel to the hero (e.g. Cambridge-developed test, clinician association, or a "developed with" credential). Claims/verifiability is the user's pass.

### P2. Section openings are not consistently pain-first
- Both IM8 variants open every section on a specific, second-person pain, then the fix. Ours is mixed even after the rewrite.
- Already good: Productivity 02 ("The lunch slump sends you back for another coffee"), ADHD 04 ("Racing thoughts at midnight, one more scroll turning into forty minutes"), Brain Ageing 01 ("That moment your words vanish mid-sentence is unsettling").
- Still benefit/mechanism-first: Productivity 03 and Brain Ageing 03 both open "This isn't a temporary spike..." (mechanism, not the fear of decline).
- **Do:** as part of the P1 trim, make the first sentence of every `reason.body` the reader's pain, specific and in second person.

### P2. Proof is present but not escalated into dedicated moments
- IM8 turns proof into sections: outcome stats, named expert quotes, a certification finale. Ours has stat bands and citations but:
  - **Outcome-phrased user stats.** IM8 uses "95% felt more energy". Our stat bands mix vs-placebo and %-improvement numbers, which read more clinical than felt-benefit. Consider a felt-outcome framing where we have the data.
  - **Named expert endorsement.** We have no named clinician/expert quote (only universities and an indirect Dr Tina Peers mention). Consider a named-expert proof block.
  - **Certification as a moment.** Informed Sport is only a trust pill and ticker item. IM8 makes NSF a whole "gold standard in purity" section. Consider elevating Informed Sport into a short proof section.

### P2. Offer and CTA strategy is softer than all references
- Competitors: discount framing ("58% off", "Save 30%"), tier labels ("BEST VALUE" / "MOST POPULAR"), urgency, repeated CTAs between sections, guarantee repeated.
- Ours: a single hero CTA string, one bridge CTA, one sticky bar. No price anchor or saving shown in-copy, no tier labeling in the copy layer, no urgency, no mid-page CTA repetition.
- **Do (product decision, not just copy):** decide how aggressive to go. Cheapest wins: add a saving/price anchor to the CTA area and repeat a CTA mid-listicle. Bigger: tier labels and a time-bound offer. Note we deliberately avoid single-product emphasis (two equal Flow/Clear cards), so tiering should be by cadence, not by product.

### P3. Tone could be more second-person and confident
- Magic Mind is relentlessly "you"-framed and treats the product as market leader. Our copy is confident-clinical (correct for our brand) but sometimes describes rather than addresses the reader.
- **Do:** on the copy pass, push second-person address and remove hedged/descriptive phrasing where it dilutes confidence, without losing the clinical credibility that is our differentiator.

## Suggested sequencing (if pursued)

The four new P1s are one coordinated copy+config pass on the reason blocks; do them together:

1. **Re-title + trim (P1 x2):** convert every question headline to a benefit/pain statement, move the search question to the `tag` eyebrow, and cut each `reason.body` to pain clause + fix clause + one proof point. Push extra mechanisms into the ingredient grids.
2. **Fix the numbered spine (P1):** number all reason-type blocks in one unbroken run; consider an "N reasons" hero count.
3. **Populate `costBreakdown` + `comparison` on Productivity (P1):** plumbing exists, no new components. Check the `crashChart` asset first.
4. **Rewrite Productivity + ADHD hero subheads to pain-first (P1)** using Brain Ageing's subhead as the template; add a hero authority line (P2).
5. **Then:** proof-moment additions (expert quote, Informed Sport section), offer/CTA aggressiveness decision with the user, and the "N reasons" hero A/B (P2/P3).

## References
- Configs: `app/lib/landings/{productivity,adhd,brain-ageing}-listicle.ts`
- Renderer + unused `comparison`/`costBreakdown` zones, `tag` eyebrow: `app/components/go/listicle/ListicleRenderer.tsx`, `app/lib/landings/listicle-types.ts`
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Template upgrade plan: `docs/development/featurePlans/listicle-template-upgrade.md`
