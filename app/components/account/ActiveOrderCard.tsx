import Link from "next/link";

interface ActiveOrderCardProps {
  orderName: string;
  productTitle: string;
  fulfillmentStatus: string;
}

function getStatusLabel(fulfillmentStatus: string): string {
  const s = fulfillmentStatus?.toLowerCase() || "";
  if (s === "partially_fulfilled" || s === "in_transit") return "Shipped";
  return "Processing";
}

export function ActiveOrderCard({
  orderName,
  productTitle,
  fulfillmentStatus,
}: ActiveOrderCardProps) {
  const statusLabel = getStatusLabel(fulfillmentStatus);

  return (
    <Link
      href="/account/orders"
      className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center gap-4 p-5 hover:bg-black/[0.02] transition-colors min-h-[44px]"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black/50 mb-1">Order in progress</p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-black tabular-nums">
            {orderName}
          </p>
          <span className="rounded-full bg-black/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-black shrink-0">
            {statusLabel}
          </span>
        </div>
        <p className="text-[13px] text-black/55 mt-0.5 truncate">{productTitle}</p>
      </div>
      <span className="text-black/40 shrink-0" aria-hidden>
        →
      </span>
    </Link>
  );
}

export default ActiveOrderCard;
