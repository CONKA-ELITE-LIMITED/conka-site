---
name: ship
description: End-to-end delivery pipeline - Jira ticket (no plan doc), implement, review and fix, commit, move ticket to In Review, update canonical docs, docs commit. Runs straight after /scope with no re-approval, or standalone from a one-line brief with its own compact scope and one approval gate. Use when asked to "/ship" or to take a well-understood or already-scoped change all the way through build-review-commit in one run. Not for exploratory or multi-phase work - use /scope first for that.
argument-hint: <description of the work | SCRUM-XXX>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql, mcp__claude_ai_Atlassian__createJiraIssue, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__editJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue, mcp__claude_ai_Atlassian__createIssueLink
---

# /ship -- Scope to Shipped in One Run

You are running the full delivery pipeline for a piece of work the user already understands and wants done. You are a **thin orchestrator**: each step's real instructions live in the existing skill files, which you read at that step and follow. You do not redefine their rules here.

**One human gate:** after the scope + ticket draft is presented and approved, the rest runs unattended. Design every later step so it never needs to ask.

---

## Quick Reference

```
/ship Add a savings badge to the BYO order summary   # Standalone: scopes it itself, one gate
/ship SCRUM-1281                     # Ship an existing ticket
/scope ... then /ship                # Already scoped this session: straight to execution, no gate
```

**Already-scoped check (run before anything else):** if this session contains a scope the user already approved (via /scope or equivalent discussion), or the given ticket carries acceptance criteria from scoping, **skip Steps 1-2 entirely** -- that approval was the gate. Start at Step 3 (or Step 4 if the ticket already exists and is In Progress). Do not re-present the scope or re-ask for approval.

---

## The Pipeline Checklist

At the start of the run, copy this checklist into your response. Update it (re-print the delta) as each step completes. This is how steps survive a long run without being skipped.

```
- [ ] 0. Preflight: feature branch + clean baseline recorded
- [ ] 1. Compact scope drafted (skip: already scoped)
- [ ] 2. GATE: scope + ticket draft approved by user (skip: already scoped)
- [ ] 3. Jira ticket created, moved to In Progress
- [ ] 4. Implemented (lint + build pass)
- [ ] 5. Reviewed + findings fixed (max 2 fix passes)
- [ ] 6. Committed (changelog + prefix + co-author)
- [ ] 7. Jira: implementation comment + moved to In Review
- [ ] 8. Canonical docs updated + docs commit
- [ ] 9. Final report
```

**Bail-out conditions** (stop, report, leave the checklist honest -- never push through):
- The scope turns out to be multi-phase or full of open product questions: stop at Step 2 and recommend `/scope` instead.
- A Critical review finding survives 2 fix passes: stop after Step 5, commit nothing, report.
- Any step needs a decision only the user can make: ask at the gate if foreseeable, otherwise stop and report.

---

## Process

### Step 0: Preflight

1. `git branch --show-current` and `git status`.
2. If on `main`: create a feature branch with plain `git checkout -b <feature-name>` (never `-b <name> origin/main` -- it makes pushes land on main).
3. If the working tree has uncommitted changes from other work: note them and leave them strictly alone. Stage only files this run creates or edits, by name.
4. Record the baseline: files this run starts from. Anything outside what /ship itself touches is out of scope for fixes.

### Step 1: Compact Scope + Grill Pass

If a SCRUM key was given, fetch the ticket first and treat its description as the brief. Do a focused read of the affected code (targeted Grep/Glob, read the files that will change). No Explore subagent, no plan doc.

**Grill pass -- the brief is usually thin; guesses are the failure mode.** List every decision the brief leaves open, then sort:
- **Settle it yourself** if the codebase, docs, or an existing pattern answers it. Never ask the user something you can look up.
- **State it as an assumption** if you have a clearly sensible default (placement, naming, which existing component to extend).
- **Ask it at the gate** only if the decision materially forks the build (behaviour, edge cases, data source, copy angle) -- max 4 questions, each with a recommended default so a one-word reply unblocks it.

**Exception:** if the brief is too thin to draft an approach at all, ask the grill questions first (one round, max 4), then draft. Otherwise questions ride the gate; never add a second pause.

Then draft:

```
**What:** [1 sentence]
**Why it matters:** [1 sentence -- conversion/retention lens]
**Approach:** [2-5 bullets -- files to touch, key decisions]
**Design language:** [Simple DTC | Clinical | n/a]
**Mobile consideration:** [1 sentence or "no impact"]
**Analytics impact:** [events affected or "none"]
**Assumptions:** [defaults you'll use unless corrected -- every silent guess goes here]
**Open questions:** [the fork-the-build decisions, with your recommended answer -- or "none"]
**Out of scope:** [explicitly excluded]
**Ticket draft:** [summary line + 2-4 acceptance criteria]
```

### Step 2: GATE -- Present and Wait

Present the compact scope and ticket draft, questions included. **Wait for approval.** This is the only pause. Fold answers and corrections in before proceeding; unanswered questions resolve to their recommended defaults only if the user explicitly approves with them open. If the user's reply reveals the work is bigger than a /ship, bail out to `/scope`.

### Step 3: Jira Ticket

Skip creation if the user supplied an existing SCRUM key -- just transition it to **In Progress**.

Otherwise read `.claude/skills/scope/jira.md` and follow it: active sprint lookup, issue type, epic parent (verify it attached), AC minimums, summary prefix. Then transition the new ticket to **In Progress**.

### Step 4: Implement

Read `.claude/skills/implement/SKILL.md` and follow its Process with these overrides:
- Skip its Step 2 plan-mode wait -- the Step 2 gate above already approved the approach.
- Run as if `--no-checkpoints`: build all phases end-to-end, no pauses.
- Stop after its Step 6 (cleanup: `npm run lint:changed` + `npm run build`). Do NOT run its commit or Jira steps -- /ship owns those below.
- The three non-negotiables (mobile-first 390px, performance, brand alignment) still gate the work.

### Step 5: Review + Fix

Read `.claude/skills/review/SKILL.md` and run it on the uncommitted changes in default fix mode: triage all findings, fix Critical/Major/Minor, max 2 fix passes, revert-first if a fix introduces a regression. The analytics module triggers per that skill's own rule. Pre-existing issues outside this run's baseline get reported, never fixed.

### Step 6: Commit

Read `.claude/skills/commit/SKILL.md` and follow it exactly: branch guard, one-line changelog entry, stage this run's files by name, prefix table, co-author line.

### Step 7: Jira Wrap-up

1. Add an implementation comment to the ticket (`contentFormat: markdown`): what was built, files changed, branch name, anything the reviewer should know.
2. Transition to **In Review** (via `getTransitionsForJiraIssue` then `transitionJiraIssue`). Do not ask -- the gate approved this pipeline.

### Step 8: Canonical Docs

Check whether the change made any living documentation stale, and update only what is genuinely affected:
- `CLAUDE.md` -- routes table, key files, product data notes
- The relevant `docs/features/*.md` canonical doc for the touched system
- `docs/branding/DESIGN_SYSTEM.md` only if a new pattern/token was introduced
- An existing feature plan doc, if this work belongs to one -- update its status table to match reality
- `docs/TODO.md` -- an entry for anything deliberately left undone in this run

**Retirement check:** did this work close out the plan's last active phase (delivered, abandoned, or superseded, with no live phases left)? If so, retire the plan in the same run per `docs/workflows/05-creating-documentation.md` Step 7: fold its living truth into the existing canonical doc, banner it ARCHIVED with a pointer, move it to `featurePlans/archive/`, and repoint inbound links in `CLAUDE.md` and `docs/README.md`.

Do not write new docs for small changes; a shipped tweak rarely needs more than a line. If nothing is stale, say so and skip. If docs changed: commit them separately (`docs:` prefix, changelog skipped) following the commit skill.

### Step 9: Final Report

Re-print the completed checklist, then:

```
**Shipped:** [one line]
**Ticket:** SCRUM-XXX (In Review)
**Commits:** [hashes + messages]
**Review:** [N findings fixed, M deferred and why]
**Docs:** [updated files or "nothing stale"]
**Next:** push the branch for a Vercel preview and eyeball [specific thing worth checking on the rendered site]
```

Do not push. The user pushes and opens the PR (pushes from this environment 403 anyway).

---

## Key Principles

- **Thin orchestrator.** The step skills own their rules; you own the sequence, the gate, and the checklist.
- **One gate, honoured.** Everything after Step 2 must run without asking. If a step wants to ask, the scope was wrong -- bail out and say so.
- **The checklist is the state.** Re-print it as steps complete; a skipped step must be visibly unchecked, never silently dropped.
- **Baseline discipline.** Fix only what this run introduced. Pre-existing mess gets reported.
- **Bail out loudly.** A stopped pipeline with an honest report beats a completed pipeline with a wrong assumption.
- **Never use em dashes** in generated text or copy.
