"use client";

import Navigation from "../components/navigation";
import ProfessionalsContext from "../components/professionals/ProfessionalsContext";
import ModeSelectionSection from "../components/professionals/ModeSelectionSection";
import SciencePageContent from "../components/science/SciencePageContent";
import useIsMobile from "../hooks/useIsMobile";

export default function ProfessionalsPage() {
  const isMobile = useIsMobile();

  return (
    <div
      className="min-h-screen theme-conka-flow lg:pt-20"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <ProfessionalsContext />
      <ModeSelectionSection />

      {isMobile === undefined ? (
        <div className="min-h-[30vh] py-8 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="font-mono text-sm opacity-50">Loading...</p>
          </div>
        </div>
      ) : isMobile ? (
        <SciencePageContent isMobile={true} />
      ) : (
        <SciencePageContent isMobile={false} />
      )}
    </div>
  );
}
