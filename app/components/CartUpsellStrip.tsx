"use client";

import { useState, useEffect } from "react";
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
        await addToCart(offer.variantId, originalQuantity, offer.sellingPlanId, {
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

  return (
    <div>
      <button
        onClick={handleAccept}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B2757] px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40"
        aria-label={offer.ctaLabel}
      >
        {isActing ? (
          <span className="h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white" />
        ) : (
          offer.ctaLabel
        )}
      </button>

      {error && (
        <p className="mt-1.5 text-center text-xs text-red-600/80">{error}</p>
      )}
    </div>
  );
}
