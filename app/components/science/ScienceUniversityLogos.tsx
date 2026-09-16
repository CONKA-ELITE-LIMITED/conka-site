import Image from "next/image";
import { UNIVERSITY_LOGOS } from "@/app/lib/scienceContent";

/**
 * Durham, Cambridge and Exeter on one row at every width. Each logo gets an
 * equal third and is contained within a fixed-height box, so Cambridge's wide
 * wordmark and Durham's stacked mark end up with similar visual weight and
 * the row never wraps at 390px. Used in the hero and under the trials.
 */
export default function ScienceUniversityLogos({
  className = "",
  label = "University research partners",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ul
      className={`grid max-w-[34rem] grid-cols-3 items-center gap-5 sm:gap-8 ${className}`}
      aria-label={label}
    >
      {UNIVERSITY_LOGOS.map((logo) => (
        <li key={logo.name} className="relative h-10 w-full sm:h-12">
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            loading="lazy"
            sizes="(min-width: 640px) 160px, 30vw"
            className="object-contain object-left"
          />
        </li>
      ))}
    </ul>
  );
}
