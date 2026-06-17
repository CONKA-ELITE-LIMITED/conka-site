/**
 * Shared navigation information architecture.
 *
 * Single source of truth for the nav so desktop and mobile cannot drift.
 * Both NavigationDesktop (dropdowns + Shop mega-menu) and NavigationMobile
 * (overlay groups) consume these constants.
 *
 * IA: Shop (products only) · Science · App · Our Story.
 * "Why CONKA" is intentionally not in the desktop nav; it lives in the footer
 * and in the mobile Company group. See
 * docs/development/featurePlans/navigation-simplification.md.
 */

import { getFormulaImage, getProtocolImage } from "@/app/lib/productImageConfig";

export interface NavProduct {
  code: string;
  name: string;
  shortLabel: string;
  /** Short blurb for the compact mobile rows. */
  description: string;
  /** Longer blurb for the desktop mega-menu cards. */
  descriptionLong: string;
  href: string;
  /** Desktop mega-menu render. */
  image: string;
  /** Mobile menu thumbnail (lander bottle shot on white). */
  mobileImage: string;
  alt: string;
}

export const NAV_PRODUCTS: NavProduct[] = [
  {
    code: "F-03",
    name: "Both (Flow + Clear)",
    shortLabel: "Flow + Clear",
    description: "The full daily system.",
    descriptionLong: "The full daily system. Morning focus meets afternoon clarity.",
    href: "/conka-both",
    image: getProtocolImage("3"),
    mobileImage: "/lander/BothHero.jpg",
    alt: "CONKA Flow and Clear",
  },
  {
    code: "F-01",
    name: "CONKA Flow",
    shortLabel: "Flow",
    description: "Morning focus & energy.",
    descriptionLong: "Morning focus & energy. Rhodiola, Ashwagandha, Lemon Balm.",
    href: "/conka-flow",
    image: getFormulaImage("01"),
    mobileImage: "/lander/FlowNew.jpg",
    alt: "CONKA Flow",
  },
  {
    code: "F-02",
    name: "CONKA Clear",
    shortLabel: "Clear",
    description: "Afternoon clarity & recovery.",
    descriptionLong: "Afternoon clarity & recovery. Glutathione, Ginkgo, Alpha GPC.",
    href: "/conka-clarity",
    image: getFormulaImage("02"),
    mobileImage: "/lander/ClearNew.jpg",
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
  ],
};

/** App + proof cluster. Desktop "App" mega-menu + mobile "App" group. */
export const NAV_APP: NavGroup = {
  title: "App",
  links: [
    {
      label: "The CONKA App",
      href: "/app",
      image: "/app/AppConkaRing.png",
      imageAlt: "The CONKA app cognitive score ring",
      imageFit: "contain",
      description: "Train your brain daily and watch your cognitive score climb.",
    },
    {
      label: "App Insights",
      href: "/app-insights",
      image: "/app/AppLongTrends.png",
      imageAlt: "CONKA app long-term trend charts",
      imageFit: "contain",
      description: "Patterns from thousands of cognitive tests, growing with our research.",
    },
    {
      label: "Case Studies",
      href: "/case-studies",
      image: "/caseStudies/JoshStanton.jpg",
      imageAlt: "A CONKA case-study athlete",
      description: "Real results from athletes and pros.",
    },
  ],
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
export const NAV_OUR_STORY: NavLink = { label: "Our Story", href: "/our-story" };
