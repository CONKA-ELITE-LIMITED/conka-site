/**
 * Top progress bar for the /go quiz engine. Linear by default: the
 * engine passes progress 0..1. A perceived-progress curve, if ever
 * wanted, is applied by the caller before passing progress in.
 */
export default function QuizProgressBar({ progress }: { progress: number }) {
  const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  return (
    <div
      className="h-1.5 w-full"
      style={{ backgroundColor: "var(--go-track)" }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Quiz progress"
    >
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, backgroundColor: "var(--brand-accent)" }}
      />
    </div>
  );
}
