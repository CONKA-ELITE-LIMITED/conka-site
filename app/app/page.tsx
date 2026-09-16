import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  AppV2Hero,
  AppV2Loop,
  AppV2Trust,
  AppV2Results,
  AppV2Features,
  AppV2Download,
} from "@/app/components/appv2";
import { CognitiveTestIsland } from "@/app/components/cognitive-test";
import Reveal from "@/app/components/landing/Reveal";
import ReviewedDate from "@/app/components/ReviewedDate";

export const metadata: Metadata = {
  title: "The CONKA App | CONKA",
  description:
    "See CONKA working. The free CONKA app measures how sharp you are: take a quick baseline, start CONKA, and watch your score move.",
  openGraph: {
    title: "The CONKA App | CONKA",
    description:
      "See CONKA working. Take a quick baseline in the free app, start CONKA, and watch your score move.",
    images: ["/app/AppConkaRing.png"],
  },
};

/* Light Simple DTC (SCRUM-1361): see DESIGN_SYSTEM.md §8.5 and the /app entry
   in docs/PAGE_NARRATIVES.md. The page's jobs, in order: app download, email
   capture through the live test, then CONKA. The arc is baseline, CONKA,
   retest: invite first (hero, loop, the test itself), then earn trust, then
   prove it on real people. Backgrounds alternate white and tint. */
export default function AppPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      {/* ===== SECTION 1: HERO ===== */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="The CONKA app"
      >
        <div className="brand-track">
          <AppV2Hero />
        </div>
      </section>

      {/* ===== SECTION 2: THE LOOP ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Baseline, CONKA, retest"
      >
        <div className="brand-track">
          <Reveal>
            <AppV2Loop />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 3: GET YOUR BASELINE (live test, client island) =====
          No Reveal: the island renders nothing until the breakpoint resolves,
          so wrapping it would animate an empty box. */}
      <section
        className="brand-section brand-bg-white"
        aria-labelledby="cognitive-test-heading"
      >
        <div className="brand-track">
          <CognitiveTestIsland />
        </div>
      </section>

      {/* ===== SECTION 4: A SCORE YOU CAN TRUST ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Why the score is worth trusting"
      >
        <div className="brand-track">
          <Reveal>
            <AppV2Trust />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 5: REAL RESULTS ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Real results from the app"
      >
        <div className="brand-track">
          <Reveal>
            <AppV2Results />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 6: MORE IN THE APP ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="More in the app"
      >
        <div className="brand-track">
          <Reveal>
            <AppV2Features />
          </Reveal>
        </div>
      </section>

      {/* ===== SECTION 7: DOWNLOAD ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Download the CONKA app"
      >
        <div className="brand-track">
          <AppV2Download />
          <ReviewedDate isoDate="2026-09" label="September 2026" divider />
        </div>
      </section>

      <Footer />
    </div>
  );
}
