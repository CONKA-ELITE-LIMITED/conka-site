import type { TileChecklistItem } from "@/app/lib/productHeroHelpers";
import GreenCheckSquare from "@/app/components/GreenCheckSquare";

/* Checklist inside the selected cadence tile. Shipment lines get the box
   emoji; reassurance lines get the same green square tick as the landing
   page GuaranteeRow, so trust marks read identically across the site.
   Shared by ProductHero (desktop) and ProductHeroMobile. */
export default function TileChecklist({ items }: { items: TileChecklistItem[] }) {
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.text} className="flex items-start gap-2 text-sm text-black/70">
          {item.kind === "shipment" ? (
            <span
              className="shrink-0 w-[14px] text-[12px] leading-5 text-center"
              aria-hidden="true"
            >
              📦
            </span>
          ) : (
            <GreenCheckSquare size={14} className="shrink-0 mt-[3px]" />
          )}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
