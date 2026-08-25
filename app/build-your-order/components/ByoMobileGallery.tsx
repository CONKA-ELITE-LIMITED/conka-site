"use client";

/**
 * Build Your Order — mobile sticky media gallery (Bob pattern, SCRUM-1249).
 *
 * A pinned media band under the step chrome, swipeable with scroll-snap plus
 * arrow controls. Statics only, no motion (SCRUM-1249 review):
 *   - Learn step: the clean V3/New floating-bottle shots (system first).
 *   - Build / Review: the selected product's PDP hero gallery assets, so the
 *     choice stage shows the same frames the product pages sell with.
 * Mobile only — desktop keeps the sticky left column.
 *
 * A gradient offer ribbon closes the band. Every figure derives live from
 * byoData (the monthly subscription of the SELECTED product), so the ribbon
 * can never drift from the plan cards below it.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  type ByoProduct,
  getOfferPricing,
  getDisplayDiscount,
} from "@/app/lib/byoData";
import { MM_GALLERY_ASSETS } from "@/app/lib/mmPdpData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { BYO_STATIC } from "./ByoMedia";

const PRODUCT_TO_HERO_ID: Record<ByoProduct, ProductHeroId> = {
  flow: "01",
  clear: "02",
  both: "03",
};

/** Hero-asset slides per product on the choice stages, capped for weight. */
const STILL_COUNT = 5;

export default function ByoMobileGallery({
  product,
  step,
}: {
  product: ByoProduct;
  step: number;
}) {
  // Learn: the three bottle statics, the full system leading. Build/Review:
  // the selected product's PDP hero frames.
  const slides =
    step === 1
      ? [BYO_STATIC.both.src, BYO_STATIC.flow.src, BYO_STATIC.clear.src]
      : MM_GALLERY_ASSETS[PRODUCT_TO_HERO_ID[product]].slice(0, STILL_COUNT);
  const slideCount = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Jump back to the first slide when the slide set changes (product switch or
  // step change), so the media always matches the selection.
  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [product, step]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slideCount - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }, [slideCount]);

  // The dots/arrows follow the actual scroll position (swipe or arrow alike).
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  const pricing = getOfferPricing(product, "monthly-sub");
  const savePct = getDisplayDiscount(pricing);
  const freeShots = pricing.freeShots ?? 0;

  return (
    <div className="bg-white">
      <div className="relative">
        {/* Snap track. Each slide is exactly one viewport wide; the 7:5 ratio
            matches the PDP gallery assets so nothing crops on the choice
            stages, and the square bottle statics centre-crop gracefully. */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex aspect-[7/5] max-h-[300px] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Product gallery"
        >
          {slides.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0 snap-start bg-[#f1f1f3]">
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Arrows — mirrored circular controls, 44px tap targets. */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-sm transition-opacity disabled:opacity-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => goTo(index + 1)}
          disabled={index === slideCount - 1}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-sm transition-opacity disabled:opacity-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Position dots */}
        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden>
          {Array.from({ length: slideCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "w-4 bg-black/70" : "w-1.5 bg-black/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Offer ribbon — the brand offer gradient (matches the PDP plan badges);
          figures derive from the selected product's monthly sub. */}
      {(savePct > 0 || freeShots > 0) && (
        <p
          className="px-4 py-2 text-center text-[13px] font-bold text-[#14532d]"
          style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
        >
          {savePct > 0 && <>Save {savePct}%</>}
          {savePct > 0 && freeShots > 0 && <> + </>}
          {freeShots > 0 && <>{freeShots} free shots</>}
          {" "}on your first order
        </p>
      )}
    </div>
  );
}
