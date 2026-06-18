import dynamic from "next/dynamic";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import LandingHero from "./components/landing/LandingHero";
import LandingHeroVideo from "./components/landing/LandingHeroVideo";
// Pure server components (no client state) — direct import, no dynamic() needed.
import LabResearch from "./components/landing/LabResearch";
import LabTimeline from "./components/landing/LabTimeline";
import UGCMarquee from "./components/testimonials/UGCMarquee";

const LandingProductShowcase = dynamic(
  () => import("./components/landing/LandingProductShowcase"),
  { loading: () => <div className="h-[1400px] lg:h-[1000px]" /> },
);

const ProductGrid = dynamic(() => import("./components/home/ProductGrid"), {
  loading: () => <div className="h-[900px]" />,
});

const LabCaseStudies = dynamic(
  () => import("./components/LabCaseStudies"),
  { loading: () => <div className="h-[1200px]" /> },
);

const CROTestimonials = dynamic(
  () => import("./components/cro/CROTestimonials"),
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

const LandingDailyBenefits = dynamic(
  () => import("./components/landing/LandingDailyBenefits"),
  // Placeholder approximates the rendered height (4:5 video + header +
  // 3 cards on mobile; sticky split on desktop) to limit CLS during
  // client-side navigation.
  { loading: () => <div className="h-[1500px] lg:h-[900px]" /> },
);

export default function Home() {
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      {/* ===== SECTION 1: HERO ===== */}
      <Navigation />
      {/* Desktop drops the section gutters/track so the hero asset can
          bleed to the viewport edge (listicle hero pattern); mobile keeps
          the standard section padding */}
      <section
        className="brand-section brand-hero-first brand-bg-white lg:p-0! max-lg:pb-0!"
        aria-label="Homepage hero"
      >
        <div className="brand-track lg:max-w-none!">
          {/* Mobile: Magic Mind-style looped video hero. Desktop keeps the
              existing listicle hero unchanged. */}
          <div className="lg:hidden">
            <LandingHeroVideo />
          </div>
          <div className="hidden lg:block">
            <LandingHero />
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: WHAT CONKA DOES ===== */}
      {/* The hero drops its bottom padding on mobile so the spacing above this
          section comes from this section's own top padding, keeping the gap in
          the section tint colour rather than white. */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="What CONKA does"
      >
        <div className="brand-track">
          <LandingProductShowcase ctaHref="/conka-both" />
        </div>
      </section>

      {/* ===== SECTION 3: WHY HIGH PERFORMERS TRUST CONKA ===== */}
      {/* No top padding; the gap above comes from section 2's bottom padding. */}
      <section
        className="brand-section brand-bg-white pt-0!"
        aria-label="Athletes who use CONKA"
      >
        <div className="brand-track">
          <AthleteCredibilityCarousel />
        </div>
      </section>

      {/* ===== SECTION 4: DAILY BENEFITS — ingredient argument before the formula picker ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Daily habit, lifelong benefits"
      >
        <div className="brand-track">
          <LandingDailyBenefits />
        </div>
      </section>

      {/* ===== SECTION 5: PRODUCT GRID (scroll target for hero CTA) ===== */}
      <div id="product-grid" className="scroll-mt-20">
        <section
          className="brand-section brand-bg-white"
          aria-label="Find Your Formula"
        >
          <div className="brand-track">
            <ProductGrid />
          </div>
        </section>
      </div>

      {/* ===== SECTION 6: RESEARCH — university credibility after the ingredient argument ===== */}
      {/* Drops the section's vertical padding (band is flush to the sections
          above/below) and the horizontal gutter on mobile so the research band
          runs full-width edge-to-edge; desktop keeps the track. */}
      <section
        className="brand-section brand-bg-tint !py-0 max-md:!px-0"
        aria-label="World-class research and university partners"
      >
        <div className="brand-track">
          <LabResearch />
        </div>
      </section>

      {/* ===== SECTION 6.5: UGC SOCIAL PROOF ===== */}
      <section
        className="brand-section brand-bg-white !px-0"
        aria-label="Real people using CONKA"
      >
        <UGCMarquee />
      </section>

      {/* ===== SECTION 7: WHAT TO EXPECT (LabTimeline) ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="What to Expect with CONKA"
      >
        <div className="brand-track">
          <LabTimeline ctaHref="/conka-both" />
        </div>
      </section>

      {/* ===== SECTION 8: APP USP — key differentiator, measure it yourself ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Prove it yourself with the CONKA app"
      >
        <div className="brand-track">
          <AppUSPSection />
        </div>
      </section>

      {/* ===== SECTION 9: TESTIMONIALS (real voices after data proof) ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Customer reviews"
      >
        <div className="brand-track">
          <CROTestimonials ctaHref="/conka-both" />
        </div>
      </section>

      {/* ===== SECTION 10: CASE STUDIES — deep proof for the convinced sceptic ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Clinically validated test scores"
      >
        <div className="brand-track">
          <LabCaseStudies />
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="FAQ"
      >
        <div className="brand-track">
          <LabFAQ ctaHref="/conka-both" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
