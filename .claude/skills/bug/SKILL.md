---
name: bug
description: Investigate, diagnose, and fix bugs with a detective-first mindset. Reproduces the issue, finds root cause (not just symptoms), applies minimal fix, verifies resolution, checks blast radius. Use when something is broken.
argument-hint: [SCRUM-XXX | description of the bug]
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent
---

# /bug -- What Is This Bug Trying to Tell You?

You are a detective, not a fixer. The bug is a clue. Your job is to understand what the system is actually doing before you touch a single line of code. Patches without understanding guarantee repeat failures.

---

## Quick Reference

```
/bug Cart drawer not opening after add                # Describe the symptom
/bug SCRUM-921                                        # Investigate a Jira ticket
/bug Funnel step 3 reloads instead of advancing       # Any observable misbehaviour
```

---

## Mentality

### James Whittaker: "Bugs are clues, not embarrassments"
The symptom is not the bug. The bug is the wrong assumption buried in the code. Read the symptom and ask what assumption could produce it.

### Five Whys (Toyota)
Ask "why?" five times before proposing a fix. Stop when you reach something you cannot go deeper on. That is the root cause.

### Minimal Fix Principle
The smallest change that addresses the root cause is the correct fix. A larger change may solve the symptom while masking a different root cause, and introduces new blast radius.

---

## Process

### Step 0: Continuity check (always run first)

Is this a continuation of a bug investigation already in progress this session?

**Signs you're continuing:**
- The reproduction steps and affected files are already in context
- A root cause hypothesis was already formed and you are responding to a fix request

**If continuing:** skip Step 1 and jump directly to Step 3 (Root Cause). All context is already loaded.

**If starting fresh:** run all steps below in order.

---

### Step 1: Understand the Report (silent)

1. **If a Jira ticket key is provided:** fetch via `getJiraIssue`. Read description, reproduction steps, and any comments.
2. **Read the symptom carefully.** What is the user observing? What did they expect? On which device/route/state?
3. **Assess risk level:**

| Risk | Area | Approach |
|------|------|----------|
| Critical | Cart, checkout, analytics, payments | Line-by-line. Question every assumption. |
| Standard | Pages, components, data fetching | Thorough structural read. |
| Low | Styling, copy, layout | Quick scan for the obvious cause. |

4. **Do not hypothesise yet.** Just orient.

---

### Step 2: Reproduce (silent)

Before reading code, establish: **Can you reproduce this from the symptom description?**

- Identify the exact route, action sequence, and state that triggers the bug
- Check if it is device-specific (mobile vs desktop, Safari vs Chrome)
- Check if it is data-specific (empty cart, specific product, specific variant)
- Check if it is environment-specific (production only, preview only)

If you cannot reproduce from the description, state that clearly before continuing. Guessing a fix for an unreproduced bug is a gamble.

---

### Step 3: Root Cause (silent)

Work through the Five Whys:

1. Read the code path triggered by the symptom (follow the call chain)
2. Check the patterns table below -- does the symptom match a known failure mode?
3. Ask "why" until you reach an assumption in code that is provably wrong
4. Form a hypothesis: **"The bug is [X] because [Y] assumes [Z], which is false when [condition]."**

Do not touch code yet.

---

### Step 4: Minimal Fix

Apply the smallest change that addresses the root cause.

- Change only what is wrong. Do not refactor adjacent code.
- If the root cause is in a shared utility, check all callers before changing the signature.
- If the fix requires a behaviour change on a critical path (cart, checkout), note the blast radius.

After fixing:
- [ ] The symptom is resolved by this change
- [ ] No other callsites are broken
- [ ] No new states are left unhandled
- [ ] No console errors introduced
- [ ] Linter passes: `npm run lint`

---

### Step 5: Present the Finding

```
## Bug: [one-line description]

**Symptom:** [What the user observed]
**Root cause:** [The wrong assumption in code, with file:line]
**Five Whys path:** Why 1 -> Why 2 -> Why 3 -> Root

**Fix applied:** [What changed and why -- file:line]
**Blast radius:** [What else this touches -- none / list]

**Verification:** [How to confirm the fix works]
```

If you cannot determine the root cause: say so, name the most likely candidates, and propose a logging or debugging step to narrow it down. Do not guess a fix.

---

## Web-Specific Failure Patterns

| Symptom | Likely Cause | Where to Look |
|---------|-------------|---------------|
| Component renders on server then flashes to different content | Hydration mismatch -- server and client render different output | `typeof window` guards, `useEffect` gating, `suppressHydrationWarning` abuse |
| Back button navigates to wrong page or broken URL | Browser history not managed -- React state with no `pushState` | `FunnelClient.tsx`, any multi-step component without History API |
| Cart drawer opens empty after add | Shopify cart created but CartContext state not updated | `CartContext.tsx` `addToCart` mutation, `cartId` not persisted to localStorage |
| Checkout redirect goes to wrong URL | `cart.checkoutUrl` from Shopify is stale or empty | `CartDrawer.tsx`, `app/api/cart/route.ts` |
| Analytics event not firing | Pixel not loaded yet, or event fires before `window.fbq` is available | `metaPixel.ts` `isPixelAvailable()`, script load order in `layout.tsx` |
| Meta CAPI deduplication fails | `event_id` on Pixel call and CAPI call do not match | `metaPixel.ts` `trackWithDedup` -- both sides must use the same generated ID |
| Invisible or white text after section background change | Text colour not set on component; inherits from new parent background | Component using unset or inherited text colour on a dark/light background flip |
| Image CLS jump | No explicit dimensions on `next/image`, or `priority` missing on LCP image | Any `<Image>` without `width`/`height`, or LCP element missing `priority` |
| Shopify data returns null silently | Metafield missing, variant not found, or query over-restrictive | `app/lib/shopify.ts`, Shopify query field selection |
| Page slow only on first visit | No Suspense boundary, blocking server fetch on critical path | `loading.tsx`, `Suspense` boundaries, fetch waterfall in route handler |

---

## Key Principles

- **Reproduce before you read.** Reading code without a reproduction path means guessing what to look for.
- **Root cause, not symptom.** A fix that makes the symptom disappear without addressing the cause is a time bomb.
- **Five Whys stops at something you cannot control.** If you reach "the Shopify API returned null", that is your root; add a null guard.
- **Minimal change.** A 3-line fix is almost always right. A 30-line fix usually means the root cause was misidentified.
- **Honest about uncertainty.** If you cannot reproduce or the root cause is ambiguous, say so. A confident wrong diagnosis is worse than an honest "needs more information".
- **Never use em dashes** in generated text or copy.
