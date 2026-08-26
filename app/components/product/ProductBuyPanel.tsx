"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatPrice, type FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  getChargedPrice,
  getDisplayDiscount,
  BYO_CADENCES,
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
  /** Renders just the Ingredients pill under the CTA, without the accordions
      hideSecondary also suppresses. The mobile V3 hero uses it to keep the full
      list one tap away now that the written-out list has left the hero
      (SCRUM-1260). Ignored when hideSecondary is false, since the pill would
      then duplicate the button the secondary block already renders. */
  showIngredientsPill?: boolean;
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

/** Funnel green for the subscription-summary accents (matches the listicle purchase card). */
const GREEN = "#1a7f4f";

/**
 * Magic Mind-style flat plan card. Unselected cards are a single clean row
 * (radio + shots/cadence + discount pill + price). The selected card expands a
 * light 2x2 detail grid. The fuller "what you get" list now lives in the
 * SubscriptionSummary box under the CTA, so the cards stay lean.
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
  const display = BYO_CADENCES[cadence];
  const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
  const savePct = getDisplayDiscount(pricing);
  // Short label ("monthly" / "quarterly") is used only in the aria-label now;
  // the fuller phrasing ("every 3 months") shows in the expanded detail + box.
  const cadenceShort = cadence === "quarterly-sub" ? "quarterly" : "monthly";
  const cadenceWord = cadence === "quarterly-sub" ? "every 3 months" : "monthly";
  const freeShots = pricing.freeShots ?? 0;
  const [tipOpen, setTipOpen] = useState(false);

  // Close the tooltip when the card is deselected so it does not reappear
  // already-open the next time the card is selected.
  useEffect(() => {
    if (!isSelected) setTipOpen(false);
  }, [isSelected]);

  // Crossed-out "was":
  //  - Monthly sub anchors to the real one-time (OTP) price for the same shots,
  //    so it matches the "Buy it once" figure exactly (~43% off for Flow).
  //  - Quarterly has no one-time equivalent, so derive a regular-price reference
  //    from the published discount (e.g. 63% off => price / 0.37) so the
  //    strikethrough and the Save% badge agree.
  const compareAtDisplay =
    cadence === "monthly-sub"
      ? getChargedPrice(getCadencePricingByProductHeroId(formulaId, "monthly-otp"))
      : savePct > 0
        ? pricing.price / (1 - savePct / 100)
        : undefined;

  return (
    <div
      className={`relative w-full select-none rounded-md transition-colors duration-200 ${
        isSelected
          ? ""
          : "border-2 border-transparent bg-[#f1f1f3] hover:bg-[#e9e9ee]"
      }`}
      // Selected state uses the brand offer gradient as a 2px border ring
      // (padding-box keeps the fill, border-box paints the gradient edge) so the
      // rounded corners survive — a plain border-color can't do a gradient.
      style={
        isSelected
          ? {
              border: "2px solid transparent",
              background:
                "linear-gradient(#f8f9fd,#f8f9fd) padding-box, linear-gradient(90deg,#cdeecf,#e9f5c9) border-box",
            }
          : undefined
      }
    >
      {display.badge && (
        <span
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
          style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
        >
          {display.badge}
        </span>
      )}

      {/* Full-card select target sitting behind the (pointer-events-none) content. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${pricing.shotCount} shot ${cadenceShort} delivery`}
        className="absolute inset-0 z-0 rounded-md"
      />

      <div className="pointer-events-none relative z-10 px-3 py-3 sm:px-4">
        {/* Top row: radio + shots/cadence ..... discount pill + strike + price.
            Kept compact so nothing truncates in the narrow buy column. */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
              }`}
              aria-hidden
            >
              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="whitespace-nowrap text-sm font-bold leading-tight text-black">
              {pricing.shotCount} shots
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5">
            {savePct > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ backgroundColor: saveColor }}
              >
                {savePct}% off
              </span>
            )}
            <span className="flex items-baseline gap-1 leading-none">
              {compareAtDisplay && (
                <s className="text-[11px] font-bold text-black/40">
                  {formatPrice(compareAtDisplay)}
                </s>
              )}
              <span className="text-base font-bold tabular-nums text-black">
                {formatPrice(pricing.price)}
              </span>
            </span>
          </span>
        </div>

        {/* Selected-only 2x2 detail (Magic Mind pattern): guarantee / per-bottle
            over delivery cadence / shipping. Collapsed on unselected cards. */}
        {isSelected && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-black/10 pt-3 text-[11px] leading-tight text-black">
            <span>100-day guarantee</span>
            <span className="text-right tabular-nums">
              {formatPrice(pricing.perShot)} per bottle
            </span>
            <span className="flex items-center gap-1.5">
              Delivered {cadenceWord}
              <span className="pointer-events-auto relative inline-flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTipOpen((v) => !v);
                  }}
                  onMouseEnter={() => setTipOpen(true)}
                  onMouseLeave={() => setTipOpen(false)}
                  aria-label="Delivery details"
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-black/40 text-[9px] font-bold leading-none text-black/55"
                >
                  i
                </button>
                {tipOpen && (
                  <span
                    role="tooltip"
                    className="absolute bottom-full left-0 z-30 mb-2 w-52 rounded-lg bg-black px-3 py-2 text-[11px] font-medium leading-snug text-white shadow-lg"
                  >
                    Your shots arrive{" "}
                    {cadence === "quarterly-sub" ? "every 3 months" : "every month"}. Pause,
                    skip, or cancel anytime.
                  </span>
                )}
              </span>
            </span>
            <span className="text-right">Free UK shipping</span>
          </div>
        )}

        {/* Full-width gradient footer on the selected card reinforcing the
            free-shots incentive. Negative margins let it bleed to the card edges
            and hug the rounded bottom corners inside the 2px gradient border. */}
        {isSelected && freeShots > 0 && (
          <div
            className="-mx-3 -mb-3 mt-3 rounded-b-md px-3 py-2 text-center text-[12px] font-bold text-[#14532d] sm:-mx-4 sm:px-4"
            style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
          >
            +{freeShots} free shots on your first order
          </div>
        )}
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

/**
 * SubscriptionSummary — the dynamic "Your subscription" box shown under the CTA
 * (SCRUM-1207). It restates exactly what the selected plan delivers and rewrites
 * itself whenever the plan changes, since every figure is derived from the same
 * cadenceData the plan cards read. This is the single home for the fuller "what
 * you get" list that used to live inside each plan card.
 */
function SubscriptionSummary({
  formulaId,
  cadence,
}: {
  formulaId: ProductHeroId;
  cadence: CadenceType;
}) {
  const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
  const savePct = getDisplayDiscount(pricing);
  const cadenceWord = cadence === "quarterly-sub" ? "every 3 months" : "monthly";
  const freeShots = pricing.freeShots ?? 0;

  const lines: { id: string; text: ReactNode }[] = [
    { id: "delivery", text: <>{pricing.shotCount} shots delivered {cadenceWord}</> },
    ...(freeShots > 0
      ? [
          {
            id: "free-shots",
            text: (
              <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span
                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ background: "rgba(26,127,79,0.14)", color: GREEN }}
                >
                  <span
                    className="flex h-3 w-3 items-center justify-center rounded-full"
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
                on your first order
              </span>
            ),
          },
        ]
      : []),
    ...(savePct > 0
      ? [{ id: "savings", text: <>Save {savePct}% vs buying once</> }]
      : []),
    { id: "shipping", text: <>Free UK shipping</> },
    {
      id: "guarantee",
      text: (
        <>
          100-day money-back guarantee
          <span className="block">(less than 1.2% of people actually use it)</span>
        </>
      ),
    },
    { id: "app", text: <>Full app access + personal brain coach</> },
    { id: "cancel", text: <>Pause, skip, or cancel anytime</> },
  ];

  return (
    <div className="mt-4 rounded-md border border-black/15 bg-white p-5">
      <p className="text-lg font-medium text-black">Your subscription</p>
      <ul className="mt-3 flex flex-col gap-3">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex items-start gap-2.5 text-sm leading-snug text-black"
          >
            <span
              className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full"
              style={{ background: GREEN }}
              aria-hidden
            />
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
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
  showIngredientsPill,
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
          Buy it once for {formatPrice(getChargedPrice(otpPricing))}
        </button>

        <SubscriptionSummary formulaId={formulaId} cadence={selectedCadence} />
      </div>

      {hideSecondary && showIngredientsPill && (
        <IngredientListButton
          formulas={FORMULA_TABS[productType]}
          pill
          fullWidth
        />
      )}

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
