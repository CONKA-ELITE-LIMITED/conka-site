/**
 * Canonical site origin. Single source of truth for the production URL, used by
 * `metadataBase` (app/layout.tsx), JSON-LD absolute URLs (app/lib/jsonLd.tsx),
 * the sitemap and robots. Non-secret and identical across environments, so it
 * lives in code rather than an env var.
 */
export const SITE_ORIGIN = "https://www.conka.io";
