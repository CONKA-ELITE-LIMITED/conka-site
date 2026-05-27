import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import CROHeroV2 from "../components/cro/CROHeroV2";

const CROBrandStory = dynamic(
  () => import("../components/cro/CROBrandStory"),
  { loading: () => <div className="h-[800px]" /> },
);

const LandingValueComparisonV2 = dynamic(
  () => import("../components/landing/LandingValueComparisonV2"),
  { loading: () => <div className="h-[520px]" /> },
);

const CROFormulaSplitV2 = dynamic(
  () => import("../components/cro/CROFormulaSplitV2"),
  { loading: () => <div className="h-[700px]" /> },
);

const CROBuyBox = dynamic(() => import("../components/cro/CROBuyBox"), {
  loading: () => <div className="h-[800px]" />,
});

const CROBenefitCards = dynamic(
  () => import("../components/cro/CROBenefitCards"),
  { loading: () => <div className="h-[520px]" /> },
);

const CROAthletes = dynamic(() => import("../components/cro/CROAthletes"), {
  loading: () => <div className="h-[900px]" />,
});

const CROResearch = dynamic(() => import("../components/cro/CROResearch"), {
  loading: () => <div className="h-[760px]" />,
});

const CROCustomerReviews = dynamic(
  () => import("../components/cro/CROCustomerReviews"),
  { loading: () => <div className="h-[680px]" /> },
);

const CROAppCallout = dynamic(
  () => import("../components/cro/CROAppCallout"),
  { loading: () => <div className="h-[820px]" /> },
);

const CROFAQv2 = dynamic(() => import("../components/cro/CROFAQv2"), {
  loading: () => <div className="h-[520px]" />,
});

const LandingDisclaimer = dynamic(
  () => import("../components/landing/LandingDisclaimer"),
  { loading: () => <div className="h-[150px]" /> },
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
          <CROFormulaSplitV2 />
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
          <CROAthletes />
        </div>
      </section>

      {/* ===== 8. CAMBRIDGE + RESEARCH CREDENTIALS ===== */}
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
          <CROCustomerReviews />
        </div>
      </section>

      {/* ===== 10. APP CALLOUT ===== */}
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
