"use client";

import { useCallback, type ReactNode } from "react";
import {
  SectionImpressionsProvider,
  useSectionRef,
} from "@/app/components/analytics/sectionImpressions";
import { trackHomeSectionViewed } from "@/app/lib/analytics";

/* ============================================================================
 * HomeSection (SCRUM-1265)
 *
 * Section-impression tracking for the home page. Wrap the page in
 * <HomeSectionImpressions>, then build its sections with <HomeSection>
 * instead of a raw <section>.
 *
 * The point of the component is that `id` is used twice: once as the element's
 * DOM id and once as the tracked section name. They cannot drift apart, so the
 * dataset stays keyed on a stable semantic name through the reordering the
 * home page is going through (home-page-round-2.md). See trackHomeSectionViewed
 * in app/lib/analytics.ts.
 *
 * Deliberately a near-copy of PdpSection rather than a shared generic: the two
 * differ in their event shape (the PDP carries a `product` property, home has
 * no second dimension), and a generic taking both an event sender and an
 * optional extra property would be harder to read than the duplication it
 * saves. The shared machinery, the observer itself, already lives in
 * sectionImpressions.tsx.
 * ========================================================================== */

export function HomeSectionImpressions({ children }: { children: ReactNode }) {
  const onSeen = useCallback(
    (section: string) => trackHomeSectionViewed({ section }),
    [],
  );

  return (
    <SectionImpressionsProvider onSeen={onSeen}>
      {children}
    </SectionImpressionsProvider>
  );
}

/**
 * One tracked page section. Renders the same <section> the page rendered
 * before, so section wrapper, background and track classes stay on the page
 * exactly as the layout pattern requires.
 */
export default function HomeSection({
  id,
  className,
  ariaLabel,
  children,
}: {
  /** Semantic id: the DOM id AND the tracked section name. */
  id: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const ref = useSectionRef<HTMLElement>(id);

  return (
    <section ref={ref} id={id} className={className} aria-label={ariaLabel}>
      {children}
    </section>
  );
}
