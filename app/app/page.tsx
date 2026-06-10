import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  AppHero,
  AppOrigin,
  AppFeaturePanel,
  AppStickyPhoneBlock,
  AppDownloadSection,
  AppWidgetGrid,
  AppInsightsCallout,
} from "@/app/components/app";
import { CognitiveTestIsland } from "@/app/components/cognitive-test";

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

export default function AppPage() {
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

      {/* 1. HERO — the thesis: we show you */}
      {/* paddingTop: clinical scope zeros brand-hero-first top padding on mobile */}
      <section
        className="brand-section brand-hero-first"
        style={{ paddingTop: "5rem" }}
        aria-label="The CONKA app"
      >
        <div className="brand-track">
          <AppHero />
        </div>
      </section>

      {/* 2. WHY / ORIGIN — you cannot improve what you cannot measure */}
      <section className="brand-section" aria-label="Why we built it">
        <div className="brand-track">
          <AppOrigin />
        </div>
      </section>

      {/* 3. HOW IT WORKS — the mechanism */}
      <AppStickyPhoneBlock />

      {/* 4. WHAT THE APP IS — features (the gold standard) */}
      <section className="brand-section" aria-label="What the app is">
        <AppFeaturePanel />
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

      {/* 6. PROOF — real data callout + research and athletes */}
      <section className="brand-section" aria-label="App data insights callout">
        <div className="brand-track">
          <AppInsightsCallout />
        </div>
      </section>

      <section
        className="brand-section"
        aria-label="Research, install, and athlete proof"
      >
        <div className="brand-track">
          <AppWidgetGrid />
        </div>
      </section>

      {/* 7. DOWNLOAD — final CTA */}
      <section className="brand-section" aria-label="Download the CONKA app">
        <div className="brand-track">
          <AppDownloadSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
