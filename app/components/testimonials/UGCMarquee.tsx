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
 * Tiles are normalised to one aspect ratio (object-cover) so the mixed-ratio
 * UGC / customer / athlete stills read as one cohesive band. Radius comes from
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
  { src: "/testimonials/dtc/MillieH.jpg", alt: "A CONKA customer with their daily shot" },
  { src: "/testimonials/dtc/AlexL.jpg", alt: "A CONKA customer with their daily shot" },
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex flex-shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
      aria-hidden={hidden || undefined}
    >
      {UGC_ITEMS.map((item) => (
        <div
          key={item.src}
          className="relative aspect-[4/5] w-[150px] flex-shrink-0 overflow-hidden rounded-[var(--brand-radius-container)] bg-[var(--brand-tint)] md:w-[210px]"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 150px, 210px"
            loading="lazy"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function UGCMarquee() {
  // Two identical groups; translateX(-50%) loops seamlessly. motion-safe so
  // reduced-motion users get a static (clipped) row instead of movement.
  return (
    <div className="overflow-hidden">
      <div className="flex w-max motion-safe:animate-[marquee_50s_linear_infinite]">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
