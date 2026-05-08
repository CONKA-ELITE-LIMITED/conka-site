"use client";

import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ScienceHero from "@/app/components/science/ScienceHero";
import ScienceQuote from "@/app/components/science/ScienceQuote";
import ScienceAdaptogens from "@/app/components/science/ScienceAdaptogens";
import SciencePillars from "@/app/components/science/SciencePillars";
import FlowVsClear from "@/app/components/science/FlowVsClear";
import ScienceDifferent from "@/app/components/science/ScienceDifferent";
import EvidenceSummary from "@/app/components/science/EvidenceSummary";
import AppInsightsCallout from "@/app/components/app/AppInsightsCallout";
import Reveal from "@/app/components/landing/Reveal";
import useIsMobile from "@/app/hooks/useIsMobile";

export default function SciencePage() {
  const isMobile = useIsMobile();

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      {isMobile === undefined ? (
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 animate-pulse">
            // Loading research
          </p>
        </div>
      ) : (
        <>
          {/* ===== SECTION 1: HERO ===== */}
          <section
            className="brand-section brand-hero-first brand-bg-white"
            aria-label="Science hero"
          >
            <div className="brand-track">
              <ScienceHero isMobile={!!isMobile} />
            </div>
          </section>

          {/* ===== SECTION 2: WHAT MAKES US DIFFERENT ===== */}
          <section
            className="brand-section brand-bg-tint"
            aria-label="What makes CONKA different"
          >
            <div className="brand-track">
              <Reveal>
                <ScienceDifferent isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 3: QUOTE ===== */}
          <section
            className="brand-section brand-bg-white"
            aria-label="Research philosophy"
          >
            <div className="brand-track">
              <Reveal>
                <ScienceQuote isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 4: ADAPTOGENS ===== */}
          <section
            className="brand-section brand-bg-tint"
            aria-label="What are adaptogens"
          >
            <div className="brand-track">
              <Reveal>
                <ScienceAdaptogens isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 5: FIVE PILLARS ===== */}
          <section
            className="brand-section brand-bg-white"
            aria-label="The five pillars"
          >
            <div className="brand-track">
              <Reveal>
                <SciencePillars isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 6: FLOW VS CLEAR ===== */}
          <section
            className="brand-section brand-bg-tint"
            aria-label="Flow vs Clear comparison"
          >
            <div className="brand-track">
              <Reveal>
                <FlowVsClear isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 7: EVIDENCE & RESEARCH ===== */}
          <section
            className="brand-section brand-bg-white"
            aria-label="Evidence and research"
          >
            <div className="brand-track">
              <Reveal>
                <EvidenceSummary isMobile={!!isMobile} />
              </Reveal>
            </div>
          </section>

          {/* ===== SECTION 8: REAL-WORLD DATA BRIDGE ===== */}
          <section
            className="brand-section brand-bg-black"
            aria-label="Real user cognitive data"
          >
            <div className="brand-track">
              <Reveal>
                <AppInsightsCallout />
              </Reveal>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
