---
name: commit
description: Stage specific files by name, append a one-line changelog entry (skipped for chores), and commit with the correct prefix and co-author line. Refuses to run on main. Use when work is ready to go into git history, e.g. "commit this" or "/commit".
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

### Step 2: Append a changelog line (skip for pure chores)

`docs/CHANGELOG.md` is a high-level "what changed and when" log. Keep each entry to ONE plain-language line. Skip this step entirely for chores, config, or no-impact refactors.

**Append without reading the file.** Insert one dated line after the marker with a single command (this never loads the long changelog into context):

```bash
awk -v e="- **$(date +%F)** | <high-level summary of what changed>" \
  '{print} /changelog:newest/ && !d {print e; d=1}' \
  docs/CHANGELOG.md > docs/CHANGELOG.md.tmp && mv docs/CHANGELOG.md.tmp docs/CHANGELOG.md
```

Rules:
- One line, high level: what changed and why it matters, as a phrase. Details live in git history and PRs.
- Never open or read the whole changelog. The `awk` insert needs no read.
- No "Modified:" file list (git already has it). No em dashes.

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

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Run `git status` after to confirm the commit succeeded.

---

## Key Principles

- **Never commit on main.** Always a feature branch.
- **Never `git add -A`.** Stage specific files; review what you are including.
- **Changelog is one line, and optional.** Skip it for chores. The commit message serves git history; the changelog gives humans high-level optics. Never read the whole changelog to append.
- **Lint only what changed.** If linting before commit: `npm run lint:changed`. Never `npm run lint` (whole repo).
- **Imperative mood.** "Add hero section" not "Added hero section".
- **Co-author line always.** Include it on every commit.
- **Never use em dashes** in commit messages or changelog entries.
