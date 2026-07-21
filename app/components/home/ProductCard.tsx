import Link from "next/link";
import Image from "next/image";
import {
  getFormulaImage,
  getProtocolImage,
} from "@/app/lib/productImageConfig";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

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
  displayName: string;
  rolePill: string;
  benefitHeadline: string;
  bodyCopy: string;
  rating: number;
  reviews: string;
  stats: Stat[];
  image: string;
  link: string;
  /** Soft badge shown only on the bundle card. */
  badge?: string;
}

// Per-formula ratings. Mocked for now: Flow/Clear carry distinct averages, Both
// keeps the sitewide 4.7. The sitewide 622 reviews split 60/40 across Flow/Clear
// (373/249); Both shows the full total.
const getProductData = (
  productType: "flow" | "clear" | "protocol",
): ProductCardData => {
  if (productType === "flow") {
    return {
      displayName: "Flow",
      rolePill: "Morning ritual",
      benefitHeadline: "Energy without the crash",
      bodyCopy:
        "Sustained focus for training and work, with no caffeine and no crash.",
      rating: 4.8,
      reviews: "373",
      stats: [
        { value: "-56%", label: "Stress" },
        { value: "+18%", label: "Memory" },
        { value: "+42%", label: "Sleep" },
      ],
      image: getFormulaImage("01"),
      link: "/conka-flow",
    };
  }

  if (productType === "clear") {
    return {
      displayName: "Clear",
      rolePill: "Afternoon reset",
      benefitHeadline: "Clarity and complete recovery",
      bodyCopy:
        "Sharpen performance when you need it, support recovery when you're done.",
      rating: 4.6,
      reviews: "249",
      stats: [
        { value: "+63%", label: "Memory" },
        { value: "+57%", label: "Blood flow" },
        { value: "-42%", label: "Anxiety" },
      ],
      image: getFormulaImage("02"),
      link: "/conka-clarity",
    };
  }

  return {
    displayName: "Both",
    rolePill: "Full daily system",
    benefitHeadline: "Morning focus, afternoon clarity",
    bodyCopy:
      "Two shots, 16 active ingredients, all-day coverage from wake-up to wind-down.",
    rating: 4.7,
    reviews: "622",
    stats: [
      { value: "+63%", label: "Memory" },
      { value: "-56%", label: "Stress" },
      { value: "+42%", label: "Sleep" },
    ],
    image: getProtocolImage("3"),
    link: "/conka-both",
    badge: "Most popular",
  };
};

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** Five 15px stars in a row; `w-max` keeps the intrinsic width so the fill
 *  overlay can clip it without the flex row compressing. */
function StarRow({ className }: { className: string }) {
  return (
    <span className={`flex w-max ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

/** Fractional navy stars (grey base + navy fill clipped to rating/5) plus the
 *  "4.8 (373 reviews)" label, mirroring the PDP hero treatment. */
function CardRating({ rating, reviews }: { rating: number; reviews: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="relative inline-block leading-none" aria-hidden>
        <StarRow className="text-black/15" />
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          <StarRow className="text-[#1B2757]" />
        </span>
      </span>
      <span className="text-sm font-bold text-black leading-none">
        {rating.toFixed(1)}{" "}
        <span className="font-medium text-black/50">({reviews} reviews)</span>
      </span>
    </div>
  );
}

export default function ProductCard({
  productType,
  imageAspect = "square",
}: ProductCardProps) {
  const product = getProductData(productType);
  const imageAspectClass =
    imageAspect === "wide" ? "aspect-[4/3]" : "aspect-square";

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden ring-1 ring-black/8">
      {/* Product image → PDP link */}
      <Link
        href={product.link}
        className={`relative block w-full ${imageAspectClass} overflow-hidden bg-[#eef1f8] group`}
      >
        <Image
          src={product.image}
          alt={product.displayName}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-[#C9A24A] px-3 py-1 text-[11px] font-semibold text-white leading-none">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Content, centred (Magic Mind style) */}
      <div className="flex flex-col flex-1 items-center text-center p-5 lg:p-6">
        {/* Name + rating */}
        <h3 className="text-3xl font-bold text-black leading-none tracking-tight">
          {product.displayName}
        </h3>
        <div className="mt-3">
          <CardRating rating={product.rating} reviews={product.reviews} />
        </div>

        {/* Role pill, flanked by hairlines */}
        <div className="mt-5 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-black/10" />
          <span className="inline-flex items-center rounded-full bg-[#eef1f8] px-3 py-1 text-xs font-semibold text-[#1B2757] leading-none">
            {product.rolePill}
          </span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        {/* Description */}
        <p className="mt-4 text-base font-semibold text-black leading-snug">
          {product.benefitHeadline}
        </p>
        <p className="mt-1.5 text-sm text-black/70 leading-relaxed">
          {product.bodyCopy}
        </p>

        {/* Simplified stat trio */}
        <div className="mt-5 pt-5 grid w-full grid-cols-3 gap-3 border-t border-black/10">
          {product.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-black leading-none tabular-nums">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-black/45 leading-none">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA, pinned to bottom */}
        <div className="mt-6 w-full">
          <ConkaCTAButton
            href={product.link}
            meta={null}
            className="w-full max-w-none"
          >
            Try {product.displayName}
          </ConkaCTAButton>
        </div>
      </div>
    </article>
  );
}
