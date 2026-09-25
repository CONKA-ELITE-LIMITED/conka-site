import styles from "./engine.module.css";

const SIZE = 200;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Test progress, flashed for progressBarTiming after each answer. */
export default function ProgressRing({ progress }: { progress: number }) {
  return (
    <svg className={styles.ring} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
      <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#7b7b7b" strokeWidth={STROKE * 0.9} />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
      />
    </svg>
  );
}
