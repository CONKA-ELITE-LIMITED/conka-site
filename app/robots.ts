import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/app/lib/jsonLd";

/**
 * robots.txt for crawl discovery (SEO Phase 5, SCRUM-1136).
 *
 * Permissive by design: only private / transactional paths are disallowed.
 * - Noindex ad/funnel pages are NOT disallowed, so Google can crawl them and
 *   honour their noindex meta tag (disallowing would hide the tag).
 * - No AI / answer-engine crawler is blocked, because AEO citation is a goal.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/payment/"],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
