"use client";

import { useState } from "react";
import type { Subscription } from "@/app/hooks/useSubscriptions";
import type { PaymentMethod } from "@/app/types/paymentMethod";
import type { TierDisplayInfo } from "@/app/account/subscriptions/utils";
import { formatDate, getStatusColor, getSubscriptionImage, intervalToFrequencyLabel } from "@/app/account/subscriptions/utils";
import { ContactSupportLink } from "@/app/components/ContactSupportLink";
import { PaymentCardSection } from "@/app/components/subscriptions/PaymentCardSection";

interface SubscriptionCardProps {
  subscription: Subscription;
  tierInfo: TierDisplayInfo;
  successMessage: string | null;
  isActionLoading: boolean;
  onEdit: () => void;
  onTogglePause: () => void;
  onCancel: () => void;
  onDismissSuccess: () => void;
  /** Primary (first safe) payment method from usePaymentMethods — per customer, fetch once. */
  primaryMethod?: PaymentMethod | null;
  onTriggerUpdateEmail?: (paymentMethodId: number) => void;
  paymentUpdateLoading?: boolean;
  paymentUpdateMessage?: string | null;
  /** Disable update button until this timestamp (ms). */
  paymentCooldownUntil?: number;
  onSkipNext?: () => void;
  onReschedule?: () => void;
  onPlaceOrder?: () => void;
  onApplyDiscount?: (code: string) => Promise<{ success: boolean; message: string }>;
}

export function SubscriptionCard({
  subscription,
  tierInfo: info,
  successMessage,
  isActionLoading,
  onEdit,
  onTogglePause,
  onCancel,
  onDismissSuccess,
  primaryMethod = null,
  onTriggerUpdateEmail,
  paymentUpdateLoading = false,
  paymentUpdateMessage = null,
  paymentCooldownUntil = 0,
  onSkipNext,
  onReschedule,
  onPlaceOrder,
  onApplyDiscount,
}: SubscriptionCardProps) {
  const [discountExpanded, setDiscountExpanded] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountFeedback, setDiscountFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyDiscount = async () => {
    if (!onApplyDiscount || !discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountFeedback(null);
    try {
      const result = await onApplyDiscount(discountCode.trim());
      setDiscountFeedback(result);
      if (result.success) {
        setDiscountCode('');
        setTimeout(() => { setDiscountExpanded(false); setDiscountFeedback(null); }, 3000);
      }
    } catch {
      setDiscountFeedback({ success: false, message: 'Something went wrong. Please try again.' });
    } finally {
      setDiscountLoading(false);
    }
  };
  const isMultiLine = subscription.isMultiLine ?? (subscription.lines?.length ?? 0) > 1;
  const lines = subscription.lines?.length ? subscription.lines : [{
    id: subscription.product?.id || '0',
    productTitle: subscription.product?.title || 'Subscription',
    variantTitle: subscription.product?.variantTitle ?? '',
    price: subscription.price?.amount ?? '0',
    quantity: subscription.quantity ?? 1,
  }];
  const productImage = getSubscriptionImage(subscription);
  return (
    <div className="bg-white border border-black/12 p-6 md:p-8 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex gap-5 min-w-0">
            {productImage ? (
              <div className="w-32 h-32 md:w-40 md:h-40 border border-black/8 flex-shrink-0 overflow-hidden">
                <img
                  src={productImage}
                  alt={subscription.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-[#f5f5f5] border border-black/8 flex-shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="text-black/30"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              {isMultiLine ? (
                <>
                  <h3
                    className="font-semibold text-lg text-black mb-2 tabular-nums"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {lines.length} products
                  </h3>
                  <ul className="space-y-2">
                    {lines.map((line, idx) => (
                      <li key={line.id ?? idx} className="text-sm flex items-baseline justify-between gap-2">
                        <span className="text-black">
                          {line.productTitle}{line.variantTitle ? ` · ${line.variantTitle}` : ''}
                        </span>
                        <span className="text-black/60 shrink-0 tabular-nums font-mono text-[10px]">
                          £{typeof line.price === 'number' ? line.price.toFixed(2) : line.price} × {line.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3
                    className="font-semibold text-lg text-black mb-1.5"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {subscription.product.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-1 bg-[#f5f5f5] border border-black/12 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-black">
                      {info.tierName}
                    </span>
                    <span className="text-sm text-black/60">
                      {info.protocolSubtitle}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 max-w-[50ch]">
                    {info.protocolDescription}
                  </p>
                </>
              )}
            </div>
          </div>
          <span
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums font-semibold flex-shrink-0 ${getStatusColor(
              subscription.status
            )}`}
          >
            {subscription.status.charAt(0).toUpperCase() +
              subscription.status.slice(1)}
          </span>
        </div>

        {(() => {
          // For multi-line: derive stats from all lines rather than from a single product.
          let displayFrequency: string;
          let displayPrice: number;
          let displayShots: number | null;
          let displayPricePerShot: number | null;

          // Active discounts (exclude shipping-only)
          const activeDiscounts = (subscription.discounts ?? []).filter(
            (d) => d.isActive && d.type !== 'SHIPPING_LINE',
          );

          if (isMultiLine) {
            displayFrequency = intervalToFrequencyLabel(subscription.interval);
            // Prefer Loop's authoritative discounted total; fall back to summing lines
            if (subscription.totalLineItemDiscountedPrice != null) {
              displayPrice = subscription.totalLineItemDiscountedPrice;
            } else {
              const lineTotal = lines.reduce(
                (sum, l) => sum + parseFloat(String(l.price)) * Math.max(1, l.quantity),
                0,
              );
              displayPrice = lineTotal > 0 ? lineTotal : parseFloat(subscription.price.amount) || 0;
            }
            // Infer shot count per line from variantTitle
            const shotsTotal = lines.reduce((sum, l) => {
              const v = (l.variantTitle || "").toLowerCase();
              for (const s of [56, 28, 12, 8, 4]) {
                if (v.includes(String(s))) return sum + s;
              }
              return sum + l.quantity;
            }, 0);
            displayShots = shotsTotal > 0 ? shotsTotal : null;
            displayPricePerShot = (displayShots && displayPrice) ? displayPrice / displayShots : null;
          } else {
            displayFrequency = info.frequency;
            // Use Loop's discounted total if available, otherwise fall back to derived price
            displayPrice = subscription.totalLineItemDiscountedPrice ?? info.price;
            displayShots = info.shots;
            displayPricePerShot = displayShots ? displayPrice / displayShots : info.pricePerShot;
          }

          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#f5f5f5] border border-black/12">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                    Billing
                  </p>
                  <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
                    {displayFrequency}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                    Total price
                  </p>
                  <p className="font-semibold text-black tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                    £{displayPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                    Shots
                  </p>
                  <p className="font-semibold text-black tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                    {displayShots != null ? `${displayShots} per delivery` : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                    Per shot
                  </p>
                  <p className="font-semibold text-black tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                    {displayPricePerShot != null ? `£${displayPricePerShot.toFixed(2)}` : "—"}
                  </p>
                </div>
              </div>
              {isMultiLine && (
                <p className="text-sm text-black/60 px-1">
                  Billed and delivered on your largest pack's schedule.
                </p>
              )}
              {activeDiscounts.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {activeDiscounts.map((d) => (
                    <span
                      key={d.title}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums font-medium text-green-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                      {d.title}
                      {d.value?.percentage != null && (
                        <span className="text-green-600">· {d.value.percentage}% off</span>
                      )}
                    </span>
                  ))}
                  {subscription.totalLineItemPrice != null &&
                    subscription.totalLineItemDiscountedPrice != null &&
                    subscription.totalLineItemPrice > subscription.totalLineItemDiscountedPrice && (
                      <span className="text-sm text-black/60 self-center tabular-nums">
                        (was £{subscription.totalLineItemPrice.toFixed(2)})
                      </span>
                    )}
                </div>
              )}
            </div>
          );
        })()}

        {!isMultiLine && (
        <div className="flex flex-wrap items-center gap-4 p-4 border border-black/12 bg-[#f5f5f5]">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
            Formula mix
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500" />
              <span className="text-sm text-black">
                {info.flowCount}× Flow
              </span>
            </div>
            <span className="text-black/40">+</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500" />
              <span className="text-sm text-black">
                {info.clarityCount}× Clarity
              </span>
            </div>
          </div>
          <span className="text-sm text-black/60 ml-auto">
            {info.isUltimate ? "per delivery" : "per week"}
          </span>
        </div>
        )}

      </div>

      {successMessage && (
        <div className="border border-black/12 bg-[#f5f5f5] p-4">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="text-green-600 flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm font-medium text-black flex-1">
              {successMessage}
            </p>
            <button
              onClick={onDismissSuccess}
              className="text-black/40 hover:text-black p-1 transition-colors"
              aria-label="Dismiss"
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
        </div>
      )}

      {subscription.status === "active" && !successMessage && (
        <div className="border border-black/12 bg-[#f5f5f5] p-4">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="text-green-600 flex-shrink-0"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm text-black">
              <span className="text-black/60">Next renewal:</span>{" "}
              <span className="font-semibold tabular-nums">
                {formatDate(subscription.nextBillingDate)}
              </span>
            </p>
          </div>
        </div>
      )}

      {subscription.status === "paused" && (
        <div className="border border-black/12 bg-[#f5f5f5] p-4">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="text-black flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="10" y1="15" x2="10" y2="9" />
              <line x1="14" y1="15" x2="14" y2="9" />
            </svg>
            <p className="text-sm text-black">
              This subscription is paused. Resume to continue deliveries.
            </p>
          </div>
        </div>
      )}

      {subscription.hasUnfulfilledOrder && subscription.status === "active" && (
        <div className="border border-[#1B2757]/20 bg-[#1B2757]/5 p-4">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="text-[#1B2757] flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1B2757] mb-1">
                {subscription.unfulfilledOrdersCount === 1 ||
                !subscription.unfulfilledOrdersCount
                  ? "You have an order being prepared"
                  : `You have ${subscription.unfulfilledOrdersCount} orders being prepared`}
              </p>
              <p className="text-sm text-[#1B2757]/70">
                Any plan changes will apply to your next delivery. To change a
                pending order,{" "}
                <ContactSupportLink variant="inline" icon={false} />
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription.status === "active" && onApplyDiscount && (
        <div className="space-y-3">
          {!discountExpanded ? (
            <button
              onClick={() => { setDiscountExpanded(true); setDiscountFeedback(null); }}
              aria-expanded={false}
              className="text-sm font-medium text-[#1B2757] hover:underline flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Apply promo code
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountFeedback(null); }}
                  placeholder="Enter promo code"
                  aria-label="Promo code"
                  maxLength={50}
                  className="flex-1 px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757] font-mono tracking-[0.1em] uppercase"
                  disabled={discountLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyDiscount();
                    }
                  }}
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={discountLoading || !discountCode.trim()}
                  aria-label={discountLoading ? 'Applying discount' : 'Apply discount code'}
                  className="px-4 py-2 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                >
                  {discountLoading ? (
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </button>
                <button
                  onClick={() => { setDiscountExpanded(false); setDiscountCode(''); setDiscountFeedback(null); }}
                  className="p-2 text-black/40 hover:text-black transition-colors"
                  aria-label="Close promo code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {discountFeedback && (
                <p className={`text-sm ${discountFeedback.success ? 'text-green-700' : 'text-red-600'}`} role="status">
                  {discountFeedback.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {(subscription.status === "active" || subscription.status === "paused") &&
        primaryMethod != null && (
        <PaymentCardSection
          primaryMethod={primaryMethod}
          onTriggerUpdateEmail={onTriggerUpdateEmail}
          paymentUpdateLoading={paymentUpdateLoading}
          paymentUpdateMessage={paymentUpdateMessage}
          paymentCooldownUntil={paymentCooldownUntil}
        />
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={onEdit}
          disabled={isActionLoading}
          className="bg-[#1B2757] text-white font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums px-5 py-2.5 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)] hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Plan
        </button>
        <button
          onClick={onTogglePause}
          disabled={isActionLoading}
          className="border border-black/12 hover:border-black/40 bg-white text-black font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isActionLoading ? (
            <>
              <div className="w-4 h-4 border border-black/15 border-t-black/50 rounded-full animate-spin" />
              Processing...
            </>
          ) : subscription.status === "paused" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Resume Subscription
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause Subscription
            </>
          )}
        </button>
        {subscription.status === "active" && onSkipNext && (
          <button
            onClick={onSkipNext}
            disabled={isActionLoading}
            className="border border-black/12 hover:border-black/40 bg-white text-black font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
            Skip next order
          </button>
        )}
        {subscription.status === "active" && onReschedule && (
          <button
            onClick={onReschedule}
            disabled={isActionLoading}
            className="border border-black/12 hover:border-black/40 bg-white text-black font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Reschedule Delivery
          </button>
        )}
        {subscription.status === "active" && onPlaceOrder && !subscription.hasUnfulfilledOrder && (
          <button
            onClick={onPlaceOrder}
            disabled={isActionLoading}
            className="border border-black/12 hover:border-black/40 bg-white text-black font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Order Now
          </button>
        )}
        <button
          onClick={onCancel}
          disabled={isActionLoading}
          className="border border-red-400 bg-transparent text-red-600 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-5 py-2.5 hover:bg-red-50/50 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
