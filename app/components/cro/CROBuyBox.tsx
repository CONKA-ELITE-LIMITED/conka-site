"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/productData";
import {
  getCadenceVariantByProductHeroId,
  getCadencePricingByProductHeroId,
  type CadenceType,
} from "@/app/lib/cadenceData";
import {
  flowIngredients,
  clarityIngredients,
  type IngredientData,
} from "@/app/lib/ingredientsData";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import CROPillCTA from "./CROPillCTA";

/* ============================================================================
 * CROBuyBox
 *
 * V2 Section 5 on /start. First inline purchase moment, Ketone-IQ-style
 * single product card for conka-both. Auto-checked subscription toggle;
 * CTA copy + price reflect the toggle. Real CartContext wiring with
 * funnel-attribution metadata.
 * ========================================================================== */

const PRODUCT_HERO_ID = "03";
const PRODUCT_IMAGE = "/formulas/both/BothBox.jpg";
const PRODUCT_IMAGE_ALT =
  "CONKA Flow and Clear boxes side by side with both bottles in front";
const BENEFITS = [
  "56 shots: 28 Flow + 28 Clear",
  "2 shots a day, every day of the month",
  "Free UK shipping",
  "16 clinical ingredients, UK patented",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 8.5L6.5 12L13 4.5" />
    </svg>
  );
}

function IngredientChip({ ingredient }: { ingredient: IngredientData }) {
  const initials = ingredient.name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="inline-flex items-center gap-2 bg-white border border-black/8 rounded-full pl-1 pr-3 py-1">
      <span className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-white relative">
        {ingredient.image ? (
          <Image
            src={ingredient.image}
            alt=""
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center bg-[#1B2757] text-white text-[9px] font-bold">
            {initials}
          </span>
        )}
      </span>
      <span className="text-[12px] text-black/85 font-medium leading-none">
        {ingredient.name}
      </span>
    </span>
  );
}

function IngredientsGroup({
  title,
  ingredients,
}: {
  title: string;
  ingredients: IngredientData[];
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1B2757] mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-2 mb-4 last:mb-0">
        {ingredients.map((i) => (
          <IngredientChip key={i.id} ingredient={i} />
        ))}
      </div>
    </div>
  );
}

interface FaqItem {
  id: string;
  question: string;
  content: React.ReactNode;
}

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `buybox-faq-panel-${item.id}`;
  const buttonId = `buybox-faq-button-${item.id}`;
  return (
    <div className="bg-black/[0.04] rounded-[16px] overflow-hidden">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex items-center w-full p-4 text-left hover:bg-black/[0.02] transition-colors"
      >
        <span className="flex-1 text-[14px] font-semibold text-black leading-tight">
          {item.question}
        </span>
        <span
          className="text-[22px] text-black/40 leading-none w-6 flex-shrink-0 text-center"
          aria-hidden
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height] duration-200 ease-out"
        style={{ maxHeight: isOpen ? "1200px" : "0px" }}
      >
        <div className="px-4 pb-4 pt-1 text-[13.5px] text-black/80 leading-relaxed">
          {item.content}
        </div>
      </div>
    </div>
  );
}

function BuyBoxFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const items: FaqItem[] = [
    {
      id: "ingredients",
      question: "What's in it?",
      content: (
        <div className="space-y-1">
          <IngredientsGroup title="Morning · Flow" ingredients={flowIngredients} />
          <IngredientsGroup
            title="Afternoon · Clear"
            ingredients={clarityIngredients}
          />
        </div>
      ),
    },
    {
      id: "timing",
      question: "When do I take it?",
      content: (
        <div className="space-y-3">
          <p>
            Take <strong>CONKA Flow</strong> in the morning, with or without
            coffee, with or without food. It supports calm, focused thinking
            through the first half of your day.
          </p>
          <p>
            Take <strong>CONKA Clear</strong> in the afternoon, after
            you&apos;ve already done a sustained stretch of work. Your brain
            has built up oxidative stress by then; Clear helps reset you for a
            strong second half of focus.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      question: "Need international shipping?",
      content: (
        <p>
          Yes, CONKA ships internationally. Rates and timelines vary by
          destination and are shown at checkout.
        </p>
      ),
    },
  ];

  return (
    <div className="mt-6 space-y-2">
      {items.map((item) => (
        <FAQRow
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

export default function CROBuyBox() {
  const { addToCart, loading } = useCart();
  const [isSubscription, setIsSubscription] = useState(true);

  const cadence: CadenceType = isSubscription ? "monthly-sub" : "monthly-otp";
  const variant = getCadenceVariantByProductHeroId(PRODUCT_HERO_ID, cadence);
  const pricing = getCadencePricingByProductHeroId(PRODUCT_HERO_ID, cadence);
  const otpPricing = getCadencePricingByProductHeroId(
    PRODUCT_HERO_ID,
    "monthly-otp",
  );

  // Compare-at: prefer the cadence's own compareAtPrice, otherwise fall back
  // to the OTP price so the savings calc is always anchored to a real number.
  const subPricing = getCadencePricingByProductHeroId(
    PRODUCT_HERO_ID,
    "monthly-sub",
  );
  const compareAt = subPricing.compareAtPrice ?? otpPricing.price;
  const monthlySavings = Math.max(0, compareAt - subPricing.price);
  const savingsPercent =
    compareAt > 0 ? Math.round((monthlySavings / compareAt) * 100) : 0;

  const handleAddToCart = async () => {
    if (!variant?.variantId) return;
    await addToCart(variant.variantId, 1, variant.sellingPlanId, {
      location: "buy_box",
      source: "v2_quick_purchase",
    });
  };

  const ctaLabel = isSubscription
    ? `Start subscription · ${formatPrice(pricing.price)}/mo`
    : `Order once · ${formatPrice(pricing.price)}`;

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        Try your first shot today.
      </h2>

      <div className="rounded-[var(--brand-radius-container)] bg-white border border-black/8 overflow-hidden">
        {/* ===== Product image ===== */}
        <div className="relative aspect-[5/4] bg-black/[0.03]">
          <Image
            src={PRODUCT_IMAGE}
            alt={PRODUCT_IMAGE_ALT}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>

        <div className="p-5">
          {/* ===== Price row ===== */}
          <div className="flex items-baseline gap-3 flex-wrap mb-1">
            <span className="text-[28px] font-bold text-[#1B2757] tabular-nums leading-none">
              {formatPrice(pricing.price)}
              <span className="text-[14px] font-semibold text-black/55 ml-1">
                {isSubscription ? "/mo" : ""}
              </span>
            </span>
            {isSubscription && monthlySavings > 0 && (
              <>
                <span className="text-[15px] text-black/40 line-through tabular-nums">
                  {formatPrice(compareAt)}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#1B2757] bg-[#1B2757]/10 px-2 py-1 rounded-full tabular-nums">
                  Save {savingsPercent}%
                </span>
              </>
            )}
          </div>
          <p className="text-[12px] text-black/55 tabular-nums mb-5">
            {formatPrice(pricing.perShot)} per shot
          </p>

          {/* ===== Benefits ===== */}
          <ul className="space-y-2 mb-5">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-[13.5px] text-black/80 leading-snug"
              >
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1B2757]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* ===== Subscription toggle ===== */}
          <label
            className={`flex items-start gap-3 p-3 rounded-[14px] border-2 transition-colors cursor-pointer mb-5 ${
              isSubscription
                ? "border-[#1B2757] bg-[#1B2757]/[0.04]"
                : "border-black/12 bg-white hover:border-black/25"
            }`}
          >
            <input
              type="checkbox"
              checked={isSubscription}
              onChange={(e) => setIsSubscription(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-[#1B2757] flex-shrink-0"
              aria-label="Subscribe and save"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-black leading-tight">
                Subscribe & Save {savingsPercent}%
              </p>
              <p className="text-[12px] text-black/60 mt-0.5 leading-snug">
                Pause, skip, or cancel anytime.
              </p>
            </div>
          </label>

          {/* ===== CTA ===== */}
          <CROPillCTA
            onClick={handleAddToCart}
            disabled={loading || !variant?.variantId}
            className="w-full"
          >
            {ctaLabel}
          </CROPillCTA>

          {/* ===== Guarantee footer ===== */}
          <p className="mt-4 text-center text-[12px] font-semibold text-black/70">
            {GUARANTEE_LABEL_FULL}
          </p>
        </div>
      </div>

      {/* ===== FAQ accordion (sits below the card) ===== */}
      <BuyBoxFAQ />
    </div>
  );
}
