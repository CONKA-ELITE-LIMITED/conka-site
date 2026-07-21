import Image from "next/image";

/* ============================================================================
 * Certifications
 *
 * A centred row of the four product certification badges (Vegan, Kosher, BPA
 * free, third-party tested). Four across on every breakpoint, scaling from
 * compact on mobile to large on desktop.
 *
 * Self-contained band: it owns its own background (defaults to the brand white
 * token, overridable via `background` so it can sit on a tinted surface) and
 * vertical padding, so it can be dropped straight under another section.
 * ========================================================================== */

const CERTS = [
  { src: "/icons/VeganFriendlyIcon.avif", label: "Vegan friendly" },
  { src: "/icons/KosherCertifiedIcon.avif", label: "Kosher certified" },
  { src: "/icons/BpaFreeIcon.avif", label: "BPA free" },
  { src: "/icons/ThirdPartyTestedIcon.avif", label: "Third party tested" },
];

export default function Certifications({
  background = "var(--brand-white)",
  className = "",
}: {
  background?: string;
  className?: string;
} = {}) {
  return (
    <section
      aria-label="Product certifications"
      className={`w-full ${className}`}
      style={{ background }}
    >
      <div className="flex items-center justify-center gap-4 px-5 py-10 sm:gap-10 lg:gap-16 lg:py-14">
        {CERTS.map((cert) => (
          <Image
            key={cert.label}
            src={cert.src}
            alt={cert.label}
            width={140}
            height={140}
            className="h-auto w-16 sm:w-24 lg:w-32"
          />
        ))}
      </div>
    </section>
  );
}
