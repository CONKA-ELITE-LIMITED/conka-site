"use client";

/**
 * funnel-c — Step 3 (Review). The moment of purchase, built as a RECEIPT.
 *
 * Hero card = an itemised order receipt: product, a square-matrix visual of the
 * shots (priced vs free), price line items with FREE callouts, savings, and a
 * bold TOTAL. Then social proof (shots delivered + an athlete quote) and a
 * titled CONKA app block.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
  getOfferPricing,
  getSavingsPercent,
} from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

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
  const total = pricing.firstOrderShots ?? pricing.shotCount;
  const postageVal = cadence === "quarterly-sub" ? 29.97 : 9.99;
  const freq = cadence === "monthly-sub" ? "/mo" : cadence === "quarterly-sub" ? "/quarter" : "";
  const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
  const savingsPct = pricing.compareAtPrice ? getSavingsPercent(pricing.price, pricing.compareAtPrice) : 0;
  const totalToday = isSub ? pricing.price : pricing.price + (pricing.postage ?? 0);

  // Shot matrix coded by formula. Both splits its shots across Flow + Clear.
  const FORMULA_COLOR: Record<"flow" | "clear", string> = { flow: "#C4892A", clear: "#0369a1" };
  const formulas: ("flow" | "clear")[] = product === "both" ? ["flow", "clear"] : [product as "flow" | "clear"];
  const pricedPer = product === "both" ? Math.round(pricing.shotCount / 2) : pricing.shotCount;
  const freePer = product === "both" ? Math.round(freeShots / 2) : freeShots;

  const shotsLabel =
    cadence === "monthly-sub" ? `${pricing.shotCount} shots / month` : cadence === "quarterly-sub" ? `${pricing.shotCount} shots / quarter` : `${pricing.shotCount} shots`;

  const items: { label: string; value: string; was?: string; free?: boolean }[] = [
    { label: shotsLabel, value: formatPrice(pricing.price) },
  ];
  if (freeShots > 0) items.push({ label: `${freeShots} bonus shots`, value: "Free", was: formatPrice(freeShotsValue), free: true });
  items.push(
    isSub
      ? { label: "Postage", value: "Free", was: formatPrice(postageVal), free: true }
      : { label: "Postage (required)", value: formatPrice(pricing.postage ?? 0) },
  );
  items.push({ label: "CONKA app + Brain Coach", value: "Free", free: true });

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">Step 03 · Review</p>
      <h2 className="text-xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5" style={{ color: "var(--brand-black)" }}>
        Your order
      </h2>

      {/* ===== RECEIPT ===== */}
      <div className="border-2 border-[var(--brand-black)] bg-white p-5 mb-3">
        {/* Product header */}
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">Order summary</p>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1B2757] bg-[#1B2757]/[0.07] px-2 py-1">
            {display.timeLabel}
          </span>
        </div>
        <p className="text-xl font-semibold text-[var(--brand-black)] mt-1.5 leading-tight">{display.label}</p>
        <p className="text-[13px] text-black/55 mt-1">
          {isSub ? `${shotsLabel}${freeShots > 0 ? ` · +${freeShots} free on your first order` : ""}` : `${pricing.shotCount} shots · one-time`}
        </p>

        {/* Shot matrix — coded by formula; filled = paid, outlined = free */}
        <div className="mt-4 space-y-2">
          {formulas.map((f) => {
            const color = FORMULA_COLOR[f];
            return (
              <div key={f} className="flex items-start gap-2.5">
                {product === "both" && (
                  <span
                    className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] w-9 shrink-0 pt-0.5"
                    style={{ color }}
                  >
                    {f === "flow" ? "Flow" : "Clear"}
                  </span>
                )}
                <div className="flex flex-wrap gap-[3px]">
                  {Array.from({ length: pricedPer }).map((_, i) => (
                    <span key={`p${i}`} className="h-2.5 w-2.5" style={{ backgroundColor: color }} aria-hidden />
                  ))}
                  {freePer > 0 && (
                    <>
                      <span className="mx-1 w-px self-stretch bg-black/15" aria-hidden />
                      {Array.from({ length: freePer }).map((_, i) => (
                        <span key={`f${i}`} className="h-2.5 w-2.5 bg-[#1a7f4f]" aria-hidden />
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-black/60">
            <span className="h-2.5 w-2.5 bg-black/70" /> {pricing.shotCount} shots
          </span>
          {freeShots > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[#1a7f4f] font-medium">
              <span className="h-2.5 w-2.5 bg-[#1a7f4f]" /> +{freeShots} free → {total} total
            </span>
          )}
        </div>

        {/* Line items */}
        <div className="mt-5 space-y-2.5">
          {items.map((li) => (
            <div key={li.label} className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-black/65">{li.label}</span>
              <span className="font-mono tabular-nums whitespace-nowrap">
                {li.was && <span className="line-through text-black/30 mr-1.5">{li.was}</span>}
                <span className={li.free ? "text-[#1a7f4f] font-semibold uppercase tracking-[0.06em]" : "text-[var(--brand-black)]"}>
                  {li.value}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-black/20 mt-3 pt-3 text-[13px]">
            <span className="font-semibold text-[#1B2757]">You save</span>
            <span className="font-mono tabular-nums font-semibold text-[#1B2757]">
              −{formatPrice(savings)} <span className="text-[11px]">({savingsPct}%)</span>
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-baseline justify-between gap-3 border-t-2 border-[var(--brand-black)] mt-3 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">Total today</span>
          <span className="text-3xl font-bold tabular-nums text-[var(--brand-black)] leading-none">
            {formatPrice(totalToday)}
            <span className="text-base font-medium text-black/45">{freq}</span>
          </span>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40 mt-3 text-right">
          Ships in 2–3 days{isSub ? " · cancel anytime" : ""}
        </p>
      </div>

      {/* ===== SOCIAL PROOF (flippable) ===== */}
      <div className="border border-black/10 bg-[var(--brand-tint)] p-4 mb-3">
        <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-black/8">
          <div>
            <p className="text-2xl font-bold text-[var(--brand-black)] tabular-nums leading-none">{SOLD}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 mt-1.5">shots delivered</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => goTestimonial(ti - 1)}
              className="text-black/45 hover:text-black/75 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="font-mono text-[9px] tabular-nums text-black/45">{ti + 1} / {TESTIMONIALS.length}</span>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => goTestimonial(ti + 1)}
              className="text-black/45 hover:text-black/75 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div className="flex gap-3 min-h-[96px]">
          <div className="shrink-0 w-12 h-12 bg-white overflow-hidden">
            <Image src={t.image} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <Stars />
            <p className="text-[13px] text-black/70 leading-snug italic mt-1.5">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-[12px] font-semibold text-[var(--brand-black)] mt-1.5">
              {t.name} <span className="font-normal text-black/45">· {t.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ===== APP BLOCK ===== */}
      <div className="border border-black/10 bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-black/8 bg-[var(--brand-tint)]">
          <p className="text-sm font-semibold text-[var(--brand-black)]">Track it. Watch it work.</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40 mt-0.5">
            The CONKA app · iOS &amp; Google Play · free with your plan
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
            <p className="text-[13px] text-black/65 leading-relaxed">
              A 60-second test sets your baseline. Take CONKA daily and{" "}
              <span className="text-[var(--brand-black)] font-medium">watch your cognitive score climb</span> — the trend is
              right there in the app.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 mt-3 mb-2">
              What members are seeing
            </p>
            <div className="space-y-1.5">
              {APP_INSIGHTS.map((insight) => (
                <div key={insight} className="flex items-start gap-2 text-[12px] text-black/70">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                  <span className="leading-snug">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Real app usage — proof people track results */}
        <div className="grid grid-cols-3 border-t border-black/8 divide-x divide-black/8">
          {APP_STATS.map((s) => (
            <div key={s.label} className="text-center py-3">
              <p className="text-xl font-bold text-[#1B2757] tabular-nums leading-none">{s.value}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-black/45 mt-1.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
