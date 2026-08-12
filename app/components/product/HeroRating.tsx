/**
 * HeroRating — Magic Mind-style rating block for the Simple DTC PDP heroes
 * (ProductHeroV3 desktop + ProductHeroMobileV3): subscriber count on top, then
 * large navy stars filled to the actual rating with a smaller number +
 * parenthetical review count. Solid black, left-aligned.
 */

const RATING = 4.7;

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** Five stars filled to `RATING/5` via a clipped navy overlay on a grey base. */
function Stars() {
  const pct = (RATING / 5) * 100;
  const row = (className: string) => (
    <span className={`flex ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${RATING} out of 5 stars`}
    >
      {row("text-black/15")}
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-[#1B2757]"
        style={{ width: `${pct}%` }}
      >
        {row("")}
      </span>
    </span>
  );
}

export default function HeroRating() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-black">5,000+ subscribers</span>
      <div className="flex items-center gap-2">
        <Stars />
        <span className="text-sm font-bold text-black">
          {RATING} <span className="font-medium text-black/60">(622 reviews)</span>
        </span>
      </div>
    </div>
  );
}
