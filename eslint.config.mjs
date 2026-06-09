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
    // Convex codegen output is generated; not ours to lint.
    "convex/_generated/**",
  ]),
  {
    rules: {
      // `any` here mostly types third-party payloads (Loop, Triple Whale, auth)
      // whose shapes we don't own. Warn, don't block; fix opportunistically.
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow intentional unused via leading underscore: route-handler args,
      // caught errors kept for signature, deliberately-ignored values.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
