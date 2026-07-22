"use client";

import { useCart } from "@/app/context/CartContext";
import { CartLine } from "@/app/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_PRODUCTS } from "./navigation/navConfig";
import { TIME_OF_DAY_BADGE } from "@/app/lib/timeOfDayBadge";
import ConkaCTAButton from "./landing/ConkaCTAButton";
import CartAppGift from "./CartAppGift";
import CartUpsellStrip from "./CartUpsellStrip";
import { getLineSubscribeOffer } from "@/app/lib/cartUpsell";
import { getOfferByVariantId, getOfferPricing } from "@/app/lib/funnelData";
import { trackMetaInitiateCheckout, toContentId } from "@/app/lib/metaPixel";

// Fallback product images when Shopify doesn't provide one
const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  "conka flow": "/CONKA_01x.jpg",
  "conka clarity": "/CONKA_02x.jpg",
  flow: "/CONKA_01x.jpg",
  clarity: "/CONKA_02x.jpg",
};

function getProductFallbackImage(productTitle: string): string {
  const lowerTitle = productTitle.toLowerCase();
  for (const [key, image] of Object.entries(PRODUCT_FALLBACK_IMAGES)) {
    if (lowerTitle.includes(key)) {
      return image;
    }
  }
  return "/bottle2.png";
}

// GBP savings at/above which the footer shows the £ amount instead of the %.
// Psychology: a big saving lands harder as "£64 off", a small one as "43% off".
const CART_SAVINGS_VALUE_THRESHOLD = 50;

/** Price to display for one line (matches what the customer pays and what subtotal uses). */
function getLineDisplayPrice(
  item: CartLine,
): { amount: string; currencyCode: string } {
  const isSub = !!item.sellingPlanAllocation;
  const adjustment = item.sellingPlanAllocation?.priceAdjustments?.[0];

  if (isSub && adjustment?.price) {
    return {
      amount: adjustment.price.amount,
      currencyCode: adjustment.price.currencyCode,
    };
  }
  if (isSub && item.cost?.totalAmount?.amount && item.quantity > 0) {
    const perUnit = parseFloat(item.cost.totalAmount.amount) / item.quantity;
    return {
      amount: perUnit.toFixed(2),
      currencyCode: item.cost.totalAmount.currencyCode,
    };
  }
  return {
    amount: item.merchandise.price.amount,
    currencyCode: item.merchandise.price.currencyCode,
  };
}

/**
 * Subscription savings for one line, anchored on the verifiable one-time (OTP)
 * price for the same product: the crossed-out "was", the reconciled discount %,
 * and the £ saved across the line quantity. Returns null for one-time lines and
 * anything that would not actually show a saving, so the price block falls back
 * to the plain price. Quarterly ships three months at once, so it anchors
 * against three one-time boxes.
 */
function getLineSavings(item: CartLine): {
  compareAt: number;
  discountPct: number;
  savingsTotal: number;
} | null {
  if (!item.sellingPlanAllocation) return null;
  const offer = getOfferByVariantId(item.merchandise.id);
  if (!offer) return null;

  const displayNum = parseFloat(getLineDisplayPrice(item).amount);
  const otpUnit = getOfferPricing(offer.product, "monthly-otp").price;
  const compareAt = offer.cadence === "quarterly-sub" ? otpUnit * 3 : otpUnit;
  if (!(compareAt > displayNum)) return null;

  return {
    compareAt,
    discountPct: Math.round((1 - displayNum / compareAt) * 100),
    savingsTotal: (compareAt - displayNum) * item.quantity,
  };
}

function LineItemPrice({
  item,
  formatPrice,
}: {
  item: CartLine;
  formatPrice: (amount: string, currencyCode: string) => string;
}) {
  const display = getLineDisplayPrice(item);
  const savings = getLineSavings(item);
  return (
    <div className="flex shrink-0 flex-col items-end text-right">
      <span className="text-base font-bold tabular-nums text-black">
        {formatPrice(display.amount, display.currencyCode)}
      </span>
      {savings && (
        <>
          <span className="text-sm tabular-nums text-black/40 line-through">
            {formatPrice(savings.compareAt.toFixed(2), display.currencyCode)}
          </span>
          <span className="mt-1 rounded-full bg-[#1a7f4f]/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-[#1a7f4f]">
            {savings.discountPct}% off
          </span>
        </>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    loading,
    isOpen,
    closeCart,
    itemCount,
    updateQuantity,
    removeItem,
    getCartItems,
  } = useCart();

  const cartItems = getCartItems();

  // Total subscription savings across the cart, plus the compare-at base, so the
  // footer can show either a £ figure or a blended % (see getLineSavings).
  const cartSavings = cartItems.reduce(
    (acc, item) => {
      const s = getLineSavings(item);
      if (s) {
        acc.savings += s.savingsTotal;
        acc.compareAt += s.compareAt * item.quantity;
      }
      return acc;
    },
    { savings: 0, compareAt: 0 },
  );

  const formatPrice = (amount: string, currencyCode: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-black/12 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
          <h2 className="text-xl font-bold tracking-tight text-black">
            Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-10 h-10 -mr-2 text-black hover:text-black/50 transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#eef0f5] border-b border-black/5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1B2757"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 3h15v13H1z" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1B2757]">
            Free shipping on UK subscriptions
          </span>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto">
          {loading && cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-6 h-6 border border-black/15 border-t-black/50 rounded-full animate-spin mx-auto mb-3" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35">
                  Loading...
                </p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="px-5 py-8">
              <h3 className="text-center text-4xl font-bold tracking-tight text-black">
                Your cart is empty
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-black">
                Continue shopping or browse the products below to add items to
                your cart.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {NAV_PRODUCTS.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    onClick={closeCart}
                    aria-label={product.alt}
                    className="group block overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 448px) 50vw, 210px"
                      />
                    </div>
                    <div className="relative border-t border-black/10 px-3 pb-3 pt-6 text-center">
                      <span
                        className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] leading-none ${TIME_OF_DAY_BADGE[product.badge]}`}
                      >
                        {product.badge}
                      </span>
                      <p className="text-sm font-bold leading-tight text-black">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={
                          item.merchandise.product.featuredImage?.url ||
                          getProductFallbackImage(item.merchandise.product.title)
                        }
                        alt={
                          item.merchandise.product.featuredImage?.altText ||
                          item.merchandise.product.title
                        }
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right column: title/price, then controls */}
                    <div className="flex flex-1 min-w-0 flex-col">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-bold leading-snug text-black">
                            {item.merchandise.product.title}
                          </p>
                          <p className="mt-1 text-sm text-black">
                            {(() => {
                              const offer = getOfferByVariantId(item.merchandise.id);
                              if (!offer) return item.merchandise.title;
                              const { shotCount, freeShots } = offer.pricing;
                              return (
                                <>
                                  {shotCount} Bottles
                                  {freeShots && freeShots > 0 ? (
                                    <span className="font-semibold text-[#1a7f4f]">
                                      {" "}
                                      + {freeShots} free
                                    </span>
                                  ) : null}
                                </>
                              );
                            })()}
                          </p>
                          {(() => {
                            const savings = getLineSavings(item);
                            if (!savings) return null;
                            const offer = getOfferByVariantId(item.merchandise.id);
                            const cadenceLabel =
                              offer?.cadence === "quarterly-sub"
                                ? "every 3 months"
                                : "every month";
                            return (
                              <p className="mt-1 text-sm font-semibold text-black">
                                {savings.discountPct}% off {cadenceLabel}, forever
                              </p>
                            );
                          })()}
                        </div>
                        <LineItemPrice item={item} formatPrice={formatPrice} />
                      </div>

                      {/* Controls: quantity left, remove right */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-black/15">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center text-black/60 transition-colors hover:text-black disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center text-black/60 transition-colors hover:text-black disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="p-1.5 text-black/40 transition-colors hover:text-black disabled:opacity-40"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>

                      {/* Per-line Subscribe & Save (one-time lines only) */}
                      {(() => {
                        const lineOffer = getLineSubscribeOffer(item);
                        return lineOffer ? (
                          <div className="mt-3">
                            <CartUpsellStrip
                              offer={lineOffer}
                              currentLineId={item.id}
                              originalVariantId={item.merchandise.id}
                              originalSellingPlanId={item.sellingPlanAllocation?.sellingPlan.id}
                              originalQuantity={item.quantity}
                            />
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              ))}
              <CartAppGift />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/8 bg-white">
          {cart && cartItems.length > 0 && (
            <div className="px-5 pt-4 pb-3 space-y-2">
              {/* Subscription savings */}
              {cartSavings.savings > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-black">
                    Savings
                  </span>
                  <span className="rounded-full bg-[#1a7f4f]/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-[#1a7f4f]">
                    {cartSavings.savings >= CART_SAVINGS_VALUE_THRESHOLD
                      ? `£${Math.round(cartSavings.savings)} off`
                      : `${Math.round(
                          (cartSavings.savings / cartSavings.compareAt) * 100,
                        )}% off`}
                  </span>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-black">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-lg font-bold tabular-nums text-black">
                  {formatPrice(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode,
                  )}
                </span>
              </div>

              <p className="text-xs text-black">
                Shipping calculated at checkout
              </p>
            </div>
          )}

          {/* Checkout CTA */}
          <div className="px-4 pb-4">
            {cartItems.length === 0 ? (
              <ConkaCTAButton
                meta={null}
                className="w-full max-w-none justify-center"
                onClick={() => {
                  closeCart();
                  router.push("/conka-both");
                }}
              >
                Shop CONKA
              </ConkaCTAButton>
            ) : (
              <>
                <ConkaCTAButton
                  meta={null}
                  className="w-full max-w-none justify-center"
                  onClick={() => {
                    if (!cart?.checkoutUrl) return;
                    // Fire InitiateCheckout on our domain before the redirect to
                    // the Shopify-hosted checkout (the pixel can't fire it
                    // offsite). sendBeacon + CAPI keepalive survive the nav.
                    trackMetaInitiateCheckout({
                      content_ids: cartItems.map((i) => toContentId(i.merchandise.id)),
                      value: parseFloat(cart.cost.subtotalAmount.amount) || 0,
                      currency: cart.cost.subtotalAmount.currencyCode,
                      num_items: cartItems.reduce((s, i) => s + i.quantity, 0),
                    });
                    window.location.href = cart.checkoutUrl;
                  }}
                >
                  {loading ? "Updating" : "Checkout"}
                </ConkaCTAButton>

                {/* 100-day guarantee reassurance */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1a7f4f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2.5 2.5L16 9" />
                  </svg>
                  <span className="text-xs font-medium text-black">
                    100-Day Money-Back Guarantee
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
