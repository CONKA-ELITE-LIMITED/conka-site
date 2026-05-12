"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { useCart } from "@/app/context/CartContext";
import type { CartUpsellOffer } from "@/app/lib/cartUpsell";

interface CartUpsellStripProps {
  offer: CartUpsellOffer;
  /** Line ID to remove before adding the upsell variant. */
  currentLineId: string;
  /** Original variant/plan/quantity — used to restore the cart if the upsell add fails. */
  originalVariantId: string;
  originalSellingPlanId?: string;
  originalQuantity: number;
}

export default function CartUpsellStrip({
  offer,
  currentLineId,
  originalVariantId,
  originalSellingPlanId,
  originalQuantity,
}: CartUpsellStripProps) {
  const { addToCart, removeItem, loading } = useCart();
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      track("cart:upsell_shown", { upsellType: offer.type, offerPrice: offer.price });
    } catch {
      // Analytics must never break the cart
    }
  }, [offer.type, offer.price]);

  const handleAccept = async () => {
    if (isActing || loading) return;

    try {
      track("cart:upsell_accepted", { upsellType: offer.type, offerPrice: offer.price });
    } catch {
      // Analytics must never break the cart
    }

    setIsActing(true);
    setError(null);
    try {
      await removeItem(currentLineId);
      try {
        await addToCart(offer.variantId, 1, offer.sellingPlanId, {
          source: "cart_upsell",
          location: "cart_drawer",
        });
      } catch {
        // Add failed — restore the original item so the cart isn't left empty.
        try {
          await addToCart(originalVariantId, originalQuantity, originalSellingPlanId, {
            source: "cart_upsell_restore",
            location: "cart_drawer",
          });
        } catch {
          // Restoration also failed — nothing more we can do.
        }
        setError("Something went wrong. Your cart has been restored.");
      }
    } finally {
      setIsActing(false);
    }
  };

  const busy = isActing || loading;
  const buttonLabel = offer.type === "upgrade-to-sub" ? "Switch plan" : "Upgrade";

  return (
    <div className="border border-[#1B2757]/25 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#1B2757]/15 bg-[#1B2757]/[0.04]">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
            {offer.label}
          </p>
          <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white bg-[#1B2757] px-2 py-0.5">
            {offer.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-3 px-4 py-3.5">
        <Image
          src={offer.image}
          alt={offer.label}
          width={48}
          height={80}
          className="shrink-0 w-12 h-auto object-contain"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
          <div>
            <p className="font-mono text-xl font-bold tabular-nums text-[#1B2757] leading-none">
              {offer.heroLabel}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40 mt-1">
              {offer.heroSub}
            </p>
          </div>
          <button
            onClick={handleAccept}
            disabled={busy}
            className="self-start flex items-center gap-1.5 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.14em] px-3.5 py-2 hover:opacity-90 active:opacity-75 transition-opacity disabled:opacity-40"
            aria-label={`${buttonLabel} — ${offer.label}`}
          >
            {isActing ? (
              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {buttonLabel}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="px-4 pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-red-600/70">
          {error}
        </p>
      )}
    </div>
  );
}
