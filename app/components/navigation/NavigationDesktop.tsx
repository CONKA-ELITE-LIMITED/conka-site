"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { Banner } from "@/app/components/banner";
import ShopMegaMenu from "./ShopMegaMenu";
import NavGroupMegaMenu from "./NavGroupMegaMenu";
import { NAV_SCIENCE, NAV_APP, NAV_OUR_STORY } from "./navConfig";
import type { NavigationDesktopProps, NavMenu } from "./types";

/** Text trigger for a grouped mega-menu (Science, App). */
function NavMenuTrigger({
  label,
  menu,
  openMenu,
  setOpenMenu,
  onMenuEnter,
  onMenuLeave,
}: {
  label: string;
  menu: NavMenu;
  openMenu: NavMenu;
  setOpenMenu: (menu: NavMenu) => void;
  onMenuEnter: (menu: NavMenu) => void;
  onMenuLeave: () => void;
}) {
  const isOpen = openMenu === menu;
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => onMenuEnter(menu)}
      onMouseLeave={onMenuLeave}
    >
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : menu)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black hover:text-[#1B2757] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757]"
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
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

export default function NavigationDesktop({
  hideBanner,
  openMenu,
  setOpenMenu,
  navRef,
  bannerConfig,
  isScrollingDown,
  onMenuEnter,
  onMenuLeave,
}: NavigationDesktopProps) {
  const { openCart, itemCount } = useCart();

  return (
    <div
      className={`w-full xl:fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isScrollingDown ? "xl:-translate-y-full" : "xl:translate-y-0"
      }`}
      ref={navRef}
    >
      {!hideBanner && bannerConfig && <Banner config={bannerConfig} />}

      <header className="w-full bg-white border-b border-black/12">
        <div className="px-6 md:px-16 py-1 md:py-4 flex items-center relative">
          <Link href="/" className="flex items-center" aria-label="CONKA home">
            <Image
              src="/conka-logo.webp"
              alt="CONKA logo"
              width={440}
              height={112}
              className="h-7 md:h-9 w-auto"
              priority
            />
          </Link>

          <div className="hidden xl:flex items-center gap-6 ml-10">
            <div
              className="relative flex items-center"
              onMouseEnter={() => onMenuEnter("shop")}
              onMouseLeave={onMenuLeave}
            >
              <button
                onClick={() => setOpenMenu(openMenu === "shop" ? null : "shop")}
                aria-expanded={openMenu === "shop"}
                aria-haspopup="true"
                className="flex items-center gap-2 bg-[#1B2757] text-white px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]"
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
                  className={`transition-transform ${openMenu === "shop" ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            <nav className="flex items-center gap-7">
              <NavMenuTrigger
                label={NAV_SCIENCE.title}
                menu="science"
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                onMenuEnter={onMenuEnter}
                onMenuLeave={onMenuLeave}
              />
              <NavMenuTrigger
                label={NAV_APP.title}
                menu="app"
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                onMenuEnter={onMenuEnter}
                onMenuLeave={onMenuLeave}
              />
              <a
                href={NAV_OUR_STORY.href}
                className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black hover:text-[#1B2757] transition-colors"
              >
                {NAV_OUR_STORY.label}
              </a>
            </nav>
          </div>

          <div className="flex-1" />

          <div className="hidden xl:flex items-center gap-2">
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
              onClick={openCart}
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

      {/* Mega-menus anchored to the fixed wrapper so they drop flush from the
          header bottom (no gap) and ride the scroll-hide transform. */}
      <ShopMegaMenu
        isOpen={openMenu === "shop"}
        onClose={() => setOpenMenu(null)}
        onEnter={() => onMenuEnter("shop")}
        onLeave={onMenuLeave}
      />
      <NavGroupMegaMenu
        isOpen={openMenu === "science"}
        group={NAV_SCIENCE}
        onClose={() => setOpenMenu(null)}
        onEnter={() => onMenuEnter("science")}
        onLeave={onMenuLeave}
      />
      <NavGroupMegaMenu
        isOpen={openMenu === "app"}
        group={NAV_APP}
        onClose={() => setOpenMenu(null)}
        onEnter={() => onMenuEnter("app")}
        onLeave={onMenuLeave}
      />
    </div>
  );
}
