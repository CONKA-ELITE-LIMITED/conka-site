"use client";

import ScienceHero from "./ScienceHero";
import ScienceQuote from "./ScienceQuote";
import ScienceAdaptogens from "./ScienceAdaptogens";
import SciencePillars from "./SciencePillars";
import FlowVsClear from "./FlowVsClear";
import ScienceDifferent from "./ScienceDifferent";
import EvidenceSummary from "./EvidenceSummary";

interface SciencePageContentProps {
  isMobile: boolean;
}

/**
 * Renders the science sections: each section is wrapped in brand-section + brand-track here
 * so the parent (Professionals page) can drop this in without duplicating section structure.
 * The Science page itself renders sections on the page and does not use this component.
 */
export default function SciencePageContent({ isMobile }: SciencePageContentProps) {
  return (
    <>
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="Science hero"
      >
        <div className="brand-track">
          <ScienceHero isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section"
        style={{ backgroundColor: "var(--color-neuro-blue-light)" }}
        aria-label="Research philosophy"
      >
        <div className="brand-track">
          <ScienceQuote isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section brand-bg-white"
        aria-label="What are adaptogens"
      >
        <div className="brand-track">
          <ScienceAdaptogens isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section"
        style={{ backgroundColor: "var(--color-neuro-blue-light)" }}
        aria-label="The five pillars"
      >
        <div className="brand-track">
          <SciencePillars isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section brand-bg-white"
        aria-label="Flow vs Clear comparison"
      >
        <div className="brand-track">
          <FlowVsClear isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section"
        style={{ backgroundColor: "var(--color-neuro-blue-light)" }}
        aria-label="What makes CONKA different"
      >
        <div className="brand-track">
          <ScienceDifferent isMobile={isMobile} />
        </div>
      </section>

      <section
        className="brand-section brand-bg-white"
        aria-label="Evidence and research"
      >
        <div className="brand-track">
          <EvidenceSummary isMobile={isMobile} />
        </div>
      </section>
    </>
  );
}
