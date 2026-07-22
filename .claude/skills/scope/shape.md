# Shape, present, and document (Steps 4–6 of /scope)

## Step 4 — Shape

1. **Confirm appetite.** Hours, a day, a few days, a week? This constrains everything below.

2. **Map affected areas.** Skip any section that doesn't apply — don't pad.

   **Frontend (Next.js App Router)**
   - Which pages/routes are affected?
   - New pages? URL structure?
   - Server Components or Client Components?
   - New shared components or page-specific?
   - Layout / loading / error boundaries?
   - SEO: metadata, structured data, OG images?
   - Design language: Simple DTC or Clinical (`.brand-clinical`)? Both from `brand-base.css` — see DESIGN_SYSTEM.md §8.5.

   **Shopify / Commerce**
   - Product fields / metafields involved?
   - Cart or checkout flow touched?
   - Storefront API queries to create or modify?
   - Subscription-related (Loop)?
   - Price/currency display?

   **Analytics**
   - New events (Vercel Analytics, Meta Pixel, Triple Whale, GA)?
   - Server-side CAPI events?
   - UTM / attribution passthrough?

   **Infrastructure**
   - New env vars?
   - `next.config.ts` changes (redirects, rewrites)?
   - Build time or bundle size impact?

3. **Rabbit holes** — where scope could explode.
4. **No-gos** — what we're deliberately NOT doing.
5. **Phases** — each deployable via Vercel preview. Mark active vs Future.
6. **Break active phases into tasks:**

   ```
   1. **[Area] — Short description**
      - What: specific implementation detail
      - Dependencies: what must be done first
      - Complexity: Small / Medium / Large
      - Files likely affected: list of paths
   ```

   **Task ordering:**
   - Shopify data layer / API queries first
   - Shared components before pages that use them
   - Server-side (API routes, server actions) before client-side
   - SEO and metadata with the page, not after
   - Analytics alongside the feature, not bolted on

7. **Risks / edge cases** per task: empty states, mobile layout, Shopify API limits, checkout impact, analytics gaps.

---

## Step 5 — Present the scope

Use this template. Omit any section that doesn't apply (e.g. "Open Questions" if none).

```
## Scope: [Feature Name]

**Problem:** What we're solving and why it matters for conversion.
**Who it serves:** User segment + traffic source.
**Business impact:** How this connects to subscriber growth / AOV / retention.
**Appetite:** [Time budget]

**Approach:** 1–2 sentences on the solution direction.
**Design language:** Simple DTC | Clinical (`.brand-clinical`) — both from `brand-base.css`

### Phases
- **Phase 1: [name]** — [description] — ACTIVE
- **Phase 2: [name]** — [description] — ACTIVE
- **Phase 3: [name]** — [description] — Future

### Active Phase Task Breakdown

**Phase 1: [name]**
1. [Task with area, complexity, dependencies, files]
2. [Task with area, complexity, dependencies, files]

### Rabbit Holes
- [Where scope could explode and how to avoid it]

### No-Gos
- [What we're deliberately not doing and why]

### Risks
- [Notable risks or edge cases]

### Open Questions
- [Anything unresolved — omit if none]
```

**Wait for the user to approve.** Iterate until confirmed. Do not proceed to Step 6 or Step 7 until explicitly approved.

### Scale note

- **Scale A (trivial):** a compact single-phase version is enough. Keep the template but drop sections that don't apply. The whole scope may fit in 15 lines.
- **Scale B / C:** use the full template.

---

## Step 6 — Create plan document

For Scales B and C. For Scale A, skip unless the user asks.

Write to `docs/development/featurePlans/<feature-name>.md` (kebab-case).

Contents:
- Full approved scope (problem, approach, phases, tasks)
- Phase status table:

  ```
  | Phase | Description | Status |
  |-------|-------------|--------|
  | 1     | [name]      | Not Started |
  | 2     | [name]      | Future |
  ```

- Design language decision (Simple DTC or Clinical)
- Technical decisions and rationale
- Rabbit holes, no-gos, risks
- References to relevant docs and code
- Jira ticket references section (populated in Step 7)

Keep it concise but complete. **Never use em dashes** in the plan doc or any generated copy — use hyphens or rewrite.
