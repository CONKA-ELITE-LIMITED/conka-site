"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { Banner } from "@/app/components/banner";
import { NAV_PRODUCTS, NAV_SCIENCE, NAV_APP, NAV_COMPANY } from "./navConfig";
import type { NavigationMobileProps } from "./types";

// Same IA as desktop, sourced from the shared config (no duplicate links).
const MENU_GROUPS = [NAV_SCIENCE, NAV_APP, NAV_COMPANY];

// Muted time-of-day tints for the product pills. Warm = morning, cool =
// afternoon, navy = full day. Kept low-saturation so no formula reads as
// spotlit over the other.
const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  Morning: { bg: "rgba(217,119,6,0.12)", color: "#b45309" },
  Afternoon: { bg: "rgba(3,105,161,0.12)", color: "#0369a1" },
  "Full day": { bg: "rgba(27,39,87,0.10)", color: "#1B2757" },
};

export default function NavigationMobile({
  mobileMenuOpen,
  setMobileMenuOpen,
  hideBanner,
  bannerConfig,
}: NavigationMobileProps) {
  const { openCart, itemCount } = useCart();

  return (
    <>
      {!hideBanner && bannerConfig && <Banner config={bannerConfig} />}

      <header className="relative w-full bg-white border-b border-black/12">
        <div className="px-[0.25rem] md:px-16 py-1 flex items-center justify-between min-h-[4.5rem]">
          <div className="xl:hidden w-10 flex-shrink-0 flex items-center justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black hover:text-[#1B2757] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center pointer-events-auto"
            aria-label="CONKA home"
          >
            <Image
              src="/conka-logo.webp"
              alt="CONKA logo"
              width={440}
              height={112}
              className="h-7 md:h-9 w-auto"
              priority
            />
          </Link>

          <div className="xl:hidden min-w-[5.5rem] flex-shrink-0 flex items-center justify-end gap-1">
            <a
              href="/account/login"
              className="p-2 text-black hover:text-[#1B2757] transition-colors"
              aria-label="Account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
            <button
              onClick={() => {
                openCart();
                setMobileMenuOpen(false);
              }}
              className="p-2 text-black hover:text-[#1B2757] transition-colors relative"
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#1B2757] text-white font-mono text-[9px] font-bold tabular-nums min-w-[16px] h-4 px-1 flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-40 bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto pb-16">
            {/* Header bar */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-black/12">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="CONKA home"
              >
                <Image
                  src="/conka-logo.webp"
                  alt="CONKA logo"
                  width={440}
                  height={112}
                  className="h-7 w-auto"
                  priority
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-black"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Shop by Product */}
            <div className="px-5 pt-6">
              <p className="text-lg font-bold text-black mb-4">
                Shop by product
              </p>
              <div className="flex flex-col gap-6">
                {NAV_PRODUCTS.map((product) => {
                  const badge = BADGE_STYLE[product.badge];
                  return (
                    <a
                      key={product.href}
                      href={product.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center gap-4"
                    >
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden border border-black/15 bg-[#f5f5f5]">
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xl font-bold text-black leading-none">
                            {product.name}
                          </p>
                          <span
                            className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-1 leading-none"
                            style={{ backgroundColor: badge.bg, color: badge.color }}
                          >
                            {product.badge}
                          </span>
                        </div>
                        <p className="text-[13px] text-black/80 leading-snug">
                          {product.descriptionLong}
                        </p>
                      </div>
                      <svg
                        aria-hidden
                        className="text-black shrink-0 self-center transition-transform group-hover:translate-x-0.5"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      >
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Categorised groups — compact 2-col grid keeps secondary IA
                scannable and clearly subordinate to the product rows. */}
            {MENU_GROUPS.map((group) => (
              <div
                key={group.title}
                className="px-5 mt-8 pt-8 border-t border-black/10"
              >
                <p className="text-lg font-bold text-black mb-4">
                  {group.title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.links.map((link) => (
                    <a
                      key={`${group.title}-${link.href}`}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between gap-2 bg-[#f5f5f5] px-3.5 py-3.5 hover:bg-black/[0.05] transition-colors"
                    >
                      <span className="text-sm font-semibold text-black leading-tight">
                        {link.label}
                      </span>
                      <svg
                        aria-hidden
                        className="text-black shrink-0"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      >
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Social proof — featured verified review, replacing the old
                guarantee microcopy. */}
            <div className="px-5 mt-8 pt-8 border-t border-black/10">
              <div
                className="p-6 text-center text-white"
                style={{
                  background:
                    "linear-gradient(140deg, #4058bb 0%, #26356f 55%, #1B2757 100%)",
                }}
              >
                <span
                  aria-label="5 out of 5 stars"
                  className="block text-2xl leading-none tracking-[0.18em] text-[#F59E0B]"
                >
                  ★★★★★
                </span>
                <p className="mt-4 text-lg font-bold leading-tight text-white">
                  The combo is unreal
                </p>
                <p className="mt-2 text-[15px] italic leading-snug text-white/90">
                  &ldquo;Started taking both Flow and Clear together and the
                  combo is unreal.&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <span className="text-sm font-bold text-white">Jack G.</span>
                  <span className="bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] leading-none text-[#1B2757]">
                    Verified buyer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
