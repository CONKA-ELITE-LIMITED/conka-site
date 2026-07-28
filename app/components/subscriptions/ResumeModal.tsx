'use client';

import { useState } from 'react';
import type { SubscriptionInterval } from '@/app/types';

/** Minimum lead time in days for "resume now" — same as RescheduleModal */
const RESUME_NOW_LEAD_DAYS = 3;

function intervalToLabel(interval?: SubscriptionInterval): string {
  if (!interval) return 'billing cycle';
  switch (interval.unit) {
    case 'week':
      return interval.value === 1 ? 'week' : `${interval.value} weeks`;
    case 'month':
      return interval.value === 1 ? 'month' : `${interval.value} months`;
    case 'year':
      return interval.value === 1 ? 'year' : `${interval.value} years`;
    case 'day':
      return interval.value === 1 ? 'day' : `${interval.value} days`;
    default:
      return 'billing cycle';
  }
}

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Resume and optionally reschedule. If resumeNowEpoch is provided, the backend will reschedule after resuming. */
  onResume: (resumeNowEpoch?: number) => Promise<boolean>;
  subscriptionName: string;
  /** The currently scheduled next billing date (while paused) */
  currentNextBillingDate?: string;
  /** The subscription's billing interval */
  interval?: SubscriptionInterval;
}

type ResumeOption = 'now' | 'scheduled';

export function ResumeModal({
  isOpen,
  onClose,
  onResume,
  subscriptionName,
  currentNextBillingDate,
  interval,
}: ResumeModalProps) {
  const [selected, setSelected] = useState<ResumeOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // "Resume now" date: today + lead time + one billing interval
  const resumeNowDate = new Date();
  resumeNowDate.setDate(resumeNowDate.getDate() + RESUME_NOW_LEAD_DAYS);

  const resumeNowFormatted = resumeNowDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Current scheduled date (from the paused subscription)
  const scheduledDate = currentNextBillingDate
    ? new Date(currentNextBillingDate)
    : null;

  const scheduledDateFormatted = scheduledDate
    ? scheduledDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // If the scheduled date is already close (within lead time + 1 day), no point offering "resume now"
  const scheduledIsClose = scheduledDate
    ? scheduledDate.getTime() <= resumeNowDate.getTime() + 24 * 60 * 60 * 1000
    : false;

  // Effective selection: if only one option is visible, treat it as selected
  const effectiveSelected = scheduledIsClose && !selected ? 'scheduled' : selected;

  const handleConfirm = async () => {
    if (!effectiveSelected) return;
    setLoading(true);
    setError(null);

    try {
      let success: boolean;

      if (effectiveSelected === 'now') {
        // Resume + reschedule to near date
        const epoch = Math.floor(resumeNowDate.getTime() / 1000);
        success = await onResume(epoch);
      } else {
        // Resume with existing scheduled date
        success = await onResume();
      }

      if (success) {
        handleClose();
      } else {
        setError('Unable to resume your subscription right now. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelected(null);
    setError(null);
    onClose();
  };

  const intervalLabel = intervalToLabel(interval);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Resume Subscription</h2>
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
            When would you like your deliveries to restart?
          </p>

          <div className="space-y-2">
            {/* Option 1: Resume now */}
            {!scheduledIsClose && (
              <label
                className={`flex items-start p-4 border rounded-md cursor-pointer transition-colors ${
                  selected === 'now'
                    ? 'border-[var(--brand-navy)] bg-[var(--brand-navy)]/5'
                    : 'border-black/10 hover:border-black/40'
                }`}
              >
                <input
                  type="radio"
                  name="resume-option"
                  value="now"
                  checked={selected === 'now'}
                  onChange={() => setSelected('now')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                  selected === 'now'
                    ? 'border-[var(--brand-navy)]'
                    : 'border-black/20'
                }`}>
                  {selected === 'now' && (
                    <div className="w-2 h-2 rounded-full bg-[var(--brand-navy)]" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-black block">Resume now</span>
                  <span className="text-[13px] text-black/50 tabular-nums mt-0.5 block">
                    Next delivery around {resumeNowFormatted}, then every {intervalLabel}
                  </span>
                </div>
              </label>
            )}

            {/* Option 2: Keep scheduled date */}
            {scheduledDateFormatted && (
              <label
                className={`flex items-start p-4 border rounded-md cursor-pointer transition-colors ${
                  effectiveSelected === 'scheduled'
                    ? 'border-[var(--brand-navy)] bg-[var(--brand-navy)]/5'
                    : 'border-black/10 hover:border-black/40'
                }`}
              >
                <input
                  type="radio"
                  name="resume-option"
                  value="scheduled"
                  checked={selected === 'scheduled'}
                  onChange={() => setSelected('scheduled')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                  effectiveSelected === 'scheduled'
                    ? 'border-[var(--brand-navy)]'
                    : 'border-black/20'
                }`}>
                  {effectiveSelected === 'scheduled' && (
                    <div className="w-2 h-2 rounded-full bg-[var(--brand-navy)]" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-black block">Resume on scheduled date</span>
                  <span className="text-[13px] text-black/50 tabular-nums mt-0.5 block">
                    Next delivery on {scheduledDateFormatted}
                  </span>
                </div>
              </label>
            )}
          </div>

          <p className="text-[13px] text-black/50 mt-4">
            You can always reschedule your next delivery after resuming.
          </p>

          <div className="flex gap-2 pt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              Stay Paused
            </button>
            <button
              onClick={handleConfirm}
              disabled={effectiveSelected == null || loading}
              className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resuming...
                </span>
              ) : (
                'Resume Subscription'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
