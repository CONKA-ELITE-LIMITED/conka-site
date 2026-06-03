"use client";

import { useState } from "react";
import Image from "next/image";
import { GUARANTEE_LABEL_FULL, GUARANTEE_COPY_TRIAL } from "@/app/lib/offerConstants";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What makes CONKA different?",
    answer:
      "Most nootropics are capsules with underdosed ingredients. CONKA is a liquid shot: clinical doses in 30ml, absorbed fast. It's a complete system, Flow for your morning, Clear for your afternoon. The formula is patented (GB2620279). Every batch is Informed Sport tested. And you don't have to take our word for any of it: the CONKA app tracks your cognitive scores, so you can measure the difference yourself.",
  },
  {
    question: "Is CONKA safe to take every day?",
    answer:
      "Yes. CONKA is built for daily use. Every batch is Informed Sport certified and tested for 280+ banned substances, the same standard professional athletes are held to. Flow is caffeine-free, so it works alongside your morning coffee. If you're pregnant, breastfeeding, or on medication, check with your doctor first.",
  },
  {
    question: "How do I take CONKA?",
    answer:
      "Two shots, ten seconds each. Flow in the morning to set up your focus for the day. Clear in the afternoon, right when most people hit the dip. Straight from the bottle. No powders, no mixing, no timing windows.",
  },
  {
    question: "When will I notice results?",
    answer:
      "Day 1: sharper focus and steady energy, no crash. Day 14: adaptogens like Ashwagandha reach full strength and stress rolls off faster. Day 30: your baseline sits measurably higher. Across 150+ tested users and 5,000+ cognitive tests, the average score improvement was +28.96%.",
  },
  {
    question: "Flow, Clear, or Both?",
    answer:
      "Flow (black cap) is for mornings: adaptogens like Ashwagandha and Lemon Balm for calm, caffeine-free focus. Clear (white cap) is for afternoons: nootropics like Alpha GPC and Glutathione, plus Vitamin C, which contributes to normal psychological function.†† Both is the full system. Morning to evening covered, designed to work as a pair, and the best value per shot.",
  },
  {
    question: "What if it doesn't work for me?",
    answer: `Then you get your money back. ${GUARANTEE_COPY_TRIAL}, and if you're not satisfied, contact us for a full refund. No returns needed, no questions asked. That's the ${GUARANTEE_LABEL_FULL}: we're confident enough in the product to take the risk for you.`,
  },
  {
    question: "When will I receive my order?",
    answer:
      "Fast. Order before 2pm and it ships the same day. Most UK customers have theirs within 1 to 2 working days, and subscriptions ship free. You'll get tracking by email the moment it dispatches. Subscribers can pause, change, or cancel anytime from their account. No contracts.",
  },
];

export default function LabFAQ({ hideCTA = false, ctaHref = "/funnel" }: { hideCTA?: boolean; ctaHref?: string } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        {/* Lifestyle image */}
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

        {/* Content column */}
        <div className="lg:w-3/5">
          <div className="mb-8">
            <h2 className="brand-h1 mb-0">Frequently asked questions</h2>
          </div>

          <div>
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              const panelId = `lab-faq-panel-${i}`;

              return (
                <div key={item.question} className="border-b border-black/10 first:border-t">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 py-5 min-h-[44px] text-left"
                  >
                    <span className={`block text-base text-black leading-snug ${isOpen ? "font-semibold" : "font-medium"}`}>
                      {item.question}
                    </span>
                    <span
                      className={`text-xl font-light shrink-0 leading-none transition-[transform,color] duration-300 ${isOpen ? "rotate-45 text-black" : "text-black/40"}`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>

                  <div
                    id={panelId}
                    className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                    style={{
                      // Max-height must comfortably exceed the tallest answer at mobile width
                      // (longest answer ≈ 12 lines at 390px). Bump if answers get longer.
                      maxHeight: isOpen ? "600px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="pb-6 pr-8">
                      <p className="text-sm leading-relaxed text-black/70">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support footer */}
          <div className="mt-6">
            <p className="text-sm text-black/60">
              Still have a question?{" "}
              <a
                href="mailto:info@conka.io"
                className="text-black underline decoration-black/20 hover:decoration-black"
              >
                info@conka.io
              </a>
            </p>
          </div>

          {!hideCTA && (
            <div className="mt-8 flex justify-center lg:justify-start">
              <ConkaCTAButton href={ctaHref} meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
