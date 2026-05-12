"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics/react";
import { useCart } from "@/app/context/CartContext";
import type { CartUpsellOffer } from "@/app/lib/cartUpsell";

interface CartUpsellStripProps {
  offer: CartUpsellOffer;
  /** Line ID of the current cart item — needed to remove it before adding when upgrading to subscription. */
  currentLineId: string;
}

export default function CartUpsellStrip({ offer, currentLineId }: CartUpsellStripProps) {
  const { addToCart, removeItem, loading } = useCart();
  const [isActing, setIsActing] = useState(false);

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
    try {
      // For subscription upgrades: remove the OTP line before adding the sub variant.
      // For add-both: just add alongside the existing line.
      if (offer.type === "upgrade-to-sub") {
        await removeItem(currentLineId);
      }
      await addToCart(offer.variantId, 1, offer.sellingPlanId, {
        source: "cart_upsell",
        location: "cart_drawer",
      });
    } finally {
      setIsActing(false);
    }
  };

  const busy = isActing || loading;
  const buttonLabel = offer.type === "upgrade-to-sub" ? "Switch plan" : "Add to cart";

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
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
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
          className="shrink-0 flex items-center gap-1.5 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.14em] px-3.5 py-2.5 hover:opacity-90 active:opacity-75 transition-opacity disabled:opacity-40"
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
  );
}
