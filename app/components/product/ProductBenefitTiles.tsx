import Image from "next/image";

/*
 * ProductBenefitTiles — Magic Mind-style benefits band.
 *
 * A textured cream "paper" tile with three bold benefit columns, and a
 * transparent ingredient render poking out above and below the tile.
 *
 * The renders are formula-aware: pass formula="flow" (default) or "clear" and
 * the component picks the matching ingredient pair. topImage/bottomImage still
 * override the preset if a page needs bespoke art.
 *
 * Content-only: the page owns the <section>, background, and track.
 */

interface BenefitItem {
  title: string;
  description: string;
}

interface PokeImage {
  src: string;
  alt: string;
}

type Formula = "flow" | "clear";

interface ProductBenefitTilesProps {
  items?: BenefitItem[];
  formula?: Formula;
  topImage?: PokeImage;
  bottomImage?: PokeImage;
}

const DEFAULT_ITEMS: BenefitItem[] = [
  {
    title: "Mental performance",
    description:
      "Sharpen focus, cognition, and recall with clinically-backed ingredients.",
  },
  {
    title: "Sustained energy",
    description:
      "Sustain your mental energy and stay productive all day with energy-supporting ingredients.",
  },
  {
    title: "Brain health",
    description:
      "Optimise long-term brain health and cognitive function with neurosupportive antioxidants.",
  },
];

// Ingredient renders per formula. Top pokes above the tile, bottom below.
const FORMULA_RENDERS: Record<Formula, { top: PokeImage; bottom: PokeImage }> = {
  flow: {
    top: {
      src: "/ingredients/renders/RhodiolaRoseaTransparent.png",
      alt: "Rhodiola rosea, an adaptogen in the CONKA formula",
    },
    bottom: {
      src: "/ingredients/renders/TurmericTransparent.png",
      alt: "Turmeric root, an anti-inflammatory in the CONKA formula",
    },
  },
  clear: {
    top: {
      src: "/ingredients/renders/LecithinTransparent.png",
      alt: "Sunflower, a source of lecithin in the CONKA formula",
    },
    bottom: {
      src: "/ingredients/renders/VitaminCTransparent.png",
      alt: "Lemon, a source of vitamin C in the CONKA formula",
    },
  },
};

export default function ProductBenefitTiles({
  items = DEFAULT_ITEMS,
  formula = "flow",
  topImage,
  bottomImage,
}: ProductBenefitTilesProps) {
  const renders = FORMULA_RENDERS[formula];
  const top = topImage ?? renders.top;
  const bottom = bottomImage ?? renders.bottom;

  return (
    <div className="relative mx-auto max-w-[1180px]">
      {/* Top poke — pokes above the tile, hidden behind it where they overlap.
          Decorative, so it lazy-loads (next/image default) and `sizes` keeps
          mobile from fetching the desktop-width render. */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 w-[320px] -translate-x-1/2 -translate-y-[52%] md:w-[500px]">
        <Image
          src={top.src}
          alt={top.alt}
          width={640}
          height={640}
          sizes="(min-width: 768px) 500px, 320px"
          className="h-auto w-full"
        />
      </div>

      {/* Textured tile */}
      <div
        className="relative z-10 overflow-hidden rounded-2xl bg-[#F3F4F5] bg-cover bg-center px-6 py-16 shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] md:px-14 md:py-16"
        style={{ backgroundImage: "url('/paperTextureTile.jpg')" }}
      >
        {/* Mobile: portrait, stacked and centred (MM mobile). Desktop: 3 columns,
            left-aligned. */}
        <ul className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3 sm:gap-8 sm:text-left">
          {items.map((item) => (
            <li key={item.title}>
              <h3 className="text-4xl font-bold leading-[1.05] tracking-[-0.01em] text-black sm:text-3xl md:text-[2.5rem]">
                {item.title}
              </h3>
              <p className="mx-auto mt-4 max-w-[34ch] text-base leading-relaxed text-black sm:mx-0">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom poke */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[320px] -translate-x-1/2 translate-y-[52%] md:w-[520px]">
        <Image
          src={bottom.src}
          alt={bottom.alt}
          width={640}
          height={640}
          sizes="(min-width: 768px) 520px, 320px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
