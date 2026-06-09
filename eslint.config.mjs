import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Build output at any depth (root .next, and nested .next inside
    // stale worktrees under .claude/). Unanchored ".next/**" only matched
    // the root, so a worktree's compiled vendor JS was being linted and
    // produced thousands of phantom no-unused-expressions violations.
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "next-env.d.ts",
    // Stale git worktrees are full duplicate checkouts; never lint them.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
