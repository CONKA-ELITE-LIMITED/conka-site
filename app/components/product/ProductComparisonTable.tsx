import Image from "next/image";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

/* ============================================================================
 * ProductComparisonTable (SCRUM-1261)
 *
 * Positions CONKA against the two things a shopper is actually choosing
 * between: what they drink now, and what they might be prescribed. The third
 * column does the work the other two cannot, because it speaks to the
 * stimulant-adjacent buyer without making a claim about CONKA.
 *
 * Two rows carry the differentiators a competitor cannot copy (the app, and
 * glass), so both land inside a comparison rather than as bare assertions.
 *
 * Content only: the page owns the <section>, background and track.
 * ========================================================================== */

export type ComparisonProduct = "flow" | "clear" | "both";

/** Cut-out renders, so the bottle sits on the navy column with no photo edge. */
const PRODUCT_SHOTS: Record<
  ComparisonProduct,
  { src: string; alt: string }[]
> = {
  flow: [
    { src: "/formulas/conkaFlow/FlowNoBackground.png", alt: "CONKA Flow bottle" },
  ],
  clear: [
    {
      src: "/formulas/conkaClear/ClearNoBackground.png",
      alt: "CONKA Clear bottle",
    },
  ],
  both: [
    { src: "/formulas/conkaFlow/FlowNoBackground.png", alt: "CONKA Flow bottle" },
    {
      src: "/formulas/conkaClear/ClearNoBackground.png",
      alt: "CONKA Clear bottle",
    },
  ],
};

type Cell = boolean | string | null;

interface Row {
  label: string;
  /** true = tick, false = cross, string = literal text, null = not applicable */
  conka: Cell;
  coffee: Cell;
  rx: Cell;
}

const ROWS: Row[] = [
  {
    label: "Energy duration",
    conka: "4 to 8 hrs, calm",
    coffee: "1 to 3 hrs, jittery",
    rx: "Cannot sleep",
  },
  {
    label: "Better focus",
    conka: "Yes",
    coffee: "At a cost",
    rx: "At a cost",
  },
  { label: "No crash", conka: true, coffee: false, rx: false },
  { label: "No jitters", conka: true, coffee: false, rx: false },
  {
    // Rx stimulants genuinely contain no caffeine, so this row is a tick for
    // them too. Marking it a cross would be the one false claim in the table,
    // and a comparison that lets a rival win a row reads as more honest.
    label: "No caffeine",
    conka: true,
    coffee: false,
    rx: true,
  },
  { label: "Clinically dosed nootropics", conka: true, coffee: false, rx: false },
  { label: "Adaptogens", conka: true, coffee: false, rx: false },
  { label: "Informed Sport certified", conka: true, coffee: false, rx: false },
  { label: "Tracks whether it works", conka: true, coffee: false, rx: false },
  { label: "Glass, not plastic", conka: true, coffee: false, rx: null },
  {
    label: `${GUARANTEE_DAYS}-day money-back guarantee`,
    conka: true,
    coffee: false,
    rx: false,
  },
];

const RIVALS = [
  { key: "coffee" as const, heading: "Coffee &\nEnergy Drinks" },
  { key: "rx" as const, heading: "Rx\nStimulants" },
];

/** Sized in CSS, not with width/height attributes, so the marks shrink with the
 *  row on a phone instead of setting the row height. */
const MARK = "h-[18px] w-[18px] shrink-0 sm:h-[22px] sm:w-[22px]";

/** On navy the disc is white and the check navy: the inverse of the light mark. */
function Tick({ onNavy }: { onNavy?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={MARK}>
      <rect
        width="24"
        height="24"
        rx="12"
        fill={onNavy ? "#fff" : "var(--brand-navy)"}
      />
      <path
        d="M7.5 12.4L10.7 15.6L16.6 9"
        stroke={onNavy ? "var(--brand-navy)" : "#fff"}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={MARK}>
      <path
        d="M17.3 6.7L6.7 17.3M17.3 17.3L6.7 6.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The mark or literal value, plus the text a screen reader hears in its place. */
function CellContent({ value, onNavy }: { value: Cell; onNavy?: boolean }) {
  if (typeof value === "string") {
    return <span className="text-[12px] leading-snug sm:text-sm">{value}</span>;
  }
  if (value === null) {
    return (
      <>
        <span aria-hidden className="opacity-40">
          &ndash;
        </span>
        <span className="sr-only">Not applicable</span>
      </>
    );
  }
  return (
    <>
      <span className="inline-flex justify-center">
        {value ? <Tick onNavy={onNavy} /> : <Cross />}
      </span>
      <span className="sr-only">{value ? "Yes" : "No"}</span>
    </>
  );
}

export default function ProductComparisonTable({
  product = "flow",
}: {
  product?: ComparisonProduct;
}) {
  const shots = PRODUCT_SHOTS[product];

  return (
    <div>
      <h2 className="brand-h1 mb-8 text-center text-black lg:mb-10">
        Smarter Than Your Average Boost
      </h2>

      {/* Held narrower than the track and centred, so the columns read as one
          block rather than drifting apart on a wide screen. The overflow
          container catches phones below roughly 360px rather than letting the
          page body scroll sideways. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <table className="mx-auto w-full min-w-[340px] max-w-3xl border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            CONKA compared with coffee and energy drinks, and with prescription
            stimulants
          </caption>

          <thead>
            <tr>
              <th scope="col" className="w-[34%]">
                <span className="sr-only">Feature</span>
              </th>

              {/* CONKA: inverted navy panel carrying the product and the mark */}
              <th
                scope="col"
                className="w-[22%] rounded-t-md bg-[color:var(--brand-navy)] px-1 pb-3 pt-3 text-center align-bottom sm:px-3 sm:pb-4 sm:pt-4"
              >
                <span className="flex items-end justify-center gap-1">
                  {shots.map((shot) => (
                    <Image
                      key={shot.src}
                      src={shot.src}
                      alt={shot.alt}
                      width={200}
                      height={200}
                      loading="lazy"
                      sizes="(max-width: 640px) 60px, 88px"
                      className={`h-auto w-auto object-contain ${
                        shots.length > 1
                          ? "max-h-[44px] sm:max-h-[72px]"
                          : "max-h-[56px] sm:max-h-[88px]"
                      }`}
                    />
                  ))}
                </span>
                <Image
                  src="/conka-logo.webp"
                  alt="CONKA"
                  width={440}
                  height={112}
                  loading="lazy"
                  className="mx-auto mt-2.5 h-3 w-auto brightness-0 invert sm:h-4"
                />
              </th>

              {RIVALS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="w-[22%] whitespace-pre-line px-1 pb-3 text-center align-bottom text-[11px] font-bold leading-tight text-black sm:px-3 sm:pb-4 sm:text-sm"
                >
                  {col.heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row, i) => {
              const isLast = i === ROWS.length - 1;
              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="border-t border-black/15 py-2.5 pr-2 text-[12px] font-semibold leading-snug text-black sm:py-3.5 sm:pr-4 sm:text-base"
                  >
                    {row.label}
                  </th>

                  {/* No row rule inside the navy panel: it reads as one solid
                      column, the way the reference does. */}
                  <td
                    className={`bg-[color:var(--brand-navy)] px-1 py-2.5 text-center align-middle font-semibold text-white sm:px-3 sm:py-3.5 ${
                      isLast ? "rounded-b-md pb-4 sm:pb-5" : ""
                    }`}
                  >
                    <CellContent value={row.conka} onNavy />
                  </td>

                  {RIVALS.map((col) => (
                    <td
                      key={col.key}
                      className="border-t border-black/15 px-1 py-2.5 text-center align-middle text-black sm:px-3 sm:py-3.5"
                    >
                      <CellContent value={row[col.key]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
