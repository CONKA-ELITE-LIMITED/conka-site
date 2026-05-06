import Image from "next/image";
import ConkaCTAButton from "../landing/ConkaCTAButton";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

const AVATAR_COUNT = 5;

function TrustBand() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-4 border-t border-black/10">
      {/* Stars + rating */}
      <div className="flex items-center gap-1.5">
        <span className="text-black leading-none" style={{ fontSize: "13px", letterSpacing: "0.05em" }}>
          ★★★★★
        </span>
        <span className="font-mono text-[11px] font-bold tabular-nums text-black">4.7/5</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40">Verified</span>
      </div>

      <span className="text-black/15 text-xs" aria-hidden>|</span>

      {/* Informed Sport */}
      <div className="flex items-center gap-1.5">
        <Image
          src="/logos/InformedSportLogo.png"
          alt="Informed Sport certified"
          width={20}
          height={20}
          className="object-contain"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/55">
          Informed Sport
        </span>
      </div>

      <span className="text-black/15 text-xs" aria-hidden>|</span>

      {/* Avatar stack + customer count */}
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
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">
          150,000+ doses delivered
        </span>
      </div>
    </div>
  );
}

function PriceAnchor() {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/50 tabular-nums">
      From £{PRICE_PER_SHOT_BOTH}/shot &middot; {GUARANTEE_DAYS}-day guarantee
    </p>
  );
}

export default function CROHero() {
  return (
    <div>
      {/* Mobile — full-bleed image, title + CTA below */}
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
          <p className="brand-eyebrow mb-3">
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

        <div className="mt-6 flex flex-col gap-3">
          <ConkaCTAButton meta={null}>Try CONKA Today</ConkaCTAButton>
          <PriceAnchor />
        </div>

        <div className="mt-8">
          <TrustBand />
        </div>
      </div>

      {/* Desktop — content left, asset right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12 xl:gap-16 lg:items-center">
        <div className="flex flex-col items-start">
          <p className="brand-eyebrow mb-5">
            {"// A new state of mind · CONKA-00"}
          </p>

          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05] mb-5 max-w-[18ch]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Brain Performance in One Daily Shot.
          </h1>

          <p className="text-base lg:text-lg leading-snug text-black/70 mb-8 max-w-[42ch]">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>

          <div className="flex flex-col gap-3 mb-10">
            <ConkaCTAButton meta={null}>Try CONKA Today</ConkaCTAButton>
            <PriceAnchor />
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
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
