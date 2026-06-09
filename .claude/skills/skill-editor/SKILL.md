---
name: skill-editor
description: Audit and improve Claude Code skills - check description/triggering, leanness, progressive disclosure, stale references, and efficiency anti-patterns, then apply fixes. Also ingests feedback about a skill being slow, verbose, or mis-triggering and edits the skill to fix it. Use when asked to review, clean, audit, or fix a skill, after a skill underperforms, or to keep the .claude/skills set healthy. e.g. "/skill-editor commit", "skill-editor all", "the scope skill is too verbose".
argument-hint: [--fix | all] [skill-name] [optional "feedback about the skill"]
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# /skill-editor -- Keep Skills Lean, Triggering, and Improving

You maintain the skills the rest of the team relies on. A skill is a procedure with a personality (see `.claude/SKILL_ARCHITECTURE_GUIDE.md` for the full model). Your job is to keep each one **focused, predictable, and cheap to run** - and to fold real-world feedback back into the skill so it gets better over time. This is the project's self-improvement loop: human-triggered, not autonomous.

---

## Quick Reference

```
/skill-editor commit                 # Audit one skill, report findings
/skill-editor all                    # Audit every skill, summary table
/skill-editor --fix scope            # Audit and apply the fixes
/skill-editor commit "ran full lint, slow"   # Ingest feedback, edit the skill
```

---

## Step 0: Continuity check (always run first)

**Continuing** if you already audited this skill this session and the user is now responding to findings. If so, skip to Step 4 (apply) or Step 5 (feedback). **Starting fresh:** run all steps.

---

## Process

### Step 1: Determine mode

- **Feedback given** (a quoted complaint about a skill): go to Step 5.
- **`all`**: audit every skill in `.claude/skills/*/`, return the summary table only (Step 3 condensed). Do not deep-edit unless asked.
- **One skill named**: full audit (Steps 2-4).

### Step 2: Orient (silent)

Read the target `SKILL.md` and list its sibling sub-docs (`ls .claude/skills/<name>/`). For the standard you are auditing against, the checklist below is the operating summary; consult `.claude/SKILL_ARCHITECTURE_GUIDE.md` only if a finding needs the deeper rationale. Do not load it for every audit.

### Step 3: Audit against the checklist

Run every dimension in **The Checklist** (below). For each, record: pass, or issue + the specific fix.

### Step 4: Present, then fix

Present findings using the output template. **If `--fix`**, apply the fixes as minimal `Edit`s and re-state what changed. **Without `--fix`**, propose the fixes and wait. Never rewrite a whole SKILL.md when targeted edits suffice.

### Step 5: Feedback ingestion

Given a complaint (e.g. "ran full lint and was slow", "didn't trigger when I said X", "too verbose"):

1. Map it to a checklist dimension.
2. Five-Whys-lite: find the exact instruction (or missing instruction) that produced the behaviour. Quote it with `file:line`.
3. Make the **minimal** edit that fixes the root cause.
4. **Where the lesson lives:**
   - Skill-specific -> edit the SKILL.md directly (done in step 3).
   - Cross-cutting ("how Claude should work" across all skills) -> it belongs in the project memory or `CLAUDE.md` Operating-efficiency section, not duplicated into one skill. Say so and suggest the memory write; do not create per-skill memory files (they load into context every run and work against the efficiency goal).

---

## The Checklist

**A. Description (the trigger - most important)**
- States BOTH what it does AND when to use it (trigger conditions)?
- Includes phrases a user would actually type?
- Under 1024 chars, no XML angle brackets, name has no "claude"/"anthropic"?
- Over-trigger risk (too broad) or under-trigger risk (vague / missing keywords)? Add negative triggers if it loads for unrelated work.

**B. Leanness + progressive disclosure**
- Core instructions are tight; SKILL.md is not bloated (rough ceiling ~200 lines / 5k words).
- Critical rules and the bail-out condition are near the TOP, not buried.
- Edge-case detail, long catalogues, and mode-specific flows live in sub-docs loaded only when their step is reached - not inline.
- A line tells the model not to pre-load sub-docs.

**C. Hygiene**
- No stale references: pinned model versions, deleted/renamed file paths, dead doc links.
- No redundancy (same instruction stated twice) or contradictory steps.

**D. Efficiency (ties to CLAUDE.md Operating efficiency)**
- Does not instruct expensive patterns: full-file rewrites for small changes, `npm run lint` (whole repo), re-reading a file just edited, serial calls that could batch.
- Prefers scoped commands (`npm run lint:changed`, `npx eslint <file>`) and delegates big reads to a subagent.

**E. Integrity**
- `allowed-tools` matches what the skill actually uses (not over-broad).
- Has a Step 0 continuity check so it resumes cleanly mid-session.

---

## Output template

```
## Skill audit: <name>

**Verdict:** Healthy | Minor issues | Needs work

| Dimension | Status | Finding -> Fix |
|-----------|--------|----------------|
| Description | issue | Missing trigger phrases -> add "..." |
| Leanness | pass | - |
| Hygiene | issue | Stale "Sonnet 4.6" ref at line 107 -> make model-agnostic |
| Efficiency | pass | - |
| Integrity | pass | - |

**Recommended edits:** [numbered, with file:line]
```

For `all`, output one row per skill: `| skill | verdict | top issue |`.

---

## Key principles

- **Pass your own checklist.** This skill must itself be lean, triggering, and hygienic. If you edit it, re-audit it.
- **Minimal edits.** Targeted `Edit`s, never a full rewrite for a small fix. The thing you are fixing is often bloat - do not add more.
- **No new always-loaded files.** Lessons fold into the SKILL.md or the existing project memory, never per-skill memory logs.
- **Preserve behaviour.** You change wording, structure, and triggers - not what the skill actually does, unless the feedback is that the behaviour itself is wrong.
- **Trigger phrases beat cleverness.** Most "skill didn't fire" issues are a thin description. Fix the description first.
- **Never use em dashes** in generated text or copy.
