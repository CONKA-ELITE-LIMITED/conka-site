"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import {
  markUpsellAccepted,
  clearUpsellAccepted,
  type CartUpsellTileOffer,
} from "@/app/lib/cartUpsell";
import {
  trackCartUpsellShown,
  trackCartUpsellAccepted,
} from "@/app/lib/analytics";

interface CartUpsellTileProps {
  offer: CartUpsellTileOffer;
}

/**
 * The single, one-time cart upsell (SCRUM-1202). Rendered in the CartDrawer only
 * when `getCartUpsell` returns an offer, so it needs no visibility logic and no
 * dismiss: accepting swaps the line, the cart stops qualifying, and the parent
 * unmounts it.
 *
 * The swap is add-first, then remove: `addToCart` / `removeItem` swallow their
 * errors (they set the cart error and resolve, never reject), so we confirm the
 * target landed in the returned cart before removing the original. If the add
 * fails, the original line is untouched and the one-time flag is cleared.
 */
export default function CartUpsellTile({ offer }: CartUpsellTileProps) {
  const { addToCart, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackCartUpsellShown({ type: offer.type, product: offer.product });
  }, [offer.type, offer.product]);

  const handleAccept = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    trackCartUpsellAccepted({ type: offer.type, product: offer.product });

    // Set the flag before the add so that add carries the `_upsell` attribution
    // attribute (CartContext re-derives it from this flag on every add).
    markUpsellAccepted(offer.origin);

    const updated = await addToCart(
      offer.targetVariantId,
      offer.originalQuantity,
      offer.targetSellingPlanId,
      { source: "cart_upsell", location: "cart_drawer" },
    );

    const added = updated?.lines?.edges?.some(
      (edge) => edge.node.merchandise.id === offer.targetVariantId,
    );

    if (!added) {
      // Add failed: the original line was never touched, so the cart is still
      // consistent. Free the one-time offer and tell the shopper.
      clearUpsellAccepted();
      setError("Could not add that just now. Your item is unchanged.");
      setBusy(false);
      return;
    }

    await removeItem(offer.currentLineId);
    // Cart no longer qualifies, so the parent unmounts this tile.
  };

  return (
    <div className="rounded-lg border border-[#1B2757]/15 bg-[#eef0f5] p-3">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white">
          <Image
            src={offer.thumbnail}
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1B2757]">
            Recommended upgrade
          </p>
          <p className="text-sm font-bold leading-snug text-black">
            {offer.headline}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#1a7f4f]">
            {offer.valueLine}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAccept}
        disabled={busy}
        className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-[#1B2757] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40"
        aria-label={offer.ctaLabel}
      >
        {busy ? (
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
