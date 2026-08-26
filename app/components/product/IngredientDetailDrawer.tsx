"use client";

import { useEffect, useRef } from "react";
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

/** First study with a pmid becomes the PubMed link; none means no link. */
function pubmedUrl(ing: IngredientData): string | null {
  const pmid = ing.clinicalStudies.find((s) => s.pmid)?.pmid;
  return pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}` : null;
}

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

  if (!open || !ingredient) return null;

  const studies = pubmedUrl(ingredient);
  const stat = ingredient.keyStats[0];

  return (
    <div
      className="fixed inset-0 z-[100002] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={ingredient.name}
    >
      <div
        className="absolute inset-0 bg-[rgba(15,18,28,0.45)]"
        onClick={onClose}
        aria-hidden
      />

      {/* Full-height sheet on mobile, right-hand drawer from sm. */}
      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white sm:max-w-md">
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
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#eef0f5]">
            {ingredient.image && (
              <Image
                src={ingredient.image}
                alt={ingredient.name}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            )}
          </div>

          <h3 className="mt-6 text-2xl font-bold leading-tight text-black">
            {ingredient.name}
          </h3>

          {/* The one-line claim has no home on the tile now the grid shows only
              name and badge, so the drawer leads with it. */}
          <p className="mt-2 text-base font-semibold leading-snug text-black">
            {ingredient.oneLineClaim}
          </p>

          <p className="mt-3 text-base leading-relaxed text-black/70">
            {ingredient.description}
          </p>

          <div className="mt-6">
            {badge?.outcome && (
              <LabelledRow label="Supports">{badge.outcome}</LabelledRow>
            )}

            {stat && (
              <LabelledRow label="Evidence">
                <span className="mr-1.5 font-semibold tabular-nums text-[color:var(--brand-navy)]">
                  {stat.value}
                </span>
                {stat.label}
                <span className="mt-1 block text-xs text-black/40">
                  {stat.source}
                </span>
              </LabelledRow>
            )}

            {studies && (
              <LabelledRow label="Study">
                <a
                  href={studies}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-black underline underline-offset-4"
                >
                  Read on PubMed
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </LabelledRow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
