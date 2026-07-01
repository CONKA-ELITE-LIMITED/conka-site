import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import CROResearch from "@/app/components/cro/CROResearch";
import CROAppCallout from "@/app/components/cro/CROAppCallout";
import CROFAQv2 from "@/app/components/cro/CROFAQv2";
import { FUNNEL_URL } from "../lib/landingConstants";
import { getCadencePricingByProductHeroId } from "../lib/cadenceData";
import AnimatedStat from "./AnimatedStat";
import CrashChart from "@/app/components/landing/CrashChart";
import BottleVideo from "@/app/components/landing/BottleVideo";
import MetaViewContent from "@/app/components/MetaViewContent";
import { getOfferVariant, getOfferPricing } from "../lib/funnelData";

// Code-split below-the-fold island: hydration drops out of initial TBT window.
const IngredientsGrid = dynamic(() => import("./IngredientsGrid"), {
  loading: () => <div className="min-h-[1100px]" />,
});

// Section 5 buy-box card. Same dynamic-import pattern as IngredientsGrid: SSR
// preserved so the price + spec list render in the initial HTML; the toggle's
// JS hydration is deferred so its long task lands outside the TBT window.
// Offer-trial (B): the dual offer block (Both bundle + single Flow/Clear toggle)
// shared with /lander-b. Same dynamic-import pattern so the cards render in the
// initial HTML but their toggle hydration stays out of the TBT window.
const OfferCards = dynamic(
  () => import("../lander-b/sections/BuyBoxes/OfferCards"),
  { loading: () => <div className="min-h-[700px]" /> },
);

// Section 6 athlete credibility carousel. Shared CRO component reused via
// import (no edits). Dynamic-imported so its carousel hydration stays off the
// initial bundle.
const CROAthletes = dynamic(
  () => import("@/app/components/cro/CROAthletes"),
  { loading: () => <div className="min-h-[1100px]" /> },
);

// Section 8 customer reviews. Shared CRO component. Dynamic-imported so the
// 3x-render carousel, auto-advance interval, and touch-swipe handlers stay
// off the initial bundle.
const CROCustomerReviews = dynamic(
  () => import("@/app/components/cro/CROCustomerReviews"),
  { loading: () => <div className="min-h-[680px]" /> },
);

export const metadata: Metadata = {
  title: "Try CONKA | Daily Nootropic Brain Shots",
  description:
    "Two shots a day. 16 active ingredients. Informed Sport certified. Try CONKA Flow and Clear with a 100-day money-back guarantee.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://www.conka.io/start",
  },
  openGraph: {
    title: "Try CONKA | Daily Nootropic Brain Shots",
    description:
      "Two shots a day. 16 active ingredients. Informed Sport certified. Start your daily brain performance routine.",
  },
};

const AVATAR_COUNT = 5;

const BOTH_PRODUCT_HERO_ID = "03";

// Section 5 buy-box pricing math. Pulled at render-time from the shared
// cadence/funnel data so the savings figure stays in lockstep with the
// /funnel and /conka-both buy boxes.
const S5_SUB_PRICING = getCadencePricingByProductHeroId(
  BOTH_PRODUCT_HERO_ID,
  "monthly-sub",
);
const S5_OTP_PRICING = getCadencePricingByProductHeroId(
  BOTH_PRODUCT_HERO_ID,
  "monthly-otp",
);
// Offer-trial (B): the hero CTA advertises the LOWEST per-shot price across Both
// plans, which is the quarterly subscription. Derived (not hardcoded) so it stays
// in lockstep with the offer data.
const S5_QUARTERLY_PRICING = getCadencePricingByProductHeroId(
  BOTH_PRODUCT_HERO_ID,
  "quarterly-sub",
);
const S5_LOWEST_PER_SHOT = S5_QUARTERLY_PRICING.perShot;
const S5_COMPARE_AT = S5_SUB_PRICING.compareAtPrice ?? S5_OTP_PRICING.price;
const S5_MONTHLY_SAVINGS = Math.max(0, S5_COMPARE_AT - S5_SUB_PRICING.price);
const S5_SAVINGS_PERCENT =
  S5_COMPARE_AT > 0
    ? Math.round((S5_MONTHLY_SAVINGS / S5_COMPARE_AT) * 100)
    : 0;

const S5_TRUST_BADGES = [
  { line1: "Informed", line2: "Sport" },
  { line1: "University", line2: "Research" },
  { line1: "No", line2: "Caffeine" },
  { line1: "100-Day", line2: "Guarantee" },
];

// Section 6 sport-breadth marquee. Broader than the 7-athlete roster on
// purpose — captures the full range of sports CONKA athletes compete in
// rather than only the sports we have signed quotes for. Verify each
// entry against the actual roster before launch.
const S6_SPORTS = [
  "Premiership Rugby",
  "WBO Boxing",
  "NFL",
  "Showjumping",
  "Motorsport",
  "Rugby Sevens",
  "MMA",
  "Mountain Biking",
  "Football",
  "Olympic Track",
  "NHL",
  "Triathlon",
  "British GT",
  "Athletics",
  "Ultramarathon",
];

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)] overflow-x-hidden">
      {/* Meta ViewContent for paid traffic — start-b previously fired only
          PageView, leaving Meta blind mid-funnel. */}
      <MetaViewContent
        variantIds={[getOfferVariant("both", "monthly-sub")?.variantId ?? ""]}
        value={getOfferPricing("both", "monthly-sub").price}
        contentName="CONKA – Flow & Clear"
      />
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
                  src="/formulas/both/BothHero.jpg"
                  alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover object-center"
                  style={{
                    transform: "scale(1.4) translateY(-10%)",
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
                A Sharper Mind.
                <br />
                Morning to Evening.
              </h1>

              <p className="text-[15px] leading-snug text-black mb-5">
                For minds that demand more. A patented nootropic shot, clinically
                formulated to support focus, memory, and mental endurance every day.
              </p>

              <Link
                href={FUNNEL_URL}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
              >
                Get both from £{S5_LOWEST_PER_SHOT.toFixed(2)}/shot
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

              {/* Bottle hero — rotating Flow render. 4:5 portrait, plays on
                  scroll-into-view and ping-pong loops. See
                  `app/components/landing/BottleVideo.tsx` for the
                  IntersectionObserver trigger and source ordering. */}
              <div className="relative aspect-[4/5] overflow-hidden mb-6 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[12px] bg-black/[0.04]">
                <BottleVideo formula="flow" />
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

              {/* Steady-vs-crash chart + cost comparison, sharp clinical container */}
              <div className="mb-6">
                <CrashChart sharp />
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

        {/* ===== 5. BUY BOX ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="Your complete daily routine"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              {/* Auto-discount eyebrow. Static copy mirroring the savings math
                  rendered in the buy-box card below. */}
              <div className="flex items-start gap-3 p-4 mb-6 bg-white border-2 border-black/85 rounded-[16px]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="flex-shrink-0 mt-0.5"
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
                <p className="text-[13px] text-black leading-snug">
                  <strong className="font-semibold">
                    Subscription auto-applied.
                  </strong>{" "}
                  {S5_SUB_PRICING.freeShots
                    ? `Get started with ${S5_SUB_PRICING.freeShots} free shots on your first order — plus ${S5_SAVINGS_PERCENT}% off, free UK shipping, and full access to the CONKA brain performance app.`
                    : S5_SAVINGS_PERCENT > 0
                    ? `You will get ${S5_SAVINGS_PERCENT}% off, free UK shipping, and full access to the CONKA brain performance app.`
                    : "You will get free UK shipping and full access to the CONKA brain performance app."}
                </p>
              </div>

              <h2
                className="text-black font-semibold text-[34px] leading-[1.05] mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                Your <em className="italic">Complete</em>
                <br />
                Daily Routine.
              </h2>

              <p className="text-[15px] leading-snug text-black mb-8">
                Flow in the morning. Clear in the afternoon. Two shots a day,
                every day of the month.
              </p>

              {/* Trust badges — circular stamps, differentiated from Section 4's
                  cert strip (Vegan / Kosher / BPA / 3rd party). Plain inline
                  divs (no images) so this row adds zero asset weight. */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {S5_TRUST_BADGES.map((badge) => (
                  <div
                    key={badge.line1 + badge.line2}
                    className="aspect-square rounded-full border-2 border-black/85 flex items-center justify-center px-1"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-tight leading-[1.15] text-center text-black/85">
                      <div>{badge.line1}</div>
                      <div>{badge.line2}</div>
                    </div>
                  </div>
                ))}
              </div>

              <OfferCards source="start_page_b" />
            </div>
          </div>
        </section>

        {/* ===== 6. ATHLETE CREDIBILITY ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="Trusted at the highest level"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              {/* Sport-breadth marquee. Reuses the `marquee` keyframe from
                  globals.css. Renders the sport list twice and translates -50%
                  so the loop is seamless. Pushed to full viewport bleed with
                  the `50% - 50vw` margin trick so the dark strip overrides
                  the section gutter on every breakpoint. `motion-safe:`
                  variant guards against `prefers-reduced-motion`. Screen
                  readers get a single comma-joined list via sr-only. */}
              <div className="relative overflow-hidden bg-[#1B2757] py-3 mb-8 w-screen ml-[calc(50%-50vw)]">
                <span className="sr-only">
                  CONKA athletes compete in: {S6_SPORTS.join(", ")}.
                </span>
                <div
                  className="inline-flex whitespace-nowrap [will-change:transform] motion-safe:animate-[marquee_60s_linear_infinite]"
                  aria-hidden="true"
                >
                  {[...S6_SPORTS, ...S6_SPORTS].map((sport, i) => (
                    <span
                      key={`${sport}-${i}`}
                      className="inline-flex items-center text-[12px] uppercase tracking-[0.18em] font-semibold text-white"
                    >
                      <span>{sport}</span>
                      <span className="mx-5 text-white" aria-hidden="true">
                        ★
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <CROAthletes />

              <div className="mt-10 flex justify-center">
                <Link
                  href={FUNNEL_URL}
                  className="inline-flex items-center justify-center gap-2 bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
                >
                  Join the Elite
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

        {/* ===== 7. RESEARCH / CAMBRIDGE ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="World-class research, world-class results"
        >
          <div className="brand-track">
            <div className="mx-auto max-w-[560px]">
              <CROResearch />

              <div className="mt-10 flex justify-center">
                <Link
                  href={FUNNEL_URL}
                  className="inline-flex items-center justify-center gap-2 bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
                >
                  Try CONKA Today
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

        {/* ===== 8. CUSTOMER REVIEWS ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="Real people. Real results."
        >
          <div className="brand-track">
            {/* Keep this section's CTA on the same funnel as the page's
                primary CTAs (funnel-c) — FUNNEL_URL is start-b's trial-b copy. */}
            <CROCustomerReviews ctaHref={FUNNEL_URL} />
          </div>
        </section>

        {/* ===== 9. APP CALLOUT ===== */}
        {/* Soft-blue tint surface — same `var(--brand-tint)` used by S3. Gives
            the page a second register-break after the long white run from
            S4 onwards. */}
        <section
          className="brand-section"
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            background: "var(--brand-tint)",
          }}
          aria-label="We don't ask if CONKA works, we measure it"
        >
          <div className="brand-track">
            <CROAppCallout />
          </div>
        </section>

        {/* ===== 10. FAQ ===== */}
        <section
          className="brand-section brand-bg-white"
          style={{ paddingTop: 0, paddingBottom: "4rem" }}
          aria-label="Still wondering?"
        >
          <div className="brand-track">
            <CROFAQv2 />
          </div>
        </section>
      </main>
      <Footer />
      {/* Real-user Core Web Vitals for this variant (L8) — measure against the
          other /start variants on field data. */}
      <SpeedInsights />
    </div>
  );
}
