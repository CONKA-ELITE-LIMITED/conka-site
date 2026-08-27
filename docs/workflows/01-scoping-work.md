# Scoping Work (Website)

> **Purpose:** This document defines how to break down a feature request or task into a clear, actionable plan BEFORE writing any code. Follow this process every time you receive a new feature, bug fix, or refactor request for the website project.

---

## When to use this document

- You receive a new feature request or user story
- You're asked to build or modify something non-trivial (more than a single-file change)
- You're unsure about scope and need to clarify before proceeding

> **Not building something new?** If the task is "make this page better" rather than "build this new thing", use `./09-ux-iteration.md` instead. That workflow is designed for iterative refinement of existing pages (layout, information hierarchy, conversion optimisation).

---

## Step 1: Understand the request

Before anything else, make sure you understand what's being asked.

1. Read the request carefully — identify the **what** (desired outcome) and **why** (user/business goal)
2. Check for existing documentation:
   - Read `docs/features/PROJECT_OVERVIEW.md` for relevant system context
   - Search for related feature specs or PRDs if they exist
   - Check if similar functionality already exists in the codebase
3. List any **ambiguities or open questions** — things that aren't clear from the request
4. IF there are blocking ambiguities → ask the user before proceeding
5. IF the request is clear enough to scope → continue to Step 2

---

## Step 2: Identify affected areas

Map out what parts of the system this work touches.

### Frontend (Next.js)
- [ ] Which pages/routes are affected?
- [ ] Are new pages needed? What URL structure?
- [ ] Server Components or Client Components? (default to Server unless interactivity is needed)
- [ ] Does this require new shared/reusable components?
- [ ] Does this affect the layout hierarchy? (layouts, templates, loading/error boundaries)
- [ ] Are there SEO implications? (meta tags, structured data, OG images)
- [ ] Does this affect middleware? (redirects, auth checks, geo-routing)
- [ ] Reference: `docs/branding/DESIGN_SYSTEM.md` for component patterns

### Shopify / Commerce
- [ ] Does this involve product data? Which product fields / metafields?
- [ ] Does this touch the cart or checkout flow?
- [ ] Are there Shopify Storefront API queries to create or modify?
- [ ] Does this involve collections, product filtering, or search?
- [ ] Are there subscription-related requirements? (Loop Subscriptions)
- [ ] Does this require Shopify Admin API access? (inventory, orders, webhooks)
- [ ] Are there price/currency display considerations?

### Third-party services
- [ ] Loop Subscriptions — subscription creation, management, portal
- [ ] Analytics — new events to track?
- [ ] Email/marketing — Klaviyo integration?
- [ ] Payment — any checkout customisation?
- [ ] Other integrations: `[LIST_YOUR_OTHER_INTEGRATIONS]`

### Infrastructure / Deployment
- [ ] New environment variables needed?
- [ ] Changes to `next.config.js`?
- [ ] Edge runtime requirements? (middleware, edge functions)
- [ ] Impact on build time or bundle size?
- [ ] Vercel-specific configuration? (rewrites, redirects, cron)

---

## Step 3: Break into tasks

Create a numbered task list following this structure:

```
### Task breakdown

1. **[Data/API/UI] — Short description**
   - What: Specific implementation detail
   - Dependencies: What must be done first
   - Estimated complexity: Small / Medium / Large
   - Files likely affected: list of paths

2. **[API] — Add Storefront API query for product bundles**
   - What: GraphQL query to fetch bundle metafields and variant data
   - Dependencies: Metafield definitions in Shopify admin
   - Estimated complexity: Medium
   - Files likely affected: lib/shopify/queries.ts, lib/shopify/types.ts
```

### Task ordering rules
- Shopify data layer / API queries come first
- Shared components come before pages that use them
- Server-side logic (API routes, server actions) before client-side consumption
- SEO and meta tags come with the page, not as an afterthought
- Tests are scoped alongside their implementation, not as a separate phase

---

## Step 4: Identify risks and edge cases

For each task, briefly note:

- **Edge cases:** Out of stock, sold out variants, empty collections, unpublished products
- **Performance:** Image optimisation, query complexity, bundle size impact, Core Web Vitals
- **SEO:** Will this affect crawlability, indexation, or existing URLs? (redirects needed?)
- **Checkout impact:** Any change near the cart/checkout is HIGH RISK — scope carefully
- **Subscription impact:** Does this interact with Loop? What happens for subscription vs one-time customers?

---

## Step 5: Present the scope

Present the final scope to the user in this format:

```
## Scope: [Feature Name]

**Summary:** One-sentence description of what will be built.

**Tasks:**
1. [Task with complexity estimate]
2. [Task with complexity estimate]
...

**Open questions:** (if any remain)
- Question 1
- Question 2

**Risks/notes:**
- Notable risk or consideration

**Preview URL:** Will be available at [branch-name].vercel.app once work begins

**Ready to proceed?**
```

Wait for user confirmation before starting implementation. If the user says "just build it" without scoping, still do a quick mental pass through Steps 2-4 and note your assumptions.

---

## References
- Architecture docs: `docs/features/PROJECT_OVERVIEW.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Implementation workflow: `./02-implementation-workflow.md`
- UX iteration (for refining existing pages): `./09-ux-iteration.md`
- Shopify conventions: `./04-shopify-commerce.md`
