"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  getCadenceVariantByProductHeroId,
} from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { getHeroContent } from "@/app/lib/productHeroHelpers";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import IngredientBottomSheet from "@/app/components/product/IngredientBottomSheet";
import { useCart } from "@/app/context/CartContext";

/* ============================================================================
 * ListiclePurchase (SCRUM-1144)
 *
 * The /go listicle buy zone, rebuilt from a single PDP-style box into the
 * lander-b two-card offer in the funnel-c clinical grammar: a cheaper SINGLE
 * card (equal Flow/Clear toggle) first, then the BOTH bundle marked best value.
 * Each card owns its cadence and adds straight to the cart (same wiring as the
 * old box: cadenceData + useCart, tagged listicle_buybox). Deliberately just
 * the two cards: the listicle's own downstream zones carry the supporting proof.
 *
 * Clinical grammar: white surfaces, hairline borders, navy = selected, gold
 * Save% badge, tabular-nums prices. No emoji, no font-mono eyebrows.
 * ========================================================================== */

const NAVY = "#1B2757";
const GOLD = "#C9A24A";
const GREEN = "#10B981";
const GREEN_TEXT = "#0b7a55";

/** Product photos used in the buy cards (single Flow/Clear + Both bundle). */
const CARD_IMAGE: Record<ProductHeroId, string> = {
  "01": "/lander/FlowNew.jpg",
  "02": "/lander/ClearNew.jpg",
  "03": "/formulas/both/BothNew.jpg",
};

/** The two subscription cadences shown as selectable rows (one-time is a link). */
type SubCadence = "monthly-sub" | "quarterly-sub";
const SUB_CADENCES: SubCadence[] = ["monthly-sub", "quarterly-sub"];
const DEFAULT_CADENCE: CadenceType = "monthly-sub";

const SUB_META: Record<SubCadence, { name: string; popular?: boolean }> = {
  "monthly-sub": { name: "Monthly subscription", popular: true },
  "quarterly-sub": { name: "Quarterly subscription" },
};

const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
    <path
      d="M3 8.5L6.5 12L13 4.5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Circle radio matching the clinical plan-row selector. */
function Radio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/25 bg-white"
      }`}
      aria-hidden
    >
      {selected && <Check className="h-2.5 w-2.5 text-white" />}
    </span>
  );
}

/** Selectable subscription rows + a demoted one-time link. */
function PlanPicker({
  formulaId,
  selectedCadence,
  onSelect,
  onBuyOnce,
}: {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onSelect: (c: CadenceType) => void;
  onBuyOnce: () => void;
}) {
  const otpPricing = getCadencePricingByProductHeroId(formulaId, "monthly-otp");

  return (
    <div className="flex flex-col gap-3">
      {SUB_CADENCES.map((cadence) => {
        const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
        const isSelected = selectedCadence === cadence;
        const months = cadence === "quarterly-sub" ? 3 : 1;
        const perMonth = pricing.price / months;
        const weeks = months * 4;
        const savePct = pricing.compareAtPrice
          ? Math.round((1 - pricing.price / pricing.compareAtPrice) * 100)
          : 0;
        const meta = SUB_META[cadence];
        const freeShots = pricing.freeShots ?? 0;

        return (
          <div key={cadence} className="relative">
            {/* Floating badge on the row edge (matches the card's Best value). */}
            {meta.popular && (
              <span
                className="absolute -top-3 left-4 z-10 rounded-full px-3 py-1 text-[12px] font-bold text-white"
                style={{ background: isSelected ? GREEN : NAVY }}
              >
                Most popular
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(cadence)}
              aria-pressed={isSelected}
              className={`flex w-full flex-col gap-2.5 rounded-[14px] border-2 bg-white px-4 pb-3.5 pt-4 text-left transition-colors ${
                isSelected
                  ? "border-[#1B2757]"
                  : "border-black/10 hover:border-black/25"
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio selected={isSelected} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] font-semibold leading-tight text-black">
                      {meta.name}
                    </span>
                    {savePct > 0 && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-bold text-white"
                        style={{ background: GOLD }}
                      >
                        Save {savePct}%
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-black/55 tabular-nums">
                    {formatPrice(pricing.price)} every {weeks} weeks ·{" "}
                    {pricing.shotCount} shots
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[26px] font-bold leading-none text-black tabular-nums">
                    {formatPrice(perMonth)}
                    <span className="text-[13px] font-medium text-black/50">/mo</span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-none tabular-nums text-[#1B2757]">
                    {formatPrice(pricing.perShot)} / shot
                  </span>
                </span>
              </div>

              {/* Free shots: the headline deal, in funnel green. */}
              {freeShots > 0 && (
                <div
                  className="flex items-center gap-2 rounded-[10px] px-3 py-2"
                  style={{ background: "rgba(16,185,129,0.12)" }}
                >
                  <span
                    className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: GREEN }}
                  >
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                  <span
                    className="text-[13px] font-semibold leading-snug"
                    style={{ color: GREEN_TEXT }}
                  >
                    +{freeShots} free shots on your first order
                  </span>
                </div>
              )}
            </button>
          </div>
        );
      })}

      {/* One-time purchase demoted to a link; adds straight to cart. The note
          keeps the subscription advantage (free shots + postage) visible. */}
      <button
        type="button"
        onClick={onBuyOnce}
        className="mx-auto mt-0.5 flex min-h-[44px] w-fit flex-col items-center justify-center text-center transition-opacity hover:opacity-70"
      >
        <span className="text-[14px] text-black/75 underline underline-offset-4">
          Or buy once · {formatPrice(otpPricing.price)}
        </span>
        <span className="mt-0.5 text-[11px] text-black/40">
          No free shots or free postage
        </span>
      </button>
    </div>
  );
}

/** Low-key "See what's inside" trigger that opens the shared PDP ingredient
 *  bottom sheet. Single shows the toggled formula; Both gets the AM/PM switcher. */
function IngredientSheetLink({ formulaId }: { formulaId: ProductHeroId }) {
  const tabs: ("flow" | "clear")[] =
    formulaId === "03" ? ["flow", "clear"] : formulaId === "01" ? ["flow"] : ["clear"];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"flow" | "clear">(tabs[0]);

  const showSwitcher = tabs.length > 1;
  const activeFormulaId: "01" | "02" = active === "flow" ? "01" : "02";
  const ingredients = getOrderedActiveIngredients(activeFormulaId);
  const title = active === "flow" ? "CONKA Flow" : "CONKA Clear";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-[13px] font-medium text-black/55 underline underline-offset-4 transition-colors hover:text-black/80"
      >
        See what&apos;s inside
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          aria-hidden
        >
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

/** A single product buy card (single with toggle, or the Both bundle). */
function ProductCard({
  formulaId,
  title,
  bestValue,
  toggle,
  onAdd,
}: {
  formulaId: ProductHeroId;
  title: string;
  bestValue?: boolean;
  /** Rendered above the image on the single card (Flow/Clear switch). */
  toggle?: ReactNode;
  onAdd: (formulaId: ProductHeroId, cadence: CadenceType) => void;
}) {
  const [cadence, setCadence] = useState<CadenceType>(DEFAULT_CADENCE);
  const [pending, setPending] = useState(false);
  const image = CARD_IMAGE[formulaId];
  const pricing = getCadencePricingByProductHeroId(formulaId, cadence);
  const savePct = pricing.compareAtPrice
    ? Math.round((1 - pricing.price / pricing.compareAtPrice) * 100)
    : 0;

  // Guard against double-adds while the cart mutation is in flight.
  const add = async (c: CadenceType) => {
    if (pending) return;
    setPending(true);
    try {
      await onAdd(formulaId, c);
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-[16px] border-2 bg-white p-4 ${
        bestValue ? "border-[#1B2757]" : "border-black/10"
      }`}
    >
      {bestValue && (
        <span
          className="absolute -top-3 left-4 z-10 rounded-full px-3 py-1 text-[12px] font-bold text-white"
          style={{ background: NAVY }}
        >
          Best value
        </span>
      )}

      {toggle}

      <div className="relative aspect-square w-full overflow-hidden rounded-[12px]">
        <Image
          src={image}
          alt={`${title} bottle`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 90vw, 40vw"
        />
      </div>

      <h3 className="mt-4 text-[19px] font-semibold leading-tight text-black">
        {title}
      </h3>

      <IngredientSheetLink formulaId={formulaId} />

      <div className="mt-3">
        <PlanPicker
          formulaId={formulaId}
          selectedCadence={cadence}
          onSelect={setCadence}
          onBuyOnce={() => add("monthly-otp")}
        />
      </div>

      {/* CTA pinned to the bottom so both cards' buttons line up. */}
      <div className="mt-4 flex flex-1 flex-col justify-end">
        <button
          type="button"
          onClick={() => add(cadence)}
          disabled={pending}
          className="min-h-[52px] w-full rounded-[12px] text-[15px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          style={{ background: NAVY }}
        >
          {pending
            ? "Adding..."
            : savePct > 0
              ? `Subscribe & Save ${savePct}%`
              : "Subscribe & Save"}
        </button>
        <p className="mt-2 text-center text-[11px] leading-snug text-black/55">
          100-day guarantee · Free UK shipping · Cancel anytime
        </p>
      </div>
    </div>
  );
}

/** Flow/Clear segmented switch for the single card. Equal weight (no spotlight). */
function SingleToggle({
  value,
  onChange,
}: {
  value: ProductHeroId;
  onChange: (id: ProductHeroId) => void;
}) {
  const options: { id: ProductHeroId; label: string }[] = [
    { id: "01", label: "Flow · Morning" },
    { id: "02", label: "Clear · Afternoon" },
  ];
  return (
    <div className="mb-3 flex gap-1.5 rounded-full bg-black/[0.05] p-1">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={`min-h-[44px] flex-1 rounded-full text-[14px] font-semibold transition-colors ${
              active ? "text-white" : "text-black/55 hover:text-black/80"
            }`}
            style={active ? { background: NAVY } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ListiclePurchase({
  defaultSingle = "01",
}: {
  /** Which of Flow ("01") / Clear ("02") the single card starts on. */
  defaultSingle?: ProductHeroId;
}) {
  const { addToCart } = useCart();
  // "03" (Both) is not a valid single; fall back to Flow.
  const [singleFormula, setSingleFormula] = useState<ProductHeroId>(
    defaultSingle === "02" ? "02" : "01",
  );

  const handleAdd = async (formulaId: ProductHeroId, cadence: CadenceType) => {
    const variant = getCadenceVariantByProductHeroId(formulaId, cadence);
    if (!variant?.variantId) {
      console.warn("Variant not configured for", formulaId, cadence);
      return;
    }
    await addToCart(variant.variantId, 1, variant.sellingPlanId, {
      location: "listicle_buybox",
      source: "listicle",
    });
  };

  const singleTitle = getHeroContent(singleFormula).name;
  const bothTitle = getHeroContent("03").name;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Single card first, the cheaper entry. The key remounts it on a
          Flow/Clear switch, resetting the cadence to the default. */}
      <ProductCard
        key={singleFormula}
        formulaId={singleFormula}
        title={singleTitle}
        toggle={<SingleToggle value={singleFormula} onChange={setSingleFormula} />}
        onAdd={handleAdd}
      />
      {/* Both card second, the best value. */}
      <ProductCard
        formulaId="03"
        title={bothTitle}
        bestValue
        onAdd={handleAdd}
      />
    </div>
  );
}
