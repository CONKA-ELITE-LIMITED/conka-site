interface SubscriptionsPageHeaderProps {
  subtitle: string;
}

export function SubscriptionsPageHeader({ subtitle }: SubscriptionsPageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-black/50 mb-3">
        Account · Subscriptions
      </p>
      <h1
        id="subscriptions-heading"
        className="text-3xl lg:text-4xl font-semibold text-black mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Subscriptions
      </h1>
      <p className="text-[13px] text-black/50 tabular-nums">
        {subtitle}
      </p>
    </div>
  );
}
