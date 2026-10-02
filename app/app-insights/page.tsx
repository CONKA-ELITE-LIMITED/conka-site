import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import InsightFindingsHero from "@/app/components/insights/InsightFindingsHero";
import InsightHowWeKnow from "@/app/components/insights/InsightHowWeKnow";
import InsightDownloadClose from "@/app/components/insights/InsightDownloadClose";
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

      {/* HOW WE KNOW: method + credentials, depth in accordions. Tint, the
          last report (coffee) being white. */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="How CONKA captures this data"
      >
        <div className="brand-track">
          <Reveal>
            <InsightHowWeKnow />
          </Reveal>
        </div>
      </section>

      {/* DOWNLOAD: get your own curve */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Download the CONKA app"
      >
        <div className="brand-track">
          <Reveal>
            <InsightDownloadClose />
          </Reveal>
        </div>
      </section>

      {/* PROFESSIONAL TRIALS: the B2B exit */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Professional trials with sports clubs"
      >
        <div className="brand-track">
          <ProfessionalTrialsBlock />
        </div>
      </section>

      {/* ABOUT THIS DATA: method summary, notes behind the ^^ and ¶ markers,
          the full report and its citation. Legal anchors stay legible. */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Overall methodology and ethics"
      >
        <div className="brand-track">
          <h2
            className="brand-h3 mb-4 max-w-[28ch] text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            How we look at the numbers.
          </h2>
          <p className="mb-3 max-w-[68ch] text-sm leading-relaxed text-black/75">
            Every analysis on this page uses a per-user delta method. We
            compute each user&apos;s personal baseline from their own
            clean-state tests, then compare their impaired-state tests against
            that baseline. This removes the confound of natural ability
            differences between users.
          </p>
          <p className="mb-5 max-w-[68ch] text-sm leading-relaxed text-black/75">
            Wellness factors (alcohol, fatigue, stress, readiness) are
            self-reported in the CONKA app on an opt-in basis at the moment of
            testing. Cognitive scores come from the same test session.
          </p>
          <div className="flex flex-col gap-2 border-t border-black/10 pt-5 text-xs leading-relaxed text-black/60">
            <p>
              ^^ Cognitive test details and validation are documented above in
              &quot;How we know&quot;.
            </p>
            <p>
              ¶ Ingredient-level peer-reviewed studies. Findings as published;
              not extrapolated to product-level effect.
            </p>
            <p>
              Food supplements are not a substitute for a varied and balanced
              diet and a healthy lifestyle.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-5">
            <a
              href="/CONKA-Real-World-Evidence-Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] w-fit items-center text-sm font-semibold text-[var(--brand-navy)] underline underline-offset-4"
            >
              Download the full report (PDF)
            </a>
            <p className="max-w-[74ch] text-xs text-black/50">
              Kurup, R. (2026). CONKA Real-World Evidence Report: cognitive
              performance patterns from 712 app users (APP-01 to APP-05). CONKA.
            </p>
            <ReviewedDate isoDate="2026-07" label="July 2026" className="mt-2" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
