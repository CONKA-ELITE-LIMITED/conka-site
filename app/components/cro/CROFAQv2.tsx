import Link from "next/link";
import {
  GUARANTEE_LABEL_FULL,
  GUARANTEE_COPY_TRIAL,
} from "@/app/lib/offerConstants";

/* ============================================================================
 * CROFAQv2
 *
 * V2 Section 11 on /start. Last section before the legal disclaimer footer.
 *
 * Server Component. Single-open accordion via native <details name="...">
 * (Chromium 120+, Safari 17+; older browsers gracefully fall back to
 * multi-open with no broken UX). No client JS.
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

function FAQRow({ item }: { item: FaqItem }) {
  return (
    <details
      name="faq-still-wondering"
      className="group bg-black/[0.04] rounded-[16px] overflow-hidden"
    >
      <summary className="flex items-center w-full p-4 text-left cursor-pointer list-none hover:bg-black/[0.02] transition-colors [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-[15px] font-semibold text-black leading-snug pr-3">
          {item.question}
        </span>
        <span
          className="text-[22px] text-black/40 leading-none w-6 flex-shrink-0 text-center select-none"
          aria-hidden
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <p className="px-4 pb-4 pt-1 text-[14px] text-black/75 leading-relaxed">
        {item.answer}
      </p>
    </details>
  );
}

export default function CROFAQv2() {
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
          <FAQRow key={item.id} item={item} />
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
