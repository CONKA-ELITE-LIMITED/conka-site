---
name: implement
description: Implement a feature or task following established patterns. Reads ticket/plan, enters plan mode for approach, builds data-layer-first then components then page, enforces standards at each checkpoint, updates Jira status. Use when ready to build after scoping.
argument-hint: [--quick | --no-checkpoints] <SCRUM-XXX | description of the work>
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, EnterPlanMode, ExitPlanMode, mcp__claude_ai_Atlassian__getJiraIssue, mcp__claude_ai_Atlassian__editJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue
---

# /implement -- Build It Right

You are implementing a scoped piece of work for a D2C e-commerce website. Your job is to build it with the quality and consistency of a senior engineer at a top-tier company, matching the existing codebase patterns exactly.

---

## Quick Reference

```
# Implement a Jira ticket -- pauses at each checkpoint for review
/implement SCRUM-830

# Implement without checkpoints -- builds end-to-end, presents at the end
/implement --no-checkpoints SCRUM-831

# Quick mode -- small fix, copy tweak, <3 files, no architecture change
# Skips plan mode, secondary doc reads, checkpoints, and Jira update
/implement --quick Fix the mobile padding on the hero CTA

# Implement from a verbal description (no ticket)
/implement Add a "What to Expect" timeline to the landing page

# Implement a specific phase from a feature plan
/implement Phase 2 of the design-system-migration plan
```

---

## How this skill works

This skill uses **progressive disclosure**. The always-needed workflow lives here; mode-specific and verbose detail lives in sub-docs that load only when their step or mode is reached.

| Sub-doc | Loaded at | Contains |
|---------|-----------|----------|
| `.claude/skills/implement/quality-bar.md` | While building (any phase) | Full Three Non-Negotiables detail + Contextual Personas |
| `.claude/skills/implement/build-phases.md` | Steps 2-5 (whichever apply) | Step 2 plan template, data-layer / component / page build orders, standards checks, checkpoint formats, Incremental Delivery |
| `.claude/skills/implement/commit-and-jira.md` | Steps 6-8 | Cleanup checklist + summary format, commit conventions, Jira comment/transition flow, Jira Reference IDs |
| `.claude/skills/implement/project-patterns.md` | While building (any phase, as needed) | Project file map (pages, data, design system, analytics), key architectural rules, References |
| `.claude/skills/implement/quick-mode.md` | `--quick` mode only | Quick Mode process (replaces the standard Process) |

**Do not pre-load sub-docs.** Read each only when its step or mode is reached.

---

## Mode selection

Choose the mode that matches the task before reading anything else.

| Mode | When to use | What it skips |
|------|-------------|---------------|
| **Default** | New components, pages, data work, anything with a ticket | Nothing |
| **`--no-checkpoints`** | Smaller ticket, want end-to-end build without pausing | Checkpoint pauses only |
| **`--quick`** | Bug fix, copy tweak, styling adjustment, <3 files, no architecture | Plan mode, secondary docs, checkpoints, Jira |

**If `--quick` is set:** Read `.claude/skills/implement/quick-mode.md` and follow that process. Do not run the standard Process below.

---

## The Golden Rule

> **Match the existing codebase.** If the project uses a certain pattern, follow it -- even if you'd do it differently on a fresh project. Consistency beats personal preference.

Before writing any code, read the surrounding code. Understand the conventions. Then follow them.

---

## Three Non-Negotiables

These gate every piece of work. They are checked at every checkpoint, not optimised for at the end. Nothing ships without passing all three:

1. **Mobile-first** — build and review at 390px first; 74% of traffic is mobile from paid social. If mobile and desktop conflict, mobile wins.
2. **Performance** — speed is the product. Server Components by default, `next/image`, CSS animations, no layout shift, Lighthouse 90+.
3. **Brand alignment** — design-system tokens only, left-aligned, confident-clinical voice with specific proof points, monochrome-first. Must look like it belongs next to Seed.com.

**Read `.claude/skills/implement/quality-bar.md`** for the full detail behind each gate and the Contextual Personas (backend engineer for data/API work; Next.js Expert + D2C Conversion Specialist + Behavioural Designer for components/pages; systems engineer for data-to-UI integration). Consult it while building any phase.

---

## Process

The argument is a Jira ticket key (`SCRUM-830`), a verbal description, or a reference to a phase in a feature plan. Optional flags `--no-checkpoints` (skip pause-and-confirm after each phase) and `--quick` are described under Mode selection above.

### Step 0: Continuity check (always run first)

Is this a continuation of work already in progress this session?

**Signs you're continuing:**
- The implementation plan was already presented and approved this session
- Files being modified are already in context
- A previous checkpoint (data layer, components, or page) just completed

**If continuing:** skip Step 1 and jump directly to the next build phase. All context is already loaded.

**If starting fresh:** run all steps below in order.

### Step 1: Gather Context (silent -- do not output this step)

Before responding, research thoroughly:

1. **If a Jira ticket key is provided:**
   - Fetch the ticket using `getJiraIssue`
   - Read the description, acceptance criteria, and any comments
   - Transition the ticket to **In Progress** using `transitionJiraIssue` (find the transition ID via `getTransitionsForJiraIssue` first)
   - Jira details: cloudId `3fc0ea53-78a2-4095-bc58-97377fd07202`, project `SCRUM`

2. **Check for a feature plan:**
   - Search `docs/development/featurePlans/` for a plan related to this work
   - If found, read it for phase details, technical decisions, and context

3. **Read the relevant existing code:**
   - Identify the files and directories that will be affected
   - Read them to understand current patterns, naming, structure
   - Check for similar implementations elsewhere in the codebase

4. **Read project standards — load only what applies:**
   - `CLAUDE.md` — **always** (architecture, key files, strategic direction)
   - `docs/branding/DESIGN_SYSTEM.md` — **only if** the task touches UI components, pages, or styling
   - `docs/branding/QUALITY_STANDARDS.md` — **only if** building a new page or major new section
   - `docs/branding/BRAND_VOICE.md` — **only if** the task involves writing or editing copy
   - `docs/workflows/02-implementation-workflow.md` — **only if** the task is a full page or complex feature
   - `docs/workflows/03-nextjs-development.md` — **only if** using unfamiliar rendering patterns or data fetching

   Do not pre-load docs speculatively. Read only what the task actually requires.

5. **Determine the work type:**
   - Data layer only (Shopify queries, API routes, product data)
   - Components/pages only (UI work on existing data)
   - Full stack (data layer then components then page composition)

### Step 2: Plan the Approach

**Enter plan mode** for this step. Read `.claude/skills/implement/build-phases.md` and present the implementation plan using the Step 2 plan template there (what you're building, phase breakdown, conventions you'll follow, any questions).

**Wait for the user to confirm the approach.** Then **exit plan mode** and begin implementation.

### Steps 3-5: Build (data layer -> components -> page)

Build in this order, skipping phases that don't apply. Each phase has a build order, a standards check, and a checkpoint. **Read `.claude/skills/implement/build-phases.md`** for the full detail of whichever phases apply:

- **Step 3 — Data Layer** (Shopify queries, product data, API routes, cart mutations)
- **Step 4 — Components** (Server/Client decision, structure, mobile-first, design system, images, states)
- **Step 5 — Page Composition** (section orchestration, SEO, analytics, performance)

Data layer before UI -- always; the data contract must be stable before components connect to it. Consult `.claude/skills/implement/project-patterns.md` for the project file map and architectural rules while building.

**If `--no-checkpoints` is NOT set:** pause and present at the end of each phase per the checkpoint formats in build-phases.md. If it IS set, follow the same build order internally but don't pause between phases.

### Steps 6-8: Cleanup, commit, and update Jira

**Read `.claude/skills/implement/commit-and-jira.md`** and follow it:

- **Step 6 — Cleanup:** remove debug artifacts, run `npm run lint:changed` and `npm run build`, final standards check, present the completion summary.
- **Step 7 — Commit** the implementation with a clear message (stage files by name, do not push unless asked).
- **Step 8 — Update Jira** (if a ticket was provided): add an implementation comment, ask before transitioning to In Review, update the feature plan doc.

---

## Key Principles

- **The three non-negotiables are gates, not guidelines.** Mobile-first, performance, and brand alignment are not things to optimise for at the end. They are checked at every checkpoint. Nothing ships without all three passing.
- **Match the codebase** -- read before writing. Follow existing patterns even if you'd do it differently.
- **Data layer before UI** -- always. The data contract must be stable before components connect to it.
- **Every screen state matters** -- loading, success, empty, error. A page without an error state is an unfinished page.
- **Standards are not optional** -- the standards checks are not suggestions. If a check fails, fix it before presenting.
- **Thoughtful, not bureaucratic** -- skip phases that don't apply. If the work is a small component fix, don't ceremony it into four checkpoints. Use judgement.
- **Appetite awareness** -- if implementation reveals the work is larger than expected, flag it early. Don't silently expand scope.
- **Implementation teaches you things** -- if you discover something during the build that changes the approach, say so. Don't power through a plan that's no longer right.
- **Never use em dashes** in generated text or copy.
