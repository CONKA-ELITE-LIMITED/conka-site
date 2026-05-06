"use client";

import { useState, useCallback } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  AppFeaturePanel,
  AppStickyPhoneBlock,
  AppDownloadSection,
  AppResearchModal,
} from "@/app/components/app";
import LabCaseStudies from "@/app/components/LabCaseStudies";
import {
  CognitiveTestSection,
  CognitiveTestSectionMobile,
} from "@/app/components/cognitive-test";
import useIsMobile from "@/app/hooks/useIsMobile";

export default function AppPage() {
  const isMobile = useIsMobile();
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const openResearch = useCallback(() => setIsResearchOpen(true), []);
  const closeResearch = useCallback(() => setIsResearchOpen(false), []);

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

      {/* 1. HERO — what it is, instant desire */}
      <section
        className="brand-section brand-hero-first"
        aria-labelledby="app-hero-heading"
      >
        <AppFeaturePanel />
      </section>

      {/* Quick-links strip */}
      <div className="flex justify-center py-6 px-4">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={openResearch}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 tabular-nums bg-white/[0.07] border border-white/15 px-5 py-2.5 hover:bg-white/[0.12] hover:text-white/80 transition-colors"
          >
            Research + Clinical Data
          </button>
          <a
            href="https://apps.apple.com/gb/app/conka-app/id6450399391"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 tabular-nums bg-white/[0.07] border border-white/15 px-5 py-2.5 hover:bg-white/[0.12] hover:text-white/80 transition-colors"
          >
            iOS App ↗
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.conka.conkaApp"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 tabular-nums bg-white/[0.07] border border-white/15 px-5 py-2.5 hover:bg-white/[0.12] hover:text-white/80 transition-colors"
          >
            Android App ↗
          </a>
        </div>
      </div>
      <AppResearchModal isOpen={isResearchOpen} onClose={closeResearch} />

      {/* 2. HOW IT WORKS — the mechanism */}
      <AppStickyPhoneBlock />

      {/* 4. TRY IT — live product demo */}
      {isMobile !== undefined && (
        <section
          className="brand-section"
          aria-labelledby="cognitive-test-heading"
        >
          <div className="brand-track">
            {isMobile ? <CognitiveTestSectionMobile /> : <CognitiveTestSection />}
          </div>
        </section>
      )}

      {/* 5. ATHLETE PROOF — social credibility */}
      <section
        className="brand-section"
        aria-label="Athletes using CONKA"
      >
        <div className="brand-track">
          <LabCaseStudies />
        </div>
      </section>

      {/* 6. DOWNLOAD — final CTA */}
      <section
        className="brand-section"
        aria-label="Download the CONKA app"
      >
        <div className="brand-track">
          <AppDownloadSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
