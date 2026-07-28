'use client';

import type { PaymentMethod } from '@/app/types/paymentMethod';

interface PaymentCardSectionProps {
  primaryMethod: PaymentMethod;
  onTriggerUpdateEmail?: (paymentMethodId: number) => void;
  paymentUpdateLoading: boolean;
  paymentUpdateMessage: string | null;
  paymentCooldownUntil: number;
}

export function PaymentCardSection({
  primaryMethod,
  onTriggerUpdateEmail,
  paymentUpdateLoading,
  paymentUpdateMessage,
  paymentCooldownUntil,
}: PaymentCardSectionProps) {
  const pm = primaryMethod;
  const brand = (pm.brand || '').toLowerCase();
  const brandLabel = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Card';
  const last4 = pm.lastDigits != null ? String(pm.lastDigits).slice(-4) : '••••';
  const y = pm.expiryYear != null ? (pm.expiryYear < 100 ? 2000 + pm.expiryYear : pm.expiryYear) : null;
  const expiry = pm.expiryMonth != null && y != null
    ? `${String(pm.expiryMonth).padStart(2, '0')} / ${String(y).slice(-2)}`
    : '-- / --';
  const cardStatus = pm.status === 'expiring_soon' ? 'expiring_soon' : pm.status === 'expired' ? 'expired' : 'safe';

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      {/* Card mockup */}
      <div className={`relative p-5 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden text-white select-none w-full sm:w-80 flex-shrink-0 ${
        cardStatus === 'expired'
          ? 'bg-red-900'
          : cardStatus === 'expiring_soon'
          ? 'bg-amber-800'
          : 'bg-[var(--brand-navy)]'
      }`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-6 w-36 h-36 bg-white/5 pointer-events-none" />

        {/* Top row: chip + brand */}
        <div className="flex items-start justify-between mb-6">
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0.5" y="0.5" width="33" height="25" rx="3.5" fill="#D4A84B" stroke="#B8902F"/>
            <line x1="11" y1="1" x2="11" y2="25" stroke="#B8902F" strokeWidth="0.8"/>
            <line x1="23" y1="1" x2="23" y2="25" stroke="#B8902F" strokeWidth="0.8"/>
            <line x1="1" y1="9" x2="33" y2="9" stroke="#B8902F" strokeWidth="0.8"/>
            <line x1="1" y1="17" x2="33" y2="17" stroke="#B8902F" strokeWidth="0.8"/>
            <rect x="11" y="9" width="12" height="8" rx="1" fill="#C49A30" stroke="#B8902F" strokeWidth="0.5"/>
          </svg>
          <span className="text-white/90 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums">{brandLabel}</span>
        </div>

        {/* Card number */}
        <p className="font-mono text-base tracking-[0.2em] text-white mb-5 tabular-nums">
          ···· ···· ···· {last4}
        </p>

        {/* Bottom row: expiry + status badge */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums mb-0.5">Expires</p>
            <p className="font-mono text-sm text-white tabular-nums">{expiry}</p>
          </div>
          {cardStatus === 'safe' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums text-green-300">Active</span>
            </span>
          )}
          {cardStatus === 'expiring_soon' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums text-amber-200">Expiring soon</span>
            </span>
          )}
          {cardStatus === 'expired' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/20 border border-red-300/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums text-red-200">Expired</span>
            </span>
          )}
        </div>
      </div>

      {/* Update action / feedback */}
      <div className="flex flex-col justify-center gap-2">
        {paymentUpdateMessage != null && !paymentUpdateMessage.includes('support') ? (
          <p className="text-sm text-green-700">{paymentUpdateMessage}</p>
        ) : onTriggerUpdateEmail ? (
          <button
            type="button"
            onClick={() => onTriggerUpdateEmail(primaryMethod.id)}
            disabled={paymentUpdateLoading || Date.now() < (paymentCooldownUntil ?? 0)}
            className="rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold px-4 py-2 hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
          >
            {paymentUpdateLoading ? (
              <>
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Update payment method
              </>
            )}
          </button>
        ) : null}
        {paymentUpdateMessage != null && paymentUpdateMessage.includes('support') && (
          <p className="text-sm text-red-600">{paymentUpdateMessage}</p>
        )}
      </div>
    </div>
  );
}
