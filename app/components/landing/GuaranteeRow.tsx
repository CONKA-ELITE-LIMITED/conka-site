import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import GreenCheckSquare from "@/app/components/GreenCheckSquare";

/* 100-day guarantee row — square check + darker green so the mark reads
   clinical/sharp rather than the rounded consumer green used on /start.
   Alignment is owned by the parent (the row does not centre itself). */
export default function GuaranteeRow() {
  return (
    <div className="flex items-center gap-2 mt-3">
      <GreenCheckSquare />
      <span className="text-[13px] text-black">{GUARANTEE_LABEL_FULL}</span>
    </div>
  );
}
