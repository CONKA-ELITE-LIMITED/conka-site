import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { WhyConkaHero } from "@/app/components/why-conka/WhyConkaHero";
import WhyConkaReasons from "@/app/components/why-conka/WhyConkaReasons";
import ProductGrid from "@/app/components/home/ProductGrid";

export const metadata: Metadata = {
  title: "Why CONKA | Seven Reasons in Sixty Seconds",
  description:
    "Seven reasons high performers choose CONKA: 25+ clinical trials, Cambridge-built cognitive testing, natural UK-made ingredients, and a 100-day guarantee.",
  openGraph: {
    title: "Why CONKA | Seven Reasons in Sixty Seconds",
    description:
      "Seven reasons high performers choose CONKA: 25+ clinical trials, Cambridge-built cognitive testing, natural UK-made ingredients, and a 100-day guarantee.",
  },
};

/**
 * Laid out as an MM-template listicle article: one bone canvas, a single 820px
 * reading column, and flat numbered reasons. The page keeps its own nav, footer
 * and indexable metadata; it does not go through the /go listicle config or
 * renderer, so none of that page's analytics or noindex behaviour applies here.
 *
 * `.brand-clinical` is deliberately absent: the MM template is Simple DTC
 * (rounded assets, sans throughout, no mono micro-labels).
 *
 * Canvas is plain white, not the MM renderer's bone: bone was the premium
 * "Soft-Tech Luxury" canvas and DESIGN_SYSTEM.md maps `.premium-bg-bone` to
 * `.brand-bg-white`. Only the layout is borrowed from MM, not the old palette.
 */
export default function WhyConkaPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main>
        <section
          aria-labelledby="why-conka-hero-heading"
          className="px-5 pt-10 md:px-[5vw] md:pt-16"
        >
          <div className="mx-auto max-w-[820px]">
            <WhyConkaHero />
          </div>
        </section>

        <section
          aria-label="Seven reasons to choose CONKA"
          className="px-5 pb-8 md:px-[5vw]"
        >
          <div className="mx-auto max-w-[820px]">
            <WhyConkaReasons />
          </div>
        </section>

        {/* Offer. Breaks out of the 820px reading column to the full grid
            width, the same way the MM listicle closes on its #product section.
            Stays on the page's white canvas rather than the listicle's tint
            strip, so the article reads as one surface top to bottom.
            No `linkSrc`: that origin token is for the /go listicles' purchase
            attribution and would misreport organic traffic here. */}
        <section
          aria-label="Product offer"
          id="product"
          className="px-5 py-16 md:px-[5vw] md:py-24"
        >
          <div className="brand-track">
            <ProductGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
