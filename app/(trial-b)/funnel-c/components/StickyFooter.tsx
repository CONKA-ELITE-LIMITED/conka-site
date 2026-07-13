"use client";

/**
 * funnel-c — persistent sticky footer.
 *
 * One primary action, full width. A back arrow appears only once there is
 * somewhere to go back to.
 *
 * There is deliberately NO forward arrow: it did exactly what the CTA does, and
 * two controls for one action is noise on the most important surface of the page.
 */

interface StickyFooterProps {
  /** Action label, e.g. "Review my order". */
  label: string;
  /** Live "CONKA Flow · £39.99/mo" shown inside the CTA. Empty on step 1. */
  priceLabel?: string;
  /** Short price ("£39.99/mo") shown inside the CTA on mobile. */
  priceShort?: string;
  isSubscription: boolean;
  onCta: () => void;
  onBack: () => void;
  canBack: boolean;
  loading?: boolean;
  error?: string | null;
}

function BackArrow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous step"
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 hover:border-black/40 hover:text-black transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

/** The reassurance line from /start-b. Same green tick, same words. */
function GuaranteeLine({ isSubscription }: { isSubscription: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-black/60">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
        <circle cx="12" cy="12" r="10" fill="#10B981" />
        <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      100-day guarantee
      {isSubscription && <span className="hidden sm:inline">· Free UK shipping · Cancel anytime</span>}
    </span>
  );
}

export default function StickyFooter({
  label,
  priceLabel,
  priceShort,
  isSubscription,
  onCta,
  onBack,
  canBack,
  loading = false,
  error = null,
}: StickyFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-sm">
      {error && (
        <p className="text-center text-[13px] text-[#b42318] pt-2" role="alert">
          {error}
        </p>
      )}

      <div className="mx-auto w-full max-w-[560px] px-5 py-3 lg:max-w-none lg:px-12">
        <div className="flex items-center gap-3">
          {canBack && <BackArrow onClick={onBack} />}

          {/* One full-width pill, the same shape as every /start-b CTA. It takes
              the whole remaining row so it reads as THE action, not one control
              among several. */}
          <button
            type="button"
            onClick={onCta}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#1B2757] text-white py-4 px-5 font-semibold text-[16px] lg:text-lg hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden />
            )}
            <span>{label}</span>
            {priceLabel && (
              <span className="font-medium text-white/85 tabular-nums">
                <span className="sm:hidden">· {priceShort}</span>
                <span className="hidden sm:inline">· {priceLabel}</span>
              </span>
            )}
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Risk reversal only once there is a price on screen to reverse. On the
            Learn step there is nothing to be reassured about yet, and it just
            adds a line of noise under the only button. */}
        {priceLabel && (
          <div className="mt-2.5 flex justify-center">
            <GuaranteeLine isSubscription={isSubscription} />
          </div>
        )}
      </div>
    </div>
  );
}
