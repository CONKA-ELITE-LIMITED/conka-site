import Link from "next/link";
import { CONVERSION_FAQ_ITEMS, type FaqEntry } from "@/app/lib/faqContent";

/* ============================================================================
 * CROFAQv2
 *
 * V2 Section 11 on /start. Last section before the legal disclaimer footer.
 *
 * Q&A content is shared with LabFAQ via app/lib/faqContent.ts.
 *
 * Server Component. Single-open accordion via native <details name="...">
 * (Chromium 120+, Safari 17+; older browsers gracefully fall back to
 * multi-open with no broken UX). No client JS.
 * ========================================================================== */

function FAQRow({ item }: { item: FaqEntry }) {
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

export default function CROFAQv2({
  items = CONVERSION_FAQ_ITEMS,
  // The /go ad landers pass their own items and opt out of the /faq link: they
  // are noindex funnels and should not send paid traffic off to the hub.
  showSeeAllLink = true,
}: {
  items?: FaqEntry[];
  showSeeAllLink?: boolean;
} = {}) {
  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        Still wondering?
      </h2>

      <div className="space-y-2">
        {items.map((item) => (
          <FAQRow key={item.id} item={item} />
        ))}
      </div>

      <p className="text-center text-[13px] text-black/55 mt-8">
        {showSeeAllLink && (
          <>
            <Link
              href="/faq"
              className="font-semibold text-[#1B2757] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              See all questions
            </Link>{" "}
            or email{" "}
          </>
        )}
        {!showSeeAllLink && "Still stuck? "}
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
