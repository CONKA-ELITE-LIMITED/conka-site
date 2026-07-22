/* ============================================================================
 * CitationLine
 *
 * Small-print source line (PMID / DOI / PMC) shown under a listicle claim or
 * an ingredient tile so proof stays verifiable. Content-only: the parent owns
 * spacing via `className`. Optional `href` turns it into an outbound link.
 * ========================================================================== */

export default function CitationLine({
  citation,
  href,
  className = "",
}: {
  citation: string;
  href?: string;
  className?: string;
}) {
  const base =
    "block font-mono text-[10px] leading-relaxed text-black/40";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} underline underline-offset-2 ${className}`}
      >
        {citation}
      </a>
    );
  }

  return <p className={`${base} ${className}`}>{citation}</p>;
}
