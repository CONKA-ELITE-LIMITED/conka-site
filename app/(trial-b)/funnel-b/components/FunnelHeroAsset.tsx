"use client";

import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_HERO_IMAGES,
  getFunnelProductSlideshow,
} from "../../lib/funnelData";
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";

interface FunnelHeroAssetProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
  /** "carousel" = product slideshow (step 1, choosing product). "static" = selected product image (step 2, choosing cadence). */
  mode: "static" | "carousel";
}

export default function FunnelHeroAsset({
  product,
  cadence,
  mode,
}: FunnelHeroAssetProps) {
  // --- Carousel mode (step 1): product slideshow for selected product ---
  if (mode === "carousel") {
    const images = getFunnelProductSlideshow(product, cadence);
    const heroInfo = FUNNEL_HERO_IMAGES[product];

    return (
      <div className="w-full bg-[var(--brand-tint)] rounded-[var(--brand-radius-card)] overflow-hidden [&_.mt-3]:hidden">
        <ProductImageSlideshow
          key={product}
          images={images}
          alt={heroInfo.alt}
          fullBleedThumbnails
        />
      </div>
    );
  }

  // --- Static mode (step 2): single image for selected product ---
  // Matches the carousel container size from step 1 (no max-h constraint)
  return (
    <div className="relative w-full aspect-square lg:aspect-[4/3] overflow-hidden rounded-[var(--brand-radius-card)] bg-[var(--brand-tint)]">
      {/* Render all product images, crossfade on selection */}
      {(Object.keys(FUNNEL_HERO_IMAGES) as FunnelProduct[]).map((key) => {
        const img = FUNNEL_HERO_IMAGES[key];
        return (
          <Image
            key={key}
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-opacity duration-500 lg:object-top ${
              key === product ? "opacity-100" : "opacity-0"
            }`}
            priority={key === "both"}
          />
        );
      })}
    </div>
  );
}
