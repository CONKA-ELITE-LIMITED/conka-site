'use client';

import { useState } from 'react';

type SkipChoice = 'skip-next' | 'reschedule-15';

interface SkipModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Skip the next order entirely (delivery resumes on the following cycle). */
  onSkipNext: () => Promise<boolean>;
  /** Push the next delivery to a new date (epoch seconds). */
  onReschedule: (newBillingDateEpoch: number) => Promise<boolean>;
  /** Open the pause flow instead (for longer breaks). */
  onPauseInstead: () => void;
  subscriptionName: string;
  /** Delivery-rhythm label for the summary card, e.g. "Every month". */
  cadenceHeroLabel: string;
  price: number;
  /** ISO date of the current next billing date (basis for the 15-day push). */
  currentNextBillingDate?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function SkipModal({
  isOpen,
  onClose,
  onSkipNext,
  onReschedule,
  onPauseInstead,
  subscriptionName,
  cadenceHeroLabel,
  price,
  currentNextBillingDate,
}: SkipModalProps) {
  const [choice, setChoice] = useState<SkipChoice>('skip-next');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseDate = currentNextBillingDate ? new Date(currentNextBillingDate) : null;
  const pushedDate =
    baseDate && !isNaN(baseDate.getTime()) ? new Date(baseDate.getTime() + 15 * DAY_MS) : null;

  const options: Array<{ value: SkipChoice; label: string; sub: string }> = [
    {
      value: 'skip-next',
      label: 'Skip this delivery',
      sub: 'Your next order is skipped. Billing resumes on the following cycle.',
    },
    {
      value: 'reschedule-15',
      label: 'Push it back 15 days',
      sub: pushedDate
        ? `Your next delivery moves to ${pushedDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          })}.`
        : 'Delay your next delivery by 15 days.',
    },
  ];

  const handleClose = () => {
    setChoice('skip-next');
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      let success = false;
      if (choice === 'skip-next') {
        success = await onSkipNext();
      } else if (pushedDate) {
        success = await onReschedule(Math.floor(pushedDate.getTime() / 1000));
      }
      if (success) {
        handleClose();
      } else {
        setError('Unable to update your next delivery right now. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>
              Skip next order
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-[#f5f5f5] transition-colors">
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

          {/* Summary of the delivery being skipped */}
          <div className="mb-4 flex items-center justify-between p-3 bg-[#f5f5f5] border border-black/10 rounded-md">
            <span className="text-sm font-semibold text-black" style={{ letterSpacing: '-0.01em' }}>
              {cadenceHeroLabel}
            </span>
            <span className="text-sm font-semibold text-black tabular-nums">£{price.toFixed(2)}</span>
          </div>

          <p className="text-sm text-black/60 mb-4">
            Not ready for your next delivery? Choose what works.
          </p>

          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
                  choice === option.value
                    ? 'border-[var(--brand-navy)] bg-[var(--brand-navy)]/5'
                    : 'border-black/10 hover:border-black/40'
                }`}
              >
                <input
                  type="radio"
                  name="skip-choice"
                  value={option.value}
                  checked={choice === option.value}
                  onChange={() => setChoice(option.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 shrink-0 flex items-center justify-center ${
                    choice === option.value ? 'border-[var(--brand-navy)]' : 'border-black/20'
                  }`}
                >
                  {choice === option.value && (
                    <div className="w-2 h-2 rounded-full bg-[var(--brand-navy)]" />
                  )}
                </div>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-black">{option.label}</span>
                  <span className="block text-[13px] text-black/50 mt-0.5">{option.sub}</span>
                </span>
              </label>
            ))}
          </div>

          <p className="text-sm text-black/60 mt-4">
            Need a longer break?{' '}
            <button
              type="button"
              onClick={() => {
                handleClose();
                onPauseInstead();
              }}
              className="font-semibold text-[var(--brand-navy)] hover:underline"
            >
              Pause your subscription
            </button>{' '}
            instead.
          </p>

          <div className="flex gap-2 pt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Working...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
