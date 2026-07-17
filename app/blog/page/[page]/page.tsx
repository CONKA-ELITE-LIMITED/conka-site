import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import BlogListing from "@/app/components/blog/BlogListing";
import { BLOG_PAGE_SIZE, paginate, topicsOf } from "@/app/lib/blogTopics";
import { getAllPosts } from "@/app/lib/blog";

const PREVIEW = { includeUnpublished: true };

/**
 * Pages 2..N only. Page 1 is `/blog`, so it is deliberately absent here: two
 * URLs listing the same 12 posts would be a self-inflicted duplicate.
 *
 * Static params, never `?page=N`: searchParams forces dynamic rendering and
 * breaks the fully static build.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts(PREVIEW);
  const totalPages = Math.ceil(posts.length / BLOG_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

function parsePage(raw: string): number | null {
  // Reject "01", "2.5", "-2" and anything else that would give a second URL for
  // the same page. Only a plain integer of 2 or more is a real route here.
  if (!/^[1-9][0-9]*$/.test(raw)) return null;
  const page = Number(raw);
  return page >= 2 ? page : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) return {};

  const title = `Blog, page ${page} | CONKA`;
  const description = `Page ${page} of evidence-led writing on focus, memory, brain fog, and getting more out of your brain.`;
  // No canonical: the root layout's relative canonical self-canonicalises every
  // route. Setting one here would be the duplicate-content bug it exists to avoid.
  return { title, description, openGraph: { title, description } };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) notFound();

  // One fetch: paging and the topic nav come off the same read.
  const all = await getAllPosts(PREVIEW);
  const topics = topicsOf(all);
  const { posts, totalPages } = paginate(all, page);

  // A page past the end holds no posts: 404 rather than render an empty grid
  // that Google would index as thin.
  if (page > totalPages || posts.length === 0) notFound();

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      <section
        className="brand-section brand-hero-first brand-bg-white grow"
        style={{ paddingTop: "5rem" }}
        aria-label={`Blog, page ${page}`}
      >
        <div className="brand-track">
          <BlogListing
            eyebrow={`Blog / page ${page}`}
            heading="Sharper thinking, explained."
            intro="Evidence-led writing on focus, memory, and how to get more out of your brain."
            topics={topics}
            posts={posts}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
