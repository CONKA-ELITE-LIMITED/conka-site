"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_PRODUCTS, SHOP_MENU_GRADIENT } from "./navConfig";
import { TIME_OF_DAY_BADGE } from "@/app/lib/timeOfDayBadge";
import type { ShopMegaMenuProps } from "./types";

/* ============================================================================
 * ShopMegaMenu
 *
 * Desktop Shop dropdown: the three products only. The former "Learn more"
 * sidebar was removed when App moved to its own dropdown and Why CONKA left
 * the desktop nav (it lives in the footer + mobile Company group).
 *
 * Positioned `absolute top-full` against the fixed nav wrapper so it drops
 * flush from the header bottom with no gap and rides the scroll-hide
 * transform. Products come from the shared navConfig.
 * ========================================================================== */

export default function ShopMegaMenu({
  isOpen,
  onClose,
  onEnter,
  onLeave,
}: ShopMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
      style={{
        // Matches the header gradient and is viewport-anchored so the two
        // read as one continuous panel while Shop is open.
        background: SHOP_MENU_GRADIENT,
        backgroundAttachment: "fixed",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="w-full px-6 md:px-16 py-10">
        <div className="max-w-4xl">
          <div className="grid grid-cols-3 gap-6">
            {NAV_PRODUCTS.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                onClick={onClose}
                aria-label={product.alt}
                // flex-col, not block: the grid stretches every tile to the
                // tallest, so the footer has to grow into that height or a
                // shorter tagline leaves bare card below the hover fill.
                className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-transparent transition-all duration-200 hover:-translate-y-1 hover:ring-2 hover:ring-white"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 33vw, 300px"
                  />
                </div>
                <div className="relative flex-1 border-t border-black/10 px-4 pb-4 pt-7 text-center transition-colors group-hover:border-white/15 group-hover:bg-[#1B2757]">
                  {/* Straddles the image/footer separator, centred. */}
                  <span
                    className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] leading-none ${TIME_OF_DAY_BADGE[product.badge]}`}
                  >
                    {product.badge}
                  </span>
                  <p className="text-lg font-bold text-black transition-colors group-hover:text-white">
                    {product.name}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-black/60 transition-colors group-hover:text-white/70">
                    {product.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
