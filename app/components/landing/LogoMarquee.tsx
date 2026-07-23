/* ============================================================================
 * LogoMarquee
 *
 * Looping logo marquee, ported from the lander into our patterns: Tailwind,
 * the shared global `marquee` keyframe (translateX -50%), motion-safe so
 * reduced-motion users get a static row. Two identical groups loop seamlessly.
 * Static, no JS.
 *
 * Two variants share the same shell:
 *  - Partners (default): "Fueling High Performers at:" image logos.
 *  - Press: "As Published On:" outlet wordmarks. Pass `logos={PRESS_LOGOS}`.
 *
 * Items with a `src` render as an <img> at their natural height; items with no
 * `src` render as a text wordmark.
 * ========================================================================== */

export interface MarqueeLogo {
  /** Image path; omit to render `alt` as a text wordmark instead */
  src?: string;
  alt: string;
  /** Pixel height for image logos (natural proportions differ per logo) */
  h?: number;
}

const PARTNER_LOGOS: MarqueeLogo[] = [
  { src: "/lander/partners/bath-rugby.png", alt: "Bath Rugby", h: 52 },
  { src: "/lander/partners/southampton.png", alt: "Southampton FC", h: 54 },
  { src: "/lander/partners/england-rugby.png", alt: "England Rugby", h: 58 },
  { src: "/lander/partners/bayern.png", alt: "FC Bayern Munich", h: 52 },
  { src: "/lander/partners/team-gb.png", alt: "Team GB", h: 58 },
  { src: "/lander/partners/wales-rugby.png", alt: "Wales Rugby", h: 56 },
  { src: "/lander/partners/leeds.png", alt: "Leeds United", h: 54 },
  { src: "/lander/partners/wolves.png", alt: "Wolves", h: 48 },
  { src: "/lander/partners/f1.png", alt: "Formula 1", h: 26 },
  { src: "/lander/partners/barrys.png", alt: "Barry's", h: 22 },
  { src: "/lander/partners/army.png", alt: "British Army", h: 46 },
  { src: "/lander/partners/british-airways.png", alt: "British Airways", h: 18 },
  { src: "/lander/partners/goldman-sachs.png", alt: "Goldman Sachs", h: 36 },
  { src: "/lander/partners/equinox.png", alt: "Equinox", h: 19 },
];

/**
 * Press and journal outlets the CognICA test has appeared in.
 *
 * Sources are trimmed to their bounding box and keyed to a transparent
 * background (like the partner logos), so both bands render identically on any
 * surface. Two exceptions keep an opaque coloured fill because the colour IS
 * the mark: the Globe and Mail red slab and the Nature red banner. Per-logo `h`
 * is tuned by shape, not set to one value: these range from an 8.8:1 wordmark
 * (Globe and Mail) to a 1:1 stacked lockup (Medscape), so a single height would
 * make the wordmarks dominate and the lockups vanish. Editorial first.
 *
 * The last three are newswire and syndication rather than editorial coverage.
 * Cut them if "As Published On" should mean earned press only.
 */
export const PRESS_LOGOS: MarqueeLogo[] = [
  { src: "/lander/press/medscape.png", alt: "Medscape", h: 66 },
  { src: "/lander/press/neurology-live.png", alt: "NeurologyLive", h: 26 },
  { src: "/lander/press/mdedge.png", alt: "MDedge", h: 38 },
  { src: "/lander/press/psychiatry.png", alt: "Psychiatry", h: 36 },
  { src: "/lander/press/pharmaphorum.png", alt: "pharmaphorum", h: 30 },
  { src: "/lander/press/biospace.png", alt: "BioSpace", h: 32 },
  { src: "/lander/press/globe-and-mail.png", alt: "The Globe and Mail", h: 18 },
  {
    src: "/lander/press/nature-scientific-reports.png",
    alt: "Nature Scientific Reports",
    h: 44,
  },
  {
    src: "/lander/press/frontiers-aging-neuroscience.png",
    alt: "Frontiers in Aging Neuroscience",
    h: 42,
  },
  { src: "/lander/press/plos.png", alt: "PLOS", h: 58 },
  { src: "/lander/press/protolife.png", alt: "proto.life", h: 26 },
  { src: "/lander/press/the-deep-dive.png", alt: "The Deep Dive", h: 24 },
  { src: "/lander/press/nasdaq.png", alt: "Nasdaq", h: 30 },
  { src: "/lander/press/yahoo-finance.png", alt: "Yahoo Finance", h: 32 },
  { src: "/lander/press/newsfile.png", alt: "Newsfile", h: 36 },
];

function Group({
  logos,
  hidden = false,
}: {
  logos: MarqueeLogo[];
  hidden?: boolean;
}) {
  return (
    <div
      className="flex flex-shrink-0 items-center gap-14 pr-14 md:gap-[90px] md:pr-[90px]"
      aria-hidden={hidden || undefined}
    >
      {logos.map((l) =>
        l.src ? (
          // Decorative brand logos with varied aspect ratios; plain img keeps
          // the per-logo height + auto width without distortion.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={l.alt}
            src={l.src}
            alt={l.alt}
            loading="lazy"
            style={{ height: l.h }}
            className="w-auto flex-shrink-0"
          />
        ) : (
          <span
            key={l.alt}
            className="flex-shrink-0 whitespace-nowrap text-[19px] font-semibold tracking-[-0.01em] text-[#7c7d7c]"
          >
            {l.alt}
          </span>
        ),
      )}
    </div>
  );
}

export default function LogoMarquee({
  heading = "Fueling High Performers at:",
  logos = PARTNER_LOGOS,
  durationSeconds = 40,
}: {
  heading?: string;
  logos?: MarqueeLogo[];
  /** Seconds for one full loop. Higher is slower. The press band runs slower
   *  than the 40s partner default so the two never look like the same track. */
  durationSeconds?: number;
}) {
  return (
    <div className="text-center">
      <p className="mb-7 text-[16.5px] font-medium tracking-[-0.01em] text-[#7c7d7c]">
        {heading}
      </p>
      <div className="overflow-hidden">
        <div
          className="flex w-max motion-safe:animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          <Group logos={logos} />
          <Group logos={logos} hidden />
        </div>
      </div>
    </div>
  );
}
