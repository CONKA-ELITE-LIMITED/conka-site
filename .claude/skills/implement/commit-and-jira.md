Cleanup, commit, and Jira wrap-up for /implement (Steps 6-8 of the standard Process, run after the build phases).

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

## Step 8: Update Jira

**If a Jira ticket was provided:**

1. **Add an implementation comment** to the ticket:
   ```
   **Implementation summary:**
   - [Key thing built/changed 1]
   - [Key thing built/changed 2]

   **Files changed:** [list key files or areas]

   **Preview:** [branch name] -- Vercel preview will be available once pushed

   **Notes:**
   - [Decisions, gotchas, or things the reviewer should know]
   ```
   Use `contentFormat: markdown` when adding the comment.

2. **Ask the user if they want to transition to In Review.**
   - If yes, find the "In Review" transition via `getTransitionsForJiraIssue` and apply it via `transitionJiraIssue`
   - Only transition if the user confirms -- they may want to review the preview first

3. **Update the feature plan document** (if one exists) -- mark the relevant phase/task as Done or In Review.

---

## Jira Reference

- **Cloud ID:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **Project Key:** `SCRUM`
- **User Account ID:** `712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6`
- Workflow process: `docs/workflows/08-jira-workflow.md`
