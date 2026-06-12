/**
 * Staged text reveal: each line fades up in sequence. Pure CSS
 * (go-fade-up in brand-base.css), respects reduced motion.
 */
export default function AnimatedText({
  lines,
  className,
  startDelayMs = 0,
}: {
  lines: string[];
  className?: string;
  startDelayMs?: number;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p
          key={i}
          className="go-fade-up"
          style={{ animationDelay: `${startDelayMs + i * 160}ms` }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
