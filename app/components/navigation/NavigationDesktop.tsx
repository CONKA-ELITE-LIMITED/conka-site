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
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-bold text-black transition-colors hover:bg-black/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757] ${
          isOpen ? "bg-black/[0.05]" : ""
        }`}
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

          <nav className="hidden xl:flex items-center gap-1 ml-8">
            <NavMenuTrigger
              label="Shop"
              menu="shop"
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onMenuEnter={onMenuEnter}
              onMenuLeave={onMenuLeave}
            />
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
              className="rounded-full px-4 py-2 text-[15px] font-bold text-black transition-colors hover:bg-black/[0.05]"
            >
              {NAV_OUR_STORY.label}
            </a>
          </nav>

          <div className="flex-1" />

          <div className="hidden xl:flex items-center gap-3">
            <a
              href="/account/login"
              className="group flex items-center justify-center"
              aria-label="Account"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B2757] text-white transition-transform group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </a>
            <button
              onClick={openCart}
              className="rounded-full border border-[#1B2757] px-4 py-1.5 text-sm font-bold text-[#1B2757] transition-colors hover:bg-[#1B2757] hover:text-white tabular-nums"
              aria-label="Open cart"
            >
              Cart {itemCount > 99 ? "99+" : itemCount}
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
