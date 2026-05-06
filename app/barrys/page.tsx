"use client";

import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { BarrysPageDesktop, BarrysPageMobile } from "@/app/components/barrys";
import useIsMobile from "@/app/hooks/useIsMobile";

const CONTEST_ID = "win_protocol3_barrys_270126";

export default function BarrysPage() {
  const isMobile = useIsMobile();

  return (
    <div
      className="min-h-screen theme-conka-flow"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <main className="pb-12">
        {isMobile === undefined ? (
          <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="font-mono text-sm opacity-50">Loading...</p>
            </div>
          </div>
        ) : isMobile ? (
          <BarrysPageMobile contestId={CONTEST_ID} />
        ) : (
          <BarrysPageDesktop contestId={CONTEST_ID} />
        )}
      </main>

      <Footer />
    </div>
  );
}
