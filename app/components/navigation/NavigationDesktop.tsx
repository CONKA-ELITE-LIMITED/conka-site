"use client";

import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { Banner } from "@/app/components/banner";
import ShopMegaMenu from "./ShopMegaMenu";
import type { NavigationDesktopProps } from "./types";

const NAV_LINKS = [
  { label: "Science", href: "/science" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "CONKA App", href: "/app" },
  { label: "Our Story", href: "/our-story" },
];

export default function NavigationDesktop({
  hideBanner,
  shopDropdownOpen,
  setShopDropdownOpen,
  shopDropdownRef,
  bannerConfig,
  isScrollingDown,
  onShopAreaEnter,
  onShopAreaLeave,
}: NavigationDesktopProps) {
  const { openCart, itemCount } = useCart();

  return (
    <div
      className={`w-full xl:fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isScrollingDown ? "xl:-translate-y-full" : "xl:translate-y-0"
      }`}
      ref={shopDropdownRef}
    >
      {!hideBanner && bannerConfig && <Banner config={bannerConfig} />}

      <header className="w-full bg-white border-b border-black/12">
        <div className="px-6 md:px-16 py-1 md:py-4 flex items-center relative">
          <a href="/" className="flex items-center" aria-label="CONKA home">
            <Image
              src="/conka-logo.webp"
              alt="CONKA logo"
              width={440}
              height={112}
              className="h-7 md:h-9 w-auto"
              priority
            />
          </a>

          <div className="hidden xl:flex items-center gap-6 ml-10">
            <div
              className="relative"
              onMouseEnter={onShopAreaEnter}
              onMouseLeave={onShopAreaLeave}
            >
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                aria-expanded={shopDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 bg-white text-black border border-black/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums lab-clip-tr transition-colors hover:bg-[#1B2757] hover:text-white hover:border-[#1B2757]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Shop
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
                  className={`transition-transform ${shopDropdownOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <ShopMegaMenu
                isOpen={shopDropdownOpen}
                onClose={() => setShopDropdownOpen(false)}
                bannerConfig={bannerConfig}
                hideBanner={hideBanner}
                onShopAreaEnter={onShopAreaEnter}
                onShopAreaLeave={onShopAreaLeave}
              />
            </div>

            <nav className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black/65 hover:text-[#1B2757] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex-1" />

          <div className="hidden xl:flex items-center gap-2">
            <a
              href="/account/login"
              className="p-2 text-black/70 hover:text-[#1B2757] transition-colors"
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
              onClick={openCart}
              className="p-2 text-black/70 hover:text-[#1B2757] transition-colors relative"
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
    </div>
  );
}
