import NikeGateWrapper from "./NikeGateWrapper";

/**
 * Wraps the Nike trial page in the ceremonial code gate. Kept in the layout so
 * the page (`page.tsx`) can stay a Server Component that owns its metadata,
 * while the gate state, sessionStorage persistence, and reveal live in the
 * client `NikeGateWrapper`.
 */
export default function NikeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NikeGateWrapper>{children}</NikeGateWrapper>;
}
