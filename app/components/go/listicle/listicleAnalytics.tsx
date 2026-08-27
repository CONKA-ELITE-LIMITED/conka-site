"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  SectionImpressionsProvider,
  useSectionRef,
} from "@/app/components/analytics/sectionImpressions";
import {
  trackListicleCtaClicked,
  trackListicleInteraction,
  trackListicleSectionViewed,
} from "@/app/lib/analytics";

/**
 * Section attribution for the /go listicles.
 *
 * Answers two questions per page: which sections people actually reach, and
 * which sections produce CTA clicks. The first is the denominator for the
 * second, so both are needed to tell a weak section from a rarely-reached one.
 *
 * Both templates wrap their body in <SectionImpressions slug>, then mark each
 * block with <TrackedSection section>. One IntersectionObserver serves the
 * whole page: TrackedSection registers its element with the provider rather
 * than creating an observer of its own. The slug lives only on the provider,
 * so no call site can tag an event with the wrong page.
 *
 * The observer itself lives in app/components/analytics/sectionImpressions.tsx,
 * shared with the PDPs (SCRUM-1260). This file keeps the listicle's slug and
 * its three event senders, so the emitted stream is unchanged.
 *
 * Event shapes and the two-property budget: see app/lib/analytics.ts.
 */

/**
 * Stable id for a body block: its kind plus its index in `config.body`.
 *
 * Index-derived, so inserting or reordering a block shifts the ids of
 * everything below it and breaks historical comparability for that page. That
 * is the accepted trade-off for not having to hand-author an id in every
 * listicle config. See docs/features/LISTICLE_SYSTEM.md.
 */
export function sectionId(kind: string, index: number): string {
  return `${kind}_${index}`;
}

/** Fixed zones, which live outside the `body` array. */
export const SECTION = {
  hero: "hero",
  bridge: "bridge",
  sticky: "sticky",
  product: "product",
} as const;

/** Carries the slug the three event senders below tag their events with. */
const SlugCtx = createContext<string | null>(null);

/**
 * Binds the shared impression observer to this page's slug, so every section
 * that scrolls into view reports as `listicle:section_viewed { slug, section }`.
 */
export function SectionImpressions({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const onSeen = useCallback(
    (section: string) => trackListicleSectionViewed({ slug, section }),
    [slug],
  );

  return (
    <SectionImpressionsProvider onSeen={onSeen}>
      <SlugCtx.Provider value={slug}>{children}</SlugCtx.Provider>
    </SectionImpressionsProvider>
  );
}

/**
 * Returns a fire-and-forget CTA reporter bound to this page's slug.
 *
 * Never awaited and never calls preventDefault, so navigation and interaction
 * latency are untouched. No-ops outside a <SectionImpressions> provider.
 */
export function useListicleCta(): (section: string) => void {
  const slug = useContext(SlugCtx);

  return useCallback(
    (section: string) => {
      if (!slug) return;
      trackListicleCtaClicked({ slug, section });
    },
    [slug],
  );
}

/**
 * Normalises a human choice label into a section-token fragment, e.g.
 * "For women" -> "for-women". Keeps the interaction `section` values inside the
 * `[a-z0-9_-]` shape the rest of the dashboard uses.
 */
export function slugifyChoice(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "unknown"
  );
}

/**
 * Returns a fire-and-forget interaction reporter bound to this page's slug, for
 * interactive blocks (symptom picker, segment toggle). The caller folds the
 * choice into `section` (e.g. `symptom_forgetfulness`). No-ops outside a
 * <SectionImpressions> provider. Mirrors useListicleCta.
 */
export function useListicleInteraction(): (section: string) => void {
  const slug = useContext(SlugCtx);

  return useCallback(
    (section: string) => {
      if (!slug) return;
      trackListicleInteraction({ slug, section });
    },
    [slug],
  );
}

/**
 * Builds the `?src=` origin token for this page: `<slug>-<section>`.
 *
 * Returned as a plain string rather than applied to an href, because the mm
 * template hands it to ProductGrid as a prop while the im8 template appends it
 * to its own links.
 */
export function useListicleSrc(): (section: string) => string | undefined {
  const slug = useContext(SlugCtx);

  return useCallback(
    (section: string) => (slug ? `${slug}-${section}` : undefined),
    [slug],
  );
}

/**
 * Appends the origin token to an outbound PDP link, so `purchase:add_to_cart`
 * on the PDP can be attributed back to the section that produced the click.
 *
 * A URL param rather than sessionStorage: it survives new tabs, middle-clicks
 * and back-navigation, where sessionStorage is fragile.
 */
export function useListicleHref(): (href: string, section: string) => string {
  const srcFor = useListicleSrc();

  return useCallback(
    (href, section) => {
      const src = srcFor(section);
      if (!src) return href;
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}src=${encodeURIComponent(src)}`;
    },
    [srcFor],
  );
}

/**
 * Marks one section. Renders a plain <div>, so pass the wrapper className the
 * block already had rather than nesting another element inside it.
 *
 * `trackClicks` turns the div into a click-delegation zone, for sections whose
 * CTAs live inside shared components (the home ProductGrid). Any click on an
 * anchor or button below it reports as a CTA click for this section, which
 * avoids threading a callback prop through components the home page also uses.
 * Do not set it on a zone containing non-CTA controls (toggles, accordions):
 * those would all be counted. Such zones should call useListicleCta directly.
 */
export function TrackedSection({
  section,
  className,
  style,
  trackClicks = false,
  children,
}: {
  section: string;
  className?: string;
  /** For blocks whose wrapper carried inline styling before being tracked. */
  style?: CSSProperties;
  trackClicks?: boolean;
  children: ReactNode;
}) {
  const fireCta = useListicleCta();
  const ref = useSectionRef<HTMLDivElement>(section);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trackClicks) return;

    // Delegated, so it also covers links rendered by shared child components.
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("a[href], button")) return;
      fireCta(section);
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [fireCta, ref, section, trackClicks]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
