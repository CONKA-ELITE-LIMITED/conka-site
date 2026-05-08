"use client";

import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import CaseStudiesHero from "@/app/components/case-studies/CaseStudiesHero";
import CaseStudiesPageDesktop from "@/app/components/case-studies/CaseStudiesPageDesktop";
import CaseStudiesPageMobile from "@/app/components/case-studies/CaseStudiesPageMobile";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import { FUNNEL_URL } from "@/app/lib/landingConstants";
import useIsMobile from "@/app/hooks/useIsMobile";

export default function CaseStudiesPage() {
  const isMobile = useIsMobile();

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col">
        <section
          className="brand-section brand-hero-first brand-bg-white"
          style={{ paddingTop: "5rem" }}
          aria-label="Case studies overview"
        >
          <div className="brand-track">
            <CaseStudiesHero />
          </div>
        </section>

        {isMobile === undefined ? (
          <div className="py-16 flex items-center justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
              Loading case studies…
            </p>
          </div>
        ) : (
          <section
            className="brand-section brand-bg-tint"
            aria-label="Case studies explorer"
          >
            <div className="brand-track">
              {isMobile ? (
                <CaseStudiesPageMobile />
              ) : (
                <CaseStudiesPageDesktop />
              )}
            </div>
          </section>
        )}
        <section
          className="brand-section brand-bg-white"
          aria-label="100-day guarantee"
        >
          <div className="brand-track">
            <LabGuarantee ctaHref={FUNNEL_URL} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
