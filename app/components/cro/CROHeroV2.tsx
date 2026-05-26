import Image from "next/image";
import CROPillCTA from "./CROPillCTA";

const AVATAR_COUNT = 5;

function TrustMicroRow() {
  return (
    <div className="flex items-center gap-3 mb-5">
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
      <div className="flex flex-col leading-tight">
        <span
          className="leading-none"
          style={{ color: "#F59E0B", fontSize: "14px", letterSpacing: "0.05em" }}
        >
          ★★★★★
        </span>
        <span className="text-[12px] font-bold text-black mt-1">
          622+ reviews · 5,000+ daily users
        </span>
      </div>
    </div>
  );
}

export default function CROHeroV2() {
  return (
    <div className="mx-auto max-w-[560px]">
      <div className="relative aspect-[4/3] overflow-hidden mb-6 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[var(--brand-radius-container)]">
        <Image
          src="/lifestyle/clear/ClearDrink.jpg"
          alt="Woman holding a CONKA Clear daily brain performance shot"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover object-center"
        />
      </div>

      <TrustMicroRow />

      <h1
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Brain Performance in One <em className="italic">Daily</em> Shot.
      </h1>

      <p className="text-[15px] leading-snug text-black mb-5">
        With a daily dose of CONKA, you&apos;ll experience a noticeable boost in
        focus, memory, stress resilience &amp; neuroplasticity through our
        patented formula.
        <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">†</sup>
      </p>

      <CROPillCTA className="w-full">Save £120 + Free Shipping</CROPillCTA>
    </div>
  );
}
