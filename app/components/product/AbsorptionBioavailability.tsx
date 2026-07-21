import Image from "next/image";

/* ============================================================================
 * AbsorptionBioavailability
 *
 * Simple DTC "why liquid" section (Magic Mind absorption pattern): a two-column
 * card with the liquid-pour asset on one side and a title + three benefit
 * points on the other. Makes the liquid delivery itself the selling point,
 * sitting between the ingredient rail and the outcome timeline on the PDPs.
 *
 * Static server component (no client JS). CSS-only responsive: image on top /
 * points below on mobile, side-by-side on lg+. The page section owns the
 * wrapper + background. Prop-driven so all three PDPs share it (Flow -> Flow
 * liquid, Clear + Both -> Clear liquid).
 * ========================================================================== */

type Point = { title: string; body: string };

const DEFAULT_POINTS: Point[] = [
  {
    title: "Maximum bioavailability",
    body: "Liquid skips the slow breakdown a tablet needs, so more of each compound is ready for your body to absorb.",
  },
  {
    title: "Fast absorption",
    body: "A liquid is ready to absorb in minutes, not the hours a pill spends dissolving first.",
  },
  {
    title: "Proven dosages",
    body: "Every compound is dosed at the levels used in real research, not sprinkled in for the label.",
  },
];

/** Navy tick used on each benefit point. */
function Tick() {
  return (
    <svg
      width="22"
      height="22"
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

export default function AbsorptionBioavailability({
  imageSrc,
  imageAlt,
  title = "Absorbed, not wasted",
  intro = "Our liquid formula gets active ingredients into your system, so your brain gets more of what it needs.",
  points = DEFAULT_POINTS,
}: {
  imageSrc: string;
  imageAlt: string;
  title?: string;
  intro?: string;
  points?: Point[];
}) {
  return (
    <div className="flex flex-col overflow-hidden border-y border-black/10 lg:flex-row lg:rounded-2xl lg:border">
      {/* Media panel — full liquid pour, no crop. Sits on top on mobile;
          centres in its half on desktop (white asset bg fills any gap). */}
      <div className="order-1 flex w-full items-center justify-center bg-white lg:w-1/2">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1500}
          height={1500}
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 640px"
          className="h-auto w-full"
        />
      </div>

      {/* Copy panel — paper texture, stacks below the image on mobile. */}
      <div
        className="order-2 flex flex-col justify-center p-8 lg:w-1/2 lg:p-12 xl:p-16"
        style={{
          backgroundColor: "#f5f4f1",
          backgroundImage: "url('/paperTextureTile.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="brand-h1 mb-4 text-black">{title}</h2>
        <p className="brand-body mb-8 text-black">{intro}</p>

        <ul className="space-y-6">
          {points.map((point) => (
            <li key={point.title} className="flex items-start gap-3">
              <Tick />
              <div>
                <h3 className="text-lg font-bold leading-snug text-black">
                  {point.title}
                </h3>
                <p className="mt-1 text-base leading-relaxed text-black">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
