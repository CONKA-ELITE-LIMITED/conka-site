Build phases for /implement (Steps 2-5 of the standard Process — the plan template plus the data-layer / component / page checkpoints).

Each build phase below has a build order, a standards check, and a checkpoint format. When `--no-checkpoints` is set, still follow this build order internally but don't pause between phases.

---

## Step 2: Plan template

In plan mode, present the implementation plan in this format, then wait for the user to confirm before exiting plan mode and building:

```
## Implementation Plan: [Feature/Task Name]

**Ticket:** SCRUM-XXX (if applicable)
**Type:** Data layer | Components/pages | Full stack
**Design system:** brand-base — Simple DTC (cart/nav/PDP) or Clinical (`.brand-clinical`; evidence/app-dark)
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

---

## Step 3: Data Layer Implementation (if applicable)

Build the data foundation before any UI work.

### Build order
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

### Data Layer Standards Check
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

---

## Step 4: Component Implementation (if applicable)

Follow `docs/workflows/03-nextjs-development.md` and the design system.

### Build order
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

4. **Design system application (`brand-base.css` — the single stylesheet):**
   - **Simple DTC (cart/nav/PDP acquisition):** rounded `brand-*` tokens (16px interactive, 24px containers, 32px cards), filled navy `#1B2757`, green `#1a7f4f` savings accent, shadows/rings allowed. Left-aligned text.
   - **Clinical (`.brand-clinical`; evidence/app-dark):** same tokens forced to `0px` radius, mono data labels, navy interactive-only, hairline borders, no shadows.
   - See DESIGN_SYSTEM.md §8.5 for which system governs which surface.
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

### Component Standards Check
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

---

## Step 5: Page Composition (if applicable)

Compose the page from components, applying the section/track pattern.

### Build order
1. **Section orchestration:**
   - Page owns all `<section>` wrappers with appropriate bg class and `aria-label`
   - Every section contains a `<div className="brand-track">` wrapping the component
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

### Page Standards Check
Before presenting the checkpoint, verify:
- [ ] Section/track structure correct (`brand-section` + `brand-track`)
- [ ] Section backgrounds alternate for visual rhythm
- [ ] SEO metadata exported (title, description, OG)
- [ ] Single H1, logical heading hierarchy
- [ ] All images have meaningful alt text
- [ ] Analytics events firing on conversion actions
- [ ] Mobile review at 390px: hero + CTA visible without scrolling
- [ ] No layout shift on page load
- [ ] `loading.tsx` exists if page fetches data

**If `--no-checkpoints` is NOT set:** Present results and wait for confirmation.

---

## Incremental Delivery

For non-trivial features, deliver in reviewable chunks:

1. **Data layer checkpoint** -- queries, types, API routes. Review before components.
2. **Component checkpoint** -- shared and page-specific components, mobile/desktop. Review before page composition.
3. **Page composition checkpoint** -- section orchestration, SEO, analytics. Review before cleanup.
4. **Cleanup** -- dead code, imports, linter, build check.

Each checkpoint should be a coherent, reviewable unit. The user should be able to verify the feature at each stage via Vercel preview.

When `--no-checkpoints` is set, still follow this build order internally but don't pause between phases.
