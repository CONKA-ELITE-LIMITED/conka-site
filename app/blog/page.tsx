import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import BlogListing from "@/app/components/blog/BlogListing";
import { getAllPosts } from "@/app/lib/blog";
import { paginate, topicsOf } from "@/app/lib/blogTopics";

// includeUnpublished renders Drafts in dev preview; the loader keeps
// production Published-only regardless.
const PREVIEW = { includeUnpublished: true };

export const metadata: Metadata = {
  title: "Blog | CONKA",
  description:
    "Evidence-led writing on focus, memory, brain fog, and getting more out of your brain. From the team behind CONKA.",
  openGraph: {
    title: "Blog | CONKA",
    description:
      "Evidence-led writing on focus, memory, brain fog, and getting more out of your brain.",
  },
};

export default async function BlogIndexPage() {
  // /blog is page 1. The paginated route starts at 2, so the index keeps its
  // own URL rather than duplicating /blog/page/1.
  //
  // One fetch: getAllPosts re-probes every hero image per call, so paging and
  // the topic nav come off the same read.
  const all = await getAllPosts(PREVIEW);
  const topics = topicsOf(all);
  const { posts, totalPages } = paginate(all, 1);

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      <section
        className="brand-section brand-hero-first brand-bg-white grow"
        style={{ paddingTop: "5rem" }}
        aria-label="Blog"
      >
        <div className="brand-track">
          <BlogListing
            eyebrow="Blog"
            heading="Sharper thinking, explained."
            intro="Evidence-led writing on focus, memory, and how to get more out of your brain."
            topics={topics}
            posts={posts}
            page={1}
            totalPages={totalPages}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
