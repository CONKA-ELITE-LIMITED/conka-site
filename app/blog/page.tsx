import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import BlogCard from "@/app/components/blog/BlogCard";
import { getAllPosts } from "@/app/lib/blog";

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
  // includeUnpublished renders Drafts in dev preview; the loader keeps
  // production Published-only regardless.
  const posts = await getAllPosts({ includeUnpublished: true });

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      <section
        className="brand-section brand-hero-first brand-bg-white grow"
        style={{ paddingTop: "5rem" }}
        aria-label="Blog"
      >
        <div className="brand-track">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
            Blog
          </p>
          <h1 className="brand-h1 mt-3">Sharper thinking, explained.</h1>
          <p className="brand-body mt-4 text-black/60">
            Evidence-led writing on focus, memory, and how to get more out of
            your brain.
          </p>

          {posts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="brand-body mt-10 text-black/50">
              New articles are coming soon.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
