"use client";

import Link from "next/link";
import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
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
      className="absolute left-0 right-0 top-full bg-white border-b border-black/12 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="w-full px-6 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-5">
            {NAV_PRODUCTS.map((product) => (
              <div
                key={product.href}
                className="group bg-[#f5f5f5] border border-black/12 hover:bg-black/[0.04] overflow-hidden transition-colors flex flex-col"
              >
                <Link
                  href={product.href}
                  onClick={onClose}
                  className="relative aspect-square overflow-hidden bg-white block"
                  aria-label={product.alt}
                >
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-contain p-6 group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 1024px) 33vw, 300px"
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-base font-semibold text-black mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-black/60 leading-relaxed flex-1 mb-4">
                    {product.descriptionLong}
                  </p>
                  <ConkaCTAButton href={product.href} compact>
                    Shop
                  </ConkaCTAButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
