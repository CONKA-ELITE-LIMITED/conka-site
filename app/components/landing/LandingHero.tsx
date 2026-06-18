import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import LaurelBadge from "./LaurelBadge";
import TrustChips, { type TrustChip } from "./TrustChips";
import TrustMicroRow from "./TrustMicroRow";
import { GUARANTEE_LABEL } from "@/app/lib/offerConstants";

/* Brain-project credibility banner — generic (non-persona) copy for home */
const HOME_LAUREL = {
  eyebrow: "World's Largest",
  body: "Consumer brain-research project. 1,000+ brains tested regularly through our app.",
};

/* Under-CTA trust chips — distinct icon per item, shared with the listicle hero */
const HOME_TRUST_CHIPS: TrustChip[] = [
  { label: "Zero caffeine", icon: "no-caffeine" },
  { label: "Informed Sport Certified", icon: "informed-sport" },
  { label: GUARANTEE_LABEL, icon: "guarantee" },
];

export default function LandingHero() {
  return (
    <div>
      {/* Mobile — brain-project badge, full-bleed image, trust row + title + CTA below */}
      <div className="lg:hidden">
        <LaurelBadge
          eyebrow={HOME_LAUREL.eyebrow}
          body={HOME_LAUREL.body}
          className="mt-2"
        />
        {/* aspect-[3/2] matches the render's native 2528x1696 so the
            composed ingredients aren't cropped away */}
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[3/2]">
          <Image
            src="/formulas/both/BoxIngredientHero.png"
            alt="CONKA Flow and Clear shots surrounded by their ingredients"
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
          <TrustMicroRow className="mb-4" />
          <h1
            className="text-black font-semibold text-[38px] leading-[1.08]"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>
          <p className="mt-4 text-[15px] leading-snug text-black/70">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>
        </header>

        <div className="mt-6 flex flex-col items-center">
          <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
          <TrustChips chips={HOME_TRUST_CHIPS} className="mt-4" />
        </div>
      </div>

      {/* Desktop — listicle hero pattern: asset bleeds flush to the left
          viewport edge at its native aspect, content column vertically
          centred beside it. */}
      <div className="hidden lg:grid lg:grid-cols-[52fr_48fr] lg:items-center">
        {/* Left — asset, edge to edge, native 3:2 so nothing crops */}
        <div className="relative w-full" style={{ aspectRatio: "2528/1696" }}>
          <Image
            src="/formulas/both/BoxIngredientHero.png"
            alt="CONKA Flow and Clear shots surrounded by their ingredients"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover object-center"
          />
        </div>

        {/* Right — badge, title, trust row, CTA */}
        <div className="flex flex-col items-start px-14">
          <LaurelBadge
            eyebrow={HOME_LAUREL.eyebrow}
            body={HOME_LAUREL.body}
            className="mb-5"
          />

          {/* whitespace-nowrap keeps both lines intact; sized so the longer
              line fits the fixed 48% column at lg and xl widths */}
          <h1
            className="text-black font-semibold text-4xl xl:text-5xl leading-[1.05] mb-5 whitespace-nowrap"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>

          <p className="text-base lg:text-lg leading-snug text-black/70 mb-7 max-w-[42ch]">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>

          <TrustMicroRow className="mb-5" />

          <div>
            <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
            <TrustChips chips={HOME_TRUST_CHIPS} className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
