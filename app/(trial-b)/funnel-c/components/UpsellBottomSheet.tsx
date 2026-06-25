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

  if (!isOpen || !offer) return null;

  const hasPerShotHero = Boolean(offer.perShotHero);

  return (
    <>
      {/* Backdrop — dismiss (return to selection), not decline (proceed to checkout) */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onDismiss}
        role="button"
        aria-label="Close upgrade offer"
        tabIndex={-1}
      />

      {/* Bottom sheet (mobile) / Centered modal (desktop) */}
      <div className="fixed z-[70] bg-white shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto bottom-0 left-0 right-0 lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:right-auto lg:w-full lg:max-w-md">
        <div className="px-5 pt-4 pb-5 lg:p-6 lg:pb-8">
          {/* Handle bar (mobile only) — tap to dismiss */}
          <button
            type="button"
            onClick={onDismiss}
            className="mx-auto mb-4 block h-1 w-10 bg-black/15 lg:hidden"
            aria-label="Dismiss"
          />

          {/* Spec eyebrow */}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
            Upgrade · Checkpoint 02
          </p>

          {/* Product image — wide, centred, lab-asset-frame */}
          {offer.image && (
            <div className="relative mb-5 mx-auto w-[calc(100%-1rem)] max-w-[200px] aspect-square overflow-hidden bg-[var(--brand-tint)] lab-asset-frame">
              <Image
                src={offer.image.src}
                alt={offer.image.alt}
                fill
                className="object-contain p-2"
                sizes="200px"
              />
            </div>
          )}

          {/* Headline — primary text, sets context */}
          <h3 className="text-xl font-semibold text-[var(--brand-black)] tracking-[var(--brand-h2-tracking)]">
            {offer.headline}
          </h3>

          {/* Per-shot hero block — the key value proposition, hairline surface */}
          {offer.perShotHero && (
            <div className="mt-4 border border-black/10 p-4 bg-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/50 mb-2">
                Per-shot cost
              </p>
              {/* Price drop — the hero data point */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-[#1B2757] tabular-nums">
                  {formatPrice(offer.perShotHero.upgradedPerShot)}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/50">
                  /shot
                </span>
                <span className="text-base text-black/30 line-through ml-1 tabular-nums">
                  {formatPrice(offer.perShotHero.currentPerShot)}
                </span>
              </div>
              {/* Context line */}
              <p className="mt-2 text-sm text-black/60">
                Drop from {formatPrice(offer.perShotHero.currentPerShot)} · add {offer.perShotHero.addedProductName} for {offer.perShotHero.extraCostLabel}
              </p>
            </div>
          )}

          {/* Benefit bullets — supporting proof */}
          {offer.benefits && offer.benefits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {offer.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-black/70">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#1B2757]" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Fallback price display (cadence upgrades — no perShotHero) */}
          {!hasPerShotHero && offer.compareAtUpgrade && offer.priceDifference !== undefined && (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-lg text-black/40 line-through tabular-nums">
                {formatPrice(offer.compareAtUpgrade)}
              </span>
              <span className="text-2xl font-bold text-[var(--brand-black)] tabular-nums">
                {offer.priceDifference > 0
                  ? formatPrice(offer.priceDifference)
                  : formatPrice(offer.compareAtUpgrade + offer.priceDifference)}
              </span>
            </div>
          )}

          {/* Primary CTA — navy fill, chamfered, mono */}
          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className="lab-clip-tr w-full mt-5 py-4 px-6 text-white bg-[#1B2757] font-mono text-sm font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-60"
          >
            {loading ? "Processing..." : offer.acceptLabel}
          </button>

          {/* Decline — hairline secondary, mono */}
          <button
            type="button"
            onClick={onDecline}
            disabled={loading}
            className="w-full py-3 mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-black/50 transition-colors hover:text-black/80"
          >
            {offer.declineLabel}
          </button>

          {/* Social nudge — hairline strip, mono */}
          {offer.socialNudge && (
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-black/60 border-t border-black/10 pt-3">
              {offer.socialNudge}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
