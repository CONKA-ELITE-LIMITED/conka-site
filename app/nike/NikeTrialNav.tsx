"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
}

/** Anchor targets. Ids must match the section ids rendered in page.tsx. */
const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "What it is" },
  { id: "setup", label: "Set up" },
  { id: "fortnight", label: "2 weeks" },
  { id: "rewards", label: "Rewards" },
];

/**
 * Sticky in-page nav for the Nike trial page. Horizontally-scrollable anchor
 * chips (scroll-spy highlights the section in view) plus a persistent
 * "Get the app" pill that jumps to the setup block, so the core action is
 * always one tap away. Client component: needs IntersectionObserver + click
 * handling. Reduced-motion is honoured for the smooth scroll.
 */
export default function NikeTrialNav() {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    // A thin band across the vertical middle of the viewport: whichever section
    // sits in that band is the active one. Robust and cheap (no scroll listener).
    const observer = new IntersectionObserver(
      (entries) => {
        const inBand = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inBand[0]) setActive(inBand[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-[5vw]">
        {/* scrollbar hidden so the overflow chip row reads as intentional */}
        <div className="-mx-1 overflow-x-auto px-1 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => scrollTo(event, item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex min-h-[38px] items-center rounded-full px-4 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#6478e0] text-white"
                        : "border border-white/15 text-white/60 hover:text-white/90"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
