import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ScienceHero from "@/app/components/science/ScienceHero";
import TwoSystemModel from "@/app/components/science/TwoSystemModel";
import ScienceEducation from "@/app/components/science/ScienceEducation";
import RealisedSolution from "@/app/components/science/RealisedSolution";
import ScienceDifferent from "@/app/components/science/ScienceDifferent";
import ScienceProof from "@/app/components/science/ScienceProof";
import ScienceCTA from "@/app/components/science/ScienceCTA";
import AppInsightsCallout from "@/app/components/app/AppInsightsCallout";
import Reveal from "@/app/components/landing/Reveal";
import ReviewedDate from "@/app/components/ReviewedDate";

export const metadata: Metadata = {
  title: "Does CONKA Work? The Science and Clinical Trials | CONKA",
  description:
    "In a double-blind, placebo-controlled trial, athletes on CONKA improved cognitive performance by 14.86%. See the nootropics, adaptogens and research behind it.",
  openGraph: {
    title: "Does CONKA Work? The Science and Clinical Trials | CONKA",
    description:
      "In a double-blind, placebo-controlled trial, athletes on CONKA improved cognitive performance by 14.86%. See the research behind it.",
    images: ["/lifestyle/CreationOfConka.jpg"],
  },
};

/* Simple DTC, not clinical (SCRUM-1351): see DESIGN_SYSTEM.md §8.5 and
   docs/development/featurePlans/science-page-narrative.md. The hero, proof and
   CTA are the rebuilt Phase 1 sections; the four sections between the hero and
   the proof are restyled originals that Phase 2 (SCRUM-1352) replaces.
   Backgrounds alternate so no two adjacent sections match. */
export default function SciencePage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      {/* ===== SECTION 1: HERO ===== */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="The science behind CONKA"
      >
        <div className="brand-track">
          <ScienceHero />
        </div>
      </section>

      {/* ===== SECTION 2: WHY MOST BRAIN PRODUCTS FAIL ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Why most brain products fail"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceDifferent />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 3: TWO-SYSTEM MODEL ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="The two-system model"
      >
        <div className="brand-track">
          <Reveal>
            <TwoSystemModel />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 4: EDUCATION (adaptogens + nootropics) ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="What are adaptogens and nootropics"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceEducation />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 5: FLOW + CLEAR ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Flow and Clear"
      >
        <div className="brand-track">
          <Reveal>
            <RealisedSolution />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 6: THE PROOF ===== */}
      <section
        id="proof"
        className="brand-section brand-bg-tint scroll-mt-20"
        aria-label="Clinical trials"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceProof />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 7: REAL-WORLD DATA BRIDGE ===== */}
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

      {/* ===== SECTION 8: CTA ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Try CONKA"
      >
        <div className="brand-track">
          <ScienceCTA />
          <ReviewedDate isoDate="2026-09" label="September 2026" divider />
        </div>
      </section>

      <Footer />
    </div>
  );
}
