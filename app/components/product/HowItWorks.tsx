import Image from "next/image";
import {
  FormulaId,
  formulaContent,
} from "@/app/lib/productData";

const FORMULA_ASSETS: Record<FormulaId, string> = {
  "01": "/lifestyle/FlowDrink.jpg",
  "02": "/lifestyle/ClearBoxOpen.jpg",
};

/** Desktop supporting assets: square (lifestyle) and circle (vibe/taste) */
const SUPPORTING_SQUARE: Record<FormulaId, { src: string; alt: string }> = {
  "01": { src: "/lifestyle/FlowConkaRing.jpg", alt: "CONKA Flow with app and headphones" },
  "02": { src: "/lifestyle/ClearJeansTwo.jpg", alt: "Holding CONKA Clear casually" },
};
const SUPPORTING_CIRCLE: Record<FormulaId, { src: string; alt: string }> = {
  "01": { src: "/lifestyle/ConkaDesk.jpg", alt: "Opening CONKA at a desk" },
  "02": { src: "/lifestyle/ClearDesk.jpg", alt: "CONKA Clear at a desk" },
};

const STEPS: Record<
  FormulaId,
  Array<{ number: string; title: string; description: string }>
> = {
  "01": [
    {
      number: "01",
      title: "Choose Your Pack",
      description:
        "Select between 4, 12, or 28 shots based on your usage needs.",
    },
    {
      number: "02",
      title: "Take Daily",
      description:
        "Best taken in the morning with or without food. Perfect as a coffee replacement for sustained energy throughout the day.",
    },
    {
      number: "03",
      title: "Feel the Difference",
      description:
        "Consistent use unlocks calmer focus, better resilience, and the clarity you deserve.",
    },
  ],
  "02": [
    {
      number: "01",
      title: "Choose Your Pack",
      description:
        "Select between 4, 12, or 28 shots based on your usage needs.",
    },
    {
      number: "02",
      title: "Take Daily",
      description:
        "Best taken 30-60 minutes before you need peak performance, or in the afternoon to support decision-making and recovery.",
    },
    {
      number: "03",
      title: "Feel the Difference",
      description:
        "Consistent use unlocks sharper focus, lasting mental clarity, and the performance edge you deserve.",
    },
  ],
};

interface HowItWorksProps {
  formulaId: FormulaId;
}

export default function HowItWorks({ formulaId }: HowItWorksProps) {
  const formula = formulaContent[formulaId];
  const steps = STEPS[formulaId];
  const assetSrc = FORMULA_ASSETS[formulaId];
  const squareAsset = SUPPORTING_SQUARE[formulaId];
  const circleAsset = SUPPORTING_CIRCLE[formulaId];

  return (
    <>
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Protocol · SCI-01"}
        </p>
        <h2
          id="how-it-works-heading"
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          How {formula.name} Works
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {steps.length} Steps · Simple · Effective
        </p>
        {/* Mobile: two square lifestyle assets in a row under header */}
        <div className="mt-6 flex gap-3 lg:hidden">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden bg-[var(--brand-tint)] border border-black/8 sm:h-40 sm:w-40">
            <Image
              src={squareAsset.src}
              alt={squareAsset.alt}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="relative h-32 w-32 shrink-0 overflow-hidden bg-[var(--brand-tint)] border border-black/8 sm:h-40 sm:w-40">
            <Image
              src={circleAsset.src}
              alt={circleAsset.alt}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left: vertical 3-step section */}
          <div className="flex flex-col gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-14 h-14 shrink-0 bg-[var(--brand-accent)] text-white flex items-center justify-center">
                  <span className="font-mono text-lg font-bold tabular-nums">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="brand-h3 mb-1 text-lg">
                    {step.title}
                  </h3>
                  <p className="brand-body opacity-90">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: assets — mobile/tablet: single square; desktop (lg): sticky column with primary + 2 supporting */}
          {/* Mobile/tablet: single square image */}
          <div className="relative w-full aspect-square overflow-hidden lg:hidden border border-black/8">
            <Image
              src={assetSrc}
              alt={`${formula.name} – How it works`}
              fill
              className="object-contain md:object-cover"
              sizes="(max-width: 767px) 100vw, 50vw"
              priority={false}
            />
          </div>

          {/* Desktop (lg): left = primary, right = [square], [square] */}
          <div className="hidden lg:grid lg:sticky lg:top-24 w-full grid-cols-[2fr_1fr] grid-rows-[auto_auto] gap-3 md:gap-4">
            <div className="relative row-span-2 h-full min-h-0 overflow-hidden bg-[var(--brand-tint)] border border-black/8">
              <Image
                src={assetSrc}
                alt={`${formula.name} – How it works`}
                fill
                className="object-cover"
                sizes="50vw"
                priority={false}
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--brand-tint)] border border-black/8">
              <Image
                src={squareAsset.src}
                alt={squareAsset.alt}
                fill
                className="object-cover"
                sizes="16vw"
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--brand-tint)] border border-black/8">
              <Image
                src={circleAsset.src}
                alt={circleAsset.alt}
                fill
                className="object-cover"
                sizes="16vw"
              />
            </div>
          </div>
        </div>
    </>
  );
}
