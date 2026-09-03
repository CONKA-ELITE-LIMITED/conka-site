# Creating Documentation

> **Purpose:** This document defines how to create and update project documentation. Follow this process whenever writing, editing, or adding new documentation to ensure consistency, clarity, and usefulness.

---

## When to use this document

- Creating documentation for a new feature
- Updating existing docs after a change
- Writing architecture decision records
- Documenting APIs, components, or workflows
- Asked to "document" anything in the project

---

## Step 1: Determine the documentation type

Identify which type of doc you're creating, as each has a different structure:

| Type | Purpose | Location |
|------|---------|----------|
| **Feature doc** (canonical) | What a system does, how it works, its decisions. Long-term memory | `docs/features/` |
| **Feature plan** | A piece of work in flight: phases, open questions, runbook. Working memory, disposable | `docs/development/featurePlans/` |
| **Architecture decision (feature-scoped)** | Why a technical decision was made about one system | Inside that feature doc's "Decisions and trade-offs" section |
| **Architecture decision (cross-cutting)** | A decision shaping the whole codebase, belonging to no single feature | `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md` |
| **API documentation** | Route reference for `app/api/*` | Inside the relevant feature doc. There is no `docs/api/` |
| **Component documentation** | Usage guide for a reusable component | Inside the relevant feature doc, or `docs/branding/DESIGN_SYSTEM.md` for a pattern. There is no `docs/components/` |
| **Commercial / money** | COGS, fees, margin, vendors | `docs/ops/` |
| **Setup / deployment** | Getting something running or deployed | `docs/deployment/` |
| **Workflow / process** | How to do something (like this doc) | `docs/workflows/` |
| **Changelog** | One line per shipped change | `docs/CHANGELOG.md` |
| **Deferred work** | Tech debt and anything knowingly left undone | `docs/TODO.md` |

IF the type doesn't fit the above → ask the user where it should live. Do **not** invent a
new top-level `docs/` directory; `docs/README.md` is the map and every directory in it exists.

---

## Step 2: Read existing docs first

Before writing:

1. Check what documentation already exists in the target directory
2. Read 2-3 existing docs to understand the **established tone, depth, and format**
3. Match the existing style — don't introduce a new doc format unless asked to

### Tone and style rules
- Write for a developer who is familiar with the tech stack but new to THIS project
- Be concise — prefer bullet points and tables over long paragraphs
- Use code examples liberally — show, don't just tell
- Avoid documenting things that are obvious from reading the code
- Focus on the **why** and the **gotchas** — the code shows the "what"
- No em dashes in prose

### One source of truth per fact

Every volatile fact stated twice is a future lie. The rot that actually bites here is restated
numbers and restated behaviour: prices, variant GIDs, shot counts, route lists, file
inventories, and "X is the live platform" claims that outlive the platform.

- **Never restate** a price, a count, a GID, or a status in a second doc. Point at the source
  (`see app/lib/offerData.ts`, `see docs/product/SKU_AND_SHOT_REFERENCE.md`) or use
  approximate language ("roughly 300 contracts").
- **File paths are fine.** Grep verifies a path; nothing verifies a count.
- **Prices have one home:** `app/lib/offerData.ts` for what we sell at, `docs/PRICING_HISTORY.md`
  for the audit log. No third place.
- If a fact must appear somewhere, it appears in **one** doc and everything else links to it.

### Describe the present, not the journey

A canonical doc says what is true now. If it needs "we used to do X" at all, that belongs in a
short note explaining a gotcha that still bites, never as narrative. The migration story lives
in the feature plan, and the feature plan gets archived (Step 7).

---

## Step 3: Structure by type

### Feature documentation template

```markdown
# [Feature Name]

## Overview
One to two sentences: what this feature does and why it exists.

## How it works
Brief explanation of the technical approach. Include:
- Which parts of the system are involved (frontend screens, backend endpoints, database)
- The flow: what happens when a user does X

## Key files
| File | Purpose |
|------|---------|
| `path/to/file` | Brief description |

## API endpoints (if applicable)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/example` | Creates a new example |

## Database
- Which database: Firestore / Cloud SQL
- Key collections/tables and their purpose

## Decisions and trade-offs
- Why was [approach] chosen over [alternative]?
- Known limitations or technical debt

## Edge cases and error handling
- What happens when [scenario]
- How errors are surfaced to the user
```

### Architecture decision template

```markdown
# [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Accepted / Superseded by [link]

## Context
What situation or problem prompted this decision?

## Decision
What was decided and at a high level, how does it work?

## Alternatives considered
| Option | Pros | Cons |
|--------|------|------|
| Chosen approach | ... | ... |
| Alternative A | ... | ... |

## Consequences
- What are the implications of this decision?
- What new constraints does this introduce?
```

### API documentation template

```markdown
# [Endpoint Group Name]

Base path: `/api/v1/[resource]`

## [METHOD] /path

**Description:** What this endpoint does.

**Authentication:** Required / Public

**Request:**
```json
{
  "field": "type — description"
}
```

**Response (200):**
```json
{
  "field": "example value"
}
```

**Errors:**
| Status | Reason |
|--------|--------|
| 400 | Validation details |
| 404 | Resource not found |
```

### Component documentation template

```markdown
# [Component Name]

## Purpose
What this component does and when to use it.

## Usage
```jsx
import { ComponentName } from '[path]';

<ComponentName
  requiredProp="value"
  optionalProp={123}
/>
```

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | Yes | — | Description |

## Variants / Examples
Show different configurations with code snippets.

## Notes
- Gotchas, accessibility considerations, platform differences
```

### Changelog (`docs/CHANGELOG.md`)

One line per shipped change, newest first, inserted **directly below the
`<!-- changelog:newest -->` marker** so the file never needs re-sorting.

```markdown
- **YYYY-MM-DD** | What changed and why it matters, in one scannable line
```

Write for "future me debugging at 2am, wondering what changed the week the numbers moved".
An entry is a sentence a person can scan, not a commit message and not a release note.

Good: `Deleted our order-history and account-details pages: Skio's portal renders its own`
Too granular: `Removed AccountSubNav.tsx and updated three imports`
Too vague: `Account cleanup`

Skip entirely: internal refactors with no behaviour change, dependency bumps, style tweaks.
A `docs:` commit does not get a changelog line. When the change is user-visible on the site,
consider `/notion-flag` as well, so a later dip or spike can be traced to it.

---

## Step 4: Write the documentation

1. Use the appropriate template from Step 3
2. Fill in all sections — if a section genuinely doesn't apply, remove it rather than leaving it empty
3. Include **real file paths** from the project, not placeholder paths
4. Include **real code examples** pulled from or based on the actual implementation
5. Cross-reference related docs where relevant using relative links

---

## Step 5: Place and link the documentation

1. Save the doc in the correct directory (see Step 1 table)
2. Use consistent naming: `kebab-case.md` (e.g., `user-authentication.md`)
3. IF a table of contents or index file exists → update it to include the new doc
4. IF the doc references other features → add cross-links in both directions
5. IF the doc relates to code changes → mention the doc path in your commit/PR description

---

## Step 6: Verify quality

Before finalising, check:

- [ ] Does this doc answer "why" and not just "what"?
- [ ] Would a new developer understand this without asking follow-up questions?
- [ ] Are all file paths and code examples accurate and current?
- [ ] Does the format match other docs in the same directory?
- [ ] Are there any sections that just restate what the code obviously does? (Remove them)
- [ ] Is there anything that will become stale quickly? (Flag it or restructure to avoid)
- [ ] Does it restate a price, count, GID or status that lives somewhere else? (Link instead)

---

## Step 7: Retire the feature plan

Feature plans (`docs/development/featurePlans/`) are **working memory**; canonical docs
(`docs/features/`) are **long-term memory**. A plan is disposable by design, but only once the
truth it holds has a permanent home.

This step exists because plans here have repeatedly become the *only* record of a shipped
system, which makes them undeletable and turns `featurePlans/` into a graveyard nobody trusts.
`skio-migration.md` was the clearest case: `CLAUDE.md` pointed at a plan document as the
canonical reference for a live commercial system.

### Plan lifecycle

| State | Meaning | What to do |
|---|---|---|
| **Active** | Phases in flight | The plan is the working doc. Keep the status table honest. A wrong status header is the most common rot. Do not consolidate mid-flight. |
| **Shipped-with-residue** | Everything shipped except a named remnant | Plan stays. The header must name the remnant exactly ("Delivered except Phase 5: legacy protocol retirement"). |
| **Done or dead** | No live phases: delivered, abandoned, or superseded | **Retire it now** (below). |

### Retirement

1. **Consolidate, by editing rather than creating.** Fold whatever living truth the plan
   uniquely holds into the *existing* canonical doc for that system. Create a net-new doc in
   `docs/features/` only if the shipped system has no home at all AND someone debugging it
   would grep and find nothing. If the CHANGELOG line is a sufficient record, that is enough:
   write no doc.
2. **Split living from historical.** Build reference, gotchas and decisions are living and move
   to canonical. Status tables, vendor email threads, blockers, cutover runbooks and
   order-of-operations are historical and stay in the plan being archived.
3. **Banner the plan** at the very top:
   ```markdown
   > **ARCHIVED (YYYY-MM-DD).** Delivered / Abandoned / Superseded.
   > Canonical doc: `docs/features/<x>.md`. Kept for the reasoning, not for current behaviour.
   ```
4. **Move it** to `docs/development/featurePlans/archive/`.
5. **Repoint every inbound link**, especially `CLAUDE.md` and `docs/README.md`. An archived doc
   must never be what a table sends a reader to. Grep for the filename before finishing.

The same pattern applies to loose working docs in `docs/development/` (one-off audits, context
dumps, handoffs): once the moment passes, banner and move to the archive beside them.

### Triggers, so this actually happens

- `/ship` Step 8 and `/implement`'s plan-update step both ask: *did this work close the plan's
  last active phase?* If yes, retire it in the same run.
- Any session that catches a doc lying either fixes it on the spot (if it is one edit) or logs
  it in `docs/TODO.md`. There is no scheduled review ritual. Opportunistic correction plus this
  retirement step is the whole system.

---

## References
- Docs map: `docs/README.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Architecture and roadmap: `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md`
- Existing feature docs: `docs/features/`
