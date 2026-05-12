import { CartLine } from "@/app/lib/shopify";
import {
  getOfferPricing,
  getOfferVariant,
  detectFunnelProduct,
  detectFunnelCadence,
} from "./funnelData";
import { formatPrice } from "./productData";

export interface CartUpsellOffer {
  type: "add-both" | "upgrade-to-sub";
  /** Header line shown in the tile */
  label: string;
  /** Short badge text (e.g. "Save 25%" or "Most popular") */
  badge: string;
  /** Primary focal metric ("+£30/mo" or "Save £40/mo") */
  heroLabel: string;
  /** Supporting line under the hero number */
  heroSub: string;
  /** Benefit bullets rendered below the hero number */
  benefits: string[];
  /** Product image to display in the tile */
  image: string;
  price: number;
  variantId: string;
  sellingPlanId?: string;
}

/**
 * Returns an upsell offer for a single-product cart, or null if no upsell applies.
 *
 * Rules:
 * - 2+ lines: no upsell (mixed cart, keep it simple).
 * - Flow or Clear: offer Both at the same cadence.
 * - Both OTP: offer Both monthly subscription.
 * - Both monthly-sub or Both quarterly-sub: no upsell (handled by email flows).
 */
export function getCartUpsell(lines: CartLine[]): CartUpsellOffer | null {
  if (lines.length !== 1) return null;

  const line = lines[0];
  const product = detectFunnelProduct(line.merchandise.id);
  if (!product) return null;

  const cadence = detectFunnelCadence(line.merchandise.id, !!line.sellingPlanAllocation);

  // Rule 1: Flow or Clear → offer Both at same cadence
  if (product === "flow" || product === "clear") {
    const variant = getOfferVariant("both", cadence);
    if (!variant) return null;

    const otherProduct = product === "flow" ? "clear" : "flow";
    const addedName = product === "flow" ? "Clear" : "Flow";

    const currentPricing = getOfferPricing(product, cadence);
    const bothPricing = getOfferPricing("both", cadence);
    const separatePrice = currentPricing.price + getOfferPricing(otherProduct, cadence).price;

    const extraCost = bothPricing.price - currentPricing.price;
    const savingVsSeparate = separatePrice - bothPricing.price;
    const savingsPercent = Math.round((savingVsSeparate / separatePrice) * 100);
    const addedShotCount = getOfferPricing(otherProduct, cadence).shotCount;

    const priceSuffix =
      cadence === "monthly-sub" ? "/mo" : cadence === "quarterly-sub" ? "/qtr" : "";
    const shotsFrequency =
      cadence === "monthly-sub" ? " every month" : cadence === "quarterly-sub" ? " per quarter" : "";

    return {
      type: "add-both",
      label: `Upgrade to Both — includes ${addedName}`,
      badge: savingsPercent > 0 ? `Save ${savingsPercent}%` : "Bundle",
      heroLabel: `+${formatPrice(extraCost)}${priceSuffix}`,
      heroSub: "more than you pay now",
      benefits: [
        `${addedShotCount} shots of Conka ${addedName}${shotsFrequency}`,
        "The complete cognitive performance system",
      ],
      image: "/formulas/both/BothShots.jpg",
      price: bothPricing.price,
      variantId: variant.variantId,
      sellingPlanId: variant.sellingPlanId,
    };
  }

  // Rule 2: Both OTP → offer Both monthly subscription
  if (product === "both" && cadence === "monthly-otp") {
    const variant = getOfferVariant("both", "monthly-sub");
    if (!variant) return null;

    const currentPrice = getOfferPricing("both", "monthly-otp").price;
    const upgradePrice = getOfferPricing("both", "monthly-sub").price;
    const saving = currentPrice - upgradePrice;

    return {
      type: "upgrade-to-sub",
      label: "Subscribe and save",
      badge: "Most popular",
      heroLabel: `Save ${formatPrice(saving)}/mo`,
      heroSub: `vs ${formatPrice(currentPrice)} one-time`,
      benefits: [
        "Delivered fresh every month",
        "Cancel anytime, no lock-in",
      ],
      image: "/formulas/both/BothShots.jpg",
      price: upgradePrice,
      variantId: variant.variantId,
      sellingPlanId: variant.sellingPlanId,
    };
  }

  // Both monthly-sub or Both quarterly-sub: no upsell
  return null;
}
