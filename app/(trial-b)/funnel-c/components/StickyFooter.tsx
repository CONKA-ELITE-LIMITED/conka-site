"use client";

/**
 * funnel-c — persistent sticky footer.
 *
 * Left: back / forward step nav. Right (and right-aligned on every screen):
 * the trust strip + a single contained CTA that carries the live product +
 * price inside it. Free shipping only shows for subscriptions.
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
  onForward: () => void;
  canBack: boolean;
  canForward: boolean;
  loading?: boolean;
  error?: string | null;
}

function NavArrow({ dir, onClick, disabled }: { dir: "back" | "forward"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "back" ? "Previous step" : "Next step"}
      className="flex h-11 w-11 items-center justify-center border-2 border-black/15 text-black/60 hover:border-black/35 hover:text-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === "back" ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

export default function StickyFooter({
  label,
  priceLabel,
  priceShort,
  isSubscription,
  onCta,
  onBack,
  onForward,
  canBack,
  canForward,
  loading = false,
  error = null,
}: StickyFooterProps) {
  const trust = ["100-day guarantee", ...(isSubscription ? ["Free shipping"] : []), "Cancel anytime"];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-sm">
      {error && (
        <p className="text-center text-[13px] text-[#b42318] pt-2" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 px-4 lg:px-12 py-3">
        {/* Left — step navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <NavArrow dir="back" onClick={onBack} disabled={!canBack} />
          <NavArrow dir="forward" onClick={onForward} disabled={!canForward} />
        </div>

        {/* Right — trust + CTA (CTA always hard right) */}
        <div className="flex items-center gap-5 min-w-0">
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {trust.map((t) => (
              <span key={t} className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40">
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onCta}
            disabled={loading}
            className="flex items-center gap-2.5 bg-[#1B2757] text-white pl-5 pr-4 py-3.5 lg:pl-6 lg:pr-5 lg:gap-3 hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden />
            )}
            <span className="text-sm lg:text-[15px] font-semibold tracking-[0.01em]">{label}</span>
            {priceLabel && (
              <span className="flex items-center gap-2.5 lg:gap-3">
                <span className="h-4 w-px bg-white/25" aria-hidden />
                <span className="text-[13px] lg:text-[14px] font-medium text-white/90 tabular-nums">
                  <span className="sm:hidden">{priceShort}</span>
                  <span className="hidden sm:inline">{priceLabel}</span>
                </span>
              </span>
            )}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="ml-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
