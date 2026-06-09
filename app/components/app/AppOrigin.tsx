import Image from "next/image";

/**
 * Why / origin section for /app. Weaves Humphrey's origin (repeated
 * concussions, fMRI and EEG scans at Newcastle) into the "you cannot improve
 * what you cannot measure" idea. Honest and human, no new medical claims.
 * Content-only; the page owns the section wrapper and dark canvas.
 */
export default function AppOrigin() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
      {/* Asset — leads on desktop, sits below the heading on mobile */}
      <div className="relative order-2 lg:order-1 w-full mt-10 lg:mt-0 lg:flex-1">
        <div className="relative aspect-square w-full max-w-[500px] mx-auto lg:mx-0 border border-white/12 bg-white/[0.03] overflow-hidden">
          <Image
            src="/TwoFounders.jpg"
            alt="CONKA founders Harry Glover and Humphrey Bodington"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover object-center"
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/55 px-2 py-1 tabular-nums">
            Fig. 02 · Where it started
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="order-1 lg:order-2 lg:flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
          {"// Why we built it · APP-02"}
        </p>
        <h2 className="brand-h2 text-white mb-6 max-w-[18ch]" style={{ letterSpacing: "-0.02em" }}>
          You cannot improve what you cannot measure.
        </h2>
        <div className="space-y-4 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
          <p>
            Repeated concussions cut Humphrey Bodington&apos;s playing path short.
            Headaches, light sensitivity, recovery that never quite held, and no
            clear answer.
          </p>
          <p>
            During recovery he had fMRI and EEG scans at Newcastle University. For
            the first time he could see his brain measured, not guessed at. That
            became CONKA: an app that gives everyone the same ability to see it. A
            number you can watch move.
          </p>
        </div>
      </div>
    </div>
  );
}
