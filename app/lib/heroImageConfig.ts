import { CadenceType } from "@/app/lib/cadenceData";
import { FormulaId } from "@/app/lib/productData";

// 5 images per product: [0] cadence-driven box hero, [1-3] lifestyle, [4] nutrition/closing
export function getFormulaHeroImages(formulaId: FormulaId, cadence: CadenceType): string[] {
  if (formulaId === "01") {
    const slot1 =
      cadence === "quarterly-sub"
        ? "/formulas/box/FlowQuarterlyBox.jpg"
        : "/formulas/box/FlowBox.jpg";
    return [
      slot1,
      "/lifestyle/flow/FlowClose.jpg",
      "/lifestyle/flow/FlowWork.jpg",
      "/lifestyle/flow/FlowBoxOpen.jpg",
      "/formulas/conkaFlow/FlowNutrition.jpg",
    ];
  }
  // Clear (formulaId "02")
  const slot1 =
    cadence === "quarterly-sub"
      ? "/formulas/box/ClearQuarterlyBox.jpg"
      : "/formulas/box/ClearBox.jpg";
  return [
    slot1,
    "/lifestyle/clear/ClearPassed.jpg",
    "/lifestyle/clear/ClearHoldJeans.jpg",
    "/lifestyle/clear/ClearBoxOpen.jpg",
    "/formulas/conkaClear/ClearNutrition.jpg",
  ];
}

// 5 images for Balance: [0] cadence-driven box, [1-4] lifestyle placeholders
export function getBalanceHeroImages(cadence: CadenceType): string[] {
  const slot1 =
    cadence === "quarterly-sub"
      ? "/formulas/box/BothQuarterlyBox.jpg"
      : "/formulas/box/BothBox.jpg";
  return [
    slot1,
    "/formulas/both/BothHold.jpg",
    "/lifestyle/flow/FlowBoxOpen.jpg",
    "/lifestyle/both/BothJeans.jpg",
    "/lifestyle/clear/ClearBoxOpen.jpg",
  ];
}
