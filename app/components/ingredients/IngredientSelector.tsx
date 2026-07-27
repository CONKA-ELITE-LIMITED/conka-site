"use client";

import Image from "next/image";
import { IngredientData } from "@/app/lib/ingredientsData";

interface IngredientSelectorProps {
  ingredients: IngredientData[];
  activeIngredientId: string;
  onSelect: (id: string) => void;
}

export default function IngredientSelector({
  ingredients,
  activeIngredientId,
  onSelect,
}: IngredientSelectorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
      {ingredients.map((ingredient, idx) => {
        const isActive = ingredient.id === activeIngredientId;

        return (
          <button
            key={ingredient.id}
            type="button"
            onClick={() => onSelect(ingredient.id)}
            aria-pressed={isActive}
            className={`text-left bg-white rounded-md overflow-hidden transition-colors ${
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
                  sizes="110px"
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
                  className={`text-[8px] font-medium uppercase tracking-[0.12em] tabular-nums truncate ${
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
  );
}
