import Image from "next/image";

/**
 * Brain-project credibility chip (IM8 "Clinicians' Choice" style): a
 * left/right split — laurel-flanked credential label on the left, a
 * descriptive sentence on the right, divided by a hairline. Tinted brand
 * border + soft shadow. Shared by the listicle hero and the home hero.
 */
export default function LaurelBadge({
  eyebrow,
  body,
  className = "",
  variant = "default",
}: {
  eyebrow: string;
  body: string;
  className?: string;
  /**
   * Simple DTC opt-in (im8 listicle): DTC hairline + soft shadow + rounded-lg
   * and a black credential label. Default (home hero) keeps the navy chip.
   */
  variant?: "default" | "dtc";
}) {
  const dtc = variant === "dtc";
  return (
    <div
      className={`flex items-stretch gap-3 bg-white px-3 py-2.5 md:w-fit ${
        dtc
          ? "rounded-lg border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          : "rounded-[14px] border border-[#1B2757]/25 shadow-[0_4px_18px_rgba(27,39,87,0.12)]"
      } ${className}`}
    >
      {/* Left: laurel-flanked credential */}
      <div className="flex flex-shrink-0 items-center gap-1.5 pr-3">
        <div
          className="relative h-9 w-3 flex-shrink-0 overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="32px"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
        </div>
        <span
          className={`max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-[1.15] tracking-[0.08em] ${
            dtc ? "text-black" : "text-[#1B2757]"
          }`}
        >
          {eyebrow}
        </span>
        <div
          className="relative h-9 w-3 flex-shrink-0 overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="32px"
            style={{ objectFit: "cover", objectPosition: "right center" }}
          />
        </div>
      </div>
      {/* Right: descriptive body */}
      <div className="flex items-center border-l border-black/10 pl-3 md:max-w-[20rem]">
        <p className="text-[11px] font-medium leading-snug text-black/70">
          {body}
        </p>
      </div>
    </div>
  );
}
