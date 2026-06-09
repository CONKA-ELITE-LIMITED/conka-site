import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ScienceHero from "@/app/components/science/ScienceHero";
import TwoSystemModel from "@/app/components/science/TwoSystemModel";
import ScienceEducation from "@/app/components/science/ScienceEducation";
import SciencePillars from "@/app/components/science/SciencePillars";
import FlowVsClear from "@/app/components/science/FlowVsClear";
import ScienceDifferent from "@/app/components/science/ScienceDifferent";
import EvidenceLadder from "@/app/components/science/EvidenceLadder";
import AppInsightsCallout from "@/app/components/app/AppInsightsCallout";
import Reveal from "@/app/components/landing/Reveal";

export const metadata: Metadata = {
  title: "The Science | CONKA",
  description:
    "The brain is a performance system under daily load. See the model CONKA is engineered around: clinical-dose adaptogens and nootropics, and the evidence underneath them.",
  openGraph: {
    title: "The Science | CONKA",
    description:
      "The model CONKA is engineered around: clinical-dose adaptogens and nootropics, and the evidence underneath them.",
    images: ["/lifestyle/CreationOfConka.jpg"],
  },
};

export default function SciencePage() {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      {/* ===== SECTION 1: THESIS HERO ===== */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingTop: "5rem" }}
        aria-label="Science hero"
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

      {/* ===== SECTION 5: FIVE PILLARS ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="The five pillars"
      >
        <div className="brand-track">
          <Reveal>
            <SciencePillars />
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
            <FlowVsClear />
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
            <EvidenceLadder />
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
    </div>
  );
}
