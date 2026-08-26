"use client";

/**
 * Build Your Order — shared slim accordion cluster (SCRUM-1249).
 *
 * The "learn more" pattern used on the Learn and Build steps: a single quiet
 * container of divided rows, one open at a time, so optional depth never
 * competes with the decision path. Rows are content-only; the caller supplies
 * the analytics id per row.
 */

import { useState, type ReactNode } from "react";

export interface LearnMoreRow {
  /** Analytics id, reported through onOpen as-is (e.g. "build:ingredients"). */
  id: string;
  label: string;
  body: ReactNode;
}

export default function LearnMoreAccordion({
  rows,
  onOpen,
}: {
  rows: LearnMoreRow[];
  onOpen?: (id: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    // Report opens only, and from outside the updater: state updaters must be
    // pure, and React double-invokes them under StrictMode.
    if (next) onOpen?.(next);
    setOpenId(next);
  };

  return (
    <div className="rounded-md ring-1 ring-black/10 bg-white overflow-hidden divide-y divide-black/10">
      {rows.map((row) => {
        const open = openId === row.id;
        return (
          <div key={row.id}>
            <button
              type="button"
              onClick={() => toggle(row.id)}
              aria-expanded={open}
              className="flex w-full min-h-[48px] items-center justify-between gap-2 px-4 text-left text-[14px] font-semibold text-black"
            >
              {row.label}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                className="shrink-0 text-black/40 transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "none" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: open ? "1100px" : "0px" }}
            >
              <div className="px-4 pb-4">{row.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
