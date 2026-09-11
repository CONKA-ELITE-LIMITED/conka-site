"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/app/lib/productData";
import { CadenceType } from "@/app/lib/cadenceData";
import { HERO_CTA_ANCHOR_ID } from "./pdpAnchors";

/* ============================================================================
 * StickyPurchaseFooterMobile
 *
 * The persistent buy bar on the three PDPs, below lg. One row: a single CTA
 * carrying its own price. Cadence selection lives in the hero widget, so the
 * bar only has to confirm the price and take the tap.
 *
 * Deliberately minimal (SCRUM-1260). It used to carry a guarantee line, and
 * before that a pack-size dropdown, both of which doubled its height on the one
 * surface where vertical space is scarcest. The guarantee has its own section.
 * ========================================================================== */

/** Fraction of the viewport the hero CTA must rise past before the bar shows.
 *  Raise to reveal earlier; at or below 0.5 the bar can never cover it. */
const REVEAL_ABOVE = 0.5;

interface StickyPurchaseFooterMobileProps {
  selectedCadence: CadenceType;
  cadencePrice: number;
  onAddToCart: () => void;
}

export default function StickyPurchaseFooterMobile({
  selectedCadence,
  cadencePrice,
  onAddToCart,
}: StickyPurchaseFooterMobileProps) {
  const [isPastHeroCta, setIsPastHeroCta] = useState(false);

  // Watches the CTA, not a scroll offset: the offset this replaced went stale
  // the moment the hero changed height.
  useEffect(() => {
    const cta = document.getElementById(HERO_CTA_ANCHOR_ID);
    if (!cta) {
      setIsPastHeroCta(true);
      return;
    }

    const reveal = () => {
      const { bottom } = cta.getBoundingClientRect();
      setIsPastHeroCta(bottom < window.innerHeight * REVEAL_ABOVE);
    };

    const observer = new IntersectionObserver(reveal, {
      rootMargin: `-${(1 - REVEAL_ABOVE) * 100}% 0px 0px 0px`,
    });
    observer.observe(cta);

    // Rotating changes innerHeight without moving anything.
    window.addEventListener("resize", reveal, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", reveal);
    };
  }, []);

  if (!isPastHeroCta) return null;

  const frequency =
    selectedCadence === "monthly-sub"
      ? "/mo"
      : selectedCadence === "quarterly-sub"
        ? "/quarter"
        : "";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/8 bg-white/95 backdrop-blur-sm">
      <div
        className="px-4 py-2.5"
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
      >
        {/* Same plain CTA as the hero buy panel above, deliberately: the
            icon+meta variant forces its label onto one line, and
            "ADD TO CART · £149.99/QUARTER" is wide enough to overflow a small
            phone. This one wraps instead. */}
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full rounded-full bg-[#1B2757] py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 ease-out hover:opacity-95 active:opacity-90 motion-safe:active:scale-[0.98]"
        >
          Add to Cart · {formatPrice(cadencePrice)}
          {frequency}
        </button>
      </div>
    </div>
  );
}
