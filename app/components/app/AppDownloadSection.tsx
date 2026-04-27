"use client";

import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

export function AppDownloadSection() {
  return (
    <>
      <style jsx global>{`
        @keyframes appDownloadFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .app-download-float {
          animation: appDownloadFloat 5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col gap-8 lg:gap-16 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="relative aspect-[4/5] lg:aspect-[5/6] border border-black/12 bg-[#f5f5f5] overflow-hidden flex items-center justify-center">
          <div className="relative h-[80%] w-auto app-download-float">
            <Image
              src="/app/AppConkaRing.png"
              alt="CONKA app interface showing a cognitive test score"
              width={360}
              height={720}
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            Fig. 07
          </span>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            App Interface
          </span>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
            {"// Download · APP-01"}
          </p>
          <h2
            className="brand-h2 text-black mb-3 max-w-[20ch]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Start measuring your brain today.
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
            Free to use · No subscription required · Core features included
          </p>

          <AppInstallButtons variant="clinical" />

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums mt-6 max-w-md">
            Cambridge-derived cognitive testing · FDA cleared · Validated
            across NHS Memory Clinics
          </p>
        </div>
      </div>
    </>
  );
}

export default AppDownloadSection;
