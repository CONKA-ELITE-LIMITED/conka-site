import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  AppV2ProgressRail,
  AppV2Hero,
  AppV2Origin,
  AppV2TestJourney,
  AppV2Engine,
  AppV2Proof,
  AppV2BeyondTest,
  AppV2Download,
} from "@/app/components/appv2";
import { AppInsightsCallout } from "@/app/components/app";
import { CognitiveTestIsland } from "@/app/components/cognitive-test";
import ReviewedDate from "@/app/components/ReviewedDate";

export const metadata: Metadata = {
  title: "The App | CONKA",
  description:
    "Everyone tells you how you should feel. We show you. A free app and a clinically validated cognitive test that measure how your brain actually performs over time.",
  openGraph: {
    title: "The App | CONKA",
    description:
      "A free app and a clinically validated cognitive test that measure how your brain actually performs over time.",
    images: ["/app/AppConkaRing.png"],
  },
};

/* Mid-migration to light Simple DTC (SCRUM-1361), one section at a time. The
   page root is already light; sections not yet rebuilt sit inside the legacy
   App-Dark wrapper below, so each rebuilt section moves out of it. The wrapper
   goes when the last section does. See
   docs/development/featurePlans/app-page-see-conka-working.md. */
export default function AppPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      {/* 1. HERO: see CONKA working */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="The CONKA app"
      >
        <div className="brand-track">
          <AppV2Hero />
        </div>
      </section>

      {/* Legacy App-Dark sections, not yet rebuilt */}
      <div
        className="brand-clinical text-white flex flex-col"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='11' width='2' height='2' fill='rgba(255%2C255%2C255%2C0.18)'/%3E%3C/svg%3E\")",
          backgroundSize: "24px 24px",
        }}
      >
        <AppV2ProgressRail />

        {/* 2. WHY / ORIGIN — you cannot improve what you cannot measure */}
        <section className="brand-section" aria-label="Why we built it">
          <div className="brand-track">
            <AppV2Origin />
          </div>
        </section>

        {/* 3. HOW IT WORKS — pinned journey (mechanism + gold standard merged) */}
        <AppV2TestJourney />

        {/* 4. THE ENGINE — data in, intelligence out, lab-grade depth */}
        <section
          className="brand-section"
          aria-label="The engine behind the app"
        >
          <div className="brand-track">
            <AppV2Engine />
          </div>
        </section>

        {/* 5. TRY IT — live cognitive test (client island) */}
        <section
          className="brand-section"
          aria-labelledby="cognitive-test-heading"
        >
          <div className="brand-track">
            <CognitiveTestIsland />
          </div>
        </section>

        {/* 6. PROOF — research counters, product bridge, athlete strip */}
        <section
          className="brand-section"
          aria-label="Research and athlete proof"
        >
          <div className="brand-track">
            <AppV2Proof />
          </div>
        </section>

        {/* 7. REAL-WORLD DATA — bridge to /app-insights */}
        <section
          className="brand-section"
          aria-label="App data insights callout"
        >
          <div className="brand-track">
            <AppInsightsCallout />
          </div>
        </section>

        {/* 8. HABIT — compete and rewards keep you testing */}
        <section className="brand-section" aria-label="Compete and rewards">
          <div className="brand-track">
            <AppV2BeyondTest />
          </div>
        </section>

        {/* 9. DOWNLOAD — final CTA */}
        <section className="brand-section" aria-label="Download the CONKA app">
          <div className="brand-track">
            <AppV2Download />
            <ReviewedDate
              isoDate="2026-07"
              label="July 2026"
              tone="onDark"
              divider
            />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
