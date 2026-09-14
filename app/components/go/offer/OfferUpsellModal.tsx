"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import type { OfferChoice } from "./offerCheckout";

/**
 * The one-time upsell shown after the offer page's CTA (SCRUM-1343).
 *
 * Always the product's monthly starter pack. Three beats, top to bottom:
 * 1. A gain-led headline: the per-shot saving and the free gift value, so the
 *    upgrade reads as more, not as the 4 box being expensive.
 * 2. A plan-only comparison, "Your 4 box" vs "Monthly" (shots, delivery, per
 *    shot, price), so it is obvious what they would switch to.
 * 3. The first-box gifts as an image strip directly above the button, with one
 *    total value rather than a price per tile.
 *
 * Every monthly figure is built server-side from offerData (getOfferPricing +
 * getCadenceGiftSummary), the same source as the PDP gift stack, so it cannot
 * drift from the rest of the site. Display only: checkout prices from Shopify.
 *
 * Bottom sheet on mobile, centred modal from `lg`. Backdrop, Escape and the
 * close button dismiss back to the page; only the two buttons go to checkout.
 */

export interface OfferUpsellGift {
  id: string;
  label: string;
  image?: string;
  imageFit?: "cover" | "contain";
}

export interface OfferUpsellData {
  variantId: string;
  sellingPlanId: string;
  price: number;
  perShot: number;
  /** Shots in every monthly box. */
  subsequentShots: number;
  /** Everything free in the first box: bonus shots, then physical and digital gifts. */
  gifts: OfferUpsellGift[];
  /** Summed RRP of `gifts` (£). */
  giftValue: number;
}

/** The offer gradient shared with the plan card, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

/** The navy-ruled light panel behind the winning column (ProductComparisonTable). */
const PANEL = "bg-[#eef0f5] border-x border-[color:var(--brand-navy)]";

interface Row {
  label: string;
  box: ReactNode;
  monthly: ReactNode;
}

export default function OfferUpsellModal({
  open,
  data,
  productName,
  boxShots,
  boxPrice,
  loadingChoice,
  error,
  onAccept,
  onDecline,
  onDismiss,
}: {
  open: boolean;
  data: OfferUpsellData;
  productName: string;
  /** Shots in the weekly 4 box, for the comparison column. */
  boxShots: number;
  /** The weekly 4 box price. */
  boxPrice: number;
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
  const boxPerShot = boxPrice / boxShots;
  const perShotSaving = Math.round((1 - data.perShot / boxPerShot) * 100);

  const rows: Row[] = [
    { label: "Shots", box: boxShots, monthly: data.subsequentShots },
    { label: "Delivered", box: "Weekly", monthly: "Monthly" },
    {
      label: "Per shot",
      box: formatPrice(boxPerShot),
      monthly: (
        <span className="text-base font-bold text-[var(--brand-positive)]">
          {formatPrice(data.perShot)}
        </span>
      ),
    },
    {
      label: "Price",
      box: `${formatPrice(boxPrice)}/wk`,
      monthly: `${formatPrice(data.price)}/mo`,
    },
  ];

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
        {/* Full-width offer bar. The sheet's rounded corners clip it, since the
            dialog's overflow is not visible. */}
        <div
          className="relative flex min-h-[48px] items-center justify-center px-12 text-[13px] font-bold uppercase tracking-[0.08em] text-[#14532d]"
          style={{ background: OFFER_GRADIENT }}
        >
          One-time offer
          <button
            type="button"
            onClick={onDismiss}
            disabled={loading}
            aria-label="Close"
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#14532d]/70 transition-colors hover:text-[#14532d] disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 pt-5 lg:px-6 lg:pb-6">
          <h2 id="offer-upsell-title" className="text-[24px] font-bold leading-tight">
            Save {perShotSaving}% on every shot
          </h2>
          {data.giftValue > 0 && (
            <p className="mt-1 text-sm text-black/70">
              Plus {formatPrice(data.giftValue)} of free gifts in your first box
            </p>
          )}

          <table className="mt-5 w-full border-separate border-spacing-0 text-left text-sm">
            <caption className="sr-only">
              Your {boxShots} box compared with {productName} monthly
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[30%]">
                  <span className="sr-only">Feature</span>
                </th>
                <th
                  scope="col"
                  className="w-[33%] px-2 pb-2 text-center align-bottom text-xs font-semibold text-black/60"
                >
                  Your {boxShots} box
                </th>
                <th
                  scope="col"
                  className={`w-[37%] rounded-t-md border-t px-2 pb-2 pt-2.5 text-center align-bottom text-xs font-bold uppercase tracking-wide text-[var(--brand-navy)] ${PANEL}`}
                >
                  Monthly
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const last = i === rows.length - 1;
                return (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="border-t border-black/10 py-2.5 pr-2 text-[13px] font-semibold leading-snug"
                    >
                      {row.label}
                    </th>
                    <td className="border-t border-black/10 px-2 py-2.5 text-center align-middle text-black/70 tabular-nums">
                      {row.box}
                    </td>
                    <td
                      className={`px-2 py-2.5 text-center align-middle font-semibold tabular-nums ${PANEL} ${
                        last ? "rounded-b-md border-b" : ""
                      }`}
                    >
                      {row.monthly}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* The gifts sit last before the button, so the strongest "more" is
              the final thing seen before deciding. One total, no per-tile prices. */}
          {data.gifts.length > 0 && (
            <div className="mt-5">
              <p className="text-[13px] font-semibold">
                Free in your first monthly box{" "}
                <span className="font-bold text-[var(--brand-positive)]">
                  · worth {formatPrice(data.giftValue)}
                </span>
              </p>
              <ul className="mt-2 grid grid-cols-4 gap-2">
                {data.gifts.map((gift) => (
                  <li key={gift.id} className="flex flex-col items-center gap-1 text-center">
                    {gift.image && (
                      <Image
                        src={gift.image}
                        alt=""
                        width={160}
                        height={160}
                        className={`aspect-square w-full rounded-md ${
                          gift.imageFit === "contain" ? "object-contain p-1" : "object-cover"
                        }`}
                        style={
                          gift.imageFit === "contain"
                            ? { background: "color-mix(in srgb, var(--brand-navy) 8%, white)" }
                            : undefined
                        }
                        sizes="80px"
                      />
                    )}
                    <span className="text-[11px] font-medium leading-tight">{gift.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-navy)] px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2"
          >
            {loadingChoice === "monthly" ? (
              <>
                <Spinner />
                Opening checkout
              </>
            ) : (
              <>
                Upgrade to monthly - {formatPrice(data.price)}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>

          {/* A real choice, so it is legible and a full 44px target, not hidden. */}
          <button
            type="button"
            onClick={onDecline}
            disabled={loading}
            className="mt-1 min-h-[44px] w-full py-3 text-sm font-medium text-black/60 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black disabled:opacity-60"
          >
            {loadingChoice === "weekly"
              ? "Opening checkout"
              : `No thanks, I’ll stick to the ${boxShots} box`}
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

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
  );
}
