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

/**
 * The surface for transparent cut-out renders (the app phone, the bottle). On
 * flat white they float; a step down from the #eef0f5 card fill gives them a
 * tile of their own, and separates the app gift from the three photographed
 * ones beside it.
 */
const CUTOUT_TILE_BG = "#dfe3ea";

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
    // Same treatment as the PDP's selected plan card: the offer gradient as a
    // 2px ring (padding-box keeps the fill, border-box paints the edge, which a
    // plain border-color cannot do) with the hook as a tab straddling the top
    // edge. One visual language for the offer, wherever it appears.
    <div
      className="relative rounded-lg p-3 pt-4"
      style={{
        border: "2px solid transparent",
        background:
          "linear-gradient(#eef0f5,#eef0f5) padding-box, linear-gradient(90deg,#cdeecf,#e9f5c9) border-box",
      }}
    >
      <span
        className="absolute left-1/2 top-0 z-20 max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
        style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
      >
        {offer.valueLine}
      </span>

      {/* Two shapes, one language. The kit offer stacks (its four gift tiles
          need the full width); the product offer splits left/right, so adding a
          formula never makes the tile taller than the cart line it sits under. */}
      <div className="flex items-center gap-3">
        {offer.productImage && (
          <div
            className="h-16 w-16 shrink-0 overflow-hidden rounded-md"
            style={{ background: CUTOUT_TILE_BG }}
          >
            <Image
              src={offer.productImage.src}
              alt={offer.productImage.alt}
              width={128}
              height={128}
              sizes="64px"
              className="h-full w-full object-contain p-1"
            />
          </div>
        )}
        <div className="min-w-0">
          {/* The headline carries the block, so the eyebrow steps back to a
              muted label. */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
            Recommended upgrade
          </p>
          <p className="mt-0.5 text-base font-bold leading-tight text-black">
            {offer.headline}
          </p>
          {offer.subline && (
            <p className="mt-0.5 text-xs font-medium text-black/60">
              {offer.subline}
            </p>
          )}
        </div>
      </div>

      {/* Show what is on offer rather than only pricing it. Four equal tiles
          read as a set; three plus a stray caption read as an afterthought. */}
      {offer.giftImages && offer.giftImages.length > 0 && (
        <ul className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
          {offer.giftImages.map((gift) => (
            <li
              key={gift.src}
              className="aspect-square overflow-hidden rounded-md"
              style={{
                background: gift.fit === "contain" ? CUTOUT_TILE_BG : "#fff",
              }}
            >
              <Image
                src={gift.src}
                alt=""
                width={96}
                height={96}
                sizes="72px"
                className={
                  gift.fit === "contain"
                    ? "h-full w-full object-contain p-1"
                    : "h-full w-full object-cover"
                }
              />
            </li>
          ))}
        </ul>
      )}

      {offer.highlight && (
        <p className="mt-2.5 text-center text-xs font-medium text-black">
          {offer.highlight}
        </p>
      )}

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
