/**
 * Minimal .env.local loader shared by the legacy-blog scripts.
 *
 * These are one-off migration scripts run with `npx tsx`, outside Next's env
 * handling, so they read .env.local themselves. Same approach as
 * scripts/fetch-funnel-products.ts.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnv(): void {
  const envContent = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed
      .slice(eqIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

/** Read an env var, exiting with a clear message when it is absent. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
  return value;
}
