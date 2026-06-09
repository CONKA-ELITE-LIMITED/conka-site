import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/**
 * Thesis hero for /app. Leads with "everyone tells you how you should feel,
 * we show you" and states plainly what the app is. Dark clinical grammar,
 * content-only (the page owns the section wrapper and dark canvas).
 */
export default function AppHero() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
      {/* Copy — leads on mobile so the thesis is the first thing read */}
      <div className="order-1 lg:flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
          {"// The app · APP-01"}
        </p>
        <h1 className="brand-h1 text-white mb-5" style={{ letterSpacing: "-0.02em" }}>
          Everyone tells you how you should feel. We show you.
        </h1>
        <p className="text-base md:text-lg text-white leading-relaxed max-w-xl mb-8">
          A free app and a clinically validated cognitive test that measure how
          your brain actually performs, day after day.
        </p>

        <div className="flex flex-col items-start gap-3">
          <AppInstallButtons variant="clinical-dark" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums">
            Free to use
          </p>
        </div>
      </div>

      {/* Hero asset — light device-card so the dark phone render pops. The
          phone floats from the top so the live score ring leads; the bottom
          is clipped by the square frame. */}
      <div className="relative order-2 w-full mt-12 lg:mt-0 lg:flex-1">
        <div className="relative aspect-square w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto border border-black/12 bg-[#f5f5f5] overflow-hidden">
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
            Fig. 01 · CONKA App
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[25%] w-[60%] lg:w-[58%] aspect-[1/2]">
            <Image
              src="/app/AppConkaRing.png"
              alt="The CONKA app showing a live cognitive score ring"
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 300px"
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
            iOS · Android
          </div>
        </div>
      </div>
    </div>
  );
}
