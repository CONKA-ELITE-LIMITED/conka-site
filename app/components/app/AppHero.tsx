"use client";

import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

export function AppHero() {
  return (
    <>
      <style jsx global>{`
        @keyframes appHeroMount {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .app-hero-mount {
          animation: appHeroMount 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="app-hero-mount flex flex-col gap-8 lg:gap-16 lg:grid lg:grid-cols-[3fr_2fr] lg:items-center">
        <div className="relative w-full aspect-[16/9] lg:aspect-[3/2] border border-black/12 overflow-hidden bg-[#f5f5f5]">
          <Image
            src="/app/NothingAppRing.jpg"
            alt="CONKA app cognitive score displayed on a Nothing phone"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            Fig. 01
          </span>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            The Future In Your Hands
          </span>
        </div>

        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Brain performance technology · APP-01"}
          </p>
          <h1
            className="brand-h1 text-black mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            The Gold Standard of Cognitive Testing
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
            3-min test · Wellness log · Measurable progress
          </p>
          <p
            className="brand-body text-lg lg:text-xl text-black mb-8"
            style={{ maxWidth: "var(--brand-body-max-width)" }}
          >
            This isn&apos;t an IQ test. It measures how efficiently your brain
            processes information, tracked over time. Most brands ask you to
            trust their claims. We hand you the instrument to see CONKA working
            for yourself.
          </p>

          <AppInstallButtons
            variant="clinical"
            iconSize={16}
            className="w-full max-w-md"
            buttonClassName="flex-1 justify-center whitespace-nowrap !text-[10px] !tracking-[0.16em] !px-4 !gap-2"
          />

          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums">
            Free to use
          </p>
        </header>
      </div>
    </>
  );
}

export default AppHero;
