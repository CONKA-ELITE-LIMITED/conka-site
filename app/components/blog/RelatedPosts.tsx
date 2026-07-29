/** End-of-article related-posts grid. Renders nothing when there are none. */
import BlogGrid from "./BlogGrid";
import type { BlogPostSummary } from "@/app/lib/blogTransform";

export default function RelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;
  return (
    <div>
      <p className="text-lg font-semibold tracking-tight text-black">
        More reading
      </p>
      <div className="mt-5">
        <BlogGrid posts={posts} />
      </div>
    </div>
  );
}
