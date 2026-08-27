import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getByoMinPerShot } from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";
import { CONVERSION_FAQ_ITEMS } from "@/app/lib/faqContent";
import { JsonLd, buildFaqSchema } from "@/app/lib/jsonLd";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import HomeHeroStatic from "./components/landing/HomeHeroStatic";
import ConkaCTAButton from "./components/landing/ConkaCTAButton";
// Pure server components (no client state) — direct import, no dynamic() needed.
import LabResearch from "./components/landing/LabResearch";
import UGCMarquee from "./components/testimonials/UGCMarquee";
import BrainFuelBand from "./lander/sections/BrainFuelBand/BrainFuelBand";
// Static server component (native <details> accordion, no client state), so a
// direct import like the other pure server sections above.
import AppUSPSection from "./components/home/AppUSPSection";
import ProductComparisonTable from "./components/product/ProductComparisonTable";
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

// Client leaf that lazily pulls GSAP in on approach, so it is code-split like
// the page's other client sections. SSR stays on, so the five milestones are in
// the server-rendered HTML for crawlers and the JSX already carries the final
// lit state; only the scrub binding is deferred.
const WhatToExpectV2 = dynamic(() => import("./components/home/WhatToExpectV2"), {
  loading: () => <div className="min-h-[950px]" />,
});

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
        {/* Replaced a benefit-tile band whose three titles restated the outcome
          buckets the PDPs already carry (SCRUM-1265; the component itself was
          deleted in the 2026-08-27 orphan sweep).
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

        {/* ===== SECTION 4: BRAIN FUEL BAND — proof section (white section with
          the neuron clip full-bleed and the stats on a light-grey proof card.
          Owns its own full-bleed section, so it is not wrapped in
          brand-section/brand-track). ===== */}
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

        {/* The standalone Jack Willis review that sat here is gone. It rendered
          the same athlete, the same portrait and all but word-for-word the same
          quote as roster slot 1 of the carousel further down, so the page had
          one man saying one sentence twice. He is now the carousel's opening
          athlete instead, which keeps the prominence without the repeat.
          AthleteReviewFeature itself is still live: ListicleProofTier uses it. */}

        {/* ===== SECTION 6: WHAT TO EXPECT ===== */}
        {/* Answers "when will I feel it", the objection that kills a first
          subscription order, immediately after the shopper has picked a product
          in the grid above. Takes the Both variant, since the page is not
          product specific. Tint against the white product grid above and the
          white athlete section below. */}
        <HomeSection
          id="what-to-expect"
          className="brand-section brand-bg-tint"
          ariaLabel="What to expect"
        >
          <div className="brand-track">
            <WhatToExpectV2 productId="both" />
            <div className="mt-10 flex justify-center">
              <ConkaCTAButton href="/conka-both?src=home_expect" meta={null}>
                Start your first week
              </ConkaCTAButton>
            </div>
          </div>
        </HomeSection>

        {/* ===== SECTION 7: WHY HIGH PERFORMERS TRUST CONKA (athletes) ===== */}
        {/* Moved up from position 11. The athletes answer "who relies on
          this" while the shopper is still deciding, rather than after six
          further sections of argument. White, not the tint it carried before:
          the feature card is bg-white with a ring and the cutouts blend onto
          their own #eef1f8 tiles, so the section colour does no work for it.
          Standard mobile padding both sides; the zeroed facing paddings this
          section and App USP used to carry existed only for the sport marquee
          that was cut in SCRUM-1273. */}
        <HomeSection
          id="athletes"
          className="brand-section brand-bg-white"
          ariaLabel="Athletes who use CONKA"
        >
          <div className="brand-track">
            <AthleteCredibilityCarousel />
            <div className="mt-10 flex justify-center">
              <ConkaCTAButton href="/conka-both?src=home_athletes" meta={null}>
                Join them
              </ConkaCTAButton>
            </div>
          </div>
        </HomeSection>

        {/* ===== SECTION 8: RESEARCH — university credibility ===== */}
        {/* Full-bleed band: section drops its gutter/padding (!py-0 !px-0); LabResearch caps its own width. */}
        <HomeSection
          id="research"
          className="brand-section brand-bg-tint !py-0 !px-0"
          ariaLabel="World-class research and university partners"
        >
          <LabResearch />
        </HomeSection>

        {/* SECTION 7 (RISK-FREE GUARANTEE / LabGuarantee) removed from home
          2026-08-27, SCRUM-1265. The component is NOT dead: /conka-flow,
          /conka-clarity, /conka-both and /case-studies all still render it, so
          there is nothing to clean up here. The 100-day guarantee also stays in
          this page's metadata below, because it is still a real offer and the
          claim is still true, it simply no longer has its own home section. */}

        {/* ===== SECTION 9: APP USP — key differentiator, measure it yourself ===== */}
        <HomeSection
          id="app-usp"
          className="brand-section brand-bg-tint"
          ariaLabel="Prove it yourself with the CONKA app"
        >
          <div className="brand-track">
            <AppUSPSection />
          </div>
        </HomeSection>

        {/* ===== SECTION 10: COMPARISON TABLE ===== */}
        {/* Moved down from position 7, so the page argues who trusts it and
          why it is credible before it argues against the alternatives.
          Stays on WHITE deliberately: the CONKA column is marked by an
          #eef0f5 panel, and this page is .brand-clinical where --brand-tint
          is #f5f5f5. On tint the panel and the section background are
          near-identical greys and the column marking disappears. Do not flip
          this section to tint. */}
        <HomeSection
          id="comparison"
          className="brand-section brand-bg-white"
          ariaLabel="CONKA compared with coffee and prescription stimulants"
        >
          <div className="brand-track">
            <ProductComparisonTable product="both" />
            <div className="mt-10 flex justify-center">
              <ConkaCTAButton href="/conka-both?src=home_comparison" meta={null}>
                Unlock your boost
              </ConkaCTAButton>
            </div>
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

        {/* ===== SECTION 11: UGC SOCIAL PROOF ===== */}
        {/* Real people, immediately before the questions. Its heading and the
          faces are the last thing the page says before the FAQ closes, which
          is where volume-of-people proof lands hardest; higher up it sat
          between two argument sections and read as decoration. */}
        <HomeSection
          id="ugc"
          className="brand-section brand-bg-tint !px-0"
          ariaLabel="Real people using CONKA"
        >
          <UGCMarquee />
        </HomeSection>

        {/* ===== SECTION 12: FAQ ===== */}
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
