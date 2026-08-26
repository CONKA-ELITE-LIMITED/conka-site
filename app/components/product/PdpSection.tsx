"use client";

import { useCallback, type ReactNode } from "react";
import {
  SectionImpressionsProvider,
  useSectionRef,
} from "@/app/components/analytics/sectionImpressions";
import { trackPdpSectionViewed } from "@/app/lib/analytics";

/* ============================================================================
 * PdpSection (SCRUM-1260)
 *
 * Section-impression tracking for the three product pages. Wrap a page in
 * <PdpSectionImpressions product>, then build its sections with <PdpSection>
 * instead of a raw <section>.
 *
 * The point of the component is that `id` is used twice: once as the element's
 * DOM id and once as the tracked section name. They cannot drift apart, so the
 * dataset stays keyed on a stable semantic name through the reordering this
 * page structure goes through. See trackPdpSectionViewed in app/lib/analytics.ts.
 * ========================================================================== */

/** Which PDP the sections below belong to. */
export type PdpProduct = "flow" | "clear" | "both";

export function PdpSectionImpressions({
  product,
  children,
}: {
  product: PdpProduct;
  children: ReactNode;
}) {
  const onSeen = useCallback(
    (section: string) => trackPdpSectionViewed({ product, section }),
    [product],
  );

  return (
    <SectionImpressionsProvider onSeen={onSeen}>
      {children}
    </SectionImpressionsProvider>
  );
}

/**
 * One tracked page section. Renders the same <section> the pages rendered
 * before, so section wrapper, background and track classes stay on the page
 * exactly as the layout pattern requires.
 */
export default function PdpSection({
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
