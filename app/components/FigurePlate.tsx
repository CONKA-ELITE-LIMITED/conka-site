/**
 * FigurePlate — wraps any framed asset with clinical spec-sheet overlays.
 *
 * Anatomy (two-corner pattern per CLINICAL_AESTHETIC.md):
 *   top-left  → "Fig. 0N · Subject"
 *   bottom-right → optional meta (location, score, partner, reading)
 *
 * Usage:
 *   <FigurePlate n={2} subject="Cognitive test" meta="Cambridge-derived">
 *     <Image ... />
 *   </FigurePlate>
 *
 * The figure number is sequential across the page — the page author controls
 * the sequence by passing `n`. Assets don't own their own number.
 */

export default function FigurePlate({
  n,
  subject,
  meta,
  gradient = false,
  children,
}: {
  /** Sequential figure number for this page. Formatted as "Fig. 01". */
  n: number;
  /** Short subject label placed after the figure number. */
  subject: string;
  /** Optional bottom-right metadata (location, score, partner, reading). */
  meta?: string;
  /** Add a bottom-to-top gradient for legibility over busy imagery. */
  gradient?: boolean;
  children: React.ReactNode;
}) {
  const figLabel = `Fig. ${String(n).padStart(2, "0")} · ${subject}`;

  return (
    <div className="relative overflow-hidden">
      {children}
      {gradient && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none"
          aria-hidden
        />
      )}
      <div className="fig-plate absolute top-3 left-3 z-10">
        {figLabel}
      </div>
      {meta && (
        <div className="fig-plate absolute bottom-3 right-3 z-10">
          {meta}
        </div>
      )}
    </div>
  );
}
