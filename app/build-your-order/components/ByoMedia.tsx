"use client";

/**
 * Build Your Order — product media (static).
 *
 * The clean V3/New floating-bottle statics, swapped by selected product; the
 * Review step overrides them with the delivery-box photo via `media`. The
 * flow deliberately carries NO motion assets (SCRUM-1249 review): statics keep
 * the checkout surface calm and the neuron Float animations stay on the
 * marketing surfaces. A restrained caption keeps the core selling point
 * (patent / cert) without cluttering the frame.
 */

import Image from "next/image";
import {
  type OfferCadence,
  type OfferProduct,
  OFFER_PRODUCTS,
} from "@/app/lib/offerData";
import { bottleRenders } from "@/app/lib/productImages";

export const BYO_STATIC: Record<OfferProduct, { src: string; alt: string }> = bottleRenders;

// The delivery photo used on the Review step: product AND box, the thing that
// actually arrives. Quarterly shows the larger shipment (same precedent as the
// PDP slideshow's quarterly first-slide swap). Lives here (eager, tiny) rather
// than in the code-split SummaryStep so the desktop media column can share it
// without pulling SummaryStep into the first-paint bundle.
const BOX_IMG: Record<OfferProduct, string> = {
  flow: "/formulas/box/FlowBox.jpg",
  clear: "/formulas/box/ClearBox.jpg",
  both: "/formulas/box/BothBox.jpg",
};
const QUARTERLY_BOX_IMG: Record<OfferProduct, string> = {
  flow: "/formulas/box/FlowQuarterlyBox.jpg",
  clear: "/formulas/box/ClearQuarterlyBox.jpg",
  both: "/formulas/box/BothQuarterlyBox.jpg",
};

export function getBoxImage(
  product: OfferProduct,
  cadence: OfferCadence,
): { src: string; alt: string } {
  return {
    src: (cadence === "quarterly-sub" || cadence === "quarterly-otp" ? QUARTERLY_BOX_IMG : BOX_IMG)[product],
    alt: `${OFFER_PRODUCTS[product].label} delivery box`,
  };
}

const CAPTION: Record<OfferProduct, string> = {
  flow: "Morning. Caffeine-free focus.",
  clear: "Afternoon. Clears the 2pm fog.",
  both: "Morning to evening. The full system.",
};

export default function ByoMedia({
  product,
  showCaption = true,
  media: mediaOverride,
  fit = "cover",
}: {
  product: OfferProduct;
  /** Off on the Learn step, where the page heading owns the hierarchy. */
  showCaption?: boolean;
  /** Swap the bottle render for another asset (the Review step's box photo). */
  media?: { src: string; alt: string };
  /** "contain" keeps the asset's full frame at column width with quiet space
   *  above and below (the Review step's box photo); "cover" crop-fills, which
   *  only the Learn step's bottle render tolerates. */
  fit?: "cover" | "contain";
}) {
  const media = mediaOverride ?? BYO_STATIC[product];

  return (
    // Height comes entirely from the parent (mobile gallery slide / desktop
    // column) — no min-height, so compact containers aren't forced taller.
    <div className="relative w-full h-full overflow-hidden bg-[#f1f1f3]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 42vw"
        // Default lazy loading on purpose: this column is display:none on
        // mobile, so lazy means the hidden image is never fetched there, while
        // on desktop it sits in the first viewport and loads immediately.
        className={`${fit === "contain" ? "object-contain" : "object-cover"} object-center`}
      />

      {/* Slim caption only — no product name (the page heading + selections own
          the title). Sits on a strong white scrim so it never clashes with the
          render behind it. Hidden on Learn to keep the hierarchy clean. */}
      {showCaption && (
        <div className="absolute inset-x-0 bottom-0 px-4 pt-10 pb-3 lg:px-7 lg:pb-5 bg-gradient-to-t from-white via-white/70 to-transparent">
          <p className="text-[14px] font-semibold text-black">
            {CAPTION[product]}
          </p>
          <p className="text-[12px] text-black/55 mt-0.5">
            Informed Sport certified · UK patent GB2629279
          </p>
        </div>
      )}
    </div>
  );
}
