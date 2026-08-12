/**
 * HeroRating — Magic Mind-style rating block for the Simple DTC PDP heroes
 * (ProductHeroV3 desktop + ProductHeroMobileV3): subscriber count on top, then
 * navy stars with a parenthetical review count. Solid black, left-aligned.
 */
export default function HeroRating() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-black">5,000+ subscribers</span>
      <div className="flex items-center gap-2.5">
        <div className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1B2757]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-lg font-bold text-black">
          4.7 <span className="font-semibold text-black/70">(622 reviews)</span>
        </span>
      </div>
    </div>
  );
}
