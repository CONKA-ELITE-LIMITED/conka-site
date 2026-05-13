# Skill Architecture Guide -- How CONKA's Claude Code Skills Work

> A complete reference for how the CONKA project structures its `.claude/skills/` directory. Designed so another project (e.g. the website repo) can copy the patterns wholesale, then specialise them to its own domain.

The goal of these skills is the same one Anthropic optimised for when designing Claude Code: **make the model focused, predictable, and cheap to run**. Every choice in this guide is in service of those three properties.

---

## 1. The Mental Model

A skill is **a procedure with a personality**. It is not a tool, not a function, not documentation. It is a structured prompt the user invokes with `/skill-name`, which tells the model:

1. **Who to be** (mentality / persona)
2. **What to do** (numbered process)
3. **What to output** (response templates)
4. **What to skip** (when to bail out, when the skill is not needed)
5. **What guardrails apply** (key principles, no-gos)

The skill is the *opinionated wrapper* around an underlying engineering activity (scoping, reviewing, debugging, scripting, etc.). It exists because the model, without the wrapper, will default to generic behaviour. With the wrapper, it behaves like a senior engineer at your company who already knows your codebase.

---

## 2. Directory Layout

```
.claude/
  settings.local.json         # Permissions, env, hooks
  skills/
    <skill-name>/
      SKILL.md                # The skill itself (always named SKILL.md)
      scripts/                # Optional helper scripts (Python/bash)
        <preflight>.py
```

**Conventions in the CONKA repo:**

- Skill folder names are kebab-case verbs or short nouns: `scope`, `implement`, `review`, `test`, `bug`, `script`, `commit`, `resume`, `think`, `prepare-release`.
- The SKILL.md filename is fixed. The folder name is what becomes the slash command (`/scope`, `/implement`, etc.).
- Helper scripts live next to the skill, not in a shared `bin/`. Each script is loaded only by the skill that needs it.

---

## 3. Anatomy of a SKILL.md

Every SKILL.md follows this skeleton. Sections marked with [optional] only appear when relevant.

```markdown
---
name: <skill-name>
description: <one-line, what it does + when to use it. This is the ONLY thing
             the model sees in the skills index, so write it as a trigger.>
argument-hint: <text shown next to the slash command in autocomplete>
allowed-tools: <comma-separated tool allowlist — restricts what the skill can use>
---

# /<skill-name> -- <Tagline>

<2-3 sentence framing of the role the model should adopt.>

---

## Quick Reference

```
/<skill-name> <example invocation>            # Comment on when to use
/<skill-name> --flag <example>                # Show common flags
```

## When to skip this skill                    [optional but recommended]

<Explicit instructions on when NOT to load this skill.
 e.g. "If files are already in context from a recent build, just say
 'review what you wrote' instead of /review.">

## Mentality                                   [optional, but powerful]

<Named frameworks (Kent Beck, Cagan, Shape Up, Stripe, Netflix...) and
 the lens they bring. This primes the model with shared vocabulary.>

## Modes                                       [optional, for multi-mode skills]

<Each flag = a mode. Describe what each mode skips/adds.>

## Input

<What arguments mean, how to parse them.>

## Process

### Step 0: Continuity check                   [optional but recommended]
<Are we continuing in-session work? If so, skip the heavy lifting.>

### Step 1: Gather context (silent)
<Reads, greps, MCP calls. Marked "silent" so the model knows not to narrate.>

### Step 2..N: <discrete actions>
<Numbered. Each step has a clear input and a clear output.>

### Step N: Present results
<Exact response template the model fills in.>

## <Domain>-specific patterns                  [optional, project-specific knowledge]

<Tables of common pitfalls and how to spot them.>

## Key Principles

<5-10 bullets summarising the rules. Repeated here so they survive the
 model "forgetting" mid-execution.>

## References

<Links to deeper docs. Keeps the skill body short.>
```

---

## 4. The Frontmatter -- Why Each Field Matters

```yaml
---
name: bug
description: Investigate, diagnose, and fix bugs with a detective-first mindset. Reproduces the issue, finds root cause (not just symptoms), applies minimal fix, verifies resolution, checks blast radius. Use when something is broken.
argument-hint: [SCRUM-XXX | description of the bug]
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue
---
```

| Field | Why it matters |
|---|---|
| `name` | The slash-command name. Must match the folder. |
| `description` | This is the **only** text the model sees in the skills index when deciding what is relevant. Write it as a trigger: "do X. Use when Y." First clause = what, second clause = when. |
| `argument-hint` | Autocomplete affordance. Shows the user the shape of expected input. |
| `allowed-tools` | The skill's tool allowlist. Restricting this is a token + safety win: the model won't load schemas for tools the skill doesn't need, and can't accidentally do things outside its remit. |

**Description-writing rule:** if a model in another session would not know *when* to load your skill from the description alone, the description is wrong. Add the trigger phrase ("Use when...").

---

## 5. The Patterns That Make Skills Token-Optimised

These are the most important transferable patterns. The website project should adopt all of them.

### 5.1 "When to skip this skill"

Every non-trivial skill in CONKA has a paragraph telling the model when **not** to invoke it.

```markdown
## When to skip this skill

If you're already mid-session on this feature (plan read, files in context,
previous phase just completed), do not invoke /implement. Give a direct
instruction instead -- "implement Phase 4" or "build the backend service"
-- and I'll execute without loading this skill.
```

**Why this saves tokens:** invoking a skill re-loads a 300-500 line SKILL.md into context every time. If the work is a continuation, the skill body is redundant. The user has already paid the framing cost; loading again is pure waste.

### 5.2 Step 0: Continuity check

Inside the skill, the first step before any work is "have we already done this in this session?"

```markdown
### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:** the plan doc was already read, relevant files
are already in context, a previous phase just completed.

If continuing: skip the Jira fetch, feature plan read, existing code reads,
and coding standards reads if all are already in context. Jump directly to
the build phase.

If starting fresh: run all steps below.
```

**Why this saves tokens:** prevents 5-10 redundant file reads when the model is already oriented.

### 5.3 Pre-flight helper scripts

Instead of having the model run 4-6 separate `git`, `find`, and `grep` commands, each skill that needs a structured snapshot of project state has a Python script that returns it as JSON.

Example: `.claude/skills/scope/scripts/preflight.py`

```python
def main():
    repo_root = Path(__file__).resolve().parents[4]
    search_term = " ".join(sys.argv[1:])

    plans = get_feature_plans(repo_root, search_term)
    git = get_git_state(repo_root)

    result = {
        "feature_plans": plans,
        "git": git,
        "epics": EPICS,
        "note": "related plans should be read before creating a new plan doc",
    }
    if plans["related"]:
        result["warning"] = f"Found related plan(s): {plans['related']}"
    print(json.dumps(result, indent=2))
```

The skill body then says:

```markdown
Run the pre-flight script to get a structured snapshot of project state:

    python3 .claude/skills/scope/scripts/preflight.py "<first 2-3 words>"

Use the output to:
- Check `related` -- if a related plan exists, read it before writing a new one
- Get the `epics` reference table for ticket creation (already in output)
- Confirm git state before creating the plan doc
```

**Why this saves tokens:** one tool call instead of six. The JSON output is dense and structured -- the model can extract exactly what it needs without parsing prose output from multiple commands. Other examples in the repo: `think/scripts/portfolio_snapshot.py`, `review/scripts/diff_analysis.py`, `implement/scripts/env_check.py`.

### 5.4 "(silent -- do not output this step)"

Marking research steps as silent prevents the model from narrating its internal investigation to the user.

```markdown
### Step 1: Gather Context (silent -- do not output this step)

Before responding, research thoroughly:
1. Read docs/app/MASTER_CONTEXT.md for business context and North Star.
2. Search docs/development/featurePlans/ for existing plans...
3. ...
```

**Why this saves tokens:** the model's output to the user is much shorter -- no "let me check X, now let me check Y" commentary -- which means cheaper response and a cleaner user experience.

### 5.5 Flags / modes for scope reduction

Almost every skill has `--lite`, `--no-pushback`, `--no-checkpoints`, `--light`, `--deep`, `--continue`, etc. Each flag is a deliberate cost-reduction lever for the common case.

```markdown
### New Scope -- Lite Mode (`--lite`)
Runs only: pre-flight + shape + document + ticket.
Skips Steps 1 and 2 (context gathering and challenge).
Use when you already understand the problem... Saves ~60% of scope cost.
```

**Why this saves tokens:** explicitly trades off thoroughness for cost. The user opts into the reduction; the skill enforces it.

### 5.6 Allowed-tools allowlist

```yaml
allowed-tools: Bash, Read, Edit
```

The `/commit` skill needs three tools. Listing them prevents the harness from loading schemas for the other ~40 tools the agent has access to.

**Why this saves tokens:** tool schemas are loaded into context per tool. Restricting to the necessary set is a free win on every skill invocation.

### 5.7 Tables instead of prose

Pattern reference is in tables, not paragraphs.

```markdown
| Pattern | Symptom | Likely Cause | Fix Approach |
|---------|---------|--------------|--------------|
| Blank screen | Component renders nothing | Missing data state, null in render path | Add null/empty check |
| Stale data | UI shows old values after action | Missing Redux dispatch, stale closure | Check deps arrays |
```

**Why this saves tokens:** the model parses dense tables faster than prose. Same information in fewer tokens. Also forces the author to be concrete (no waffly explanations).

### 5.8 Response templates as fenced blocks

Each skill provides the exact response format it wants the model to produce, as a code block.

```markdown
**Present findings using this format:**

\`\`\`
## Code Review: [area/feature]

**Risk level:** Critical | Standard | Low

### Critical (must fix before shipping)
- **[Issue]** -- [File:line] [What's wrong] [Suggested fix]

### Verdict
**LGTM** -- Ready to ship
\`\`\`
```

**Why this saves tokens:** the model emits the right shape on the first try. No re-formatting passes. The user gets predictable output across runs.

### 5.9 References section instead of inlining

Each skill ends with links to deeper docs rather than inlining everything.

```markdown
## References
- Code review workflow: docs/workflows/06-code-review.md
- Frontend conventions: docs/workflows/04-frontend-development.md
- Coding standards: docs/ai-context/codingStandards/coding-standards.md
```

**Why this saves tokens:** the skill body stays under ~400 lines. Detail lives in workflow docs that are loaded only when the model determines they are relevant.

---

## 6. The Patterns That Make Skills *Focused*

Token-optimisation is half the story. The other half is making the model **act like a specific kind of engineer**, not a generic assistant. These are the patterns that do that.

### 6.1 Mentality section with named frameworks

Every non-trivial skill opens with named mental models.

```markdown
## Mentality

### Kent Beck: "Make it work, make it right, make it fast"
Review in this order. If the code doesn't work, nothing else matters.

### Google's Code Review Standard
Look for correctness, comprehension, and consistency -- in that order.

### Risk-Based Depth
Not all code deserves the same scrutiny...
```

**Why it works:** naming a framework primes the model with everything it knows about that framework. "Channel Kent Beck" is a far cheaper prompt than re-explaining the rules. Examples used across the CONKA skills:

| Skill | Framework / Personas |
|---|---|
| `/think` | Shape Up betting table, Marty Cagan four-risk lens |
| `/scope` | Shape Up appetite/rabbit holes/no-gos, Cagan opportunity assessment |
| `/implement` | Senior backend engineer (Google/Meta), Rory Sutherland, design benchmarks (Bevel/Oura/Apple) |
| `/review` | Kent Beck, Google code review standard, risk-based depth |
| `/bug` | James Whittaker (bugs are clues), Five Whys (Toyota), Minimal Fix Principle |
| `/test` | Stripe (test at boundaries), Kent C. Dodds (test behaviour not implementation), Netflix (blast radius), Pragmatic Programmer |
| `/script` | NASA (test what you fly), Charity Majors (observability over testing), Kleppmann (idempotency non-negotiable) |

The website project should pick frameworks relevant to its domain (e.g. for marketing pages: Rory Sutherland, Eugene Schwartz, April Dunford for positioning; for performance: Google Core Web Vitals).

### 6.2 Personas tied to the work type

```markdown
### When working on backend code
Think like a senior backend engineer (Google/Meta level). Four pillars:
- Robust -- Handle errors gracefully, validate inputs, never trust external data
- Safe -- Auth on every endpoint, parameterised queries, no secrets in code
- Efficient -- No N+1 queries, no unnecessary computation, proper indexing
- Maintainable -- Clear separation of concerns, consistent patterns

### When working on frontend code
Adopt three expert roles simultaneously:
- React Native Expert
- UI/UX Specialist -- The app should do the thinking for the user
- Behavioural Designer (Rory Sutherland) -- explain why, not just what
```

**Why it works:** the persona constrains the model's default behaviour. A generic "be helpful" Claude will write competent-but-bland code. A "senior backend engineer at Google" Claude will refuse to ship a function without input validation.

### 6.3 "Wait for the user to..."

Long-running skills enforce checkpoints by saying it explicitly.

```markdown
**Wait for the user to approve, adjust, or ask questions.** Iterate until
confirmed. Do not proceed to documentation or Jira until the user explicitly
approves.
```

**Why it works:** prevents the model from racing through expensive multi-step operations without alignment. Forces collaboration at the right boundaries.

### 6.4 Standards checklists with `[ ]`

Before "presenting" or "committing", the skill makes the model run a checklist.

```markdown
#### Backend Standards Check
Before presenting the checkpoint, verify:
- [ ] Controller is thin -- logic lives in service layer
- [ ] Error handling uses handle_exception() from utils/error_handlers.py
- [ ] Response format matches existing API patterns
- [ ] Auth applied to endpoint
- [ ] No N+1 queries
- [ ] No hardcoded secrets or dev URLs
```

**Why it works:** the model treats `[ ]` items as a forced inspection. Combined with "wait for the user", this catches whole classes of issues *before* code review, not after.

### 6.5 Risk-calibrated depth

```markdown
| Risk Level | What | Review Depth |
|-----------|------|-------------|
| Critical | Auth, payments, scoring, migrations | Line-by-line. Question every assumption. |
| Standard | New features, API endpoints, business logic | Thorough structural review. |
| Low | Copy changes, styling, docs | Quick scan. Don't over-scrutinise. |
```

**Why it works:** prevents the model from applying the same intensity to every change. Saves time and tokens on low-risk diffs; spends them where they matter.

### 6.6 Key Principles footer

```markdown
## Key Principles
- Understand before fixing -- a fix without understanding is a gamble.
- Root cause, not symptom -- patching the symptom guarantees a repeat.
- Minimal change -- the smallest fix that addresses the root cause.
- Honest about uncertainty -- if you can't reproduce, say so.
- Never use em dashes in generated text or copy.
```

**Why it works:** by the time the model has read 300 lines of process, the high-level guidance has decayed. Repeating the principles at the end keeps them top-of-mind during the actual response generation.

### 6.7 Project constraints embedded in the skill

```markdown
6. **Check project constraints that may apply:**
   - Practice tests never affect scores
   - Users need 3 tests to establish baseline (handle 0-2 test state)
   - Calendar feature hidden (only for subscribers with conkaStartDate)
   - Coach platform uses approval flow (pending/approved athletes)
```

**Why it works:** the model otherwise has to discover these constraints by reading code or asking. Inline them in the skill where they apply.

---

## 7. The Lifecycle of a Skill Invocation

Here is what actually happens when a user types `/review`:

1. **Harness reads skill index** -- a one-line description per skill. Only the description.
2. **Harness loads the SKILL.md** for the invoked skill (and the schemas of its `allowed-tools`).
3. **The skill body becomes the current instruction** -- the model executes Step 0 first.
4. **Step 0 (continuity check)** -- model decides if files are in context; may skip Step 1.
5. **Pre-flight script runs** (if defined) -- returns structured JSON in one tool call.
6. **Steps 2..N execute** -- typically: gather context, do the work, run checklists, present.
7. **Response template is filled in** -- model emits the exact shape the skill specified.
8. **Optional Jira / commit / push side effects** -- if the skill is wired for them.

The token cost of a skill is dominated by: (a) the SKILL.md body, (b) the files the model reads in Step 1, (c) the tool schemas. Every optimisation above attacks one of these three.

---

## 8. Cheatsheet: Building a New Skill

When the website project adds a skill, work through this checklist.

**Before writing:**
- [ ] Name the skill (kebab-case verb or short noun)
- [ ] Write the one-line description with a trigger phrase ("Use when...")
- [ ] Decide the tool allowlist (minimum needed)
- [ ] Pick 2-4 named frameworks/personas that frame the work
- [ ] Identify the response shape the user wants

**Drafting the SKILL.md:**
- [ ] Frontmatter: `name`, `description`, `argument-hint`, `allowed-tools`
- [ ] Tagline H1 and 2-3 sentence role framing
- [ ] Quick Reference block (5-8 example invocations covering main use cases)
- [ ] "When to skip this skill" section (the cheapest token win available)
- [ ] Mentality / personas section
- [ ] Modes / flags if multi-mode
- [ ] Process: Step 0 continuity, Step 1 silent gather, Steps 2..N, final present
- [ ] Response template as a fenced block
- [ ] Domain-specific patterns table (the failure modes you have seen in this area)
- [ ] Key Principles footer (5-10 bullets)
- [ ] References section linking to your workflow docs

**Optimising:**
- [ ] Can a pre-flight script replace 3+ tool calls? If yes, write it.
- [ ] Can any step be marked `(silent)`?
- [ ] Can the body get under 400 lines by pulling detail into a workflow doc?
- [ ] Are there flags that let the user opt into cheaper variants?
- [ ] Does the allowed-tools list have anything unused?

**Validating:**
- [ ] Invoke the skill from a cold session -- does the description trigger correctly?
- [ ] Invoke it mid-session -- does the continuity check skip the expensive parts?
- [ ] Does the response match the template?
- [ ] Run the same skill twice on the same input -- is the output stable?

---

## 9. Specific Tactics the Website Project Can Steal

Concrete moves from CONKA's skills that translate well to a web project:

| CONKA pattern | Website-project equivalent |
|---|---|
| `/scope` shapes work with Shape Up appetite before solutioning | A `/scope` skill that asks "is this a 1-day, 1-week or 1-month change?" before designing a feature |
| `/implement` enforces backend-before-frontend with checkpoints | An `/implement` skill that enforces API-before-UI, or design-token-before-component |
| `/review`'s 6-check + risk-calibrated depth | Identical pattern: works → quality → robustness → cleanliness → docs → completeness, but the "CONKA-specific checks" table becomes website-specific (e.g. SEO, accessibility, Core Web Vitals, image sizes, hydration mismatches) |
| `/bug`'s Five Whys + minimal fix principle | Same skill, with frontend bug patterns swapped for web-specific ones (CLS jumps, hydration mismatches, FOUC, broken canonicals, 404s) |
| `/test`'s blast-radius determines depth | "Marketing copy → glance. Checkout flow → exhaustive." Same intuition, different content |
| `/script`'s idempotent + dry-run + scoped + clear output | Any data backfill, CMS migration, image optimisation script, sitemap regeneration |
| `/think`'s betting table for portfolio decisions | A `/think` for the website's conversion roadmap: which page test, which campaign, which redesign |
| `/prepare-release` orchestrates version bumps + What's New + deploy concerns | A `/prepare-release` for a Next.js / static site: env var scan, redirect map check, broken-link scan, lighthouse delta, changelog |
| `/commit` refuses on main, updates a session log, signs commits | Universal -- copy verbatim, change the log path |
| `/resume` reads a WORK_LOG + git state to re-orient | Universal -- copy verbatim |
| Pre-flight scripts that return JSON instead of N raw commands | For a website: a `preflight.py` that returns sitemap diff, env vars, build status, recent deploys |
| Allowed-tools allowlist | Universal -- audit every skill |
| Named mentality (Kent Beck / Cagan / Shape Up) | Swap in the canonical web names: Brad Frost (component thinking), April Dunford (positioning), Steve Krug (usability), Addy Osmani (performance), Rory Sutherland (copy) |

---

## 10. The Two Hidden Wins

Two things that aren't documented elsewhere but make the system work in practice:

**Hidden win #1: A `WORK_LOG.md` + `/resume` + `/commit` triangle.**

CONKA keeps a small `docs/development/WORK_LOG.md` file with a "Current" block (Done / Mid-flight / Next / Notes) that the model updates throughout a session. `/resume` reads it to re-orient when a session reconnects. `/commit` updates it before every commit. The net effect: dropped SSH connections, context window resets, and multi-day work all survive without re-orienting from scratch.

The website project should adopt the same triangle. It costs almost nothing and produces resilience that compounds.

**Hidden win #2: The skills cite each other.**

The `/review` skill mentions `/implement` and `/test` in its references. `/scope` hands off to `/implement`. `/think` hands off to `/scope`. This means the user (and the model) learns the workflow without ever reading a separate "how to use the skills" doc -- each skill teaches the next.

Make sure cross-references are explicit. The handoff "Next: run `/scope` to shape this into tickets" at the bottom of `/think`'s output is what turns a collection of skills into a system.

---

## Appendix: Full CONKA skill inventory

For reference, the ten skills currently shipped in `.claude/skills/`:

| Skill | Lines | Purpose |
|---|---|---|
| `commit` | 31 | Stage, commit, push current branch. Refuses on main. Updates WORK_LOG. |
| `resume` | 75 | Re-orient at session start. Reads WORK_LOG + git state. |
| `think` | 279 | Strategic portfolio prioritisation (Shape Up betting table). |
| `bug` | 251 | Detective-first bug investigation. Five Whys, minimal fix. |
| `scope` | 430 | Product-minded scoping. Shape Up + Cagan four-risk lens. |
| `implement` | 501 | Build with backend-first, checkpoint flow, standards checks. |
| `review` | 381 | Senior-engineer review. 6-check process, risk-based depth. |
| `test` | 340 | Targeted validation. Boundaries over internals. |
| `script` | 371 | Idempotent, dry-run-first backfill/migration scripts. |
| `prepare-release` | 310 | Version bump, What's New, deploy concerns scan. |

All ten share the same skeleton, the same tone, and the same set of optimisation patterns -- which is what makes them feel like one coherent system rather than ten disconnected commands.
