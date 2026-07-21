import Image from "next/image";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";
import ConkaCTAButton from "./ConkaCTAButton";

/* ============================================================================
 * LabGuarantee
 *
 * Simple DTC guarantee block (Magic Mind img-text pattern): a rectangular
 * two-column card, paper-textured copy on the left and a lifestyle image on
 * the right, stacked on mobile. Focused purely on the 100-day money-back
 * promise; it deliberately does NOT push the app (that muddled the message).
 * The CTA scrolls back up to the purchase section (defaults to #hero).
 * ========================================================================== */

const BULLETS = [
  "Free UK shipping",
  "Money back guarantee",
  "No return required",
  "Nothing to lose (other than brain fog and burnout)",
];

/** Navy tick used on the guarantee bullets. */
function Tick() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 shrink-0 text-[#1B2757]"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LabGuarantee({
  hideCTA = false,
  ctaLabel,
  ctaHref = "#hero",
  mediaSrc = "/lifestyle/ConkaJeansHold.jpg",
  mediaAlt = "Someone holding a CONKA shot",
}: {
  hideCTA?: boolean;
  ctaLabel?: string;
  /** Where the CTA points. Defaults to the on-page purchase section (#hero). */
  ctaHref?: string;
  mediaSrc?: string;
  mediaAlt?: string;
} = {}) {
  return (
    <div className="flex flex-col overflow-hidden border-y border-black/10 lg:flex-row lg:rounded-2xl lg:border">
      {/* Copy panel — paper texture, stacks below the image on mobile */}
      <div
        className="order-2 flex flex-col justify-center p-8 lg:order-1 lg:w-1/2 lg:p-12 xl:p-16"
        style={{
          backgroundColor: "#f5f4f1",
          backgroundImage: "url('/paperTextureTile.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="brand-h1 mb-4 text-black">
          {GUARANTEE_DAYS}-Day Risk Free Trial
        </h2>
        <p className="brand-body text-black">
          Try CONKA for {GUARANTEE_DAYS} days. If your mental performance
          doesn&apos;t noticeably improve, we&apos;ll refund your purchase
          completely, no return necessary.
        </p>

        <ul className="mb-8 mt-6 space-y-3">
          {BULLETS.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-sm leading-snug text-black lg:text-base"
            >
              <Tick />
              {bullet}
            </li>
          ))}
        </ul>

        {!hideCTA && (
          <div className="flex justify-center lg:justify-start">
            <ConkaCTAButton href={ctaHref} meta={null}>
              {ctaLabel ?? "Try it 100% Risk Free"}
            </ConkaCTAButton>
          </div>
        )}
      </div>

      {/* Media panel — lifestyle image, sits on top on mobile */}
      <div className="relative order-1 min-h-[320px] w-full lg:order-2 lg:min-h-0 lg:w-1/2">
        <Image
          src={mediaSrc}
          alt={mediaAlt}
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
