import Image from "next/image";

/* ============================================================================
 * The step-banner visuals shared by /app "Baseline. CONKA. Retest."
 * (AppV2Loop) and /app-insights "How we know" (InsightHowWeKnow), in the app
 * store assets' tile language. Each fills a `relative` banner:
 * - PhoneScreen: a CSS-framed capture the banner crops at its bottom edge;
 * - StatTile: the one floating outcome tile on a phone banner;
 * - Bottles: Flow and Clear as two tilted bottle tiles with when to take them.
 * Screens are the store pipeline's raw captures (conkaApp
 * design/app-store/captures) and the bottles its renders, all small webps.
 * ========================================================================== */

/** The outcome tile: a big value over a short label, or a check and a
 *  single line when the step's outcome is done rather than a number. */
export type LoopStat =
  | { value: string; label: string; positive?: boolean }
  | { check: string };

const BOTTLES = [
  {
    src: "/app/AppFlowBottle.webp",
    alt: "A bottle of CONKA Flow",
    name: "CONKA Flow",
    when: "Morning",
    className: "-rotate-6 translate-y-2",
  },
  {
    src: "/app/AppClearBottle.webp",
    alt: "A bottle of CONKA Clear",
    name: "CONKA Clear",
    when: "Afternoon",
    className: "rotate-6 -translate-y-1",
  },
];

export function PhoneScreen({ src, alt }: { src: string; alt: string }) {
  return (
    // The banner crops the phone at its bottom edge, so the screen reads as
    // carrying on rather than ending.
    <div className="absolute left-[54%] top-8 w-[46%] max-w-[220px] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border-[5px] border-[#0d0e10] bg-[#0d0e10] shadow-2xl">
      <Image
        src={src}
        alt={alt}
        width={720}
        height={1200}
        loading="lazy"
        sizes="(min-width: 1024px) 220px, 46vw"
        className="h-auto w-full"
      />
    </div>
  );
}

export function StatTile({ stat }: { stat: LoopStat }) {
  const tile =
    "absolute bottom-4 left-3 rounded-lg bg-white px-3.5 py-2.5 text-left app-tile-shadow-sm lg:left-4";

  if ("check" in stat) {
    return (
      <div className={`${tile} flex items-center gap-2.5`}>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-positive)] text-white"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-base font-bold leading-none text-[var(--brand-navy)]">
          {stat.check}
        </p>
      </div>
    );
  }

  return (
    <div className={tile}>
      <p
        className={`text-xl font-bold leading-none tracking-tight lg:text-2xl ${
          stat.positive
            ? "text-[var(--brand-positive)]"
            : "text-[var(--brand-navy)]"
        }`}
      >
        {stat.value}
      </p>
      <p className="mt-1 text-xs font-medium text-black/60">{stat.label}</p>
    </div>
  );
}

export function Bottles() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
      {BOTTLES.map((bottle) => (
        <figure
          key={bottle.name}
          className={`w-[38%] max-w-[170px] rounded-lg bg-white p-[3%] pb-3 app-tile-shadow ${bottle.className}`}
        >
          <Image
            src={bottle.src}
            alt={bottle.alt}
            width={480}
            height={480}
            loading="lazy"
            sizes="(min-width: 1024px) 160px, 36vw"
            className="aspect-square w-full rounded-md object-cover"
          />
          <figcaption className="mt-2 px-1">
            <span className="block text-sm font-bold leading-tight text-[var(--brand-navy)]">
              {bottle.name}
            </span>
            <span className="mt-1 inline-block rounded-full bg-[var(--brand-navy)] px-2.5 py-0.5 text-xs font-semibold text-white">
              {bottle.when}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
