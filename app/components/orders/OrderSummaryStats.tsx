interface OrderSummaryStatsProps {
  totalCount: number;
  deliveredCount: number;
  inProgressCount: number;
}

export function OrderSummaryStats({
  totalCount,
  deliveredCount,
  inProgressCount,
}: OrderSummaryStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-4 text-center">
        <p
          className="text-xl font-semibold text-black mb-0.5 tabular-nums"
          style={{ letterSpacing: "-0.02em" }}
        >
          {totalCount}
        </p>
        <p className="text-[13px] text-black/50">
          Total Orders
        </p>
      </div>
      <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-4 text-center">
        <p
          className="text-xl font-semibold text-black mb-0.5 tabular-nums"
          style={{ letterSpacing: "-0.02em" }}
        >
          {deliveredCount}
        </p>
        <p className="text-[13px] text-black/50">
          Delivered
        </p>
      </div>
      <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-4 text-center">
        <p
          className="text-xl font-semibold text-black mb-0.5 tabular-nums"
          style={{ letterSpacing: "-0.02em" }}
        >
          {inProgressCount}
        </p>
        <p className="text-[13px] text-black/50">
          In Progress
        </p>
      </div>
    </div>
  );
}
