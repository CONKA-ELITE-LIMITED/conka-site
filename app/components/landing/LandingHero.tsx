import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";

const STATS = [
  { value: "32", label: "PEER-REVIEWED\nSTUDIES CITED" },
  { value: "150,000+", label: "DOSES\nDELIVERED" },
  { value: "4.7/5", label: "VERIFIED\nCUSTOMER RATING" },
];

function StatStrip() {
  // 3-col row on every breakpoint. Text scales up on desktop; kept
  // deliberately understated so the CTA above stays the primary anchor.
  return (
    <div className="w-full grid grid-cols-3 border border-black/12 overflow-hidden">
      {STATS.map((stat, idx) => (
        <div
          key={stat.value}
          className={`flex flex-col items-center justify-center gap-1.5 lg:gap-2 px-2 py-3 lg:px-4 lg:py-5 text-center ${
            idx < STATS.length - 1 ? "border-r border-black/10" : ""
          }`}
        >
          <p className="font-mono text-base lg:text-2xl font-bold text-black tracking-tight leading-none tabular-nums">
            {stat.value}
          </p>
          <p className="font-mono text-[8px] lg:text-[10px] uppercase tracking-[0.14em] text-black/45 leading-snug whitespace-pre-line">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LandingHero() {
  return (
    <div>
      {/* Mobile — full-bleed image (clean, soft fade at bottom), title + CTA below */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[4/3]">
          <Image
            src="/lifestyle/CreationOfConkaBlack.jpg"
            alt="Two hands exchanging a CONKA brain performance shot"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        <header className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/55 tabular-nums mb-3">
            {"// A new state of mind · CONKA-00"}
          </p>
          <h1
            className="text-black font-semibold text-3xl leading-[1.08]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Brain Performance in One Daily Shot.
          </h1>
          <p className="mt-4 text-[15px] leading-snug text-black/70">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>
        </header>

        <div className="mt-6">
          <ConkaCTAButton meta={null}>Try CONKA Today</ConkaCTAButton>
        </div>

        <div className="mt-10">
          <StatStrip />
        </div>
      </div>

      {/* Desktop — content left, asset right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12 xl:gap-16 lg:items-center">
        {/* Left — eyebrow, title, CTA, stats */}
        <div className="flex flex-col items-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/55 tabular-nums mb-5">
            {"// A new state of mind · CONKA-00"}
          </p>

          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05] mb-5 max-w-[18ch]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Brain Performance in One Daily Shot.
          </h1>

          <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[42ch]">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>

          <div className="mb-10">
            <ConkaCTAButton meta={null}>Try CONKA Today</ConkaCTAButton>
          </div>

          <StatStrip />
        </div>

        {/* Right — clean asset, no overlays. Wider/shorter aspect on desktop
            so the source crop reads less zoomed. */}
        <div className="relative w-full aspect-[3/2] overflow-hidden border border-black/12 bg-[#f5f5f5]">
          <Image
            src="/lifestyle/CreationOfConkaBlack.jpg"
            alt="Two hands exchanging a CONKA brain performance shot"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
