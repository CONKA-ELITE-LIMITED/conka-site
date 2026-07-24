import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { WhyConkaHero } from "@/app/components/why-conka/WhyConkaHero";
import WhyConkaReasons from "@/app/components/why-conka/WhyConkaReasons";
import { WhyConkaCTA } from "@/app/components/why-conka/WhyConkaCTA";

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
 */
const BONE = "var(--color-bone, #F9F9F9)";

export default function WhyConkaPage() {
  return (
    <div className="min-h-screen" style={{ background: BONE, color: "#111" }}>
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

        <section
          aria-label="Try CONKA"
          className="px-5 pb-16 md:px-[5vw] md:pb-24"
        >
          <div className="mx-auto max-w-[820px]">
            <WhyConkaCTA />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
