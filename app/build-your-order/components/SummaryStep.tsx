"use client";

/**
 * Build Your Order — Step 3 (Review). The moment of purchase, built as a RECEIPT.
 *
 * The receipt is the product header, the same "what you get" list the Build
 * step's plan box shows (PlanSummaryList, so the two can never tell different
 * stories), and the all-in total. Then social proof (shots delivered + a
 * rotating quote) and the CONKA app block.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  type ByoProduct,
  type ByoCadence,
  BYO_PRODUCTS,
  getChargedPrice,
  getOfferPricing,
} from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";
import { cadencePriceSuffix } from "../defaults";
import { PlanSummaryList } from "./CadenceSelector";
import { getBoxImage } from "./ByoMedia";

interface SummaryStepProps {
  product: ByoProduct;
  cadence: ByoCadence;
}

const SOLD = "150,000+";

// Verbatim from the site's data — 2 athletes (testimonials.data.ts) + 2
// verified customers (reviews.data.ts). Do NOT paraphrase attributed quotes.
const TESTIMONIALS = [
  {
    image: "/lander/athletes/FraserDingwallNB.jpg",
    name: "Fraser Dingwall",
    role: "England Rugby Player",
    quote:
      "I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.",
  },
  {
    image: "/lander/athletes/ChrisBillamSmithNB.jpg",
    name: "Chris Billam-Smith",
    role: "WBO Cruiserweight World Champion",
    quote:
      "Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.",
  },
  {
    image: "/lander/reviews/PhilB.jpg",
    name: "Phil B.",
    role: "Verified customer",
    quote:
      "I was getting through the day on five coffees and still hitting a wall by 4pm. Sleep was terrible, the cycle just kept repeating. Swapped my afternoon coffees for Flow and the difference was immediate.",
  },
  {
    image: "/lander/reviews/AnkitaK.jpg",
    name: "Ankita K.",
    role: "Verified customer",
    quote:
      "I think it's pretty easy to be sceptical of a product that says it can boost your brain in a shot. But the only way to test that scepticism was to try it for myself. And honestly, I'm glad I did.",
  },
];
// Real app usage from the site's app-insights dataset (appInsightsData.ts).
const APP_STATS = [
  { value: "7,593", label: "tests logged" },
  { value: "712", label: "members" },
  { value: "30mo", label: "of data" },
];

// Verbatim finding headlines from the app-insights dataset (appInsightsData.ts).
const APP_INSIGHTS = [
  "Faster reaction times on CONKA days",
  "CONKA users hold their level when others drop",
  "The gains track with CONKA, not caffeine",
];

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#C4892A]" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l2.9 6.3L22 9.2l-5 4.9 1.2 7L12 17.8 5.8 21l1.2-7-5-4.9 7.1-.9z" />
        </svg>
      ))}
    </span>
  );
}

export default function SummaryStep({ product, cadence }: SummaryStepProps) {
  const [ti, setTi] = useState(0);
  const [autoKey, setAutoKey] = useState(0);
  const t = TESTIMONIALS[ti];

  // Auto-advance the testimonials every 4s. Bumping autoKey (on manual nav)
  // restarts the timer; reduced-motion users get no auto-rotation.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTi((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, [autoKey]);

  const goTestimonial = (next: number) => {
    setTi((next + TESTIMONIALS.length) % TESTIMONIALS.length);
    setAutoKey((k) => k + 1);
  };

  const display = BYO_PRODUCTS[product];
  const box = getBoxImage(product, cadence);
  const pricing = getOfferPricing(product, cadence);
  const isSub = cadence !== "monthly-otp";
  const freq = cadencePriceSuffix(cadence);
  // The all-in figure: subscriptions ship free, one-time carries postage.
  const totalToday = isSub ? pricing.price : getChargedPrice(pricing);

  return (
    <div>
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        Your order.
      </h2>

      {/* ===== RECEIPT ===== */}
      <div className="rounded-md ring-1 ring-black/10 bg-white overflow-hidden mb-3">
        {/* The order, shown: the box-and-bottle photo IS the receipt's header
            (SCRUM-1249 review) — what arrives on the doormat, not a label.
            Mobile only: on desktop the same photo owns the sticky media
            column, so repeating it inside the receipt reads as a bug. */}
        <div className="relative aspect-[3/2] w-full bg-[#f1f1f3] lg:hidden">
          <Image
            src={box.src}
            alt={box.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
        <div className="p-5">
        {/* Product name — the photo shows the delivery, this names it. */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[19px] font-semibold text-black leading-tight">{display.label}</p>
          <span className="shrink-0 rounded-full bg-black/[0.06] px-2.5 py-1 text-[11px] font-semibold text-black/70">
            {display.timeLabel}
          </span>
        </div>
        {/* What the plan delivers — the same list as the Build step's
            "Your subscription" box (PlanSummaryList), so the receipt and the
            plan selector can never tell different stories (SCRUM-1249). */}
        <PlanSummaryList product={product} cadence={cadence} />

        {/* Total */}
        <div className="flex items-baseline justify-between gap-3 border-t-2 border-black/20 mt-3 pt-3.5">
          <span className="text-[15px] font-semibold text-black">Total today</span>
          <span className="text-[30px] font-bold tabular-nums text-black leading-none">
            {formatPrice(totalToday)}
            <span className="text-[15px] font-medium text-black/50">{freq}</span>
          </span>
        </div>
        <p className="text-[12px] text-black/50 mt-3 text-right">
          Ships in 2 to 3 days{isSub ? " · cancel anytime" : ""}
        </p>
        </div>
      </div>

      {/* ===== SOCIAL PROOF (flippable) ===== */}
      <div className="rounded-md bg-black/[0.04] p-4 mb-3">
        <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-black/10">
          <div>
            <p className="text-2xl font-bold text-black tabular-nums leading-none">{SOLD}</p>
            <p className="text-[12px] text-black/55 mt-1.5">shots delivered</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => goTestimonial(ti - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-black/50 hover:bg-black/[0.06] hover:text-black transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-[12px] tabular-nums text-black/50">{ti + 1} / {TESTIMONIALS.length}</span>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => goTestimonial(ti + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-black/50 hover:bg-black/[0.06] hover:text-black transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div className="flex gap-3 min-h-[96px]">
          <div className="shrink-0 w-12 h-12 rounded-full bg-white overflow-hidden">
            <Image src={t.image} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <Stars />
            <p className="text-[13px] text-black/80 leading-snug italic mt-1.5">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-[12px] font-semibold text-black mt-1.5">
              {t.name} <span className="font-normal text-black/50">· {t.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ===== APP BLOCK ===== */}
      <div className="rounded-md ring-1 ring-black/10 bg-white overflow-hidden">
        <div className="px-4 pt-4">
          <p className="text-[17px] font-semibold text-black">Track it. Watch it work.</p>
          <p className="text-[13px] text-black/60 mt-1">
            The CONKA app, free with your plan. iOS and Google Play.
          </p>
        </div>

        <div className="flex gap-4 p-4">
          <Image
            src="/app/AppConkaRing.png"
            alt="CONKA app — daily brain-performance score"
            width={72}
            height={155}
            className="shrink-0 w-[72px] h-auto self-start"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-black/75 leading-relaxed">
              A 60-second test sets your baseline. Take CONKA daily and{" "}
              <span className="text-black font-semibold">watch your score climb</span>. The trend is
              right there in the app.
            </p>
            <p className="text-[13px] font-semibold text-black mt-3 mb-2">
              What members are seeing
            </p>
            <div className="space-y-1.5">
              {APP_INSIGHTS.map((insight) => (
                <div key={insight} className="flex items-start gap-2 text-[12px] text-black/75">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                    <path d="M5 12.5L10 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="leading-snug">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real app usage — proof people track results */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          {APP_STATS.map((s) => (
            <div key={s.label} className="rounded-md bg-black/[0.04] text-center py-3">
              <p className="text-xl font-bold text-black tabular-nums leading-none">{s.value}</p>
              <p className="text-[11px] text-black/60 mt-1.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
