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
}

export default function AthleteQuoteCard({
  name,
  role,
  image,
  quote,
}: AthleteQuoteCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-[var(--brand-tint,#eeeff2)]"
      style={{ aspectRatio: "4/5" }}
    >
      <Image
        src={image}
        alt={`${name}, ${role}`}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

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
