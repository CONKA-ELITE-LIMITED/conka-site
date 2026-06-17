"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { Banner } from "@/app/components/banner";
import { NAV_PRODUCTS, NAV_SCIENCE, NAV_APP, NAV_COMPANY } from "./navConfig";
import type { NavigationMobileProps } from "./types";

// Same IA as desktop, sourced from the shared config (no duplicate links).
const MENU_GROUPS = [NAV_SCIENCE, NAV_APP, NAV_COMPANY];

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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black tabular-nums mb-4">
                Shop by product
              </p>
              <div className="flex flex-col gap-3">
                {NAV_PRODUCTS.map((product) => (
                  <a
                    key={product.href}
                    href={product.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 bg-[#f5f5f5] hover:bg-black/[0.05] transition-colors p-3"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-white overflow-hidden">
                      <Image
                        src={product.mobileImage}
                        alt={product.alt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-black leading-tight">
                        {product.name}
                      </p>
                      <p className="text-xs text-black/60 mt-0.5 leading-snug">
                        {product.description}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="font-mono text-sm text-black/30 shrink-0"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Categorised groups */}
            {MENU_GROUPS.map((group) => (
              <div key={group.title} className="px-5 pt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black tabular-nums mb-4">
                  {group.title}
                </p>
                <div className="bg-[#f5f5f5]">
                  {group.links.map((link, idx) => (
                    <a
                      key={`${group.title}-${link.href}`}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 ${
                        idx < group.links.length - 1 ? "border-b border-black/8" : ""
                      } hover:bg-black/[0.05] transition-colors`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-black">
                        {link.label}
                      </span>
                      <span
                        aria-hidden
                        className="font-mono text-xs text-black/30"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer meta */}
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40 tabular-nums px-5 pt-8">
              100-day guarantee · Free UK shipping · Cancel anytime
            </p>
          </div>
        </div>
      )}
    </>
  );
}
