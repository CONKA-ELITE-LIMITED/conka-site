import Image from "next/image";

/* ============================================================================
 * InformedSportCertification
 *
 * Third-party anti-doping certification block. Extracted from
 * AthleteCredibilityCarousel so the same vetted copy can be reused as a
 * standalone trust signal (e.g. promoted high on the B2B /professionals
 * landing) without duplicating markup. Rendered inside the carousel (home +
 * three PDPs) and on the professionals page.
 *
 * Simple DTC treatment: soft rounded tile, one bold title, plain black body
 * (no mono eyebrow, no inline bolding). The full copy is lifted verbatim from
 * the original block; the compact line below is a strict subset of it, so
 * neither introduces a claim. `headingLevel` lets a host
 * page keep a logical heading order
 * (h2 on the landing where it opens a section; h3 inside the carousel where it
 * sits under the roster h2). `className` lets the host own outer spacing.
 *
 * `variant` (SCRUM-1267): "compact" drops the paragraph for a single line,
 * keeping the logo at full size. It exists because inside the
 * carousel this block is the closing anchor and the three lines of body copy
 * were costing height the section could not afford; the logo is the signal
 * for anyone who knows the certification, and the bold line carries it for
 * anyone who does not. It defaults to "full" so /professionals, where this
 * block opens a section for B2B buyers and the detail is the point, keeps the
 * paragraph without having to opt in.
 * ========================================================================== */

export default function InformedSportCertification({
  className = "",
  headingLevel: Heading = "h3",
  variant = "full",
}: {
  className?: string;
  headingLevel?: "h2" | "h3";
  variant?: "full" | "compact";
}) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl bg-black/[0.03] ${
        isCompact ? "p-4" : "p-5"
      } ${className}`}
    >
      {/* Same size in both variants. The mark is the thing anyone who knows
          the certification actually reads, so shrinking it alongside the copy
          traded away the signal rather than the padding. */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src="/logos/InformedSportLogo.png"
          alt="Informed Sport certification"
          fill
          sizes="80px"
          loading="lazy"
          className="object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <Heading
          className={`font-bold text-black leading-tight ${
            isCompact ? "text-base lg:text-lg" : "text-lg lg:text-xl mb-1.5"
          }`}
        >
          Independently tested. Every batch.
        </Heading>
        {isCompact ? (
          /* The substance count is the one hard number in the full copy, so it
             is the part worth keeping when the paragraph goes. */
          <p className="text-[13px] text-black/60 leading-snug mt-0.5">
            Informed Sport tested for over 280 banned substances.
          </p>
        ) : (
          <p className="text-sm text-black leading-snug">
            Every batch of CONKA Flow and CONKA Clear is independently tested by
            Informed Sport for over 280 banned substances. Trusted by WADA,
            Olympic committees, and professional sports leagues worldwide.
          </p>
        )}
      </div>
    </div>
  );
}
