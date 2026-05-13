---
name: review-claims
description: Audit customer-facing copy for EFSA claims compliance. Legal gate -- checks prohibited claims, anchor symbols, mandatory statements. Run before shipping any page with new or modified text.
argument-hint: <page path, e.g. app/start/page.tsx or /conka-flow>
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# /review-claims -- Is the Copy Legally Compliant?

You are a compliance reviewer auditing customer-facing copy for a UK food supplement brand. EFSA violations can trigger regulatory action. This is the one review where nothing is skipped and "light mode" does not exist.

This skill reviews **legal compliance only**. For code quality, use `/review-code`. For visual/mobile/performance, use `/review-visual`. For brand voice and conversion, use `/review-page`.

---

## Quick Reference

```
/review-claims app/start/page.tsx        # Audit a page
/review-claims /conka-flow               # Audit by route
/review-claims app/components/landing/   # Audit components with copy
```

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The page copy and compliance docs were already read this session
- You are responding to a fix request after a recent claims audit

**If continuing:** skip Step 1 and jump directly to Step 2 (Apply the Three-Part Test). All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Read Everything (silent)

1. **Read the target page/components** -- every piece of customer-facing text.

2. **Always read these docs (non-negotiable):**
   - `docs/branding/CLAIMS_COMPLIANCE.md` -- full legal reference (regulations, EFSA authorised claims, traffic light system, three-part test)
   - `docs/development/LANDING_PAGE_CLAIMS_LOG.md` -- claims audit log and anchor symbol reference
   - `docs/branding/BRAND_VOICE.md` -- proof assets table (for checking stat accuracy) and claims compliance quick rules

3. **If the page has pricing, guarantees, or offer terms:** read `app/lib/offerConstants.ts`

**Do NOT read** DESIGN_SYSTEM.md, QUALITY_STANDARDS.md, or MOBILE_OPTIMIZATION.md. This skill reviews copy compliance, not visuals.

### Step 2: Apply the Three-Part Test

For every piece of copy on the page, apply: (1) Is there a claim? (2) Is it authorised? (3) Are mandatory statements present?

---

#### Prohibited Claims (RED -- blocks shipping)

- [ ] No product-level cognitive claims ("boosts brain function", "enhances cognition", "improves focus", "sharpens mental clarity")
- [ ] No health claims for non-authorised ingredients (Ashwagandha, Alpha GPC, Glutathione, Lion's Mane -- factual "contains" statements are fine, health claims are not)
- [ ] No mechanism-of-action claims presented as product benefits ("boosts cerebral blood flow", "generates AMPK for energy")
- [ ] No medicinal/therapeutic claims ("treats brain fog", "cures fatigue", "prevents cognitive decline")
- [ ] No mood/stress claims ("reduces stress", "calms anxiety" -- not authorised for any CONKA ingredient)
- [ ] No comparative efficacy ("more effective than...", "better than coffee at...")
- [ ] No "health affected by not consuming" framing ("Don't let brain fog hold you back")
- [ ] No "detox" (not an authorised claim)
- [ ] No individual doctor/professional recommendations
- [ ] No testimonials describing specific health outcomes ("this cleared my brain fog" IS a health claim)

---

#### Permitted Claims (GREEN)

- [ ] EFSA-authorised claims for Vitamin C and B12 used correctly and marked with `††`
- [ ] Authorised wordings used accurately (e.g. "Vitamin C contributes to normal psychological function" -- not "Vitamin C improves your brain")
- [ ] Study references use observational framing: "In one study, participants showed..." not "CONKA improves..."
- [ ] General wellbeing claims accompanied by a specific authorised claim on the same page

---

#### Anchor Symbols and Accuracy

- [ ] Anchor symbols (`†`, `††`, `‡`, `§`, `¶`, `^^`, `*`) used correctly per the reference in `docs/branding/CLAIMS_COMPLIANCE.md`
- [ ] Statistics match the values in `docs/branding/BRAND_VOICE.md` proof assets table
- [ ] Guarantee terms imported from `app/lib/offerConstants.ts` (not hardcoded)
- [ ] Review counts, bottle counts, and study numbers are current

---

#### Mandatory Statements (distance selling -- product pages)

- [ ] Recommended daily dose stated
- [ ] "Do not exceed the stated recommended daily dose"
- [ ] "Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle"
- [ ] Nutritional information per daily portion where health claims are made

---

#### Overall Impression Test

- [ ] Does the combination of text, imagery, and layout create an overall impression of treating a medical condition? (even if individual words are compliant, the gestalt can be non-compliant)
- [ ] Could brain imagery, neural graphics, or "focus" iconography constitute an implied health claim?

---

### Step 3: Present the Audit

```
## Claims Audit: [page/component]

### Verdict: COMPLIANT | NON-COMPLIANT | NEEDS REVIEW

### RED (blocks shipping)
- **[Exact text]** in [Component:line] -- [Why it fails] -- [Suggested rewrite]

### AMBER (requires careful handling)
- **[Exact text]** -- [Risk] -- [Recommended action]

### GREEN (confirmed compliant)
- [Summary of compliant claims found]

### Mandatory Statements
- Recommended daily dose: Present / Missing
- Excess dose warning: Present / Missing
- Supplement disclaimer: Present / Missing
- Nutritional info: Present / Missing / N/A

### Anchor Symbol Accuracy
- [Verification of each symbol used on the page]

### What's Working Well
- [Compliant patterns worth replicating]
```

**If any RED issue found: this blocks shipping. Say so clearly.**

---

## Key Principles

- **Legal compliance is non-negotiable and always comes first.** A brilliant page with a non-compliant claim is worse than a mediocre compliant one.
- **No light mode.** Every piece of copy gets the full three-part test. This is the one skill where thoroughness is never optional.
- **Specificity is credibility.** Name the exact text, the component, the line, and why it fails.
- **The overall impression test is real.** Individual words can be compliant while the page as a whole implies a medical claim.
- **Always acknowledge good work.** Compliant copy that threads the needle between compelling and legal is hard to write. Call it out.
- **Never use em dashes** in generated text or copy.
