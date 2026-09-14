# Jira Workflow

> **Purpose:** This document defines how to interact with Jira throughout the development lifecycle — creating tickets, writing descriptions and acceptance criteria, updating ticket status, and adding comments. Follow this process to keep Jira in sync with actual work.

---

## When to use this document

- Creating new tickets from a feature request or scoping exercise
- Picking up a ticket to start work
- Updating ticket status as work progresses
- Writing or improving ticket descriptions and acceptance criteria
- Adding implementation notes or blockers to tickets
- Breaking a ticket into subtasks

---

## Board statuses and when to transition

```
To Do → In Progress → In Review → Ready to Deploy → Done
                 ↕
              Blocked
```

| Status | Meaning | When to move here |
|--------|---------|-------------------|
| **To Do** | Scoped, ready to be picked up | Ticket is created with full description and AC |
| **In Progress** | Actively being worked on | You start writing code for this ticket |
| **Blocked** | Cannot continue — waiting on something | A dependency, question, or external factor is preventing progress. ALWAYS add a comment explaining what the blocker is |
| **In Review** | Code is complete, needs review | Implementation is finished, code review checklist (doc 06) has been self-completed |
| **Ready to Deploy** | Reviewed and approved, waiting for deployment | Review is passed, no changes needed, just waiting for a deploy cycle |
| **Done** | Deployed and verified | Live in production and confirmed working |

### Transition rules
- **Never skip statuses** — move through them in order (exceptions: Blocked, which can be entered/exited from In Progress; and ops or non-code work with nothing to review, which can go straight from In Progress to Done)
- **Always add a comment when moving to Blocked** — state what's blocking and what's needed to unblock
- **Moving to In Review means the work is COMPLETE** — not "mostly done" or "needs a few tweaks"
- **Moving back from In Review to In Progress** — means review found issues that need fixing; add a comment noting what needs to change

---

## Creating tickets

### When to create tickets
- After scoping work (see `./01-scoping-work.md`) — each task from the scope becomes a ticket
- When a bug is reported or discovered
- When technical debt or improvements are identified during other work

### Issue type selection

| Type | Use when |
|------|----------|
| **Story** | A user-facing feature or behaviour change. Framed as "As a user, I want..." |
| **Task** | Technical work that isn't directly user-facing (refactoring, infrastructure, documentation, setup) |
| **Bug** | Something that's broken — existing functionality not working as expected |
| **Subtask** | A smaller piece of a Story or Task. Use when a ticket needs to be broken into trackable parts |

### Decision logic
```
Is this fixing something broken?
  → YES → Bug

Is this a user-facing change?
  → YES → Story

Is this technical/internal work?
  → YES → Task

Is this a smaller piece of an existing ticket?
  → YES → Subtask (under the parent ticket)
```

---

## Writing ticket descriptions

Every ticket MUST have a description. The format varies by type:

### Story description template

```markdown
## Summary
[One sentence: what the user should be able to do after this is complete]

## Context
[Why this is needed — the user problem or business goal. Keep to 2-3 sentences max]

## Requirements
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## Acceptance criteria
- [ ] [Given/When/Then or clear testable statement]
- [ ] [Given/When/Then or clear testable statement]
- [ ] [Given/When/Then or clear testable statement]

## Design / UI notes
[Reference to designs, style guide, or describe expected UI behaviour]
[Link to figma/mockup if available]

## Technical notes (if known)
[Any known technical considerations, affected areas, or dependencies]

## Out of scope
[Explicitly list anything that might be assumed but is NOT part of this ticket]
```

### Task description template

```markdown
## Summary
[What needs to be done and why]

## Details
[Specific technical details of the work required]

## Acceptance criteria
- [ ] [Testable completion criteria]
- [ ] [Testable completion criteria]

## References
[Links to relevant docs, PRs, or related tickets]
```

### Bug description template

```markdown
## Bug summary
[One sentence: what's broken]

## Steps to reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected behaviour
[What should happen]

## Actual behaviour
[What actually happens]

## Environment
- Platform: [iOS / Android / Both]
- App version: [if known]
- Reproducibility: [Always / Sometimes / Rare]

## Screenshots / logs
[Attach or describe any error messages, screenshots, or relevant logs]

## Acceptance criteria
- [ ] [The specific bug is fixed]
- [ ] [No regression in related functionality]
```

---

## Writing good acceptance criteria

Acceptance criteria are the most important part of a ticket. They define "done."

### Rules
1. **Every criterion must be independently testable** — you can verify it with a yes/no
2. **Be specific, not vague** — "works correctly" is not an AC; "returns 200 with user object containing name and email" is
3. **Include edge cases** — empty states, error states, boundary conditions
4. **Include both frontend and backend criteria** when the ticket spans both

### Good vs bad examples

| Bad | Good |
|-----|------|
| User can log in | Given valid credentials, when the user taps Login, then they are navigated to the Home screen within 3 seconds |
| API works | POST /api/v1/items returns 201 with the created item, including a generated ID and created_at timestamp |
| Handles errors | When the API returns 500, the screen shows the error banner with a "Try again" button that retries the request |
| Looks good on mobile | Component matches the design spec, text truncates with ellipsis at 2 lines, and touch target is minimum 44x44pt |

### Minimum AC per ticket type
- **Story:** At least 3 ACs covering happy path, one error case, and one edge case
- **Task:** At least 2 ACs covering the deliverable and any verification
- **Bug:** At least 2 ACs — the fix itself, and no regression

---

## Updating tickets during work

### The ticket is the home of live state

Every ticket description starts with a `## Current state` block: status, done, open (each with an owner), next action, branch/PR. It is **rewritten in place**, never appended to, so anyone opening the ticket sees where the work actually is without reading the comment thread. Comments are the history.

Status never lives in the repo. Plan docs list ticket keys, not their status; `docs/TODO.md` entries and canonical docs link the key instead of restating counts, dates or vendor state.

The block is maintained by the shared `/track` skill (`~/.claude/skills/track/SKILL.md`):
- `/track pause` when stopping for the day, getting blocked, or handing off
- `/track done` when the work is complete; `/ship` and `/implement` call it at the end, and it also updates canonical docs and retires the feature plan

`/scope` creates the block when it creates the ticket.

### When starting work (To Do → In Progress)
1. Transition the ticket to **In Progress**
2. Read the full description and AC
3. IF the description or AC is unclear or incomplete → improve it before coding, or ask for clarification

### During implementation
Add comments to the ticket for:
- **Decisions made** that aren't captured in the description ("Decided to use Firestore instead of Cloud SQL for this because...")
- **Scope discoveries** ("Found that this also requires updating the notification service")
- **Partial progress on long tasks** ("Backend endpoints complete, starting frontend")

### When blocked (In Progress → Blocked)
1. Transition to **Blocked**
2. **MUST add a comment** explaining:
   - What is blocking progress
   - What is needed to unblock (a decision, another ticket, external dependency)
   - Any workaround being considered

Comment format:
```
**Blocked:** [What's blocking]
**Needs:** [What would unblock this]
**Workaround:** [If any, or "None"]
```

### When submitting for review (In Progress → In Review)
1. Complete the self-review checklist from `./06-code-review.md`
2. Transition to **In Review**
3. Add a comment summarising what was done:

Comment format:
```
**Implementation summary:**
- [Key thing built/changed 1]
- [Key thing built/changed 2]

**Files changed:** [list key files or areas]

**Testing done:**
- [What was tested and how]

**Notes for reviewer:**
- [Anything the reviewer should know — gotchas, decisions, trade-offs]
```

### When review passes (In Review → Ready to Deploy or Done)
- IF there's a separate deploy step → move to **Ready to Deploy**
- IF it can go straight to production → move to **Done**
- Add a brief comment confirming completion if there's anything noteworthy

### When review finds issues (In Review → In Progress)
1. Move back to **In Progress**
2. Add a comment noting what needs to change
3. When fixes are done, move back to **In Review** with a comment on what was addressed

---

## Breaking tickets into subtasks

### When to create subtasks
- The parent ticket involves 3+ distinct pieces of work
- Different parts could be reviewed independently
- You want to track progress on a large ticket more granularly

### Subtask conventions
- Subtask titles should be prefixed with the area: `[Backend] Create user endpoint`, `[Frontend] Build profile screen`
- Each subtask needs its own AC (not just "part of parent")
- Parent ticket should only move to In Review when ALL subtasks are complete
- Subtask descriptions can be shorter but must still have clear AC

### Subtask ordering
Follow the same ordering from `./01-scoping-work.md`:
1. Database / schema changes
2. Backend API endpoints
3. Shared frontend components
4. Screen-level frontend work
5. Integration and testing

---

## Linking tickets

Link related tickets when:
- One ticket **blocks** another → use "Blocks" link type
- Tickets are **related** but independent → use "Relates to" link type
- A ticket **duplicates** another → use "Duplicates" link type
- A bug was **caused by** a story/task → use "Caused by" or "Relates to"

---

## Quick reference: common actions

| I want to... | Do this |
|---------------|---------|
| Start working on a ticket | Read description → transition to In Progress |
| Stop for the day / hand off | `/track pause` → Current state rewritten |
| Wrap up completed work | `/track done` → Current state, transition, docs, plan retirement |
| Record a blocker | Transition to Blocked → add comment with blocker details |
| Finish implementation | Self-review (doc 06) → transition to In Review → add summary comment |
| Create tickets from a scope | Use scoping doc (01) output → create one ticket per task with full description and AC |
| Break a big ticket down | Create subtasks under parent → each with own AC → work through in order |
| Note a decision during work | Add comment to ticket explaining what was decided and why |
| Flag something for follow-up | Add comment with "FOLLOW-UP:" prefix, or create a new linked ticket |

---

## References
- Scoping work: `./01-scoping-work.md`
- Implementation workflow: `./02-implementation-workflow.md`
- Code review: `./06-code-review.md`
- Testing: `./07-testing-validation.md`
