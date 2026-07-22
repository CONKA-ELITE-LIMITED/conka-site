import { getDisplayDiscount, getOfferPricing } from "@/app/lib/funnelData";

export interface ProductGridHeaderProps {
  /** Eyebrow pill above the title. Pass "" to hide it. */
  eyebrow?: string;
  /** Main heading. Pass "" to hide it. */
  title?: string;
  /** Sub-line under the title; a `{percent}` token is replaced with the live
   *  discount for `offer`. Pass "" to hide it. */
  subline?: string;
  /** Product + cadence whose live subscription discount drives `{percent}`. */
  offer?: {
    product: "both" | "flow" | "clear";
    cadence: "monthly-sub" | "quarterly-sub";
  };
}

/**
 * Default offer-header copy for the product grid. This renders wherever the grid
 * renders (home, listicles, etc.). Any field can be overridden per usage; set a
 * field to "" to hide just that line. The `{percent}` token resolves from live
 * funnel pricing so the discount stays in sync with the offer.
 */
const DEFAULTS = {
  eyebrow: "Limited time offer",
  title: "Clinically-dosed brain performance",
  subline: "Try it risk free, now {percent}% off.",
  offer: { product: "both", cadence: "monthly-sub" },
} as const;

export default function ProductGridHeader(props: ProductGridHeaderProps = {}) {
  const eyebrow = props.eyebrow ?? DEFAULTS.eyebrow;
  const title = props.title ?? DEFAULTS.title;
  const offer = props.offer ?? DEFAULTS.offer;
  const percent = getDisplayDiscount(
    getOfferPricing(offer.product, offer.cadence),
  );
  const subline = (props.subline ?? DEFAULTS.subline).replace(
    /\{percent\}/g,
    String(percent),
  );

  return (
    <div className="mb-8 px-4 text-center md:mb-10">
      {eyebrow ? (
        <span
          className="mb-4 inline-block rounded-[8px] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#14532d]"
          style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
        >
          {eyebrow}
        </span>
      ) : null}
      {title ? (
        <h2
          className="text-[28px] font-bold leading-[1.1] text-black md:text-[40px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
      ) : null}
      {subline ? (
        <p className="mx-auto mt-3 max-w-xl text-[15px] font-medium text-black/60">
          {subline}
        </p>
      ) : null}
    </div>
  );
}
