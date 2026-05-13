---
name: commit
description: Stage specific files, update CHANGELOG.md, and commit with the correct message format. Refuses to run on main branch. Use after completing a piece of work ready to go into git history.
argument-hint: [optional: short description of what you are committing]
allowed-tools: Bash, Read, Edit
---

# /commit -- Commit the Right Way

You are the last gate before code goes into git history. Your job is three things: update the changelog, stage specific files, and write a clean commit message. No wildcards. No committing on main.

---

## Quick Reference

```
/commit                          # Commit all changed files after a build
/commit fix for cart drawer      # Hint about what is in scope
```

---

## Step 0: Continuity check (always run first)

**Signs you're continuing:** changelog entry already written this session, files already staged.

**If continuing:** skip Step 1, go directly to Step 3 (stage and commit).
**If starting fresh:** run all steps below.

---

## Process

### Step 1: Orientation (silent)

Run in parallel:

```bash
git branch --show-current
git status
git diff
git diff --cached
git log --oneline -5
```

**If the current branch is `main`:** stop immediately. Output:

> Refusing to commit on main. Please switch to a feature branch first: `git checkout -b <branch-name>`

Do not proceed.

---

### Step 2: Update CHANGELOG.md

Open `docs/CHANGELOG.md`. Add an entry at the top of the current month block (or create a new month block if needed):

```
### YYYY-MM-DD -- [Short title of what changed]

[2-4 sentences describing what changed and why. Focus on the why and user-visible impact, not implementation details. Those live in git history.]

**Modified:** [key files changed]
```

Rules:
- Use today's date
- Title is descriptive ("Funnel back button fix"), not a ticket number
- No em dashes
- Bullet points for multi-part changes

---

### Step 3: Stage specific files

Review `git status`. Stage only the files that belong to this change by name:

```bash
git add path/to/file1.tsx path/to/file2.ts
```

**Never use `git add -A` or `git add .`** -- these can accidentally include env files, local configs, or unrelated work. If unsure which files to include, ask the user.

---

### Step 4: Commit

Determine the correct prefix:

| Change type | Prefix |
|-------------|--------|
| New feature or page | `feat:` |
| Bug fix | `fix:` |
| Refactor (no behaviour change) | `refactor:` |
| Documentation or changelog | `docs:` |
| Infrastructure, tooling, config | `chore:` |
| Styling only | `style:` |

Write the commit using a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
<prefix>: <short description in imperative mood>

<optional body if context is non-obvious>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Run `git status` after to confirm the commit succeeded.

---

## Key Principles

- **Never commit on main.** Always a feature branch.
- **Never `git add -A`.** Stage specific files; review what you are including.
- **Changelog first.** The commit message is for git history. The changelog is for humans.
- **Imperative mood.** "Add hero section" not "Added hero section".
- **Co-author line always.** Include it on every commit.
- **Never use em dashes** in commit messages or changelog entries.
