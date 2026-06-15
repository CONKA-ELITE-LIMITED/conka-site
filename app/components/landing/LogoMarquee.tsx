/* ============================================================================
 * LogoMarquee
 *
 * "Fueling High Performers at:" partner-logo marquee, ported from the lander
 * (app/lander/sections/LogoMarquee) into our patterns: Tailwind, the shared
 * global `marquee` keyframe (translateX -50%), motion-safe so reduced-motion
 * users get a static row. Two identical groups loop seamlessly. Logos keep
 * their per-item heights (natural proportions differ). Static, no JS.
 * ========================================================================== */

const LOGOS = [
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

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex flex-shrink-0 items-center gap-14 pr-14 md:gap-[90px] md:pr-[90px]"
      aria-hidden={hidden || undefined}
    >
      {LOGOS.map((l) => (
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
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <div className="text-center">
      <p className="mb-7 text-[16.5px] font-medium tracking-[-0.01em] text-[#7c7d7c]">
        Fueling High Performers at:
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max motion-safe:animate-[marquee_40s_linear_infinite]">
          <Group />
          <Group hidden />
        </div>
      </div>
    </div>
  );
}
