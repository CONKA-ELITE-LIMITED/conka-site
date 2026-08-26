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

const NAVY = "var(--brand-navy)";

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
  { label: "No crash", conka: true, coffee: false, rx: false },
  { label: "No jitters", conka: true, coffee: false, rx: false },
  {
    // Not "zero caffeine": prescription stimulants contain none either, so that
    // row would have handed the third column a tick. This is the true claim.
    label: "No caffeine or amphetamines",
    conka: true,
    coffee: false,
    rx: false,
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

const COLUMNS = [
  { key: "conka" as const, heading: "CONKA", isUs: true },
  { key: "coffee" as const, heading: "Coffee & energy drinks", isUs: false },
  { key: "rx" as const, heading: "Rx stimulants", isUs: false },
];

function Tick() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <rect width="24" height="24" rx="12" fill={NAVY} />
      <path
        d="M7.5 12.4L10.7 15.6L16.6 9"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M17.3 6.7L6.7 17.3M17.3 17.3L6.7 6.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="text-black/35"
      />
    </svg>
  );
}

/** Renders one cell, and the text a screen reader hears in place of the mark. */
function CellContent({ value }: { value: Cell }) {
  if (typeof value === "string") {
    return <span className="text-[13px] leading-snug sm:text-sm">{value}</span>;
  }
  if (value === null) {
    return (
      <>
        <span aria-hidden className="text-black/25">
          &ndash;
        </span>
        <span className="sr-only">Not applicable</span>
      </>
    );
  }
  return (
    <>
      <span className="inline-flex justify-center">
        {value ? <Tick /> : <Cross />}
      </span>
      <span className="sr-only">{value ? "Yes" : "No"}</span>
    </>
  );
}

export default function ProductComparisonTable() {
  return (
    <div>
      <h2 className="brand-h1 mb-3 text-black">
        Smarter than a stronger coffee
      </h2>
      <p className="brand-body mb-8 max-w-2xl text-black">
        How CONKA compares with what most people reach for when they need to
        think clearly.
      </p>

      {/* Fits at 390px; the overflow container catches narrower phones rather
          than letting the page body scroll sideways. */}
      {/* border-separate, not border-collapse: a collapsed table drops the
          border-radius on the tinted CONKA column's top and bottom cells. Row
          rules therefore live on the cells, since a collapsed <tr> border does
          not paint here either. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <table className="w-full min-w-[340px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            CONKA compared with coffee and energy drinks, and with prescription
            stimulants
          </caption>

          <thead>
            <tr>
              <th scope="col" className="w-[40%]">
                <span className="sr-only">Feature</span>
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`w-[20%] px-1.5 pb-3 text-center align-bottom text-[11px] font-bold leading-tight sm:px-3 sm:text-sm ${
                    col.isUs
                      ? "rounded-t-md bg-[#eef0f5] pt-3 text-[color:var(--brand-navy)]"
                      : "text-black/50"
                  }`}
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
                    className="border-t border-black/10 py-3.5 pr-2 text-[13px] font-semibold leading-snug text-black sm:pr-4 sm:text-base"
                  >
                    {row.label}
                  </th>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`border-t border-black/10 px-1.5 py-3.5 text-center align-middle text-black sm:px-3 ${
                        col.isUs
                          ? `bg-[#eef0f5] font-semibold ${isLast ? "rounded-b-md" : ""}`
                          : "text-black/60"
                      }`}
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
