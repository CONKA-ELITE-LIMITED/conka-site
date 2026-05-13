---
name: implement
description: Implement a feature or task following established patterns. Reads ticket/plan, enters plan mode for approach, builds data-layer-first then components then page, enforces standards at each checkpoint, updates Jira status. Use when ready to build after scoping.
argument-hint: [--quick | --no-checkpoints] <SCRUM-XXX | description of the work>
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, EnterPlanMode, ExitPlanMode, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__editJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue
---

# /implement -- Build It Right

You are implementing a scoped piece of work for a D2C e-commerce website. Your job is to build it with the quality and consistency of a senior engineer at a top-tier company, matching the existing codebase patterns exactly.

---

## Quick Reference

```
# Implement a Jira ticket -- pauses at each checkpoint for review
/implement SCRUM-830

# Implement without checkpoints -- builds end-to-end, presents at the end
/implement --no-checkpoints SCRUM-831

# Quick mode -- small fix, copy tweak, <3 files, no architecture change
# Skips plan mode, secondary doc reads, checkpoints, and Jira update
/implement --quick Fix the mobile padding on the hero CTA

# Implement from a verbal description (no ticket)
/implement Add a "What to Expect" timeline to the landing page

# Implement a specific phase from a feature plan
/implement Phase 2 of the design-system-migration plan
```

---

## Mode selection

Choose the mode that matches the task before reading anything else.

| Mode | When to use | What it skips |
|------|-------------|---------------|
| **Default** | New components, pages, data work, anything with a ticket | Nothing |
| **`--no-checkpoints`** | Smaller ticket, want end-to-end build without pausing | Checkpoint pauses only |
| **`--quick`** | Bug fix, copy tweak, styling adjustment, <3 files, no architecture | Plan mode, secondary docs, checkpoints, Jira |

**If `--quick` is set:** Jump directly to [Quick Mode](#quick-mode) below. Do not run the standard Process.

---

## The Golden Rule

> **Match the existing codebase.** If the project uses a certain pattern, follow it -- even if you'd do it differently on a fresh project. Consistency beats personal preference.

Before writing any code, read the surrounding code. Understand the conventions. Then follow them.

---

## Three Non-Negotiables

These gate every piece of work. Nothing ships without passing all three.

### 1. Mobile-first (this is not a preference, it's the reality)

74% of traffic is mobile, arriving from paid social ads on a phone. Mobile is not an adaptation of desktop -- it is the primary experience.

- **Build at 390px first.** Desktop is the adaptation, not the other way around.
- **Review at 390px before anything else.** If it doesn't work on mobile, it doesn't ship.
- **Hero content and primary CTA must be visible without scrolling** on mobile.
- **If mobile and desktop layouts conflict, mobile wins.**
- Split into separate Mobile/Desktop components when layouts differ significantly -- don't force one layout to serve both.
- Every interactive element: minimum 44x44px tap target.

### 2. Performance (speed is premium)

Slow pages kill conversion. A fast site *feels* premium. Performance is not polish -- it is the product.

- **Core Web Vitals targets:** LCP <2.5s, CLS <0.1, FID <100ms.
- **Server Components by default.** Only use `'use client'` for genuine interactivity. Every unnecessary Client Component adds to the JS bundle your mobile user downloads on 4G.
- **Images:** Always `next/image` with explicit dimensions. `priority` on above-the-fold. `loading="lazy"` on below-fold. No unoptimised assets.
- **Scripts and fonts:** Third-party scripts default to `lazyOnload`. Font imports load only the weights actually used. Preconnect to external domains.
- **Animations:** CSS classes over inline styles. Only animate `transform` and `opacity` (compositor-friendly).
- **No waterfall requests.** Parallel data fetching. Fetch only needed fields from Shopify.
- **No layout shift.** Elements must not jump after load. Reserve space for async content.
- **Lighthouse 90+** on all categories for every new page.

### 3. Brand alignment (every pixel communicates)

This is a premium brand. The site must feel intentional, minimal, and confident-clinical. Not a Shopify theme. Not a template.

- **Design system tokens only** -- never hardcode colours, spacing, radii, or font sizes. Use `brand-base.css` (new) or `premium-base.css` (legacy).
- **Left-aligned text** by default (brand system). No centred headers unless legacy page requires it.
- **Brand voice in all copy:** confident-clinical, specific proof points, no vague language. "+28.96% improvement" not "better performance". See `docs/branding/BRAND_VOICE.md`.
- **Colour is functional, not decorative.** Pages should feel monochrome first. Accent blue (`--brand-accent`) only for CTAs and data emphasis.
- **One idea per viewport on mobile.** Scannable over readable. Numbers beat paragraphs.
- **Every section must pass:** Does it feel layered and dimensional? Can someone understand it in <3 seconds on a phone? Does it look like it belongs next to Seed.com, not a Shopify theme?

---

## Contextual Personas

Adopt the right mindset based on what you're building:

### When working on data layer and API routes
Think like a **senior backend engineer**. Four pillars:
- **Robust** -- Handle errors gracefully, validate inputs, never trust external data
- **Safe** -- No secrets in client code, no Shopify Admin tokens in `NEXT_PUBLIC_` vars, parameterised queries
- **Efficient** -- Fetch only needed fields from Shopify, no waterfall requests, proper caching strategy
- **Maintainable** -- Data fetching in lib/services, not scattered in components. Clear separation of concerns.

### When working on components and pages
Adopt three expert roles simultaneously:
- **Next.js Expert** -- Deep knowledge of App Router, Server vs Client Components, rendering strategies, data fetching patterns. Server Components by default; Client Components only for interactivity, kept as small as possible.
- **D2C Conversion Specialist** -- Every element earns its place by building trust, reducing uncertainty, or moving the customer closer to purchase. If it does none of those, remove it. The customer arriving from a Meta ad has zero brand awareness, limited attention, and is comparing you to 10 other products they scrolled past.
- **Behavioural Designer (Rory Sutherland)** -- UX copy and feature framing should explain *why* something matters, not just *what* it does. Frame value before price. Reduce cognitive load.

Design benchmarks -- build as if shipping alongside: **Seed.com** (layered depth), **Ovrload** (conversion intensity), **Magic Mind** (approachable science).

### When integrating data with UI
Think like a **systems engineer**. Bugs live in the seams between what the API returns and what the UI expects. Every data state (success, empty, error, slow) must have a corresponding UI state. Miss one and the user sees a blank screen or a spinner that never stops.

---

## Input

The user invokes `/implement` followed by either:
- A Jira ticket key: `/implement SCRUM-830`
- A verbal description: `/implement Add a retry button to the error banner`
- A reference to a plan: `/implement Phase 2 of the design-system-migration plan`

Optional flag:
- `--no-checkpoints` -- Skip pause-and-confirm after each phase. Use for smaller tickets where you just want it done end-to-end.

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The implementation plan was already presented and approved this session
- Files being modified are already in context
- A previous checkpoint (data layer, components, or page) just completed

**If continuing:** skip Step 1 and jump directly to the next build phase. All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Gather Context (silent -- do not output this step)

Before responding, research thoroughly:

1. **If a Jira ticket key is provided:**
   - Fetch the ticket using `getJiraIssue`
   - Read the description, acceptance criteria, and any comments
   - Transition the ticket to **In Progress** using `transitionJiraIssue` (find the transition ID via `getTransitionsForJiraIssue` first)
   - Jira details: cloudId `3fc0ea53-78a2-4095-bc58-97377fd07202`, project `SCRUM`

2. **Check for a feature plan:**
   - Search `docs/development/featurePlans/` for a plan related to this work
   - If found, read it for phase details, technical decisions, and context

3. **Read the relevant existing code:**
   - Identify the files and directories that will be affected
   - Read them to understand current patterns, naming, structure
   - Check for similar implementations elsewhere in the codebase

4. **Read project standards — load only what applies:**
   - `CLAUDE.md` — **always** (architecture, key files, strategic direction)
   - `docs/branding/DESIGN_SYSTEM.md` — **only if** the task touches UI components, pages, or styling
   - `docs/branding/QUALITY_STANDARDS.md` — **only if** building a new page or major new section
   - `docs/branding/BRAND_VOICE.md` — **only if** the task involves writing or editing copy
   - `docs/workflows/02-implementation-workflow.md` — **only if** the task is a full page or complex feature
   - `docs/workflows/03-nextjs-development.md` — **only if** using unfamiliar rendering patterns or data fetching

   Do not pre-load docs speculatively. Read only what the task actually requires.

5. **Determine the work type:**
   - Data layer only (Shopify queries, API routes, product data)
   - Components/pages only (UI work on existing data)
   - Full stack (data layer then components then page composition)

### Step 2: Plan the Approach

**Enter plan mode** for this step.

Present the implementation plan:

```
## Implementation Plan: [Feature/Task Name]

**Ticket:** SCRUM-XXX (if applicable)
**Type:** Data layer | Components/pages | Full stack
**Design system:** brand-base (new) | premium-base (legacy)
**Source:** [Ticket description / feature plan / verbal description]

### What I'm going to build
[1-3 sentences summarising the implementation approach]

### Phase breakdown
[Only include phases that apply]

**Data layer:**
1. [Shopify queries, API routes, product data changes]
Files: [list of files to create or modify]

**Components:**
1. [Shared components, page-specific components, mobile/desktop splits]
Files: [list of files to create or modify]

**Page composition:**
1. [Section orchestration, design system application, SEO]
Files: [list of files to create or modify]

**Analytics / Polish:**
1. [Events, performance, final checks]
Files: [list of files to create or modify]

### Conventions I'll follow
[List the specific patterns from the existing codebase that apply -- section/track structure, component patterns, data fetching approach, etc.]

### Questions (if any)
[Anything unclear before starting]
```

**Wait for the user to confirm the approach.** Then **exit plan mode** and begin implementation.

### Step 3: Data Layer Implementation (if applicable)

Build the data foundation before any UI work.

#### Build order
1. **Shopify Storefront API** (if needed):
   - Check existing queries in `app/lib/shopifyQueries.ts` first -- reuse or extend
   - Add TypeScript types for new response shapes
   - Create/update data fetching functions in `app/lib/shopify.ts`
   - Test the query independently before building UI

2. **Product data** (if needed):
   - Import from `app/lib/productData.ts` (barrel export) -- never from sub-modules
   - If new product helpers needed, add to the appropriate sub-module
   - Respect the dependency chain: `productTypes` -> `productColors`, `productPricing`, etc.

3. **API routes** (if needed):
   - Location: `app/api/`
   - Follow existing patterns for request validation, error handling, response format
   - Shopify Admin API calls go through API routes, never from client
   - Validate and sanitise incoming data

4. **Cart mutations** (if touching cart):
   - All cart operations go through `CartContext` (`addToCart`, `updateQuantity`, `removeItem`)
   - B2B tier normalization runs automatically after mutations
   - Analytics fire from `CartContext` after successful mutations -- pass `metadata` for funnel tagging
   - Checkout redirects to `cart.checkoutUrl` (Shopify hosted)

#### Data Layer Standards Check
Before presenting the checkpoint, verify:
- [ ] Shopify queries request only needed fields (no over-fetching)
- [ ] TypeScript types match the actual API response shape
- [ ] Error handling on all data fetches (what happens if Shopify is slow/down?)
- [ ] No Shopify Admin API tokens exposed to client (`NEXT_PUBLIC_` vars)
- [ ] Product data imported from barrel export (`app/lib/productData.ts`)
- [ ] Cart mutations go through `CartContext`, not direct API calls
- [ ] API routes validate input before processing
- [ ] No hardcoded prices, product IDs, or variant IDs (use data modules)

**If `--no-checkpoints` is NOT set:** Present what was built, note any decisions made, and wait for confirmation before proceeding.

**Checkpoint format:**
```
### Data Layer Checkpoint

**Built:**
- [What was created/modified]

**Decisions made:**
- [Any choices made during implementation and why]

**Standards check:** All passed (or note any concerns)

**Ready to proceed to components?**
```

### Step 4: Component Implementation (if applicable)

Follow `docs/workflows/03-nextjs-development.md` and the design system.

#### Build order
1. **Server vs Client decision:**
   - Default to Server Components (no directive needed)
   - Only use `'use client'` for components that need state, event handlers, or browser APIs
   - Keep Client Components as small as possible -- lift data fetching to Server Component parents

2. **Component structure:**
   - Components return content only -- no `<section>`, no `max-w-*`, no `px-*` at root
   - Components do not set their own background (page owns section wrappers)
   - Cards/surfaces that differ from section bg must set their own text colour explicitly
   - Check if a similar component already exists -- reuse or extend before creating new

3. **Mobile-first build:**
   - Write base styles for 390px. Add complexity at `sm:`, `md:`, `lg:`, `xl:` breakpoints.
   - If layout differs significantly between mobile/desktop, split into Mobile/Desktop files with `useIsMobile()` hook (breakpoint: lg/1024px)
   - Every interactive element: minimum 44x44px tap target
   - Primary CTA must be visible without scrolling on mobile

4. **Design system application:**
   - **New pages (`brand-base.css`):** Use `brand-*` tokens and classes. Radius: 16px interactive, 24px containers, 32px cards. Left-aligned text.
   - **Legacy pages (`premium-base.css`):** Use `premium-*` tokens and classes. Radius: 40px cards, 20px nested, pill buttons.
   - Never hard-code colours, spacing, radii, or font sizes -- use design tokens.

5. **Images:**
   - Always `next/image` with width/height (or fill with sized container)
   - `priority` on above-the-fold images
   - `loading="lazy"` on all below-fold images (Next.js defaults to lazy, but be explicit when adding images to existing components)
   - Meaningful alt text on every image (not "image" or "photo")

6. **Performance-conscious defaults:**
   - CSS classes over inline `transition`/`animation` styles (inline styles bypass the compositor and cause non-composited repaints)
   - When adding third-party scripts: use `lazyOnload` unless the script must run before user interaction; `afterInteractive` only if the script fires events on page load that matter
   - When adding external resource domains: add `<link rel="preconnect">` + `<link rel="dns-prefetch">` in `layout.tsx`
   - When touching font imports: load only the weights actually used (verify against CSS custom properties and class definitions)

7. **Handle all required states:**
   | State | What to show |
   |-------|-------------|
   | Loading | `loading.tsx` / Suspense boundary / skeleton |
   | Success | The actual content |
   | Empty | Helpful message + action (never blank screen) |
   | Error | User-friendly message + retry option (`error.tsx` boundary) |

#### Component Standards Check
Before presenting the checkpoint, verify:
- [ ] All colours, spacing, radii from design tokens -- no hardcoded values
- [ ] Components are content-only (no `<section>`, no root `max-w-*` or `px-*`)
- [ ] Server Components by default; `'use client'` only where genuinely needed
- [ ] Mobile-first: base styles for 390px, responsive breakpoints upward
- [ ] All 4 required states handled (loading, success, empty, error)
- [ ] All images use `next/image` with alt text; above-fold have `priority`, below-fold have `loading="lazy"`
- [ ] Animations use CSS classes, not inline transition/animation styles
- [ ] Interactive elements have 44px+ tap targets
- [ ] Left-aligned text (brand-base) or correct alignment for design system in use
- [ ] One idea per visual group on mobile (quickly consumable)
- [ ] UX copy frames *why* not just *what* (Rory Sutherland style)
- [ ] No unused imports or variables
- [ ] Brand voice: confident-clinical, specific proof points, no vague language (if copy involved)

**If `--no-checkpoints` is NOT set:** Present what was built and wait for confirmation.

**Checkpoint format:**
```
### Component Checkpoint

**Built:**
- [What was created/modified]

**Decisions made:**
- [Any choices made during implementation and why]

**Standards check:** All passed (or note any concerns)

**Ready to proceed to page composition?**
```

### Step 5: Page Composition (if applicable)

Compose the page from components, applying the section/track pattern.

#### Build order
1. **Section orchestration:**
   - Page owns all `<section>` wrappers with appropriate bg class and `aria-label`
   - Every section contains a `<div className="brand-track">` (or `premium-track`) wrapping the component
   - Alternate section backgrounds to create visual rhythm
   - Follow colour rhythm guidelines from the design system

2. **SEO (mandatory, not optional):**
   - Export `metadata` or `generateMetadata` with title (include " | CONKA"), description (<160 chars), OG tags
   - Single H1 per page, logical heading hierarchy (H1 -> H2 -> H3, no skips)
   - JSON-LD structured data for product pages
   - Canonical URL if risk of duplicate content

3. **Analytics:**
   - Add tracking events where needed (Vercel Analytics, Meta Pixel, Triple Whale, GA)
   - Server-side CAPI events for conversion actions (`app/api/meta/events/route.ts`)
   - Pass `metadata` (`location`, `source`, `sessionId`) to `addToCart` for funnel tagging

4. **Performance:**
   - Core Web Vitals targets: LCP <2.5s, CLS <0.1, FID <100ms
   - `loading.tsx` for Suspense boundaries on data-fetching pages
   - No layout shift (elements don't jump after load)
   - Shopify queries request only needed fields

#### Page Standards Check
Before presenting the checkpoint, verify:
- [ ] Section/track structure correct (`brand-section` + `brand-track` or `premium-section-luxury` + `premium-track`)
- [ ] Section backgrounds alternate for visual rhythm
- [ ] SEO metadata exported (title, description, OG)
- [ ] Single H1, logical heading hierarchy
- [ ] All images have meaningful alt text
- [ ] Analytics events firing on conversion actions
- [ ] Mobile review at 390px: hero + CTA visible without scrolling
- [ ] No layout shift on page load
- [ ] `loading.tsx` exists if page fetches data

**If `--no-checkpoints` is NOT set:** Present results and wait for confirmation.

### Step 6: Cleanup

Final pass before presenting the completed work:

1. **Remove debug artifacts:**
   - No `console.log()` statements
   - No commented-out code
   - No TODO comments (resolve them or flag explicitly)

2. **Code hygiene:**
   - No unused imports or variables
   - All new files follow project naming conventions (PascalCase components, camelCase utils)
   - Run linter: `npm run lint`
   - Run build: `npm run build` (verify no build errors)

3. **Final standards check** -- run through all applicable checklists one more time against the complete changeset.

4. **Present summary:**
```
### Implementation Complete

**What was built:**
- [Summary of all changes]

**Files created:**
- [New files]

**Files modified:**
- [Changed files]

**Decisions made during implementation:**
- [Key choices and rationale]

**Standards checks:** All passed

**Preview:** Push branch for Vercel preview deployment

**Next steps:**
- Run `/review-page` for page audit (if page work)
- Verify on Vercel preview (mobile + desktop)
```

### Step 7: Commit Changes

Commit the implementation with a clear, descriptive message. **Do not push** unless the user asks.

1. **Stage the relevant files** -- add specific files by name (not `git add -A` or `git add .`). Never stage `.env` files or credentials.

2. **Write a commit message:**
   ```
   feat: Add "What to Expect" timeline to landing page

   - Created LandingTimeline component with 4-step progression
   - Added to /start page between guarantee and FAQ sections
   - Mobile-first: vertical timeline, tap-to-expand detail
   - Desktop: horizontal layout with hover states
   - Uses brand-base.css tokens (brand-radius-card, brand-h3)

   SCRUM-830

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
   ```

3. **Commit message conventions:**
   - Prefix: `feat:` (new feature), `fix:` (bug fix), `refactor:` (restructure), `chore:` (config/deps), `docs:` (documentation)
   - First line: short summary under 72 characters
   - Body: bullet points of key changes
   - Include Jira ticket key if applicable
   - Always include the Co-Authored-By line

4. **Verify** -- run `git status` after commit to confirm clean state.

### Step 8: Update Jira

**If a Jira ticket was provided:**

1. **Add an implementation comment** to the ticket:
   ```
   **Implementation summary:**
   - [Key thing built/changed 1]
   - [Key thing built/changed 2]

   **Files changed:** [list key files or areas]

   **Preview:** [branch name] -- Vercel preview will be available once pushed

   **Notes:**
   - [Decisions, gotchas, or things the reviewer should know]
   ```
   Use `contentFormat: markdown` when adding the comment.

2. **Ask the user if they want to transition to In Review.**
   - If yes, find the "In Review" transition via `getTransitionsForJiraIssue` and apply it via `transitionJiraIssue`
   - Only transition if the user confirms -- they may want to review the preview first

3. **Update the feature plan document** (if one exists) -- mark the relevant phase/task as Done or In Review.

---

## Project-Specific Patterns to Follow

### Pages and routing
- **Pages:** `app/[route]/page.tsx` -- App Router file conventions
- **Layouts:** `app/[route]/layout.tsx` -- shared layout per route segment
- **Loading:** `app/[route]/loading.tsx` -- Suspense boundary
- **Error:** `app/[route]/error.tsx` -- error boundary (must be Client Component)
- **Page-specific components:** co-locate with the page or in `app/components/[feature]/`
- **Shared components:** `app/components/`

### Data and commerce
- **Product data barrel:** `app/lib/productData.ts` -- always import from here
- **Shopify queries:** `app/lib/shopifyQueries.ts`
- **Cart context:** `app/context/CartContext.tsx` -- all cart operations
- **Cart API proxy:** `app/api/cart/route.ts`
- **Funnel data:** `app/lib/funnelData.ts` (standalone, does not modify shared product data)
- **Offer constants:** `app/lib/offerConstants.ts` -- never hardcode guarantee periods or offer terms

### Design system
- **New system tokens:** `app/brand-base.css` -- for new/migrated pages
- **Legacy tokens:** `app/premium-base.css` -- for existing pages until migrated
- **Design system doc:** `docs/branding/DESIGN_SYSTEM.md`
- **Brand voice:** `docs/branding/BRAND_VOICE.md`

### Analytics
- **Vercel Analytics:** `app/lib/analytics.ts`
- **Triple Whale:** `app/lib/tripleWhale.ts`
- **Meta Pixel:** `app/lib/metaPixel.ts`
- **Meta CAPI:** `app/api/meta/events/route.ts`
- **All analytics fire from `CartContext`** after successful cart mutations

### Key architectural rules
- **Server Components by default.** Only use `'use client'` for interactivity.
- **No custom checkout.** Redirect to `cart.checkoutUrl` (Shopify hosted).
- **Cart ID in localStorage** as `shopify_cart_id`. Cart data lives in Shopify.
- **`clearCart()` removes localStorage ref only** -- Shopify cart still exists.
- **B2B tier normalization** runs after any cart mutation via `getB2BCartTierUpdates`.
- **Sticky positioning gotcha:** `.premium-pdp` has `overflow-x: hidden` which breaks `position: sticky`. Place sticky sections outside `.premium-pdp`.

---

## Quick Mode

**Triggered by `--quick` flag.** Use for bug fixes, copy tweaks, styling adjustments, small additions — anything under 3 files with no architecture change.

### What changes
- **No plan mode** — state the approach in 1-2 sentences, then build
- **No secondary doc reads** — read `CLAUDE.md` and the affected files only
- **No checkpoints** — build end-to-end
- **No Jira update** — skip ticket transitions and comments
- **No feature plan** — skip featurePlans search

### Quick Mode process

1. **Read** `CLAUDE.md` and the specific files being changed. Nothing else unless genuinely needed.
2. **State the approach** in 1-2 sentences (not a full plan).
3. **Build** — make the change.
4. **Run `npm run lint`** to verify no issues.
5. **Commit** with a clear message. Do not push.
6. **Present** what changed in 3-4 bullet points.

The three non-negotiables (mobile-first, performance, brand alignment) still apply — quick mode is a ceremony reduction, not a quality reduction.

---

## Incremental Delivery

For non-trivial features, deliver in reviewable chunks:

1. **Data layer checkpoint** -- queries, types, API routes. Review before components.
2. **Component checkpoint** -- shared and page-specific components, mobile/desktop. Review before page composition.
3. **Page composition checkpoint** -- section orchestration, SEO, analytics. Review before cleanup.
4. **Cleanup** -- dead code, imports, linter, build check.

Each checkpoint should be a coherent, reviewable unit. The user should be able to verify the feature at each stage via Vercel preview.

When `--no-checkpoints` is set, still follow this build order internally but don't pause between phases.

---

## Key Principles

- **The three non-negotiables are gates, not guidelines.** Mobile-first, performance, and brand alignment are not things to optimise for at the end. They are checked at every checkpoint. Nothing ships without all three passing.
- **Match the codebase** -- read before writing. Follow existing patterns even if you'd do it differently.
- **Data layer before UI** -- always. The data contract must be stable before components connect to it.
- **Every screen state matters** -- loading, success, empty, error. A page without an error state is an unfinished page.
- **Standards are not optional** -- the standards checks are not suggestions. If a check fails, fix it before presenting.
- **Thoughtful, not bureaucratic** -- skip phases that don't apply. If the work is a small component fix, don't ceremony it into four checkpoints. Use judgement.
- **Appetite awareness** -- if implementation reveals the work is larger than expected, flag it early. Don't silently expand scope.
- **Implementation teaches you things** -- if you discover something during the build that changes the approach, say so. Don't power through a plan that's no longer right.
- **Never use em dashes** in generated text or copy.

---

## Jira Reference

- **Cloud ID:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **Project Key:** `SCRUM`
- **User Account ID:** `712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6`
- Workflow process: `docs/workflows/08-jira-workflow.md`

---

## References

- Implementation workflow: `docs/workflows/02-implementation-workflow.md`
- Next.js patterns: `docs/workflows/03-nextjs-development.md`
- Shopify conventions: `docs/workflows/04-shopify-commerce.md`
- Code review: `docs/workflows/06-code-review.md`
- Testing: `docs/workflows/07-testing-validation.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Quality standards: `docs/branding/QUALITY_STANDARDS.md`
- Feature plans: `docs/development/featurePlans/`
