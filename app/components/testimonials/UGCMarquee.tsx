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
 * Each scrolling unit is a COLUMN of three stacked tiles (3 rows), all moving
 * as one track at a single rate and direction. Tiles are normalised to one
 * aspect ratio (object-cover) so the mixed-ratio UGC / customer / athlete
 * stills read as one cohesive band. Radius comes from --brand-radius-container,
 * which the clinical PDP scope sets to 0 (sharp), so tiles match the
 * surrounding clinical design automatically.
 *
 * Content-only: no <section>, no max-width, no horizontal padding at root. The
 * page owns the section wrapper and background. See SCRUM-1092.
 * ========================================================================== */

import Image from "next/image";

export type UGCItem = { src: string; alt: string };

// Athlete / DTC customer / UGC stills interleaved so the band reads varied.
// The default set; callers (e.g. the listicle proof tier) may pass a
// persona-specific subset via `items`. Below roughly 12 items the band stops
// reading as volume, so prefer the default over a thin subset.
export const DEFAULT_UGC_ITEMS: UGCItem[] = [
  { src: "/testimonials/athlete/WustyDrink.jpg", alt: "A CONKA athlete taking the daily shot outdoors" },
  { src: "/testimonials/dtc/SamT.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/1.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/athlete/JackWShots.jpg", alt: "A CONKA athlete holding the daily shots" },
  { src: "/testimonials/dtc/AnkitaK.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/2.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/13.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/athlete/CbsShots.jpg", alt: "A CONKA athlete holding the daily shot" },
  { src: "/testimonials/dtc/AaronH.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/3.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/PhilB.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/4.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/14.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/JackG.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/5.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/dtc/SamJ.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/15.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/6.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/10.jpg", alt: "A CONKA customer holding the daily shots" },
  { src: "/testimonials/dtc/MillieH.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/16.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/11.jpg", alt: "A CONKA customer working with the daily shots" },
  { src: "/testimonials/dtc/AlexL.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/ugc/17.jpg", alt: "A CONKA customer with the daily shot" },
  { src: "/testimonials/ugc/12.jpg", alt: "A CONKA customer holding their delivery box" },
];

// Stack the stills into columns of three tiles (3 rows). If the count doesn't
// divide by three, the final column borrows from the start so every column is
// full (invisible in a loop).
function toColumns(items: UGCItem[]): [UGCItem, UGCItem, UGCItem][] {
  const columns: [UGCItem, UGCItem, UGCItem][] = [];
  for (let i = 0; i < items.length; i += 3) {
    columns.push([
      items[i],
      items[i + 1] ?? items[0],
      items[i + 2] ?? items[1],
    ]);
  }
  return columns;
}

function Tile({ item }: { item: UGCItem }) {
  return (
    <div className="relative aspect-[4/5] w-[130px] flex-shrink-0 overflow-hidden rounded-[var(--brand-radius-container)] bg-[var(--brand-tint)] md:w-[180px]">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 130px, 180px"
        loading="lazy"
        className="object-cover"
      />
    </div>
  );
}

function Group({
  columns,
  hidden = false,
}: {
  columns: [UGCItem, UGCItem, UGCItem][];
  hidden?: boolean;
}) {
  return (
    <div
      className="flex flex-shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
      aria-hidden={hidden || undefined}
    >
      {columns.map((col, i) => (
        <div key={i} className="flex flex-shrink-0 flex-col gap-3 md:gap-4">
          {col.map((item, j) => (
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
  items = DEFAULT_UGC_ITEMS,
}: {
  title?: string;
  subtitle?: string;
  items?: UGCItem[];
}) {
  const columns = toColumns(items);

  return (
    <div>
      {title ? (
        <div className="mx-auto mb-8 max-w-2xl px-[var(--brand-gutter-mobile)] text-center md:mb-10 md:px-[var(--brand-gutter-desktop)]">
          <h2 className="brand-h2 text-black" style={{ letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-xl font-medium tracking-[-0.02em] text-black md:text-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-hidden">
        <div className="flex w-max motion-safe:animate-[marquee_60s_linear_infinite] motion-safe:[will-change:transform]">
          <Group columns={columns} />
          <Group columns={columns} hidden />
        </div>
      </div>
    </div>
  );
}
