import Link from "next/link";
import Image from "next/image";
import { formulaContent } from "@/app/lib/productData";
import {
  getFormulaImage,
  getProtocolImage,
} from "@/app/lib/productImageConfig";

interface ProductCardProps {
  productType: "flow" | "clear" | "protocol";
  /** Image aspect. Square for desktop/tablet cards, wide for mobile carousel. */
  imageAspect?: "square" | "wide";
}

interface Stat {
  value: string;
  label: string;
}

interface ProductCardData {
  number: string;
  name: string;
  categoryTag: string;
  imageTag: string;
  benefitHeadline: string;
  bodyCopy: string;
  bestFor: string[];
  stats: Stat[];
  image: string;
  link: string;
}

const getProductData = (
  productType: "flow" | "clear" | "protocol",
): ProductCardData => {
  if (productType === "flow") {
    const flow = formulaContent["01"];
    return {
      number: "01",
      name: flow.name,
      categoryTag: "CONKA · FLOW",
      imageTag: "MORNING",
      benefitHeadline: "Energy without the crash",
      bodyCopy:
        "Sustained focus for training and work — no caffeine, no crash.",
      bestFor: ["Morning training", "Long workdays", "Clean mental stamina"],
      stats: [
        { value: "-56%", label: "STRESS" },
        { value: "+18%", label: "MEMORY" },
        { value: "+42%", label: "SLEEP" },
      ],
      image: getFormulaImage("01"),
      link: "/conka-flow",
    };
  }

  if (productType === "clear") {
    const clear = formulaContent["02"];
    return {
      number: "02",
      name: clear.name,
      categoryTag: "CONKA · CLEAR",
      imageTag: "AFTERNOON",
      benefitHeadline: "Mental clarity and complete recovery",
      bodyCopy:
        "Sharpen performance when you need it. Support recovery when you're done.",
      bestFor: ["Post-training recovery", "Afternoon clarity", "Sleep quality"],
      stats: [
        { value: "+63%", label: "MEMORY" },
        { value: "+57%", label: "BLOOD FLOW" },
        { value: "-42%", label: "ANXIETY" },
      ],
      image: getFormulaImage("02"),
      link: "/conka-clarity",
    };
  }

  return {
    number: "03",
    name: "Both (Flow + Clear)",
    categoryTag: "CONKA · DAILY SYSTEM",
    imageTag: "MOST POPULAR",
    benefitHeadline: "The full daily system",
    bodyCopy:
      "Morning focus meets afternoon clarity. Two shots, 16 active ingredients, all-day coverage.",
    bestFor: [
      "All-day energy & focus",
      "Full recovery & clarity",
      "The complete daily routine",
    ],
    stats: [
      { value: "+63%", label: "MEMORY" },
      { value: "-56%", label: "STRESS" },
      { value: "+42%", label: "SLEEP" },
    ],
    image: getProtocolImage("3"),
    link: "/conka-both",
  };
};

export default function ProductCard({
  productType,
  imageAspect = "square",
}: ProductCardProps) {
  const product = getProductData(productType);
  const imageAspectClass =
    imageAspect === "wide" ? "aspect-[4/3]" : "aspect-square";

  return (
    <div className="flex flex-col bg-white border border-black/12 overflow-hidden h-full">
      {/* Category row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
        <span className="font-mono text-[11px] font-bold tabular-nums text-black/40 leading-none">
          {product.number}.
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/60 leading-none">
          {product.categoryTag}
        </span>
      </div>

      {/* Product image → PDP link, with chamfered navy tag */}
      <Link
        href={product.link}
        className={`relative block w-full ${imageAspectClass} overflow-hidden border-b border-black/8 group`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-0 right-0 bg-[#1B2757] text-white px-3 py-1.5 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] leading-none">
            {product.imageTag}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 lg:p-6">
        {/* Mono product-name eyebrow */}
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 mb-2 leading-none">
          {product.name}
        </p>

        {/* Benefit headline */}
        <h3 className="text-xl lg:text-2xl font-semibold text-black leading-tight mb-3">
          {product.benefitHeadline}
        </h3>

        {/* Body copy */}
        <p className="text-sm text-black/60 leading-relaxed mb-4">
          {product.bodyCopy}
        </p>

        {/* 3-metric stat grid */}
        <div className="grid grid-cols-3 gap-1 py-3 border-y border-black/8 mb-4">
          {product.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 leading-none">
                {stat.label}
              </span>
              <span className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Best-for list — em-dash bullets */}
        <ul className="space-y-1.5 mb-4">
          {product.bestFor.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-black/70 leading-snug"
            >
              <span className="font-mono text-black/30 shrink-0 leading-snug">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA — pinned to bottom */}
        <div className="mt-auto">
          <Link
            href={product.link}
            className="w-full inline-flex items-center gap-3 py-3.5 pl-4 pr-5 bg-[#1B2757] text-white transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]"
          >
            <span className="relative w-6 h-6 shrink-0" aria-hidden>
              <Image
                src="/logos/ConkaO.png"
                alt=""
                fill
                sizes="24px"
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>
            <span className="flex-1 font-mono font-bold text-sm uppercase tracking-[0.12em] leading-none">
              Shop Now
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="shrink-0"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
