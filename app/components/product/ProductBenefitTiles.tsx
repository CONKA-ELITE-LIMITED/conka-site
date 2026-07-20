import Image from "next/image";

/*
 * ProductBenefitTiles — Magic Mind-style benefits band.
 *
 * A textured cream "paper" tile with three bold benefit columns, and a
 * transparent ingredient render poking out above and below the tile.
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

interface ProductBenefitTilesProps {
  items?: BenefitItem[];
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

const DEFAULT_TOP: PokeImage = {
  src: "/ingredients/renders/RhodiolaRoseaTransparent.png",
  alt: "Rhodiola rosea, an adaptogen in the CONKA formula",
};

const DEFAULT_BOTTOM: PokeImage = {
  src: "/ingredients/renders/TurmericTransparent.png",
  alt: "Turmeric root, an anti-inflammatory in the CONKA formula",
};

export default function ProductBenefitTiles({
  items = DEFAULT_ITEMS,
  topImage = DEFAULT_TOP,
  bottomImage = DEFAULT_BOTTOM,
}: ProductBenefitTilesProps) {
  return (
    <div className="relative mx-auto max-w-[1180px]">
      {/* Top poke — pokes above the tile, hidden behind it where they overlap */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 w-[320px] -translate-x-1/2 -translate-y-[52%] md:w-[500px]">
        <Image
          src={topImage.src}
          alt={topImage.alt}
          width={640}
          height={640}
          className="h-auto w-full"
        />
      </div>

      {/* Textured tile */}
      <div
        className="relative z-10 overflow-hidden rounded-2xl bg-[#F3F4F5] bg-cover bg-center px-6 py-12 shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] md:px-14 md:py-16"
        style={{ backgroundImage: "url('/paperTextureTile.jpg')" }}
      >
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {items.map((item) => (
            <li key={item.title}>
              <h3 className="text-3xl font-bold leading-[1.05] tracking-[-0.01em] text-black md:text-[2.5rem]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-black">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom poke */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[320px] -translate-x-1/2 translate-y-[52%] md:w-[520px]">
        <Image
          src={bottomImage.src}
          alt={bottomImage.alt}
          width={640}
          height={640}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
