# UX Iteration & Conversion Optimisation (Website)

> **Purpose:** This document defines how to approach iterative UX improvements on existing pages, particularly conversion-facing surfaces like landing pages, funnel pages, and product pages. Follow this when the work is "make this better" rather than "build this new thing".

---

## When to use this document

- Refining an existing page's layout, information hierarchy, or flow
- Improving how a page communicates value, pricing, or product information
- Responding to conversion data, user feedback, or stakeholder input
- Benchmarking against competitors and adopting proven D2C patterns
- Any task where the goal is "this works, but it's not working well enough"

**This is different from building new features.** New features follow `01-scoping-work.md` and `02-implementation-workflow.md`. UX iteration starts from something that already exists and makes it more effective.

---

## Step 1: Understand the problem

Before changing anything, define what's wrong and for whom.

1. **What is the page's job?** Every page has one primary goal. Name it.
   - Landing page: educate cold traffic, push to funnel
   - Funnel page: select product, complete checkout
   - Product page: build desire, add to cart
2. **Where is it failing?** Be specific:
   - "Users are bouncing at step 1" (sticker shock? unclear value?)
   - "Users choose Flow but we want them to choose Both" (information hierarchy? default selection?)
   - "Mobile conversion is lower than desktop" (layout? scroll depth? CTA visibility?)
3. **Who is the user?** For paid traffic pages: zero brand awareness, scrolling on their phone, comparing you to competitors. For organic/direct: some familiarity, potentially returning.

---

## Step 2: Research before designing

Do not guess. Look at what works.

### Competitor analysis
1. **Visit competitor funnels** on mobile (this is how your customers experience them):
   - Overload: `ovrload.co/pages/funnel` and `ovrload.co/pages/gummy`
   - Fussy: `getfussy.com/pages/subscribe`
   - AG1, Huel, Athletic Greens, Magic Mind, Ketone IQ
   - Find more via [Meta Ad Library](https://facebook.com/ads/library) - search the brand, click their ads, follow the landing page

   **Key reference sites with specific lessons:**
   - **Seed.com** — Study their layered depth (components ON sections, not IN them). Avoid their performance patterns.
   - **Ovrload** — Study their conversion intensity and "quickly consumable" information design.
   - **Magic Mind** — Study their approachable science positioning and breathability/whitespace.
   - Full reference notes: `docs/branding/QUALITY_STANDARDS.md`

2. **Note patterns, not aesthetics.** What information do they show at each step? What do they hide? What's the default selection? How do they frame price?
3. **Screenshot and describe** what you observe before proposing changes

### Read the current code
1. Read the affected components fully before proposing changes
2. Understand what data is available and how it flows
3. Check mobile rendering (aspect ratios, sticky positioning, viewport usage)

---

## Step 3: Apply conversion principles

When evaluating or proposing changes, use these principles:

### Information hierarchy
- **One decision per screen.** If the user is choosing frequency, don't also ask them to choose product.
- **Lead with the smallest number.** Per-shot, per-day, per-serving - not the total price. Anchor on the cheap number first.
- **Reveal price progressively.** Value first (what you get), then cost (what you pay). Never lead with the total.
- **Show what ships, not how billing works.** "2 boxes (56 shots) delivered monthly" beats "Monthly Subscription - Subscribe & Save".

### Cognitive load
- **Pre-select the highest-value option.** The customer should only need to confirm, not decide.
- **Fewer words, fewer numbers, fewer choices.** If you can remove an element without losing meaning, remove it.
- **Expanded/collapsed pattern.** Show full details only for the selected option. Collapse unselected options to name + one key metric.
- **One badge, not three.** A single "Most Popular" signal is persuasive. Multiple competing badges cancel each other out.

### Mobile-first
- **80%+ of paid social traffic is mobile.** Design for 390px width first, then adapt for desktop.
- **Scroll beats sticky.** Sticky elements eat viewport on mobile. Let content flow naturally unless there's a strong reason to pin it.
- **Reuse square (1:1) assets.** They work everywhere: funnel, PDP, Shopify, Meta ads. Avoid creating bespoke aspect ratios that can't be reused.
- **Test at thumb distance.** CTAs and interactive elements must be reachable and tappable.

### Trust and urgency
- **Badges should always be visible.** "Most Popular" works even (especially) when the item isn't selected - it draws the eye.
- **Assurance near the CTA.** Guarantee, free shipping, cancel anytime - placed where purchase anxiety peaks.
- **Social proof is strongest with specifics.** "4.8 stars from 312 reviews" beats "Loved by thousands".

---

## Step 4: Scope the iteration

UX iterations are usually small in code but high in impact. Scope them as:

```
## Iteration: [What's changing]

**Problem:** One sentence describing what's not working.
**Hypothesis:** One sentence describing why the change should help.

**Changes:**
1. [Component] - [What changes and why]
2. [Component] - [What changes and why]

**Not changing:** [What stays the same - important to call out]

**How we'll know it worked:** [Metric or qualitative signal]
```

Keep iterations small and deployable. One change per push so you can attribute impact.

---

## Step 5: Implement and verify

1. **Read the affected components** before editing (match existing patterns)
2. **Make the change** - prefer editing existing components over creating new ones
3. **Check mobile first** - resize your browser to 390px or use device emulation
4. **Check desktop second** - ensure nothing broke in the wider layout
5. **Run type-check** - `npx tsc --noEmit`
6. **Push and verify on preview deployment**

### UX-specific verification
- [ ] Does the information hierarchy read correctly on mobile? (most important thing is most prominent)
- [ ] Is there any moment where the user has to "figure something out"? (if yes, simplify)
- [ ] Does the pre-selected option feel like the obvious right choice?
- [ ] Is price introduced at the right moment? (after value, not before)
- [ ] Would a cold-traffic user understand what they're buying within 5 seconds?

---

## Step 6: Update documentation

If the iteration changes the page's behaviour, pricing strategy, or UX patterns:
1. Update the relevant section in `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md`
2. Add a decision log entry if a strategic choice was made
3. Follow `./05-creating-documentation.md` for format

---

## Common iteration patterns

| Pattern | When to use | Example |
|---------|------------|---------|
| **Remove information** | Page feels overwhelming | Hide full price from cadence selector |
| **Reorder information** | Right info, wrong sequence | Show per-shot before total price |
| **Change defaults** | Users picking suboptimal option | Pre-select "Both" instead of "Flow" |
| **Simplify labels** | Users confused by terminology | "1-Month Supply" instead of "Subscribe & Save" |
| **Add social proof** | Trust is low, bounce is high | Badge, review count, guarantee near CTA |
| **Remove sticky elements** | Mobile viewport feels cramped | Let hero scroll naturally |
| **Consolidate badges** | Competing signals cancel out | Single "Most Popular" instead of "Most Popular" + "Best Value" |

---

## References
- Scoping (new features): `./01-scoping-work.md`
- Implementation: `./02-implementation-workflow.md`
- Code review: `./06-code-review.md`
- Current state + roadmap: `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Competitor references: See plan doc "Reference" section for URLs
