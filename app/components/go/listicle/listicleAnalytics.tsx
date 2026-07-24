"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  trackListicleCtaClicked,
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
 * Event shapes and the two-property budget: see app/lib/analytics.ts.
 */

/**
 * Stable id for a body block: its kind plus its index in `config.body`.
 *
 * Index-derived, so inserting or reordering a block shifts the ids of
 * everything below it and breaks historical comparability for that page. That
 * is the accepted trade-off for not having to hand-author an id in every
 * listicle config. See docs/development/featurePlans/listicle-cta-attribution.md.
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

/** Registers an element for impression tracking; returns its unregister fn. */
type RegisterSection = (el: Element, section: string) => () => void;

interface ListicleAnalyticsValue {
  slug: string;
  register: RegisterSection;
}

const SectionCtx = createContext<ListicleAnalyticsValue | null>(null);

/**
 * Owns the page's single IntersectionObserver, the once-per-section guard, and
 * the slug every event is tagged with.
 *
 * A scroll listener calling getBoundingClientRect would force layout on every
 * scroll frame; IntersectionObserver does not, which is why it is used here.
 */
export function SectionImpressions({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const seen = useRef<Set<string>>(new Set());
  const labels = useRef<WeakMap<Element, string>>(new WeakMap());
  const observer = useRef<IntersectionObserver | null>(null);
  /** Elements registered before the effect created the observer. */
  const pending = useRef<Set<Element>>(new Set());

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = labels.current.get(entry.target);
          if (!section) continue;
          // One event per section per pageview, so stop watching immediately.
          obs.unobserve(entry.target);
          if (seen.current.has(section)) continue;
          seen.current.add(section);
          trackListicleSectionViewed({ slug, section });
        }
      },
      {
        // A percentage threshold can never be met by a section taller than the
        // viewport, so trigger on any intersection and instead pull the bottom
        // edge in: the section must clear the lowest 15% to count as seen.
        threshold: 0,
        rootMargin: "0px 0px -15% 0px",
      },
    );

    observer.current = obs;
    // Children mount before their parent, so anything that registered while
    // observer.current was still null is waiting here.
    pending.current.forEach((el) => obs.observe(el));
    pending.current.clear();

    return () => {
      obs.disconnect();
      observer.current = null;
    };
  }, [slug]);

  const register = useCallback<RegisterSection>((el, section) => {
    labels.current.set(el, section);
    if (observer.current) observer.current.observe(el);
    else pending.current.add(el);

    return () => {
      observer.current?.unobserve(el);
      pending.current.delete(el);
    };
  }, []);

  const value = useMemo<ListicleAnalyticsValue>(
    () => ({ slug, register }),
    [slug, register],
  );

  return <SectionCtx.Provider value={value}>{children}</SectionCtx.Provider>;
}

/**
 * Returns a fire-and-forget CTA reporter bound to this page's slug.
 *
 * Never awaited and never calls preventDefault, so navigation and interaction
 * latency are untouched. No-ops outside a <SectionImpressions> provider.
 */
export function useListicleCta(): (section: string) => void {
  const ctx = useContext(SectionCtx);

  return useCallback(
    (section: string) => {
      if (!ctx) return;
      trackListicleCtaClicked({ slug: ctx.slug, section });
    },
    [ctx],
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
  const ctx = useContext(SectionCtx);

  return useCallback(
    (section: string) => (ctx ? `${ctx.slug}-${section}` : undefined),
    [ctx],
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
  const ctx = useContext(SectionCtx);
  const register = ctx?.register;
  const fireCta = useListicleCta();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !register) return;
    return register(el, section);
  }, [register, section]);

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
  }, [fireCta, section, trackClicks]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
