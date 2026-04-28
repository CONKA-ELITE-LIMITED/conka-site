"use client";

// TODO: no longer used on /conka-flow PDP. Check if can be deleted once /conka-clarity and /protocol/3 are swept.

import useIsMobile from "@/app/hooks/useIsMobile";
import { FormulaId } from "@/app/lib/productData";
import FormulaBenefitsStatsDesktop from "./FormulaBenefitsStatsDesktop";
import FormulaBenefitsStatsMobile from "./FormulaBenefitsStatsMobile";

interface FormulaBenefitsStatsProps {
  formulaId: FormulaId;
}

export default function FormulaBenefitsStats({
  formulaId,
}: FormulaBenefitsStatsProps) {
  const isMobile = useIsMobile();

  // Avoid hydration mismatch: render desktop by default, then switch on client
  if (isMobile === undefined) {
    return <FormulaBenefitsStatsDesktop formulaId={formulaId} />;
  }

  return isMobile ? (
    <FormulaBenefitsStatsMobile formulaId={formulaId} />
  ) : (
    <FormulaBenefitsStatsDesktop formulaId={formulaId} />
  );
}
