Cleanup, commit, and the hand-off to `/track` for /implement (Steps 6-8 of the standard Process, run after the build phases).

---

## Step 6: Cleanup

Final pass before presenting the completed work:

1. **Remove debug artifacts:**
   - No `console.log()` statements
   - No commented-out code
   - No TODO comments (resolve them or flag explicitly)

2. **Code hygiene:**
   - No unused imports or variables
   - All new files follow project naming conventions (PascalCase components, camelCase utils)
   - Run linter on changed files: `npm run lint:changed`
   - Run build: `npm run build` (verify no build errors)

3. **Final standards check** -- run through all applicable checklists one more time against the complete changeset.

4. **Present summary:**
```
### Implementation Complete

**What was built:**
- [Summary of all changes]

**Files created:**
- [New files]

**Files modified:**
- [Changed files]

**Decisions made during implementation:**
- [Key choices and rationale]

**Standards checks:** All passed

**Preview:** Push branch for Vercel preview deployment

**Next steps:**
- Run `/review` (code + analytics) and `/design-review` (visual/mobile) as needed
- Run `/lens` for the conversion/voice audit (if page work)
- Verify on Vercel preview (mobile + desktop)
```

---

## Step 7: Commit Changes

**Read `.claude/skills/commit/SKILL.md` and follow it exactly** -- it owns the branch guard (never commit on main), the one-line changelog entry, staging specific files by name, the prefix table, and the co-author line. Include the Jira ticket key in the commit body if applicable. **Do not push** unless the user asks.

---

## Step 8: Track

**Read `~/.claude/skills/track/SKILL.md` and run it in `done` mode** (invoked by /implement). It owns everything after the commit:

- Rewrites the ticket's `## Current state` block
- Adds one delivery comment (what changed, files, branch for the Vercel preview, reviewer notes)
- Asks before transitioning to In Review; the user may want to check the preview first
- Updates canonical docs made stale by this work, per `docs/workflows/05-creating-documentation.md`
- Retires the feature plan if this closed its last active phase (delete by default)

If there is no ticket and no plan, skip this step.

---

## Jira Reference

- **Cloud ID:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **Project Key:** `SCRUM`
- **User Account ID:** `712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6`
- Workflow process: `docs/workflows/08-jira-workflow.md`
