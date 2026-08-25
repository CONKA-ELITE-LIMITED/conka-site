/**
 * DTC subscription view model.
 *
 * Normalises ANY subscription (funnel product, legacy protocol, main-site
 * formula) into one generic shape the portal renders from: a product, a
 * cadence, a price, a next-delivery date, a status, and its line items.
 *
 * This is the abstraction the portal was missing. The old display logic
 * reasoned in "protocols" (tiers, formula-mix ratios, shot maths), which is
 * wrong or irrelevant for the funnel products people actually buy. Rendering
 * from this shape means protocol-specific fields have nowhere to live, so the
 * broken tiles (0x Flow + 0x Clarity, STARTER badges) disappear by
 * construction rather than by hand-deletion.
 *
 * Legacy protocol subscriptions are just instances whose displayName is the
 * protocol name and whose funnel enrichments are null. They keep rendering.
 *
 * See docs/development/featurePlans/account-portal-funnel-simplification.md
 * and docs/product/SKU_AND_SHOT_REFERENCE.md.
 */

import type { Subscription } from "@/app/hooks/useSubscriptions";
import {
  getSubscriptionType,
  getProtocolFromSubscription,
  getSubscriptionImage,
  intervalToFrequencyLabel,
} from "@/app/account/subscriptions/utils";
import {
  getOfferPricing,
  getOfferByVariantId,
  type ByoProduct,
  type ByoCadence,
} from "@/app/lib/byoData";

/** Both is a single combined product; this is its box shot. */
const BOTH_IMAGE = "/formulas/both/BothBox.jpg";

export type SubscriptionCadence = "monthly" | "quarterly" | "other";

export interface DtcSubscriptionLine {
  id: string | number;
  productTitle: string;
  variantTitle: string;
  price: string | number;
  quantity: number;
}

export interface DtcSubscriptionView {
  /** Raw contract id (GID or numeric) — used for actions. */
  id: string;
  /** Numeric Shopify id — used for deep-link routing (/account/subscriptions/[id]). */
  routeId: string;
  /** Clean product name: "Flow" | "Clear" | "Both" | legacy protocol name. */
  displayName: string;
  cadence: SubscriptionCadence;
  /** Human label: "Monthly" | "Quarterly" | fallback frequency label. */
  cadenceLabel: string;
  /** Delivery-rhythm hero label (Magic-Mind style): "Every month" | "Every 3 months". */
  cadenceHeroLabel: string;
  /** Authoritative charged total (Loop's discounted total, or the line price). */
  price: number;
  /** ISO next billing / delivery date. */
  nextDate: string;
  status: Subscription["status"];
  image: string;
  isMultiLine: boolean;
  lines: DtcSubscriptionLine[];
  /** Funnel product key, or null for legacy / unknown. Feeds swap + upsell. */
  offerProduct: ByoProduct | null;
  /** Funnel cadence key, or null. */
  offerCadence: ByoCadence | null;
  /** compareAtPrice - price for funnel subs (savings vs one-time), else null. */
  savingsVsOneTime: number | null;
}

const PROTOCOL_NAMES: Record<string, string> = {
  "1": "Resilience",
  "2": "Precision",
  "3": "Balance",
  "4": "Ultimate",
};

/** Extract the numeric Shopify id from a GID or numeric string, for clean URLs. */
export function subscriptionRouteId(id: string): string {
  if (!id) return id;
  const parts = id.split("/");
  return parts[parts.length - 1] || id;
}

function resolveCadence(interval: Subscription["interval"]): {
  cadence: SubscriptionCadence;
  cadenceLabel: string;
  cadenceHeroLabel: string;
} {
  if (interval?.unit === "month") {
    if (interval.value === 1)
      return { cadence: "monthly", cadenceLabel: "Monthly", cadenceHeroLabel: "Every month" };
    if (interval.value === 3)
      return { cadence: "quarterly", cadenceLabel: "Quarterly", cadenceHeroLabel: "Every 3 months" };
  }
  // Legacy protocol subs use week/day intervals — keep their frequency label.
  const label = intervalToFrequencyLabel(interval);
  return { cadence: "other", cadenceLabel: label, cadenceHeroLabel: label };
}

/** Build the Shopify variant GID for a subscription's primary line, if known. */
function primaryVariantGid(subscription: Subscription): string | null {
  const numeric = subscription.lines?.[0]?.variantShopifyId;
  return numeric ? `gid://shopify/ProductVariant/${numeric}` : null;
}

/**
 * Resolve the funnel product (flow / clear / both) for a subscription.
 *
 * "Both" is a single combined product (BOTH-FUNNEL-56/40/140), not a two-line
 * Flow + Clear contract, so we must NOT infer it from line count. Detection order:
 *   1. Known funnel variant GID (first-order / quarterly / OTP SKUs).
 *   2. Title/variant naming: "Both - N Shots", or a title carrying both formulas
 *      (covers the post-order-1 20/40-shot SKUs that aren't in BYO_VARIANTS).
 *   3. Single-formula title match (Flow / Clear).
 * Returns null for legacy protocol / unknown subscriptions.
 */
function resolveByoProduct(subscription: Subscription): ByoProduct | null {
  const gid = primaryVariantGid(subscription);
  if (gid) {
    const offer = getOfferByVariantId(gid);
    if (offer) return offer.product;
  }

  const combined = `${subscription.product?.title ?? ""} ${
    subscription.lines?.map((l) => `${l.productTitle} ${l.variantTitle}`).join(" ") ?? ""
  }`.toLowerCase();
  if (combined.includes("both") || (combined.includes("flow") && combined.includes("clear"))) {
    return "both";
  }

  const type = getSubscriptionType(subscription);
  if (type === "flow") return "flow";
  if (type === "clear") return "clear";
  return null;
}

function resolveDisplayName(
  subscription: Subscription,
): { displayName: string; offerProduct: ByoProduct | null } {
  // Legacy protocol subs keep their protocol name and stay off the funnel path.
  const protocolId = getProtocolFromSubscription(subscription);
  if (protocolId && PROTOCOL_NAMES[protocolId]) {
    return { displayName: PROTOCOL_NAMES[protocolId], offerProduct: null };
  }

  const offerProduct = resolveByoProduct(subscription);
  if (offerProduct === "both") return { displayName: "Both", offerProduct: "both" };
  if (offerProduct === "flow") return { displayName: "Flow", offerProduct: "flow" };
  if (offerProduct === "clear") return { displayName: "Clear", offerProduct: "clear" };

  return { displayName: subscription.product?.title || "Subscription", offerProduct: null };
}

function offerCadenceKey(cadence: SubscriptionCadence): ByoCadence | null {
  if (cadence === "monthly") return "monthly-sub";
  if (cadence === "quarterly") return "quarterly-sub";
  return null;
}

/** Normalise a subscription into the generic DTC view model. */
export function toDtcSubscriptionView(subscription: Subscription): DtcSubscriptionView {
  const isMultiLine =
    subscription.isMultiLine ?? (subscription.lines?.length ?? 0) > 1;

  const lines: DtcSubscriptionLine[] = subscription.lines?.length
    ? subscription.lines.map((l, i) => ({
        id: l.id ?? i,
        productTitle: l.productTitle || "Subscription",
        variantTitle: l.variantTitle ?? "",
        price: l.price ?? "0",
        quantity: l.quantity ?? 1,
      }))
    : [
        {
          id: subscription.product?.id || "0",
          productTitle: subscription.product?.title || "Subscription",
          variantTitle: subscription.product?.variantTitle ?? "",
          price: subscription.price?.amount ?? "0",
          quantity: subscription.quantity ?? 1,
        },
      ];

  const { cadence, cadenceLabel, cadenceHeroLabel } = resolveCadence(subscription.interval);
  const { displayName, offerProduct: rawByoProduct } = resolveDisplayName(subscription);
  const offerCadence = offerCadenceKey(cadence);
  // A funnel product only makes sense on a funnel cadence (monthly/quarterly).
  // Legacy protocol duals bill weekly/bi-weekly, so keep them un-tagged (the
  // display name can still read "Both"; funnel pricing/upsell must not apply).
  const offerProduct = offerCadence ? rawByoProduct : null;

  const price =
    subscription.totalLineItemDiscountedPrice ??
    parseFloat(subscription.price?.amount ?? "0") ??
    0;

  let savingsVsOneTime: number | null = null;
  if (offerProduct && offerCadence) {
    const pricing = getOfferPricing(offerProduct, offerCadence);
    if (pricing.compareAtPrice != null) {
      const saving = pricing.compareAtPrice - price;
      savingsVsOneTime = saving > 0 ? Math.round(saving * 100) / 100 : null;
    }
  }

  return {
    id: subscription.id,
    routeId: subscriptionRouteId(subscription.id),
    displayName,
    cadence,
    cadenceLabel,
    cadenceHeroLabel,
    price: Number.isFinite(price) ? price : 0,
    nextDate: subscription.nextBillingDate,
    status: subscription.status,
    image: offerProduct === "both" ? BOTH_IMAGE : getSubscriptionImage(subscription),
    isMultiLine,
    lines,
    offerProduct,
    offerCadence,
    savingsVsOneTime,
  };
}
