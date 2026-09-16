"use client";

import { trackScienceCtaClicked } from "@/app/lib/analytics";

/**
 * Fires `science:cta_clicked` when anything inside is clicked, so a link keeps
 * rendering as a server-built <a> while the section around it stays a server
 * component. The click bubbles from the link, which covers keyboard activation
 * too.
 */
export default function ScienceTrackClick({
  location,
  className = "",
  children,
}: {
  /** Semantic id of the placement, e.g. "hero", "final", "flow_card". */
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} onClick={() => trackScienceCtaClicked({ location })}>
      {children}
    </div>
  );
}
