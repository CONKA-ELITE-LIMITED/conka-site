"use client";

import { useState } from "react";
import Image from "next/image";
import { GUARANTEE_LABEL_FULL, GUARANTEE_COPY_TRIAL } from "@/app/lib/offerConstants";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "../landing/ConkaCTAButton";

type FaqCategory = "TRIAL" | "PRODUCT" | "SHIPPING" | "SUBSCRIPTION";

interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What if my score doesn’t improve?",
    answer: `We offer a ${GUARANTEE_LABEL_FULL}. ${GUARANTEE_COPY_TRIAL}, and if you're not satisfied, contact us for a full refund. No returns needed. We're confident enough in the product to take the risk for you.`,
    category: "TRIAL",
  },
  {
    question: "What’s the difference between Flow and Clear?",
    answer:
      "CONKA Flow (black cap) is your morning foundation. It uses adaptogens like Ashwagandha and Lemon Balm for calm focus without caffeine. CONKA Clear (white cap) is your afternoon recovery shot. It combines nootropics like Alpha GPC and Glutathione with Vitamin C, which contributes to normal psychological function.†† One of each, every day.",
    category: "PRODUCT",
  },
  {
    question: "Can I take just one shot?",
    answer:
      "Yes. You can subscribe to Flow or Clear individually. However, the two formulas are designed to work as a daily pair. Flow supports your daytime focus and energy, Clear supports your afternoon recovery. Together they cover the full 24-hour cycle, and the combined subscription is better value per shot.",
    category: "PRODUCT",
  },
  {
    question: "How quickly will it arrive?",
    answer:
      "Orders placed before 2pm ship same day. Most UK customers receive their order within 1 to 2 working days. Subscriptions ship free. You’ll receive tracking information by email as soon as your order dispatches.",
    category: "SHIPPING",
  },
  {
    question: "How do I cancel?",
    answer: `Cancel, pause, or modify anytime from your account. No contracts, no commitments, no questions asked. We also offer a ${GUARANTEE_LABEL_FULL}, so if you're not satisfied, you get a full refund.`,
    category: "SUBSCRIPTION",
  },
];

export default function CROFAQ({ hideCTA = false }: { hideCTA?: boolean } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        <div className="lg:w-2/5 lg:sticky lg:top-8 mb-8 lg:mb-0">
          <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] lg:mx-0 lg:w-full max-w-none">
            <Image
              src="/lifestyle/flow/FlowDeskClutter.jpg"
              alt="CONKA Flow bottle on a desk next to a keyboard, pen, notebook and sticky note"
              width={1500}
              height={1000}
              loading="lazy"
              className="w-full h-auto"
            />
            <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              Fig. 04 · Field Use
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              CONKA Flow · Workspace
            </span>
          </div>
        </div>

        <div className="lg:w-3/5">
          <p className="brand-eyebrow mb-3">
            {"// Common questions · FAQ-01"}
          </p>
          <div className="mb-6">
            <h2 className="brand-h1 mb-0">Frequently asked questions</h2>
          </div>

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
                N={FAQ_ITEMS.length}
              </p>
            </div>
            <div className="px-3 py-3 lg:px-4 lg:py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-1 leading-none">
                Updated
              </p>
              <p className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                2026-04
              </p>
            </div>
          </div>

          <div className="overflow-hidden bg-white border border-black/8">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              const isLast = i === FAQ_ITEMS.length - 1;
              const number = String(i + 1).padStart(2, "0");

              return (
                <div key={item.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 min-h-[44px] text-left"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="font-mono text-[11px] font-bold tabular-nums text-black/35 leading-6 shrink-0">
                        {number}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 block mb-1 leading-none">
                          {item.category}
                        </span>
                        <span className={`block text-base text-black leading-snug ${isOpen ? "font-semibold" : "font-medium"}`}>
                          {item.question}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-sm font-bold tabular-nums shrink-0 leading-6 ${isOpen ? "text-black" : "text-black/40"}`}
                      aria-hidden
                    >
                      {isOpen ? "[−]" : "[+]"}
                    </span>
                  </button>

                  <div
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
            <div className="mt-8 flex justify-center lg:justify-start">
              <ConkaCTAButton meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
