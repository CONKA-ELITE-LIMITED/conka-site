---
name: branch
description: Start a fresh feature branch off main - stashes any uncommitted work under a name tied to the branch it belongs to, switches to main, pulls, and branches off. Use when asked to "branch off", "go back to main and branch", "new branch for this", or "/branch".
argument-hint: <branch name or short description of the new work>
allowed-tools: Bash
---

# /branch -- Fresh Branch Off Main, Nothing Lost

Get onto a clean feature branch off up-to-date main, parking any uncommitted work safely and findably.

## Process

1. **Orient:** `git branch --show-current && git status --short`

2. **Stash if the tree is dirty** (skip if clean). Name the stash after the branch the work belongs to plus a summary derived from the changed files:

   ```bash
   git stash push -u -m "<current-branch>: <short summary of the changes>"
   ```

   `-u` includes untracked files. Always report exactly which files went into the stash; never let work vanish silently. If the changes look like they belong to another parallel session, still stash (a dirty tree blocks the switch) but call it out in the report.

3. **Switch and update:** `git checkout main && git pull --ff-only`. If the pull fails (offline, diverged), say so and continue from local main.

4. **Branch off with a plain checkout:**

   ```bash
   git checkout -b <prefix>/<kebab-name>
   ```

   Derive the name from the argument or the stated work. Prefix by intent: `feature/` (default), `fix/`, `docs/`. **Never** `git checkout -b <name> origin/main` -- tracking origin/main makes later pushes land directly on main.

5. **Report** in 2-3 lines: the new branch, and if anything was stashed, its message and the recovery command:

   ```
   git checkout <original-branch> && git stash pop
   ```

## Rules

- Stash, never discard. No `git checkout -- .`, no `git reset --hard`, ever.
- If already on main with a clean tree, this is just steps 3-4.
- If the current branch's work is committed but unpushed, no stash is needed; just note the branch has unpushed commits.
- Do not push the new branch; the user pushes from Git Fork.
