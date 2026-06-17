/* ============================================================================
 * UGCMarquee
 *
 * Infinite, auto-scrolling band of real people with the product, used as a
 * visual social-proof "texture" tier on the PDPs (complements, does not
 * replace, the written CROTestimonials). Modelled on LogoMarquee: a Server
 * Component using the shared global `marquee` keyframe (translateX -50%), two
 * identical groups looping seamlessly, motion-safe so reduced-motion users get
 * a static row. Pure CSS, no JS.
 *
 * Each scrolling unit is a COLUMN of two stacked tiles (2 rows). Tiles are
 * normalised to one aspect ratio (object-cover) so the mixed-ratio UGC /
 * customer / athlete stills read as one cohesive band. Radius comes from
 * --brand-radius-container, which the clinical PDP scope sets to 0 (sharp), so
 * tiles match the surrounding clinical design automatically.
 *
 * Content-only: no <section>, no max-width, no horizontal padding at root. The
 * page owns the section wrapper and background. See SCRUM-1092.
 * ========================================================================== */

import Image from "next/image";

type UGCItem = { src: string; alt: string };

// Athlete / DTC customer / UGC stills interleaved so the band reads varied.
const UGC_ITEMS: UGCItem[] = [
  { src: "/testimonials/athlete/WustyDrink.jpg", alt: "A CONKA athlete taking the daily shot outdoors" },
  { src: "/testimonials/dtc/SamT.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/1.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/athlete/JackWShots.jpg", alt: "A CONKA athlete holding the daily shots" },
  { src: "/testimonials/dtc/AnkitaK.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/2.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/athlete/CbsShots.jpg", alt: "A CONKA athlete holding the daily shot" },
  { src: "/testimonials/dtc/AaronH.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/3.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/PhilB.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/4.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/JackG.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/5.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/SamJ.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/6.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/10.jpg", alt: "A CONKA customer holding the daily shots" },
  { src: "/testimonials/dtc/MillieH.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/11.jpg", alt: "A CONKA customer working with the daily shots" },
  { src: "/testimonials/dtc/AlexL.jpg", alt: "A CONKA customer with their daily shot" },
];

// Pair the stills into stacked column units. If the count is odd, the final
// column borrows the first still so every column is full (invisible in a loop).
const COLUMNS: [UGCItem, UGCItem][] = [];
for (let i = 0; i < UGC_ITEMS.length; i += 2) {
  COLUMNS.push([UGC_ITEMS[i], UGC_ITEMS[i + 1] ?? UGC_ITEMS[0]]);
}

function Tile({ item }: { item: UGCItem }) {
  return (
    <div className="relative aspect-[4/5] w-[150px] flex-shrink-0 overflow-hidden rounded-[var(--brand-radius-container)] bg-[var(--brand-tint)] md:w-[210px]">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 150px, 210px"
        loading="lazy"
        className="object-cover"
      />
    </div>
  );
}

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex flex-shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
      aria-hidden={hidden || undefined}
    >
      {COLUMNS.map((pair, i) => (
        <div key={i} className="flex flex-shrink-0 flex-col gap-3 md:gap-4">
          {pair.map((item, j) => (
            <Tile key={`${item.src}-${j}`} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function UGCMarquee({
  title = "Join Thousands Staying Sharp, Every Day",
  subtitle = "Two shots a day.",
}: {
  title?: string;
  subtitle?: string;
}) {
  // Two identical groups; translateX(-50%) loops seamlessly. motion-safe so
  // reduced-motion users get a static (clipped) row instead of movement.
  return (
    <div>
      {title ? (
        <div className="mx-auto mb-8 max-w-2xl px-[var(--brand-gutter-mobile)] text-center md:mb-10 md:px-[var(--brand-gutter-desktop)]">
          <p className="brand-eyebrow mb-3">{"// Real people, in the wild"}</p>
          <h2 className="brand-h2" style={{ letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-3xl font-bold tracking-[-0.02em] text-black md:text-4xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-hidden">
        <div className="flex w-max motion-safe:animate-[marquee_50s_linear_infinite]">
          <Group />
          <Group hidden />
        </div>
      </div>
    </div>
  );
}
