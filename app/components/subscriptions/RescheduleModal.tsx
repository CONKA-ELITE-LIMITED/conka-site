'use client';

import { useState } from 'react';
import type { SubscriptionInterval } from '@/app/types';

/** Minimum lead time in days — must match the API route's MIN_LEAD_DAYS */
const MIN_LEAD_DAYS = 3;

/** Convert a subscription interval to days (for computing the max reschedule window) */
function intervalToDays(interval?: SubscriptionInterval): number {
  if (!interval) return 30; // safe fallback
  switch (interval.unit) {
    case 'week': return interval.value * 7;
    case 'month': return interval.value * 30;
    case 'year': return interval.value * 365;
    case 'day': return interval.value;
    default: return 30;
  }
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDateEpoch: number) => Promise<boolean>;
  subscriptionName: string;
  currentNextBillingDate?: string;
  hasUnfulfilledOrder?: boolean;
  /** The subscription's billing interval — used to compute the max reschedule window */
  interval?: SubscriptionInterval;
}

function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function RescheduleModal({
  isOpen,
  onClose,
  onReschedule,
  subscriptionName,
  currentNextBillingDate,
  hasUnfulfilledOrder = false,
  interval,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Min: 3 days from now (fulfillment lead time)
  const minDateObj = new Date();
  minDateObj.setDate(minDateObj.getDate() + MIN_LEAD_DAYS);
  const minDate = formatDateForInput(minDateObj);

  // Max: one billing cycle from the current next billing date
  const cycleDays = intervalToDays(interval);
  const baseDate = currentNextBillingDate ? new Date(currentNextBillingDate) : new Date();
  const maxDateObj = new Date(baseDate);
  maxDateObj.setDate(maxDateObj.getDate() + cycleDays);
  const maxDateStr = formatDateForInput(maxDateObj);

  const currentDateFormatted = currentNextBillingDate
    ? new Date(currentNextBillingDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleConfirm = async () => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);

    // Convert selected date to epoch (start of day UTC)
    const epoch = Math.floor(new Date(selectedDate + 'T00:00:00Z').getTime() / 1000);

    try {
      const success = await onReschedule(epoch);
      if (success) {
        handleClose();
      } else {
        setError('Unable to reschedule your delivery right now. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Reschedule Delivery</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#f5f5f5] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-medium text-black/50 tabular-nums mt-1">{subscriptionName}</p>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50/50 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {hasUnfulfilledOrder && (
            <div className="mb-4 p-3 bg-[var(--brand-navy)]/5 border border-[var(--brand-navy)]/20 rounded-md">
              <p className="text-sm text-[var(--brand-navy)]">
                Your next order is already being prepared. Rescheduling will move the <strong>following</strong> delivery after that.
              </p>
            </div>
          )}

          {currentDateFormatted && (
            <p className="text-sm text-black/60 mb-2">
              Currently scheduled for <span className="font-semibold tabular-nums">{currentDateFormatted}</span>.
            </p>
          )}

          <p className="text-sm text-black/60 mb-4">
            Choose a new date within your current billing cycle.
          </p>

          <div className="space-y-3">
            <label className="block">
              <span className="text-[13px] font-medium text-black/60 mb-1 block">New delivery date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDateStr}
                className="w-full px-4 py-3 border border-black/10 rounded-md bg-white text-black text-sm focus:outline-none focus:border-[var(--brand-navy)] transition-colors"
              />
            </label>
            <p className="text-[13px] text-black/50 tabular-nums">
              Select a date at least {MIN_LEAD_DAYS} days from now, up to {cycleDays} days ahead.
            </p>
          </div>

          {selectedDate && (
            <div className="mt-4 p-3 bg-[#f5f5f5] border border-black/10 rounded-md space-y-2">
              <p className="text-sm text-black">
                Your next delivery will move to{' '}
                <span className="font-semibold tabular-nums">
                  {formatDateForDisplay(selectedDate)}
                </span>
                .
              </p>
              <p className="text-[13px] text-black/50">
                This will shift your entire delivery schedule. All future deliveries will follow from this new date.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              Keep Current Date
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || loading}
              className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Rescheduling...
                </span>
              ) : (
                'Confirm Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
