/**
 * The shared body of every listing surface: the index, its paginated pages, and
 * the topic hubs. Content only, so each page owns its own section wrapper,
 * background and track.
 *
 * One component rather than three near-identical page bodies: the three differ
 * only in their copy, which posts they hold, and whether they paginate.
 */
import BlogGrid from "./BlogGrid";
import Pagination from "./Pagination";
import TopicNav from "./TopicNav";
import type { BlogPostSummary } from "@/app/lib/blogTransform";

export default function BlogListing({
  eyebrow,
  heading,
  intro,
  topics,
  activeTopic = null,
  posts,
  page = 1,
  totalPages = 1,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  topics: string[];
  activeTopic?: string | null;
  posts: BlogPostSummary[];
  page?: number;
  totalPages?: number;
}) {
  return (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
        {eyebrow}
      </p>
      <h1 className="brand-h1 mt-3">{heading}</h1>
      <p className="brand-body mt-4 text-black/60">{intro}</p>

      <div className="mt-8">
        <TopicNav topics={topics} activeTopic={activeTopic} />
      </div>

      {posts.length > 0 ? (
        <>
          <div className="mt-10">
            <BlogGrid posts={posts} />
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </>
      ) : (
        <p className="brand-body mt-10 text-black/50">
          New articles are coming soon.
        </p>
      )}
    </>
  );
}
