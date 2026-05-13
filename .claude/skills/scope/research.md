# Research protocol (Step 2 of /scope)

**Goal:** get a *digest* of relevant context into the main conversation without loading full docs into main context.

## Rule: delegate, do not Read directly

Spawn one `Explore` subagent with a focused prompt. The agent reads the docs, returns a ~300–400 word digest. Main context stays clean.

Do **not**:
- Read docs from the main conversation in this step
- Spawn multiple agents for one scope
- Ask the agent to "read all relevant docs" — name them explicitly

## The Explore-agent prompt (template)

Adapt the work-type section to the user's request. Delete bullets that don't apply.

```
I'm scoping the following piece of work: <user's request verbatim>

Produce a research digest under 400 words covering:

1. Master context — Read docs/MASTER_CONTEXT.md. Extract ONLY the facts relevant to this specific work. Do not summarize unrelated sections.

2. Work-type-specific docs (read only if relevant):
   - UI / new sections → docs/branding/DESIGN_SYSTEM.md
   - Copy / messaging → docs/branding/BRAND_VOICE.md
   - Landing or funnel page → docs/development/WEBSITE_SIMPLIFICATION_PLAN.md
   - Cart / checkout → docs/features/CART_LOGIC.md
   - Mobile layout → docs/branding/MOBILE_OPTIMIZATION.md
   Skip any that don't match this work.

3. Existing plans — list files in docs/development/featurePlans/ whose name suggests overlap. Read and summarize only overlapping ones.

4. Codebase areas likely affected — Grep/Glob for candidate files. Return paths only; do not read the files.

5. Jira context — use mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql with query:
      project = SCRUM AND text ~ "<relevant terms>" ORDER BY created DESC
   Return ticket key, summary, status (max 5). If a SCRUM-XXX key is in my request, fetch it via getJiraIssue and include the summary.

Return format (no preamble, no meta commentary):

**Constraints / decisions that affect scope**
- ...

**Related existing work**
- ...

**Files likely to change**
- path — why

**Open questions to resolve before shaping**
- ...

Under 400 words total.
```

## When to trim or skip

- **Scale A (trivial):** do not run this step. CLAUDE.md is already loaded. If one specific fact is needed, do a single targeted Grep inline.
- **`--continue` mode:** use `continue.md` instead — the research prompt is different.
- **User named a SCRUM-XXX key:** ensure the agent fetches it.

## After the digest arrives

- Restate the digest's key constraints back to the user in 2–4 lines before moving on. This confirms you absorbed it and gives them a chance to correct.
- If the digest surfaces something that invalidates the work (e.g. already done, conflicts with an in-flight plan), raise it immediately — do not proceed to Step 3.
