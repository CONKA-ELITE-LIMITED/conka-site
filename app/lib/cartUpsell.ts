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

// ============================================================================
// CART UPSELL (SCRUM-1201 / SCRUM-1202)
// ----------------------------------------------------------------------------
// One deterministic, one-time upsell for the whole cart, shown as a single tile
// in the CartDrawer (`CartUpsellTile`).
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
  /** Line quantity, carried onto the swapped-in variant. */
  originalQuantity: number;

  /** The variant + selling plan to add in its place. */
  targetVariantId: string;
  targetSellingPlanId?: string;

  /** Display (the tile is copy-only; all wording is decided here). */
  thumbnail: string;
  headline: string;
  /** One value/description line. Rendered green on its own, or black when a `highlight` badge sits below it. */
  valueLine: string;
  /** Optional green badge shown under the value line, e.g. "+16 free shots". */
  highlight?: string;
  ctaLabel: string;
}

/** The copy fields a builder produces (everything the tile shows except identity/target/thumbnail). */
interface UpsellCopy {
  headline: string;
  valueLine: string;
  highlight?: string;
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

/**
 * Clear the accepted-upsell flag. Called when a swap add fails, so a failed
 * upgrade does not spend the shopper's one-time offer or mis-attribute the
 * unchanged order.
 */
export function clearUpsellAccepted(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(UPSELL_ACCEPTED_KEY);
  } catch {
    // ignore
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

function buildOtpToSubCopy(product: FunnelProduct, quantity: number): UpsellCopy {
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
): UpsellCopy {
  const current = getOfferPricing(product, cadence);
  const both = getOfferPricing("both", cadence);
  // Price the addition (the increment, not the £74.99 total) so the shopper sees
  // the real bill change up front rather than being surprised at checkout.
  // Round before the whole-pound check: 74.99 - 39.99 is 34.9999... in float, so
  // a raw Number.isInteger would miss it and render "£35.00" instead of "£35".
  const extra = Math.round((both.price - current.price) * 100) / 100;
  const periodSuffix = cadence === "quarterly-sub" ? "/quarter" : "/mo";
  const amount = Number.isInteger(extra) ? `£${extra}` : formatPrice(extra);
  const addedName = product === "flow" ? "Clear" : "Flow";
  return {
    headline: `Add ${addedName} for the full day`,
    valueLine: "The complete AM + PM system",
    highlight: both.freeShots ? `+${both.freeShots} free shots` : undefined,
    ctaLabel: `Upgrade to Both · +${amount}${periodSuffix}`,
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
      : buildSingleToBothCopy(product, cadence);

  return {
    type: upgrade.type,
    product,
    origin: `${upgrade.type}:${product}`,
    currentLineId: line.id,
    originalQuantity: line.quantity,
    targetVariantId: targetVariant.variantId,
    targetSellingPlanId: targetVariant.sellingPlanId,
    thumbnail: FUNNEL_PRODUCTS[upgrade.product].thumbnail,
    ...copy,
  };
}
