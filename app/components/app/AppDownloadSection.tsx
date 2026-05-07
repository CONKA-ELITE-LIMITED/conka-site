"use client";

import { AppInstallButtons } from "@/app/components/AppInstallButtons";

export function AppDownloadSection() {
  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="brand-h2 text-white mb-8 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start measuring your brain today.
      </h2>
      <AppInstallButtons variant="clinical-dark" className="justify-center" />
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums mt-4">
        Free to use · No subscription required · Core features included
      </p>
    </div>
  );
}

export default AppDownloadSection;
