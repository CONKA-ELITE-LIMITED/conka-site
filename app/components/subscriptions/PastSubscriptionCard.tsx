import type { Subscription } from "@/app/hooks/useSubscriptions";
import { formatInterval, getStatusColor } from "@/app/account/subscriptions/utils";

interface PastSubscriptionCardProps {
  subscription: Subscription;
  onReactivate?: () => void;
  isActionLoading?: boolean;
}

export function PastSubscriptionCard({ subscription, onReactivate, isActionLoading }: PastSubscriptionCardProps) {
  const canReactivate = subscription.status === 'cancelled';

  return (
    <div className="bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5 opacity-75">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-[#f5f5f5] border border-black/8 rounded-md flex-shrink-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="text-black/40"
            >
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
              {subscription.product.title}
            </p>
            <p className="text-sm text-black/60">
              {formatInterval(subscription.interval)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {canReactivate && onReactivate && (
            <button
              onClick={onReactivate}
              disabled={isActionLoading}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium border border-[var(--brand-navy)] text-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? 'Reactivating...' : 'Reactivate'}
            </button>
          )}
          <span
            className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums font-semibold ${getStatusColor(
              subscription.status
            )}`}
          >
            {subscription.status}
          </span>
        </div>
      </div>
    </div>
  );
}
