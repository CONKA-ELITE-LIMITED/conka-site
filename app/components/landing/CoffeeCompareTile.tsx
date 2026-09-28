import { Tick, Cross } from "@/app/components/product/ProductComparisonTable";

/* ============================================================================
 * CoffeeCompareTile
 *
 * The condensed ProductComparisonTable for a listicle reason tile: CONKA
 * against the one thing the reader already buys every day, with cost as the
 * first row. Same tick/cross marks and navy-tinted CONKA column as the full
 * table, so the two read as one system when both appear on a page.
 *
 * Prices are passed in (bare numbers, e.g. "1.83"): CONKA's comes from
 * offerData via the renderer, coffee's from landingPricing. Never typed here.
 *
 * Fills its parent: the listicle frame is a flex column, this is `flex-1`.
 * ========================================================================== */

type Cell = boolean | string;

const PANEL = "bg-[#eef0f5] text-[color:var(--brand-navy)]";

export default function CoffeeCompareTile({
  conkaPerDay,
  coffeePerDay,
}: {
  conkaPerDay: string;
  coffeePerDay: string;
}) {
  const rows: { label: string; conka: Cell; coffee: Cell }[] = [
    {
      label: "Cost per day",
      conka: `£${conkaPerDay}`,
      coffee: `£${coffeePerDay}`,
    },
    { label: "Focus lasts", conka: "4 to 8 hrs", coffee: "1 to 3 hrs" },
    { label: "No crash", conka: true, coffee: false },
    { label: "No jitters", conka: true, coffee: false },
    { label: "Won't keep you up", conka: true, coffee: false },
    { label: "Clinically dosed nootropics", conka: true, coffee: false },
  ];

  return (
    <div className="flex flex-1 flex-col text-black">
      <div className="rounded-t-lg bg-[#eef1f8] px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]">
          The daily habit, compared
        </p>
        <p className="mt-1 text-lg font-bold leading-snug">
          CONKA vs your daily coffee
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 py-4">
        <table className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">CONKA compared with coffee</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[46%]">
                <span className="sr-only">Feature</span>
              </th>
              <th
                scope="col"
                className={`w-[27%] rounded-t-md px-1 pb-2 pt-3 text-center text-[13px] font-bold ${PANEL}`}
              >
                CONKA
              </th>
              <th
                scope="col"
                className="w-[27%] px-1 pb-2 pt-3 text-center text-[13px] font-bold"
              >
                Coffee
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="border-t border-black/10 py-2.5 pr-2 text-[13px] font-semibold leading-snug"
                >
                  {row.label}
                </th>
                <td
                  className={`px-1 py-2.5 text-center align-middle text-[13px] font-bold ${PANEL} ${
                    i === rows.length - 1 ? "rounded-b-md" : ""
                  }`}
                >
                  <Mark value={row.conka} />
                </td>
                <td className="border-t border-black/10 px-1 py-2.5 text-center align-middle text-[13px] font-medium">
                  <Mark value={row.coffee} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Mark({ value }: { value: Cell }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <>
      <span className="inline-flex justify-center">
        {value ? <Tick /> : <Cross />}
      </span>
      <span className="sr-only">{value ? "Yes" : "No"}</span>
    </>
  );
}
