import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import GreenCheckSquare from "@/app/components/GreenCheckSquare";

/**
 * Trust rows under the CTA — same register as the landing page GuaranteeRow
 * (simple mark + plain sentence) instead of the old 4-cell mono grid.
 * Carries what is true regardless of the cadence selected: the guarantee,
 * shipping, and certification. Cadence-specific terms (cancel anytime,
 * savings) live in the tile checklist.
 */
export default function FunnelAssurance() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <GreenCheckSquare className="shrink-0" />
        <span className="text-[13px] text-black">{GUARANTEE_LABEL_FULL}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="shrink-0 w-[18px] text-[15px] leading-none text-center"
          aria-hidden="true"
        >
          📦
        </span>
        <span className="text-[13px] text-black">
          Free UK shipping on subscriptions
        </span>
      </div>
      <div className="flex items-center gap-2">
        <GreenCheckSquare className="shrink-0" />
        <span className="text-[13px] text-black">
          Informed Sport certified · batch tested in UK labs
        </span>
      </div>
    </div>
  );
}
