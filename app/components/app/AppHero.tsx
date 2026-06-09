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

      {/* Hero asset — clinical frame, mirrors the science hero treatment */}
      <div className="relative order-2 w-full mt-12 lg:mt-0 lg:flex-1">
        <div className="relative aspect-[4/5] max-w-[360px] mx-auto lg:mx-0 lg:ml-auto border border-white/12 bg-white/[0.03] overflow-hidden">
          <Image
            src="/app/AppConkaRing.png"
            alt="The CONKA app showing a live cognitive score ring"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-contain p-6"
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80 bg-white/[0.08] px-2 py-1 tabular-nums">
            Fig. 01 · Your live score
          </div>
        </div>
      </div>
    </div>
  );
}
