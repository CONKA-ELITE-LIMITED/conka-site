import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import type { CadenceGift, CadencePricing } from "@/app/lib/cadenceData";

/**
 * GiftValueStack — the starter-pack "what else is in the box" rows (SCRUM-1283).
 *
 * Struck RRP per row, the IM8 / Graymatter pattern, rather than an unpriced tick
 * list. Every figure is display-only and pre-add: the cart and checkout still
 * price from Shopify alone (CART_PRICING_SOURCE_OF_TRUTH.md).
 *
 * Content only. The caller owns placement, so this returns no section, no
 * max-width and no page-level padding. Rendered inside ProductBuyPanel, which is
 * shared by the desktop and mobile heroes, so the two cannot drift.
 *
 * The bonus-shots row is derived from `freeShots` / `freeShotsValue` rather than
 * listed in `gifts`, so the shot count stays sourced from the same place the
 * cadence cards read it from.
 */

const SHOTS_IMAGE = "/formulas/starterPack/EightFlow.jpg";

export default function GiftValueStack({
  pricing,
}: {
  pricing: CadencePricing;
}) {
  const freeShots = pricing.freeShots ?? 0;
  const freeShotsValue = pricing.freeShotsValue ?? 0;

  const rows: CadenceGift[] = [
    ...(freeShots > 0 && freeShotsValue > 0
      ? [
          {
            id: "free-shots",
            label: `+${freeShots} free shots`,
            rrp: freeShotsValue,
            image: SHOTS_IMAGE,
          },
        ]
      : []),
    ...(pricing.gifts ?? []),
  ];

  if (rows.length === 0) return null;

  const totalFreeValue = rows.reduce((sum, row) => sum + row.rrp, 0);

  return (
    <div className="mt-4 rounded-md border border-black/15 bg-white p-5">
      <p className="text-lg font-medium text-black">
        Free with your first order
      </p>

      <ul className="mt-3 flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-3">
            {row.image ? (
              <Image
                src={row.image}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-md object-cover"
                sizes="40px"
              />
            ) : (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                style={{
                  background:
                    "color-mix(in srgb, var(--brand-positive) 10%, transparent)",
                }}
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="var(--brand-positive)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}

            <span className="min-w-0 flex-1 text-sm leading-snug text-black">
              {row.label}
            </span>

            <span className="flex shrink-0 items-baseline gap-1.5 text-sm">
              <span className="text-black/45 line-through">
                {formatPrice(row.rrp)}
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--brand-positive)" }}
              >
                Free
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-black/10 pt-3 text-sm font-medium text-black">
        {formatPrice(totalFreeValue)} of extras, yours free
      </p>
    </div>
  );
}
