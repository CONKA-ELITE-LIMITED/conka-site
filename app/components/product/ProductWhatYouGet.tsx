import Image from "next/image";
import { FormulaId } from "@/app/lib/productData";
import FigurePlate from "@/app/components/FigurePlate";

interface ProductWhatYouGetProps {
  formulaId: FormulaId;
}

const BOX_IMAGES: Record<FormulaId, string> = {
  "01": "/lifestyle/flow/FlowBoxOpen.jpg",
  "02": "/lifestyle/clear/ClearBoxOpen.jpg",
};

const IN_THE_BOX: Record<FormulaId, string[]> = {
  "01": ["28 shots · 30ml each", "Informed Sport certified", "Recyclable packaging"],
  "02": ["28 shots · 30ml each", "Informed Sport certified", "Recyclable packaging"],
};

const DELIVERY_OPTIONS = [
  { label: "Monthly", detail: "1 box every month", saving: "Save 15%" },
  { label: "Quarterly", detail: "3 boxes every 3 months", saving: "Save 20%" },
  { label: "One-off", detail: "1 box, no commitment", saving: null },
];

export default function ProductWhatYouGet({ formulaId }: ProductWhatYouGetProps) {
  const imageSrc = BOX_IMAGES[formulaId];
  const boxContents = IN_THE_BOX[formulaId];

  return (
    <div>
      {/* Trio header */}
      <div className="mb-8 lg:mb-10">
        <p className="brand-eyebrow text-black/40 mb-3">
          {`// What you get · CONKA-0${formulaId}`}
        </p>
        <h2 className="brand-h2 text-black mb-2" style={{ letterSpacing: "-0.02em" }}>
          From the lab to your door.
        </h2>
        <p className="brand-mono-sub text-black/50">
          28 shots · Delivered to your door · Cancel anytime
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Lifestyle image with FigurePlate */}
        <div className="w-full lg:w-[45%] flex-shrink-0">
          <FigurePlate n={1} subject="First order" meta="28 shots · 30ml">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={imageSrc}
                alt="CONKA box open showing 28 shots"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </FigurePlate>
        </div>

        {/* Content card */}
        <div className="flex-1 bg-white border border-black/12 p-5 lg:p-6 flex flex-col gap-7">

          {/* In every box */}
          <div>
            <p className="brand-eyebrow text-black/40 mb-4">In every box</p>
            <ul className="flex flex-col gap-3">
              {boxContents.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-mono text-black/30 flex-shrink-0 leading-5">—</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/75 leading-5">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-black/8" />

          {/* Delivery options — link to hero cadence widget */}
          <div>
            <p className="brand-eyebrow text-black/40 mb-4">How it ships</p>
            <div className="flex flex-col">
              {DELIVERY_OPTIONS.map((opt, idx) => (
                <a
                  key={opt.label}
                  href="#hero"
                  className={`flex items-center justify-between py-3 group hover:bg-black/[0.02] -mx-2 px-2 transition-colors ${
                    idx < DELIVERY_OPTIONS.length - 1 ? "border-b border-black/8" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-black">
                      {opt.label}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-black/45">
                      {opt.detail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {opt.saving && (
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] bg-[#1B2757] text-white px-2 py-1 tabular-nums">
                        {opt.saving}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-black/25 group-hover:text-black/50 transition-colors">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
