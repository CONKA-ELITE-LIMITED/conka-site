"use client";

/**
 * funnel-c — Step 3 (Review). The moment of purchase, built as a RECEIPT.
 *
 * The receipt splits cleanly: the breakdown states the SHOTS (recurring volume
 * per formula, then the first-order bonus), and the line items state the MONEY
 * (plan, postage, extras, savings, total). Each figure appears exactly once.
 *
 * Then social proof (shots delivered + a rotating quote) and the CONKA app block.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
  getOfferPricing,
  getDisplayDiscount,
} from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";
import { cadenceDeliveryPeriod, cadencePriceSuffix } from "../defaults";

interface SummaryStepProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
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

  const display = FUNNEL_PRODUCTS[product];
  const pricing = getOfferPricing(product, cadence);
  const isSub = cadence !== "monthly-otp";
  const freeShots = pricing.freeShots ?? 0;
  const freeShotsValue = pricing.freeShotsValue ?? 0;
  const postageVal = cadence === "quarterly-sub" ? 29.97 : 9.99;
  const freq = cadencePriceSuffix(cadence);
  const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
  const savingsPct = getDisplayDiscount(pricing);
  const totalToday = isSub ? pricing.price : pricing.price + (pricing.postage ?? 0);

  // Shot matrix coded by formula. Both splits its shots across Flow + Clear.
  const FORMULA_COLOR: Record<"flow" | "clear", string> = { flow: "#C4892A", clear: "#0369a1" };
  const formulas: ("flow" | "clear")[] = product === "both" ? ["flow", "clear"] : [product as "flow" | "clear"];
  const pricedPer = product === "both" ? Math.round(pricing.shotCount / 2) : pricing.shotCount;
  const freePer = product === "both" ? Math.round(freeShots / 2) : freeShots;

  const period = cadenceDeliveryPeriod(cadence);
  const planLabel =
    cadence === "monthly-sub"
      ? "Monthly subscription"
      : cadence === "quarterly-sub"
        ? "Quarterly subscription"
        : "One-time purchase";

  // The line items are the MONEY. The shot counts live in the breakdown above
  // and are not repeated here: they were previously stated in the header, again
  // in the breakdown, and a third time as a line-item label.
  const items: { label: string; value: string; was?: string; free?: boolean }[] = [
    { label: planLabel, value: formatPrice(pricing.price) },
  ];
  items.push(
    isSub
      ? { label: "Postage", value: "Free", was: formatPrice(postageVal), free: true }
      : { label: "Postage (required)", value: formatPrice(pricing.postage ?? 0) },
  );
  items.push({ label: "CONKA app + Brain Coach", value: "Free", free: true });

  return (
    <div>
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        Your order.
      </h2>

      {/* ===== RECEIPT ===== */}
      <div className="rounded-[16px] border-2 border-black/85 bg-white p-5 mb-3">
        {/* Product header */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[19px] font-semibold text-black leading-tight">{display.label}</p>
          <span className="shrink-0 rounded-full bg-[#1B2757]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#1B2757]">
            {display.timeLabel}
          </span>
        </div>
        {/* What arrives. Recurring shots per formula (Both splits 50:50), then a
            single line for the first-order bonus.

            This was a matrix of up to 56 coloured dots, which nobody counts, so
            the reader went to the legend underneath anyway. It then stated the
            per-period shot count three times over (header, breakdown, line item).
            Once, here. */}
        <div className="mt-4 rounded-[12px] bg-black/[0.03] p-3.5">
          {formulas.map((f) => (
            <div
              key={f}
              className="flex items-baseline justify-between gap-3 py-1 text-[13px]"
            >
              <span className="font-semibold" style={{ color: FORMULA_COLOR[f] }}>
                {f === "flow" ? "Flow" : "Clear"}
              </span>
              <span className="tabular-nums text-black">
                <span className="font-bold">{pricedPer}</span> shots
                {isSub ? ` ${period}` : ""}
              </span>
            </div>
          ))}

          {freeShots > 0 && (
            <div className="flex items-start gap-2 border-t border-black/10 mt-2.5 pt-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" fill="#10B981" />
                <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[13px] leading-snug text-[#0b7a55]">
                <strong className="font-bold">+{freeShots} free shots</strong> on your first order
                {product === "both" && `, ${freePer} of each`}. Worth{" "}
                <span className="tabular-nums font-semibold">{formatPrice(freeShotsValue)}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Line items */}
        <div className="mt-5 space-y-2.5">
          {items.map((li) => (
            <div key={li.label} className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-black/70">{li.label}</span>
              <span className="tabular-nums whitespace-nowrap">
                {li.was && <span className="line-through text-black/30 mr-1.5">{li.was}</span>}
                <span className={li.free ? "font-semibold text-[#0b7a55]" : "text-black"}>
                  {li.value}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-black/20 mt-3 pt-3 text-[13px]">
            <span className="font-semibold text-black">You save</span>
            <span className="tabular-nums font-bold text-[#0b7a55]">
              −{formatPrice(savings)} <span className="font-semibold">({savingsPct}%)</span>
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-baseline justify-between gap-3 border-t-2 border-black/85 mt-3 pt-3.5">
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

      {/* ===== SOCIAL PROOF (flippable) ===== */}
      <div className="rounded-[16px] bg-black/[0.04] p-4 mb-3">
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
      <div className="rounded-[16px] border-2 border-black/85 bg-white overflow-hidden">
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
            <div key={s.label} className="rounded-[12px] bg-black/[0.04] text-center py-3">
              <p className="text-xl font-bold text-[#1B2757] tabular-nums leading-none">{s.value}</p>
              <p className="text-[11px] text-black/60 mt-1.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
