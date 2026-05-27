import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import VisibilityGate from "../components/VisibilityGate";

// Above-fold hero -- static import, owns the LCP image.
import CROHeroV2 from "../components/cro/CROHeroV2";

// Server components (no client JS) -- static imports.
// These are SSR'd into the initial HTML and ship NO modulepreload chunk,
// which is the entire point of /start's Phase 3 perf rebuild.
import CROBrandStory from "../components/cro/CROBrandStory";
import CROBenefitCards from "../components/cro/CROBenefitCards";
import CROResearch from "../components/cro/CROResearch";
import CROAppCallout from "../components/cro/CROAppCallout";
import CROFAQv2 from "../components/cro/CROFAQv2";
import LandingDisclaimer from "../components/landing/LandingDisclaimer";

// Client islands -- dynamic() without ssr: false.
// These SSR + hydrate normally; dynamic only defers the client chunk
// download. We accept the SSR DOM cost in exchange for not needing a
// "use client" wrapper file (Next.js 16 forbids dynamic({ ssr: false })
// from a Server Component, which is why CROBelowFold used to exist).
const LandingValueComparisonV2 = dynamic(
  () => import("../components/landing/LandingValueComparisonV2"),
);
const CROFormulaSplitV2 = dynamic(
  () => import("../components/cro/CROFormulaSplitV2"),
);
const CROBuyBox = dynamic(() => import("../components/cro/CROBuyBox"));
const CROAthletes = dynamic(() => import("../components/cro/CROAthletes"));
const CROCustomerReviews = dynamic(
  () => import("../components/cro/CROCustomerReviews"),
);

export const metadata: Metadata = {
  title: "Try CONKA | Daily Nootropic Brain Shots",
  description:
    "Two shots a day. 16 active ingredients. Informed Sport certified. Try CONKA Flow and Clear with a 100-day money-back guarantee.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://www.conka.io/start",
  },
  openGraph: {
    title: "Try CONKA | Daily Nootropic Brain Shots",
    description:
      "Two shots a day. 16 active ingredients. Informed Sport certified. Start your daily brain performance routine.",
  },
};

export default function StartPage() {
  return (
    <div className="brand-clinical brand-v2 min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== 1. HERO ===== */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingBottom: "4rem" }}
        aria-label="Landing page hero"
      >
        <div className="brand-track">
          <CROHeroV2 />
        </div>
      </section>

      {/* ===== 2. BRAND STORY ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="We created drinkable focus"
      >
        <div className="brand-track">
          <CROBrandStory />
        </div>
      </section>

      {/* ===== 3. COFFEE VS CONKA (animated bars) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="The 2pm crash isn't you"
      >
        <div className="brand-track">
          <LandingValueComparisonV2 />
        </div>
      </section>

      {/* ===== 4. FORMULA SPLIT (AM/PM toggle + ingredients) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Built for every part of your day"
      >
        <div className="brand-track">
          <VisibilityGate minHeight="700px">
            <CROFormulaSplitV2 />
          </VisibilityGate>
        </div>
      </section>

      {/* ===== 5. BUY BOX (conka-both quick purchase) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Try your first shot today"
      >
        <div className="brand-track">
          <CROBuyBox />
        </div>
      </section>

      {/* ===== 6. BENEFIT CARDS (% increase proof) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Measured, not marketed"
      >
        <div className="brand-track">
          <CROBenefitCards />
        </div>
      </section>

      {/* ===== 7. ATHLETES + INFORMED SPORT ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Trusted where focus can't fail"
      >
        <div className="brand-track">
          <VisibilityGate minHeight="900px">
            <CROAthletes />
          </VisibilityGate>
        </div>
      </section>

      {/* ===== 8. CAMBRIDGE + RESEARCH CREDENTIALS ===== */}
      {/* Server component (Phase 1). VisibilityGate removed here in Phase 3
          because wrapping a Server Component in a client gate prevents it
          from being SSR'd into the initial HTML, which negates the whole
          modulepreload-reduction benefit of static-importing it. */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Built on Cambridge research"
      >
        <div className="brand-track">
          <CROResearch />
        </div>
      </section>

      {/* ===== 9. CUSTOMER REVIEWS ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Real people. Real results."
      >
        <div className="brand-track">
          <VisibilityGate minHeight="680px">
            <CROCustomerReviews />
          </VisibilityGate>
        </div>
      </section>

      {/* ===== 10. APP CALLOUT ===== */}
      {/* Server component (Phase 1). VisibilityGate removed here in Phase 3
          for the same reason as Section 8. */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="We don't ask if CONKA works, we measure it"
      >
        <div className="brand-track">
          <CROAppCallout />
        </div>
      </section>

      {/* ===== 11. FAQ ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Still wondering?"
      >
        <div className="brand-track">
          <CROFAQv2 />
        </div>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Important information and disclaimers"
      >
        <div className="brand-track">
          <LandingDisclaimer />
        </div>
      </section>

      <Footer />
    </div>
  );
}
