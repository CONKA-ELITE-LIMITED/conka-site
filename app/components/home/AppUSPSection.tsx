import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * AppUSPSection (Simple DTC)
 *
 * "Most brands claim results. We let you measure yours." — the app is the
 * differentiator, so the section makes the argument plainly: a test (what),
 * your own synced data (why), and a score you watch move (the edge over other
 * brands). One score-ring asset on the soft #eef1f8 panel and a condensed,
 * benefit-framed accordion (native <details>, first item open) in solid black.
 * Static server component; an earlier clinical tabbed explorer was replaced
 * 2026-07 because it hid the point behind a click.
 * ========================================================================== */

const POINTS = [
  {
    label: "A test, not a promise.",
    body: "A free two-minute cognitive test, Cambridge-derived and NHS-validated. It reads your processing speed from natural images, so it cannot be gamed.",
  },
  {
    label: "Your data, not averages.",
    body: "The app auto-syncs your sleep, training and screen time, then shows what actually lifts your score. Your patterns, not population averages.",
  },
  {
    label: "A number you watch move.",
    body: "Track your brain week over week. Clinical data supports up to 16% improvement in 30 days. The graph does not lie.",
  },
];

export default function AppUSPSection() {
  return (
    <div className="w-full">
      <h2
        className="brand-h1 mb-4 text-black"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        Most brands claim results. We let you measure yours.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black mb-10 max-w-[52ch]">
        A free app and a clinically validated brain test. Watch the shot work in
        your own data.
      </p>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
        {/* Score-ring asset on the soft panel */}
        <div className="relative aspect-square rounded-2xl bg-[#eef1f8] ring-1 ring-black/8 overflow-hidden mb-8 lg:mb-0">
          <Image
            src="/app/AppConkaRing.png"
            alt="CONKA app home screen showing the live cognitive score ring"
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain p-8"
            loading="lazy"
          />
        </div>

        {/* What / why / edge — expandable accordion. Native <details> (no
            client JS); single-open via the shared name, first item open. */}
        <div className="flex flex-col">
          {POINTS.map((point, idx) => (
            <details
              key={point.label}
              name="app-usp"
              open={idx === 0}
              className="group border-t border-black/8 first:border-t-0"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 lg:py-6 [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-bold text-black leading-tight">
                  {point.label}
                </span>
                <svg
                  className="w-5 h-5 shrink-0 text-black/40 transition-transform duration-300 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="-mt-1 pb-5 text-base text-black leading-snug max-w-[46ch] lg:pb-6">
                {point.body}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-10 lg:mt-12 flex flex-col items-center lg:items-start">
        <ConkaCTAButton href="/app" meta={null}>
          Start measuring your brain
        </ConkaCTAButton>
        {/* Spacer preserves the breathing room the validation line used to
            occupy below the CTA. */}
        <div aria-hidden className="mt-4 h-4" />
      </div>
    </div>
  );
}
