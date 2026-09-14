"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import type { OfferChoice } from "./offerCheckout";

/**
 * The one-time upsell shown after the offer page's CTA (SCRUM-1343).
 *
 * Always the product's monthly starter pack. Every figure is built server-side
 * from offerData (getOfferPricing + getCadenceGiftSummary), the same source as
 * the PDP gift stack and the cart upsell tile, so the saving here cannot drift
 * from what the rest of the site claims. Display only: checkout prices from
 * Shopify.
 *
 * Bottom sheet on mobile, centred modal from `lg`. Backdrop, Escape and the
 * close button dismiss back to the page; only the two buttons go to checkout.
 */

export interface OfferUpsellTile {
  id: string;
  label: string;
  rrp: number;
  image?: string;
  imageFit?: "cover" | "contain";
}

export interface OfferUpsellData {
  variantId: string;
  sellingPlanId: string;
  price: number;
  perShot: number;
  firstOrderShots: number;
  subsequentShots: number;
  /** Compare-at price plus the RRP of everything free in the first box. */
  valueTotal: number;
  saving: number;
  packImage?: string;
  tiles: OfferUpsellTile[];
}

/** The savings pill gradient shared with CartUpsellTile and GiftValueStack. */
const SAVINGS_PILL_BG = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

export default function OfferUpsellModal({
  open,
  data,
  productName,
  trialShots,
  trialPrice,
  loadingChoice,
  error,
  onAccept,
  onDecline,
  onDismiss,
}: {
  open: boolean;
  data: OfferUpsellData;
  productName: string;
  trialShots: number;
  trialPrice: number;
  /** Which button is heading to checkout, so only that one spins. */
  loadingChoice: OfferChoice | null;
  error: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Kept apart from the lock above: onDismiss changes identity when checkout
  // starts, and re-running the lock effect would pull focus back to the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  const loading = loadingChoice !== null;
  const trialPerShot = trialPrice / trialShots;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-upsell-title"
        className="brand-bg-white fixed bottom-0 left-0 right-0 z-[70] max-h-[92vh] overflow-y-auto rounded-t-[var(--brand-radius-container)] text-black shadow-2xl outline-none animate-slide-up lg:bottom-auto lg:left-1/2 lg:right-auto lg:top-1/2 lg:w-full lg:max-w-md lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[var(--brand-radius-container)]"
      >
        <div className="px-5 pb-5 pt-4 lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
              style={{ background: SAVINGS_PILL_BG }}
            >
              One-time offer
            </span>
            <button
              type="button"
              onClick={onDismiss}
              disabled={loading}
              aria-label="Close"
              className="-mr-3 -mt-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black/50 transition-colors hover:text-black disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            {data.packImage && (
              <Image
                src={data.packImage}
                alt={`CONKA ${productName} starter pack`}
                width={144}
                height={144}
                className="h-16 w-16 shrink-0 rounded-md object-cover"
                sizes="64px"
              />
            )}
            <div className="min-w-0">
              <h2 id="offer-upsell-title" className="text-[22px] font-bold leading-tight">
                Upgrade to the {productName} starter pack
              </h2>
              <p className="mt-1 text-sm text-black/60">
                {data.firstOrderShots} shots in your first box instead of {trialShots}.
              </p>
            </div>
          </div>

          {/* The saving is the argument, so it gets the biggest number on the sheet. */}
          <div className="brand-bg-tint mt-4 rounded-md p-4 text-black">
            <p
              className="text-[28px] font-bold leading-none tabular-nums"
              style={{ color: "var(--brand-positive)" }}
            >
              You save {formatPrice(data.saving)}
            </p>
            <p className="mt-2 text-sm text-black/70">
              <span className="text-black/45 line-through tabular-nums">
                {formatPrice(data.valueTotal)}
              </span>{" "}
              of value for{" "}
              <strong className="font-semibold text-black tabular-nums">
                {formatPrice(data.price)}
              </strong>
            </p>
          </div>

          <ul className="mt-4 grid grid-cols-4 gap-2" aria-label="Free in your first box">
            {data.tiles.map((tile) => (
              <li key={tile.id} className="flex flex-col items-center gap-1 text-center">
                {tile.image && (
                  <Image
                    src={tile.image}
                    alt=""
                    width={160}
                    height={160}
                    className={`aspect-square w-full rounded-md ${
                      tile.imageFit === "contain" ? "object-contain p-1" : "object-cover"
                    }`}
                    style={
                      tile.imageFit === "contain"
                        ? { background: "color-mix(in srgb, var(--brand-navy) 8%, white)" }
                        : undefined
                    }
                    sizes="80px"
                  />
                )}
                <span className="text-[11px] font-medium leading-tight">{tile.label}</span>
                <span className="mt-auto text-[11px] leading-tight">
                  <span className="text-black/45 line-through">{formatPrice(tile.rrp)}</span>{" "}
                  <span className="font-bold" style={{ color: "var(--brand-positive)" }}>
                    Free
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-4 space-y-2 text-sm leading-snug">
            <li className="flex items-start gap-2.5">
              <Tick />
              <span>
                Then {data.subsequentShots} shots every month for {formatPrice(data.price)},{" "}
                {formatPrice(data.perShot)} a shot instead of {formatPrice(trialPerShot)}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Tick />
              <span>Free UK delivery. Pause or cancel anytime.</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-navy)] px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2"
          >
            {loadingChoice === "monthly" && <Spinner />}
            {loadingChoice === "monthly"
              ? "Opening checkout"
              : `Upgrade and save ${formatPrice(data.saving)}`}
          </button>

          {/* A real choice, so it is legible and a full 44px target, not hidden. */}
          <button
            type="button"
            onClick={onDecline}
            disabled={loading}
            className="mt-1 min-h-[44px] w-full py-3 text-sm font-medium text-black/60 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black disabled:opacity-60"
          >
            {loadingChoice === "trial"
              ? "Opening checkout"
              : `No thanks, start my ${trialShots}-shot trial for ${formatPrice(trialPrice)}`}
          </button>

          {error && (
            <p role="alert" className="mt-2 text-center text-sm font-medium text-black">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[2px] shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--brand-positive)" />
      <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
  );
}
