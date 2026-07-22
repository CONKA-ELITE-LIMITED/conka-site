"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductGridMobile from "./ProductGridMobile";
import ProductGridTablet from "./ProductGridTablet";
import ProductGridHeader, {
  type ProductGridHeaderProps,
} from "./ProductGridHeader";

export interface ProductGridProps {
  exclude?: ("flow" | "clear" | "protocol")[];
  /** Hide the offer header entirely. */
  hideHeading?: boolean;
  /** Override the default offer-header copy (eyebrow / title / subline / offer). */
  header?: ProductGridHeaderProps;
}

export default function ProductGrid(props?: ProductGridProps) {
  const { exclude = [], hideHeading = false, header } = props ?? {};
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const check = () => setWidth(window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showFlow = !exclude.includes("flow");
  const showClear = !exclude.includes("clear");
  const showProtocol = !exclude.includes("protocol");

  if (width !== undefined && width < 768) {
    return (
      <ProductGridMobile
        exclude={exclude}
        hideHeading={hideHeading}
        header={header}
      />
    );
  }

  if (width !== undefined && width < 1024) {
    return (
      <ProductGridTablet
        exclude={exclude}
        hideHeading={hideHeading}
        header={header}
      />
    );
  }

  if (width !== undefined && width >= 1024) {
    return (
      <>
        {!hideHeading ? <ProductGridHeader {...(header ?? {})} /> : null}

        <div className="grid grid-cols-3 gap-6 items-stretch">
          {showProtocol ? (
            <ProductCard productType="protocol" />
          ) : (
            <div aria-hidden="true" />
          )}

          {showFlow ? (
            <ProductCard productType="flow" />
          ) : (
            <div aria-hidden="true" />
          )}

          {showClear ? (
            <ProductCard productType="clear" />
          ) : (
            <div aria-hidden="true" />
          )}
        </div>
      </>
    );
  }

  return null;
}
