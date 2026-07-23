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
 * Static server component. Defaults to Jack Willis (the home-page usage passes
 * nothing); the fuller rotating roster lives in AthleteCredibilityCarousel and
 * his quote mirrors the roster entry there. The listicle proof tier passes its
 * own persona-matched athlete via `athlete`.
 *
 * The portrait MUST be a white-background cutout: mix-blend-multiply dissolves
 * the white into the tint panel. Every `*NB.jpg` under
 * `public/testimonials/athlete/` satisfies that.
 * ========================================================================== */

export interface AthleteReviewContent {
  name: string;
  /** Headline credentials under the name, one line each */
  credentials: string[];
  quote: string;
  /** White-background cutout portrait */
  image: string;
  imageAlt: string;
}

const DEFAULT_ATHLETE: AthleteReviewContent = {
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

export default function AthleteReviewFeature({
  athlete = DEFAULT_ATHLETE,
}: {
  athlete?: AthleteReviewContent;
} = {}) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
      {/* Cutout portrait in the App USP soft panel: #eef1f8 tint, rounded-2xl,
          ring-1 ring-black/8. The photo has a white background, so
          mix-blend-multiply dissolves the white into the tint (white * tint =
          tint) and he floats on the light blue like the App USP asset. He
          darkens only a few percent because the tint is near-white. */}
      <div className="relative mx-auto w-full max-w-[420px] aspect-square overflow-hidden rounded-2xl bg-[#eef1f8] ring-1 ring-black/8 lg:mx-0 lg:max-w-none">
        <Image
          src={athlete.image}
          alt={athlete.imageAlt}
          fill
          sizes="(max-width: 1024px) 420px, 45vw"
          className="object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>

      {/* Quote as the hero, then name + credential */}
      <div className="mt-8 lg:mt-0">
        <blockquote className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-[1.18] tracking-tight">
          &ldquo;{athlete.quote}&rdquo;
        </blockquote>
        <p className="mt-6 text-xl lg:text-2xl font-bold text-black leading-tight">
          {athlete.name}
        </p>
        <div className="mt-1.5 space-y-0.5">
          {athlete.credentials.map((credential) => (
            <p key={credential} className="text-sm lg:text-base text-black">
              {credential}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
