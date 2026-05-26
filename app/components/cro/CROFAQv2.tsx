"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GUARANTEE_LABEL_FULL,
  GUARANTEE_COPY_TRIAL,
} from "@/app/lib/offerConstants";

/* ============================================================================
 * CROFAQv2
 *
 * V2 Section 11 on /start. Last section before the legal disclaimer footer.
 * Visual reskin of CROFAQ.tsx with one question swap to remove the overlap
 * with Section 5's buy-box FAQ panels.
 *
 * V1 CROFAQ.tsx is left untouched (it has no other consumers but keeping the
 * fork keeps the V2 pattern consistent and easy to revert).
 *
 * Question changes vs V1:
 *  - DROPPED: "What's the difference between Flow and Clear?" — duplicates
 *    Section 5's "What's in it?" panel.
 *  - ADDED: "Why two formulas instead of one?" — answer lifted from
 *    storyData.ts; reinforces Section 4's AM/PM system.
 *  - REORDERED to broadest-product to narrowest-practical:
 *    1. Why two formulas (product strategy)
 *    2. Can I take just one (product flexibility)
 *    3. How quickly will it arrive (logistics)
 *    4. What if my score doesn't improve (safety net)
 *    5. How do I cancel (commitment-free close)
 *
 * Accordion mechanic mirrors Sections 4 / 5 / 9 (soft bg-black/[0.04]
 * rounded-[16px] pill rows, aria-expanded + aria-controls, max-height
 * transition, single-open behaviour).
 * ========================================================================== */

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "two-formulas",
    question: "Why two formulas instead of one?",
    answer:
      "Armed with data from professional sports teams, a pattern emerged. There were two days each week where cognitive performance dipped, always around periods of high intensity training. The technology revealed what athletes couldn't feel themselves. So we developed two formulas designed to work together, taken daily: Flow in the morning for consistent focus, Clear in the afternoon for consistent clarity.",
  },
  {
    id: "just-one",
    question: "Can I take just one shot?",
    answer:
      "Yes. You can subscribe to Flow or Clear individually. However, the two formulas are designed to work as a daily pair. Flow supports your daytime focus and energy, Clear supports your afternoon recovery. Together they cover the full 24-hour cycle, and the combined subscription is better value per shot.",
  },
  {
    id: "delivery",
    question: "How quickly will it arrive?",
    answer:
      "Orders placed before 2pm ship same day. Most UK customers receive their order within 1 to 2 working days. Subscriptions ship free. You'll receive tracking information by email as soon as your order dispatches.",
  },
  {
    id: "score-improve",
    question: "What if my score doesn't improve?",
    answer: `We offer a ${GUARANTEE_LABEL_FULL}. ${GUARANTEE_COPY_TRIAL}, and if you're not satisfied, contact us for a full refund. No returns needed. We're confident enough in the product to take the risk for you.`,
  },
  {
    id: "cancel",
    question: "How do I cancel?",
    answer: `Cancel, pause, or modify anytime from your account. No contracts, no commitments, no questions asked. We also offer a ${GUARANTEE_LABEL_FULL}, so if you're not satisfied, you get a full refund.`,
  },
];

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;
  return (
    <div className="bg-black/[0.04] rounded-[16px] overflow-hidden">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex items-center w-full p-4 text-left hover:bg-black/[0.02] transition-colors"
      >
        <span className="flex-1 text-[15px] font-semibold text-black leading-snug pr-3">
          {item.question}
        </span>
        <span
          className="text-[22px] text-black/40 leading-none w-6 flex-shrink-0 text-center"
          aria-hidden
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height] duration-200 ease-out"
        style={{ maxHeight: isOpen ? "640px" : "0px" }}
      >
        <p className="px-4 pb-4 pt-1 text-[14px] text-black/75 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function CROFAQv2() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        Still wondering?
      </h2>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item) => (
          <FAQRow
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>

      <p className="text-center text-[13px] text-black/55 mt-8">
        Still stuck?{" "}
        <Link
          href="mailto:info@conka.io"
          className="font-semibold text-[#1B2757] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          info@conka.io
        </Link>
      </p>
    </div>
  );
}
