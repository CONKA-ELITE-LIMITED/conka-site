import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import type { CadencePricing } from "@/app/lib/cadenceData";

/**
 * StarterPackContents — the full-width starter-pack section on the Flow PDP
 * (SCRUM-1287, plan Phase 4).
 *
 * The buy panel already carries GiftValueStack, a compact tile grid. This is the
 * unpack: the arranged pack shot with the contents priced beside it, so a first
 * order reads as a kit rather than a carton. Both surfaces derive from the same
 * CadencePricing fields, so their figures cannot drift apart.
 *
 * Cadence-aware. `starterPackImage` is set on the two Flow subscription cadences
 * only, so it doubles as the visibility switch: the page renders no section at
 * all when the selected cadence has no pack. The monthly and quarterly shots are
 * the same dimensions, so switching cadence swaps the image with no layout shift.
 *
 * Every price here is display-only and pre-add. The cart and the checkout still
 * price from Shopify alone (CART_PRICING_SOURCE_OF_TRUTH.md).
 *
 * The pack shots currently carry burned-in price labels, which are legible at
 * desktop width and unreadable at 390px. The rows beside them are the load-
 * bearing copy at every width; the image is the arrangement, not the numbers.
 *
 * Content only: the page owns the section wrapper, background and track.
 */

/** One line of the pack. `paidPrice` absent means the row is free. */
type PackRow = {
  id: string;
  label: string;
  /** Struck RRP for the row (£). */
  rrp: number;
  paidPrice?: number;
};

function getPackRows(pricing: CadencePricing): PackRow[] {
  const freeShots = pricing.freeShots ?? 0;
  const freeShotsValue = pricing.freeShotsValue ?? 0;

  return [
    {
      id: "flow",
      label: `CONKA Flow, ${pricing.shotCount} shots`,
      rrp: pricing.compareAtPrice ?? pricing.price,
      paidPrice: pricing.price,
    },
    ...(freeShots > 0 && freeShotsValue > 0
      ? [
          {
            id: "free-shots",
            label: `+${freeShots} free shots`,
            rrp: freeShotsValue,
          },
        ]
      : []),
    ...(pricing.gifts ?? []).map((gift) => ({
      id: gift.id,
      label: gift.label,
      rrp: gift.rrp,
    })),
  ];
}

function Tick() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{
        background: "color-mix(in srgb, var(--brand-positive) 12%, transparent)",
      }}
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8.5L6.5 12L13 4.5"
          stroke="var(--brand-positive)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function StarterPackContents({
  pricing,
}: {
  pricing: CadencePricing;
}) {
  if (!pricing.starterPackImage) return null;

  const rows = getPackRows(pricing);
  const totalValue = rows.reduce((sum, row) => sum + row.rrp, 0);

  return (
    <div>
      {/* Eyebrow rather than a second name for the pack: the kit only exists on
          the subscription cadences, and saying so is what "welcome kit" was
          reaching for. */}
      <p className="text-sm font-semibold uppercase tracking-wide text-black/60">
        For new subscribers
      </p>
      <h2 className="brand-h2 mt-2">Your starter kit includes:</h2>
      <p className="brand-body mt-3 max-w-xl">
        Everything you need to kickstart focus, energy and cognitive
        performance. You pay for the shots. The rest is free.
      </p>

      <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:items-center lg:gap-14">
        <Image
          src={pricing.starterPackImage}
          alt={`Everything in the starter kit: ${rows
            .map((row) => row.label)
            .join(", ")}`}
          width={1200}
          height={857}
          className="h-auto w-full rounded-lg"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        <div>
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-4 border-b border-black/10 py-3.5 first:pt-0 last:border-0"
              >
                <span className="flex items-start gap-2.5">
                  <Tick />
                  <span className="text-base font-medium leading-snug text-black">
                    {row.label}
                  </span>
                </span>

                <span className="flex shrink-0 items-baseline gap-2 text-base">
                  {/* /60 rather than the panel's /45: this sits on tint, where
                      /45 lands near 3:1 against the background. */}
                  <span className="text-black/60 line-through">
                    {formatPrice(row.rrp)}
                  </span>
                  {row.paidPrice === undefined ? (
                    <span
                      className="font-bold"
                      style={{ color: "var(--brand-positive)" }}
                    >
                      Free
                    </span>
                  ) : (
                    <span className="font-bold text-black">
                      {formatPrice(row.paidPrice)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p
            className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-md px-4 py-3.5"
            style={{
              background:
                "color-mix(in srgb, var(--brand-positive) 10%, transparent)",
            }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: "var(--brand-positive)" }}
            >
              {formatPrice(totalValue)} of value
            </span>
            <span className="text-base font-medium text-black">
              Yours for {formatPrice(pricing.price)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
