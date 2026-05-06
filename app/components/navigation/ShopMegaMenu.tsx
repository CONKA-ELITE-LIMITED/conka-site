"use client";

import Link from "next/link";
import Image from "next/image";
import { getFormulaImage, getProtocolImage } from "@/app/lib/productImageConfig";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import type { ShopMegaMenuProps } from "./types";

const PRODUCTS = [
  {
    code: "F-03",
    name: "Both (Flow + Clear)",
    shortLabel: "Flow + Clear",
    description: "The full daily system. Morning focus meets afternoon clarity.",
    ctaMeta: "// the full daily system",
    href: "/conka-both",
    image: getProtocolImage("3"),
    alt: "CONKA Flow and Clear",
  },
  {
    code: "F-01",
    name: "CONKA Flow",
    shortLabel: "Flow",
    description: "Morning focus & energy. Rhodiola, Ashwagandha, Lemon Balm.",
    ctaMeta: "// morning focus · energy",
    href: "/conka-flow",
    image: getFormulaImage("01"),
    alt: "CONKA Flow",
  },
  {
    code: "F-02",
    name: "CONKA Clear",
    shortLabel: "Clear",
    description: "Afternoon clarity & recovery. Glutathione, Ginkgo, Alpha GPC.",
    ctaMeta: "// afternoon clarity · recovery",
    href: "/conka-clarity",
    image: getFormulaImage("02"),
    alt: "CONKA Clear",
  },
];

const LEARN_MORE = [
  { label: "Why CONKA works", href: "/why-conka" },
  { label: "The CONKA App", href: "/app" },
];

export default function ShopMegaMenu({
  isOpen,
  onClose,
  bannerConfig,
  hideBanner,
  onShopAreaEnter,
  onShopAreaLeave,
}: ShopMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 bg-white border-b border-black/12 z-50"
      style={{
        top: bannerConfig && !hideBanner ? "136px" : "80px",
      }}
      onMouseEnter={onShopAreaEnter}
      onMouseLeave={onShopAreaLeave}
    >
      <div className="w-full px-6 md:px-16 py-8">
        <div className="flex gap-10 max-w-[1920px] mx-auto">
          {/* Left sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-black/12 pr-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-3">
              Learn more
            </p>
            <div className="flex flex-col">
              {LEARN_MORE.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 group transition-colors"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-black/70 group-hover:text-[#1B2757]">
                    {link.label}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-[11px] text-black/30 group-hover:text-[#1B2757]"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right content — product cards */}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-4">
              Featured · 03 formulas · 100-day guarantee
            </p>
            <div className="grid grid-cols-3 gap-5">
              {PRODUCTS.map((product) => (
                <div
                  key={product.href}
                  className="group bg-white border border-black/12 hover:border-[#1B2757] overflow-hidden transition-colors flex flex-col"
                >
                  <Link
                    href={product.href}
                    onClick={onClose}
                    className="relative aspect-square overflow-hidden bg-[#f5f5f5] block"
                    aria-label={product.alt}
                  >
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 1920px) 25vw, 500px"
                    />
                    <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
                      {product.shortLabel}
                    </span>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-1">
                      {product.code}
                    </p>
                    <p className="text-base font-semibold text-black mb-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-black/60 leading-relaxed flex-1 mb-4">
                      {product.description}
                    </p>
                    <ConkaCTAButton
                      href={product.href}
                      meta={product.ctaMeta}
                      className="lg:!w-full lg:!max-w-none"
                    >
                      Shop {product.shortLabel}
                    </ConkaCTAButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
