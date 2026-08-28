import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import type { CadenceGift, CadencePricing } from "@/app/lib/cadenceData";

/**
 * GiftValueStack — the starter-pack gift grid (SCRUM-1283).
 *
 * Struck RRP per tile, the IM8 / Graymatter pattern, rather than an unpriced
 * tick list. Every figure is display-only and pre-add: the cart and checkout
 * still price from Shopify alone (CART_PRICING_SOURCE_OF_TRUTH.md).
 *
 * Content only, and deliberately without its own box. It renders inside the
 * SubscriptionSummary card so the panel carries one bordered block rather than
 * two stacked ones, which doubled the panel height on mobile. The caller owns
 * the divider above it.
 *
 * Two columns at 390px, four from `sm:` up. Four across on a phone leaves about
 * 78px per tile, too tight for the struck price to stay legible, and the price
 * is the point of this pattern.
 *
 * The bonus-shots tile derives from `freeShots` / `freeShotsValue` rather than
 * being listed in `gifts`, so the shot count stays sourced from the same place
 * the cadence cards read it from.
 */

const SHOTS_IMAGE = "/formulas/starterPack/EightFlow.jpg";

/** Tiles a cadence gives away free, bonus shots first. */
function getGiftTiles(pricing: CadencePricing): CadenceGift[] {
  const freeShots = pricing.freeShots ?? 0;
  const freeShotsValue = pricing.freeShotsValue ?? 0;

  return [
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
}

export default function GiftValueStack({
  pricing,
}: {
  pricing: CadencePricing;
}) {
  const tiles = getGiftTiles(pricing);
  if (tiles.length === 0) return null;

  const totalFreeValue = tiles.reduce((sum, tile) => sum + tile.rrp, 0);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-lg font-medium text-black">
          Free with your first order
        </p>
        <p
          className="text-sm font-bold"
          style={{ color: "var(--brand-positive)" }}
        >
          {formatPrice(totalFreeValue)} value
        </p>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile.id} className="flex flex-col gap-2">
            {tile.image ? (
              <Image
                src={tile.image}
                alt=""
                width={160}
                height={160}
                className={`aspect-square w-full rounded-md ${
                  tile.imageFit === "contain"
                    ? "bg-black/[0.03] object-contain p-2"
                    : "object-cover"
                }`}
                sizes="(min-width: 640px) 120px, 45vw"
              />
            ) : (
              <span
                className="flex aspect-square w-full items-center justify-center rounded-md"
                style={{
                  background:
                    "color-mix(in srgb, var(--brand-positive) 10%, transparent)",
                }}
                aria-hidden
              >
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
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

            <span className="text-[13px] font-medium leading-snug text-black">
              {tile.label}
            </span>

            <span className="mt-auto flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
              <span className="text-black/45 line-through">
                {formatPrice(tile.rrp)}
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
    </div>
  );
}
