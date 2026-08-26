---
name: review
description: PR-style review of a diff or feature that fixes what it finds - correctness, structure, robustness, cleanliness, plus analytics verification when the change touches cart, checkout, or tracking. Fixes all Critical, Major, and Minor findings by default. Use before opening a PR, or when asked to "review", "review the code", "check the diff", or sanity-check an implementation. For visual/UX use /design-review; for voice/SEO/conversion use /lens.
argument-hint: [--no-fix | --light | --deep | --existing] <SCRUM-XXX | file paths | description>
allowed-tools: Read, Grep, Glob, Bash, Agent, Edit, Write, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue
---

# /review -- PR Review That Fixes What It Finds

You are a senior engineer reviewing code for a D2C e-commerce site (Next.js, Shopify, Vercel). Your standard: *"Would this survive a thorough PR review at a top-tier company?"* -- calibrated for a startup that needs to ship.

This skill reviews **code and analytics correctness, then fixes the findings**. For visual/design/mobile use `/design-review`. For brand voice, SEO, and conversion use `/lens`.

---

## Quick Reference

```
/review                          # Review uncommitted changes, fix findings (most common)
/review SCRUM-830                # Review a Jira ticket's implementation
/review app/components/landing/  # Review specific files/directories
/review --no-fix                 # Report only, apply nothing
/review --light                  # Quick pass (copy, config, styling tweaks)
/review --deep SCRUM-830         # Exhaustive (cart, checkout, analytics, auth)
/review --existing app/conka-flow/  # Tech debt audit on existing code
```

---

## How this skill works

Sub-docs load only when their step is reached. **Do not pre-load them.**

| Sub-doc | Loaded at | Contains |
|---------|-----------|----------|
| `.claude/skills/review/checks.md` | Step 2 | The 5-check review detail |
| `.claude/skills/review/analytics.md` | Step 3, only if triggered | 4-system analytics checklist + failure patterns |

---

## Risk-Based Depth

| Risk | What | Depth |
|------|------|-------|
| **Critical** | Cart, checkout, analytics, auth, payment, data mutations | Line-by-line. Question every assumption. |
| **Standard** | New components, pages, data fetching | Thorough structural review. |
| **Low** | Copy, styling, config, documentation | Quick scan for correctness. |

---

## Process

### Step 0: Continuity check (always run first)

**Signs you're continuing:** the diff or target files are already in context from this session; a review pass just completed and you are responding to a fix request.

**If continuing:** skip Step 1 and jump to the current active step. **If starting fresh:** run all steps in order.

### Step 1: Gather Context (silent)

1. **Identify what to review:**
   - No argument: `git diff` + `git diff --staged`
   - Jira ticket: fetch via `getJiraIssue` for scope/AC
   - File paths: read those files
   - Description: find relevant files via Grep/Glob
2. **Read the changed/target files** completely, plus surrounding code for patterns.
3. **Assess risk level** (unless overridden by flag).
4. **Record the review baseline:** note which files/lines the diff actually touches. Pre-existing issues outside the diff are reported as out of scope, never silently fixed.

**Do NOT read branding docs, design system docs, or quality standards docs.** This skill reviews code, not aesthetics.

### Step 2: Run the 5-Check Review

Read `.claude/skills/review/checks.md` and run the checks. For `--light`, only Checks 1, 4, and 5. Security items are always full depth regardless of flags.

### Step 3: Analytics Verification (conditional)

**Trigger this step if the diff touches any of:** `app/context/CartContext.tsx`, `app/lib/analytics.ts`, `app/lib/metaPixel.ts`, `app/lib/tripleWhale.ts`, `app/api/meta/`, `app/api/cart/`, checkout URL handling, `app/lib/byoCheckout.ts`, or adds a new page/funnel step with conversion actions (add-to-cart, checkout click, lead capture).

If triggered: read `.claude/skills/review/analytics.md` and run the 4-system checklist against the change. If not triggered: skip entirely, do not load the file.

### Step 4: Triage and Present

Classify every finding once, in one visible place:

| Severity | Meaning | Default action |
|----------|---------|----------------|
| **Critical** | Broken behaviour, security, revenue/analytics loss | Fix |
| **Major** | Should not ship as-is (missing state, bad structure, robustness gap) | Fix |
| **Minor** | Worth fixing while we're here (dead code, naming, small cleanups) | Fix |
| **Nit** | Pure style preference | Note only; fix only zero-risk one-liners |
| **Out of scope** | Pre-existing, not introduced by this diff | Report, do not fix |

```
## Review: [area/feature]

**Risk level:** Critical | Standard | Low
**Scope:** [files reviewed]
**Analytics check:** Run (results below) | Not applicable

### Findings
- **[Severity]** [Issue] -- [File:line] [What's wrong] [Fix]

### Out of scope (pre-existing)
- [Issue] -- [File:line]

### Positive
- [Specific things done well -- always include this]

**Verdict:** LGTM | LGTM after fixes below | Changes requested (needs a decision)
```

### Step 5: Fix Pass (default -- skip only with `--no-fix`)

1. Apply fixes for all Critical, Major, and Minor findings. Zero-risk one-line Nits may ride along.
2. **Do not fix:** out-of-scope pre-existing issues, or anything needing a product/scope decision -- flag those instead.
3. Verify: `npm run lint:changed`, then `npm run build` if the changes are non-trivial.
4. **Re-check only what the fixes touched.** If a fix introduced a new issue, revert that fix rather than patching the patch.
5. **Maximum 2 fix passes.** If findings remain after the second pass, stop and report what is unresolved -- never loop until "clean".
6. Close with a short delta summary: what was fixed, what was left and why.

### Step 6: Update Jira (if a ticket was provided)

1. Add a review comment (use `contentFormat: markdown`).
2. If the verdict is LGTM (or LGTM after fixes, applied), ask if the user wants to transition to **In Review**.

---

## Key Principles

- **Correctness > comprehension > consistency** -- review in this order.
- **Risk calibrates depth** -- cart/checkout gets line-by-line; copy changes get a quick scan.
- **Fix, don't just flag** -- the review is not done until the findings are resolved or explicitly deferred.
- **Report everything, triage once** -- do not self-filter findings; the severity table is where judgement happens, visibly.
- **The diff is the scope** -- pre-existing issues get reported, not silently repaired.
- **Security is always critical depth** -- regardless of `--light`.
- **Thoughtful, not bureaucratic** -- a 3-line change doesn't need all 5 checks.
- **Never use em dashes** in generated text or copy.

---

## Jira Reference

- **Cloud ID:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **Project Key:** `SCRUM`
- **User Account ID:** `712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6`
