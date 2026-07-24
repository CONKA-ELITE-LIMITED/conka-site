import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import MarkdownBody from "@/app/components/blog/MarkdownBody";
import ProductCTA from "@/app/components/blog/ProductCTA";
import RelatedPosts from "@/app/components/blog/RelatedPosts";
import {
  diagnoseMissingPost,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/app/lib/blog";
import { formatBlogDate } from "@/app/lib/blogTransform";
import { JsonLd, buildBlogPostingSchema, buildFaqSchema } from "@/app/lib/jsonLd";

// includeUnpublished renders Drafts in dev preview; the loader keeps a
// production build Published-only.
const PREVIEW = { includeUnpublished: true };

// Only slugs from generateStaticParams exist. A fully static blog has no
// runtime post rendering, so an unknown slug is a 404 without a Notion read.
// This also lets the render below treat a null post as an inconsistency rather
// than a missing page (SCRUM-1163, defect 1).
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts(PREVIEW);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, PREVIEW);
  if (!post) return {};
  const images = post.heroImage ? [post.heroImage] : undefined;
  return {
    title: `${post.title} | CONKA`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, PREVIEW);
  if (!post) {
    if (process.env.NODE_ENV === "production") {
      // dynamicParams is false, so in a production build this slug came from
      // generateStaticParams. A null here is not a missing page (SCRUM-1163,
      // defect 1), so fail the build rather than bake a 404 into a live post.
      // The diagnosis says what was actually observed instead of asserting a
      // cause, which the old message did wrongly enough to send SCRUM-1179
      // hunting a race that a content defect can also produce.
      throw new Error(
        `[blog] getPostBySlug("${slug}") returned null for a slug that ` +
          `generateStaticParams enumerated, and ${await diagnoseMissingPost(
            slug,
            PREVIEW,
          )} Refusing to prerender a 404 for a live post.`,
      );
    }
    notFound();
  }

  const related = await getRelatedPosts(slug, PREVIEW);

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <JsonLd
        schema={buildBlogPostingSchema({
          title: post.title,
          description: post.description,
          urlPath: `/blog/${post.slug}`,
          imagePath: post.heroImage,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
        })}
      />
      {/* Only when the post actually has an FAQ: an empty FAQPage is a
          structured-data error, and the format is optional per the engine brief. */}
      {post.faq.length > 0 && <JsonLd schema={buildFaqSchema(post.faq)} />}

      <Navigation />

      <article>
        <section
          className="brand-section brand-hero-first brand-bg-white"
          style={{ paddingTop: "5rem" }}
          aria-label={post.title}
        >
          <div className="brand-track">
            <div className="max-w-[720px]">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
                <Link href="/blog" className="hover:text-black transition-colors">
                  &larr; Blog
                </Link>
                {post.topics[0] && (
                  <span className="text-black/40">{post.topics[0]}</span>
                )}
              </div>
              <h1 className="brand-h1 mt-4">{post.title}</h1>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 tabular-nums">
                CONKA
                {post.datePublished
                  ? ` · ${formatBlogDate(post.datePublished)}`
                  : ""}
                {` · ${post.readingTime} min read`}
              </p>
            </div>

            {post.heroImage && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-black/[0.03]">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-10 max-w-[65ch]">
              <MarkdownBody markdown={post.bodyMarkdown} />
            </div>

            <div className="mt-12 max-w-[720px]">
              <ProductCTA product={post.relatedProducts[0] ?? "both"} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="brand-section brand-bg-tint" aria-label="More reading">
            <div className="brand-track">
              <RelatedPosts posts={related} />
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}
