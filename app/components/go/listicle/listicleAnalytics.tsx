"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
 * than creating an observer of its own.
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

const SectionCtx = createContext<RegisterSection | null>(null);

/**
 * Owns the single IntersectionObserver and the once-per-section guard.
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

  return <SectionCtx.Provider value={register}>{children}</SectionCtx.Provider>;
}

/**
 * Marks one section. Renders a plain <div>, so pass the wrapper className the
 * block already had rather than nesting another element inside it.
 *
 * `trackClicks` turns the div into a click-delegation zone for sections whose
 * CTAs live inside shared components (the home ProductGrid). Any click on an
 * anchor or button below it reports as a CTA click for this section, which
 * avoids threading a callback prop through components the home page also uses.
 */
export function TrackedSection({
  section,
  slug,
  className,
  trackClicks = false,
  children,
}: {
  section: string;
  /** Required only when `trackClicks` is set. */
  slug?: string;
  className?: string;
  trackClicks?: boolean;
  children: ReactNode;
}) {
  const register = useContext(SectionCtx);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !register) return;
    return register(el, section);
  }, [register, section]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trackClicks || !slug) return;

    // Delegated, so it also covers links rendered by shared child components.
    // Listener only: never preventDefault and never await, so navigation and
    // interaction latency are untouched.
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("a[href], button")) return;
      trackListicleCtaClicked({ slug, section });
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [slug, section, trackClicks]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Click handler for a CTA the renderer owns directly (hero, bridge, sticky).
 * Fire and forget: no await before the <Link> navigates.
 */
export function ctaClickHandler(slug: string, section: string): () => void {
  return () => trackListicleCtaClicked({ slug, section });
}
