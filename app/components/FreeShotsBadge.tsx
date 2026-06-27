/**
 * "20 + 8 free" bonus-shots callout.
 *
 * Surfaces the free bonus shots that come with a subscription. Monthly subs get
 * the bonus on the FIRST order only ("on your first order"); quarterly subs get
 * it every cycle ("included"). One-time orders get nothing.
 *
 * Driven by `pricing.freeShots` from funnelData, so each product/cadence shows
 * the right number automatically (+8 / +16 single & Both monthly, +20 quarterly).
 */

export default function FreeShotsBadge({
  freeShots,
  cadence,
  className = "",
  compact = false,
}: {
  freeShots?: number;
  /** "monthly-sub" | "monthly-otp" | "quarterly-sub" */
  cadence: string;
  className?: string;
  /** Tight form ("+8 free") for sticky bars and other cramped spots. */
  compact?: boolean;
}) {
  if (!freeShots || freeShots <= 0 || cadence === "monthly-otp") return null;
  const suffix = cadence === "quarterly-sub" ? "included" : "on your first order";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center bg-[#1a7f4f]/[0.1] text-[#1a7f4f] text-[11px] font-bold px-2 py-0.5 ${className}`}
      >
        +{freeShots} free
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center bg-[#1a7f4f]/[0.1] text-[#1a7f4f] text-xs font-semibold px-2.5 py-1 ${className}`}
    >
      +<span className="font-bold mx-1">{freeShots} free shots</span> {suffix}
    </span>
  );
}
