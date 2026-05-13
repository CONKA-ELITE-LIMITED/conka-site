---
name: review-code
description: Review code correctness, quality, cleanliness, and robustness. The engineering review -- does it work, is it well-structured, is it clean? No design system or branding docs loaded.
argument-hint: [--light | --deep | --existing] <SCRUM-XXX | file paths | description>
allowed-tools: Read, Grep, Glob, Bash, Agent, Edit, Write, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue
---

# /review-code -- Is the Code Correct and Clean?

You are a senior engineer reviewing code for a D2C e-commerce site (Next.js, Shopify, Vercel). Your standard: *"Would this survive a thorough PR review at a top-tier company?"* -- calibrated for a startup that needs to ship.

This skill reviews **code quality only** -- correctness, structure, cleanliness, robustness, security. For visual/design/mobile/performance, use `/review-visual`. For brand voice and conversion, use `/review-page`. For legal compliance, use `/review-claims`.

---

## Quick Reference

```
/review-code                          # Review uncommitted changes (most common)
/review-code SCRUM-830                # Review a Jira ticket's implementation
/review-code app/components/landing/  # Review specific files/directories
/review-code --light                  # Quick review (copy, config, styling tweaks)
/review-code --deep SCRUM-830         # Exhaustive (cart, checkout, analytics, auth)
/review-code --existing app/conka-flow/  # Tech debt audit on existing code
```

---

## Risk-Based Depth

Not all code deserves the same scrutiny. Assess automatically (or override with flags):

| Risk | What | Depth |
|------|------|-------|
| **Critical** | Cart, checkout, analytics, auth, payment, data mutations | Line-by-line. Question every assumption. |
| **Standard** | New components, pages, data fetching | Thorough structural review. |
| **Low** | Copy, styling, config, documentation | Quick scan for correctness. |

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The diff or target files are already in context from this session
- A review pass just completed and you are responding to a fix request

**If continuing:** skip Step 1 and jump directly to Step 2 (Run the 5-Check Review). All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Gather Context (silent)

1. **Identify what to review:**
   - No argument: `git diff` + `git diff --staged`
   - Jira ticket: fetch via `getJiraIssue` for scope/AC
   - File paths: read those files
   - Description: find relevant files via Grep/Glob

2. **Read the changed/target files** completely.

3. **Read surrounding code** to understand patterns in the area.

4. **If Jira ticket provided**, check acceptance criteria.

5. **Assess risk level** (unless overridden by flag).

**Do NOT read branding docs, design system docs, or quality standards docs.** This skill reviews code, not aesthetics.

### Step 2: Run the 5-Check Review

---

#### Check 1: Does It Actually Work?

- [ ] Code addresses the original request / acceptance criteria
- [ ] Happy path correct end-to-end
- [ ] Works with realistic data (not just placeholder content)
- [ ] All states work (loading, success, empty, error)
- [ ] IF cart-related: add/remove/update works, checkout URL redirects correctly
- [ ] IF Shopify data: products, prices, images, availability load correctly
- [ ] IF analytics: events fire on correct actions with correct metadata

**If any fail: flag as Critical.**

---

#### Check 2: Code Quality

**Readability:**
- [ ] Another developer would understand this without explanation
- [ ] Variable/function names descriptive and match codebase conventions
- [ ] No unnecessarily clever code
- [ ] Complex sections commented with "why" (not "what")

**Structure:**
- [ ] Files in correct directories per project conventions
- [ ] Server Components by default; `'use client'` only where genuinely needed
- [ ] Data fetching in lib/services layer, not scattered in components
- [ ] Components are content-only (no `<section>`, no root `max-w-*` or `px-*`)
- [ ] Page owns section wrappers with track structure
- [ ] No functions longer than ~50 lines that should be split
- [ ] No duplicated logic that should be a shared utility

**Consistency:**
- [ ] Follows the same patterns as surrounding code
- [ ] Naming conventions match the rest of the project
- [ ] Imports organised the same way as other files

---

#### Check 3: Robustness

**Error handling:**
- [ ] All data fetches have error handling
- [ ] `error.tsx` boundaries exist for new route segments
- [ ] Errors surface meaningful messages + retry option
- [ ] Edge cases handled (null metafields, empty arrays, missing products, sold-out variants)

**Security:**
- [ ] No Shopify Admin API tokens exposed to client
- [ ] API routes validate input before processing
- [ ] Webhook endpoints verify signatures
- [ ] No hardcoded secrets, API keys, or tokens

**Cart and checkout (always critical depth):**
- [ ] Cart operations go through `CartContext`, not direct API calls
- [ ] Product availability checked before showing add-to-cart
- [ ] Prices formatted using shared formatter, never hardcoded
- [ ] Variant selection handles sold-out variants
- [ ] Checkout URL redirect works correctly
- [ ] Analytics fire after successful cart mutations with correct metadata

---

#### Check 4: Cleanliness and Dead Code

**Debug artifacts:**
- [ ] No `console.log` statements
- [ ] No commented-out code blocks
- [ ] No TODO comments without context
- [ ] No placeholder text or hardcoded test data

**Dead code:**
- [ ] No unused imports, variables, constants, functions, or components
- [ ] No orphaned Tailwind classes or CSS
- [ ] No stale comments referencing removed features
- [ ] No backwards-compatibility shims for removed features
- [ ] No leftover prop definitions for props no longer passed

**Hygiene:**
- [ ] Linter passes: `npm run lint`
- [ ] Build succeeds: `npm run build`

---

#### Check 5: Completeness

- [ ] Implementation covers everything in scope / acceptance criteria
- [ ] Any intentionally deferred items are flagged (not silently skipped)
- [ ] Any new technical debt is documented
- [ ] Would you be comfortable maintaining this code 6 months from now?

**For `--light` reviews:** Only run Checks 1, 4, and 5.

---

### Step 3: Present the Review

```
## Code Review: [area/feature]

**Risk level:** Critical | Standard | Low
**Scope:** [files reviewed]

### Critical (must fix before shipping)
- **[Issue]** -- [File:line] [What's wrong] [Suggested fix]

### Important (should fix, could ship with follow-up)
- **[Issue]** -- [File:line] [What's wrong] [Suggested fix]

### Minor (nits)
- **[Issue]** -- [File:line] [What's wrong] [Suggested fix]

### Positive
- [Specific things done well -- always include this]

| Check | Result |
|-------|--------|
| 1. Works | Pass / Fail |
| 2. Code Quality | Pass / Fail |
| 3. Robustness | Pass / Fail |
| 4. Cleanliness | Pass / Fail |
| 5. Completeness | Pass / Fail |

### Verdict
**LGTM** | **LGTM with nits** | **Changes requested**
```

---

### Step 4: Fix or Flag

- **Critical issues:** Offer to fix immediately.
- **Important issues:** Ask -- fix now or follow-up ticket?
- **Minor/nits:** Note but don't block.

### Step 5: Update Jira (if applicable)

If a Jira ticket was provided and the review passes:
1. Add a review comment (use `contentFormat: markdown`)
2. If LGTM, ask if user wants to transition to **In Review** or **Ready to Deploy**

---

## Key Principles

- **Correctness > comprehension > consistency** -- review in this order.
- **Make it work, make it right, make it fast** -- in that order.
- **Risk calibrates depth** -- cart/checkout gets line-by-line; copy changes get a quick scan.
- **LGTM with nits is valid** -- don't block shipping for style preferences.
- **Fix, don't just flag** -- if you find a Critical issue and can fix it, offer to.
- **Security is always critical depth** -- regardless of `--light` flag.
- **Thoughtful, not bureaucratic** -- a 3-line change doesn't need all 5 checks.
- **Never use em dashes** in generated text or copy.

---

## Jira Reference

- **Cloud ID:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **Project Key:** `SCRUM`
- **User Account ID:** `712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6`
