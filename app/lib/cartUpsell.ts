import { CartLine } from "@/app/lib/shopify";
import {
  getChargedPrice,
  getOfferPricing,
  getOfferVariant,
  detectOfferProduct,
  detectOfferCadence,
  STARTER_SHOTS_IMAGE,
  type OfferProduct,
  type OfferCadence,
} from "./offerData";
import { formatPrice, bottleRenders } from "./productData";

// ============================================================================
// CART UPSELL (SCRUM-1201 / SCRUM-1202)
// ----------------------------------------------------------------------------
// One deterministic, one-time upsell for the whole cart, shown as a single tile
// in the CartDrawer (`CartUpsellTile`).
//
// The offer is UNIQUE and NON-CHAINING: it only appears for a single-line cart,
// offers exactly one upgrade, and is suppressed once an upsell has been accepted
// (so OTP Flow -> monthly Flow never then offers Both). That suppression resets
// when the cart is emptied (CartDrawer), so a fresh cart is eligible again. The
// accepted-origin doubles as purchase attribution via the `_upsell` hidden cart
// attribute (see CartContext).
// ============================================================================

/** Which kind of upgrade the tile is offering (also the analytics `type`). */
export type CartUpsellType = "otp_to_sub" | "single_to_both";

export interface CartUpsellTileOffer {
  type: CartUpsellType;
  /** The product the shopper currently has (the FROM product) — the analytics dimension. */
  product: OfferProduct;
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
  /** Product shot, only when the product is what changes. Absent on OTP to sub. */
  thumbnail?: string;
  headline: string;
  /** The hook, rendered as a filled badge. Keep it to one short line. */
  valueLine: string;
  /** Muted reassurance under the badge, e.g. "Pause or cancel anytime". */
  highlight?: string;
  /**
   * Gift thumbnails shown as a small row, so the offer is seen and not just
   * read. `fit` mirrors `OfferGift.imageFit`: the tall transparent app render
   * has to be contained or the crop eats it, exactly as on the PDP stack.
   */
  giftImages?: { src: string; fit: "cover" | "contain" }[];
  ctaLabel: string;
}

/** The copy fields a builder produces (everything the tile shows except identity/target/thumbnail). */
interface UpsellCopy {
  headline: string;
  valueLine: string;
  highlight?: string;
  giftImages?: { src: string; fit: "cover" | "contain" }[];
  ctaLabel: string;
}

const UPSELL_ACCEPTED_KEY = "conka_cart_upsell";

/**
 * Record that an upsell was accepted. Call this BEFORE the swap add so the
 * `_upsell` cart attribute attaches to that add (see CartContext). The value is
 * the offer's `origin` token (`<type>:<fromProduct>`). Persisted in
 * sessionStorage: the tile stays suppressed (and the attribution rides
 * subsequent adds) until the cart is emptied (CartDrawer clears it) or a swap
 * add fails.
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

/** True while an accepted-upsell flag is set (the anti-chain guard; cleared on cart-empty or add-failure). */
function hasAcceptedUpsell(): boolean {
  return getAcceptedUpsellOrigin() !== undefined;
}

/** The single deterministic upgrade for a given line state, or null if terminal. */
function resolveUpgrade(
  product: OfferProduct,
  cadence: OfferCadence,
): { product: OfferProduct; cadence: OfferCadence; type: CartUpsellType } | null {
  // OTP -> the same-size subscription, same product (Flow / Clear / Both all qualify).
  if (cadence === "monthly-otp") {
    return { product, cadence: "monthly-sub", type: "otp_to_sub" };
  }
  if (cadence === "quarterly-otp") {
    return { product, cadence: "quarterly-sub", type: "otp_to_sub" };
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
  product: OfferProduct,
  fromCadence: OfferCadence,
  quantity: number,
): UpsellCopy {
  const subCadence: OfferCadence =
    fromCadence === "quarterly-otp" ? "quarterly-sub" : "monthly-sub";
  const otp = getOfferPricing(product, fromCadence);
  const sub = getOfferPricing(product, subCadence);
  // Anchor against the all-in charged OTP price (postage baked into the SKU).
  const saving = (getChargedPrice(otp) - sub.price) * quantity;
  // The starter kit is the strongest thing a one-time buyer is walking past, so
  // it leads, framed as what they lose rather than what they gain. Value is the
  // same sum the PDP gift stack shows: bonus shots plus every gift RRP.
  const kitValue =
    (sub.freeShotsValue ?? 0) +
    (sub.gifts ?? []).reduce((sum, gift) => sum + gift.rrp, 0);

  // Quarterly's bonus shots ship every cycle; monthly's are first-order only.
  const shotsLine = sub.freeShots
    ? subCadence === "quarterly-sub"
      ? `Free shipping and ${sub.freeShots} free shots with every delivery`
      : `Free shipping and ${sub.freeShots} free shots on your first order`
    : "Free shipping, cancel anytime";

  return {
    headline: "Make it a subscription",
    // Floored to the nearest ten: the badge is a hook read in one beat, and a
    // round number is both more memorable and more credible than an exact one,
    // which invites arithmetic. Floored rather than rounded so the figure is
    // never larger than what is actually given away. £82.96 -> "£80+".
    valueLine: kitValue
      ? `£${Math.floor(kitValue / 10) * 10}+ of gifts free`
      : shotsLine,
    highlight: kitValue ? "Pause or cancel anytime" : undefined,
    // Bonus shots lead, same order as the PDP stack, so the four tiles are the
    // whole kit rather than the three physical extras.
    giftImages: kitValue
      ? [
          ...(sub.freeShots
            ? [{ src: STARTER_SHOTS_IMAGE, fit: "cover" as const }]
            : []),
          ...(sub.gifts ?? [])
            .filter((gift) => Boolean(gift.image))
            .map((gift) => ({
              src: gift.image as string,
              fit: gift.imageFit ?? ("cover" as const),
            })),
        ]
      : undefined,
    ctaLabel: saving > 0 ? `Subscribe and save ${formatPrice(saving)}` : "Switch to subscription",
  };
}

function buildSingleToBothCopy(
  product: OfferProduct,
  cadence: OfferCadence,
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
  // Anti-chain: suppress once an upsell was accepted (reset when the cart empties).
  if (hasAcceptedUpsell()) return null;
  // Single-line carts only — keeps the offer specific and unique.
  if (lines.length !== 1) return null;

  const line = lines[0];
  const product = detectOfferProduct(line.merchandise.id);
  if (!product) return null;

  const cadence = detectOfferCadence(line.merchandise.id, Boolean(line.sellingPlanAllocation));

  const upgrade = resolveUpgrade(product, cadence);
  if (!upgrade) return null;

  const targetVariant = getOfferVariant(upgrade.product, upgrade.cadence);
  if (!targetVariant?.variantId) return null;

  const copy =
    upgrade.type === "otp_to_sub"
      ? buildOtpToSubCopy(product, cadence, line.quantity)
      : buildSingleToBothCopy(product, cadence);

  return {
    type: upgrade.type,
    product,
    origin: `${upgrade.type}:${product}`,
    currentLineId: line.id,
    originalQuantity: line.quantity,
    targetVariantId: targetVariant.variantId,
    targetSellingPlanId: targetVariant.sellingPlanId,
    // Shown only when the product itself is the upgrade. On OTP to subscription
    // the product is unchanged, so a bottle shot says nothing the shopper does
    // not already know and costs the width the gift tiles need.
    // V4 label render, not OFFER_PRODUCTS.thumbnail: that map still points at
    // the April cut-outs, which show the old label.
    thumbnail:
      upgrade.type === "single_to_both"
        ? bottleRenders[upgrade.product].src
        : undefined,
    ...copy,
  };
}
