import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { WhyConkaHero } from "@/app/components/why-conka/WhyConkaHero";
import WhyConkaReasons from "@/app/components/why-conka/WhyConkaReasons";
import { WhyConkaCTA } from "@/app/components/why-conka/WhyConkaCTA";
import ReviewedDate from "@/app/components/ReviewedDate";

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

export default function WhyConkaPage() {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black">
      <Navigation />

      {/* Hero — paddingTop: .brand-clinical zeros brand-hero-first padding on
          mobile, leaving the hero flush against the nav. */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
        aria-labelledby="why-conka-hero-heading"
      >
        <div className="brand-track">
          <WhyConkaHero />
        </div>
      </section>

      {/* The 7 proof cards */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Seven reasons to choose CONKA"
      >
        <div className="brand-track">
          <WhyConkaReasons />
        </div>
      </section>

      {/* Final CTA + explore routing */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Try CONKA"
      >
        <div className="brand-track">
          <WhyConkaCTA />
          <ReviewedDate isoDate="2026-07" label="July 2026" tone="onLight" divider />
        </div>
      </section>

      <Footer />
    </div>
  );
}
