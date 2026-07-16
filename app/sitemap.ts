import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/app/lib/blog";
import { SITE_ORIGIN } from "@/app/lib/site";

/**
 * XML sitemap for crawl discovery (SEO Phase 5, SCRUM-1136).
 *
 * Lists canonical, indexable, self-referencing pages only. Deliberately excludes:
 * - noindex ad/funnel landers (/go/*, /funnel)
 * - redirect-only routes (/start, /lander, /shop, /quiz, /protocol, /win, /barrys)
 *   - see next.config.ts
 * - private / transactional paths (/account, /professionals/order, /payment/*)
 *
 * `lastModified` is derived from git: the date of the last commit that touched a
 * route's own source files. It is never hand-maintained, so it cannot rot, and it
 * cannot lie. It previously stamped every URL with the build time, which told
 * Google the whole site changed on every deploy - the fastest way to make a
 * crawler ignore the field entirely (SCRUM-1140).
 *
 * REQUIRES `VERCEL_DEEP_CLONE=1` in the Vercel project env. Vercel shallow-clones
 * to depth 10 by default, so without it `git log` cannot see far enough back and
 * pages untouched in the last 10 commits get no date. If git is unavailable or
 * returns nothing, the entry simply ships with no `lastmod`, which is correct:
 * omitting the hint beats inventing one.
 *
 * When a new indexable page ships, add a ROUTES line with its source paths.
 *
 * Blog posts are the exception to the git rule: they are Notion-sourced and have
 * no source file of their own, so a git date would be meaningless (every post
 * would share the date of `blog/[slug]/page.tsx`). They use Notion's
 * `last_edited_time` instead, which is the real answer to "when did this page
 * change". They come from `getAllPosts`, the single source of truth for the
 * Published filter, so a Draft can never leak into the sitemap.
 */

/** Last commit date touching any of `paths`, or undefined if git cannot tell us. */
function gitLastModified(paths: string[]): Date | undefined {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...paths],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    // No git binary, no history (shallow clone), or not a repo. Ship without a date.
    return undefined;
  }
}

interface Route {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /**
   * Every source path whose content this route renders, so the git date reflects
   * what a visitor would actually see change. Shared component directories are
   * listed on every route that renders them: editing `components/landing` really
   * does change the home page, /science and the PDPs, and the date should say so.
   */
  sources: string[];
}

const ROUTES: Route[] = [
  {
    path: "/",
    priority: 1.0,
    changeFrequency: "weekly",
    sources: [
      "app/page.tsx",
      "app/components/landing",
      "app/components/testimonials",
      "app/lib/faqContent.ts",
    ],
  },
  // Commerce
  {
    path: "/conka-both",
    priority: 0.9,
    changeFrequency: "weekly",
    sources: [
      "app/conka-both",
      "app/components/product",
      "app/components/cro",
      "app/components/landing",
      "app/components/testimonials",
      "app/lib/faqContent.ts",
      "app/lib/funnelData.ts",
    ],
  },
  {
    path: "/conka-flow",
    priority: 0.9,
    changeFrequency: "weekly",
    sources: [
      "app/conka-flow",
      "app/components/product",
      "app/components/cro",
      "app/components/home",
      "app/components/landing",
      "app/components/testimonials",
      "app/lib/formulaContent.ts",
      "app/lib/funnelData.ts",
    ],
  },
  {
    path: "/conka-clarity",
    priority: 0.9,
    changeFrequency: "weekly",
    sources: [
      "app/conka-clarity",
      "app/components/product",
      "app/components/cro",
      "app/components/home",
      "app/components/landing",
      "app/components/testimonials",
      "app/lib/formulaContent.ts",
      "app/lib/funnelData.ts",
    ],
  },
  {
    path: "/ingredients",
    priority: 0.8,
    changeFrequency: "monthly",
    sources: ["app/ingredients", "app/components/ingredients"],
  },
  // Content
  {
    path: "/faq",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: ["app/faq", "app/components/faq", "app/lib/faqContent.ts"],
  },
  {
    path: "/science",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: [
      "app/science",
      "app/components/science",
      "app/components/app",
      "app/components/landing",
    ],
  },
  {
    path: "/why-conka",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: ["app/why-conka", "app/components/why-conka"],
  },
  {
    path: "/our-story",
    priority: 0.6,
    changeFrequency: "monthly",
    sources: ["app/our-story"],
  },
  {
    path: "/case-studies",
    priority: 0.6,
    changeFrequency: "monthly",
    sources: [
      "app/case-studies",
      "app/components/case-studies",
      "app/components/landing",
    ],
  },
  {
    path: "/app",
    priority: 0.6,
    changeFrequency: "monthly",
    sources: ["app/app"],
  },
  {
    path: "/app-insights",
    priority: 0.5,
    changeFrequency: "monthly",
    sources: [
      "app/app-insights",
      "app/components/app",
      "app/components/insights",
    ],
  },
  {
    path: "/professionals",
    priority: 0.6,
    changeFrequency: "monthly",
    sources: ["app/professionals/page.tsx", "app/components/b2b"],
  },
  // Legal / utility
  {
    path: "/shipping",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["app/shipping"],
  },
  {
    path: "/privacy",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["app/privacy"],
  },
  {
    path: "/terms",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["app/terms"],
  },
  {
    path: "/cookies",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["app/cookies"],
  },
  {
    path: "/conkaapp-privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["app/conkaapp-privacy-policy"],
  },
];

/**
 * The blog index plus one entry per Published post.
 *
 * The index is dated by its newest post rather than by git: what a visitor sees
 * change there is the list of posts, not the component that renders it. Returns
 * nothing at all if Notion is unreachable, since `getAllPosts` degrades to an
 * empty array by design.
 */
async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  if (posts.length === 0) return [];

  const newest = posts
    .map((p) => new Date(p.dateModified))
    .reduce((a, b) => (a > b ? a : b));

  return [
    {
      url: `${SITE_ORIGIN}/blog`,
      lastModified: newest,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${SITE_ORIGIN}/blog/${post.slug}`,
      // Notion's last_edited_time: a Notion-sourced route has no git file.
      lastModified: new Date(post.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...ROUTES.map(({ path, priority, changeFrequency, sources }) => ({
      url: `${SITE_ORIGIN}${path}`,
      lastModified: gitLastModified(sources),
      changeFrequency,
      priority,
    })),
    ...(await blogEntries()),
  ];
}
