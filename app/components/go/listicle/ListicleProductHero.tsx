"use client";

import Image from "next/image";
import GuaranteeRow from "@/app/components/landing/GuaranteeRow";
import { formatPrice } from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import {
  getProductHeroImages,
  getProductHeroImagesMobile,
} from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
  getPriceFrequency,
} from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";
import HeroAccordions from "@/app/components/product/HeroAccordions";

/* ============================================================================
 * ListicleProductHero (+ Mobile)
 *
 * Landing-optimised fork of ProductHero/ProductHeroMobile for /go listicle
 * pages, following the IM8 buy-box pattern: only the two subscription
 * cadences render as selectable cards (quarterly leads), and one-time
 * purchase is demoted to a small underlined text link below the cards.
 * Corners are square (no brand-card radius). PDP behaviour is otherwise
 * preserved: same pricing helpers, checklist, CTA meta and accordions.
 * ========================================================================== */

interface ListicleProductHeroProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds straight to cart (IM8 pattern) */
  onOtpAddToCart: () => void;
}

const SUB_CADENCES: CadenceType[] = ["quarterly-sub", "monthly-sub"];

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
 *  shown struck-through to signal worth. `img` is optional until assets land. */
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
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-black/[0.03]">
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

/** Compact "the CONKA app" visual for the plan card — a trimmed version of
 *  the cart-drawer CartAppGift (app-ring screenshot + Free badge + bullets). */
function PlanAppGift() {
  return (
    <div className="mt-4 overflow-hidden border border-black/10">
      <div className="flex items-center justify-between gap-2 border-b border-black/[0.08] bg-[#f9f9f9] px-3 py-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
          Also included — the CONKA app
        </p>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="font-mono text-[9px] font-bold uppercase tabular-nums tracking-[0.1em] text-black/35 line-through">
            £119.99/yr
          </span>
          <span className="bg-[#1B2757] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white">
            Free
          </span>
        </span>
      </div>
      <div className="flex gap-3 p-3">
        <Image
          src="/app/AppConkaRing.png"
          alt="CONKA app showing daily brain performance score"
          width={48}
          height={104}
          className="h-auto w-12 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          {APP_BULLETS.map((bullet) => (
            <div key={bullet} className="flex gap-2">
              <svg
                width="12"
                height="12"
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
              <p className="text-xs leading-snug text-black/80">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Selected-card detail: price + save, "what's included", and the expandable
 *  "unlock in the app" rewards. Rendered as a sibling of the select button so
 *  the <details> disclosure is valid (not nested inside a button). */
function PlanDetail({
  cadence,
  formulaId,
}: {
  cadence: CadenceType;
  formulaId: ProductHeroId;
}) {
  const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
  const frequency = getPriceFrequency(cadence);

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-wrap items-baseline gap-2 border-t border-black/10 pt-4">
        <span className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">
          {formatPrice(pricing.price)}
          <span className="text-base font-semibold">{frequency}</span>
        </span>
        {pricing.compareAtPrice && (
          <>
            <span className="font-mono text-[10px] uppercase tabular-nums tracking-[0.14em] text-black/40 line-through">
              {formatPrice(pricing.compareAtPrice)}
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tabular-nums tracking-[0.14em] text-[#1B2757]">
              Save {formatPrice(pricing.compareAtPrice - pricing.price)}
            </span>
          </>
        )}
      </div>

      {/* What's included */}
      <p className="mb-2 mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
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

      {/* The CONKA app — visual block (mirrors the cart-drawer app gift) */}
      <PlanAppGift />

      {/* Earnable app rewards — expandable */}
      <details className="mt-3 border-t border-black/10 pt-3">
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
        <p className="mt-3 text-[11px] leading-snug text-black/45">
          Earn rewards by keeping your streak and climbing the leaderboard in the
          app. Not included with purchase.
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
}: Omit<ListicleProductHeroProps, "onAddToCart">) {
  const otpPricing = getCadencePricingByProductHeroId(formulaId, "monthly-otp");
  const otpSelected = selectedCadence === "monthly-otp";

  return (
    <div className="flex flex-col gap-3">
      {SUB_CADENCES.map((cadence) => {
        const display = FUNNEL_CADENCES[cadence];
        const isSelected = selectedCadence === cadence;
        const cadencePricing = getCadencePricingByProductHeroId(
          formulaId,
          cadence,
        );
        const frequency = getPriceFrequency(cadence);
        const bannerLabel = display.badge;

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
              <div className="bg-[#1B2757] px-4 py-1.5 text-center font-mono text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-white">
                {bannerLabel}
              </div>
            )}

            <button
              type="button"
              onClick={() => onCadenceChange(cadence)}
              className={`block w-full text-left ${isSelected ? "px-4 pb-1 pt-4" : "px-4 py-3"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-[#1B2757] bg-[#1B2757]"
                        : "border-black/30 bg-white"
                    }`}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-all duration-200 ${isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                    >
                      <path
                        d="M2.5 8.5L6.5 12L13.5 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${isSelected ? "text-lg text-[var(--brand-black)]" : "text-base text-black/65"}`}
                    >
                      {display.label}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.12em] ${
                        isSelected
                          ? "bg-[#1B2757]/10 text-[#1B2757]"
                          : "bg-black/[0.05] text-black/55"
                      }`}
                    >
                      {cadencePricing.shotCount} shots · 1/day
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p
                    className={`font-semibold tabular-nums ${isSelected ? "text-base text-[var(--brand-black)]" : "text-sm text-black/60"}`}
                  >
                    {formatPrice(cadencePricing.perShot)}
                    <span className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
                      /shot
                    </span>
                  </p>
                  {!isSelected && (
                    <p className="mt-0.5 font-mono text-[10px] uppercase tabular-nums tracking-[0.12em] text-black/40">
                      {formatPrice(cadencePricing.price)}
                      {frequency}
                    </p>
                  )}
                </div>
              </div>
            </button>

            {isSelected && (
              <PlanDetail cadence={cadence} formulaId={formulaId} />
            )}
          </div>
        );
      })}

      {/* One-time purchase demoted to a text link; adds straight to cart */}
      <button
        type="button"
        onClick={onOtpAddToCart}
        className={`mx-auto mt-1 w-fit text-center text-sm underline underline-offset-4 transition-colors ${
          otpSelected
            ? "font-semibold text-[#1B2757]"
            : "text-black/55 hover:text-black"
        }`}
      >
        One time purchase · {formatPrice(otpPricing.price)}
        {otpSelected ? " ✓" : ""}
      </button>
    </div>
  );
}

/** Checkmark benefit pills under the description, IM8 key-benefits style */
const KEY_BENEFITS = [
  "Two daily shots, zero caffeine",
  "+14.86% sharper thinking, proven against placebo",
  "Informed Sport Certified",
  "100-day money-back guarantee",
];

/** Full-width proof strip below the buy box, IM8 trustband style */
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

function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-black/10 py-4">
      {TRUST_ITEMS.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55"
        >
          <span className="text-[#1B2757]" aria-hidden>
            ✓
          </span>
          {item}
        </span>
      ))}
    </div>
  );
}

function BuyPanel({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ListicleProductHeroProps) {
  const content = getHeroContent(formulaId);

  // CTA reflects the selected plan: subscriptions lead with the saving, the
  // one-time link sets a plain add-to-cart.
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

      {/* Eyebrow + title + short description */}
      <div className="mb-0">
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
          Daily Nootropic Brain Shots
        </p>
        <h2
          className="brand-h1 leading-tight lg:!text-[2.25rem]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-black/75 md:text-base">
          {content.headline}
        </p>
      </div>

      {/* Key-benefit checkmark pills */}
      <ul className="flex flex-col gap-2" aria-label="Key benefits">
        {KEY_BENEFITS.map((benefit) => (
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
        <GuaranteeRow />
      </div>

      <HeroAccordions productType={getHeroProductType(formulaId)} />
    </>
  );
}

export function ListicleProductHeroMobile(props: ListicleProductHeroProps) {
  const content = getHeroContent(props.formulaId);
  const images = getProductHeroImagesMobile(
    props.formulaId,
    props.selectedCadence,
  ).map((src) => ({ src }));

  return (
    <>
      {/* Contained gallery (not full-bleed) with a visible thumbnail strip */}
      <div className="overflow-hidden rounded-2xl bg-[#FAFAFA] px-2 pb-1 pt-2">
        <ProductImageSlideshow
          key={props.selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
          smallThumbnails
          imageFit="contain"
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3 bg-white px-4 py-4 text-[#111]">
        <BuyPanel {...props} />
      </div>
      <TrustStrip />
    </>
  );
}

export default function ListicleProductHero(props: ListicleProductHeroProps) {
  const content = getHeroContent(props.formulaId);
  const images = getProductHeroImages(props.formulaId, props.selectedCadence).map(
    (src) => ({ src }),
  );

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="flex flex-col gap-[var(--brand-space-m)] lg:flex-row lg:items-start lg:justify-center">
        {/* IM8 gallery pattern: primary image, compact thumbnail strip below */}
        <div className="relative z-0 order-1 lg:sticky lg:top-8 lg:w-[46%] lg:flex-shrink-0 lg:self-start">
          <ProductImageSlideshow
            key={props.selectedCadence}
            images={images}
            alt={`${content.name} bottle`}
            smallThumbnails
            imageFit="contain"
          />
        </div>

        <div className="relative z-10 order-2 min-w-0 flex-1 lg:sticky lg:top-8 lg:w-[48%] lg:flex-shrink-0 lg:self-start">
          <div
            className="relative z-10 flex flex-col gap-[var(--brand-space-s)] bg-white"
            style={{
              paddingLeft: "var(--brand-space-m)",
              paddingRight: "var(--brand-space-m)",
              paddingTop: "var(--brand-space-s)",
              paddingBottom: "var(--brand-space-m)",
            }}
          >
            <BuyPanel {...props} />
          </div>
        </div>
      </div>

      {/* Proof strip spans both columns */}
      <TrustStrip />
    </div>
  );
}
