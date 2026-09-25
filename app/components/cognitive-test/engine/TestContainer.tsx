"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import styles from "./engine.module.css";
import { TAP_DEBOUNCE_MS, TAP_FLASH_MS } from "./settings";
import { now } from "./timing";

type AnswerSide = "left" | "right";

interface TestContainerProps {
  /** Return true if the tap counted; only counted taps flash. */
  onTap?: (side: AnswerSide, time: number) => boolean;
  children?: ReactNode;
}

/**
 * The split surface: left half (non-animal), right half (animal), content on
 * top. Ported from the app's TestContainer: taps land on pointerdown (the app's
 * onPressIn), are debounced at 50ms, and a counted tap flashes its half white
 * for 75ms. On desktop a mouse click on either half answers the same way;
 * there is no keyboard input.
 */
export default function TestContainer({ onTap, children }: TestContainerProps) {
  const leftFlash = useRef<HTMLDivElement>(null);
  const rightFlash = useRef<HTMLDivElement>(null);
  const lastTap = useRef(-Infinity);
  const onTapRef = useRef(onTap);

  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  const press = useCallback((side: AnswerSide) => {
    const time = now();
    if (time - lastTap.current < TAP_DEBOUNCE_MS) return;
    lastTap.current = time;
    if (!onTapRef.current?.(side, time)) return;
    const flash = side === "left" ? leftFlash.current : rightFlash.current;
    flash?.animate([{ opacity: 0.4 }, { opacity: 0 }], { duration: TAP_FLASH_MS, easing: "linear" });
  }, []);

  // While the test runs, the halves block page scroll and zoom (see .live).
  const live = Boolean(onTap);

  return (
    <>
      <div className={`${styles.halves} ${live ? styles.live : ""}`}>
        <div
          className={`${styles.half} ${styles.halfLeft}`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            press("left");
          }}
        >
          <div ref={leftFlash} className={styles.flash} />
        </div>
        <div
          className={`${styles.half} ${styles.halfRight}`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            press("right");
          }}
        >
          <div ref={rightFlash} className={styles.flash} />
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </>
  );
}
