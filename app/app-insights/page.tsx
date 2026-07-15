import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import InsightFilteredSections from "@/app/components/insights/InsightFilteredSections";
import InsightHeroDifferentiator from "@/app/components/insights/InsightHeroDifferentiator";
import HowThisIsPossibleModule from "@/app/components/insights/HowThisIsPossibleModule";
import AppDownloadSection from "@/app/components/app/AppDownloadSection";
import ProfessionalTrialsBlock from "@/app/components/insights/ProfessionalTrialsBlock";
import ReviewedDate from "@/app/components/ReviewedDate";

export default function AppInsightsPage() {
  return (
    <div
      className="brand-clinical min-h-screen text-white flex flex-col"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='11' width='2' height='2' fill='rgba(255%2C255%2C255%2C0.18)'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px",
      }}
    >
      <Navigation />

      {/* 1. HERO ─ what this page is and why we have this data */}
      <section
        className="brand-section brand-hero-first"
        style={{ paddingTop: "5rem" }}
        aria-labelledby="app-insights-hero"
      >
        <div className="brand-track">
          <InsightHeroDifferentiator />
        </div>
      </section>

      {/* 2. HOW THIS IS POSSIBLE — three-step flow + validated-test credentials */}
      <section
        className="brand-section"
        aria-label="How CONKA captures this data"
      >
        <div className="brand-track">
          <HowThisIsPossibleModule />
        </div>
      </section>

      {/* 3–6. FILTERED APP DATA SECTIONS */}
      <InsightFilteredSections />

      {/* 7. DOWNLOAD — final CTA */}
      <section className="brand-section" aria-label="Download the CONKA app">
        <div className="brand-track">
          <AppDownloadSection />
        </div>
      </section>

      {/* 8. PROFESSIONAL TRIALS — B2B exit ramp */}
      <section
        className="brand-section"
        aria-label="Professional trials with sports clubs"
      >
        <div className="brand-track">
          <ProfessionalTrialsBlock />
        </div>
      </section>

      {/* 9. METHODOLOGY FOOTER — slimmed to legal anchors only */}
      <section
        className="brand-section"
        aria-label="Overall methodology and ethics"
      >
        <div className="brand-track">
          <div className="border-t border-white/10 pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 tabular-nums mb-4">
              {"// About this data · APP-01"}
            </p>
            <h2
              className="brand-h3 text-white mb-4 max-w-[28ch]"
              style={{ letterSpacing: "-0.02em" }}
            >
              How we look at the numbers.
            </h2>
            <p className="text-sm text-white/85 leading-relaxed max-w-[68ch] mb-3">
              Every analysis on this page uses a per-user delta method. We
              compute each user&apos;s personal baseline from their own clean-state
              tests, then compare their impaired-state tests against that
              baseline. This removes the confound of natural ability differences
              between users.
            </p>
            <p className="text-sm text-white/85 leading-relaxed max-w-[68ch] mb-3">
              Wellness factors (alcohol, fatigue, stress, readiness) are
              self-reported in the CONKA app on an opt-in basis at the moment
              of testing. Cognitive scores come from the same test session.
            </p>
            <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                ^^ Cognitive test details and validation are documented above in &quot;How this is possible&quot;.
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                ¶ Ingredient-level peer-reviewed studies. Findings as published; not extrapolated to product-level effect.
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                Food supplements are not a substitute for a varied and balanced diet and a healthy lifestyle.
              </p>
            </div>
            <div className="border-t border-white/10 pt-5 mt-5 flex flex-col gap-3">
              <a
                href="/CONKA-Real-World-Evidence-Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 hover:text-white tabular-nums underline underline-offset-4 decoration-white/30 w-fit"
              >
                Download the full report (PDF)
              </a>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50 tabular-nums max-w-[74ch]">
                Kurup, R. (2026). CONKA Real-World Evidence Report: cognitive performance patterns from 712 app users (APP-01 to APP-05). CONKA.
              </p>
              <ReviewedDate isoDate="2026-07" label="July 2026" tone="onDark" className="mt-2" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
