"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";
import IngredientsPanel from "./IngredientsPanel";

type ProductId = "flow" | "clear";

const PRODUCTS = [
  {
    id: "flow" as ProductId,
    name: "CONKA Flow",
    dose: "AM",
    window: "06:00–10:00",
    tagline: "Calm morning focus.",
    bottleSrc: "/formulas/conkaFlow/FlowNoBackground.png",
    bottleAlt: "CONKA Flow bottle",
  },
  {
    id: "clear" as ProductId,
    name: "CONKA Clear",
    dose: "PM",
    window: "12:00–16:00",
    tagline: "Afternoon reset.",
    bottleSrc: "/formulas/conkaClear/ClearNoBackground.png",
    bottleAlt: "CONKA Clear bottle",
  },
];

export default function LandingProductShowcase() {
  const [openProduct, setOpenProduct] = useState<ProductId | null>(null);

  const openIngredients = (product: ProductId) => {
    setOpenProduct(product);
    try {
      track("showcase:ingredients_viewed", { product, source: "product_showcase" });
    } catch { /* fail silently */ }
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// The formulation · CONKA-03"}
      </p>
      <h2
        className="brand-h1 mb-4"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        Two shots. Built around your day.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[60ch]">
        Two nootropic shots, each formulated with scientifically-studied
        ingredients to support sustained focus, memory, and mental endurance.
      </p>

      <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-8">
        {PRODUCTS.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => openIngredients(product.id)}
            className="group flex flex-col items-center text-center bg-white border border-black/8 p-5 lg:p-8 w-full hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <div className="self-start mb-4 flex items-baseline gap-2">
              <span className="font-mono text-xs lg:text-sm font-bold uppercase tracking-[0.18em] text-black">
                {product.dose}
              </span>
              <span className="font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.14em] text-black/35 tabular-nums">
                {product.window}
              </span>
            </div>

            <div className="relative w-24 h-48 lg:w-44 lg:h-80 mb-4 lg:mb-6">
              <Image
                src={product.bottleSrc}
                alt={product.bottleAlt}
                fill
                sizes="(max-width: 1024px) 96px, 176px"
                className="object-contain scale-150"
              />
            </div>

            <p className="text-base lg:text-2xl font-semibold text-black mb-1">
              {product.name}
            </p>
            <p className="text-xs lg:text-base text-black/55 mb-4 lg:mb-6">
              {product.tagline}
            </p>

            <div className="mt-auto w-full flex items-center justify-between border-t border-black/8 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/50">
                See what&apos;s inside
              </span>
              <span
                aria-hidden
                className="font-mono text-sm text-black/30 group-hover:text-black/70 transition-colors"
              >
                ↗
              </span>
            </div>
          </button>
        ))}
      </div>

      <IngredientsPanel
        isOpen={openProduct !== null}
        product={openProduct}
        onClose={() => setOpenProduct(null)}
      />

      <div className="mb-3 flex justify-start">
        <ConkaCTAButton meta={null}>
          Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
        </ConkaCTAButton>
      </div>
      <div>
        <LabTrustBadges />
      </div>
    </div>
  );
}
