import Image from "next/image";
import ConkaCTAButton from "../landing/ConkaCTAButton";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

const AVATAR_COUNT = 5;

function TrustBand() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 pt-4 border-t border-black/10">
      {/* Avatar stack + star rating */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center">
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <div
              key={i}
              className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white ring-1 ring-black/8"
              style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: AVATAR_COUNT - i }}
            >
              <Image
                src={`/avatars/${i + 1}.jpg`}
                alt="CONKA customer"
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-black leading-none" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
            ★★★★★
          </span>
          <span className="font-mono text-[10px] font-bold tabular-nums text-black">4.7/5</span>
        </div>
      </div>

      <span className="text-black/15 text-xs" aria-hidden>|</span>

      {/* Informed Sport */}
      <div className="flex items-center gap-1.5">
        <Image
          src="/logos/InformedSportLogo.png"
          alt="Informed Sport certified"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/55">
          Informed Sport
        </span>
      </div>
    </div>
  );
}

export default function CROHero() {
  return (
    <div>
      {/* Mobile — stat → title → subline → image → CTA → trust */}
      <div className="lg:hidden">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] tabular-nums text-black/50 pt-6 mb-3">
          150,000+ bottles sold
        </p>

        <h1
          className="text-black font-semibold text-3xl leading-[1.08] mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          A Sharper Mind.
          <br />
          Morning to Evening.
        </h1>

        <p className="text-sm text-black/65 leading-relaxed mb-5">
          Transform your focus, memory, and mental endurance with a patented nootropic formula, clinically dosed for real, measurable results.
        </p>

        <div className="relative aspect-[16/9] overflow-hidden mb-6">
          <Image
            src="/lifestyle/CreationOfConkaBlack.jpg"
            alt="Two hands exchanging a CONKA brain performance shot"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center scale-110"
          />
        </div>

        <div className="mb-6">
          <ConkaCTAButton meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
        </div>

        <TrustBand />
      </div>

      {/* Desktop — content left, asset right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12 xl:gap-16 lg:items-center">
        <div className="flex flex-col items-start">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] tabular-nums text-black/50 mb-4">
            150,000+ bottles sold
          </p>

          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05] mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>

          <p className="text-base leading-relaxed text-black/65 mb-8 max-w-[42ch]">
            Transform your focus, memory, and mental endurance with a patented nootropic formula, clinically dosed for real, measurable results.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>

          <div className="mb-10">
            <ConkaCTAButton meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
            <p className="brand-mono-sub mt-3">
              Patented formula &middot; Informed Sport certified &middot; {GUARANTEE_DAYS}-day guarantee
            </p>
          </div>

          <TrustBand />
        </div>

        <div className="relative w-full aspect-[3/2] overflow-hidden border border-black/12 bg-[#f5f5f5]">
          <Image
            src="/lifestyle/CreationOfConkaBlack.jpg"
            alt="Two hands exchanging a CONKA brain performance shot"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center scale-110"
          />
        </div>
      </div>
    </div>
  );
}
