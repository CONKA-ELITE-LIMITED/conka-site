"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { trackScienceCtaClicked } from "@/app/lib/analytics";

/**
 * ConkaCTAButton with a `science:cta_clicked` event. The click is caught on a
 * wrapper rather than passed as onClick, because ConkaCTAButton renders a
 * <button> instead of a link when it is given one. Kept as a tiny client leaf
 * so the sections around it stay server components.
 */
export default function ScienceCtaButton({
  href,
  location,
  children,
}: {
  href: string;
  /** Semantic id of the placement, e.g. "hero" or "final". */
  location: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="inline-flex"
      onClick={() => trackScienceCtaClicked({ location })}
    >
      <ConkaCTAButton href={href}>{children}</ConkaCTAButton>
    </div>
  );
}
