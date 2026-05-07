import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import CROHero from "../components/cro/CROHero";
import VisibilityGate from "../components/VisibilityGate";

// /start is `noindex` (paid traffic only), so SSR for the below-fold sections
// is dead weight — it bloats the hydration tree and stalls LCP. ssr: false
// drops them from the initial HTML; the IntersectionObserver gate around the
// heaviest section (CROTestimonials, 21 cards) defers its mount until scroll.
const CROFormulaSplit = dynamic(
  () => import("../components/cro/CROFormulaSplit"),
  { ssr: false, loading: () => <div className="h-[500px]" /> },
);
const LandingValueComparison = dynamic(
  () => import("../components/landing/LandingValueComparison"),
  { ssr: false, loading: () => <div className="h-[600px]" /> },
);
const CROTestimonials = dynamic(
  () => import("../components/cro/CROTestimonials"),
  { ssr: false, loading: () => <div className="h-[500px]" /> },
);
const CROGuarantee = dynamic(
  () => import("../components/cro/CROGuarantee"),
  { ssr: false, loading: () => <div className="h-[400px]" /> },
);
const CROFAQ = dynamic(
  () => import("../components/cro/CROFAQ"),
  { ssr: false, loading: () => <div className="h-[500px]" /> },
);
const CROFinalCTA = dynamic(
  () => import("../components/cro/CROFinalCTA"),
  { ssr: false, loading: () => <div className="h-[200px]" /> },
);
const LandingDisclaimer = dynamic(
  () => import("../components/landing/LandingDisclaimer"),
  { ssr: false, loading: () => <div className="h-[150px]" /> },
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
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== 1. HERO ===== */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="Landing page hero"
      >
        <div className="brand-track">
          <CROHero />
        </div>
      </section>

      {/* ===== 2. FORMULA SPLIT — WHAT ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Flow and Clear formulas"
      >
        <div className="brand-track">
          <CROFormulaSplit />
        </div>
      </section>

      {/* ===== 3. TESTIMONIALS ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Customer reviews"
      >
        <div className="brand-track">
          <VisibilityGate minHeight="500px">
            <CROTestimonials />
          </VisibilityGate>
        </div>
      </section>

      {/* ===== 4. VALUE COMPARISON — 2PM CRASH + PRICE ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Why CONKA outperforms caffeine"
      >
        <div className="brand-track">
          <LandingValueComparison />
        </div>
      </section>

      {/* ===== 5. GUARANTEE ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="100-day risk-free guarantee"
      >
        <div className="brand-track">
          <CROGuarantee />
        </div>
      </section>

      {/* ===== 6. FAQ ===== */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="FAQ"
      >
        <div className="brand-track">
          <CROFAQ />
        </div>
      </section>

      {/* ===== 7. FINAL CTA ===== */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Get started with CONKA"
      >
        <div className="brand-track">
          <CROFinalCTA />
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
