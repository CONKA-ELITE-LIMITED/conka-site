/**
 * Props for the Navigation component
 */
export interface NavigationProps {
  cartOpen?: boolean;
  setCartOpen?: (open: boolean) => void;
  /** Hide banner on this page */
  hideBanner?: boolean;
}

/** Which desktop mega-menu is open (one at a time), or null. */
export type NavMenu = "shop" | "science" | "app" | null;

/**
 * Props for NavigationDesktop component
 */
export interface NavigationDesktopProps {
  hideBanner: boolean;
  openMenu: NavMenu;
  setOpenMenu: (menu: NavMenu) => void;
  navRef: React.RefObject<HTMLDivElement | null>;
  bannerConfig: ReturnType<typeof import("@/app/components/banner").useBannerConfig>;
  isScrollingDown: boolean;
  onMenuEnter: (menu: NavMenu) => void;
  onMenuLeave: () => void;
}

/**
 * Props for NavigationMobile component
 */
export interface NavigationMobileProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  hideBanner: boolean;
  bannerConfig: ReturnType<typeof import("@/app/components/banner").useBannerConfig>;
}

/**
 * Props for ShopMegaMenu component
 */
export interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
}

/**
 * Props for ProtocolCard component
 */
export interface ProtocolCardProps {
  protocolId: "1" | "2" | "3" | "4";
  onClick: () => void;
  /** When true (e.g. in mega menu), hover overlay shows less content to avoid clipping on small desktop */
  compactHover?: boolean;
}
