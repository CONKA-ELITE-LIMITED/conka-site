---
name: review-visual
description: Review design system compliance, visual quality, mobile experience, and performance. Does it look premium, work on mobile, and load fast?
argument-hint: <file paths | route | description>
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# /review-visual -- Does It Look Right and Perform Well?

You are reviewing the visual execution and performance of a D2C e-commerce site where 74% of traffic is mobile from paid social. Your standard: *"Does this feel like Seed.com or Magic Mind, or does it feel like a Shopify template?"*

This skill reviews **design, mobile, and performance**. For code quality, use `/review-code`. For brand voice and conversion, use `/review-page`. For legal compliance, use `/review-claims`.

---

## Quick Reference

```
/review-visual app/start/page.tsx        # Review a specific page
/review-visual app/components/landing/   # Review components
/review-visual /conka-flow               # Review by route
```

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The target files and quality standards were already read this session
- You are responding to a fix request after a recent visual review

**If continuing:** skip Step 1 and jump directly to Step 2 (Run the 4-Check Review). All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Read the Code (silent)

1. **Read the target files** and all components they import (follow the import tree).

2. **Always read:** `docs/branding/QUALITY_STANDARDS.md` -- the visual quality bar.

3. **Conditional reads:**
   - If code touches CSS classes, design tokens, radii, or new visual components: read `docs/branding/DESIGN_SYSTEM.md`
   - If code has complex mobile layouts or split components: read `docs/branding/MOBILE_OPTIMIZATION.md`
   - Otherwise, the design system summary in `CLAUDE.md` is sufficient.

4. **Determine which design system** is in use: `brand-base.css` (new pages) or `premium-base.css` (legacy).

**Do NOT read** CLAIMS_COMPLIANCE.md, BRAND_VOICE.md, or LANDING_PAGE_CLAIMS_LOG.md. This skill reviews visuals, not copy.

### Step 2: Run the 4-Check Review

---

#### Check 1: Design System Compliance

- [ ] All colours, spacing, radii, fonts from design tokens -- zero hardcoded values
- [ ] Correct design system used (`brand-*` for new pages, `premium-*` for legacy)
- [ ] Radius tiers correct (brand: 16px interactive, 24px container, 32px card / premium: 40px card, 20px nested, pill buttons)
- [ ] Section backgrounds follow colour rhythm guidelines
- [ ] Components are content-only (no `<section>`, no root `max-w-*` or `px-*`)
- [ ] Page owns section wrappers with track structure
- [ ] Text left-aligned by default (brand system); centred only if legacy requires it
- [ ] Colour used functionally, not decoratively; pages feel monochrome first
- [ ] `var(--letter-spacing-premium-title)` on section headings

---

#### Check 2: Visual Quality and Premium Feel

- [ ] Every section has visual depth (not flat) -- components sit ON sections, not IN them
- [ ] Each section has distinct visual identity within the shared system
- [ ] Would this feel at home next to Seed.com's homepage?
- [ ] Background rhythm creates intentional pacing (not rapid alternation, not monotone)
- [ ] Whitespace is generous and intentional
- [ ] No section feels "bolted on" or disconnected
- [ ] Product imagery creates physical presence

**If the code looks "template-y" or flat: flag as Important.**

---

#### Check 3: Mobile Experience (390px)

This is the primary experience, not a responsive adaptation.

- [ ] Base styles written for 390px; responsive breakpoints add complexity upward
- [ ] Layout is mobile-native, not a squeezed desktop
- [ ] Hero content and primary CTA above the fold without scrolling
- [ ] All interactive elements have 44px+ tap targets
- [ ] Text readable without zooming
- [ ] No horizontal scroll
- [ ] Mobile/desktop split components used where layout genuinely differs
- [ ] Sticky elements don't obscure content or CTAs
- [ ] One idea per visual group on mobile (quickly consumable)
- [ ] Forms (if any) use appropriate mobile input types

---

#### Check 4: Performance

Speed is premium. A slow page feels cheap.

**Core Web Vitals:**
- [ ] LCP target: <2.5s (is the largest content element optimised?)
- [ ] CLS target: <0.1 (elements jump after load? images without dimensions? async content without reserved space?)
- [ ] FID target: <100ms (heavy JS blocking main thread?)

**Images:**
- [ ] All images use `next/image` with explicit dimensions and alt text
- [ ] Above-fold images have `priority`
- [ ] Below-fold images have `loading="lazy"`
- [ ] No oversized images for their display dimensions

**Bundle and rendering:**
- [ ] Server Components where possible; Client Components kept small
- [ ] No unnecessary client-side data fetching
- [ ] `loading.tsx` / Suspense boundaries for data-fetching routes
- [ ] Third-party scripts loaded with appropriate strategy (`lazyOnload` for non-critical)
- [ ] No waterfall requests in the critical path
- [ ] No layout shift
- [ ] Shopify queries request only needed fields
- [ ] Font imports load only weights actually referenced in CSS
- [ ] External domains have preconnect + dns-prefetch hints
- [ ] Animations use CSS classes, not inline styles (avoids non-composited repaints)

---

### Step 3: Present the Review

```
## Visual Review: [area/page]

**Design system:** brand-base | premium-base

### Design System Compliance: Pass / Needs work / Fail
[Specific findings with component:line references]

### Visual Quality: Pass / Needs work / Fail
[Specific findings]

### Mobile Experience (390px): Pass / Needs work / Fail
[Specific findings]

### Performance: Pass / Needs work / Fail
[Specific findings]

### Issues (priority order)
1. [Most impactful -- mobile/perf issues typically rank highest]
2. ...

### What's Working Well
- [Specific things done well -- always include this]
```

---

## Key Principles

- **Mobile is reviewed first** -- check 390px before desktop. If they conflict, mobile wins.
- **As little design as possible** -- every element earns its place (Dieter Rams).
- **Speed is premium** -- a slow page feels cheap and kills conversion.
- **Specificity is credibility** -- name the component, line, and exact issue.
- **Always acknowledge good work** -- the "What's Working Well" section is not optional.
- **Thoughtful, not bureaucratic** -- if performance isn't relevant to a styling tweak, say N/A and move on.
- **Never use em dashes** in generated text or copy.
