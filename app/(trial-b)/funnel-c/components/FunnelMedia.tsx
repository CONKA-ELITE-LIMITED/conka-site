"use client";

/**
 * funnel-c — left-column media.
 *
 * Plays the product motion clip (the same liquid/bottle videos used on the
 * lander) rather than a slideshow of box photos. Swaps source by selected
 * product. A restrained caption keeps the core selling point (patent / cert)
 * without cluttering the frame.
 */

import { type FunnelProduct } from "../../lib/funnelData";

// The swirling-liquid 3D renders used in the product-page benefits section
// (FlowLiquid / ClearLiquid). Both has no liquid variant, so it keeps the
// still-water bottle render.
const VIDEO: Record<FunnelProduct, { webm: string; mp4: string; poster?: string }> = {
  flow: { webm: "/videos/flow/FlowLiquid.webm", mp4: "/videos/flow/FlowLiquid.mp4", poster: "/videos/flow/FlowLiquid-poster.jpg" },
  clear: { webm: "/videos/clear/ClearLiquid.webm", mp4: "/videos/clear/ClearLiquid.mp4", poster: "/videos/clear/ClearLiquid-poster.jpg" },
  both: { webm: "/videos/both/BothStillWater.webm", mp4: "/videos/both/BothStillWater.mp4", poster: "/videos/both/BothStillWater-poster.jpg" },
};

const CAPTION: Record<FunnelProduct, string> = {
  flow: "Morning · caffeine-free focus",
  clear: "Afternoon · clears the 2pm fog",
  both: "AM + PM · the complete daily system",
};

export default function FunnelMedia({
  product,
  showCaption = true,
}: {
  product: FunnelProduct;
  /** Off on the Learn step, where the page heading owns the hierarchy. */
  showCaption?: boolean;
}) {
  const src = VIDEO[product];

  return (
    // Height comes entirely from the parent (mobile banner / desktop column) —
    // no min-height, so the compact mobile banner isn't forced taller.
    <div className="relative w-full h-full overflow-hidden bg-[var(--brand-tint)]">
      <video
        key={product}
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={src.poster}
      >
        <source src={src.webm} type="video/webm" />
        <source src={src.mp4} type="video/mp4" />
      </video>

      {/* Slim caption only — no product name (the page heading + selections own
          the title). Sits on a strong white scrim so it never clashes with the
          render behind it. Hidden on Learn to keep the hierarchy clean. */}
      {showCaption && (
        <div className="absolute inset-x-0 bottom-0 px-4 pt-10 pb-3 lg:px-7 lg:pb-5 bg-gradient-to-t from-white via-white/70 to-transparent">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1B2757]">
            {CAPTION[product]}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/50 mt-1">
            Informed Sport certified · UK patent GB2629279
          </p>
        </div>
      )}
    </div>
  );
}
