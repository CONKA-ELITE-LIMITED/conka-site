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
   - Run linter: `npm run lint`
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
- Run `/review-page` for page audit (if page work)
- Verify on Vercel preview (mobile + desktop)
```

---

## Step 7: Commit Changes

Commit the implementation with a clear, descriptive message. **Do not push** unless the user asks.

1. **Stage the relevant files** -- add specific files by name (not `git add -A` or `git add .`). Never stage `.env` files or credentials.

2. **Write a commit message:**
   ```
   feat: Add "What to Expect" timeline to landing page

   - Created LandingTimeline component with 4-step progression
   - Added to /start page between guarantee and FAQ sections
   - Mobile-first: vertical timeline, tap-to-expand detail
   - Desktop: horizontal layout with hover states
   - Uses brand-base.css tokens (brand-radius-card, brand-h3)

   SCRUM-830

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
   ```

3. **Commit message conventions:**
   - Prefix: `feat:` (new feature), `fix:` (bug fix), `refactor:` (restructure), `chore:` (config/deps), `docs:` (documentation)
   - First line: short summary under 72 characters
   - Body: bullet points of key changes
   - Include Jira ticket key if applicable
   - Always include the Co-Authored-By line

4. **Verify** -- run `git status` after commit to confirm clean state.

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
