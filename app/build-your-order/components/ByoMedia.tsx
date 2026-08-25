"use client";

/**
 * Build Your Order — product motion media.
 *
 * Plays the neuron Float renders (the current asset generation, matching the
 * home hero and PDP benefit sections) and swaps source by selected product.
 * A restrained caption keeps the core selling point (patent / cert) without
 * cluttering the frame.
 *
 * `desktop` selects the wider Desktop encode where one exists (Both), for the
 * large sticky left column; the portrait-friendly default feeds the mobile
 * gallery.
 */

import { type ByoProduct } from "@/app/lib/byoData";

interface VideoSource {
  webm: string;
  mp4: string;
  poster?: string;
}

const VIDEO: Record<ByoProduct, VideoSource> = {
  flow: { webm: "/videos/flow/FlowFloat.webm", mp4: "/videos/flow/FlowFloat.mp4", poster: "/videos/flow/FlowFloat-poster.jpg" },
  clear: { webm: "/videos/clear/ClearFloat.webm", mp4: "/videos/clear/ClearFloat.mp4", poster: "/videos/clear/ClearFloat-poster.jpg" },
  both: { webm: "/videos/both/BothNeuronFloat.webm", mp4: "/videos/both/BothNeuronFloat.mp4", poster: "/videos/both/BothNeuronFloat-poster.jpg" },
};

/** Wider desktop encodes, where they exist. Falls back to the default. */
const VIDEO_DESKTOP: Partial<Record<ByoProduct, VideoSource>> = {
  both: { webm: "/videos/both/BothNeuronFloatDesktop.webm", mp4: "/videos/both/BothNeuronFloatDesktop.mp4", poster: "/videos/both/BothNeuronFloatDesktop-poster.jpg" },
};

const CAPTION: Record<ByoProduct, string> = {
  flow: "Morning. Caffeine-free focus.",
  clear: "Afternoon. Clears the 2pm fog.",
  both: "Morning to evening. The full system.",
};

export default function ByoMedia({
  product,
  showCaption = true,
  desktop = false,
}: {
  product: ByoProduct;
  /** Off on the Learn step, where the page heading owns the hierarchy. */
  showCaption?: boolean;
  /** Use the wider desktop encode where one exists (the sticky left column). */
  desktop?: boolean;
}) {
  const src = (desktop ? VIDEO_DESKTOP[product] : undefined) ?? VIDEO[product];

  return (
    // Height comes entirely from the parent (mobile gallery slide / desktop
    // column) — no min-height, so compact containers aren't forced taller.
    <div className="relative w-full h-full overflow-hidden bg-black/[0.04]">
      <video
        key={`${product}-${desktop}`}
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
          <p className="text-[14px] font-semibold text-black">
            {CAPTION[product]}
          </p>
          <p className="text-[12px] text-black/55 mt-0.5">
            Informed Sport certified · UK patent GB2629279
          </p>
        </div>
      )}
    </div>
  );
}
