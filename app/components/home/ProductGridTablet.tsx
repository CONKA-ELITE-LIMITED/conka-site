"use client";

import ProductCard from "./ProductCard";
import type { ProductGridProps } from "./ProductGrid";
import { getProductGridCopy } from "./productGridCopy";

export default function ProductGridTablet(props?: ProductGridProps) {
  const { exclude = [] } = props ?? {};

  const showFlow = !exclude.includes("flow");
  const showClear = !exclude.includes("clear");
  const showProtocol = !exclude.includes("protocol");
  const copy = getProductGridCopy({ exclude });

  return (
    <>
      <div className="mb-10">
        <h2
          className="brand-h1 text-[#0e1f3f]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {copy.title}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5 items-stretch">
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
