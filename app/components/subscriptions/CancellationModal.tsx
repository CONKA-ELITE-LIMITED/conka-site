'use client';

import { useState } from 'react';

// Cancellation reasons
const CANCELLATION_REASONS = [
  { id: 'too_expensive', label: 'Too expensive' },
  { id: 'not_seeing_results', label: 'Not seeing results' },
  { id: 'too_frequent', label: 'Deliveries too frequent' },
  { id: 'too_infrequent', label: 'Deliveries too infrequent' },
  { id: 'switching_product', label: 'Switching to a different product' },
  { id: 'no_longer_needed', label: 'No longer needed' },
  { id: 'other', label: 'Other reason' },
] as const;

// Retention suggestions mapped to cancellation reasons
const RETENTION_OFFERS: Record<string, {
  title: string;
  description: string;
  actionLabel: string;
  actionType: 'pause' | 'edit' | 'reschedule' | 'discount';
}> = {
  too_expensive: {
    title: 'How about 15% off?',
    description: 'We\'d love you to stay. We can give you 15% off your next 3 deliveries — no strings attached.',
    actionLabel: 'Yes, apply 15% off',
    actionType: 'discount',
  },
  not_seeing_results: {
    title: 'Take a break instead?',
    description: 'Pausing your subscription lets you take a break without losing your plan. You can resume anytime — no need to set up a new subscription.',
    actionLabel: 'Pause instead',
    actionType: 'pause',
  },
  too_frequent: {
    title: 'Adjust your delivery schedule?',
    description: 'You can switch to a less frequent delivery — bi-weekly or monthly — so you only get what you need.',
    actionLabel: 'Change my plan',
    actionType: 'edit',
  },
  too_infrequent: {
    title: 'Get deliveries more often?',
    description: 'You can switch to weekly or bi-weekly deliveries so you never run out.',
    actionLabel: 'Change my plan',
    actionType: 'edit',
  },
  no_longer_needed: {
    title: 'Pause for a while instead?',
    description: 'If you might want to come back later, pausing keeps your subscription ready. Resume whenever you like.',
    actionLabel: 'Pause instead',
    actionType: 'pause',
  },
};

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: string, comment?: string) => Promise<boolean>;
  subscriptionName: string;
  currentPlan?: string;
  /** Called when user chooses "pause instead" from retention step */
  onPauseInstead?: () => void;
  /** Called when user chooses "edit plan" from retention step */
  onEditInstead?: () => void;
  /** Called when user accepts the retention discount offer */
  onApplyDiscount?: (code: string) => Promise<{ success: boolean; message: string }>;
}

type Step = 'reason' | 'retention' | 'confirm';

export function CancellationModal({
  isOpen,
  onClose,
  onCancel,
  subscriptionName,
  currentPlan: _currentPlan,
  onPauseInstead,
  onEditInstead,
  onApplyDiscount,
}: CancellationModalProps) {
  const [step, setStep] = useState<Step>('reason');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  if (!isOpen) return null;

  const retentionOffer = RETENTION_OFFERS[selectedReason];

  const handleReasonSubmit = () => {
    if (!selectedReason) return;
    // Show retention step if there's a relevant offer, otherwise go straight to confirm
    if (retentionOffer) {
      setStep('retention');
    } else {
      setStep('confirm');
    }
  };

  const handleRetentionAction = async () => {
    if (!retentionOffer) return;

    if (retentionOffer.actionType === 'discount' && onApplyDiscount) {
      setDiscountLoading(true);
      setError(null);
      try {
        const result = await onApplyDiscount('RETENTION15');
        if (result.success) {
          handleClose();
        } else {
          setError(result.message || 'Could not apply discount. You can try again or continue cancelling.');
        }
      } catch {
        setError('Something went wrong. You can try again or continue cancelling.');
      } finally {
        setDiscountLoading(false);
      }
      return;
    }

    handleClose();
    if (retentionOffer.actionType === 'pause' && onPauseInstead) {
      onPauseInstead();
    } else if ((retentionOffer.actionType === 'edit' || retentionOffer.actionType === 'reschedule') && onEditInstead) {
      onEditInstead();
    }
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await onCancel(selectedReason, comment);
      if (success) {
        onClose();
      } else {
        setError('Failed to cancel subscription. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('reason');
    setSelectedReason('');
    setComment('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-black/12 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>
              {step === 'reason' && 'Cancel Subscription'}
              {step === 'retention' && 'Before you go'}
              {step === 'confirm' && 'Confirm Cancellation'}
            </h2>
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
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-1">{subscriptionName}</p>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50/50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Reason Selection */}
          {step === 'reason' && (
            <div className="space-y-4">
              <p className="text-sm text-black/60">
                We&apos;re sorry to see you go. Please let us know why you&apos;re cancelling:
              </p>

              <div className="space-y-2">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-center p-3 border cursor-pointer transition-colors ${
                      selectedReason === reason.id
                        ? 'border-[#1B2757] bg-[#1B2757]/5'
                        : 'border-black/12 hover:border-black/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 mr-3 flex items-center justify-center ${
                      selectedReason === reason.id
                        ? 'border-[#1B2757]'
                        : 'border-black/20'
                    }`}>
                      {selectedReason === reason.id && (
                        <div className="w-2 h-2 bg-[#1B2757]" />
                      )}
                    </div>
                    <span className="text-sm text-black">{reason.label}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'other' && (
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Please tell us more..."
                  className="w-full p-3 border border-black/12 bg-white text-black text-sm resize-none focus:outline-none focus:border-[#1B2757]"
                  rows={3}
                />
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border border-black/12 hover:border-black/40 text-black font-mono text-[10px] uppercase tracking-[0.16em] transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleReasonSubmit}
                  disabled={!selectedReason}
                  className="flex-1 py-3 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Retention Offer */}
          {step === 'retention' && retentionOffer && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-16 h-16 bg-[#f5f5f5] border border-black/12 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-black/40">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>{retentionOffer.title}</h3>
                <p className="text-sm text-black/60 mt-2">
                  {retentionOffer.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {(onPauseInstead || onEditInstead || (retentionOffer.actionType === 'discount' && onApplyDiscount)) && (
                  <button
                    onClick={handleRetentionAction}
                    disabled={discountLoading}
                    className="w-full py-3 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {discountLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Applying discount...
                      </span>
                    ) : (
                      retentionOffer.actionLabel
                    )}
                  </button>
                )}
                <button
                  onClick={() => setStep('confirm')}
                  disabled={discountLoading}
                  className="w-full py-3 border border-black/12 hover:border-black/40 text-black font-mono text-[10px] uppercase tracking-[0.16em] transition-colors disabled:opacity-50"
                >
                  I still want to cancel
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-black/40 hover:text-black transition-colors"
                >
                  Never mind, keep my subscription
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50/50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-red-600">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>Are you sure?</h3>
                <p className="text-sm text-black/60 mt-1">
                  This will cancel your subscription immediately. You won&apos;t receive any more deliveries.
                </p>
              </div>

              <div className="bg-[#f5f5f5] border border-black/12 p-4">
                <div className="text-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">Cancellation reason</div>
                  <div className="text-black">
                    {CANCELLATION_REASONS.find(r => r.id === selectedReason)?.label}
                  </div>
                  {comment && (
                    <div className="text-black/60 mt-1 italic">&quot;{comment}&quot;</div>
                  )}
                </div>
              </div>

              <div className="border border-[#1B2757]/20 bg-[#1B2757]/5 p-4">
                <p className="text-sm text-[#1B2757]">
                  You can reactivate your subscription at any time from your account page.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setStep(retentionOffer ? 'retention' : 'reason')}
                  disabled={loading}
                  className="flex-1 py-3 border border-black/12 hover:border-black/40 text-black font-mono text-[10px] uppercase tracking-[0.16em] transition-colors disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={loading}
                  className="flex-1 py-3 bg-red-600 text-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cancelling...
                    </span>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
