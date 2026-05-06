"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "../../components/navigation";
import {
  FormulasPurchaseHeader,
  VolumeTierKey,
  FormulaCard,
  InfoSection,
  BenefitsSection,
  IngredientsSection,
  TasteSection,
} from "@/app/components/professionals/formulas";
import {
  FormulaId,
  PurchaseType,
  getB2BTier,
  getB2BNextTierInfo,
} from "@/app/lib/productData";
import { useCart } from "@/app/context/CartContext";
import { getB2BFormulaVariantId } from "@/app/lib/shopifyProductMapping";
import { getB2BTotalBoxes, getB2BPendingBoxes } from "@/app/lib/b2bCartTier";

export default function ProfessionalsFormulasPage() {
  const { addToCart, openCart, getCartItems } = useCart();

  // State for formula selection (mobile toggle)
  const [selectedFormula, setSelectedFormula] = useState<FormulaId>("01");

  // State for CONKA Flow (01)
  const [flowPurchaseType, setFlowPurchaseType] =
    useState<PurchaseType>("subscription");
  const [flowQuantity, setFlowQuantity] = useState(1);

  // State for CONKA Clear (02)
  const [clearPurchaseType, setClearPurchaseType] =
    useState<PurchaseType>("subscription");
  const [clearQuantity, setClearQuantity] = useState(1);

  // B2B uses one cart-wide tier (Starter/Squad/Elite) based on total B2B boxes.
  // We compute "tier if you add Flow" and "tier if you add Clear" so each card shows
  // the correct price and next-tier message; they often match because box bands are shared.
  const lines = getCartItems();
  const flowTotalBoxes =
    getB2BTotalBoxes(lines) + getB2BPendingBoxes("formula", "01", flowQuantity);
  const clearTotalBoxes =
    getB2BTotalBoxes(lines) +
    getB2BPendingBoxes("formula", "02", clearQuantity);
  const flowTier = getB2BTier(flowTotalBoxes);
  const clearTier = getB2BTier(clearTotalBoxes);
  const flowNextTier = getB2BNextTierInfo(flowTotalBoxes);
  const clearNextTier = getB2BNextTierInfo(clearTotalBoxes);

  const handleFlowAddToCart = async () => {
    const lines = getCartItems();
    const totalBoxes =
      getB2BTotalBoxes(lines) +
      getB2BPendingBoxes("formula", "01", flowQuantity);
    const tier = getB2BTier(totalBoxes);
    const variantData = getB2BFormulaVariantId("01", tier, flowPurchaseType);
    if (variantData?.variantId) {
      await addToCart(
        variantData.variantId,
        flowQuantity,
        variantData.sellingPlanId,
        { location: "professional_formulas", source: "professional_portal" },
      );
      setFlowQuantity(1);
      openCart();
    }
  };

  const handleClearAddToCart = async () => {
    const lines = getCartItems();
    const totalBoxes =
      getB2BTotalBoxes(lines) +
      getB2BPendingBoxes("formula", "02", clearQuantity);
    const tier = getB2BTier(totalBoxes);
    const variantData = getB2BFormulaVariantId("02", tier, clearPurchaseType);
    if (variantData?.variantId) {
      await addToCart(
        variantData.variantId,
        clearQuantity,
        variantData.sellingPlanId,
        { location: "professional_formulas", source: "professional_portal" },
      );
      setClearQuantity(1);
      openCart();
    }
  };

  return (
    <div
      className="min-h-screen theme-conka-flow lg:pt-20"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <nav aria-label="Back to portal" className="px-6 md:px-16 pt-4 pb-2">
        <Link
          href="/professionals"
          className="font-mono text-sm opacity-70 hover:opacity-100 transition-opacity underline"
        >
          Back to portal
        </Link>
      </nav>

      {/* Header Section */}
      <FormulasPurchaseHeader />

      {/* Formula Cards Grid */}
      <section className="px-6 md:px-16 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <FormulaCard
              formulaId="01"
              selectedPurchaseType={flowPurchaseType}
              quantity={flowQuantity}
              tier={flowTier}
              nextTier={flowNextTier}
              onPurchaseTypeChange={setFlowPurchaseType}
              onQuantityChange={setFlowQuantity}
              onAddToCart={handleFlowAddToCart}
            />
            <FormulaCard
              formulaId="02"
              selectedPurchaseType={clearPurchaseType}
              quantity={clearQuantity}
              tier={clearTier}
              nextTier={clearNextTier}
              onPurchaseTypeChange={setClearPurchaseType}
              onQuantityChange={setClearQuantity}
              onAddToCart={handleClearAddToCart}
            />
          </div>

          <VolumeTierKey totalBoxes={getB2BTotalBoxes(lines)} className="mt-6 md:mt-8" />
        </div>
      </section>

      {/* Formula Information Sections */}
      {/* Mobile Toggle - Only visible on mobile */}
      <div className="md:hidden px-6 md:px-16 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFormula("01")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedFormula === "01"
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                  : "bg-transparent border-[var(--foreground)]/30 text-[var(--foreground)] hover:border-[var(--foreground)]/50"
              }`}
            >
              <span className="font-mono text-sm font-medium">
                CONKA Flow
              </span>
            </button>
            <button
              onClick={() => setSelectedFormula("02")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedFormula === "02"
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                  : "bg-transparent border-[var(--foreground)]/30 text-[var(--foreground)] hover:border-[var(--foreground)]/50"
              }`}
            >
              <span className="font-mono text-sm font-medium">
                CONKA Clear
              </span>
            </button>
          </div>
        </div>
      </div>

      <InfoSection selectedFormula={selectedFormula} />
      <BenefitsSection selectedFormula={selectedFormula} />
      <IngredientsSection selectedFormula={selectedFormula} />
      <TasteSection selectedFormula={selectedFormula} />
    </div>
  );
}
