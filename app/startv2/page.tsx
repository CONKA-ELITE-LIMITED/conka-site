import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import { FUNNEL_URL } from "@/app/lib/landingConstants";

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
      </main>
      <Footer />
    </div>
  );
}
