import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

/* 100-day guarantee row — square check + darker green so the mark reads
   clinical/sharp rather than the rounded consumer green used on /start.
   Alignment is owned by the parent (the row does not centre itself). */
export default function GuaranteeRow() {
  return (
    <div className="flex items-center gap-2 mt-3">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" fill="#047857" />
        <path
          d="M8 12.5L10.5 15L16 9.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <span className="text-[13px] text-black">{GUARANTEE_LABEL_FULL}</span>
    </div>
  );
}
