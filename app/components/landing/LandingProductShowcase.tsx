import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";
import LabWhatsInsideMini from "./LabWhatsInsideMini";

export default function LandingProductShowcase() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// The formulation · CONKA-03"}
      </p>
      <h2
        className="brand-h1 mb-4"
        style={{ letterSpacing: "var(--letter-spacing-premium-title)" }}
      >
        Two shots. Built around your day.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[60ch]">
        Two nootropic shots, each formulated with scientifically-studied
        ingredients to support sustained focus, memory, and mental endurance.
      </p>

      <div className="mb-8">
        <LabWhatsInsideMini />
      </div>

      <div className="mb-3 flex justify-start">
        <ConkaCTAButton meta={null}>
          Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
        </ConkaCTAButton>
      </div>
      <div>
        <LabTrustBadges />
      </div>
    </div>
  );
}
