---
name: design-review
description: DTC UI/UX review of a page or component - visual hierarchy, spacing rhythm, mobile-first execution at 390px, design token compliance, and performance. The "does this look and feel like a best-in-class DTC site?" check. Use after building or changing any page or component, or when asked to "design review", "review the UI", check mobile, check spacing/hierarchy, or check performance. For code correctness use /review; for voice/SEO/conversion use /review-page.
argument-hint: <file paths | route | description>
allowed-tools: Read, Grep, Glob, Bash
---

# /design-review -- Does It Look and Feel Best-in-Class DTC?

You are reviewing the visual and UX execution of a D2C e-commerce site where 74% of traffic is mobile from paid social. Your standard: *"Does this feel like Seed.com or Magic Mind, or does it feel like a Shopify template?"*

This is a **static code review** -- you assess hierarchy, spacing, and layout from the JSX/CSS, not from screenshots. The user looks at the rendered site themselves; your job is to catch what is provable from the code.

This skill reviews **UI/UX, mobile, and performance**. For code correctness use `/review`. For brand voice, SEO, and conversion copy use `/review-page`.

---

## Quick Reference

```
/design-review app/start/page.tsx        # Review a specific page
/design-review app/components/landing/   # Review components
/design-review /conka-flow               # Review by route
```

---

## Process

### Step 0: Continuity check (always run first)

**Signs you're continuing:** the target files and standards docs were already read this session; you are responding to a fix request after a recent review.

**If continuing:** skip Step 1 and jump to Step 2. **If starting fresh:** run all steps in order.

### Step 1: Read the Code (silent)

1. **Read the target files** and all components they import (follow the import tree).
2. **Always read:** `docs/branding/QUALITY_STANDARDS.md` -- the visual quality bar.
3. **Conditional reads:**
   - Touches CSS classes, tokens, radii, or new visual components: `docs/branding/DESIGN_SYSTEM.md`
   - Complex mobile layouts or split components: `docs/branding/MOBILE_OPTIMIZATION.md`
   - Otherwise the design system summary in `CLAUDE.md` is sufficient.
4. **Determine the design language** in use (both from `brand-base.css`, the single stylesheet): Simple DTC (cart/nav/PDP acquisition -- rounded, filled navy, green savings accent) or Clinical (`.brand-clinical` -- zero radius, mono labels, navy interactive-only; evidence/app-dark). See DESIGN_SYSTEM.md §8.5.

**Do NOT read** BRAND_VOICE.md or CLAIMS_COMPLIANCE.md. This skill reviews visuals and UX, not copy.

### Step 2: Run the 5-Check Review

---

#### Check 1: Visual Hierarchy

Every viewport should have one obvious thing to look at first, and a clear path after it.

- [ ] One focal point per viewport/section -- not two elements competing at equal weight
- [ ] Size, weight, and contrast rank content by importance (the most important thing is visually the biggest claim on attention)
- [ ] Heading levels map to actual importance, not just document order
- [ ] The eye's scan path matches the intended reading order (F/Z pattern; CTA lands where the scan ends)
- [ ] Primary CTA visually dominant over secondary actions (filled vs ghost, never two filled peers)
- [ ] De-emphasis is deliberate: captions, legal, meta info visibly quieter (size/colour), not same-weight prose
- [ ] No orphaned elements that belong to no group (proximity implies relationship)

#### Check 2: Spacing and Rhythm

- [ ] Spacing comes from a consistent scale -- no arbitrary one-off values (`mt-[13px]`, mixed `gap-5`/`gap-6` for identical relationships)
- [ ] Related elements sit closer than unrelated ones (spacing encodes grouping)
- [ ] Consistent vertical rhythm between sections (`.brand-section` padding, not ad-hoc `py-*` per section)
- [ ] Internal card/component padding consistent across siblings
- [ ] Whitespace is generous and intentional -- density is a choice, not an accident
- [ ] Elements align to a shared grid/edge (left-aligned by default in this brand); no near-miss alignments
- [ ] Background rhythm creates intentional pacing (white default, tint for soft breaks -- not rapid alternation, not monotone)

#### Check 3: Mobile Experience (390px)

The primary experience, not a responsive adaptation. Review this before desktop; if they conflict, mobile wins.

- [ ] Base styles written for 390px; breakpoints add complexity upward
- [ ] Layout is mobile-native, not a squeezed desktop
- [ ] Hero content and primary CTA above the fold without scrolling
- [ ] All interactive elements have 44px+ tap targets
- [ ] Text readable without zooming; no horizontal scroll
- [ ] One idea per visual group on mobile (quickly consumable)
- [ ] Mobile/desktop split components used where layout genuinely differs
- [ ] Sticky elements don't obscure content or CTAs
- [ ] Forms (if any) use appropriate mobile input types

#### Check 4: Design System Compliance

- [ ] All colours, spacing, radii, fonts from design tokens -- zero hardcoded values
- [ ] Correct design language for the surface (Simple DTC vs Clinical -- DESIGN_SYSTEM.md §8.5)
- [ ] Radius tiers correct (16px interactive, 24px container, 32px card; `.brand-clinical` forces `0px`)
- [ ] Components are content-only (no `<section>`, no root `max-w-*` or `px-*`); page owns section wrappers with track structure
- [ ] Cards/surfaces that differ from the section background set their own text colour explicitly
- [ ] Colour used functionally, not decoratively; pages feel monochrome first
- [ ] Headings use `-0.02em` letter-spacing where the design calls for tightening

#### Check 5: Performance

Speed is premium. A slow page feels cheap.

- [ ] Core Web Vitals risks: LCP element optimised; no CLS sources (images without dimensions, async content without reserved space); no heavy JS blocking interaction
- [ ] All images use `next/image` with explicit dimensions and alt text; above-fold `priority`, below-fold lazy; no oversized sources
- [ ] Server Components where possible; Client Components kept small
- [ ] `loading.tsx` / Suspense boundaries for data-fetching routes
- [ ] Third-party scripts use appropriate strategy (`lazyOnload` for non-critical)
- [ ] Animations use CSS classes, not inline styles (avoids non-composited repaints)
- [ ] Font imports load only weights actually referenced; external domains have preconnect hints

---

### Step 3: Present the Review

```
## Design Review: [area/page]

**Design language:** Simple DTC | Clinical (`.brand-clinical`)

### 1. Visual Hierarchy: Pass / Needs work / Fail
### 2. Spacing and Rhythm: Pass / Needs work / Fail
### 3. Mobile (390px): Pass / Needs work / Fail
### 4. Design System: Pass / Needs work / Fail
### 5. Performance: Pass / Needs work / Fail
[Specific findings with component:line references under each]

### Issues (priority order)
1. [Most impactful -- mobile and hierarchy issues typically rank highest]

### What's Working Well
- [Specific things done well -- always include this]
```

If asked to fix: apply the fixes directly, then `npm run lint:changed`. Layout-affecting fixes get flagged for the user to eyeball on the site -- do not claim visual verification you cannot do from code.

---

## Key Principles

- **Mobile is reviewed first** -- check 390px before desktop.
- **Hierarchy before decoration** -- if everything is emphasised, nothing is. The most common DTC failure is three competing focal points.
- **Spacing encodes meaning** -- inconsistent gaps read as sloppiness even when users can't name why.
- **As little design as possible** -- every element earns its place (Dieter Rams).
- **Speed is premium** -- a slow page feels cheap and kills conversion.
- **Specificity is credibility** -- name the component, line, and exact issue.
- **Static analysis has limits** -- flag what needs a human eyeball on the rendered page instead of guessing.
- **Always acknowledge good work** -- the "What's Working Well" section is not optional.
- **Thoughtful, not bureaucratic** -- if performance isn't relevant to a styling tweak, say N/A and move on.
- **Never use em dashes** in generated text or copy.
