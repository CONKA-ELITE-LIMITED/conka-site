interface OrdersPageHeaderProps {
  subtitle: string;
}

export function OrdersPageHeader({ subtitle }: OrdersPageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-black/50 mb-3">Account · Orders</p>
      <h1
        id="orders-heading"
        className="text-3xl lg:text-4xl font-semibold text-black mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Orders
      </h1>
      <p className="text-sm text-black/50 tabular-nums">{subtitle}</p>
    </div>
  );
}
