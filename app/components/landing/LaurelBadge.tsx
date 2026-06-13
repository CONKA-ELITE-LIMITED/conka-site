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
}: {
  eyebrow: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-stretch gap-3 rounded-[14px] border border-[#1B2757]/25 bg-white px-3 py-2.5 shadow-[0_4px_18px_rgba(27,39,87,0.12)] md:w-fit ${className}`}
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
        <span className="max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-[1.15] tracking-[0.08em] text-[#1B2757]">
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
