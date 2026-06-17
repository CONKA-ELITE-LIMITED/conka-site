"use client";

import { useState, useEffect, useRef } from "react";
import { useBannerConfig } from "@/app/components/banner";
import NavigationDesktop from "./NavigationDesktop";
import NavigationMobile from "./NavigationMobile";
import type { NavigationProps, NavMenu } from "./types";

export default function Navigation({
  cartOpen: _cartOpen,
  setCartOpen: _setCartOpen,
  hideBanner = false,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavMenu>(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const bannerConfig = useBannerConfig("founding-member");

  // Hover tracking for the desktop mega-menus (trigger + panel). One menu is
  // open at a time; a short close delay bridges the trigger-to-panel gap.
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menu: NavMenu) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setOpenMenu(menu);
  };

  const handleMenuLeave = () => {
    resetTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  // Cleanup timeout on unmount or when the menu closes
  useEffect(() => {
    if (!openMenu && resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [openMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setIsScrollingDown(currentScrollY > lastScrollY);
      } else {
        setIsScrollingDown(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close the open menu when clicking outside the nav
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the open menu on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation - Hidden below xl, visible on xl+ */}
      <div className="hidden xl:block">
        <NavigationDesktop
          hideBanner={hideBanner}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          navRef={navRef}
          bannerConfig={bannerConfig}
          isScrollingDown={isScrollingDown}
          onMenuEnter={handleMenuEnter}
          onMenuLeave={handleMenuLeave}
        />

        {/* Spacer to push content down on desktop (accounts for fixed header height) */}
        {!hideBanner && bannerConfig ? (
          <div className="h-[136px]" />
        ) : (
          <div className="h-20" />
        )}
      </div>

      {/* Mobile Navigation - Visible below xl, hidden on xl+ */}
      <div className="xl:hidden">
        <NavigationMobile
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          hideBanner={hideBanner}
          bannerConfig={bannerConfig}
        />
      </div>
    </>
  );
}
