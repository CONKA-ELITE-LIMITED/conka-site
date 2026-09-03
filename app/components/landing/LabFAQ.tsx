"use client";

import { useState } from "react";
import Link from "next/link";
import { CONVERSION_FAQ_ITEMS, type FaqEntry } from "@/app/lib/faqContent";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import { SUPPORT_EMAIL, supportMailtoHref } from "@/app/lib/supportEmail";

interface LabFAQProps {
  /** The rows to render. Defaults to the curated conversion subset. */
  items?: FaqEntry[];
  hideCTA?: boolean;
  ctaHref?: string;
  /** Support footer with the /faq hub link. Noindex paid surfaces (`/go`)
   *  pass false so the funnel does not leak off to the hub. */
  showSeeAllLink?: boolean;
}

export default function LabFAQ({
  items = CONVERSION_FAQ_ITEMS,
  hideCTA = false,
  ctaHref = "/build-your-order",
  showSeeAllLink = true,
}: LabFAQProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h2 className="brand-h1 mb-0 text-black">Frequently asked questions</h2>
      </div>

      <div>
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `lab-faq-panel-${item.id}`;

          return (
            <div key={item.id} className="border-b border-black/10 first:border-t">
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
                  // Max-height must comfortably exceed the tallest answer at mobile
                  // width (the "do nootropics work" PDP answer runs ~20 lines at
                  // 360px). Bump if answers get longer, or the panel clips.
                  maxHeight: isOpen ? "760px" : "0px",
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
          {showSeeAllLink ? (
            <>
              <Link
                href="/faq"
                className="text-black underline decoration-black/20 hover:decoration-black"
              >
                See all questions
              </Link>{" "}
              or email{" "}
            </>
          ) : (
            <>Still have a question? Email </>
          )}
          <a
            href={supportMailtoHref()}
            className="text-black underline decoration-black/20 hover:decoration-black"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      {!hideCTA && (
        <div className="mt-8 flex justify-center lg:justify-start">
          <ConkaCTAButton href={ctaHref} meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
        </div>
      )}
    </div>
  );
}
