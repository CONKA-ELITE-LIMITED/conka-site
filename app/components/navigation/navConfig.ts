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
  /** Eyebrow meta on the desktop mega-menu CTA. */
  ctaMeta: string;
  href: string;
  image: string;
  alt: string;
}

export const NAV_PRODUCTS: NavProduct[] = [
  {
    code: "F-03",
    name: "Both (Flow + Clear)",
    shortLabel: "Flow + Clear",
    description: "The full daily system.",
    descriptionLong: "The full daily system. Morning focus meets afternoon clarity.",
    ctaMeta: "// the full daily system",
    href: "/conka-both",
    image: getProtocolImage("3"),
    alt: "CONKA Flow and Clear",
  },
  {
    code: "F-01",
    name: "CONKA Flow",
    shortLabel: "Flow",
    description: "Morning focus & energy.",
    descriptionLong: "Morning focus & energy. Rhodiola, Ashwagandha, Lemon Balm.",
    ctaMeta: "// morning focus · energy",
    href: "/conka-flow",
    image: getFormulaImage("01"),
    alt: "CONKA Flow",
  },
  {
    code: "F-02",
    name: "CONKA Clear",
    shortLabel: "Clear",
    description: "Afternoon clarity & recovery.",
    descriptionLong: "Afternoon clarity & recovery. Glutathione, Ginkgo, Alpha GPC.",
    ctaMeta: "// afternoon clarity · recovery",
    href: "/conka-clarity",
    image: getFormulaImage("02"),
    alt: "CONKA Clear",
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Evidence cluster. Desktop "Science" dropdown + mobile "Science" group. */
export const NAV_SCIENCE: NavGroup = {
  title: "Science",
  links: [
    { label: "Science", href: "/science" },
    { label: "Ingredients", href: "/ingredients" },
    { label: "Case Studies", href: "/case-studies" },
  ],
};

/** App cluster. Desktop "App" dropdown + mobile "App" group. */
export const NAV_APP: NavGroup = {
  title: "App",
  links: [
    { label: "The CONKA App", href: "/app" },
    { label: "App Insights", href: "/app-insights" },
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
