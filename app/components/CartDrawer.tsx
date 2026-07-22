"use client";

import { useCart } from "@/app/context/CartContext";
import { CartLine } from "@/app/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_PRODUCTS } from "./navigation/navConfig";
import ConkaCTAButton from "./landing/ConkaCTAButton";
import CartAppGift from "./CartAppGift";
import CartUpsellStrip from "./CartUpsellStrip";
import { getCartUpsell } from "@/app/lib/cartUpsell";
import { getOfferByVariantId } from "@/app/lib/funnelData";
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

const SUBSCRIPTION_DISCOUNT = 0.2;

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

/** Compare-at / original price for strikethrough. */
function getCompareAtPrice(
  item: CartLine,
  currentDisplayAmount?: string,
): { amount: string; currencyCode: string } | null {
  if (item.sellingPlanAllocation?.priceAdjustments?.[0]?.compareAtPrice) {
    return item.sellingPlanAllocation.priceAdjustments[0].compareAtPrice;
  }
  if (item.merchandise.compareAtPrice) return item.merchandise.compareAtPrice;
  if (item.cost?.compareAtAmountPerQuantity) return item.cost.compareAtAmountPerQuantity;

  if (item.sellingPlanAllocation) {
    const discounted = parseFloat(
      currentDisplayAmount ?? item.merchandise.price.amount,
    );
    const original = discounted / (1 - SUBSCRIPTION_DISCOUNT);
    return {
      amount: original.toFixed(2),
      currencyCode: item.merchandise.price.currencyCode,
    };
  }
  return null;
}

function getLinePriceInfo(item: CartLine) {
  const display = getLineDisplayPrice(item);
  const compareAt = getCompareAtPrice(item, display.amount);
  const showCompare =
    compareAt != null && parseFloat(compareAt.amount) > parseFloat(display.amount);
  return { display, compareAt, showCompare };
}

function LineItemPrice({
  item,
  formatPrice,
}: {
  item: CartLine;
  formatPrice: (amount: string, currencyCode: string) => string;
}) {
  const { display, compareAt, showCompare } = getLinePriceInfo(item);
  return (
    <div className="flex items-center gap-2 mt-1">
      {showCompare && compareAt && (
        <span className="font-mono text-[10px] tabular-nums text-black/35 line-through">
          {formatPrice(compareAt.amount, compareAt.currencyCode)}
        </span>
      )}
      <span className="font-mono text-sm font-bold tabular-nums text-black">
        {formatPrice(display.amount, display.currencyCode)}
      </span>
      {showCompare && (
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#1B2757] bg-[#1B2757]/6 border border-[#1B2757]/20 px-1.5 py-0.5 tabular-nums">
          -20%
        </span>
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

  // Shots + free-shots summary for the subtotal area. Sums priced shots and
  // bonus ("20 + 8 free") shots across any recognised funnel lines in the cart.
  const shotSummary = cartItems.reduce(
    (acc, item) => {
      const offer = getOfferByVariantId(item.merchandise.id);
      if (offer) {
        acc.shots += (offer.pricing.shotCount ?? 0) * item.quantity;
        acc.free += (offer.pricing.freeShots ?? 0) * item.quantity;
      }
      return acc;
    },
    { shots: 0, free: 0 },
  );

  // Hide upsell while any cart mutation is in flight to prevent stale flashes.
  const upsellOffer = !loading ? getCartUpsell(cartItems) : null;

  const formatPrice = (amount: string, currencyCode: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const isSubscription = (item: CartLine) => !!item.sellingPlanAllocation;

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
              <h3 className="text-center text-3xl font-bold tracking-tight text-black">
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
                    <div className="px-3 py-2.5 text-center">
                      <p className="text-sm font-bold leading-tight text-black">
                        {product.name}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-black/55">
                        {product.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-white border border-black/12"
                >
                  {/* Product image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-black/[0.03] border border-black/8 overflow-hidden">
                    <Image
                      src={
                        item.merchandise.product.featuredImage?.url ||
                        getProductFallbackImage(item.merchandise.product.title)
                      }
                      alt={
                        item.merchandise.product.featuredImage?.altText ||
                        item.merchandise.product.title
                      }
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate leading-tight">
                      {item.merchandise.product.title}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 tabular-nums truncate mt-0.5">
                      {(() => {
                        const offer = getOfferByVariantId(item.merchandise.id);
                        if (!offer) return item.merchandise.title;
                        const { shotCount, freeShots } = offer.pricing;
                        return (
                          <>
                            {shotCount} shots
                            {freeShots && freeShots > 0 ? (
                              <span className="font-bold text-[#1a7f4f]">
                                {" "}
                                + {freeShots} free
                              </span>
                            ) : null}
                          </>
                        );
                      })()}
                    </p>

                    {isSubscription(item) && (
                      <span className="inline-block mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/6 border border-[#1B2757]/20 px-2 py-0.5 tabular-nums">
                        Subscribe
                      </span>
                    )}

                    <LineItemPrice item={item} formatPrice={formatPrice} />

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={loading}
                        className="w-7 h-7 flex items-center justify-center border border-black/12 hover:border-black/40 transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="font-mono text-sm tabular-nums w-6 text-center text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="w-7 h-7 flex items-center justify-center border border-black/12 hover:border-black/40 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-black/30 hover:text-black/60 transition-colors disabled:opacity-40 tabular-nums"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {upsellOffer && (
                <CartUpsellStrip
                  offer={upsellOffer}
                  currentLineId={cartItems[0].id}
                  originalVariantId={cartItems[0].merchandise.id}
                  originalSellingPlanId={cartItems[0].sellingPlanAllocation?.sellingPlan.id}
                  originalQuantity={cartItems[0].quantity}
                />
              )}
              <CartAppGift />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/8 bg-white">
          {cart && cartItems.length > 0 && (
            <div className="px-4 pt-4 pb-3 space-y-3">
              {/* Subtotal */}
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                  Subtotal
                </span>
                <span className="font-mono text-lg font-bold tabular-nums text-black">
                  {formatPrice(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode,
                  )}
                </span>
              </div>

              {/* Shots + "20 + 8 free" bonus summary */}
              {shotSummary.shots > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Shots
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-black/70">
                    {shotSummary.shots} shots
                    {shotSummary.free > 0 && (
                      <span className="font-bold text-[#1a7f4f]">
                        {" "}
                        + {shotSummary.free} free
                      </span>
                    )}
                  </span>
                </div>
              )}

              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/30 tabular-nums text-center">
                Shipping &amp; taxes calculated at checkout
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
            <a
              href={cart?.checkoutUrl || "#"}
              onClick={(e) => {
                if (!cart?.checkoutUrl || cartItems.length === 0) {
                  e.preventDefault();
                  return;
                }
                // Fire InitiateCheckout on our domain before the redirect to the
                // Shopify-hosted checkout (the pixel can't fire it offsite).
                // sendBeacon + CAPI keepalive survive the navigation.
                trackMetaInitiateCheckout({
                  content_ids: cartItems.map((i) => toContentId(i.merchandise.id)),
                  value: parseFloat(cart.cost.subtotalAmount.amount) || 0,
                  currency: cart.cost.subtotalAmount.currencyCode,
                  num_items: cartItems.reduce((s, i) => s + i.quantity, 0),
                });
              }}
              className={`relative block w-full bg-[#1B2757] text-white px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-center [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] transition-opacity ${
                cartItems.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Updating
                </span>
              ) : cartItems.length === 0 ? (
                "Cart is empty"
              ) : (
                "Checkout →"
              )}
            </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
