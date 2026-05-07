import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import TimeOfDaySection from "./sections/TimeOfDaySection";
import MentalFatigueSection from "./sections/MentalFatigueSection";
import StressSection from "./sections/StressSection";
import AlcoholSection from "./sections/AlcoholSection";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

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

      {/* 1. HERO ─ what this page is and why we made it */}
      <section
        className="brand-section brand-hero-first"
        style={{ paddingTop: "5rem" }}
        aria-labelledby="app-insights-hero"
      >
        <div className="brand-track">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-4">
            {"// Real cognitive data · APP-01"}
          </p>
          <h1
            id="app-insights-hero"
            className="brand-h1 text-white mb-6 max-w-[22ch]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Real cognitive data. Real users. No spin.
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 tabular-nums mb-10">
            {APP_INSIGHTS_TOTALS.users} users · {APP_INSIGHTS_TOTALS.tests.toLocaleString()} tests · {APP_INSIGHTS_TOTALS.monthsSpan} months · {APP_INSIGHTS_TOTALS.reportCount} reports
          </p>
          <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-[68ch]">
            This is what the CONKA app actually sees. Real users, tracking their cognition every day. Where the data is thin, we say so. Where we can&apos;t draw a conclusion from app data alone, we cite the peer-reviewed studies on the ingredients instead.
          </p>
        </div>
      </section>

      {/* 2. TIME OF DAY */}
      <section className="brand-section" aria-label="Time of day report">
        <div className="brand-track">
          <TimeOfDaySection />
        </div>
      </section>

      {/* 3. MENTAL FATIGUE */}
      <section className="brand-section" aria-label="Mental fatigue and readiness report">
        <div className="brand-track">
          <MentalFatigueSection />
        </div>
      </section>

      {/* 4. STRESS */}
      <section className="brand-section" aria-label="Stress report">
        <div className="brand-track">
          <StressSection />
        </div>
      </section>

      {/* 5. ALCOHOL */}
      <section className="brand-section" aria-label="Alcohol and hangover report">
        <div className="brand-track">
          <AlcoholSection />
        </div>
      </section>

      {/* 6. METHODOLOGY FOOTER */}
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
              Every analysis on this page uses a per-user delta method. We compute each user&apos;s personal baseline from their own clean-state tests, then compare their impaired-state tests against that baseline. This removes the confound of natural ability differences between users.
            </p>
            <p className="text-sm text-white/85 leading-relaxed max-w-[68ch] mb-3">
              Wellness factors (alcohol, fatigue, stress, readiness) are self-reported in the CONKA app on an opt-in basis at the moment of testing. Cognitive scores come from the same test session.
            </p>
            <div className="border-t border-white/10 pt-5 flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                ^^ Cognitive test scores measured using the CONKA app, which uses the FDA-cleared Cognetivity CognICA assessment developed from Cambridge University research. Test sensitivity 93%, test-retest reliability 87.5%. Individual results vary; many factors influence test performance.
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                ¶ Ingredient-level peer-reviewed studies. Findings as published; not extrapolated to product-level effect.
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
                Food supplements are not a substitute for a varied and balanced diet and a healthy lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
