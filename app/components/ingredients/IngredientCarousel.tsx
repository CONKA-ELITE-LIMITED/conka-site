"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { IngredientData } from "@/app/lib/ingredientsData";

interface IngredientCarouselProps {
  ingredients: IngredientData[];
  activeIngredientId: string;
  onSelect: (id: string) => void;
}

export default function IngredientCarousel({
  ingredients,
  activeIngredientId,
  onSelect,
}: IngredientCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const activeElement = itemRefs.current.get(activeIngredientId);
    if (activeElement && scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIngredientId]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-1 -mx-4 snap-x snap-mandatory scroll-smooth"
      >
        {ingredients.map((ingredient, idx) => {
          const isActive = ingredient.id === activeIngredientId;

          return (
            <button
              key={ingredient.id}
              ref={(el) => {
                if (el) itemRefs.current.set(ingredient.id, el);
              }}
              type="button"
              onClick={() => onSelect(ingredient.id)}
              aria-pressed={isActive}
              className={`flex-shrink-0 w-[108px] snap-start text-left bg-white rounded-md overflow-hidden transition-colors ${
                isActive
                  ? "border-2 border-[#1B2757]"
                  : "border border-black/12 hover:border-black/40"
              }`}
            >
              <div className="relative aspect-square border-b border-black/8 bg-white overflow-hidden">
                {ingredient.image ? (
                  <Image
                    src={ingredient.image}
                    alt={ingredient.name}
                    fill
                    sizes="108px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/[0.03]">
                    <span className="text-[8px] uppercase tracking-[0.12em] text-black/40 text-center px-1">
                      {ingredient.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-bold tabular-nums text-black/35">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <span
                    className={`text-[8px] font-medium uppercase tracking-[0.12em] tabular-nums ${
                      isActive ? "text-[#1B2757]" : "text-black/40"
                    }`}
                  >
                    {ingredient.functionalCategory}
                  </span>
                </div>
                <p
                  className={`text-[11px] font-semibold leading-tight truncate ${
                    isActive ? "text-[#1B2757]" : "text-black"
                  }`}
                >
                  {ingredient.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-black/40 tabular-nums text-center mt-3">
        Swipe to explore · {String(ingredients.length).padStart(2, "0")} Inputs
      </p>
    </div>
  );
}
