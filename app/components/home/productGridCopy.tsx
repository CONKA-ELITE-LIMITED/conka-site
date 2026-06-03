export interface ProductGridCopyProps {
  exclude?: ("flow" | "clear" | "protocol")[];
}

export interface ProductGridCopy {
  eyebrow: string;
  title: string;
}

const LANDING = {
  eyebrow: "// Build your routine · CONKA-03",
  title: "Find Your Formula",
} as const;

const CROSS_SELL = {
  eyebrow: "// Complete your stack · CONKA-03",
  title: "Explore Other Products",
} as const;

export function getProductGridCopy(
  props?: ProductGridCopyProps,
): ProductGridCopy {
  const crossSell = (props?.exclude?.length ?? 0) > 0;
  return crossSell ? { ...CROSS_SELL } : { ...LANDING };
}
