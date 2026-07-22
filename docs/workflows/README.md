# Workflow Documentation (Website)

> **What this is:** A set of process documents that define how work should be done in this Next.js / Shopify website project. These are designed to be read by Claude Code (or any AI assistant) to ensure consistent, high-quality output.

---

## How to use these docs

### With Claude Code

Reference a workflow doc at the start of a task:

```
Read docs/workflows/01-scoping-work.md, then scope out the following feature: [description]
```

```
Follow docs/workflows/02-implementation-workflow.md to build: [description]
```

Chain them for full workflows:

```
Read docs/workflows/01-scoping-work.md to scope this feature, then when I approve, 
follow docs/workflows/02-implementation-workflow.md to build it, referencing 
docs/workflows/03-nextjs-development.md and docs/workflows/04-shopify-commerce.md 
for conventions, and docs/workflows/06-code-review.md to review before presenting.
```

### In CLAUDE.md

Add to your project's `CLAUDE.md` for automatic context:

```markdown
## Project workflows
When scoping work, follow: docs/workflows/01-scoping-work.md
When implementing features, follow: docs/workflows/02-implementation-workflow.md
When building pages or components, also reference: docs/workflows/03-nextjs-development.md
When working with Shopify, cart, checkout, or subscriptions: docs/workflows/04-shopify-commerce.md
When creating documentation, follow: docs/workflows/05-creating-documentation.md
When reviewing code, follow: docs/workflows/06-code-review.md
When testing, follow: docs/workflows/07-testing-validation.md
When creating or updating Jira tickets, follow: docs/workflows/08-jira-workflow.md
```

---

## Document index

| # | Document | Use when... |
|---|----------|-------------|
| 01 | [Scoping Work](./01-scoping-work.md) | Breaking down a feature request before coding |
| 02 | [Implementation Workflow](./02-implementation-workflow.md) | Building a feature end-to-end |
| 03 | [Next.js Development](./03-nextjs-development.md) | Any page, component, routing, or rendering work |
| 04 | [Shopify & Commerce](./04-shopify-commerce.md) | Products, cart, checkout, subscriptions, pricing |
| 05 | [Creating Documentation](./05-creating-documentation.md) | Writing or updating project docs |
| 06 | [Code Review](./06-code-review.md) | Reviewing code before presenting |
| 07 | [Testing & Validation](./07-testing-validation.md) | Verifying that code works |
| 08 | [Jira Workflow](./08-jira-workflow.md) | Creating tickets, writing AC, updating status |
| 09 | [UX Iteration](./09-ux-iteration.md) | Refining existing pages for conversion, layout, or information hierarchy |

### Typical workflow chains

**New feature (full):** 08 (create tickets) → 01 → 02 → (03 + 04) → 06 → 07 → 08 (update status)
**Bug fix:** 08 (read ticket) → 02 → (03 and/or 04) → 06 → 07 → 08 (update status)
**Scoping only:** 01 → 08 (create tickets from scope)
**Shopify/commerce work:** 04 (read first) → 02 → 03 → 06 → 07
**New page (non-commerce):** 03 → 02 → 06 → 07
**UX iteration / conversion work:** 09 → 06 → 07
**Documentation task:** 05
**Code review only:** 06

---

## Key differences from the app project

If you also work on the mobile app, here's what's different:

| Area | App (Expo/RN) | Website (Next.js) |
|------|---------------|-------------------|
| **Rendering** | Client-side only | Server Components by default |
| **Backend** | Separate Flask API on EC2 | Shopify APIs + Next.js API routes |
| **Database** | Firestore + Cloud SQL | Shopify (products, orders) + metafields |
| **Deployment** | `[Your app deploy process]` | Git push → Vercel auto-deploy |
| **Preview/staging** | `[Your app staging process]` | Vercel preview deployments per branch |
| **Styling** | StyleSheet.create | Tailwind CSS + design tokens (`app/brand-base.css`) |
| **State** | `[Your RN state approach]` | Server-first, minimal client state |
| **SEO** | N/A (native app) | Critical — every page needs metadata |
| **Commerce** | N/A (or limited) | Shopify Storefront API, Loop Subscriptions |

---

## Setup: customising for your project

These docs contain placeholder paths marked as `[PATH_TO_...]` or `[YOUR_...]`. 

1. **Find all placeholders:**
   ```bash
   grep -rn '\[PATH_TO_\|YOUR_\|\[e\.g\.' docs/workflows/
   ```

2. **Replace with your actual paths and conventions.** Key ones:
   - `docs/PROJECT_OVERVIEW.md` — existing architecture docs
   - `docs/branding/DESIGN_SYSTEM.md` — design system
   - `app/lib/shopify.ts` — Shopify client and helpers
   - `app/lib/shopifyQueries.ts` — GraphQL query files
   - `app/types/` — TypeScript types for Shopify data
   - `app/context/CartContext.tsx` — cart operations (add, remove, etc.)
   - `npm run lint` — linter command
   - `feature/short-desc or fix/short-desc` — branch naming pattern

3. **Fill in the metafields table** in `04-shopify-commerce.md` with your actual metafield definitions.

4. **Fill in the "Common gotchas" sections** over time.

### Auto-fill prompt for Claude Code

```
Read all files in docs/workflows/. Then explore the project structure and codebase 
to find the actual paths and conventions used. Replace all [PATH_TO_...] and [YOUR_...] 
placeholders with the real values from this project. For any placeholder you can't 
determine from the codebase, leave it as-is and list it so I can fill it in manually.
```

---

## Maintaining these docs

- **Update when conventions change** — especially Shopify query patterns, as these evolve
- **Add to "Common gotchas"** — whenever you hit a recurring issue
- **Update metafields table** — whenever new metafields are added in Shopify
- **Review after Next.js upgrades** — App Router conventions may change
