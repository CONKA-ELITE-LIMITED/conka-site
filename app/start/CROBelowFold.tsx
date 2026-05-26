"use client";

import dynamic from "next/dynamic";
import VisibilityGate from "../components/VisibilityGate";

// /start is `noindex` (paid traffic only), so SSR for the below-fold sections
// is dead weight — it bloats the hydration tree and stalls LCP. ssr: false
// drops them from the initial HTML; the IntersectionObserver gate around the
// heaviest section (CROTestimonials, 21 cards) defers its mount until scroll.
//
// `dynamic({ ssr: false })` cannot be called from a Server Component in App
// Router, so the dynamic imports live in this client wrapper. The page stays
// a Server Component (so the `metadata` export is honoured) and just renders
// this wrapper for the below-fold tree.
const CROBrandStory = dynamic(
  () => import("../components/cro/CROBrandStory"),
  { ssr: false, loading: () => <div className="h-[800px]" /> },
);
const LandingValueComparisonV2 = dynamic(
  () => import("../components/landing/LandingValueComparisonV2"),
  { ssr: false, loading: () => <div className="h-[520px]" /> },
);
const CROFormulaSplitV2 = dynamic(
  () => import("../components/cro/CROFormulaSplitV2"),
  { ssr: false, loading: () => <div className="h-[700px]" /> },
);
const CROBuyBox = dynamic(
  () => import("../components/cro/CROBuyBox"),
  { ssr: false, loading: () => <div className="h-[800px]" /> },
);
const CROBenefitCards = dynamic(
  () => import("../components/cro/CROBenefitCards"),
  { ssr: false, loading: () => <div className="h-[520px]" /> },
);
const CROAthletes = dynamic(
  () => import("../components/cro/CROAthletes"),
  { ssr: false, loading: () => <div className="h-[900px]" /> },
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

export default function CROBelowFold() {
  return (
    <>
      {/* ===== V2 SECTION 2 — BRAND STORY ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="We created drinkable focus"
      >
        <div className="brand-track">
          <CROBrandStory />
        </div>
      </section>

      {/* ===== V2 SECTION 3 — COFFEE VS CONKA (animated bars) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="The 2pm crash isn't you"
      >
        <div className="brand-track">
          <LandingValueComparisonV2 />
        </div>
      </section>

      {/* ===== V2 SECTION 4 — FORMULA SPLIT (AM/PM toggle + ingredients) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Built for every part of your day"
      >
        <div className="brand-track">
          <CROFormulaSplitV2 />
        </div>
      </section>

      {/* ===== V2 SECTION 5 — BUY BOX (conka-both quick purchase) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Try your first shot today"
      >
        <div className="brand-track">
          <CROBuyBox />
        </div>
      </section>

      {/* ===== V2 SECTION 6 — BENEFIT CARDS (% increase proof) ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Measured, not marketed"
      >
        <div className="brand-track">
          <CROBenefitCards />
        </div>
      </section>

      {/* ===== V2 SECTION 7 — ATHLETES + INFORMED SPORT ===== */}
      <section
        className="brand-section brand-bg-white"
        style={{ paddingTop: 0, paddingBottom: "4rem" }}
        aria-label="Trusted where focus can't fail"
      >
        <div className="brand-track">
          <CROAthletes />
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
    </>
  );
}
