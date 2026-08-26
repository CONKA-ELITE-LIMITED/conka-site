"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/* ============================================================================
 * sectionImpressions (SCRUM-1260)
 *
 * The surface-agnostic half of section-impression tracking: one
 * IntersectionObserver per page, a once-per-section guard, and a registration
 * context children hand their element to.
 *
 * It knows nothing about what event to send. The caller passes `onSeen`, so
 * each surface keeps its own event name and property shape:
 *   - /go listicles  -> listicle:section_viewed { slug, section }
 *   - PDPs           -> pdp:section_viewed      { product, section }
 *
 * Extracted from listicleAnalytics.tsx, which now wraps this. The observer
 * options here are the listicle's original values and must not drift: changing
 * them silently rebases every historical section_viewed count.
 * ========================================================================== */

/** Registers an element for impression tracking; returns its unregister fn. */
export type RegisterSection = (el: Element, section: string) => () => void;

const RegisterCtx = createContext<RegisterSection | null>(null);

/**
 * Owns the page's single IntersectionObserver and the once-per-section guard.
 *
 * A scroll listener calling getBoundingClientRect would force layout on every
 * scroll frame; IntersectionObserver does not, which is why it is used here.
 *
 * `onSeen` is held in a ref so a caller passing an inline closure cannot tear
 * down and rebuild the observer on every render. The observer is therefore
 * built once per mount, which is equivalent to the previous per-slug effect:
 * a page's identity does not change while it stays mounted.
 */
export function SectionImpressionsProvider({
  onSeen,
  children,
}: {
  onSeen: (section: string) => void;
  children: ReactNode;
}) {
  const seen = useRef<Set<string>>(new Set());
  const labels = useRef<WeakMap<Element, string>>(new WeakMap());
  const observer = useRef<IntersectionObserver | null>(null);
  /** Elements registered before the effect created the observer. */
  const pending = useRef<Set<Element>>(new Set());
  const onSeenRef = useRef(onSeen);

  useEffect(() => {
    onSeenRef.current = onSeen;
  }, [onSeen]);

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
          onSeenRef.current(section);
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
  }, []);

  const register = useCallback<RegisterSection>((el, section) => {
    labels.current.set(el, section);
    if (observer.current) observer.current.observe(el);
    else pending.current.add(el);

    return () => {
      observer.current?.unobserve(el);
      pending.current.delete(el);
    };
  }, []);

  return (
    <RegisterCtx.Provider value={register}>{children}</RegisterCtx.Provider>
  );
}

/**
 * Ref callback that registers the element it lands on as `section`.
 *
 * No-ops outside a provider, so a component using it stays renderable on
 * surfaces that do not track impressions.
 */
export function useSectionRef<T extends Element>(section: string) {
  const register = useContext(RegisterCtx);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !register) return;
    return register(el, section);
  }, [register, section]);

  return ref;
}
