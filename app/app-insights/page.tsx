import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import InsightFindingsHero from "@/app/components/insights/InsightFindingsHero";
import HowThisIsPossibleModule from "@/app/components/insights/HowThisIsPossibleModule";
import MethodologyInThirtySeconds from "@/app/components/insights/MethodologyInThirtySeconds";
import AppDownloadSection from "@/app/components/app/AppDownloadSection";
import ProfessionalTrialsBlock from "@/app/components/insights/ProfessionalTrialsBlock";
import ReviewedDate from "@/app/components/ReviewedDate";
import Reveal from "@/app/components/landing/Reveal";
import TimeOfDaySection from "./sections/TimeOfDaySection";
import MentalFatigueSection from "./sections/MentalFatigueSection";
import StressSection from "./sections/StressSection";
import AlcoholSection from "./sections/AlcoholSection";
import CoffeeSection from "./sections/CoffeeSection";

/* Light Simple DTC, findings first (SCRUM-1522; plan:
   docs/development/featurePlans/app-insights-findings-first.md). The hero's
   finding tiles are the navigation; each report is a glance layer with its
   depth behind "See the full data". Report anchors are linked from other
   pages, so their ids must not change. Coffee vs CONKA stays last: it is the
   one report that bridges to a purchase. */
const REPORTS = [
  { id: "time-of-day", label: "Time of day report", Section: TimeOfDaySection },
  { id: "mental-fatigue", label: "Mental fatigue and readiness report", Section: MentalFatigueSection },
  { id: "stress", label: "Stress report", Section: StressSection },
  { id: "alcohol", label: "Alcohol and hangover report", Section: AlcoholSection },
  { id: "coffee", label: "Coffee versus CONKA report", Section: CoffeeSection },
] as const;

export default function AppInsightsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Navigation />

      {/* HERO: the findings, as tiles that jump to each report */}
      <section
        className="brand-section brand-hero-first brand-bg-tint"
        aria-labelledby="app-insights-hero"
      >
        <div className="brand-track">
          <InsightFindingsHero />
        </div>
      </section>

      {/* REPORTS: alternate white and tint, starting white under the hero */}
      {REPORTS.map(({ id, label, Section }, i) => (
        <section
          key={id}
          id={id}
          className={`brand-section scroll-mt-24 ${
            i % 2 === 0 ? "brand-bg-white" : "brand-bg-tint"
          }`}
          aria-label={label}
        >
          <div className="brand-track">
            <Reveal>
              <Section />
            </Reveal>
          </div>
        </section>
      ))}

      {/* TEMPORARY DARK BAND (Phase 1 only): these sections still carry the
          old dark styling until Phase 2 of SCRUM-1522 rebuilds them, so they
          keep their dark canvas here rather than going unreadable. */}
      <div
        className="brand-clinical text-white"
        style={{ backgroundColor: "#0a0a0a" }}
      >
      <section
        className="brand-section"
        aria-label="How CONKA captures this data"
      >
        <div className="brand-track flex flex-col gap-10">
          <HowThisIsPossibleModule />
          <MethodologyInThirtySeconds />
        </div>
      </section>

      <section className="brand-section" aria-label="Download the CONKA app">
        <div className="brand-track">
          <AppDownloadSection />
        </div>
      </section>

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
      </div>

      <Footer />
    </div>
  );
}
