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
      className="bg-white border border-black/12 flex items-center gap-4 p-5 hover:bg-black/[0.02] transition-colors min-h-[44px]"
    >
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-1">
          {"// Order in progress"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-black tabular-nums">
            {orderName}
          </p>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/[0.06] border border-[#1B2757]/20 px-1.5 py-0.5 tabular-nums shrink-0">
            {statusLabel}
          </span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-0.5 truncate">
          {productTitle}
        </p>
      </div>
      <span className="text-black/40 font-mono shrink-0" aria-hidden>
        →
      </span>
    </Link>
  );
}

export default ActiveOrderCard;
