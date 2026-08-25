// TODO: Phase out and delete once /home and /protocol/[id] adopt ConkaCTAButton.
import { BYO_URL } from "@/app/lib/landingConstants";
import Button from "@/app/components/Button";

/**
 * Convenience wrapper: a Button that defaults to the funnel URL.
 * Use Button directly when linking elsewhere.
 */
export default function LandingCTA({
  children,
  href = BYO_URL,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Button href={href} className={className}>
      {children}
    </Button>
  );
}
