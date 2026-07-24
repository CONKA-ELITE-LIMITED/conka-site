"use client";

import { useState } from "react";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  CadenceType,
  getCadenceVariantByProductHeroId,
} from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { getPurchaseSource, getQuizSessionId } from "@/app/lib/analytics";
import ProductHeroV2 from "@/app/components/product/ProductHeroV2";
import ProductHeroMobileV2 from "@/app/components/product/ProductHeroMobileV2";
import { SECTION, useListicleCta, useListicleSrc } from "./listicleAnalytics";

/**
 * Listicle buy zone (/go): the Simple DTC PDP hero (ProductHeroV2 desktop /
 * ProductHeroMobileV2 mobile), wired with its own cadence state + cart exactly
 * like the /conka-both PDP. Defaults to Both ("03"). Replaces the former
 * ListiclePurchase two-card box. Add-to-cart is tagged listicle_buybox.
 */
export default function ListicleProductHero({
  productHeroId = "03",
}: {
  productHeroId?: ProductHeroId;
}) {
  const isMobile = useIsMobile();
  const fireCta = useListicleCta();
  const srcFor = useListicleSrc();
  const { addToCart } = useCart();
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  const handleAddToCart = async (cadence: CadenceType = selectedCadence) => {
    // Fired here rather than by click delegation on the section: this zone is
    // full of cadence toggles and accordions, so delegating every button click
    // would wildly over-count. Intent to buy is the add-to-cart itself.
    fireCta(SECTION.product);

    const variantData = getCadenceVariantByProductHeroId(productHeroId, cadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location: "listicle_buybox",
        // This buy zone sits on the listicle itself, so there is no ?src= in
        // the URL to read. Tag it from context so an in-page purchase is
        // attributed to the page, in the same format the PDP handoff uses.
        source: srcFor(SECTION.product) ?? getPurchaseSource(),
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for cadence:", cadence);
    }
  };

  const sharedProps = {
    formulaId: productHeroId,
    selectedCadence,
    onCadenceChange: setSelectedCadence,
    onAddToCart: () => handleAddToCart(),
    onOtpAddToCart: () => handleAddToCart("monthly-otp"),
  };

  return isMobile ? (
    <ProductHeroMobileV2 {...sharedProps} />
  ) : (
    <ProductHeroV2 {...sharedProps} />
  );
}
