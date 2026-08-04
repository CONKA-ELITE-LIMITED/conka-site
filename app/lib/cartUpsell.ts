import { CartLine } from "@/app/lib/shopify";
import {
  getOfferPricing,
  getOfferVariant,
  detectFunnelProduct,
  detectFunnelCadence,
  FUNNEL_PRODUCTS,
  type FunnelProduct,
  type FunnelCadence,
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

// ============================================================================
// CONSOLIDATED CART UPSELL (SCRUM-1201)
// ----------------------------------------------------------------------------
// One deterministic, one-time upsell for the whole cart, shown as a single tile
// in the CartDrawer (SCRUM-1202). This supersedes the per-line
// `getLineSubscribeOffer` above; that function and `CartUpsellStrip` are removed
// when the tile lands (SCRUM-1202), which is why both coexist for now.
//
// The offer is UNIQUE and NON-CHAINING: it only appears for a single-line cart,
// offers exactly one upgrade, and is suppressed for the rest of the session once
// any upsell has been accepted (so OTP Flow -> monthly Flow never then offers
// Both). The accepted-origin doubles as purchase attribution via the `_upsell`
// hidden cart attribute (see CartContext).
// ============================================================================

/** Which kind of upgrade the tile is offering (also the analytics `type`). */
export type CartUpsellType = "otp_to_sub" | "single_to_both";

export interface CartUpsellTileOffer {
  type: CartUpsellType;
  /** The product the shopper currently has (the FROM product) — the analytics dimension. */
  product: FunnelProduct;
  /** Origin token persisted on accept and written to the `_upsell` cart attribute: `<type>:<fromProduct>`. */
  origin: string;

  /** The cart line being swapped out. */
  currentLineId: string;
  /** Original line details, so the tile can restore the cart if the swap add fails. */
  originalVariantId: string;
  originalSellingPlanId?: string;
  originalQuantity: number;

  /** The variant + selling plan to add in its place. */
  targetVariantId: string;
  targetSellingPlanId?: string;

  /** Display (the tile is copy-only; all wording is decided here). */
  thumbnail: string;
  headline: string;
  /** One value/savings line. */
  valueLine: string;
  ctaLabel: string;
}

const UPSELL_ACCEPTED_KEY = "conka_cart_upsell";

/**
 * Record that an upsell was accepted this session. Call this BEFORE the swap add
 * so the `_upsell` cart attribute attaches to that add (see CartContext). The
 * value is the offer's `origin` token (`<type>:<fromProduct>`). Session-scoped
 * (like the listicle origin), so the tile stays suppressed and the attribution
 * rides every subsequent add for the rest of the tab session.
 */
export function markUpsellAccepted(origin: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(UPSELL_ACCEPTED_KEY, origin);
  } catch {
    // sessionStorage unavailable (private mode); attribution degrades, tile still works.
  }
}

/** The accepted-upsell origin token for this session, or undefined if none accepted. */
export function getAcceptedUpsellOrigin(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage.getItem(UPSELL_ACCEPTED_KEY) || undefined;
  } catch {
    return undefined;
  }
}

/** True once any upsell has been accepted this session (the anti-chain guard). */
function hasAcceptedUpsell(): boolean {
  return getAcceptedUpsellOrigin() !== undefined;
}

/** The single deterministic upgrade for a given line state, or null if terminal. */
function resolveUpgrade(
  product: FunnelProduct,
  cadence: FunnelCadence,
): { product: FunnelProduct; cadence: FunnelCadence; type: CartUpsellType } | null {
  // OTP -> monthly subscription, same product (Flow / Clear / Both all qualify).
  if (cadence === "monthly-otp") {
    return { product, cadence: "monthly-sub", type: "otp_to_sub" };
  }
  // Single formula subscription -> Both, at the same cadence.
  if (product === "flow" || product === "clear") {
    if (cadence === "monthly-sub") {
      return { product: "both", cadence: "monthly-sub", type: "single_to_both" };
    }
    if (cadence === "quarterly-sub") {
      return { product: "both", cadence: "quarterly-sub", type: "single_to_both" };
    }
  }
  // Both subscriptions are terminal.
  return null;
}

function buildOtpToSubCopy(
  product: FunnelProduct,
  quantity: number,
): { headline: string; valueLine: string; ctaLabel: string } {
  const otp = getOfferPricing(product, "monthly-otp");
  const sub = getOfferPricing(product, "monthly-sub");
  const saving = (otp.price - sub.price) * quantity;
  const valueLine = sub.freeShots
    ? `Free shipping and ${sub.freeShots} free shots on your first order`
    : "Free shipping, cancel anytime";
  return {
    headline: "Make it a subscription",
    valueLine,
    ctaLabel: saving > 0 ? `Subscribe and save ${formatPrice(saving)}` : "Switch to subscription",
  };
}

function buildSingleToBothCopy(
  product: FunnelProduct,
  cadence: FunnelCadence,
  quantity: number,
): { headline: string; valueLine: string; ctaLabel: string } {
  const current = getOfferPricing(product, cadence);
  const both = getOfferPricing("both", cadence);
  const extra = (both.price - current.price) * quantity;
  const addedName = product === "flow" ? "Clear" : "Flow";
  const periodSuffix = cadence === "quarterly-sub" ? "/quarter" : "/mo";
  return {
    headline: `Add ${addedName} for the full day`,
    valueLine: `${formatPrice(both.perShot)}/shot, morning and afternoon covered`,
    ctaLabel: `Add ${addedName} for ${formatPrice(extra)}${periodSuffix}`,
  };
}

/**
 * The one upsell offer for the current cart, or null.
 *
 * Null unless ALL hold: no upsell accepted this session, the cart is a single
 * line, that line is a known funnel product, and its state has an upgrade in the
 * map (`resolveUpgrade`). Multi-line carts and Both subscriptions get nothing.
 */
export function getCartUpsell(lines: CartLine[]): CartUpsellTileOffer | null {
  // Anti-chain: one accepted upsell per session, full stop.
  if (hasAcceptedUpsell()) return null;
  // Single-line carts only — keeps the offer specific and unique.
  if (lines.length !== 1) return null;

  const line = lines[0];
  const product = detectFunnelProduct(line.merchandise.id);
  if (!product) return null;

  const cadence = detectFunnelCadence(line.merchandise.id, Boolean(line.sellingPlanAllocation));

  const upgrade = resolveUpgrade(product, cadence);
  if (!upgrade) return null;

  const targetVariant = getOfferVariant(upgrade.product, upgrade.cadence);
  if (!targetVariant?.variantId) return null;

  const copy =
    upgrade.type === "otp_to_sub"
      ? buildOtpToSubCopy(product, line.quantity)
      : buildSingleToBothCopy(product, cadence, line.quantity);

  return {
    type: upgrade.type,
    product,
    origin: `${upgrade.type}:${product}`,
    currentLineId: line.id,
    originalVariantId: line.merchandise.id,
    originalSellingPlanId: line.sellingPlanAllocation?.sellingPlan.id,
    originalQuantity: line.quantity,
    targetVariantId: targetVariant.variantId,
    targetSellingPlanId: targetVariant.sellingPlanId,
    thumbnail: FUNNEL_PRODUCTS[upgrade.product].thumbnail,
    ...copy,
  };
}
