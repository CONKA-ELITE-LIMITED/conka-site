'use client';

import { useState } from 'react';
import type { SubscriptionInterval } from '@/app/types';

/** Max number of billing cycles a customer can pause for */
const MAX_CYCLES = 3;

/**
 * Build pause options based on the subscription's billing interval.
 * Returns 1–3 cycle options with weeks and human-readable labels.
 */
function buildPauseOptions(interval?: SubscriptionInterval) {
  // Default to monthly if no interval provided
  const unit = interval?.unit ?? 'month';
  const value = interval?.value ?? 1;

  const options: Array<{ weeks: number; label: string }> = [];

  for (let cycles = 1; cycles <= MAX_CYCLES; cycles++) {
    let weeks: number;
    let label: string;

    switch (unit) {
      case 'week': {
        weeks = value * cycles;
        label = weeks === 1 ? '1 week' : `${weeks} weeks`;
        break;
      }
      case 'month': {
        const months = value * cycles;
        weeks = months * 4; // approximate for the route's conversion
        label = months === 1 ? '1 month' : `${months} months`;
        break;
      }
      case 'year': {
        const years = value * cycles;
        weeks = years * 52;
        label = years === 1 ? '1 year' : `${years} years`;
        break;
      }
      case 'day': {
        const days = value * cycles;
        weeks = Math.max(1, Math.round(days / 7));
        label = days === 1 ? '1 day' : `${days} days`;
        break;
      }
      default: {
        weeks = 4 * cycles;
        label = cycles === 1 ? '1 month' : `${cycles} months`;
      }
    }

    options.push({ weeks, label });
  }

  return options;
}

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPause: (weeks: number) => Promise<boolean>;
  subscriptionName: string;
  /** The subscription's billing interval — used to generate cycle-based pause options */
  interval?: SubscriptionInterval;
}

export function PauseModal({
  isOpen,
  onClose,
  onPause,
  subscriptionName,
  interval,
}: PauseModalProps) {
  const [selectedWeeks, setSelectedWeeks] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const pauseOptions = buildPauseOptions(interval);
  const maxWeeks = pauseOptions[pauseOptions.length - 1]?.weeks ?? 12;

  const handleConfirm = async () => {
    if (selectedWeeks == null) return;
    setLoading(true);
    setError(null);

    try {
      const success = await onPause(selectedWeeks);
      if (success) {
        handleClose();
      } else {
        setError('Unable to pause your subscription right now. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedWeeks(null);
    setError(null);
    onClose();
  };

  const resumeDate = selectedWeeks
    ? new Date(Date.now() + selectedWeeks * 7 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Pause Subscription</h2>
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

          <p className="text-sm text-black/60 mb-4">
            How long would you like to pause? Your subscription will automatically resume after the selected period.
          </p>

          <div className="space-y-2">
            {pauseOptions.map((option, idx) => (
              <label
                key={option.weeks}
                className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedWeeks === option.weeks
                    ? 'border-[var(--brand-navy)] bg-[var(--brand-navy)]/5'
                    : 'border-black/10 hover:border-black/40'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="pause-duration"
                    value={option.weeks}
                    checked={selectedWeeks === option.weeks}
                    onChange={() => setSelectedWeeks(option.weeks)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedWeeks === option.weeks
                      ? 'border-[var(--brand-navy)]'
                      : 'border-black/20'
                  }`}>
                    {selectedWeeks === option.weeks && (
                      <div className="w-2 h-2 rounded-full bg-[var(--brand-navy)]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-black">
                    {option.label}
                    <span className="text-black/50 font-normal ml-1.5 tabular-nums">
                      ({idx + 1} {idx === 0 ? 'delivery cycle' : 'delivery cycles'})
                    </span>
                  </span>
                </div>
                {option.weeks === maxWeeks && (
                  <span className="text-[13px] font-medium text-black/40">Maximum</span>
                )}
              </label>
            ))}
          </div>

          {selectedWeeks != null && resumeDate && (
            <div className="mt-4 p-3 bg-[#f5f5f5] border border-black/10 rounded-md">
              <p className="text-sm text-black">
                Your deliveries will resume around{' '}
                <span className="font-semibold tabular-nums">
                  {resumeDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                . You can resume earlier at any time.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              Keep Active
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedWeeks == null || loading}
              className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Pausing...
                </span>
              ) : (
                'Pause Subscription'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
