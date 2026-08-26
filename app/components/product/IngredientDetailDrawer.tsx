"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IngredientData } from "@/app/lib/ingredientsData";
import type { IngredientBadge } from "@/app/lib/mmPdpData";

/* ============================================================================
 * IngredientDetailDrawer (SCRUM-1262, Phase 3a)
 *
 * One ingredient in depth: the large render, the description, what it supports,
 * and the study behind it. Opened from a tile in the ingredient grid.
 *
 * Distinct from IngredientBottomSheet, which lists ALL ingredients and is
 * reached from the hero pill. Both stay. This one shows a single ingredient
 * and slides from the right on desktop, where a full-height panel gives the
 * render the room the grid tile cannot.
 *
 * Overlay behaviour (backdrop, z-index, Escape, body-scroll lock) deliberately
 * mirrors IngredientBottomSheet so the two disclosures feel identical.
 * ========================================================================== */

/** Slide duration, shared by the CSS transition and the unmount timer. */
const SLIDE_MS = 280;

function LabelledRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-t border-black/10 py-3.5">
      <p className="w-[104px] shrink-0 text-sm font-semibold leading-snug text-black">
        {label}
      </p>
      <div className="min-w-0 flex-1 text-sm leading-snug text-black/70">
        {children}
      </div>
    </div>
  );
}

export default function IngredientDetailDrawer({
  open,
  ingredient,
  badge,
  onClose,
}: {
  open: boolean;
  /** Null while closing, so the panel can unmount without a content flash. */
  ingredient: IngredientData | null;
  badge?: IngredientBadge;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  /** Stays mounted through the exit transition. */
  const [isMounted, setIsMounted] = useState(false);
  /** Drives the transform, flipped a frame after mount so the browser animates. */
  const [isShown, setIsShown] = useState(false);

  // The last ingredient shown, so content does not vanish mid-exit when the
  // parent clears its selection on close.
  const lastIngredient = useRef<IngredientData | null>(null);
  const lastBadge = useRef<IngredientBadge | undefined>(undefined);
  useEffect(() => {
    if (ingredient) {
      lastIngredient.current = ingredient;
      lastBadge.current = badge;
    }
  }, [ingredient, badge]);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      // Two frames: one to commit the mounted-but-offscreen state, one to
      // change the transform, or the browser collapses both and skips the
      // animation entirely.
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsShown(true)),
      );
      return () => cancelAnimationFrame(raf);
    }
    setIsShown(false);
    const timer = setTimeout(() => setIsMounted(false), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Lock body scroll and wire Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Move focus into the dialog, and back to the trigger on close. Without this
  // a keyboard user opening a tile stays parked behind the backdrop.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => trigger?.focus?.();
  }, [open]);

  const shown = ingredient ?? lastIngredient.current;
  const shownBadge = ingredient ? badge : lastBadge.current;

  if (!isMounted || !shown) return null;

  const stat = shown.keyStats[0];

  return (
    <div
      className="fixed inset-0 z-[100002] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={shown.name}
    >
      {/* Opacity and transform only, so the slide stays on the compositor and
          never triggers layout. motion-reduce drops it to an instant swap. */}
      <div
        className={`absolute inset-0 bg-[rgba(15,18,28,0.45)] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isShown ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Full-height sheet on mobile, right-hand drawer from sm. */}
      <div
        className={`relative flex h-full w-full flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none sm:max-w-md ${
          isShown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#eef0f5]">
            {shown.image && (
              <Image
                src={shown.image}
                alt={shown.name}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            )}

            {/* The same badge the tile carried, so the drawer confirms what was
                tapped rather than dropping the context on open. */}
            {shownBadge?.outcome && (
              <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-md bg-white/95 px-2.5 py-1.5 text-[11px] font-bold leading-tight text-[color:var(--brand-navy)] backdrop-blur-sm">
                {shownBadge.outcome}
                {shownBadge.mechanism && (
                  <span className="block font-medium opacity-70">
                    {shownBadge.mechanism}
                  </span>
                )}
              </span>
            )}
          </div>

          <h3 className="mt-6 text-2xl font-bold leading-tight text-black">
            {shown.name}
          </h3>

          {/* The one-line claim has no home on the tile now the grid shows only
              name and badge, so the drawer leads with it. */}
          <p className="mt-2 text-base font-semibold leading-snug text-black">
            {shown.oneLineClaim}
          </p>

          <p className="mt-3 text-base leading-relaxed text-black/70">
            {shown.description}
          </p>

          {/* The citation is the reference. No outbound PubMed link: naming the
              study is the credibility signal, and a link out of a drawer mid
              purchase-decision is a leak. */}
          {stat && (
            <div className="mt-6">
              <LabelledRow label="Evidence">
                <span className="mr-1.5 font-semibold tabular-nums text-[color:var(--brand-navy)]">
                  {stat.value}
                </span>
                {stat.label}
                <span className="mt-1 block text-xs text-black/40">
                  {stat.source}
                </span>
              </LabelledRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
