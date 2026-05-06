"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "../../components/navigation";
import {
  ProtocolPurchaseHeader,
  ProtocolListSelector,
  ProtocolPurchaseCard,
  ProtocolScheduleCalendar,
  PROFESSIONAL_PROTOCOL_ORDER,
} from "@/app/components/professionals/protocol";
import { VolumeTierKey } from "@/app/components/professionals/formulas";
import ProtocolBenefits from "@/app/components/protocol/ProtocolBenefits";
import CaseStudiesDataDriven from "@/app/components/CaseStudiesDataDriven";
import {
  ProtocolId,
  PurchaseType,
  getB2BTier,
  getB2BNextTierInfo,
} from "@/app/lib/productData";
import { useCart } from "@/app/context/CartContext";
import { getB2BProtocolVariantId } from "@/app/lib/shopifyProductMapping";
import { getB2BTotalBoxes, getB2BPendingBoxes } from "@/app/lib/b2bCartTier";

export default function ProfessionalsProtocolPage() {
  const { addToCart, openCart, getCartItems } = useCart();

  // Protocol: default to first in display order so card is visible
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolId>(
    PROFESSIONAL_PROTOCOL_ORDER[0]
  );
  const [protocolPurchaseType, setProtocolPurchaseType] =
    useState<PurchaseType>("subscription");
  const [protocolQuantity, setProtocolQuantity] = useState(1);

  // B2B tier from total B2B boxes (cart + pending protocol).
  const lines = getCartItems();
  const protocolTotalBoxes =
    getB2BTotalBoxes(lines) +
    getB2BPendingBoxes("protocol", selectedProtocol, protocolQuantity);
  const protocolTier = getB2BTier(protocolTotalBoxes);
  const protocolNextTier = getB2BNextTierInfo(protocolTotalBoxes);

  const handleProtocolSelect = (protocolId: ProtocolId) => {
    setSelectedProtocol(protocolId);
    setProtocolQuantity(1);
  };

  const handleProtocolAddToCart = async () => {
    const lines = getCartItems();
    const totalBoxes =
      getB2BTotalBoxes(lines) +
      getB2BPendingBoxes("protocol", selectedProtocol, protocolQuantity);
    const tier = getB2BTier(totalBoxes);
    const variantData = getB2BProtocolVariantId(
      selectedProtocol,
      tier,
      protocolPurchaseType
    );
    if (variantData?.variantId) {
      await addToCart(
        variantData.variantId,
        protocolQuantity,
        variantData.sellingPlanId,
        {
          location: "professional_protocol",
          source: "professional_portal",
        }
      );
      setProtocolQuantity(1);
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

      <ProtocolPurchaseHeader />

      {/* Protocol section: tier key, then vertical list (desktop) / horizontal scroll (mobile) + purchase card */}
      <section className="px-6 md:px-16 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1">Protocols</h2>
            <p className="font-mono text-xs md:text-sm opacity-70">
              Mixed plans combining CONKA Flow and CONKA Clear for maximum performance
            </p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[minmax(0,340px)_1fr] gap-6 md:gap-8">
            {/* Left: protocol list (vertical on desktop, horizontal on mobile) */}
            <div>
              <ProtocolListSelector
                selectedProtocol={selectedProtocol}
                onSelect={handleProtocolSelect}
              />
            </div>

            {/* Right: single protocol purchase card */}
            <div className="min-h-[400px]">
              <ProtocolPurchaseCard
                protocolId={selectedProtocol}
                selectedPurchaseType={protocolPurchaseType}
                quantity={protocolQuantity}
                onPurchaseTypeChange={setProtocolPurchaseType}
                onQuantityChange={setProtocolQuantity}
                onAddToCart={handleProtocolAddToCart}
                tier={protocolTier}
                nextTier={protocolNextTier}
              />
            </div>
          </div>

          <VolumeTierKey totalBoxes={getB2BTotalBoxes(lines)} className="mt-6 md:mt-8" />
        </div>
      </section>

      {/* Calendar: recommended schedule (max tier) for selected protocol */}
      <ProtocolScheduleCalendar protocolId={selectedProtocol} />

      {/* Why this protocol works */}
      <ProtocolBenefits protocolId={selectedProtocol} />

      <CaseStudiesDataDriven />
    </div>
  );
}
