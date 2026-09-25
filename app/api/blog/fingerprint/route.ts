import { NextResponse } from "next/server";
import { getPublishedFingerprint } from "@/app/lib/blog";

/**
 * The fingerprint of the blog this deploy was built with (SCRUM-1460).
 *
 * Prerendered at build from the same one-per-build Notion snapshot the blog
 * pages render from, so it describes exactly what is live. The auto-publish
 * cron (`/api/cron/blog-publish`) compares it with a fresh Notion read and
 * redeploys when they differ.
 */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      fingerprint: await getPublishedFingerprint(),
      builtAt: new Date().toISOString(),
    },
    { headers: { "X-Robots-Tag": "noindex" } },
  );
}
