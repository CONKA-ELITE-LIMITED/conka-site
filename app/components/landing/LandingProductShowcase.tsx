"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import GuaranteeRow from "./GuaranteeRow";
import IngredientsPanel from "./IngredientsPanel";
import { SunIcon, SunHorizonIcon } from "./icons";

/* ============================================================================
 * LandingProductShowcase
 *
 * "Two shots. Built around your day." — the home page's product-system
 * teaching beat. Two equal cards, Flow (morning) and Clear (afternoon),
 * each led by a navy time-of-day band so the AM/PM ritual is unmissable.
 * Neither product is ever emphasised over the other: the system IS the
 * product. Clicking a card opens the shared IngredientsPanel for that
 * formula.
 *
 * Interactive variants (Morning/Afternoon toggle with a video stage, and a
 * spotlight layout) were prototyped 2026-06 and deliberately rejected: any
 * layout that enlarges one product implicitly demotes the other, which
 * contradicts the two-shots-one-system message.
 * ========================================================================== */

type ProductId = "flow" | "clear";

const PRODUCTS = [
  {
    id: "flow" as ProductId,
    name: "CONKA Flow",
    timeOfDay: "Morning",
    window: "06:00–10:00",
    tagline: "Calm morning focus.",
    bottleSrc: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
    TimeIcon: SunIcon,
  },
  {
    id: "clear" as ProductId,
    name: "CONKA Clear",
    timeOfDay: "Afternoon",
    window: "12:00–16:00",
    tagline: "Afternoon reset.",
    bottleSrc: "/formulas/conkaClear/ClearNew.jpg",
    bottleAlt: "CONKA Clear bottle",
    TimeIcon: SunHorizonIcon,
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
        Flow for the morning. Clear for the afternoon. Each formulated with
        scientifically-studied ingredients to support sustained focus, memory,
        and mental endurance.
      </p>

      <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-8">
        {PRODUCTS.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => openIngredients(product.id)}
            className="group flex flex-col items-center text-center bg-white border border-black/8 w-full hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 overflow-hidden"
          >
            {/* Time-of-day band — the AM/PM ritual is the card's lead message */}
            <div className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1B2757] text-white">
              <product.TimeIcon className="w-4 h-4 shrink-0" />
              <span className="font-mono text-[11px] lg:text-xs font-bold uppercase tracking-[0.16em] leading-none">
                {product.timeOfDay}
              </span>
              <span className="hidden sm:inline font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.14em] text-white/60 tabular-nums leading-none">
                {product.window}
              </span>
            </div>

            <div className="flex flex-col items-center w-full flex-1 p-5 lg:p-8">
              {/* Square photographic bottle card — the asset's off-white
                  background is the tile surface (same treatment as the /start
                  ingredients grid), so no inner scaling hacks are needed.
                  Mobile: negative margins pull the asset to the card edges so
                  it spans the full card width, butting against the time band. */}
              <div className="relative w-[calc(100%+2.5rem)] -mx-5 -mt-5 lg:w-full lg:mx-0 lg:mt-0 aspect-square mb-4 lg:mb-6 overflow-hidden border-b lg:border border-black/8">
                <Image
                  src={product.bottleSrc}
                  alt={product.bottleAlt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 420px"
                  className="object-cover"
                />
              </div>

              <p className="text-base lg:text-2xl font-semibold text-black mb-1">
                {product.name}
              </p>
              <p className="text-xs lg:text-base text-black/55 mb-4 lg:mb-6">
                {product.tagline}
              </p>

              {/* CTA-styled footer — the whole card is the real button; this
                  block just reads as the action. */}
              <div className="mt-auto w-full flex items-center justify-between gap-2 bg-[#1B2757] text-white px-3 lg:px-4 py-3 min-h-[44px]">
                <span className="font-mono text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.14em] lg:tracking-[0.16em]">
                  See what&apos;s inside
                </span>
                <span
                  aria-hidden
                  className="font-mono text-sm text-white/60 group-hover:text-white transition-colors"
                >
                  ↗
                </span>
              </div>
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
          centred as one block on every breakpoint. */}
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
          <ConkaCTAButton href={ctaHref} meta={null}>
            Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
          </ConkaCTAButton>
        )}
        {/* Guarantee renders even when the CTA is hidden (/conka-both,
            protocol pages) so the section still closes with reassurance
            rather than ending abruptly on the cert icons. */}
        <GuaranteeRow />
      </div>
    </div>
  );
}
