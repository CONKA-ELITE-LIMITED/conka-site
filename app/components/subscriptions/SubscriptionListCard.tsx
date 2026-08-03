"use client";

import Link from "next/link";
import Image from "next/image";
import type { Subscription } from "@/app/hooks/useSubscriptions";
import { toDtcSubscriptionView } from "@/app/account/subscriptions/viewModel";
import { formatDate, getStatusColor } from "@/app/account/subscriptions/utils";

/**
 * Compact subscription row for the Subscriptions list. Renders from the DTC
 * view model (name + cadence + price + status + next renewal) and links to the
 * deep-linkable detail route. No protocol tiers, shots, or formula-mix.
 */
export function SubscriptionListCard({ subscription }: { subscription: Subscription }) {
  const view = toDtcSubscriptionView(subscription);
  const statusLabel = view.status.charAt(0).toUpperCase() + view.status.slice(1);

  return (
    <Link
      href={`/account/subscriptions/${view.routeId}`}
      className="flex items-center gap-4 bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4 hover:border-black/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)]"
    >
      {view.image ? (
        <span className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5] border border-black/8">
          <Image src={view.image} alt="" fill sizes="64px" className="object-cover" />
        </span>
      ) : (
        <span className="w-16 h-16 shrink-0 rounded-md bg-[#f5f5f5] border border-black/8" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-base font-semibold text-black truncate"
            style={{ letterSpacing: "-0.02em" }}
          >
            {view.displayName}
          </p>
          <span
            className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums font-semibold shrink-0 ${getStatusColor(
              view.status,
            )}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-black/60 tabular-nums mt-1">
          {view.cadenceLabel} · £{view.price.toFixed(2)}
        </p>
        {(view.status === "active" || view.status === "paused") && view.nextDate && (
          <p className="text-[13px] text-black/45 tabular-nums mt-0.5">
            {view.status === "paused" ? "Paused" : `Renews ${formatDate(view.nextDate)}`}
          </p>
        )}
      </div>

      <span className="text-black/35 shrink-0 self-center" aria-hidden>
        →
      </span>
    </Link>
  );
}
