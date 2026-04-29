"use client";

import { useState } from "react";
import Image from "next/image";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import ConkaCTAButton from "../landing/ConkaCTAButton";
import FigurePlate from "@/app/components/FigurePlate";

const FAQ_ASSETS: Record<FormulaId, { src: string; alt: string }> = {
  "01": { src: "/lifestyle/flow/FlowDrink.jpg", alt: "Drinking CONKA Flow" },
  "02": { src: "/lifestyle/clear/ClearDrink.jpg", alt: "Drinking CONKA Clear" },
};

const FAQ_PLATE_SUBJECT: Record<FormulaId, string> = {
  "01": "Calm Focus",
  "02": "Unmatched Clarity",
};

const UPDATED_LABEL = "2026-04";

interface FormulaFAQProps {
  formulaId: FormulaId;
  hideCTA?: boolean;
  figN?: number;
}

export default function FormulaFAQ({ formulaId, hideCTA = false, figN = 3 }: FormulaFAQProps) {
  const formula = formulaContent[formulaId];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = formula.faq;
  const asset = FAQ_ASSETS[formulaId];

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        {/* Lifestyle image */}
        <div className="lg:w-2/5 lg:sticky lg:top-8 mb-8 lg:mb-0">
          <div className="-mx-5 w-[calc(100%+2.5rem)] lg:mx-0 lg:w-full max-w-none">
            <FigurePlate n={figN} subject="FAQ" meta={FAQ_PLATE_SUBJECT[formulaId]}>
              <Image
                src={asset.src}
                alt={asset.alt}
                width={1500}
                height={1000}
                loading="lazy"
                className="w-full h-auto"
              />
            </FigurePlate>
          </div>
        </div>

        {/* Content column */}
        <div className="lg:w-3/5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Common questions · FAQ-01"}
          </p>
          <div className="mb-6">
            <h2 className="brand-h1 mb-0">Frequently asked questions</h2>
          </div>

          {/* Spec header row */}
          <div className="lab-asset-frame bg-white grid grid-cols-3 mb-6">
            <div className="px-3 py-3 lg:px-4 lg:py-4 border-r border-black/8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-1 leading-none">
                Section
              </p>
              <p className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                Q&amp;A
              </p>
            </div>
            <div className="px-3 py-3 lg:px-4 lg:py-4 border-r border-black/8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-1 leading-none">
                Entries
              </p>
              <p className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                N={faqs.length}
              </p>
            </div>
            <div className="px-3 py-3 lg:px-4 lg:py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-1 leading-none">
                Updated
              </p>
              <p className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                {UPDATED_LABEL}
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="overflow-hidden bg-white border border-black/8">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              const isLast = i === faqs.length - 1;
              const number = String(i + 1).padStart(2, "0");

              return (
                <div key={item.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`formula-faq-${formulaId}-${i}`}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 min-h-[44px] text-left"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="font-mono text-[11px] font-bold tabular-nums text-black/35 leading-6 shrink-0">
                        {number}.
                      </span>
                      <span
                        className={`block text-base text-black leading-snug ${
                          isOpen ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {item.question}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-sm font-bold tabular-nums shrink-0 leading-6 ${
                        isOpen ? "text-black" : "text-black/40"
                      }`}
                      aria-hidden
                    >
                      {isOpen ? "[\u2212]" : "[+]"}
                    </span>
                  </button>

                  <div
                    id={`formula-faq-${formulaId}-${i}`}
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{
                      maxHeight: isOpen ? "500px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="px-5 pb-5">
                      <div className="border-l-2 border-black pl-4 py-1">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 mb-2 leading-none">
                          Response
                        </p>
                        <p className="text-sm leading-relaxed text-black/70">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isLast && <div className="mx-5 h-px bg-black/8" />}
                </div>
              );
            })}
          </div>

          {/* Support footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/8 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">
              Still stuck?{" "}
              <a
                href="mailto:info@conka.io"
                className="text-black underline decoration-black/20 hover:decoration-black"
              >
                info@conka.io
              </a>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40 tabular-nums">
              Avg response 4h
            </p>
          </div>

          {!hideCTA && (
            <div className="mt-8 flex justify-start">
              <ConkaCTAButton href="#hero" meta={`// order ${formula.name.toLowerCase()}`}>
                Order {formula.name}
              </ConkaCTAButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
