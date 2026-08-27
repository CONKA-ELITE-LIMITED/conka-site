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
| **Feature doc** | Explains what a feature does, how it works, decisions made | `docs/features/` |
| **Architecture decision** | Records why a technical decision was made | `docs/decisions/` |
| **API documentation** | Endpoint reference for the backend | `docs/api/` |
| **Component documentation** | Usage guide for reusable UI components | `docs/components/` |
| **Setup/onboarding** | How to get the project running | `docs/` or project root |
| **Workflow/process** | How to do something (like this doc) | `docs/workflows/` |

IF the type doesn't fit the above → ask the user where it should live.

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

---

## References
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Architecture docs: `docs/MASTER_CONTEXT.md`
- Existing feature docs: `docs/features/`
