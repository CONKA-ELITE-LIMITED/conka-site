/**
 * Build-time integrity guards for the blog (SCRUM-1163). Server-only.
 *
 * The blog is fully static: Notion is read at build only. Two failure modes are
 * silent, so a wrong blog can ship on a green build with no error output. These
 * guards turn both into a loud build failure.
 *
 * These sit alongside, and do not replace, the throw-on-failure behaviour in
 * `notion.ts` (SCRUM-1157). A Notion outage still fails the build there; these
 * catch the cases where every individual query *succeeds* but the results are
 * mutually inconsistent or implausibly thin.
 */
import "server-only";

/**
 * The published-post count must not drop below this or the build fails.
 *
 * 55 posts are published today. 40 is low enough not to trip on a handful of
 * deliberate unpublishes, and high enough that a mass-unpublish or a thin read
 * (a race returning a near-empty snapshot) cannot quietly ship an empty blog.
 * Raise it as the archive grows; it is a floor, not a target.
 */
export const PUBLISHED_POST_FLOOR = 40;

/**
 * The published-slug set as first seen this build, or null before the first read.
 *
 * Module-level, so it is shared across every read within one build process. On
 * Vercel a build can fan static generation across worker processes, each with
 * its own module state, so this catches an inconsistency between two reads in the
 * same process. The process-independent half of defect 1 (a slug enumerated by
 * `generateStaticParams` that the page render then cannot find) is caught at the
 * route instead, by throwing rather than calling `notFound()` (see
 * `app/blog/[slug]/page.tsx`).
 */
let firstSeen: Set<string> | null = null;

/**
 * Assert that the published-slug set has not changed since the first read this
 * build. Notion is eventually consistent right after a write, and `react.cache`
 * dedupes per request, not per build, so `generateStaticParams`, each post
 * render, and the sitemap can each observe a different snapshot. Nothing throws,
 * because nothing failed: only this comparison catches the disagreement.
 *
 * The first call records the snapshot; every later call compares against it.
 */
export function assertConsistentSlugs(slugs: string[]): void {
  const current = new Set(slugs);
  if (firstSeen === null) {
    firstSeen = current;
    return;
  }

  const baseline = firstSeen;
  const missing = [...baseline].filter((slug) => !current.has(slug));
  const added = [...current].filter((slug) => !baseline.has(slug));
  if (missing.length === 0 && added.length === 0) return;

  throw new Error(
    "[blog] the published post set changed mid-build, refusing to ship an " +
      "inconsistent blog. A build racing a Notion write can bake a 404 into a " +
      "live post or drop it from the sitemap (SCRUM-1163, defect 1). Rebuild " +
      "once Notion has settled.\n" +
      `  present at first read, gone now: ${missing.join(", ") || "(none)"}\n` +
      `  absent at first read, here now: ${added.join(", ") || "(none)"}`,
  );
}

/**
 * Assert the published-post count is not below the floor. Guards a mass-unpublish
 * or a thin read that would otherwise ship a near-empty blog on a green build.
 */
export function assertPostFloor(count: number): void {
  if (count >= PUBLISHED_POST_FLOOR) return;
  throw new Error(
    `[blog] only ${count} published posts, below the floor of ` +
      `${PUBLISHED_POST_FLOOR}. Refusing to build a near-empty blog: this is far ` +
      "more likely a mass-unpublish or a thin/racy Notion read than a real " +
      "archive this small (SCRUM-1163). If the archive really did shrink this " +
      "far, lower PUBLISHED_POST_FLOOR in app/lib/blogBuildGuard.ts.",
  );
}
