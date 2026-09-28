import Image from "next/image";
import {
  Tick,
  Cross,
  type ComparisonProduct,
} from "@/app/components/product/ProductComparisonTable";
import { CoffeeIcon } from "@/app/components/landing/CrashChart";
import { bottleRendersCutout } from "@/app/lib/productImages";

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
  product = "flow",
}: {
  conkaPerDay: string;
  coffeePerDay: string;
  /** Which bottle heads the CONKA column; match the priced product */
  product?: ComparisonProduct;
}) {
  const shot = bottleRendersCutout[product];
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
              {/* Product in the CONKA column, as on the full table and the PDP
                  slides; a cup on the coffee side so both headers are visual. */}
              <th
                scope="col"
                className={`w-[27%] rounded-t-md px-1 pb-2 pt-3 text-center align-bottom text-[13px] font-bold ${PANEL}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={400}
                  height={520}
                  loading="lazy"
                  sizes="64px"
                  className="mx-auto mb-1.5 h-auto max-h-[64px] w-auto object-contain"
                />
                CONKA
              </th>
              <th
                scope="col"
                className="w-[27%] px-1 pb-2 pt-3 text-center align-bottom text-[13px] font-bold"
              >
                <span className="mx-auto mb-1.5 flex h-[64px] items-end justify-center [&>svg]:h-11 [&>svg]:w-11">
                  <CoffeeIcon />
                </span>
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
