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
  compact = false,
}: {
  background?: string;
  className?: string;
  /** Smaller badges and tighter padding, for sitting under a CTA button
   *  rather than standing as its own band. */
  compact?: boolean;
} = {}) {
  return (
    <section
      aria-label="Product certifications"
      className={`w-full ${className}`}
      style={{ background }}
    >
      {/* Tight on mobile: four badges do not need a full section's worth of air
          around them, and the sections either side bring their own padding. */}
      <div
        className={
          compact
            ? "flex items-center justify-center gap-5 px-5 pt-6 sm:gap-8 lg:gap-10"
            : "flex items-center justify-center gap-4 px-5 py-6 sm:gap-10 sm:py-10 lg:gap-16 lg:py-14"
        }
      >
        {CERTS.map((cert) => (
          <Image
            key={cert.label}
            src={cert.src}
            alt={cert.label}
            width={140}
            height={140}
            /* The compact row renders these at 40 to 56px. Without `sizes`,
               next/image builds the srcset from `width` alone and serves the
               140w and 280w candidates into a 40px slot. */
            sizes={compact ? "(max-width: 640px) 40px, 56px" : "(max-width: 640px) 64px, 128px"}
            className={
              compact
                ? "h-auto w-10 sm:w-12 lg:w-14"
                : "h-auto w-16 sm:w-24 lg:w-32"
            }
          />
        ))}
      </div>
    </section>
  );
}
