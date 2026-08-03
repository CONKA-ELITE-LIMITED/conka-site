'use client';

import { useState } from 'react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Skip the next order (billing resumes on the following cycle). */
  onSkip: () => Promise<boolean>;
  /** Open the date picker to move the next delivery. */
  onChooseDate: () => void;
  /** Open the "order now" confirmation (places an order + charges). */
  onOrderNow: () => void;
  /** False when an order is already being prepared. */
  canOrderNow: boolean;
  subscriptionName: string;
  cadenceHeroLabel: string;
  nextDate?: string;
  price: number;
}

function formatShort(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export function DeliveryModal({
  isOpen,
  onClose,
  onSkip,
  onChooseDate,
  onOrderNow,
  canOrderNow,
  subscriptionName,
  cadenceHeroLabel,
  nextDate,
  price,
}: DeliveryModalProps) {
  const [skipping, setSkipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextLabel = formatShort(nextDate);

  const handleSkip = async () => {
    setSkipping(true);
    setError(null);
    try {
      const ok = await onSkip();
      if (ok) onClose();
      else setError('Unable to skip your next order right now. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSkipping(false);
    }
  };

  const rowBase =
    'w-full text-left flex items-center gap-3 p-3.5 rounded-md border border-black/10 hover:border-black/40 transition-colors disabled:opacity-50';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white border border-black/10 rounded-t-2xl sm:rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>
              Manage delivery
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors">
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

          {/* Summary of the next delivery */}
          <div className="mb-4 flex items-center justify-between p-3 bg-[#f7f7f8] border border-black/8 rounded-md">
            <span className="text-sm text-black">
              <span className="font-semibold">{cadenceHeroLabel}</span>
              {nextLabel ? <span className="text-black/55"> · next {nextLabel}</span> : null}
            </span>
            <span className="text-sm font-semibold text-black tabular-nums">£{price.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <button type="button" onClick={onChooseDate} className={rowBase}>
              <span className="flex-1">
                <span className="block text-sm font-medium text-black">Reschedule to a new date</span>
                <span className="block text-[13px] text-black/50 mt-0.5">Move your next delivery.</span>
              </span>
              <span className="text-black/35" aria-hidden>→</span>
            </button>

            <button type="button" onClick={handleSkip} disabled={skipping} className={rowBase}>
              <span className="flex-1">
                <span className="block text-sm font-medium text-black">Skip next order</span>
                <span className="block text-[13px] text-black/50 mt-0.5">
                  Skip this one; billing resumes on the following cycle.
                </span>
              </span>
              <span className="text-black/35" aria-hidden>{skipping ? '…' : '→'}</span>
            </button>

            {canOrderNow && (
              <button type="button" onClick={onOrderNow} className={rowBase}>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-black">Order now</span>
                  <span className="block text-[13px] text-black/50 mt-0.5">
                    Get your next order now; the schedule shifts forward.
                  </span>
                </span>
                <span className="text-black/35" aria-hidden>→</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={skipping}
            className="w-full mt-4 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
