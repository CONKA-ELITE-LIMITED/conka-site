"use client";

import { useRef } from "react";
import { useGSAP, withMotion, revealUp } from "@/app/lib/motion";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

export function AppDownloadSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        revealUp("[data-download-reveal]", root.current, { stagger: 0.1 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-col items-center text-center">
      <p
        data-download-reveal
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 tabular-nums mb-4"
      >
        {"// Your turn · APP-01"}
      </p>
      <h2
        data-download-reveal
        className="brand-h2 text-white mb-3 max-w-[24ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        This page is our data. The app gives you yours.
      </h2>
      <p
        data-download-reveal
        className="text-base text-white/85 leading-relaxed max-w-[44ch] mb-8"
      >
        The same FDA-cleared test, your own baseline, from the first session.
      </p>
      <div data-download-reveal>
        <AppInstallButtons variant="clinical-dark" className="justify-center" />
      </div>
      <p
        data-download-reveal
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums mt-4"
      >
        Free to use · No subscription required · Core features included
      </p>
    </div>
  );
}

export default AppDownloadSection;
