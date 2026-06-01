"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import GuaranteeRow from "./GuaranteeRow";
import IngredientsPanel from "./IngredientsPanel";

type ProductId = "flow" | "clear";

const PRODUCTS = [
  {
    id: "flow" as ProductId,
    name: "CONKA Flow",
    dose: "AM",
    window: "06:00–10:00",
    tagline: "Calm morning focus.",
    bottleSrc: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  {
    id: "clear" as ProductId,
    name: "CONKA Clear",
    dose: "PM",
    window: "12:00–16:00",
    tagline: "Afternoon reset.",
    bottleSrc: "/formulas/conkaClear/ClearNew.jpg",
    bottleAlt: "CONKA Clear bottle",
  },
];

// Certification strip — Magic Mind-style proof icons above the CTA.
// Same assets /start renders above its ingredients CTA.
const CERTS = [
  { src: "/icons/VeganFriendlyIcon.avif", label: "Vegan" },
  { src: "/icons/KosherCertifiedIcon.avif", label: "Kosher" },
  { src: "/icons/BpaFreeIcon.avif", label: "BPA Free" },
  { src: "/icons/ThirdPartyTestedIcon.avif", label: "Third party tested" },
];

export default function LandingProductShowcase({ hideCTA = false, ctaHref = "/funnel" }: { hideCTA?: boolean; ctaHref?: string } = {}) {
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

            {/* Square photographic bottle card — the asset's off-white
                background is the tile surface (same treatment as the /start
                ingredients grid), so no inner scaling hacks are needed. */}
            <div className="relative w-full aspect-square mb-4 lg:mb-6 overflow-hidden border border-black/8">
              <Image
                src={product.bottleSrc}
                alt={product.bottleAlt}
                fill
                sizes="(max-width: 1024px) 45vw, 420px"
                className="object-cover"
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

      {/* Proof + conversion group: cert icons → CTA → guarantee, stacked and
          centred as one block on every breakpoint. Replaces the text-only
          trust badge grid that previously closed this section. */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          {CERTS.map((cert) => (
            <Image
              key={cert.label}
              src={cert.src}
              width={56}
              height={56}
              alt={cert.label}
            />
          ))}
        </div>

        {!hideCTA && (
          <>
            <ConkaCTAButton href={ctaHref} meta={null}>
              Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
            </ConkaCTAButton>
            <GuaranteeRow />
          </>
        )}
      </div>
    </div>
  );
}
