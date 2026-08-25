"use client";

/**
 * Build Your Order — product media (static).
 *
 * The clean V3/New floating-bottle statics, swapped by selected product. The
 * flow deliberately carries NO motion assets (SCRUM-1249 review): statics keep
 * the checkout surface calm and the neuron Float animations stay on the
 * marketing surfaces. A restrained caption keeps the core selling point
 * (patent / cert) without cluttering the frame.
 */

import Image from "next/image";
import { type ByoProduct } from "@/app/lib/byoData";
import { bottleRenders } from "@/app/lib/productImages";

export const BYO_STATIC: Record<ByoProduct, { src: string; alt: string }> = bottleRenders;

const CAPTION: Record<ByoProduct, string> = {
  flow: "Morning. Caffeine-free focus.",
  clear: "Afternoon. Clears the 2pm fog.",
  both: "Morning to evening. The full system.",
};

export default function ByoMedia({
  product,
  showCaption = true,
}: {
  product: ByoProduct;
  /** Off on the Learn step, where the page heading owns the hierarchy. */
  showCaption?: boolean;
}) {
  const media = BYO_STATIC[product];

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
        className="object-cover object-center"
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
