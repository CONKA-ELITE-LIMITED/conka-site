import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import ScienceTrackClick from "./ScienceTrackClick";

/** ConkaCTAButton that fires `science:cta_clicked` with its placement. */
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
    <ScienceTrackClick location={location} className="inline-flex">
      <ConkaCTAButton href={href}>{children}</ConkaCTAButton>
    </ScienceTrackClick>
  );
}
