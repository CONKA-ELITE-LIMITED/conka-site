/**
 * UK freight bands for B2B orders, mirroring the live UK "Express" weight
 * bands in Shopify (canonical table: docs/shipping/SHIPPING_AND_COURIERS.md
 * section 3 - 1 box = 2.1 kg, so the combined box count maps 1:1 onto the
 * weight tiers and no weight math is needed).
 *
 * Shared by the invoice-order route (prices the draft order's shipping line,
 * SCRUM-1079 Phase 2) and the order builder (shows the same number up front so
 * the invoice total never surprises). Keep this table in lockstep with the
 * Shopify rate config: a drift means the card path and invoice path charge
 * different freight for the same order.
 *
 * UK only by design: the invoice path has no address when the draft is
 * created, and no carrier rate exists above 6 boxes internationally, so
 * international B2B freight is quoted case-by-case (SHIPPING_AND_COURIERS.md
 * section 7).
 */

// Shipping-method title on the draft order. Must stay exactly "Express":
// Synergy routes on the method name alone, so these orders route correctly
// once B2B fulfilment consolidates onto Synergy (Phase 3).
export const B2B_SHIPPING_TITLE = "Express";

export interface B2BShippingBand {
  /** Highest combined box count in the band; null = no upper limit. */
  maxBoxes: number | null;
  price: number;
}

export const B2B_SHIPPING_BANDS: B2BShippingBand[] = [
  { maxBoxes: 6, price: 0 },
  { maxBoxes: 12, price: 12 },
  { maxBoxes: 24, price: 25 },
  { maxBoxes: 50, price: 50 },
  { maxBoxes: null, price: 75 },
];

export function getB2BShippingPrice(totalBoxes: number): number {
  return B2B_SHIPPING_BANDS.find(
    (band) => band.maxBoxes === null || totalBoxes <= band.maxBoxes,
  )!.price;
}
