"use client";

import dynamic from "next/dynamic";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import LandingHero from "./components/landing/LandingHero";

// Dynamically import heavy components to reduce initial bundle size
const LandingProductShowcase = dynamic(
  () => import("./components/landing/LandingProductShowcase"),
  { loading: () => <div className="h-[1400px] lg:h-[1000px]" /> },
);

const ProductGrid = dynamic(() => import("./components/home/ProductGrid"), {
  loading: () => <div className="h-[900px]" />,
});

const WhyConkaWorks = dynamic(() => import("./components/WhyConkaWorks"), {
  loading: () => <div className="h-[600px]" />,
});

const LabCaseStudies = dynamic(
  () => import("./components/LabCaseStudies"),
  { loading: () => <div className="h-[1200px]" /> },
);

const LandingTestimonials = dynamic(
  () => import("./components/landing/LandingTestimonials"),
  { loading: () => <div className="h-[450px]" /> },
);

const AthleteCredibilityCarousel = dynamic(
  () => import("./components/AthleteCredibilityCarousel"),
  { loading: () => <div className="h-[350px]" /> },
);

const AppUSPSection = dynamic(
  () => import("./components/home/AppUSPSection"),
  { loading: () => <div className="h-[1100px] lg:h-[700px]" /> },
);

const LabFAQ = dynamic(() => import("./components/landing/LabFAQ"), {
  loading: () => <div className="h-[350px]" />,
});

const LabTimeline = dynamic(
  () => import("./components/landing/LabTimeline"),
  { loading: () => <div className="h-[600px]" /> },
);

const LandingDailyBenefits = dynamic(
  () => import("./components/landing/LandingDailyBenefits"),
  { loading: () => <div className="h-[600px]" /> },
);

export default function Home() {
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      {/* ===== SECTION 1: HERO ===== */}
      <Navigation />
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="Homepage hero"
      >
        <div className="brand-track">
          <LandingHero />
        </div>
      </section>

      {/* ===== SECTION 2: WHAT CONKA DOES ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="What CONKA does"
      >
        <div className="brand-track">
          <LandingProductShowcase />
        </div>
      </section>

      {/* ===== SECTION 3: WHY HIGH PERFORMERS TRUST CONKA ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Athletes who use CONKA"
      >
        <div className="brand-track">
          <AthleteCredibilityCarousel />
        </div>
      </section>

      {/* ===== SECTION 4: PRODUCT GRID (scroll target for hero CTA) ===== */}
      <div id="product-grid" className="scroll-mt-20">
        <section
          className="brand-section brand-bg-tint"
          aria-label="Find Your Formula"
        >
          <div className="brand-track">
            <ProductGrid />
          </div>
        </section>
      </div>

      {/* ===== SECTION 5: CASE STUDIES (measurable outcomes first) ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Clinically validated test scores"
      >
        <div className="brand-track">
          <LabCaseStudies />
        </div>
      </section>

      {/* ===== SECTION 6: APP USP (prove it yourself) ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Prove it yourself with the CONKA app"
      >
        <div className="brand-track">
          <AppUSPSection />
        </div>
      </section>

      {/* ===== SECTION 7: DAILY BENEFITS — LIFELONG PILLARS ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Daily habit, lifelong benefits"
      >
        <div className="brand-track">
          <LandingDailyBenefits />
        </div>
      </section>

      {/* ===== SECTION 8: WHY CONKA WORKS ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Why CONKA Works"
      >
        <div className="brand-track">
          <WhyConkaWorks />
        </div>
      </section>

      {/* ===== SECTION 9: WHAT TO EXPECT (LabTimeline) ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="What to Expect with CONKA"
      >
        <div className="brand-track">
          <LabTimeline ctaHref="/protocol/3" />
        </div>
      </section>

      {/* ===== SECTION 10: TESTIMONIALS (real voices after data proof) ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Customer reviews"
      >
        <div className="brand-track">
          <LandingTestimonials />
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="FAQ"
      >
        <div className="brand-track">
          <LabFAQ />
        </div>
      </section>

      <Footer />
    </div>
  );
}
