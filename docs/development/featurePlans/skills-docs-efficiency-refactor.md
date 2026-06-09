# Skills + Docs Efficiency Refactor

> Internal tooling refactor. Plan doc only, no Jira tickets.
> Created 2026-06-09. Branch: `PROJECT-CLEANUP-IMPROVMENT`.

## Problem

Responses are slow and token-heavy on small tasks. Causes split two ways:

**Behavioral (the bigger driver):**
- Full-file `Write` on every tweak instead of targeted `Edit`.
- Running full-repo `npm run lint` (~3,950 issues) manually on every commit.
- Too much prose/reasoning per turn; one tweak per round-trip.
- Long conversations reprocessed in full each reply.

**Structural:**
- 33,330 lines of docs across 71 files, with legacy/dead weight (REPLO, superseded landing-page plans, premium-base references).
- `DESIGN_SYSTEM.md` is 650 lines and over-prescribes clinical detailing we are now dialing back.
- `CHANGELOG.md` is 1,991 lines and is edited on every commit.
- Lint count is 3,950 but 79% is one rule (`@typescript-eslint/no-unused-expressions`, 3,123 hits) - almost certainly a config artifact, not 3,123 real bugs.

## Appetite and tracking

Scale C, front-loaded. Phase 1 delivers most of the felt relief in well under a day. Plan doc only; no Jira.

## Key insight

The biggest wins are not skill rewrites. They are (a) a tight efficiency doctrine the model reads every session, and (b) diagnosing one misconfigured lint rule. Skills are secondary. This is reinforced by Anthropic's skill guide: verbose instructions, oversized SKILL.md files, and weak `description` triggers are named anti-patterns that cause both wasted tokens and wrong triggering.

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Efficiency doctrine + skill diet | Done (commit 80dc79dc) |
| 2 | Lint debt, config-first | Not Started |
| 3 | Docs cleanup + design-system restraint | Not Started |
| 4 | Self-improving skill loop | Future |

## Phase 1 - Efficiency doctrine + skill diet (ACTIVE)

1. **Efficiency doctrine** - Add a short "Operating efficiency" block to CLAUDE.md (~12 lines): prefer `Edit` over `Write`; never `npm run lint` the whole repo (use `npx eslint <changed files>`); batch independent tool calls per turn; minimal prose; delegate large reads to subagents; `/clear` between unrelated tasks. Highest-value change. Small.
2. **Skill frontmatter audit** - Check every skill's `description` includes both what-it-does and when-to-use (trigger phrases). Weak descriptions cause both failure-to-load and load-when-not-needed (token waste). Per Anthropic: `[What] + [When] + [Key capabilities]`, under 1024 chars. Small.
3. **Commit skill** - Address the 1,991-line CHANGELOG edited every commit (the real per-commit cost): lighter append or batch it. Add an optional fast staged-file lint. Small.
4. **Scope skill** - Add an explicit "plan-doc-only / no-Jira" early exit so it stops Jira chatter when tracking is not wanted. Small.
5. **Split the `implement` skill** - At 621 lines it exceeds the progressive-disclosure guidance. Move mode-specific detail to `references/` following the pattern the `scope` skill already uses. Medium.

## Phase 2 - Lint debt, config-first (ACTIVE)

6. **Diagnose `no-unused-expressions` (3,123 hits)** - Find why one rule fires 3,000+ times. Likely a misconfigured rule, generated/vendored files being linted, or a parser issue. Fix at config/ignore layer first. Medium, but probably collapses the count ~79% with no hand-edits.
7. **Autofix + triage remainder** - `eslint --fix` pass, then downgrade/disable genuinely noisy rules (to `warn`, not blanket off) and hand-fix what is left (the ~491 unused-vars, 181 rules-of-hooks). Medium.
8. **Scoped lint script** - Add `lint:changed` (or lint-staged) so linting is fast and routine. Small.

## Phase 3 - Docs cleanup + design-system restraint (ACTIVE)

9. **Delete dead docs** - REPLO_*, landing-page-v2 + v2.1 (superseded), stale MASTER_CONTEXT premium refs; verify conkaAppData usage before removing. Grep for references before each deletion. Small.
10. **Trim DESIGN_SYSTEM.md + add restraint guidance** - Cut legacy/premium-base sections; add explicit guidance that clinical detailing is now occasional not default: drop the sub-line by default (matching current `app/page.tsx`), reduce visual noise while keeping sharp lines. Medium.
11. **Reconcile CLAUDE.md doc index** - Remove pointers to deleted docs. Small.

## Phase 4 - Self-improving skill loop (FUTURE)

**Reality check:** "Self-improving skills" in both Anthropic's guide and the creatoreconomy tutorial is **manual-review-plus-feedback-log, not autonomous self-rewriting.** No mechanism edits the skills on its own. Scope Phase 4 accordingly:

- **`skill-editor` skill** - A skill we run periodically to keep other skills concise and flag vague descriptions, over/under-triggering, and bloat. This is the actual "self-improvement" engine and it is human-triggered.
- **Per-skill `memory.md`** - A reverse-chronological lessons log a skill references, capturing fuzzy feedback ("be less verbose with Jira") that does not fit a pass/fail check.
- **Manual feedback loop** - When a skill underperforms, bring the failure back explicitly: "use the issue identified in this chat to improve how the skill handles X."
- **Acceptance test for the whole refactor** - Anthropic's performance comparison: run a sample commit and a sample scope before vs after, counting tool calls + tokens. That is how we prove Phases 1-3 worked.

## Rabbit holes

- **Hand-fixing 3,950 lint violations before diagnosing.** Do NOT. Diagnose the dominant rule first; the count is probably a config artifact.
- **Rewriting skills wholesale.** Most are single-file and fine. Trim/split a few (commit, scope, implement), do not rebuild the set.
- **Design-system bikeshedding.** Restraint guidance is a few clear rules, not a redesign.
- **Building an autonomous self-improving loop.** It does not exist in either source; do not invent one.

## No-gos

- No Jira tickets.
- No new design system; no visual redesign of live pages (docs only this round).
- Phase 4 not built now; captured for later.

## Risks

- Disabling lint rules could mask real bugs - downgrade to `warn` and scope ignores to generated paths rather than blanket-disabling.
- Trimming docs could drop something referenced elsewhere - grep for references before deleting each file.

## References

- Anthropic, "The Complete Guide to Building Skills for Claude" (Jan 2026): three-level progressive disclosure; `description` = `[What] + [When] + [Key capabilities]`; SKILL.md under ~5,000 words; verbose/buried instructions are anti-patterns; test by triggering + functional + performance comparison.
- creatoreconomy.so, "Build self-improving Claude skills": evals loop + `memory.md` + `skill-editor`; confirms no autonomous self-modification.
- Current state: 9 skills (scope is multi-file/progressive-disclosure already; implement is 621 lines); ESLint flat config at `eslint.config.mjs`; no pre-commit hook; commit skill does not currently lint.
