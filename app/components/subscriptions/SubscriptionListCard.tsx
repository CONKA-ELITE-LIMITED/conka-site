"use client";

import Link from "next/link";
import Image from "next/image";
import type { Subscription } from "@/app/hooks/useSubscriptions";
import { toDtcSubscriptionView } from "@/app/account/subscriptions/viewModel";
import { formatDate } from "@/app/account/subscriptions/utils";

/** Circular refresh arrow — reactivate. */
function ReactivateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="w-4 h-4 shrink-0"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 12a9 9 0 1 1-2.64-6.36M21 3v4h-4"
      />
    </svg>
  );
}

/** Status pill colour: green for active, amber for paused, grey otherwise. */
function statusBadgeClass(status: Subscription["status"]): string {
  if (status === "active") return "bg-[var(--brand-positive)]/10 text-[var(--brand-positive)]";
  if (status === "paused") return "bg-amber-500/10 text-amber-600";
  return "bg-black/[0.06] text-black/50";
}

/**
 * Subscription card, Magic-Mind / Skio aligned. Vertical layout: the product
 * asset sits on top, then the delivery rhythm as the hero ("Every month"),
 * then cost + status. Tapping the card opens the deep-linkable detail view.
 * No protocol tiers, shots, or formula-mix.
 *
 * `onReactivate`, when provided, surfaces a Reactivate button (brand navy, with
 * icon) plus a "View details" affordance for inactive subscriptions. The button
 * stops propagation so the card's own navigation still works.
 */
export function SubscriptionListCard({
  subscription,
  onReactivate,
  reactivateLoading = false,
}: {
  subscription: Subscription;
  onReactivate?: () => void;
  reactivateLoading?: boolean;
}) {
  const view = toDtcSubscriptionView(subscription);
  const statusLabel = view.status.charAt(0).toUpperCase() + view.status.slice(1);
  const isInactive = view.status === "cancelled" || view.status === "expired";

  return (
    <Link
      href={`/account/subscriptions/${view.routeId}`}
      className="block bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4 hover:border-black/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)]"
    >
      {/* Asset */}
      {view.image ? (
        <span
          className={`relative block w-20 h-20 overflow-hidden rounded-md bg-[#f5f5f5] border border-black/8 mb-3 ${
            isInactive ? "opacity-40" : ""
          }`}
        >
          <Image src={view.image} alt="" fill sizes="80px" className="object-cover" />
        </span>
      ) : (
        <span className="block w-20 h-20 rounded-md bg-[#f5f5f5] border border-black/8 mb-3" />
      )}

      {/* Cadence hero */}
      <p className="text-xl font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
        {view.cadenceHeroLabel}
      </p>

      {/* Cost · state */}
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-sm text-black/70 tabular-nums">£{view.price.toFixed(2)}</span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(
            view.status,
          )}`}
        >
          {statusLabel}
        </span>
      </div>

      {!isInactive && (
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <p className="text-[13px] text-black/45 tabular-nums">
            {view.status === "active" && view.nextDate
              ? `Renews ${formatDate(view.nextDate)}`
              : ""}
          </p>
          <span className="text-[13px] font-semibold text-black shrink-0">View details →</span>
        </div>
      )}

      {onReactivate && isInactive && (
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReactivate();
            }}
            disabled={reactivateLoading}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold px-4 py-2 min-h-[40px] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <ReactivateIcon />
            {reactivateLoading ? "Working..." : "Reactivate"}
          </button>
          <span className="text-[13px] font-semibold text-black">View details →</span>
        </div>
      )}
    </Link>
  );
}
