"use client";

import ProductCard from "./ProductCard";
import type { ProductGridProps } from "./ProductGrid";
import ProductGridHeader from "./ProductGridHeader";

export default function ProductGridTablet(props?: ProductGridProps) {
  const { exclude = [], hideHeading = false, header, linkSrc } = props ?? {};

  const showFlow = !exclude.includes("flow");
  const showClear = !exclude.includes("clear");
  const showProtocol = !exclude.includes("protocol");

  return (
    <>
      {!hideHeading ? <ProductGridHeader {...(header ?? {})} /> : null}

      <div className="grid grid-cols-3 gap-5 items-stretch">
        {showProtocol ? (
          <ProductCard productType="protocol" linkSrc={linkSrc} />
        ) : (
          <div aria-hidden="true" />
        )}

        {showFlow ? (
          <ProductCard productType="flow" linkSrc={linkSrc} />
        ) : (
          <div aria-hidden="true" />
        )}

        {showClear ? (
          <ProductCard productType="clear" linkSrc={linkSrc} />
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </>
  );
}
