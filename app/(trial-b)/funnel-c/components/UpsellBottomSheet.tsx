"use client";

import { useEffect } from "react";
import Image from "next/image";
import { type UpsellOffer } from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

interface UpsellBottomSheetProps {
  isOpen: boolean;
  offer: UpsellOffer | null;
  onAccept: () => void;
  /** "No thanks" — proceeds to checkout with original selection */
  onDecline: () => void;
  /** Backdrop tap / swipe dismiss — returns to selection, no checkout */
  onDismiss: () => void;
  loading: boolean;
}

export default function UpsellBottomSheet({
  isOpen,
  offer,
  onAccept,
  onDecline,
  onDismiss,
  loading,
}: UpsellBottomSheetProps) {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  // Escape dismisses, like every other modal on the web. Dismiss, not decline:
  // the user goes back to their selection rather than being pushed to checkout.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onDismiss]);

  if (!isOpen || !offer) return null;

  const hasPerShotHero = Boolean(offer.perShotHero);

  return (
    <>
      {/* Backdrop — dismiss (return to selection), not decline (proceed to checkout) */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onDismiss}
        aria-hidden
      />

      {/* Bottom sheet (mobile) / Centered modal (desktop) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={offer.headline}
        className="fixed z-[70] bg-white shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto bottom-0 left-0 right-0 rounded-t-[24px] lg:rounded-[24px] lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:right-auto lg:w-full lg:max-w-md"
      >
        <div className="px-5 pt-3 pb-5 lg:p-6 lg:pb-8">
          {/* Handle bar (mobile only) — tap to dismiss */}
          <button
            type="button"
            onClick={onDismiss}
            className="mx-auto mb-4 flex h-6 w-full items-center justify-center lg:hidden"
            aria-label="Dismiss"
          >
            <span className="block h-1 w-10 rounded-full bg-black/15" />
          </button>

          {/* Product image */}
          {offer.image && (
            <div className="relative mb-5 mx-auto w-[calc(100%-1rem)] max-w-[190px] aspect-square overflow-hidden rounded-[16px] bg-black/[0.04]">
              <Image
                src={offer.image.src}
                alt={offer.image.alt}
                fill
                className="object-contain p-2"
                sizes="190px"
              />
            </div>
          )}

          <h3
            className="text-black font-semibold text-[26px] leading-[1.1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {offer.headline}
          </h3>

          {/* Per-shot hero — the whole argument for the upgrade, so it gets the
              biggest number on the sheet. */}
          {offer.perShotHero && (
            <div className="mt-4 rounded-[16px] bg-black/[0.04] p-4">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-[32px] font-bold text-[#1B2757] tabular-nums leading-none">
                  {formatPrice(offer.perShotHero.upgradedPerShot)}
                </span>
                <span className="text-[14px] font-medium text-black/60">per shot</span>
                <span className="text-[16px] text-black/35 line-through tabular-nums">
                  {formatPrice(offer.perShotHero.currentPerShot)}
                </span>
              </div>
              <p className="mt-2.5 text-[14px] text-black leading-snug">
                Add {offer.perShotHero.addedProductName} for{" "}
                <strong className="font-semibold">{offer.perShotHero.extraCostLabel}</strong> and
                every shot gets cheaper.
              </p>
            </div>
          )}

          {/* Fallback price display (cadence upgrades — no perShotHero) */}
          {!hasPerShotHero && offer.compareAtUpgrade && offer.priceDifference !== undefined && (
            <div className="mt-4 rounded-[16px] bg-black/[0.04] p-4 flex items-baseline gap-3">
              <span className="text-[16px] text-black/35 line-through tabular-nums">
                {formatPrice(offer.compareAtUpgrade)}
              </span>
              <span className="text-[28px] font-bold text-black tabular-nums leading-none">
                {offer.priceDifference > 0
                  ? formatPrice(offer.priceDifference)
                  : formatPrice(offer.compareAtUpgrade + offer.priceDifference)}
              </span>
            </div>
          )}

          {/* Benefit bullets */}
          {offer.benefits && offer.benefits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {offer.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-black leading-snug">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 mt-[3px]">
                    <circle cx="12" cy="12" r="10" fill="#10B981" />
                    <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Accept — the same navy pill as every other CTA in the funnel */}
          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-full bg-[#1B2757] py-4 px-6 text-white font-semibold text-[16px] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden />
            )}
            {loading ? "Processing" : offer.acceptLabel}
          </button>

          {/* Decline — readable, and a full 44px target. This is a real choice,
              not a dark pattern, so it is legible rather than hidden in 10px mono. */}
          <button
            type="button"
            onClick={onDecline}
            disabled={loading}
            className="w-full min-h-[44px] mt-1 py-3 text-[14px] font-medium text-black/60 underline underline-offset-4 decoration-black/20 transition-colors hover:text-black disabled:opacity-60"
          >
            {offer.declineLabel}
          </button>

          {offer.socialNudge && (
            <p className="mt-3 pt-3 border-t border-black/10 text-center text-[13px] text-black/60 leading-snug">
              {offer.socialNudge}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
