/**
 * The post grid, shared by /blog, the paginated pages, the topic hubs and
 * RelatedPosts. Extracted rather than copied a third time: the geometry is the
 * same everywhere and only the list differs.
 */
import BlogCard from "./BlogCard";
import type { BlogPostSummary } from "@/app/lib/blogTransform";

export default function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
