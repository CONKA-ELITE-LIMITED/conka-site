---
name: review-page
description: Audit a page for brand voice, SEO, and conversion effectiveness. The "would this convert?" check. For legal compliance use /review-claims. For visual/mobile/performance use /review-visual.
argument-hint: <page path, e.g. app/start/page.tsx or /conka-flow>
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# /review-page -- Would This Page Convert?

You are reviewing a customer-facing page through the lens of a brand strategist and conversion rate optimiser. One scenario drives every decision: a person on their phone, scrolling Instagram, taps a CONKA ad. They've never heard of the brand. They have 3 seconds of attention.

This skill reviews **messaging, SEO, and conversion**. For legal compliance, use `/review-claims`. For visual/mobile/performance, use `/review-visual`. For code quality, use `/review-code`.

---

## Quick Reference

```
/review-page app/start/page.tsx    # Audit by file path
/review-page /conka-flow           # Audit by route
```

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The page files and brand docs were already read this session
- You are responding to a fix request after a recent audit

**If continuing:** skip Step 1 and jump directly to Step 2 (Run the 3-Category Audit). All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Read the Page (silent)

1. **Read the page file** and all components it imports (follow the import tree).

2. **Always read:**
   - `docs/branding/BRAND_VOICE.md` -- voice, proof assets, copy rules, awareness stage frameworks
   - `docs/branding/QUALITY_STANDARDS.md` -- consumability principle, 3-second test, reference sites

3. **If page has pricing, guarantees, or offer terms:** read `app/lib/offerConstants.ts`

**Do NOT read** CLAIMS_COMPLIANCE.md (that's `/review-claims`), DESIGN_SYSTEM.md or MOBILE_OPTIMIZATION.md (that's `/review-visual`).

### Step 2: Run the 3-Category Audit

---

#### 1. Brand Voice and Message Alignment

**Voice (confident-clinical):**
- [ ] Tone is direct, authoritative, accessible -- never corporate, never vague
- [ ] No fluff language ("revolutionary", "game-changing", "supports brain health")
- [ ] Specific numbers used over vague claims ("+28.96%" not "improved performance")
- [ ] At least one verifiable proof point per section

**Copy rules (from `docs/branding/BRAND_VOICE.md`):**
- [ ] Headlines lead with pain or counterintuitive truth, never with the product name
- [ ] Every claim backed with a specific number or verifiable proof point
- [ ] 100-day guarantee referenced at or near every conversion point
- [ ] Daily cost framed (currently 2.29/day for 28-pack subscription)

**Copywriting framework alignment:**
- [ ] Can you identify which framework is in use? (PAS, BAB, Authority First, Comparison, Story)
- [ ] Does the framework match the intended audience awareness stage?
- [ ] Cold traffic (stages 1-2): leads with pain/problem, not product
- [ ] Warm/retargeting (stages 3-5): leads with proof, guarantee, offer

---

#### 2. SEO

- [ ] `metadata` or `generateMetadata` exported with title (includes " | CONKA") and description (<160 chars)
- [ ] Open Graph tags present (title, description, image)
- [ ] Single H1 per page
- [ ] Logical heading hierarchy (H1 -> H2 -> H3, no skipped levels)
- [ ] All images have meaningful alt text
- [ ] JSON-LD structured data for product pages
- [ ] Canonical URL set if risk of duplicate content
- [ ] No broken links or 404-producing hrefs
- [ ] `noindex` set where appropriate (landing page, funnel page)

**Exception:** `/start` and `/funnel` are correctly `noindex` -- paid traffic only.

---

#### 3. Conversion Effectiveness

**Information hierarchy (Steve Krug: "Don't Make Me Think"):**
- [ ] Can someone understand what's being sold in the first viewport?
- [ ] Is the primary CTA visible without scrolling on mobile?
- [ ] Is the value proposition clear before price is shown?
- [ ] Are there too many choices? (Decision fatigue kills conversion)
- [ ] Does each section have one clear purpose?

**Consumability (from `docs/branding/QUALITY_STANDARDS.md`):**
- [ ] One idea per viewport on mobile
- [ ] Scannable over readable (stats, badges, headlines over prose)
- [ ] Progressive disclosure where appropriate
- [ ] Numbers beat paragraphs ("150,000+ bottles sold" > "trusted by a large community")
- [ ] Can each section be understood in <3 seconds on a phone?

**Trust architecture:**
- [ ] Social proof present and specific (reviews, athlete data, university partnerships)
- [ ] Guarantee prominently placed near conversion points
- [ ] Credibility markers visible early (Informed Sport, university partnerships, patent)
- [ ] Real faces / real data over generic stock imagery

**CTA strategy:**
- [ ] CTAs are clear, specific, action-oriented (not just "Learn More")
- [ ] CTA copy matches the stage of the page (early: "See Your Options", late: "Start Your Routine")
- [ ] No competing CTAs that create confusion about what to do next

---

### Step 3: Present the Audit

```
## Page Readiness: [page path / route]

### Summary
[2-3 sentences. Is the messaging effective? What's the biggest conversion risk?]

### 1. Brand Voice: Pass / Needs work / Fail
[Specific findings with component:line references]

### 2. SEO: Pass / Needs work / Fail
[Specific findings]

### 3. Conversion Effectiveness: Pass / Needs work / Fail
[Specific findings]

### Priority Fixes (ordered by conversion impact)
1. [Most impactful]
2. ...

### What's Working Well
- [Specific things done well -- always include this]
```

---

## Key Principles

- **Review as the customer, not the developer.** You're checking if the *experience* converts, not if the code is correct.
- **The 3-second test is real.** For each section: can someone understand it in 3 seconds on a phone?
- **Ogilvy: "The consumer is not a moron. She is your wife."** Respect intelligence. No filler. Every word earns its place.
- **Steve Krug: "Don't Make Me Think."** Cognitive load kills conversion. Clarity beats cleverness.
- **Specificity is credibility.** Name the component, line, and exact text.
- **Always acknowledge good work.** The "What's Working Well" section is not optional.
- **Thoughtful, not bureaucratic.** If SEO doesn't apply to a `noindex` page, say N/A and move on.
- **Never use em dashes** in generated text or copy.
