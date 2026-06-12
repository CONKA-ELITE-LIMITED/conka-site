import type { CSSProperties } from "react";

/**
 * Inline emphasis for quiz copy: *text* renders in the accent colour,
 * **text** in full-contrast text. Shared by AnimatedText (fade-up
 * reveal) and TypewriterText (typed reveal).
 */
export type EmphasisSeg = {
  text: string;
  kind: "plain" | "accent" | "strong";
};

export function parseEmphasis(line: string): EmphasisSeg[] {
  const segs: EmphasisSeg[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line))) {
    if (match.index > last) {
      segs.push({ text: line.slice(last, match.index), kind: "plain" });
    }
    if (match[1] !== undefined) {
      segs.push({ text: match[1], kind: "strong" });
    } else {
      segs.push({ text: match[2], kind: "accent" });
    }
    last = match.index + match[0].length;
  }
  if (last < line.length) {
    segs.push({ text: line.slice(last), kind: "plain" });
  }
  return segs;
}

export function emphasisStyle(
  kind: EmphasisSeg["kind"],
): CSSProperties | undefined {
  if (kind === "accent") return { color: "var(--brand-accent)" };
  if (kind === "strong") return { color: "var(--go-text)" };
  return undefined;
}

export function EmphasisLine({ line }: { line: string }) {
  return (
    <>
      {parseEmphasis(line).map((seg, i) => (
        <span
          key={i}
          className={seg.kind !== "plain" ? "font-medium" : undefined}
          style={emphasisStyle(seg.kind)}
        >
          {seg.text}
        </span>
      ))}
    </>
  );
}

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
          <EmphasisLine line={line} />
        </p>
      ))}
    </div>
  );
}
