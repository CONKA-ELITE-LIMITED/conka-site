import { CartLine } from "@/app/lib/shopify";
import {
  getOfferPricing,
  getOfferVariant,
  detectFunnelProduct,
  detectFunnelCadence,
} from "./funnelData";
import { formatPrice } from "./productData";

export interface CartUpsellOffer {
  type: "upgrade-to-sub";
  /** Full label for the rectangular CTA button (e.g. "Subscribe & Save £24.99"). */
  ctaLabel: string;
  /** Subscription price the line converts to. */
  price: number;
  variantId: string;
  sellingPlanId?: string;
}

/**
 * Per-line "Subscribe & Save" upsell, rendered as a single button directly
 * under each one-time line (the way DTC carts offer a subscription swap in
 * place). Returns null when the line is already a subscription, is not a
 * recognised funnel product, or the subscription would not actually save money.
 */
export function getLineSubscribeOffer(line: CartLine): CartUpsellOffer | null {
  // Already a subscription — nothing to upsell.
  if (line.sellingPlanAllocation) return null;

  const product = detectFunnelProduct(line.merchandise.id);
  if (!product) return null;

  const cadence = detectFunnelCadence(line.merchandise.id, false);
  if (cadence !== "monthly-otp") return null;

  const subVariant = getOfferVariant(product, "monthly-sub");
  if (!subVariant?.sellingPlanId) return null;

  const otpPrice = getOfferPricing(product, "monthly-otp").price;
  const subPrice = getOfferPricing(product, "monthly-sub").price;
  const perUnitSaving = otpPrice - subPrice;
  if (perUnitSaving <= 0) return null;

  const totalSaving = perUnitSaving * line.quantity;

  return {
    type: "upgrade-to-sub",
    ctaLabel: `Subscribe & Save ${formatPrice(totalSaving)}`,
    price: subPrice,
    variantId: subVariant.variantId,
    sellingPlanId: subVariant.sellingPlanId,
  };
}
