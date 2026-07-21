import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * AppUSPSection (Simple DTC)
 *
 * "Most brands claim results. We let you measure yours." — the app is the
 * differentiator, so the section states what it is and why it matters plainly:
 * one phone asset on the soft #eef1f8 panel, then a Test / Log / Graph trio in
 * solid black. Static server component (no tabs, no client state); an earlier
 * clinical tabbed explorer was replaced 2026-07 because it hid the point behind
 * a click.
 * ========================================================================== */

const POINTS = [
  {
    label: "The test",
    body: "A two-minute cognitive test, NHS clinically validated. Your baseline in black and white.",
  },
  {
    label: "The daily log",
    body: "Log sleep, stress and training in seconds, so every score has context.",
  },
  {
    label: "The graph",
    body: "One progress graph you own. If it is working, the line says so.",
  },
];

export default function AppUSPSection() {
  return (
    <div className="w-full">
      <h2
        className="brand-h1 mb-4 text-black"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        Most brands claim results. We let you measure yours.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black mb-10 max-w-[60ch]">
        Other brands tell you it works. CONKA gives you a cognitive test and a
        daily log, so you can watch it happen on a graph you own.
      </p>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
        {/* Phone asset on the soft panel */}
        <div className="relative aspect-square rounded-2xl bg-[#eef1f8] ring-1 ring-black/8 overflow-hidden mb-8 lg:mb-0">
          <Image
            src="/app/AppConkaRing.png"
            alt="CONKA app cognitive score ring with daily tracking"
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain p-8"
            loading="lazy"
          />
        </div>

        {/* Test / Log / Graph trio */}
        <div className="flex flex-col">
          {POINTS.map((point) => (
            <div
              key={point.label}
              className="border-t border-black/8 py-5 first:border-t-0 lg:py-6"
            >
              <p className="text-lg font-bold text-black leading-tight">
                {point.label}
              </p>
              <p className="mt-1.5 text-base text-black/60 leading-snug max-w-[44ch]">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 lg:mt-12 flex justify-center lg:justify-start">
        <ConkaCTAButton href="/app" meta={null}>
          See the app
        </ConkaCTAButton>
      </div>
    </div>
  );
}
