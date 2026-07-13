"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice, type FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import {
  TrustIconGuarantee,
  TrustIconShipping,
  TrustIconCancel,
} from "@/app/components/landing/icons";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import FreeShotsBadge from "@/app/components/FreeShotsBadge";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import HeroAccordions from "./HeroAccordions";
import IngredientBottomSheet from "./IngredientBottomSheet";

/* ============================================================================
 * ProductBuyPanel (+ TrustStrip)
 *
 * The IM8-style buy box used on the PDPs (Flow / Clear / Both), a duplicate of
 * the listicle buy box (app/components/go/listicle/ListicleProductHero) adapted
 * for the PDP: shots-per-day and the first key benefit derive from the product,
 * so it reads correctly on the single-shot Flow/Clear pages as well as Both.
 * Shared by ProductHero (desktop) and ProductHeroMobile so the two stay in step.
 * ========================================================================== */

export interface ProductBuyPanelProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
  /** Mobile renders the hero header (rating + title) above the image itself,
      so the panel skips it to avoid a duplicate (SCRUM-1138). */
  hideHeader?: boolean;
}

/**
 * The PDP hero header: rating line, eyebrow, and the SEO <h1> (product name plus
 * a keyword subline). Exported so ProductHeroMobile can render it above the image
 * carousel, while ProductBuyPanel renders it inline on desktop (SCRUM-1138).
 */
export function ProductHeroHeader({
  formulaId,
  showSubline = true,
  showHeadline = true,
}: {
  formulaId: ProductHeroId;
  /** Desktop keeps the keyword subline inside the <h1>. Mobile drops it below the
      image (rendered by ProductHeroLede), so it is suppressed here. */
  showSubline?: boolean;
  showHeadline?: boolean;
}) {
  const content = getHeroContent(formulaId);
  return (
    <>
      {/* Stars + review/usage counts in one compact line */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1B2757]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-bold text-black">
          4.7 <span className="font-semibold">from 622+ Reviews</span>
        </span>
        <span className="text-sm text-black/50">· 5,000+ daily users</span>
      </div>

      {/* Eyebrow + product name. On desktop the keyword subline sits inside the
          <h1>; on mobile it drops below the image via ProductHeroLede. */}
      <div>
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
          Daily Nootropic Brain Shots
        </p>
        <h1 className="leading-tight">
          <span
            className="brand-h1 block lg:!text-[2.25rem]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {content.name}
          </span>
          {showSubline && content.seoHeading && (
            <span className="mt-1.5 block text-base font-medium leading-snug text-black/65 md:text-lg">
              {content.seoHeading}
            </span>
          )}
        </h1>
        {showHeadline && (
          <p className="mt-2 text-sm leading-relaxed text-black/75 md:text-base">
            {content.headline}
          </p>
        )}
      </div>
    </>
  );
}

/**
 * Mobile-only lede shown directly below the hero image: the keyword subline (as an
 * h2, since the <h1> product name sits above the image) followed by the short
 * description. Keeps the descriptive copy off the top of the hero (SCRUM-1138).
 */
export function ProductHeroLede({ formulaId }: { formulaId: ProductHeroId }) {
  const content = getHeroContent(formulaId);
  return (
    <div>
      {content.seoHeading && (
        <h2 className="text-lg font-medium leading-snug text-black/70">
          {content.seoHeading}
        </h2>
      )}
      <p className="mt-2 text-sm leading-relaxed text-black/75 md:text-base">
        {content.headline}
      </p>
    </div>
  );
}

const SUB_CADENCES: CadenceType[] = ["quarterly-sub", "monthly-sub"];

/** Which ingredient-sheet tabs each product surfaces (Both shows both). */
const FORMULA_TABS: Record<"flow" | "clear" | "both", ("flow" | "clear")[]> = {
  flow: ["flow"],
  clear: ["clear"],
  both: ["flow", "clear"],
};

/** What's included with every plan (same on all). No prices — these are the
 *  baked-in extras, distinct from the earnable app rewards below. */
const PLAN_INCLUDED = [
  "Free baseline brain test",
  "Free UK shipping",
  "Cancel or pause anytime",
  "100-day money-back guarantee",
];

/** App bullets — mirrors CartAppGift (the cart-drawer app block), trimmed. */
const APP_BULLETS = [
  "Daily brain performance score, tracked over time",
  "Personalised insights from your shots and test results",
  "Weekly and monthly reports analysing your progress",
];

/** Rewards you can UNLOCK in the app (not guaranteed on purchase). Values are
 *  shown struck-through to signal worth. */
interface AppReward {
  name: string;
  value: string;
  img?: string;
}
const APP_REWARDS: AppReward[] = [
  { name: "Conka Beanie", value: "£25", img: "/app/rewards/ConkaBlackBeanie.jpg" },
  { name: "Conka Shirt", value: "£20", img: "/app/rewards/ConkaBlackTshirt.png" },
  { name: "Conka Cap", value: "£15", img: "/app/rewards/ConkaTruckerCap.png" },
];

function RewardTile({ reward }: { reward: AppReward }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden border border-black/[0.06] bg-black/[0.03]">
        {reward.img ? (
          <Image
            src={reward.img}
            alt={reward.name}
            fill
            className="object-contain p-1"
            sizes="80px"
          />
        ) : (
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-black/25">
            Reward
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] font-bold tabular-nums text-black/45 line-through">
        {reward.value}
      </span>
      <span className="text-[11px] font-medium leading-tight text-black/70">
        {reward.name}
      </span>
    </div>
  );
}

/** Circle radio that matches the IM8 plan-card selector. */
function Radio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition-colors ${
        selected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
      }`}
      aria-hidden
    >
      {selected && (
        <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
          <path
            d="M2.5 8.5L6.5 12L13.5 4"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

/** "The CONKA app" section — full width inside the plan card (no nested box). */
function PlanAppGift() {
  return (
    <div className="mt-4 border-t border-black/10 pt-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
          Also included — the CONKA app
        </p>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.05em] text-black/35 line-through">
            £119.99/yr
          </span>
          <span className="bg-[#1B2757] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white">
            Free
          </span>
        </span>
      </div>
      <div className="mt-2.5 flex gap-3.5">
        <Image
          src="/app/AppConkaRing.png"
          alt="CONKA app showing daily brain performance score"
          width={56}
          height={120}
          className="h-auto w-14 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          {APP_BULLETS.map((bullet) => (
            <div key={bullet} className="flex gap-2">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5 shrink-0 text-[#1B2757]"
                aria-hidden
              >
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
              <p className="text-[13px] leading-snug text-black/80">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Selected-card detail: what's included, the app section, expandable rewards. */
function PlanDetail() {
  return (
    <div className="border-t border-black/10 px-4 pb-4 pt-4">
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
        What&apos;s included
      </p>
      <ul className="flex flex-col gap-1.5">
        {PLAN_INCLUDED.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[13px] font-medium text-black/75"
          >
            <span className="text-[#1B2757]" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <PlanAppGift />

      <details className="mt-4 border-t border-black/10 pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1B2757]">
            Rewards you can unlock in the app
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="flex-shrink-0 text-black/40 transition-transform [details[open]_&]:rotate-180"
            aria-hidden
          >
            <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {APP_REWARDS.map((reward) => (
            <RewardTile key={reward.name} reward={reward} />
          ))}
        </div>
        <p className="mt-3 text-[11px] font-medium leading-snug text-black/45">
          Exclusive for subscribers.
        </p>
      </details>
    </div>
  );
}

function PlanSelector({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onOtpAddToCart,
  shotsPerDay,
}: Omit<ProductBuyPanelProps, "onAddToCart"> & { shotsPerDay: number }) {
  const otpPricing = getCadencePricingByProductHeroId(formulaId, "monthly-otp");
  const otpSelected = selectedCadence === "monthly-otp";

  return (
    <div className="flex flex-col gap-3">
      {SUB_CADENCES.map((cadence) => {
        const display = FUNNEL_CADENCES[cadence];
        const isSelected = selectedCadence === cadence;
        const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
        const monthsPerCycle = cadence === "quarterly-sub" ? 3 : 1;
        const perMonth = pricing.price / monthsPerCycle;
        const weeksPerCycle = monthsPerCycle * 4;
        const bannerLabel = display.badge;
        const savePct = pricing.compareAtPrice
          ? Math.round((1 - pricing.price / pricing.compareAtPrice) * 100)
          : 0;

        return (
          <div
            key={isSelected ? `active-${cadence}` : cadence}
            className={`relative w-full select-none overflow-hidden border-2 bg-white transition-all duration-200 ${
              isSelected
                ? "card-pulse border-[#1B2757] shadow-md"
                : "border-black/10 shadow-sm hover:border-black/25"
            }`}
          >
            {bannerLabel && (
              <span className="absolute right-0 top-0 z-10 bg-[#1B2757] px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                {bannerLabel}
              </span>
            )}

            <button
              type="button"
              onClick={() => onCadenceChange(cadence)}
              className="block w-full px-4 pb-4 pt-4 text-left"
            >
              <div className="flex items-center gap-2.5 pr-20">
                <Radio selected={isSelected} />
                <span className="text-lg font-bold leading-none text-[var(--brand-black)]">
                  {display.label}
                </span>
                {savePct > 0 && (
                  <span className="bg-[#C9A24A] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                    Save {savePct}%
                  </span>
                )}
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-[28px] font-medium leading-none tabular-nums text-[var(--brand-black)]">
                  {formatPrice(perMonth)}
                </span>
                <span className="text-sm font-semibold text-black/55">/mo</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tabular-nums tracking-[0.08em] text-black">
                  {formatPrice(pricing.price)} every {weeksPerCycle} weeks
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tabular-nums tracking-[0.08em] text-black">
                  {formatPrice(pricing.perShot)} / shot
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] uppercase tabular-nums tracking-[0.08em] text-black">
                {pricing.shotCount} shots · {shotsPerDay} a day
              </p>
              <FreeShotsBadge freeShots={pricing.freeShots} cadence={cadence} className="mt-2.5" />
            </button>

            {isSelected && <PlanDetail />}
          </div>
        );
      })}

      {/* One-time purchase demoted to a text link; adds straight to cart */}
      <button
        type="button"
        onClick={onOtpAddToCart}
        className={`mx-auto mt-1 w-fit text-center text-sm underline underline-offset-4 transition-opacity hover:opacity-70 ${
          otpSelected ? "font-semibold text-[#1B2757]" : "text-black"
        }`}
      >
        One time purchase · {formatPrice(otpPricing.price)}
        {otpSelected ? " ✓" : ""}
      </button>
    </div>
  );
}

/** Full-width proof strip below the buy box, IM8 trustband style. */
const TRUST_ITEMS = [
  "Third Party Tested",
  "Informed Sport Certified",
  "Made in the UK",
  "Zero Caffeine",
  "Every Batch Tested",
  "Free UK Shipping",
  "Cancel Anytime",
  "100-Day Guarantee",
];

const TrustCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="h-3.5 w-3.5 shrink-0 text-[#1B2757]"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M7.5 12.5L10.5 15.5L16.5 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function TrustStrip() {
  return (
    <div className="flex items-center gap-x-5 gap-y-2 overflow-x-auto border-t border-black/10 py-4 [scrollbar-color:rgba(0,0,0,0.25)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/25 [&::-webkit-scrollbar]:h-1.5 md:flex-wrap md:justify-center md:overflow-x-visible">
      {TRUST_ITEMS.map((item) => (
        <span
          key={item}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55"
        >
          <TrustCheck />
          {item}
        </span>
      ))}
    </div>
  );
}

/** 3-icon reassurance bar shown directly under the CTA (IM8 pattern). */
function TrustBar() {
  const items = [
    { Icon: TrustIconGuarantee, label: "100-day guarantee" },
    { Icon: TrustIconShipping, label: "Free UK shipping" },
    { Icon: TrustIconCancel, label: "Cancel anytime" },
  ];
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 border-y border-black/10 py-3">
      {items.map(({ Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center">
          <Icon className="h-5 w-5 text-[#1B2757]" />
          <span className="text-[11px] font-semibold leading-tight text-black/70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** "What You'll Feel" outcomes — IM8 gradient-chip rows, our verified stats. */
const FEEL_OUTCOMES = [
  {
    emoji: "🧠",
    title: "Sharper thinking",
    desc: "Proven against placebo",
    pct: "+14.86%",
    grad: "linear-gradient(135deg,#FFF8E1,#FFECB3)",
  },
  {
    emoji: "📈",
    title: "Higher scores",
    desc: "Improved cognitive scores",
    pct: "80%",
    grad: "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
  },
  {
    emoji: "🎯",
    title: "Sharper focus",
    desc: "In professional athletes",
    pct: "+19.3%",
    grad: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
  },
  {
    emoji: "⚡",
    title: "Fast results",
    desc: "Improved in under 3 weeks",
    pct: "75%",
    grad: "linear-gradient(135deg,#EDE7F6,#D1C4E9)",
  },
];

function WhatYouFeel() {
  return (
    <div className="border border-black/10 bg-white p-4">
      <h3 className="mb-3 text-center text-base font-bold text-black">
        What You&apos;ll Feel
      </h3>
      <div className="flex flex-col">
        {FEEL_OUTCOMES.map((o, i) => (
          <div
            key={o.title}
            className={`flex items-center gap-3 py-2 ${
              i < FEEL_OUTCOMES.length - 1 ? "border-b border-black/[0.05]" : ""
            }`}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center text-base shadow-sm"
              style={{ background: o.grad }}
              aria-hidden
            >
              {o.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-[13px] font-bold leading-tight text-black">
                {o.title}
              </strong>
              <span className="text-[11px] leading-tight text-black/55">
                {o.desc}
              </span>
            </div>
            <span className="shrink-0 text-[15px] font-extrabold tabular-nums text-[#1B2757]">
              {o.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "See what's inside" trigger + the shared rounded ingredient bottom sheet.
 *  Mirrors the old IngredientSheet prop shape (a list of formula tabs) so it is
 *  a drop-in; on Both it shows an in-sheet AM/PM switcher. */
function IngredientListButton({ formulas }: { formulas: ("flow" | "clear")[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"flow" | "clear">(formulas[0]);

  const showSwitcher = formulas.length > 1;
  const formulaId: FormulaId = active === "flow" ? "01" : "02";
  const ingredients = getOrderedActiveIngredients(formulaId);
  const title = active === "flow" ? "CONKA Flow" : "CONKA Clear";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 border border-black/10 bg-white py-3.5 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03]"
      >
        See what&apos;s inside {showSwitcher ? "Flow & Clear" : title}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <IngredientBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={`${ingredients.length} active ingredients · tap any to learn more`}
        ingredients={ingredients}
        switcher={showSwitcher ? { value: active, onChange: setActive } : undefined}
      />
    </>
  );
}

export default function ProductBuyPanel({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
  hideHeader,
}: ProductBuyPanelProps) {
  const productType = getHeroProductType(formulaId);
  const shotsPerDay = productType === "both" ? 2 : 1;

  const selectedPricing = getCadencePricingByProductHeroId(
    formulaId,
    selectedCadence,
  );
  const ctaLabel =
    selectedCadence === "monthly-otp"
      ? "Add to Cart"
      : selectedPricing.compareAtPrice
        ? `Subscribe & Save ${Math.round((1 - selectedPricing.price / selectedPricing.compareAtPrice) * 100)}%`
        : "Subscribe & Save";

  const keyBenefits = [
    `${shotsPerDay === 2 ? "Two daily shots" : "One daily shot"}, zero caffeine`,
    "+14.86% sharper thinking, proven against placebo",
    "Informed Sport Certified",
    "100-day money-back guarantee",
  ];

  return (
    <>
      {!hideHeader && <ProductHeroHeader formulaId={formulaId} />}

      {/* Key-benefit checkmark pills */}
      <ul className="flex flex-col gap-2" aria-label="Key benefits">
        {keyBenefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-center gap-2.5 border border-black/10 bg-white px-3.5 py-2 text-[13px] font-semibold text-black/80"
          >
            <span className="text-[#1B2757]" aria-hidden>
              ✓
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
          Subscribe &amp; Save:
        </p>
        <PlanSelector
          formulaId={formulaId}
          selectedCadence={selectedCadence}
          onCadenceChange={onCadenceChange}
          onOtpAddToCart={onOtpAddToCart}
          shotsPerDay={shotsPerDay}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full bg-[#1B2757] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          {ctaLabel}
        </button>
        <TrustBar />
      </div>

      <WhatYouFeel />

      <IngredientListButton formulas={FORMULA_TABS[productType]} />

      <HeroAccordions productType={productType} hideIngredients />
    </>
  );
}
