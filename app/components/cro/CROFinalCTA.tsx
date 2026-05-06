import ConkaCTAButton from "../landing/ConkaCTAButton";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

export default function CROFinalCTA() {
  return (
    <div className="flex flex-col items-start gap-6">
      <p className="brand-eyebrow mb-3">
        {"// Start today · CONKA-03"}
      </p>
      <h2
        className="brand-h1 max-w-[20ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Brain Performance. One Daily Shot.
      </h2>
      <p className="brand-mono-sub">
        From £{PRICE_PER_SHOT_BOTH}/shot · 100-day money-back guarantee
      </p>
      <ConkaCTAButton meta={null}>Try CONKA Today</ConkaCTAButton>
    </div>
  );
}
