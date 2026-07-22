"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { Banner } from "@/app/components/banner";
import ShopMegaMenu from "./ShopMegaMenu";
import NavGroupMegaMenu from "./NavGroupMegaMenu";
import {
  NAV_SCIENCE,
  NAV_APP,
  NAV_OUR_STORY,
  SHOP_MENU_GRADIENT,
} from "./navConfig";
import type { NavigationDesktopProps, NavMenu } from "./types";

/** Text trigger for a mega-menu. `primary` renders the obvious Shop pill;
 *  `onDark` inverts colours when the header is on the Shop gradient. */
function NavMenuTrigger({
  label,
  menu,
  openMenu,
  setOpenMenu,
  onMenuEnter,
  onMenuLeave,
  primary = false,
  onDark = false,
}: {
  label: string;
  menu: NavMenu;
  openMenu: NavMenu;
  setOpenMenu: (menu: NavMenu) => void;
  onMenuEnter: (menu: NavMenu) => void;
  onMenuLeave: () => void;
  primary?: boolean;
  onDark?: boolean;
}) {
  const isOpen = openMenu === menu;
  const base =
    "flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757]";
  const tone = primary
    ? onDark
      ? "bg-white text-[#1B2757]"
      : "bg-[#1B2757] text-white hover:opacity-90"
    : onDark
      ? `text-white hover:bg-white/10 ${isOpen ? "bg-white/10" : ""}`
      : `text-black hover:bg-black/[0.05] ${isOpen ? "bg-black/[0.05]" : ""}`;
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
        className={`${base} ${tone}`}
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
  const shopOpen = openMenu === "shop";

  return (
    <div
      className={`w-full xl:fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isScrollingDown ? "xl:-translate-y-full" : "xl:translate-y-0"
      }`}
      ref={navRef}
    >
      {!hideBanner && bannerConfig && <Banner config={bannerConfig} />}

      <header
        className={`w-full border-b transition-colors duration-200 ${
          shopOpen ? "border-transparent" : "bg-white border-black/12"
        }`}
        style={
          shopOpen
            ? {
                // Viewport-anchored so the header and the Shop panel below it
                // read as one continuous diagonal (no seam at the boundary).
                background: SHOP_MENU_GRADIENT,
                backgroundAttachment: "fixed",
              }
            : undefined
        }
      >
        <div className="px-6 md:px-16 py-1 md:py-4 flex items-center relative">
          <Link href="/" className="flex items-center" aria-label="CONKA home">
            <Image
              src="/conka-logo.webp"
              alt="CONKA logo"
              width={440}
              height={112}
              className={`h-7 md:h-9 w-auto transition-[filter] duration-200 ${
                shopOpen ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </Link>

          <nav className="hidden xl:flex items-center gap-1 ml-8">
            <NavMenuTrigger
              label="Shop"
              menu="shop"
              primary
              onDark={shopOpen}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onMenuEnter={onMenuEnter}
              onMenuLeave={onMenuLeave}
            />
            <NavMenuTrigger
              label={NAV_SCIENCE.title}
              menu="science"
              onDark={shopOpen}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onMenuEnter={onMenuEnter}
              onMenuLeave={onMenuLeave}
            />
            <NavMenuTrigger
              label={NAV_APP.title}
              menu="app"
              onDark={shopOpen}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onMenuEnter={onMenuEnter}
              onMenuLeave={onMenuLeave}
            />
            <a
              href={NAV_OUR_STORY.href}
              className={`rounded-full px-4 py-2 text-[15px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757] ${
                shopOpen
                  ? "text-white hover:bg-white/10"
                  : "text-black hover:bg-black/[0.05]"
              }`}
            >
              {NAV_OUR_STORY.label}
            </a>
          </nav>

          <div className="flex-1" />

          <div className="hidden xl:flex items-center gap-3">
            <a
              href="/account/login"
              className="group flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757]"
              aria-label="Account"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  shopOpen
                    ? "border-white text-white group-hover:bg-white group-hover:text-[#1B2757]"
                    : "border-black text-black group-hover:bg-black group-hover:text-white"
                }`}
              >
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
              className={`rounded-full border px-4 py-1.5 text-sm font-bold tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B2757] ${
                shopOpen
                  ? "border-white text-white hover:bg-white hover:text-[#1B2757]"
                  : itemCount > 0
                    ? "border-[#1B2757] bg-[#1B2757] text-white hover:opacity-90"
                    : "border-black text-black hover:bg-black hover:text-white"
              }`}
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
