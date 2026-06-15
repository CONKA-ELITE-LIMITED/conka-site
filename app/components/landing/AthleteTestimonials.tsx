import Image from "next/image";

/* ============================================================================
 * AthleteTestimonials
 *
 * "Trusted by the Best in the World." 3-tile athlete testimonial block, ported
 * from the lander (app/lander/sections/Testimonials) into our patterns:
 * Tailwind (no CSS Module), next/image, our lg breakpoint. One navy card for
 * contrast. Static, no client interactivity. CTA anchors to the buy box.
 * ========================================================================== */

interface AthleteTestimonial {
  image: string;
  name: string;
  role: string;
  quote: string;
  variant?: "base" | "navy";
}

const TESTIMONIALS: AthleteTestimonial[] = [
  {
    image: "/lander/athletes/FraserDingwallNB.jpg",
    name: "Fraser Dingwall",
    role: "England Rugby Player",
    quote:
      "“I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.”",
    variant: "base",
  },
  {
    image: "/lander/athletes/JoshStantonNB.jpg",
    name: "Josh Stanton",
    role: "Professional Racing Driver",
    quote:
      "“When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.”",
    variant: "navy",
  },
  {
    image: "/lander/athletes/ChrisBillamSmithNB.jpg",
    name: "Chris Billam-Smith",
    role: "WBO Cruiserweight World Champion",
    quote:
      "“Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.”",
    variant: "base",
  },
];

export default function AthleteTestimonials({
  ctaHref = "#product",
}: {
  ctaHref?: string;
}) {
  return (
    <div>
      <div className="mx-auto max-w-[820px] text-center">
        <h2
          className="mb-3 text-3xl font-extrabold leading-[1.05] text-[#313131] md:text-5xl"
          style={{ letterSpacing: "var(--letter-spacing-premium-title)" }}
        >
          Trusted by the Best in the World.
        </h2>
        <p className="text-base font-medium leading-6 text-[#313131]">
          We surround ourselves with pioneers across business, athletics and
          science.{" "}
          <b className="font-medium text-[#7c7d7c]">
            We take performance seriously. Our partners do, too.
          </b>
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:justify-center">
        {TESTIMONIALS.map((t) => {
          const navy = t.variant === "navy";
          return (
            <figure
              key={t.name}
              className={`m-0 flex flex-col overflow-hidden rounded-2xl lg:w-[304px] lg:flex-shrink-0 ${
                navy ? "bg-[#1B2757]" : "border border-black/[0.06] bg-white"
              }`}
            >
              <div className="relative aspect-square w-full bg-white">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 304px"
                />
              </div>
              <figcaption className="p-4">
                <p
                  className={`mb-2 text-[14.5px] font-medium leading-5 ${
                    navy ? "text-white" : "text-[#313131]"
                  }`}
                >
                  {t.name},{" "}
                  <b
                    className={`font-medium ${
                      navy ? "text-white/70" : "text-[#7c7d7c]"
                    }`}
                  >
                    {t.role}
                  </b>
                </p>
                <blockquote
                  className={`m-0 text-[20px] font-medium leading-7 ${
                    navy ? "text-white" : "text-[#313131]"
                  }`}
                >
                  {t.quote}
                </blockquote>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center lg:mt-12">
        <a
          href={ctaHref}
          className="inline-block rounded-full bg-[#1B2757] px-14 py-4 text-base font-medium text-white"
        >
          Join them today
        </a>
      </div>
    </div>
  );
}
