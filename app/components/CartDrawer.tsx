"use client";

import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { CartLine } from "@/app/lib/shopify";
import { trackMetaInitiateCheckout, toContentId } from "@/app/lib/metaPixel";
import { cartHasB2BLines, getB2BLinesTotalIncVat } from "@/app/lib/b2bCartTier";
import { incVatToExVat, getVatFromIncVat } from "@/app/lib/productData";
import Image from "next/image";
import CartAppGift from "./CartAppGift";

// Fallback product images when Shopify doesn't provide one
const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  "conka flow": "/CONKA_01x.jpg",
  "conka clarity": "/CONKA_02x.jpg",
  flow: "/CONKA_01x.jpg",
  clarity: "/CONKA_02x.jpg",
};

// Get fallback image based on product title
function getProductFallbackImage(productTitle: string): string {
  const lowerTitle = productTitle.toLowerCase();
  for (const [key, image] of Object.entries(PRODUCT_FALLBACK_IMAGES)) {
    if (lowerTitle.includes(key)) {
      return image;
    }
  }
  return "/bottle2.png"; // Default fallback
}

const B2B_TIER_MESSAGE_MS = 8000;
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

/** Compare-at / original price for strikethrough. Uses currentDisplayAmount when deriving for subscriptions. */
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

/** Everything needed to render a line item's price (subscription or one-time). */
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
  const {
    cart,
    loading,
    isOpen,
    closeCart,
    itemCount,
    updateQuantity,
    removeItem,
    getCartItems,
    b2bTierUpdatedTo,
    b2bNormalizeError,
    clearB2BTierMessage,
    clearB2BNormalizeError,
  } = useCart();

  const cartItems = getCartItems();

  const b2bTotalIncVat =
    cart && cartItems.length > 0 && cartHasB2BLines(cartItems)
      ? getB2BLinesTotalIncVat(cartItems)
      : null;
  const b2bVatBreakdown =
    b2bTotalIncVat !== null && cart
      ? {
          currencyCode: cart.cost.subtotalAmount.currencyCode ?? "GBP",
          net: incVatToExVat(b2bTotalIncVat),
          vat: getVatFromIncVat(b2bTotalIncVat),
          total: b2bTotalIncVat,
        }
      : null;

  useEffect(() => {
    if (!b2bTierUpdatedTo) return;
    const t = setTimeout(clearB2BTierMessage, B2B_TIER_MESSAGE_MS);
    return () => clearTimeout(t);
  }, [b2bTierUpdatedTo, clearB2BTierMessage]);

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
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
              Cart
            </p>
            {itemCount > 0 && (
              <span className="font-mono text-[10px] tabular-nums font-bold text-[#1B2757]">
                {String(itemCount).padStart(2, "0")} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-8 h-8 text-black/40 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* B2B tier message */}
        {b2bTierUpdatedTo && (
          <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-black/8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 tabular-nums">
              Pricing tier updated to {b2bTierUpdatedTo.charAt(0).toUpperCase() + b2bTierUpdatedTo.slice(1)}.
            </p>
          </div>
        )}
        {b2bNormalizeError && (
          <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-black/8 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 tabular-nums">
              {b2bNormalizeError}
            </p>
            <button
              type="button"
              onClick={clearB2BNormalizeError}
              className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 hover:text-black transition-colors underline tabular-nums"
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        )}

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
            <div className="flex items-center justify-center h-full p-4 text-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="mx-auto mb-4 text-black/20"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                  Your cart is empty
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/25 tabular-nums mt-2">
                  Add something to get started
                </p>
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
                      {item.merchandise.title}
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

              {/* B2B VAT breakdown */}
              {b2bVatBreakdown && (
                <div className="border border-black/12 bg-[#f5f5f5] px-3 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/55 tabular-nums mb-1.5">
                    Prices include VAT at 20%. Please email sales@conka.io for an invoice after purchase.
                  </p>
                  <p className="font-mono text-[9px] text-black/40 tabular-nums">
                    {formatPrice(b2bVatBreakdown.net.toFixed(2), b2bVatBreakdown.currencyCode)} net
                    {" · "}{formatPrice(b2bVatBreakdown.vat.toFixed(2), b2bVatBreakdown.currencyCode)} VAT (20%)
                    {" · "}{formatPrice(b2bVatBreakdown.total.toFixed(2), b2bVatBreakdown.currencyCode)} total
                  </p>
                </div>
              )}

              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/30 tabular-nums text-center">
                Shipping &amp; taxes calculated at checkout
              </p>
            </div>
          )}

          {/* Checkout CTA */}
          <div className="px-4 pb-4">
            <a
              href={cart?.checkoutUrl || "#"}
              onClick={(e) => {
                if (!cart?.checkoutUrl || cartItems.length === 0) {
                  e.preventDefault();
                  return;
                }
                trackMetaInitiateCheckout({
                  content_ids: cartItems.map((line) =>
                    toContentId(line.merchandise.id)
                  ),
                  value: parseFloat(cart.cost.subtotalAmount.amount),
                  currency: cart.cost.subtotalAmount.currencyCode ?? "GBP",
                  num_items: cart.totalQuantity ?? 0,
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
          </div>
        </div>
      </div>
    </div>
  );
}
