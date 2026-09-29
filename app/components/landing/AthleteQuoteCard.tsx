import Image from "next/image";

/* ============================================================================
 * AthleteQuoteCard
 *
 * Reason-slot card: an athlete portrait (cutout on brand tint) with their
 * quote overlaid in a navy scrim at the foot, plus their status. Used where an
 * athlete's words map directly to a reason (e.g. Dan Norton's "words just flow
 * better" on the ADHD word-recall reason). Static, our patterns.
 * ========================================================================== */

interface AthleteQuoteCardProps {
  name: string;
  role: string;
  image: string;
  quote: string;
  /** Organisation logo (public path) in a white chip, top left */
  logo?: string;
  logoAlt?: string;
  /** Tall crest (e.g. England Rugby): a taller chip so it stays legible */
  crest?: boolean;
}

export default function AthleteQuoteCard({
  name,
  role,
  image,
  quote,
  logo,
  logoAlt,
  crest = false,
}: AthleteQuoteCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-[var(--brand-tint,#eeeff2)]"
      style={{ aspectRatio: "4/5" }}
    >
      <Image
        src={image}
        alt={`${name}, ${role}`}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {logo ? (
        <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-2 shadow-sm">
          <Image
            src={logo}
            alt={logoAlt ?? ""}
            width={crest ? 69 : 180}
            height={crest ? 116 : 31}
            unoptimized={logo.endsWith(".svg")}
            className={crest ? "h-12 w-auto" : "h-[18px] w-auto md:h-5"}
          />
        </div>
      ) : null}

      <div
        className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16"
        style={{
          background:
            "linear-gradient(to top, rgba(14,31,63,0.94) 0%, rgba(14,31,63,0.6) 55%, rgba(14,31,63,0) 100%)",
        }}
      >
        <blockquote className="text-[15px] font-medium leading-snug text-white">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-bold text-white">{name}</span>
          <span className="text-[11px] text-white/70">{role}</span>
        </div>
      </div>
    </div>
  );
}
