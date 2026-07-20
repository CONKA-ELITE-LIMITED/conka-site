export interface ProductGridCopyProps {
  exclude?: ("flow" | "clear" | "protocol")[];
}

export interface ProductGridCopy {
  title: string;
}

const LANDING = {
  title: "Find Your Formula",
} as const;

const CROSS_SELL = {
  title: "Explore Other Products",
} as const;

export function getProductGridCopy(
  props?: ProductGridCopyProps,
): ProductGridCopy {
  const crossSell = (props?.exclude?.length ?? 0) > 0;
  return crossSell ? { ...CROSS_SELL } : { ...LANDING };
}
