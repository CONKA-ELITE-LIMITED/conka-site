"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductGridMobile from "./ProductGridMobile";
import ProductGridTablet from "./ProductGridTablet";
import { getProductGridCopy } from "./productGridCopy";

export interface ProductGridProps {
  exclude?: ("flow" | "clear" | "protocol")[];
}

export default function ProductGrid(props?: ProductGridProps) {
  const { exclude = [] } = props ?? {};
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
  const copy = getProductGridCopy({ exclude });

  if (width !== undefined && width < 768) {
    return <ProductGridMobile exclude={exclude} />;
  }

  if (width !== undefined && width < 1024) {
    return <ProductGridTablet exclude={exclude} />;
  }

  if (width !== undefined && width >= 1024) {
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
