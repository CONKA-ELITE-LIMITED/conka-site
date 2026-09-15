/* ============================================================================
 * LogoMarquee
 *
 * Looping logo marquee, ported from the lander into our patterns: Tailwind,
 * the shared global `marquee` keyframe (translateX -50%), motion-safe so
 * reduced-motion users get a static row. Two identical groups loop seamlessly.
 * Static, no JS.
 *
 * Two variants share the same shell:
 *  - Partners (default): "Fueling High Performers at:" image logos. The list
 *    lives in ./partnerLogos.ts, shared with the /lander and /lander-b bands.
 *  - Press: "As Published On:" outlet wordmarks. Pass `logos={PRESS_LOGOS}`,
 *    defined below; this is its only consumer, so it stays in this file.
 *
 * Items with a `src` render as an <img> at their natural height; items with no
 * `src` render as a text wordmark.
 * ========================================================================== */

import { PARTNER_LOGOS } from "./partnerLogos";

export interface MarqueeLogo {
  /** Image path; omit to render `alt` as a text wordmark instead */
  src?: string;
  alt: string;
  /** Pixel height for image logos (natural proportions differ per logo) */
  h?: number;
  /**
   * Rendered pixel width at `h`, from the asset's own proportions. Stated so
   * the <img> can carry width/height attributes: without them the flex row has
   * no size until each logo decodes, and every arrival reflows the track under
   * a running transform, which is what made the marquee visibly jump.
   */
  w?: number;
}

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
  { src: "/lander/press/medscape.webp", alt: "Medscape", h: 66, w: 66 },
  { src: "/lander/press/neurology-live.webp", alt: "NeurologyLive", h: 26, w: 190 },
  { src: "/lander/press/mdedge.webp", alt: "MDedge", h: 38, w: 112 },
  { src: "/lander/press/psychiatry.webp", alt: "Psychiatry", h: 36, w: 86 },
  { src: "/lander/press/pharmaphorum.webp", alt: "pharmaphorum", h: 30, w: 150 },
  { src: "/lander/press/biospace.webp", alt: "BioSpace", h: 32, w: 122 },
  { src: "/lander/press/globe-and-mail.webp", alt: "The Globe and Mail", h: 18, w: 157 },
  { src: "/lander/press/nature-scientific-reports.webp", alt: "Nature Scientific Reports", h: 44, w: 64 },
  { src: "/lander/press/frontiers-aging-neuroscience.webp", alt: "Frontiers in Aging Neuroscience", h: 42, w: 153 },
  { src: "/lander/press/plos.webp", alt: "PLOS", h: 58, w: 79 },
  { src: "/lander/press/protolife.webp", alt: "proto.life", h: 26, w: 106 },
  { src: "/lander/press/the-deep-dive.webp", alt: "The Deep Dive", h: 24, w: 171 },
  { src: "/lander/press/nasdaq.webp", alt: "Nasdaq", h: 30, w: 104 },
  { src: "/lander/press/yahoo-finance.webp", alt: "Yahoo Finance", h: 32, w: 88 },
  { src: "/lander/press/newsfile.webp", alt: "Newsfile", h: 36, w: 95 },
];

function Group({
  logos,
  hidden = false,
  lowPriority = false,
}: {
  logos: MarqueeLogo[];
  hidden?: boolean;
  lowPriority?: boolean;
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
          //
          // Eager on the visible group: the band now sits directly under the
          // listicle hero, and lazy-loading images inside a horizontally
          // translating track means they pop in mid-scroll. At ~150KB of WebP
          // for the whole set that trade is not worth making. The duplicate
          // group stays lazy and hits the cache anyway, same URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={l.alt}
            src={l.src}
            alt={l.alt}
            width={l.w}
            height={l.h}
            loading={hidden ? "lazy" : "eager"}
            fetchPriority={lowPriority ? "low" : undefined}
            decoding="async"
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
  largeHeading = false,
  lowPriority = false,
}: {
  heading?: string;
  logos?: MarqueeLogo[];
  /** Seconds for one full loop. Higher is slower. The press band runs slower
   *  than the 40s partner default so the two never look like the same track. */
  durationSeconds?: number;
  /** Render the heading as a large black section title (brand-h2) instead of
   *  the small muted eyebrow. Used for the partner band above the buy box. */
  largeHeading?: boolean;
  /** Fetch the logos after the page's LCP image. For bands inside a hero that
   *  sit below the mobile fold (the /go offer page): still eager, so logos do
   *  not pop in mid-scroll, but they no longer compete with the hero image. */
  lowPriority?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={
          largeHeading
            ? "brand-h2 mb-8 text-black"
            : "mb-7 text-[16.5px] font-medium tracking-[-0.01em] text-[#7c7d7c]"
        }
        style={largeHeading ? { letterSpacing: "-0.02em" } : undefined}
      >
        {heading}
      </p>
      <div className="overflow-hidden">
        <div
          className="flex w-max motion-safe:animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          <Group logos={logos} lowPriority={lowPriority} />
          <Group logos={logos} hidden lowPriority={lowPriority} />
        </div>
      </div>
    </div>
  );
}
