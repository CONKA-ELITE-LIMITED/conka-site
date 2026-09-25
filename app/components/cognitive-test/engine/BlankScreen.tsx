import type { CSSProperties } from "react";
import styles from "./engine.module.css";

/**
 * "Be Quick", blinking three times over the blank-screen window. Display only:
 * TestStep owns the timer that ends the window.
 */
export default function BlankScreen({ duration }: { duration: number }) {
  return (
    <span className={styles.beQuick} style={{ "--cte-blank-ms": `${duration}ms` } as CSSProperties}>
      Be Quick
    </span>
  );
}
