import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getByoMinPerShot } from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";
import { CONVERSION_FAQ_ITEMS } from "@/app/lib/faqContent";
import { JsonLd, buildFaqSchema } from "@/app/lib/jsonLd";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import HomeHeroStatic from "./components/landing/HomeHeroStatic";
// Pure server components (no client state) — direct import, no dynamic() needed.
import LabResearch from "./components/landing/LabResearch";
import UGCMarquee from "./components/testimonials/UGCMarquee";
import BrainFuelBand from "./lander/sections/BrainFuelBand/BrainFuelBand";
// Static server component (native <details> accordion, no client state), so a
// direct import like the other pure server sections above.
import AppUSPSection from "./components/home/AppUSPSection";
import AthleteReviewFeature from "./components/AthleteReviewFeature";
import ProductComparisonTable from "./components/product/ProductComparisonTable";
import Certifications from "./components/Certifications";
// Section-impression tracking (SCRUM-1265). HomeSection is a thin client
// wrapper around <section>; the sections themselves stay server-rendered.
import HomeSection, {
  HomeSectionImpressions,
} from "./components/home/HomeSection";

const LandingProductShowcase = dynamic(
  () => import("./components/landing/LandingProductShowcase"),
  { loading: () => <div className="h-[1400px] lg:h-[1000px]" /> },
);

const ProductGrid = dynamic(() => import("./components/home/ProductGrid"), {
  loading: () => <div className="h-[900px]" />,
});

// Client component: always-one-open state plus an animated expand, neither of
// which a native <details> gives. Code-split like the page's other client
// sections so its JS stays out of the initial bundle. SSR is left on (no
// `ssr: false`), so the five rows of copy are still in the server-rendered
// HTML for crawlers; only the hydration chunk is deferred.
const HomeWhyAccordion = dynamic(
  () => import("./components/home/HomeWhyAccordion"),
  { loading: () => <div className="h-[760px] lg:h-[700px]" /> },
);

// Section 10 (Case Studies) commented out per request 2026-07-20. Re-enable this
// import together with the section block below to restore it.
// const LabCaseStudies = dynamic(
//   () => import("./components/LabCaseStudies"),
//   { loading: () => <div className="h-[1200px]" /> },
// );

const AthleteCredibilityCarousel = dynamic(
  () => import("./components/AthleteCredibilityCarousel"),
  // Roughly the carousel's mobile height. The old 350px was a large
  // under-estimate and shifted the page down as the chunk landed.
  { loading: () => <div className="min-h-[900px]" /> },
);

const LabFAQ = dynamic(() => import("./components/landing/LabFAQ"), {
  loading: () => <div className="h-[350px]" />,
});

// Home is a Server Component, so metadata is exported in place (SCRUM-1132).
// Overrides the generic root-layout title/description that every page inherited.
export const metadata: Metadata = {
  title: "Best Brain Supplement UK | CONKA Daily Brain Shot",
  description: `CONKA is the UK's leading daily brain shot, Informed Sport certified, backed by Cambridge, Durham and Exeter. 100-day guarantee. From ${formatPrice(
    getByoMinPerShot("both"),
  )}/shot.`,
  openGraph: {
    title: "Best Brain Supplement UK | CONKA Daily Brain Shot",
    description:
      "The UK's leading daily brain shot. Informed Sport certified, backed by Cambridge, Durham and Exeter. 100-day guarantee.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "Best Brain Supplement UK | CONKA Daily Brain Shot",
    description:
      "The UK's leading daily brain shot. Informed Sport certified, backed by Cambridge, Durham and Exeter. 100-day guarantee.",
    images: ["/opengraph-image.png"],
  },
};

export default function Home() {
  return (
    // HomeSectionImpressions owns the page's single IntersectionObserver and
    // fires home:section_viewed once per section per pageview (SCRUM-1265). It
    // is a client boundary, but the sections below stay server components: they
    // are passed through as children, not imported into the client bundle.
    <HomeSectionImpressions>
      <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        {/* Serialises the same conversion subset the LabFAQ section renders below, so
          the schema never describes a question the page does not show (SCRUM-1140). */}
        <JsonLd schema={buildFaqSchema(CONVERSION_FAQ_ITEMS)} />
        {/* No hero preload links needed: HomeHeroStatic renders an eager
          fetchpriority=high <img> in the initial HTML, so the preload scanner
          discovers the LCP asset itself (the old video hero painted CSS
          background posters, which needed explicit preloads). */}
        {/* ===== SECTION 1: HERO ===== */}
        <Navigation />
        {/* Desktop drops the section gutters/track so the hero asset can
          bleed to the viewport edge (listicle hero pattern); mobile keeps
          the standard section padding */}
        {/* The fixed desktop nav reserves a 136px spacer but renders ~120px, so
          a ~16px white sliver shows above the flush hero. Pull the hero up into
          that surplus at xl only (its empty top space absorbs it); the mobile
          and lg-tablet navs are in normal flow and need no adjustment. */}
        {/* Magic Mind-style metal-tray still hero: portrait render on mobile,
          landscape render on desktop, art-directed inside HomeHeroStatic.
          (HomeHeroVideo + HomeHeroVideoDesktop, the looped video hero, are
          kept in the codebase for revert.) */}
        <HomeSection
          id="hero"
          className="brand-section brand-hero-first brand-bg-white lg:p-0! max-lg:pb-0! xl:-mt-4"
          ariaLabel="Homepage hero"
        >
          <div className="brand-track lg:max-w-none!">
            <HomeHeroStatic />
          </div>
        </HomeSection>

        {/* ===== SECTION 2: WHAT CONKA DOES ===== */}
        {/* White so it flows straight out of the hero's white copy column; the
          why-accordion below carries the first tint break.
          This briefly ran third, under the why-accordion, on the theory that
          cold traffic wants the problem framed before the product. Swapped back
          2026-08-27: the accordion is a tall block of closed rows, and putting
          it between the hero and the first sight of the product pushed the
          product too far down. The accordion now reads as the "why" behind a
          product you have already seen. */}
        <HomeSection
          id="showcase"
          className="brand-section brand-bg-white"
          ariaLabel="What CONKA does"
        >
          <div className="brand-track">
            <LandingProductShowcase ctaHref="/conka-both" />
          </div>
        </HomeSection>

        {/* ===== SECTION 3: WHY CONKA EXISTS (numbered accordion) ===== */}
        {/* Replaced ProductBenefitTiles, whose three titles restated the outcome
          buckets the PDPs already carry (SCRUM-1265).
          Tint, so it breaks out of the white showcase above AND so the
          accordion's white card reads as a raised surface rather than
          dissolving into the section. */}
        <HomeSection
          id="why"
          className="brand-section brand-bg-tint"
          ariaLabel="Why CONKA exists"
        >
          <div className="brand-track">
            <HomeWhyAccordion />
          </div>
        </HomeSection>

        {/* Certification badges — self-contained white band under the accordion. */}
        <Certifications />

        {/* ===== SECTION 4: BRAIN FUEL BAND — proof section (swapped in for
          LandingDailyBenefits; white section with the neuron clip full-bleed
          and the stats on a light-grey proof card. Owns its own full-bleed
          section, so it is not wrapped in brand-section/brand-track). ===== */}
        <BrainFuelBand />

        {/* ===== SECTION 5: PRODUCT GRID (scroll target for hero CTA) ===== */}
        {/* The id doubles as the hero CTA's #product-grid scroll anchor and as
            the tracked section name, so scroll-mt lives on the section itself
            rather than on a wrapper div. */}
        <HomeSection
          id="product-grid"
          className="brand-section brand-bg-white scroll-mt-20"
          ariaLabel="Shop CONKA formulas"
        >
          <div className="brand-track">
            <ProductGrid />
          </div>
        </HomeSection>

        {/* ===== SECTION 5.5: FEATURED ATHLETE REVIEW (Jack Willis) ===== */}
        {/* White so the white-background cutout portrait floats; pt-0 shares the
          product grid's bottom padding rather than doubling the white gap. */}
        <HomeSection
          id="athlete-review"
          className="brand-section brand-bg-white pt-0!"
          ariaLabel="Featured athlete review"
        >
          <div className="brand-track">
            <AthleteReviewFeature />
          </div>
        </HomeSection>

        {/* ===== SECTION 5.75: COMPARISON TABLE ===== */}
        {/* Answers the category objection ("why not just coffee?") once the
          shopper has seen the products and one athlete's word for them, and
          before the university research makes the credibility case. Same
          component the three PDPs render; the home copy is deliberately
          product-neutral, so it takes the Both render rather than favouring
          Flow or Clear. White continues the run from the product grid; the
          Research band below flips to tint. */}
        <HomeSection
          id="comparison"
          className="brand-section brand-bg-white"
          ariaLabel="CONKA compared with coffee and prescription stimulants"
        >
          <div className="brand-track">
            <ProductComparisonTable product="both" />
          </div>
        </HomeSection>

        {/* ===== SECTION 6: RESEARCH — university credibility ===== */}
        {/* Full-bleed band: section drops its gutter/padding (!py-0 !px-0); LabResearch caps its own width. */}
        <HomeSection
          id="research"
          className="brand-section brand-bg-tint !py-0 !px-0"
          ariaLabel="World-class research and university partners"
        >
          <LabResearch />
        </HomeSection>

        {/* ===== SECTION 6.5: UGC SOCIAL PROOF ===== */}
        <HomeSection
          id="ugc"
          className="brand-section brand-bg-white !px-0"
          ariaLabel="Real people using CONKA"
        >
          <UGCMarquee />
        </HomeSection>

        {/* SECTION 7 (RISK-FREE GUARANTEE / LabGuarantee) removed from home
          2026-08-27, SCRUM-1265. The component is NOT dead: /conka-flow,
          /conka-clarity, /conka-both and /case-studies all still render it, so
          there is nothing to clean up here. The 100-day guarantee also stays in
          this page's metadata below, because it is still a real offer and the
          claim is still true, it simply no longer has its own home section. */}

        {/* ===== SECTION 7: APP USP — key differentiator, measure it yourself ===== */}
        <HomeSection
          id="app-usp"
          className="brand-section brand-bg-white"
          ariaLabel="Prove it yourself with the CONKA app"
        >
          <div className="brand-track">
            <AppUSPSection />
          </div>
        </HomeSection>

        {/* ===== SECTION 8: WHY HIGH PERFORMERS TRUST CONKA (athletes) ===== */}
        {/* Standard mobile padding both sides. This section and App USP above
          used to zero their facing paddings so the full-bleed navy sport
          marquee butted flush; with the marquee cut (SCRUM-1273) that left the
          section title jammed against the section above on a phone. */}
        <HomeSection
          id="athletes"
          className="brand-section brand-bg-tint"
          ariaLabel="Athletes who use CONKA"
        >
          <div className="brand-track">
            <AthleteCredibilityCarousel />
          </div>
        </HomeSection>

        {/* SECTION 10: CASE STUDIES (LabCaseStudies) — commented out per request 2026-07-20.
          Restore this block and re-enable the LabCaseStudies dynamic import above.
      <section
        className="brand-section brand-bg-tint"
        aria-label="Clinically validated test scores"
      >
        <div className="brand-track">
          <LabCaseStudies />
        </div>
      </section>
      */}

        {/* ===== SECTION 9: FAQ ===== */}
        <HomeSection
          id="faq"
          className="brand-section brand-bg-white"
          ariaLabel="FAQ"
        >
          <div className="brand-track">
            <LabFAQ ctaHref="/conka-both" />
          </div>
        </HomeSection>

        <Footer />
      </div>
    </HomeSectionImpressions>
  );
}
