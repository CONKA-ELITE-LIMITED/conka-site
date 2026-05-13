# Continue mode (`--continue <plan-name>`)

Used when picking up an existing plan. The flow replaces Steps 1–7 of the default /scope process.

## Step 1 — Read the existing plan

1. Read `docs/development/featurePlans/<plan-name>.md` directly (this is the one doc you *do* need in main context — it's the plan you're continuing).

2. Spawn a single `Explore` subagent to gather surrounding state. Prompt template:

   ```
   Continuing an existing plan: <plan-name>. Gather and return under 300 words:

   1. Strategic changes since plan creation — Read CLAUDE.md and list any shifts that affect this plan (new priorities, deprecated approaches, changed stack).

   2. Jira state — via mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql:
        project = SCRUM AND text ~ "<feature name>" ORDER BY created DESC
      List ticket keys, summaries, statuses (max 10).

   3. Codebase state — for each file the plan said would change, Grep/Glob to confirm it exists and note obvious shifts (renamed, deleted, or major rewrite signs). Do not read full file contents.

   Return format:
   - **Strategic shifts** (bullets)
   - **Ticket status** (key — summary — status)
   - **Codebase deltas** (path — observation)

   Bullet lists only. No preamble.
   ```

## Step 2 — Assess current state

Present this to the user:

```
## Continuing: [Feature Name]

**Completed phases:**
- Phase 1: [name] — Done (SCRUM-XXX)

**Remaining phases:**
- Phase 2: [name] — [description]

**What changed during implementation:**
- [Shifts, discoveries, or learnings from the digest that affect remaining work]

**Recommendation:**
- [Which phases to activate next, and whether reshaping is needed]
```

**Wait for the user to confirm.**

## Step 3 — Reshape if needed

If reshaping:

1. Revisit appetite for remaining work.
2. Reshape phase descriptions and tasks based on what was learned.
3. Update no-gos if scope shifted.
4. Present updated scope for newly active phases using the template in `shape.md`.

**Wait for approval.**

## Step 4 — Update plan + create tickets

- Mark completed phases as Done in the plan doc (update the phase status table).
- Add detailed task breakdowns for newly active phases.
- Create Jira tickets for **newly active phases only** — follow `jira.md`.
- Update the plan's Jira ticket references section with new keys.

## Principle

Implementation teaches you things. When continuing a plan, expect that earlier phases changed the picture. Actively ask what was learned. The plan is a living document, not a contract — if the recommendation is "stop, this isn't worth finishing," that's a valid output.
