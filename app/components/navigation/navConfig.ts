/**
 * Shared navigation information architecture.
 *
 * Single source of truth for the nav so desktop and mobile cannot drift.
 * Both NavigationDesktop (dropdowns + Shop mega-menu) and NavigationMobile
 * (overlay groups) consume these constants.
 *
 * IA: Shop (products only) · Science · CONKA App (flat link) · Our Story.
 * "Why CONKA" is intentionally not in the desktop nav; it lives in the footer
 * and in the mobile Company group. See
 * docs/development/featurePlans/navigation-simplification.md.
 */

import { bottleRenders } from "@/app/lib/productImages";

export interface NavProduct {
  name: string;
  /** Blurb for the enhanced mobile rows. */
  descriptionLong: string;
  /** Product hero subtitle, shown under the name on the desktop Shop tile. */
  tagline: string;
  /** Time-of-day tag shown as a pill beside the name. */
  badge: "Morning" | "Afternoon" | "Full day";
  href: string;
  /** Bottle shot used in both the desktop Shop mega-menu and the mobile menu. */
  image: string;
  alt: string;
}

export const NAV_PRODUCTS: NavProduct[] = [
  {
    name: "Both (Flow + Clear)",
    descriptionLong:
      "The full daily system. Morning focus meets afternoon clarity.",
    tagline: "The Complete Daily Brain Shot System, Morning to Evening",
    badge: "Full day",
    href: "/conka-both",
    image: bottleRenders.both.src,
    alt: "CONKA Flow and Clear",
  },
  {
    name: "CONKA Flow",
    descriptionLong:
      "Morning focus & energy. Rhodiola, Ashwagandha, Lemon Balm.",
    tagline: "The Daily Morning Brain Shot for Sharper, Calmer Focus",
    badge: "Morning",
    href: "/conka-flow",
    image: bottleRenders.flow.src,
    alt: "CONKA Flow",
  },
  {
    name: "CONKA Clear",
    descriptionLong:
      "Afternoon clarity & recovery. Glutathione, Ginkgo, Alpha GPC.",
    tagline: "The Afternoon Brain Shot That Cuts Through Brain Fog",
    badge: "Afternoon",
    href: "/conka-clarity",
    image: bottleRenders.clear.src,
    alt: "CONKA Clear",
  },
];

export interface NavLink {
  label: string;
  href: string;
  /** Tile asset for the desktop mega-menu (optional; text-only links omit it). */
  image?: string;
  imageAlt?: string;
  /** "contain" gives the asset breathing room (e.g. app screenshots); default "cover" fills the tile. */
  imageFit?: "cover" | "contain";
  /** One-line tile blurb for the desktop mega-menu. */
  description?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Evidence cluster. Desktop "Science" mega-menu + mobile "Science" group. */
export const NAV_SCIENCE: NavGroup = {
  title: "Science",
  links: [
    {
      label: "Science",
      href: "/science",
      image: "/lifestyle/CreationOfConkaBlack.jpg",
      imageAlt: "CONKA developed in the lab",
      description: "The clinical evidence behind every formula.",
    },
    {
      label: "Ingredients",
      href: "/ingredients",
      image: "/ingredients/renders/AlphaGPC.jpg",
      imageAlt: "CONKA active ingredient render",
      description: "Every active, dosed to the research.",
    },
    {
      label: "Blog",
      href: "/blog",
      image: "/lifestyle/ConkaAtWorkDesk.jpg",
      imageAlt: "Typing at a desk with a CONKA shot beside the keyboard",
      description: "Brain science, made practical.",
    },
  ],
};

/**
 * The CONKA App: a single destination, not a menu. A flat link on desktop and
 * one product-style tile on mobile. App Insights and Case Studies are reached
 * from buttons on /app itself and from the footer, so the nav asks for no
 * extra choice here.
 */
export const NAV_APP: Required<
  Pick<NavLink, "label" | "href" | "image" | "imageAlt" | "description">
> & {
  /** Headline on the mobile tile; `label` is the desktop link and mobile heading. */
  tileTitle: string;
} = {
  label: "CONKA App",
  href: "/app",
  image: "/app/AppConkaRing.png",
  imageAlt: "The CONKA app showing a cognitive score",
  tileTitle: "See CONKA working",
  description: "Free on iOS and Android.",
};

/** Company cluster. Mobile-only group (on desktop, Our Story is a flat link). */
export const NAV_COMPANY: NavGroup = {
  title: "Company",
  links: [
    { label: "Our Story", href: "/our-story" },
    { label: "Why CONKA", href: "/why-conka" },
  ],
};

/** Flat top-level link on desktop. */
export const NAV_OUR_STORY: NavLink = {
  label: "Our Story",
  href: "/our-story",
};

/**
 * Gradient shared by the desktop header and the Shop mega-menu while Shop is
 * open. Both surfaces set it, viewport-anchored, so they read as one
 * continuous panel. Keep the two consumers in sync via this single source.
 */
export const SHOP_MENU_GRADIENT =
  "linear-gradient(135deg, #6774a3 0%, #464f7e 55%, #333a5e 100%)";
