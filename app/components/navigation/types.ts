/**
 * Props for the Navigation component
 */
export interface NavigationProps {
  cartOpen?: boolean;
  setCartOpen?: (open: boolean) => void;
  /** Hide banner on this page */
  hideBanner?: boolean;
}

/**
 * Props for NavigationDesktop component
 */
export interface NavigationDesktopProps {
  hideBanner: boolean;
  shopDropdownOpen: boolean;
  setShopDropdownOpen: (open: boolean) => void;
  shopDropdownRef: React.RefObject<HTMLDivElement | null>;
  bannerConfig: ReturnType<typeof import("@/app/components/banner").useBannerConfig>;
  isScrollingDown: boolean;
  onShopAreaEnter: () => void;
  onShopAreaLeave: () => void;
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
  onShopAreaEnter: () => void;
  onShopAreaLeave: () => void;
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
