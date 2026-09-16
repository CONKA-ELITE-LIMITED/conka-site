import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ScienceHero from "@/app/components/science/ScienceHero";
import ScienceChallenge from "@/app/components/science/ScienceChallenge";
import ScienceCategories from "@/app/components/science/ScienceCategories";
import ScienceHowItWorks from "@/app/components/science/ScienceHowItWorks";
import ScienceProof from "@/app/components/science/ScienceProof";
import SciencePeople from "@/app/components/science/SciencePeople";
import ScienceMeasure from "@/app/components/science/ScienceMeasure";
import ScienceCTA from "@/app/components/science/ScienceCTA";
import Reveal from "@/app/components/landing/Reveal";
import ReviewedDate from "@/app/components/ReviewedDate";
import { SCIENCE_PEOPLE } from "@/app/lib/scienceContent";

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

/* Simple DTC, not clinical (SCRUM-1351 to 1353): see DESIGN_SYSTEM.md §8.5 and
   the /science entry in docs/PAGE_NARRATIVES.md. The arc mirrors
   the home "why" accordion: answer first, the challenge, what nootropics and
   adaptogens are, how Flow and Clear work, the trials, the scientists, measure it yourself,
   then the close. Backgrounds alternate so no two adjacent sections match. */
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

      {/* ===== SECTION 2: THE CHALLENGE ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="The challenge"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceChallenge />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 3: WHAT ARE NOOTROPICS AND ADAPTOGENS ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="What are nootropics and adaptogens"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceCategories />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 4: HOW CONKA WORKS ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="How CONKA works"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceHowItWorks />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 5: THE PROOF ===== */}
      <section
        id="proof"
        className="brand-section brand-bg-white scroll-mt-20"
        aria-label="Clinical trials"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceProof />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 6: THE PEOPLE (skipped entirely when the list is empty) ===== */}
      {SCIENCE_PEOPLE.length > 0 && (
        <section
          className="brand-section brand-bg-tint"
          aria-label="The scientists behind CONKA"
        >
          <div className="brand-track">
            <Reveal>
              <SciencePeople />
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== SECTION 7: MEASURE IT YOURSELF ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Measure it yourself"
      >
        <div className="brand-track">
          <Reveal>
            <ScienceMeasure />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 8: CTA ===== */}
      <section
        className="brand-section brand-bg-tint"
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
