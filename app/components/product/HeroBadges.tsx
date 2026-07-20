/**
 * Shared Magic Mind-style hero pills used on both the desktop (ProductHeroV2)
 * and mobile (ProductHeroMobileV2) PDP heroes. Kept in one place so the two
 * surfaces stay in step. Pass `className` to control alignment (mobile centres
 * with `mx-auto`; the desktop left column leaves them left-aligned).
 */

/** Product spec pill (caffeine / timing). Placeholder values for the Flow test. */
export function SpecBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-[#dbe0f0] to-[#eef1f8] px-4 py-2 font-mono text-sm font-bold uppercase tracking-wide text-black ${className}`}
    >
      0mg caffeine | morning ritual
    </span>
  );
}

/** Live-viewer style social-proof pill (Magic Mind pattern, our fonts + gradient). */
export function SocialProofBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e7eaf4] to-[#f6f7fb] px-4 py-2 text-sm font-semibold text-black ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 13C6.6 5 17.4 5 21 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3" fill="currentColor" />
      </svg>
      100+ others exploring focus
    </span>
  );
}
