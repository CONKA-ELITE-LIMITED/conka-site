import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import GuaranteeRow from "./GuaranteeRow";

const AVATAR_COUNT = 5;

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

/* Trust micro-row: stacked avatars + (4.5 stars + Excellent 4.7) + review count */
function TrustMicroRow() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center">
        {Array.from({ length: AVATAR_COUNT }, (_, i) => (
          <div
            key={i}
            className="relative w-[35px] h-[35px] rounded-full overflow-hidden"
            style={{
              marginLeft: i === 0 ? 0 : "-10px",
              zIndex: AVATAR_COUNT - i,
            }}
          >
            <Image
              src={`/avatars/${i + 1}.jpg`}
              alt="CONKA customer"
              fill
              className="object-cover"
              sizes="35px"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-2">
          {/* 4.5 stars via overlay: grey base + gold clipped to 90% width */}
          <div
            className="relative inline-block leading-none"
            style={{ fontSize: "20px", letterSpacing: "0.05em" }}
            aria-label="4.5 out of 5 stars"
          >
            <span className="text-black/15" aria-hidden="true">
              ★★★★★
            </span>
            <span
              className="absolute top-0 left-0 overflow-hidden whitespace-nowrap"
              style={{ color: "#F59E0B", width: "90%" }}
              aria-hidden="true"
            >
              ★★★★★
            </span>
          </div>
          <span className="text-[14px] font-bold text-black">
            Excellent 4.7
          </span>
        </div>
        <span className="text-[12px] text-black mt-1">
          <strong className="font-bold">622+</strong> reviews ·{" "}
          <strong className="font-bold">5,000+</strong> daily users
        </span>
      </div>
    </div>
  );
}

export default function LandingHero() {
  return (
    <div>
      {/* Mobile — full-bleed image (clean, soft fade at bottom), trust row + title + CTA below */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[4/3]">
          <Image
            src="/formulas/both/BothHero.jpg"
            alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            style={{
              // Crop the source's white space so the bottles fill the frame.
              // GPU-only transform, no layout cost.
              transform: "scale(1.4) translateY(-10%)",
              transformOrigin: "center center",
            }}
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
          <TrustMicroRow />
          <h1
            className="text-black font-semibold text-[38px] leading-[1.08]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Brain Performance
            <br />
            in One <em className="italic">Daily</em> Shot.
          </h1>
          <p className="mt-4 text-[15px] leading-snug text-black/70">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>
        </header>

        <div className="mt-6 flex flex-col items-center">
          <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
          <GuaranteeRow />
        </div>

        <div className="mt-10">
          <StatStrip />
        </div>
      </div>

      {/* Desktop — content left, asset right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12 xl:gap-16 lg:items-center">
        {/* Left — trust row, title, CTA, stats */}
        <div className="flex flex-col items-start">
          <TrustMicroRow />

          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05] mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Brain Performance
            <br />
            in One <em className="italic">Daily</em> Shot.
          </h1>

          <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[42ch]">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
            <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
              †
            </sup>
          </p>

          <div className="mb-10">
            <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
            <GuaranteeRow />
          </div>

          <StatStrip />
        </div>

        {/* Right — clean asset, no overlays. Wider/shorter aspect on desktop
            so the source crop reads less zoomed. */}
        <div className="relative w-full aspect-[3/2] overflow-hidden border border-black/12 bg-[#f5f5f5]">
          <Image
            src="/formulas/both/BothHero.jpg"
            alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center"
            style={{
              // Crop the source's white space so the bottles fill the frame.
              transform: "scale(1.4) translateY(-10%)",
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
