"use client";

import { useState } from "react";
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
  getDisplayDiscount,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import HeroAccordions from "./HeroAccordions";
import IngredientBottomSheet from "./IngredientBottomSheet";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * ProductBuyPanel (+ TrustStrip)
 *
 * The IM8-style buy box used on the PDPs (Flow / Clear / Both). Its clinical
 * two-card sibling on the /go listicle pages lives in
 * app/components/go/listicle/ListiclePurchase. On the PDP here,
 * shots-per-day and the first key benefit derive from the product,
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
  /** Mobile hides the key-benefit pills. They eat scarce real estate and the
      same proof appears further down (WhatYouFeel, TrustBar, plan detail). */
  hideKeyBenefits?: boolean;
  /** V2 3-column layout moves the ingredients button + accordions into the
      left identity column, so the buy box on the right suppresses them here. */
  hideSecondary?: boolean;
  /** V2 moves the "What You'll Feel" block into the left-column accordion, so
      the buy box drops it here. */
  hideWhatYouFeel?: boolean;
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
  blackText = false,
}: {
  formulaId: ProductHeroId;
  /** Desktop keeps the keyword subline inside the <h1>. Mobile drops it below the
      image (rendered by ProductHeroLede), so it is suppressed here. */
  showSubline?: boolean;
  showHeadline?: boolean;
  /** V2 left column renders all copy in solid black (no muted greys). */
  blackText?: boolean;
}) {
  const content = getHeroContent(formulaId);
  const usersColor = blackText ? "text-black" : "text-black/50";
  const eyebrowColor = blackText ? "text-black" : "text-black/50";
  const sublineColor = blackText ? "text-black" : "text-black/65";
  const headlineColor = blackText ? "text-black" : "text-black/75";
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
        <span className={`text-sm ${usersColor}`}>· 5,000+ daily users</span>
      </div>

      {/* Eyebrow + product name. On desktop the keyword subline sits inside the
          <h1>; on mobile it drops below the image via ProductHeroLede. */}
      <div>
        <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.14em] ${eyebrowColor}`}>
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
            <span className={`mt-1.5 block text-base font-medium leading-snug md:text-lg ${sublineColor}`}>
              {content.seoHeading}
            </span>
          )}
        </h1>
        {showHeadline && (
          <p className={`mt-2 text-sm leading-relaxed md:text-base ${headlineColor}`}>
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

/** Which ingredient-sheet tabs each product surfaces (Both shows both). */
const FORMULA_TABS: Record<"flow" | "clear" | "both", ("flow" | "clear")[]> = {
  flow: ["flow"],
  clear: ["clear"],
  both: ["flow", "clear"],
};

/** Funnel green for the free-shots incentive (matches the listicle purchase card). */
const GREEN = "#1a7f4f";
const GREEN_TEXT = "#1a7f4f";

/** Additive green-plus marker for the expanded benefit list ("+ this too"). */
function GreenPlus() {
  return (
    <span
      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
      style={{ background: GREEN }}
      aria-hidden
    >
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
        <path d="M6 2.5v7M2.5 6h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Subscription benefits revealed when the tile expands. One unified list (app
 *  access included) — every line is a subscription benefit, no separator. */
function subscriptionBenefits(freeShots: number) {
  return [
    ...(freeShots > 0 ? [`+${freeShots} free shots on your first order`] : []),
    "Free UK postage",
    "Pause, skip, or cancel anytime",
    "100-day money-back guarantee",
    "Full CONKA App Access",
    "Personal Brain Coach",
  ];
}

/**
 * Magic Mind-style flat plan card: title + prices inline, a tap-to-expand
 * "subscription benefits" disclosure (no auto-expand on select). The only
 * plan-card style rendered.
 */
function FlatPlanCard({
  formulaId,
  cadence,
  isSelected,
  onSelect,
  saveColor,
}: {
  formulaId: ProductHeroId;
  cadence: CadenceType;
  isSelected: boolean;
  onSelect: () => void;
  /** Per-tile discount-badge colour (Magic Mind uses a different one per plan). */
  saveColor: string;
}) {
  const display = FUNNEL_CADENCES[cadence];
  const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
  const savePct = getDisplayDiscount(pricing);
  const cadenceWord = cadence === "quarterly-sub" ? "every 3 months" : "monthly";
  const freeShots = pricing.freeShots ?? 0;

  // Crossed-out "was":
  //  - Monthly sub anchors to the real one-time (OTP) price for the same shots,
  //    so it matches the "Buy it once" figure exactly (~43% off for Flow).
  //  - Quarterly has no one-time equivalent, so derive a regular-price reference
  //    from the published discount (e.g. 63% off => price / 0.37) so the
  //    strikethrough and the Save% badge agree.
  const compareAtDisplay =
    cadence === "monthly-sub"
      ? getCadencePricingByProductHeroId(formulaId, "monthly-otp").price
      : savePct > 0
        ? pricing.price / (1 - savePct / 100)
        : undefined;

  return (
    <div
      className={`relative w-full select-none rounded-md transition-all duration-200 ${
        isSelected
          ? "border-[1.5px] border-[#1B2757] bg-[#f8f9fd]"
          : "border border-black/15 bg-white hover:border-black/30"
      }`}
    >
      {display.badge && (
        <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1B2757] px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
          {display.badge}
        </span>
      )}

      {/* Full-card select target; the benefits disclosure below opts back into
          pointer events so tapping it expands rather than selects. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${pricing.shotCount} shot delivery`}
        className="absolute inset-0 z-0"
      />

      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <span className="flex items-center gap-2.5">
            <span
              className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
              }`}
              aria-hidden
            >
              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="text-[15px] font-bold leading-tight text-black">
              {pricing.shotCount} Shot Delivery
            </span>
          </span>

          <details className="pointer-events-auto mt-2">
            <summary className="flex cursor-pointer list-none flex-col gap-1.5 [&::-webkit-details-marker]:hidden">
              {/* Line 1: tick + delivery cadence */}
              <span className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-[#1B2757]"
                  aria-hidden
                >
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[11px] font-medium text-black/55">
                  Delivered {cadenceWord} + subscription benefits
                </span>
              </span>

              {/* Line 2: free-shots incentive + learn-more tile */}
              <span className="flex items-center gap-2">
                {freeShots > 0 && (
                  <span
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: "rgba(26,127,79,0.14)", color: GREEN_TEXT }}
                  >
                    <span
                      className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full"
                      style={{ background: GREEN }}
                    >
                      <svg width="7" height="7" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M3 8.5L6.5 12L13 4.5"
                          stroke="white"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    +{freeShots} free shots
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-[#1B2757]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1B2757]">
                  Learn more
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 transition-transform [details[open]_&]:rotate-180"
                    aria-hidden
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </summary>
            <p className="mt-3 border-t border-black/10 pt-2.5 text-[10px] font-bold uppercase tracking-wide text-black/45">
              Subscription Benefits
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {subscriptionBenefits(freeShots).map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-[12px] font-medium text-black"
                >
                  <GreenPlus />
                  {label}
                </li>
              ))}
            </ul>
          </details>
        </div>

        <span className="shrink-0 text-right">
          <span className="flex items-baseline justify-end gap-1.5 leading-none">
            {compareAtDisplay && (
              <s className="text-xs font-bold text-black/40">
                {formatPrice(compareAtDisplay)}
              </s>
            )}
            <span className="text-lg font-bold tabular-nums text-black">
              {formatPrice(pricing.price)}
            </span>
          </span>
          <span className="mt-1 block text-[11px] italic tabular-nums text-black/55">
            {formatPrice(pricing.perShot)} per bottle
          </span>
          {savePct > 0 && (
            <span
              className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: saveColor }}
            >
              Save {savePct}%
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function PlanSelector({
  formulaId,
  selectedCadence,
  onCadenceChange,
}: Omit<ProductBuyPanelProps, "onAddToCart" | "onOtpAddToCart">) {
  // Flat (V2) cards: ascending order (20 shot then 60 shot), each with its own
  // discount-badge colour. The OTP link is rendered under the main CTA (panel).
  const flatOrder: { cadence: CadenceType; saveColor: string }[] = [
    { cadence: "monthly-sub", saveColor: "#C9A24A" },
    { cadence: "quarterly-sub", saveColor: "#E07A5F" },
  ];
  return (
    <div className="flex flex-col gap-4 pt-2">
      {flatOrder.map(({ cadence, saveColor }) => (
        <FlatPlanCard
          key={cadence}
          formulaId={formulaId}
          cadence={cadence}
          isSelected={selectedCadence === cadence}
          onSelect={() => onCadenceChange(cadence)}
          saveColor={saveColor}
        />
      ))}
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
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-black/55"
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
    <div className="mt-3 grid grid-cols-3 gap-2 py-1">
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

/** Just the outcome rows — reused by the V2 hero's left-column "What you'll
 *  feel" accordion (no outer card/heading). */
export function FeelOutcomesList() {
  return (
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
  );
}

function WhatYouFeel() {
  return (
    <div className="border border-black/10 bg-white p-4">
      <h3 className="mb-3 text-center text-base font-bold text-black">
        What You&apos;ll Feel
      </h3>
      <FeelOutcomesList />
    </div>
  );
}

/** "See what's inside" trigger + the shared rounded ingredient bottom sheet.
 *  Takes a list of formula tabs; on Both it shows an in-sheet AM/PM switcher.
 *  `pill` renders the compact Magic Mind-style "Ingredients" pill (V2 hero). */
export function IngredientListButton({
  formulas,
  pill = false,
  fullWidth = false,
}: {
  formulas: ("flow" | "clear")[];
  pill?: boolean;
  /** Stretch the pill to fill its container (mobile V2), vs the compact
   *  self-start pill used in the desktop left column. */
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"flow" | "clear">(formulas[0]);

  const showSwitcher = formulas.length > 1;
  const formulaId: FormulaId = active === "flow" ? "01" : "02";
  const ingredients = getOrderedActiveIngredients(formulaId);
  const title = active === "flow" ? "CONKA Flow" : "CONKA Clear";

  return (
    <>
      {pill ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${fullWidth ? "flex w-full justify-center" : "inline-flex self-start"} items-center gap-2 rounded-full border border-black px-6 py-3 text-base font-medium text-black transition-colors hover:bg-black hover:text-white`}
        >
          Ingredients
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      ) : (
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
      )}

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
  hideKeyBenefits,
  hideSecondary,
  hideWhatYouFeel,
}: ProductBuyPanelProps) {
  const productType = getHeroProductType(formulaId);
  const shotsPerDay = productType === "both" ? 2 : 1;

  const selectedPricing = getCadencePricingByProductHeroId(
    formulaId,
    selectedCadence,
  );
  const otpPricing = getCadencePricingByProductHeroId(formulaId, "monthly-otp");
  const ctaLabel = `Add to cart for ${formatPrice(selectedPricing.price)}`;

  const keyBenefits = [
    `${shotsPerDay === 2 ? "Two daily shots" : "One daily shot"}, zero caffeine`,
    "+14.86% sharper thinking, proven against placebo",
    "Informed Sport Certified",
    "100-day money-back guarantee",
  ];

  return (
    <>
      {!hideHeader && <ProductHeroHeader formulaId={formulaId} />}

      {/* Key-benefit checkmark pills (hidden on mobile via hideKeyBenefits) */}
      {!hideKeyBenefits && (
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
      )}

      <div>
        <p className="mb-3 text-lg font-bold text-black">Select your plan:</p>
        <PlanSelector
          formulaId={formulaId}
          selectedCadence={selectedCadence}
          onCadenceChange={onCadenceChange}
        />
      </div>

      <div className="mt-3">
        <ConkaCTAButton
          onClick={onAddToCart}
          meta={null}
          className="w-full !max-w-none"
        >
          {ctaLabel}
        </ConkaCTAButton>

        {/* The one-time purchase sits under the main CTA (MM pattern). */}
        <button
          type="button"
          onClick={onOtpAddToCart}
          className="mx-auto mt-3 block w-fit text-center text-sm font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Buy it once for {formatPrice(otpPricing.price)}
        </button>

        <TrustBar />
      </div>

      {!hideWhatYouFeel && <WhatYouFeel />}

      {!hideSecondary && (
        <>
          <IngredientListButton formulas={FORMULA_TABS[productType]} />

          <HeroAccordions productType={productType} hideIngredients />
        </>
      )}
    </>
  );
}
