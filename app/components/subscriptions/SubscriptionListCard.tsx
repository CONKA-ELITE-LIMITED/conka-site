"use client";

import Link from "next/link";
import Image from "next/image";
import type { Subscription } from "@/app/hooks/useSubscriptions";
import { toDtcSubscriptionView } from "@/app/account/subscriptions/viewModel";
import { formatDate } from "@/app/account/subscriptions/utils";

/**
 * Subscription card, Magic-Mind / Skio aligned. The delivery rhythm is the
 * hero ("Every month"); the product, price and status sit beneath. Tapping the
 * card opens the deep-linkable detail view. No protocol tiers, shots, or
 * formula-mix.
 *
 * `onReactivate`, when provided, surfaces a Reactivate button for inactive
 * subscriptions (used on the overview / list). The button stops propagation so
 * the card's own navigation still works.
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
      <div className="flex gap-4">
        {view.image ? (
          <span
            className={`relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5] border border-black/8 ${
              isInactive ? "opacity-40" : ""
            }`}
          >
            <Image src={view.image} alt="" fill sizes="64px" className="object-cover" />
          </span>
        ) : (
          <span className="w-16 h-16 shrink-0 rounded-md bg-[#f5f5f5] border border-black/8" />
        )}

        <div className="flex-1 min-w-0">
          {/* Hero: delivery rhythm */}
          <p
            className="text-xl font-semibold text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            {view.cadenceHeroLabel}
          </p>
          {/* Product · price · status */}
          <p className="text-sm text-black/60 tabular-nums mt-1">
            <span className="text-black/80 font-medium">{view.displayName}</span>
            {" · "}£{view.price.toFixed(2)}
            {" · "}
            <span
              className={
                isInactive ? "text-black/45" : "text-[var(--brand-positive)] font-medium"
              }
            >
              {statusLabel}
            </span>
          </p>
          {(view.status === "active" || view.status === "paused") && view.nextDate && (
            <p className="text-[13px] text-black/45 tabular-nums mt-0.5">
              {view.status === "paused" ? "Paused" : `Renews ${formatDate(view.nextDate)}`}
            </p>
          )}

          {onReactivate && isInactive && (
            <div className="flex items-center gap-4 mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onReactivate();
                }}
                disabled={reactivateLoading}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-positive)] text-white text-[13px] font-semibold px-4 py-2 min-h-[40px] hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {reactivateLoading ? "Working..." : "Reactivate"}
              </button>
              <span className="text-[13px] font-semibold text-[var(--brand-navy)]">
                View details →
              </span>
            </div>
          )}
        </div>

        {!(onReactivate && isInactive) && (
          <span className="text-black/35 shrink-0 self-center" aria-hidden>
            →
          </span>
        )}
      </div>
    </Link>
  );
}
