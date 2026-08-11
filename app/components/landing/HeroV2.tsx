import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * HeroV2 — mobile home hero, stacked "real photo" structure (Magic Mind V2)
 *
 * Restructures the hero into three distinct, stacked blocks rather than text
 * overlaid on a looped video:
 *   1. ASSET — a full-bleed still photograph of the Flow shot held in hand
 *      (FlowHold). Its own off-white background reads as the panel, so the shot
 *      sits edge-to-edge like the Magic Mind product block.
 *   2. COPY  — headline + supporting line, left-aligned (brand default / MM).
 *   3. CTA   — primary buy button + trust micro-row (reviews).
 *
 * Ours carries more below-the-shot content than Magic Mind (trust row), so the
 * asset is height-capped to protect the fold. Mobile only — the page keeps the
 * desktop hero at `lg` and above.
 * ========================================================================== */

export default function HeroV2() {
  return (
    <div>
      {/* 1. ASSET — full-bleed out of the section gutter */}
      <div className="-mx-5 w-[calc(100%+2.5rem)] overflow-hidden bg-[#dcbccd]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/formulas/conkaFlow/FlowMmHero.jpg"
          alt="A hand holding a CONKA Flow shot"
          className="w-full aspect-[3/2] object-cover object-[46%_44%]"
        />
      </div>

      {/* 2. COPY */}
      <header className="pt-6">
        <h1 className="text-black font-semibold" style={{ letterSpacing: "-0.02em" }}>
          {/* Line 1 — the hero line: larger, held to one line. */}
          <span className="block whitespace-nowrap text-[clamp(2.4rem,11vw,3.4rem)] leading-[1.0] tracking-[-0.03em]">
            A Sharper Mind.
          </span>
          {/* Line 2 — subordinate. */}
          <span className="mt-1.5 block text-[26px] leading-[1.12]">
            Morning to Evening.
          </span>
        </h1>
        <p className="mt-6 max-w-[40ch] text-[17px] font-medium leading-[1.32] text-black">
          For minds that demand more. A patented nootropic shot, clinically
          formulated to support focus, memory, and mental endurance every day.
        </p>
      </header>

      {/* 3. CTA — centred, with proof beneath. */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <ConkaCTAButton href="/conka-both" meta={null}>
          Buy CONKA Today
        </ConkaCTAButton>
        <TrustMicroRow className="mt-4" />
      </div>
    </div>
  );
}
