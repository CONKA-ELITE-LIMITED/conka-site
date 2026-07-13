import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/app/lib/jsonLd";

/**
 * XML sitemap for crawl discovery (SEO Phase 5, SCRUM-1136).
 *
 * Lists canonical, indexable, self-referencing pages only. Deliberately excludes:
 * - noindex ad/funnel landers (/go/*, /funnel, /barrys, /win)
 * - redirect-only routes (/start, /lander, /shop, /quiz, /protocol) - see next.config.ts
 * - private / transactional paths (/account, /professionals/order, /payment/*)
 *
 * Add a line here whenever a new indexable page ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1.0, "weekly"),
    // Commerce
    entry("/conka-both", 0.9, "weekly"),
    entry("/conka-flow", 0.9, "weekly"),
    entry("/conka-clarity", 0.9, "weekly"),
    entry("/ingredients", 0.8, "monthly"),
    // Content
    entry("/science", 0.7, "monthly"),
    entry("/why-conka", 0.7, "monthly"),
    entry("/our-story", 0.6, "monthly"),
    entry("/case-studies", 0.6, "monthly"),
    entry("/app", 0.6, "monthly"),
    entry("/app-insights", 0.5, "monthly"),
    entry("/professionals", 0.6, "monthly"),
    // Legal / utility
    entry("/shipping", 0.3, "yearly"),
    entry("/privacy", 0.3, "yearly"),
    entry("/terms", 0.3, "yearly"),
    entry("/cookies", 0.3, "yearly"),
    entry("/conkaapp-privacy-policy", 0.3, "yearly"),
  ];
}
