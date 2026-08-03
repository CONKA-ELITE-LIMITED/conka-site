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
  type FunnelProduct,
  type FunnelCadence,
} from "@/app/lib/funnelData";

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
  /** Authoritative charged total (Loop's discounted total, or the line price). */
  price: number;
  /** ISO next billing / delivery date. */
  nextDate: string;
  status: Subscription["status"];
  image: string;
  isMultiLine: boolean;
  lines: DtcSubscriptionLine[];
  /** Funnel product key, or null for legacy / unknown. Feeds swap + upsell. */
  funnelProduct: FunnelProduct | null;
  /** Funnel cadence key, or null. */
  funnelCadence: FunnelCadence | null;
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
} {
  if (interval?.unit === "month") {
    if (interval.value === 1) return { cadence: "monthly", cadenceLabel: "Monthly" };
    if (interval.value === 3) return { cadence: "quarterly", cadenceLabel: "Quarterly" };
  }
  // Legacy protocol subs use week/day intervals — keep their frequency label.
  return { cadence: "other", cadenceLabel: intervalToFrequencyLabel(interval) };
}

function resolveDisplayName(
  subscription: Subscription,
  isMultiLine: boolean,
): { displayName: string; funnelProduct: FunnelProduct | null } {
  // Two lines (Flow + Clear) is the funnel "Both" bundle.
  if (isMultiLine) return { displayName: "Both", funnelProduct: "both" };

  const type = getSubscriptionType(subscription);
  if (type === "flow") return { displayName: "Flow", funnelProduct: "flow" };
  if (type === "clear") return { displayName: "Clear", funnelProduct: "clear" };

  // Legacy protocol: use the protocol name, falling back to the raw title.
  const protocolId = getProtocolFromSubscription(subscription);
  const name = PROTOCOL_NAMES[protocolId] || subscription.product?.title || "Subscription";
  return { displayName: name, funnelProduct: null };
}

function funnelCadenceKey(cadence: SubscriptionCadence): FunnelCadence | null {
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

  const { cadence, cadenceLabel } = resolveCadence(subscription.interval);
  const { displayName, funnelProduct: rawFunnelProduct } = resolveDisplayName(
    subscription,
    isMultiLine,
  );
  const funnelCadence = funnelCadenceKey(cadence);
  // A funnel product only makes sense on a funnel cadence (monthly/quarterly).
  // Legacy protocol duals bill weekly/bi-weekly, so keep them un-tagged (the
  // display name can still read "Both"; funnel pricing/upsell must not apply).
  const funnelProduct = funnelCadence ? rawFunnelProduct : null;

  const price =
    subscription.totalLineItemDiscountedPrice ??
    parseFloat(subscription.price?.amount ?? "0") ??
    0;

  let savingsVsOneTime: number | null = null;
  if (funnelProduct && funnelCadence) {
    const pricing = getOfferPricing(funnelProduct, funnelCadence);
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
    price: Number.isFinite(price) ? price : 0,
    nextDate: subscription.nextBillingDate,
    status: subscription.status,
    image: getSubscriptionImage(subscription),
    isMultiLine,
    lines,
    funnelProduct,
    funnelCadence,
    savingsVsOneTime,
  };
}
