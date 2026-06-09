Quick Mode for /implement (the `--quick` branch — replaces the standard Process entirely).

**Triggered by `--quick` flag.** Use for bug fixes, copy tweaks, styling adjustments, small additions — anything under 3 files with no architecture change.

## What changes
- **No plan mode** — state the approach in 1-2 sentences, then build
- **No secondary doc reads** — read `CLAUDE.md` and the affected files only
- **No checkpoints** — build end-to-end
- **No Jira update** — skip ticket transitions and comments
- **No feature plan** — skip featurePlans search

## Quick Mode process

1. **Read** `CLAUDE.md` and the specific files being changed. Nothing else unless genuinely needed.
2. **State the approach** in 1-2 sentences (not a full plan).
3. **Build** — make the change.
4. **Run `npm run lint:changed`** to verify no issues.
5. **Commit** with a clear message. Do not push.
6. **Present** what changed in 3-4 bullet points.

The three non-negotiables (mobile-first, performance, brand alignment) still apply — quick mode is a ceremony reduction, not a quality reduction.
