import type { Metadata } from "next";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import CROHeroV2 from "../components/cro/CROHeroV2";
import CROBelowFold from "./CROBelowFold";

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
        aria-label="Landing page hero"
      >
        <div className="brand-track">
          <CROHeroV2 />
        </div>
      </section>

      <CROBelowFold />

      <Footer />
    </div>
  );
}
