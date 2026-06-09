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
 * Clinical treatment: sharp corners, mono category label, hairline border.
 * Copy is lifted verbatim from the original block, so no new claims are
 * introduced. `headingLevel` lets a host page keep a logical heading order
 * (h2 on the landing where it opens a section; h3 inside the carousel where it
 * sits under the roster h2). `className` lets the host own outer spacing.
 * ========================================================================== */

export default function InformedSportCertification({
  className = "",
  headingLevel: Heading = "h3",
}: {
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div
      className={`flex items-center gap-4 p-5 bg-black/[0.03] border border-black/[0.06] ${className}`}
    >
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
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50 mb-1.5">
          Quality &amp; Testing
        </p>
        <Heading className="text-base lg:text-lg font-semibold text-black leading-tight mb-1.5">
          Independently tested. Every batch.
        </Heading>
        <p className="text-[13px] text-black/70 leading-snug">
          Every batch of CONKA Flow and CONKA Clear is independently tested by{" "}
          <strong className="text-black font-semibold">Informed Sport</strong>{" "}
          for over{" "}
          <strong className="text-black font-semibold">
            280 banned substances
          </strong>
          . Trusted by{" "}
          <strong className="text-black font-semibold">WADA</strong>,{" "}
          <strong className="text-black font-semibold">
            Olympic committees
          </strong>
          , and professional sports leagues worldwide.
        </p>
      </div>
    </div>
  );
}
