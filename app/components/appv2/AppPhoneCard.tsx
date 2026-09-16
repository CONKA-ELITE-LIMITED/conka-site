import Image from "next/image";

/* ============================================================================
 * AppPhoneCard (SCRUM-1361, Simple DTC)
 *
 * The /app loop card: a tinted stage on top with a real app screenshot
 * dropping in from the top and cropped by the stage's bottom edge, then short
 * copy underneath. A `product` image fills the stage instead, for the one
 * step that is about taking CONKA rather than using the app.
 *
 * The card sets its own background and text colour so it reads on either
 * section background.
 * ========================================================================== */

export type AppPhoneCardImage = {
  src: string;
  alt: string;
  kind: "phone" | "product";
};

const PHONE_WIDTH = 1455;
const PHONE_HEIGHT = 2942;

export default function AppPhoneCard({
  eyebrow,
  title,
  body,
  image,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  body: string;
  image: AppPhoneCardImage;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg bg-white text-black ring-1 ring-black/[0.06] ${className}`}
    >
      <div className="relative h-[240px] overflow-hidden bg-[#eef0f5] lg:h-[300px]">
        {image.kind === "phone" ? (
          <div className="absolute left-1/2 top-6 w-[42%] max-w-[180px] -translate-x-1/2 lg:top-8">
            <Image
              src={image.src}
              alt={image.alt}
              width={PHONE_WIDTH}
              height={PHONE_HEIGHT}
              loading="lazy"
              sizes="(min-width: 1024px) 180px, 36vw"
              className="h-auto w-full drop-shadow-xl"
            />
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 80vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 p-5 lg:p-7">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold text-[var(--brand-navy)]">
            {eyebrow}
          </p>
        )}
        <h3
          className="mb-2 text-xl font-semibold leading-tight lg:text-2xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>
        <p className="text-base leading-relaxed text-black/70">{body}</p>
      </div>
    </div>
  );
}
