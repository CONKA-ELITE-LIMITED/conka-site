/**
 * Listing / related-posts card. Clinical treatment: hard border, zero radius,
 * mono meta. Falls back to a wordmark tile when a post has no hero image.
 */
import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostSummary } from "@/app/lib/blogTransform";

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col border border-black/12 hover:border-black/40 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black/[0.03]">
        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-sm uppercase tracking-[0.4em] text-black/25">
              CONKA
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.topics[0] && (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
            {post.topics[0]}
          </p>
        )}
        <h3 className="brand-h3 mt-2">{post.title}</h3>
        <p className="brand-body !max-w-none mt-2 text-black/60 line-clamp-2">
          {post.description}
        </p>
        {post.datePublished && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
            {formatBlogDate(post.datePublished)}
          </p>
        )}
      </div>
    </Link>
  );
}
