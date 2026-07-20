import Image from "next/image";
import Link from "next/link";
import ConkaCTAButton from "./ConkaCTAButton";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

/* ============================================================================
 * LabTimeline
 *
 * "What to expect" — 3 milestones (Day 1 / Day 14 / Day 30), one scannable
 * line each. This is the light home-page beat: the deep clinical mechanism and
 * per-milestone app data live on the science page and the PDPs, so here we keep
 * the copy minimal and link out to the research.
 *
 * Pure server component, zero client JS.
 * ========================================================================== */

const NAVY = "#1B2757";

interface Milestone {
  timeframe: string;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    timeframe: "Day 1",
    title: "Focus without the noise.",
    description:
      "Sharp, jitter-free focus from the first shot. No crash, no 2pm dip.",
  },
  {
    timeframe: "Day 14",
    title: "Your sharpest weeks yet.",
    description:
      "Adaptogens reach full strength. Stress rolls off and motivation holds.",
  },
  {
    timeframe: "Day 30",
    title: "A measurably sharper baseline.",
    description:
      "Your cognitive baseline sits permanently higher. Thinking flows faster, day to day.",
  },
];

export default function LabTimeline({
  hideCTA = false,
  ctaHref,
  ctaLabel,
}: {
  hideCTA?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
} = {}) {
  return (
    <div>
      {/* Mobile/tablet banner — full-bleed lifestyle asset */}
      <div className="relative -mt-20 md:mt-0 -mx-5 w-[calc(100%+2.5rem)] mb-6 overflow-hidden aspect-[4/3] md:mb-8 md:aspect-[16/9] lg:hidden">
        <Image
          src="/lifestyle/flow/FlowConkaRing.jpg"
          alt="CONKA Flow bottle beside a phone showing a CONKA cognitive score of 92"
          fill
          sizes="(max-width: 1024px) 100vw, 0px"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Header */}
      <h2
        className="brand-h1 mb-2 text-[#0e1f3f]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Feel it in 24 hours.
        <br />
        Measure it in 30 days.
      </h2>
      <p className="text-base text-black/70 leading-snug mb-8 max-w-[52ch]">
        Every milestone is measured from real CONKA app users.
      </p>

      <div className="lg:flex lg:gap-10 lg:items-start">
        {/* Milestone cards — one scannable line each */}
        <ol className="flex flex-col gap-4 lg:flex-1">
          {MILESTONES.map((m) => (
            <li
              key={m.timeframe}
              className="lab-clip-tr border border-black/12 bg-white p-5 lg:p-6"
            >
              <span
                className="lab-clip-tr inline-block text-white font-mono text-[11px] font-bold uppercase tracking-[0.16em] leading-none tabular-nums px-3 py-1.5"
                style={{ backgroundColor: NAVY }}
              >
                {m.timeframe}
              </span>
              <h3 className="mt-4 text-xl lg:text-2xl font-semibold leading-snug text-black">
                {m.title}
              </h3>
              <p className="mt-1.5 text-sm text-black/60 leading-snug">
                {m.description}
              </p>
            </li>
          ))}
        </ol>

        {/* Desktop sidebar image with figure plate */}
        <div className="hidden lg:block lg:w-[600px] lg:flex-shrink-0 lg:sticky lg:top-24">
          <div className="relative aspect-square border border-black/12 overflow-hidden bg-[#f5f5f5]">
            <Image
              src="/lifestyle/flow/FlowConkaRing.jpg"
              alt="CONKA Flow bottle beside a phone showing a CONKA cognitive score of 92"
              fill
              sizes="450px"
              className="object-cover"
            />
            <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              Fig. 03 · Daily Use
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              CONKA Flow · Score 92
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 lg:items-start">
        {!hideCTA && (
          <ConkaCTAButton href={ctaHref} meta={null}>
            {ctaLabel ?? `Try Both from £${PRICE_PER_SHOT_BOTH}/shot`}
          </ConkaCTAButton>
        )}
        <Link
          href="/app-insights"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2757] underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          See the app data
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
