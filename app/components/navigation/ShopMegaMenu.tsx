"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_PRODUCTS } from "./navConfig";
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
        background:
          "linear-gradient(135deg, #4058bb 0%, #26356f 55%, #1B2757 100%)",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="w-full px-6 md:px-16 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {NAV_PRODUCTS.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                onClick={onClose}
                aria-label={product.alt}
                className="group block overflow-hidden rounded-xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
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
                <div className="flex flex-col items-center gap-2 p-4 text-center transition-colors group-hover:bg-[#1B2757]">
                  <p className="text-lg font-bold text-black transition-colors group-hover:text-white">
                    {product.name}
                  </p>
                  <span className="rounded-full bg-[#1B2757] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] leading-none text-white transition-colors group-hover:bg-white group-hover:text-[#1B2757]">
                    {product.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
