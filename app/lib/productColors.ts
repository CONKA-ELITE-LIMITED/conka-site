/**
 * Product colors and gradients.
 */

import type { FormulaId, ProductId } from "./productTypes";

// Formula colors - ALWAYS consistent
export const FORMULA_COLORS = {
  "01": {
    bg: "bg-amber-500",
    text: "text-amber-500",
    hex: "#f59e0b", // Orange/amber accent color for CONKA Flow
  },
  "02": {
    bg: "bg-[#94b9ff]",
    text: "text-[#94b9ff]",
    hex: "#94b9ff", // Soft blue for CONKA Clarity
  },
} as const;

export const PRODUCT_GRADIENTS: Record<
  ProductId,
  { start: string; end: string; solid: string }
> = {
  // Formulas
  "01": { start: "#ffde59", end: "#ff914d", solid: "#f59e0b" }, // CONKA Flow: yellow → orange
  "02": { start: "#cdffd8", end: "#94b9ff", solid: "#94b9ff" }, // CONKA Clear: mint → soft blue
  // Protocols
  "1": { start: "#ff914d", end: "#ff3131", solid: "#ff3131" }, // Resilience — orange to red
  "2": { start: "#ffcafb", end: "#896ebe", solid: "#896ebe" }, // Precision — pink to purple
  "3": { start: "#c9ffbe", end: "#3a9f7e", solid: "#3a9f7e" }, // Balance — green gradient
  "4": { start: "#fff7ad", end: "#ffa9f9", solid: "#ffa9f9" }, // Ultimate — yellow to pink
} as const;

/** Get product gradient (works for formulas and protocols) */
export function getProductGradient(productId: ProductId): { start: string; end: string } {
  const gradient = PRODUCT_GRADIENTS[productId];
  return { start: gradient.start, end: gradient.end };
}

/**
 * Get product accent color (solid hex).
 * Accepts product IDs ("01", "02", "1", "2", "3", "4") or product type names
 * ("flow", "clarity", "Resilience Protocol", etc.). Returns undefined for
 * generic "protocol" or unknown keys.
 */
export function getProductAccent(typeOrId: ProductId): string;
export function getProductAccent(typeOrId: string): string | undefined;
export function getProductAccent(typeOrId: string): string | undefined {
  const idMap: Record<string, ProductId> = {
    flow: "01",
    clarity: "02",
    "Resilience Protocol": "1",
    "Precision Protocol": "2",
    "Balance Protocol": "3",
    "Ultimate Protocol": "4",
  };
  const id = idMap[typeOrId] ?? (typeOrId as ProductId);
  const gradient = PRODUCT_GRADIENTS[id];
  return gradient?.solid;
}

/** Font colour when text sits on the product gradient. White for dark gradients, black for light. */
export const PRODUCT_GRADIENT_TEXT_COLOR: Record<ProductId, "white" | "black"> = {
  "01": "white", // Flow
  "02": "black", // Clear
  "1": "white",  // Resilience
  "2": "white",  // Precision
  "3": "white",  // Balance
  "4": "black",  // Ultimate
} as const;

export function getGradientTextColor(productId: ProductId): "white" | "black" {
  return PRODUCT_GRADIENT_TEXT_COLOR[productId];
}

// Legacy exports for backward compatibility
export const FORMULA_GRADIENTS: Record<FormulaId, { start: string; end: string }> = {
  "01": { start: PRODUCT_GRADIENTS["01"].start, end: PRODUCT_GRADIENTS["01"].end },
  "02": { start: PRODUCT_GRADIENTS["02"].start, end: PRODUCT_GRADIENTS["02"].end },
} as const;

/** Interpolate between two hex colors. t in [0, 1]. */
export function interpolateHex(
  startHex: string,
  endHex: string,
  t: number
): string {
  const parse = (hex: string) => {
    const n = hex.replace("#", "");
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ];
  };
  const [r0, g0, b0] = parse(startHex);
  const [r1, g1, b1] = parse(endHex);
  const r = Math.round(r0 + (r1 - r0) * t);
  const g = Math.round(g0 + (g1 - g0) * t);
  const b = Math.round(b0 + (b1 - b0) * t);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
