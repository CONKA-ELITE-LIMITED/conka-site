'use client';

import { useState } from 'react';

interface ReactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReactivate: () => Promise<boolean>;
  subscriptionName: string;
}

export function ReactivateModal({
  isOpen,
  onClose,
  onReactivate,
  subscriptionName,
}: ReactivateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await onReactivate();
      if (success) {
        handleClose();
      } else {
        setError('Unable to reactivate your subscription. The product may no longer be available — please contact support or start a new subscription.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Reactivate Subscription</h2>
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

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#f5f5f5] border border-black/10 rounded-md flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-black/40">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </div>
            <h3 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Restart your subscription?</h3>
            <p className="text-sm text-black/60 mt-2">
              Your subscription will be reactivated and deliveries will resume on the original schedule. You&apos;ll be billed on the next scheduled billing date.
            </p>
          </div>

          <div className="bg-[#f5f5f5] border border-black/10 rounded-md p-4 mb-6">
            <p className="text-sm text-black/60">
              After reactivating, you can adjust your plan, delivery schedule, or pause again at any time from your subscriptions page.
            </p>
          </div>

          <div className="flex gap-2">
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
                  Reactivating...
                </span>
              ) : (
                'Reactivate Subscription'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
