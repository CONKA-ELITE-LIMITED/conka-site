"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { formatPrice, FormulaId, formulaContent } from "@/app/lib/productData";
import {
  CadenceType,
  BYO_CADENCES,
  BOTH_HERO_CONTENT,
} from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";

/* ============================================================================
 * StickyPurchaseFooter
 *
 * The persistent buy bar on the three PDPs, lg and up. One row: product name,
 * the selected plan and its price, and the CTA. Cadence selection lives in the
 * hero widget, so the bar only confirms what is being bought.
 *
 * Deliberately minimal (SCRUM-1260). It used to carry a bordered thumbnail
 * block and a free-shots badge, which tripled its height for information the
 * hero already shows, and before that a pack-size dropdown and subscribe toggle
 * from the pre-cadence pricing model.
 *
 * Pass either formulaId (Flow, Clear) or productHeroId="03" (Both).
 * ========================================================================== */

interface StickyPurchaseFooterProps {
  /** Flow ("01") or Clear ("02"). */
  formulaId?: FormulaId;
  /** "03" for Both, which bypasses the formula lookup. */
  productHeroId?: ProductHeroId;
  selectedCadence: CadenceType;
  cadencePrice: number;
  onAddToCart: () => void;
}

export default function StickyPurchaseFooter({
  formulaId,
  productHeroId,
  selectedCadence,
  cadencePrice,
  onAddToCart,
}: StickyPurchaseFooterProps) {
  const productName =
    productHeroId === "03"
      ? BOTH_HERO_CONTENT.name
      : formulaId
        ? formulaContent[formulaId].name
        : "";

  const cadenceDisplay = BYO_CADENCES[selectedCadence];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/12 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 md:px-6">
        <p className="min-w-0 truncate text-sm text-black">
          <span className="font-bold">{productName}</span>
          <span className="ml-2 text-black/60">
            {cadenceDisplay.label} · {formatPrice(cadencePrice)}
          </span>
        </p>
        <ConkaCTAButton compact onClick={onAddToCart} className="!w-auto shrink-0">
          Add to Cart · {formatPrice(cadencePrice)}
        </ConkaCTAButton>
      </div>
    </div>
  );
}
