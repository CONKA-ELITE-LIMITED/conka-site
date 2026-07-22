# Implementation Workflow (Website)

> **Purpose:** This document defines the step-by-step process for implementing a feature or task AFTER scoping is complete. Follow this sequence to ensure consistent, high-quality implementation in the Next.js website project.

---

## When to use this document

- You have a scoped task (from `./01-scoping-work.md`) and are ready to build
- You're implementing a bug fix that touches multiple files
- You're making any change that involves data fetching, UI, or commerce logic

---

## Phase 1: Pre-implementation setup

Before writing any code:

1. **Read the relevant existing docs:**
   - Architecture docs: `docs/PROJECT_OVERVIEW.md`
   - Design system: `docs/branding/DESIGN_SYSTEM.md`
   - Quality standards: `docs/branding/QUALITY_STANDARDS.md`
   - Any feature-specific docs referenced in the scope
2. **Check the current state of affected files** — read them, understand the existing patterns
3. **Identify the existing conventions** in the area you're modifying
4. **Create a feature branch** from `main` — use the naming convention: `feature/short-desc` or `fix/short-desc` (always branch from `main`)

### The golden rule
> **Match the existing codebase.** If the project uses a certain pattern, follow it — even if you'd do it differently on a fresh project. Consistency beats personal preference.

### Deployment awareness
> Every push to your feature branch creates a **Vercel preview deployment**. Use this to verify your work in a production-like environment throughout development — don't wait until the end.

### Mobile-first is the default
> 74% of traffic is mobile (50% iOS, 24% Android). Build for 390px first, then adapt for desktop. Every component and page must be reviewed on mobile before desktop. If mobile and desktop conflict, mobile wins. See `docs/branding/QUALITY_STANDARDS.md` for the full quality bar.

### D2C performance marketing mindset
> **Adopt this mindset when working on conversion-facing pages (landing pages, funnel, product pages, checkout flows).** This project serves a direct-to-consumer supplement brand selling through paid social channels. Every customer-facing page is a conversion surface. Approach implementation with the understanding that the customer arriving from a Meta ad has zero brand awareness, limited attention, and is comparing you to 10 other products they scrolled past. Clarity beats cleverness. Every piece of information shown must earn its place by either building trust, reducing uncertainty, or moving the customer closer to purchase. If it does none of those, remove it. Think in terms of cognitive load: fewer decisions, fewer numbers, fewer words. The customer should never have to work to understand what they are buying, what it costs, or why it matters. When in doubt, look at what high-performing D2C brands in the wellness and supplement space are doing (AG1, Overload, Huel, Athletic Greens) and adopt proven patterns rather than inventing new ones. See `docs/branding/QUALITY_STANDARDS.md` for specific reference sites and the visual patterns to emulate.

---

## Phase 2: Data layer first

IF the task involves fetching or modifying data, complete this before building UI.

### Shopify data (Storefront API)
1. **Check if a query already exists** for the data you need: `app/lib/shopifyQueries.ts`
2. **IF new query needed:**
   - Write the GraphQL query
   - Add TypeScript types for the response: `app/types/`
   - Create or update the data fetching function: `app/lib/shopify.ts`
   - Test the query independently before building UI
3. **IF modifying an existing query:**
   - Check everywhere the current query is used — don't break existing consumers
   - Extend rather than replace where possible

### Shopify Admin API (if needed)
- Only use for operations the Storefront API can't handle (inventory, order management, metafield writes)
- These should go through Next.js API routes, never called from the client
- Location: `app/api/`

### Loop Subscriptions
- Reference: `./04-shopify-commerce.md` for subscription patterns
- Subscription data fetching: `app/lib/loop.ts, app/hooks/useSubscriptions.ts`

### Other data sources
- Follow the established pattern for each integration
- Keep third-party API calls in dedicated service files, not scattered in components

---

## Phase 3: Server-side logic (if applicable)

### API routes / Route handlers
- Location: `app/api/`
- Follow the existing pattern for request validation, error handling, and response format
- Always validate and sanitise incoming data
- Use appropriate HTTP methods and status codes

### Server Actions
- Use for form submissions and mutations where appropriate
- Keep in dedicated files: `app/lib/actions/` (if applicable)
- Always include error handling and validation
- `'use server'` directive at the top of the file or function

### Middleware
- Location: `middleware.ts` (root level)
- Only modify if the task specifically requires it (redirects, auth, geo)
- Test middleware changes carefully — they affect EVERY request

---

## Phase 4: Frontend implementation

### Component decisions

```
Does this component need interactivity (state, event handlers, browser APIs)?
├── NO → Server Component (default, no directive needed)
│         Benefits: no JS sent to client, can await data directly
│
└── YES → Client Component ('use client' directive)
          Keep as small as possible — only the interactive parts
          Lift data fetching to a Server Component parent where possible
```

### Component creation checklist
1. **Check if a similar component already exists** — reuse or extend before creating new
2. **Follow the component structure from the design system:** `docs/branding/DESIGN_SYSTEM.md`
3. **File placement:**
   - Pages/routes: `app/`
   - Shared components: `app/components/`
   - Page-specific components: co-locate with the page (e.g. `app/account/subscriptions/utils.ts`)
   - Hooks: `app/hooks/`
   - Utils: `app/lib/`
4. **Styling:**
   - Use the established styling approach: Tailwind CSS + design tokens from `app/brand-base.css`
   - Reference design tokens/theme from: `app/brand-base.css`
   - DO NOT use magic numbers — use theme values, spacing scale, colour tokens
5. **Images:**
   - Always use `next/image` for optimised loading
   - Provide width and height (or use fill with a sized container)
   - Use appropriate `priority` for above-the-fold images
   - Shopify CDN images: use the `_[size]` URL transforms where possible

### Page implementation order
1. Define the route structure (page.tsx, layout.tsx, loading.tsx, error.tsx)
2. Build the data fetching layer (server-side)
3. Build shared/reusable components bottom-up
4. Compose the page from components
5. Add SEO meta tags (see Phase 5)
6. Handle loading, error, and empty states
7. Add interactivity where needed (Client Components)

---

## Phase 5: SEO and metadata

Every new page MUST include proper metadata. This is not optional.

```tsx
// In page.tsx or via generateMetadata
export const metadata: Metadata = {
  title: 'Page Title | [SITE_NAME]',
  description: 'Concise, keyword-relevant description under 160 characters',
  openGraph: {
    title: 'Page Title',
    description: 'Description for social sharing',
    images: [{ url: '/og-image.jpg' }],
  },
};

// For dynamic pages
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params.slug);
  return {
    title: `${data.title} | [SITE_NAME]`,
    description: data.description,
  };
}
```

### SEO checklist for every new page
- [ ] Title tag (unique, descriptive, includes target keyword)
- [ ] Meta description (unique, compelling, under 160 chars)
- [ ] Open Graph tags (title, description, image)
- [ ] Canonical URL (if needed to avoid duplicates)
- [ ] Structured data / JSON-LD (for product pages, articles, etc.)
- [ ] Heading hierarchy (single H1, logical H2/H3 structure)
- [ ] Image alt text on all images

---

## Phase 6: Verify on preview deployment

This is a key advantage of the Vercel workflow — use it.

1. **Push your branch** — Vercel will create a preview deployment automatically
2. **Check the preview URL** for:
   - Visual correctness on desktop and mobile
   - All data loading correctly (Shopify products, prices, images)
   - Interactivity working (add to cart, forms, navigation)
   - No console errors
   - Page speed / Core Web Vitals (use Vercel's built-in analytics or Lighthouse)
3. **Check the Vercel build logs** if anything seems wrong
4. **Share the preview URL** in the Jira ticket or with the team for feedback

---

## Phase 7: Cleanup before presenting

1. Remove any console.logs, debug code, or commented-out code
2. Ensure all new files follow the project's naming conventions
3. Check for TODO comments — resolve them or flag them explicitly
4. Run the linter/formatter: `npm run lint`
5. Verify no unused imports or variables
6. Check bundle size impact: `npm run build` (check build output for bundle sizes)
7. Proceed to code review: `./06-code-review.md`

---

## Decision shortcuts

| Situation | Action |
|-----------|--------|
| Server vs Client Component | Default to Server; only use Client for interactivity |
| Where to fetch Shopify data | Server Component or API route — never from client directly |
| New page vs modify existing | Check if the URL/route already exists first |
| Static vs dynamic page | Static (ISR) if data changes infrequently; dynamic if it changes per-request |
| Need new API route | Check if a Server Action would be simpler for the use case |
| Unsure about Shopify data model | Check `./04-shopify-commerce.md` |

---

## References
- Scoping: `./01-scoping-work.md`
- UX iteration (for refining existing pages): `./09-ux-iteration.md`
- Next.js development: `./03-nextjs-development.md`
- Shopify/commerce: `./04-shopify-commerce.md`
- Code review: `./06-code-review.md`
- Testing: `./07-testing-validation.md`
- Architecture docs: `docs/PROJECT_OVERVIEW.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
