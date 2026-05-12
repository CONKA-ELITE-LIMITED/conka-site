import { CartLine } from "@/app/lib/shopify";
import { getOfferPricing, getOfferVariant } from "./funnelData";
import { formatPrice } from "./productData";

type CartProductType = "flow" | "clear" | "both";
type CartCadence = "monthly-sub" | "monthly-otp" | "quarterly-sub";

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
  price: number;
  variantId: string;
  sellingPlanId?: string;
}

// Variant GIDs sourced from funnelData.ts FUNNEL_VARIANTS (confirmed consistent across site and funnel).
const FLOW_VARIANT_IDS = new Set([
  "gid://shopify/ProductVariant/57568795918710", // monthly
  "gid://shopify/ProductVariant/57568795951478", // quarterly
]);
const CLEAR_VARIANT_IDS = new Set([
  "gid://shopify/ProductVariant/57568517489014", // monthly
  "gid://shopify/ProductVariant/57568746930550", // quarterly
]);
const BOTH_VARIANT_IDS = new Set([
  "gid://shopify/ProductVariant/57568809976182", // monthly
  "gid://shopify/ProductVariant/57568810008950", // quarterly
]);
// Quarterly variants have unique GIDs — used to distinguish cadence from monthly.
const QUARTERLY_VARIANT_IDS = new Set([
  "gid://shopify/ProductVariant/57568795951478",
  "gid://shopify/ProductVariant/57568746930550",
  "gid://shopify/ProductVariant/57568810008950",
]);

function detectProduct(merchandiseId: string): CartProductType | null {
  if (FLOW_VARIANT_IDS.has(merchandiseId)) return "flow";
  if (CLEAR_VARIANT_IDS.has(merchandiseId)) return "clear";
  if (BOTH_VARIANT_IDS.has(merchandiseId)) return "both";
  return null;
}

function detectCadence(line: CartLine): CartCadence {
  if (QUARTERLY_VARIANT_IDS.has(line.merchandise.id)) return "quarterly-sub";
  return line.sellingPlanAllocation ? "monthly-sub" : "monthly-otp";
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
  const product = detectProduct(line.merchandise.id);
  if (!product) return null;

  const cadence = detectCadence(line);

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

    const priceSuffix =
      cadence === "monthly-sub" ? "/mo" : cadence === "quarterly-sub" ? "/qtr" : "";

    return {
      type: "add-both",
      label: `Upgrade to Both — includes ${addedName}`,
      badge: savingsPercent > 0 ? `Save ${savingsPercent}%` : "Bundle",
      heroLabel: `+${formatPrice(extraCost)}${priceSuffix}`,
      heroSub: "more than you pay now",
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
      price: upgradePrice,
      variantId: variant.variantId,
      sellingPlanId: variant.sellingPlanId,
    };
  }

  // Both monthly-sub or Both quarterly-sub: no upsell
  return null;
}
