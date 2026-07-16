/**
 * Redirects recovering the legacy Shopify blog archive (SCRUM-1157).
 *
 * The old URLs are `/blogs/news/<handle>`; the new surface is `/blog/<slug>`,
 * and the importer writes each `Slug` as its Shopify handle verbatim, so one
 * wildcard recovers all 53 imported posts.
 *
 * ORDER IS LOAD-BEARING. Next.js matches `redirects()` in array order and stops
 * at the first hit, so every specific rule must precede the wildcard. The 29
 * posts that were NOT imported have no `/blog/<handle>` to land on, so if the
 * wildcard saw them first it would 301 them straight into a 404. Consumers must
 * spread this array in order and must not sort it.
 *
 * Triage (82 posts: 53 import, 29 drop) lives in
 * docs/development/featurePlans/legacy-blog-migration.md. Generated from that
 * table, so the doc stays the source of truth.
 */
interface LegacyRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/** The 29 posts not imported, each sent to the live page that owns its topic. */
const DROPPED: LegacyRedirect[] = [
  // CANNIBALISATION
  { source: "/blogs/news/what-are-nootropics-and-how-do-they-work", destination: "/blog/what-are-nootropics", permanent: true },
  // CANNIBALISATION
  { source: "/blogs/news/the-neuroscience-of-procrastination-why-your-brain-delays-and-how-to-overcome-it", destination: "/blog/psychology-of-procrastination", permanent: true },
  // Announcement
  { source: "/blogs/news/introducing-conka-v23", destination: "/blog", permanent: true },
  // Announcement
  { source: "/blogs/news/discover-track-and-compete-with-the-all-new-conka-app", destination: "/blog", permanent: true },
  // BRAND RISK
  { source: "/blogs/news/the-nicotinic-effect-preconditioning-the-brain-for-neuroprotection", destination: "/blog", permanent: true },
  // Brand
  { source: "/blogs/news/founders-letter", destination: "/our-story", permanent: true },
  // Brand
  { source: "/blogs/news/what-is-conkas-app-technology", destination: "/app", permanent: true },
  // Brand/app
  { source: "/blogs/news/how-reliable-is-the-conka-test-a-look-at-the-latest-research", destination: "/app-insights", permanent: true },
  // Brand/product
  { source: "/blogs/news/the-science-behind-conka-1-short-term-and-long-term-benefits", destination: "/science", permanent: true },
  // Brand/product
  { source: "/blogs/news/the-science-behind-conka-2-short-term-and-long-term-benefits", destination: "/science", permanent: true },
  // CLAIMS RISK
  { source: "/blogs/news/chc5-1-conka-formula-component-no1", destination: "/blog", permanent: true },
  // Case study
  { source: "/blogs/news/the-cost-of-playing-through-pain-barneys-story", destination: "/case-studies", permanent: true },
  // Case study
  { source: "/blogs/news/bee-stillman-jones-a-journey-of-resilience-and-rediscovery", destination: "/case-studies", permanent: true },
  // Case study
  { source: "/blogs/news/from-concussions-to-comebacks-sienna-charles-journey-with-show-jumping-and-conka", destination: "/case-studies", permanent: true },
  // Case study
  { source: "/blogs/news/inside-the-brain-of-a-boxing-world-champion-chris-billam-smiths-brain-data", destination: "/case-studies", permanent: true },
  // Case study
  { source: "/blogs/news/behind-the-gloves-the-human-side-of-chris-billam-smiths-journey-to-becoming-world-champion", destination: "/case-studies", permanent: true },
  // Case study
  { source: "/blogs/news/racing-driver-josh-stanton-x-conka-16", destination: "/case-studies", permanent: true },
  // DATED
  { source: "/blogs/news/achieve-your-goals-for-2024", destination: "/blog", permanent: true },
  // EMPTY
  { source: "/blogs/news/bristol-bears-on-conka-data-insights", destination: "/blog", permanent: true },
  // EMPTY
  { source: "/blogs/news/harlequins-on-conka-protecting-athletes-from-brain-injuries", destination: "/blog", permanent: true },
  // OBSOLETE PRODUCT
  { source: "/blogs/news/10-reasons-why-capsules-work", destination: "/blog", permanent: true },
  // OBSOLETE PRODUCT
  { source: "/blogs/news/chc5-1-conka-formula-component-no3", destination: "/blog", permanent: true },
  // OBSOLETE PRODUCT
  { source: "/blogs/news/chc5-1-conka-formula-component-no4", destination: "/blog", permanent: true },
  // OBSOLETE PRODUCT
  { source: "/blogs/news/chc5-1-component-no5-vaccinium-myrtillus-boosts-your-genius-and-helps-you-overcome-stress", destination: "/blog", permanent: true },
  // PR
  { source: "/blogs/news/co-founder-harry-glover-wins-vodafone-business-gain-line-award-for-work-with-conka", destination: "/blog", permanent: true },
  // PR
  { source: "/blogs/news/bristol-bears-on-conka-taking-their-performance-to-the-next-level", destination: "/blog", permanent: true },
  // PR
  { source: "/blogs/news/conka-x-cognica", destination: "/blog", permanent: true },
  // Thin
  { source: "/blogs/news/no-brainer-with-telusa-veainu", destination: "/blog", permanent: true },
  // Thin PR
  { source: "/blogs/news/bristol-bears-on-conka-data-insights-ll", destination: "/blog", permanent: true },
];

/**
 * Every `/blogs/news/*` rule, specific first and the wildcard last.
 *
 * The wildcard covers the 53 imported posts. A handle that is imported but not
 * yet `Published` 301s to a `/blog/<slug>` that 404s until it is published;
 * that is no worse than the bare 404 it serves today, and it resolves itself
 * the moment the post goes live.
 */
export const LEGACY_BLOG_REDIRECTS: LegacyRedirect[] = [
  ...DROPPED,
  { source: "/blogs/news/:handle", destination: "/blog/:handle", permanent: true },
];
