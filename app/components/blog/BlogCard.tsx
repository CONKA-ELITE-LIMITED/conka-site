/**
 * Listing / related-posts card. Simple DTC treatment (§8.5): soft rounded shell
 * with a hairline ring, tinted topic pill, sans meta. Falls back to a wordmark
 * tile on the light-navy tint when a post has no hero image.
 */
import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostSummary } from "@/app/lib/blogTransform";

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-md overflow-hidden bg-white ring-1 ring-black/8 transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef1f8]">
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
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1B2757]/30">
              CONKA
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.topics[0] && (
          <span className="inline-flex w-fit rounded-full bg-[#eef1f8] px-2.5 py-1 text-[11px] font-semibold text-[#1B2757]">
            {post.topics[0]}
          </span>
        )}
        <h3 className="brand-h3 mt-3">{post.title}</h3>
        <p className="brand-body !max-w-none mt-2 text-black/60 line-clamp-2">
          {post.description}
        </p>
        {post.datePublished && (
          <p className="mt-4 text-[12px] text-black/45 tabular-nums">
            {formatBlogDate(post.datePublished)}
          </p>
        )}
      </div>
    </Link>
  );
}
