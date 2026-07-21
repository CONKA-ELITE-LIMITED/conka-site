import Image from "next/image";

/* ============================================================================
 * AthleteReviewFeature
 *
 * Single-athlete "simple review" beat (Magic Mind simple-review homage): a
 * white-background cutout portrait beside one large quote, with the athlete's
 * name and headline credential underneath. Borderless on white so the cutout
 * reads as floating. Desktop is a two-column split (image / quote); mobile
 * stacks image over quote.
 *
 * Static server component. Features Jack Willis; the fuller rotating roster
 * lives in AthleteCredibilityCarousel. His quote mirrors the roster entry there.
 * ========================================================================== */

const ATHLETE = {
  name: "Jack Willis",
  credentials: [
    "2025 Top 14 Player of the Season",
    "3× Top 14 Champion, Champions Cup winner",
  ],
  quote:
    "For me it was about trying to find the small margins, and maximising my brain as well as my body was so important.",
  image: "/testimonials/athlete/JackWillisNB.jpg",
  imageAlt:
    "Jack Willis applauding in the Stade Toulousain jersey, 2025 Top 14 Player of the Season",
};

export default function AthleteReviewFeature() {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
      {/* Cutout portrait on white (no card, floats on the section background) */}
      <div className="relative mx-auto w-full max-w-[420px] aspect-square lg:mx-0 lg:max-w-none">
        <Image
          src={ATHLETE.image}
          alt={ATHLETE.imageAlt}
          fill
          sizes="(max-width: 1024px) 420px, 45vw"
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* Quote as the hero, then name + credential */}
      <div className="mt-8 lg:mt-0">
        <blockquote className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-[1.18] tracking-tight">
          &ldquo;{ATHLETE.quote}&rdquo;
        </blockquote>
        <p className="mt-6 text-xl lg:text-2xl font-bold text-black leading-tight">
          {ATHLETE.name}
        </p>
        <div className="mt-1.5 space-y-0.5">
          {ATHLETE.credentials.map((credential) => (
            <p key={credential} className="text-sm lg:text-base text-black/55">
              {credential}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
