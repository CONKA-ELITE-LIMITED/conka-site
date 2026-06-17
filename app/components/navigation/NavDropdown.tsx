"use client";

import { useEffect, useRef, useState } from "react";
import type { NavLink } from "./navConfig";

/* ============================================================================
 * NavDropdown
 *
 * Small, self-contained desktop hover dropdown for grouped text links
 * (Science, App). Mirrors the Shop mega-menu hover behaviour (open on enter,
 * 150ms close timeout on leave) but owns its own state so it does not touch
 * the parent Navigation state machine.
 *
 * The trigger wrapper is self-stretch so the panel drops from the bottom of
 * the header bar (no gap), left-aligned under the trigger. Closes on Escape
 * and on click-outside. Desktop only (rendered inside the xl: nav).
 * ========================================================================== */

export default function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const cancelClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handleEnter = () => {
    cancelClose();
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  // Escape closes; click-outside closes. Listeners only while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={containerRef}
      className="relative self-stretch flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black hover:text-[#1B2757] transition-colors"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        // mt-4 mirrors the header row's md:py-4 bottom padding so the panel
        // drops flush from the header bottom (the trigger container self-
        // stretches to the header content box). No magic measurement needed.
        <div className="absolute left-0 top-full mt-4 min-w-[200px] bg-white border border-black/12 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          {links.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-6 px-4 py-3 group transition-colors hover:bg-[#f5f5f5] ${
                idx < links.length - 1 ? "border-b border-black/8" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-black/70 group-hover:text-[#1B2757]">
                {link.label}
              </span>
              <span
                aria-hidden
                className="font-mono text-[11px] text-black/30 group-hover:text-[#1B2757]"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
