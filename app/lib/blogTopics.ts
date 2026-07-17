/**
 * Topic hubs for /blog (SCRUM-1162).
 *
 * Topics live on the Notion row as a multi-select; this derives the hub routes
 * from whatever the published posts actually carry, rather than from a hardcoded
 * list. A topic option that exists in Notion but has no published post therefore
 * generates no hub (ADHD today), which is also the empty-hub answer: there is
 * nothing to decide, the data decides.
 *
 * Membership is `includes`, not "first topic wins", so a post carrying Sport and
 * Concussion appears under both. The card eyebrow still shows `topics[0]` as the
 * primary, which is a display choice and not a membership one.
 */
import { getAllPosts } from "./blog";
import type { BlogPostSummary } from "./blogTransform";

/** Posts per page on the index. 55 posts currently gives 5 pages. */
export const BLOG_PAGE_SIZE = 12;

/** "Brain Ageing" -> "brain-ageing". The inverse is resolved by matching, never by unslugging. */
export function slugifyTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every topic carried by at least one published post, newest-first by first appearance. */
export async function getTopics(
  opts: { includeUnpublished?: boolean } = {},
): Promise<string[]> {
  const posts = await getAllPosts(opts);
  const seen = new Set<string>();
  for (const post of posts) for (const topic of post.topics) seen.add(topic);
  return [...seen].sort((a, b) => a.localeCompare(b));
}

/** Topic slugs for `generateStaticParams`. */
export async function getTopicSlugs(
  opts: { includeUnpublished?: boolean } = {},
): Promise<string[]> {
  return (await getTopics(opts)).map(slugifyTopic);
}

/**
 * The topic whose slug matches, or null. Resolved by matching real topic names
 * so a name Notion changes cannot be silently reconstructed into a wrong label.
 */
export async function resolveTopic(
  slug: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<string | null> {
  return (await getTopics(opts)).find((t) => slugifyTopic(t) === slug) ?? null;
}

/** Every published post carrying a topic, newest first. */
export async function getPostsByTopic(
  topic: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<BlogPostSummary[]> {
  const posts = await getAllPosts(opts);
  return posts.filter((post) => post.topics.includes(topic));
}

export interface BlogPage {
  posts: BlogPostSummary[];
  page: number;
  totalPages: number;
}

/**
 * One page of the index, 1-based. Page 1 is `/blog` itself, not `/blog/page/1`,
 * so the index keeps its URL and does not become a duplicate of a paginated one.
 *
 * `totalPages` is at least 1: an empty blog is one empty page, not zero pages,
 * which keeps `/blog` a valid route rather than a 404.
 */
export async function getPostPage(
  page: number,
  opts: { includeUnpublished?: boolean } = {},
): Promise<BlogPage> {
  const posts = await getAllPosts(opts);
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return {
    posts: posts.slice(start, start + BLOG_PAGE_SIZE),
    page,
    totalPages,
  };
}
