import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { FUNNEL_URL } from "@/app/lib/landingConstants";
import AnimatedStat from "./AnimatedStat";
import CaffeineCurves from "./CaffeineCurves";

// Code-split below-the-fold island: hydration drops out of initial TBT window.
const IngredientsGrid = dynamic(() => import("./IngredientsGrid"), {
  loading: () => <div className="min-h-[1100px]" />,
});

export const metadata: Metadata = {
  title: "Try CONKA | Daily Nootropic Brain Shots",
  description:
    "Two shots a day. 16 active ingredients. Informed Sport certified. Try CONKA Flow and Clear with a 100-day money-back guarantee.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://www.conka.io/startv2",
  },
  openGraph: {
    title: "Try CONKA | Daily Nootropic Brain Shots",
    description:
      "Two shots a day. 16 active ingredients. Informed Sport certified. Start your daily brain performance routine.",
  },
};

const AVATAR_COUNT = 5;

export default function StartV2Page() {
  return (
    <div className="min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />
      <main>
        {/* ===== 1. HERO ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="Hero"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              {/* Lifestyle image — full-bleed on mobile, contained on desktop.
                  Transform crops ~2% off top + ~5% off bottom via scale + translate (GPU-only, no layout cost). */}
              <div className="relative aspect-[4/3] overflow-hidden mb-6 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[12px]">
                <Image
                  src="/lifestyle/clear/ClearDrink.jpg"
                  alt="Woman holding a CONKA Clear daily brain performance shot"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover object-center"
                  style={{
                    transform: "scale(1.2) translateY(1.67%)",
                    transformOrigin: "center center",
                  }}
                />
              </div>

              {/* Trust micro-row: stacked avatars + (4.5 stars + Excellent 4.7) + review count */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center">
                  {Array.from({ length: AVATAR_COUNT }, (_, i) => (
                    <div
                      key={i}
                      className="relative w-[35px] h-[35px] rounded-full overflow-hidden"
                      style={{
                        marginLeft: i === 0 ? 0 : "-10px",
                        zIndex: AVATAR_COUNT - i,
                      }}
                    >
                      <Image
                        src={`/avatars/${i + 1}.jpg`}
                        alt="CONKA customer"
                        fill
                        className="object-cover"
                        sizes="35px"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-2">
                    {/* 4.5 stars via overlay: grey base + gold clipped to 90% width */}
                    <div
                      className="relative inline-block leading-none"
                      style={{ fontSize: "20px", letterSpacing: "0.05em" }}
                      aria-label="4.5 out of 5 stars"
                    >
                      <span className="text-black/15" aria-hidden="true">
                        ★★★★★
                      </span>
                      <span
                        className="absolute top-0 left-0 overflow-hidden whitespace-nowrap"
                        style={{ color: "#F59E0B", width: "90%" }}
                        aria-hidden="true"
                      >
                        ★★★★★
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-black">
                      Excellent 4.7
                    </span>
                  </div>
                  <span className="text-[12px] text-black mt-1">
                    <strong className="font-bold">622+</strong> reviews ·{" "}
                    <strong className="font-bold">5,000+</strong> daily users
                  </span>
                </div>
              </div>

              <h1
                className="text-black font-semibold text-[38px] leading-[1.08] mb-3"
                style={{ letterSpacing: "-0.02em" }}
              >
                Brain Performance
                <br />
                in One <em className="italic">Daily</em> Shot.
              </h1>

              <p className="text-[15px] leading-snug text-black mb-5">
                With a daily dose of CONKA, you&apos;ll experience a noticeable
                boost in focus, memory, stress resilience &amp; neuroplasticity
                through our patented formula.
                <sup className="ml-0.5 text-[0.6em] text-black/40 align-super">
                  †
                </sup>
              </p>

              <Link
                href={FUNNEL_URL}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
              >
                Save £120 + Free Shipping
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* 100-day guarantee with green check */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" fill="#10B981" />
                  <path
                    d="M8 12.5L10.5 15L16 9.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] text-black">
                  100-day money back guarantee
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. BRAND STORY ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="We created drinkable focus and clarity"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              <h2
                className="text-black font-semibold text-[34px] leading-[1.05] mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                We Created Drinkable
                <br />
                Focus and Clarity.
              </h2>

              <p className="text-[15px] leading-snug text-black mb-6">
                Over 6 years and £500,000+ of our own capital invested into
                clinical development and research with leading UK universities,
                professional sports clubs, and the military.
              </p>

              {/* Bottle hero shot. Transform crops most of the top white space
                  and aligns the bottles at the bottom of the visible frame. */}
              <div className="relative aspect-[5/4] overflow-hidden mb-6 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[12px]">
                <Image
                  src="/formulas/both/BothHero.jpg"
                  alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover object-center"
                  style={{
                    transform: "scale(1.5) translateY(-15%)",
                    transformOrigin: "center center",
                  }}
                />
              </div>

              {/* Two big stats — count up on scroll-in */}
              <div className="grid grid-cols-2 gap-4 mb-6 border-t border-black/10 pt-5">
                <div>
                  <AnimatedStat
                    target={150000}
                    suffix="+"
                    className="block text-black font-bold text-[28px] leading-tight tabular-nums"
                    style={{ letterSpacing: "-0.02em" }}
                  />
                  <div className="text-[12px] text-[#1B2757] mt-1 leading-tight font-medium">
                    shots sold to date
                  </div>
                </div>
                <div>
                  <AnimatedStat
                    target={500000}
                    prefix="£"
                    suffix="+"
                    className="block text-black font-bold text-[28px] leading-tight tabular-nums"
                    style={{ letterSpacing: "-0.02em" }}
                  />
                  <div className="text-[12px] text-[#1B2757] mt-1 leading-tight font-medium">
                    invested into research
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  href={FUNNEL_URL}
                  className="inline-flex items-center justify-center gap-2 bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
                >
                  Order Now
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Brain-research credibility badge — laurel-flanked award style.
                  The same /LaurelWreath.png renders on each side; container
                  width clips to roughly half so left container shows the left
                  branch, right container shows the right branch. */}
              <div className="mt-5 flex items-center gap-3 p-4 rounded-[12px] bg-black/[0.04]">
                <div
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{ width: "30px", height: "64px" }}
                  aria-hidden="true"
                >
                  <Image
                    src="/LaurelWreath.png"
                    alt=""
                    fill
                    sizes="80px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "left center",
                    }}
                  />
                </div>

                <div className="flex-1 text-center leading-snug">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-[#1B2757] font-bold mb-1">
                    One of the World&apos;s Largest
                  </div>
                  <div className="text-[13px] text-black font-semibold">
                    Consumer brain research project. 1,000+ brains tested
                    regularly through our app, unlocking a new level of
                    cognitive performance.
                  </div>
                </div>

                <div
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{ width: "30px", height: "64px" }}
                  aria-hidden="true"
                >
                  <Image
                    src="/LaurelWreath.png"
                    alt=""
                    fill
                    sizes="80px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "right center",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. CAFFEINE vs CONKA ===== */}
        {/* Soft-blue tint surface — pulled from `--brand-tint` (#f4f5f8),
            the same alternating background used by other clinical surfaces
            (FormulaCaseStudies, KeyBenefits, AthleteCredibility, etc). */}
        <section
          className="brand-section"
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            background: "var(--brand-tint)",
          }}
          aria-label="Caffeine borrows your energy. CONKA builds it."
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              <h2
                className="text-black font-semibold text-[34px] leading-[1.05] mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                Caffeine doesn&apos;t give you energy.
                <br />
                It <em className="italic">borrows</em> it.
              </h2>

              <p className="text-[15px] leading-snug text-black mb-6">
                Caffeine blocks the receptors that tell your brain it&apos;s
                tired. It hides the fatigue for a few hours, spikes cortisol,
                and hands both back to you at 11am. The second cup isn&apos;t
                a habit. It&apos;s the system working as designed.
              </p>

              {/* Stacked animated charts: coffee on top, CONKA below.
                  Each chart reveals left-to-right at the same horizontal
                  velocity so the eye reads them as the same day moving in
                  parallel — comparison is shape, not peak height. */}
              <div className="mb-6">
                <CaffeineCurves />
              </div>

              <p className="text-[15px] leading-snug text-black mb-6">
                CONKA works the other way. Sixteen nootropics and
                adaptogens do the heavy lifting: brain-boosting nutrients
                build the focus, stress-mitigating compounds keep cortisol
                in check. Energy that doesn&apos;t have to be paid back.
              </p>

              <div className="flex justify-center">
                <Link
                  href={FUNNEL_URL}
                  className="inline-flex items-center justify-center gap-2 bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
                >
                  Try CONKA
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Ingredient-class trust strip — mirrors Magic Mind's
                  under-CTA pattern and pays off the "nootropics and
                  adaptogens" line in the paragraph above. */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/NootropicsIcon.avif"
                    width={42}
                    height={42}
                    alt=""
                    aria-hidden
                  />
                  <div className="leading-tight">
                    <div className="text-[16px] font-bold text-black">
                      Nootropics
                    </div>
                    <div className="text-[13px] text-black/60">
                      brain-boosting
                    </div>
                  </div>
                </div>
                <div className="w-px h-12 bg-black/15" aria-hidden />
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/AdaptogensIcon.avif"
                    width={42}
                    height={42}
                    alt=""
                    aria-hidden
                  />
                  <div className="leading-tight">
                    <div className="text-[16px] font-bold text-black">
                      Adaptogens
                    </div>
                    <div className="text-[13px] text-black/60">
                      stress-mitigating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. INGREDIENTS ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
          aria-label="Fifteen active ingredients across Flow and Clear"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              <h2
                className="text-black font-semibold text-[34px] leading-[1.05] mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                15 Science-Backed
                <br />
                Ingredients.
              </h2>

              <p className="text-[15px] leading-snug text-black/75 mb-8">
                Every ingredient is dosed to match the peer-reviewed clinical
                research. Six years of development with leading UK
                universities and the military.
              </p>

              <IngredientsGrid />

              {/* Certification strip — Magic Mind-style trust badges above
                  the CTA. Icons live in /public/icons/ as AVIF. */}
              <div className="flex items-center justify-center gap-2 mt-10 mb-6 py-2">
                {[
                  { src: "/icons/VeganFriendlyIcon.avif", label: "Vegan" },
                  { src: "/icons/KosherCertifiedIcon.avif", label: "Kosher" },
                  { src: "/icons/BpaFreeIcon.avif", label: "BPA Free" },
                  {
                    src: "/icons/ThirdPartyTestedIcon.avif",
                    label: "Third party tested",
                  },
                ].map((cert) => (
                  <Image
                    key={cert.label}
                    src={cert.src}
                    width={80}
                    height={80}
                    alt={cert.label}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  href={FUNNEL_URL}
                  className="inline-flex items-center justify-center gap-2 bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
                >
                  Order Now
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* 100-day guarantee — mirrors the hero CTA's reassurance row. */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" fill="#10B981" />
                  <path
                    d="M8 12.5L10.5 15L16 9.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] text-black">
                  100-day money back guarantee
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
