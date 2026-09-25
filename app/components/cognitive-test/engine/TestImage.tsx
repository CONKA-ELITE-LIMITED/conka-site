"use client";

import { useEffect, useRef } from "react";
import styles from "./engine.module.css";
import { now } from "./timing";

interface TestImageProps {
  src: string;
  displayDuration: number;
  onDisplayStart: (time: number) => void;
  onDisplayEnd: (time: number) => void;
}

/**
 * The stimulus. Shown once the image is decoded, for displayDuration, then hidden.
 *
 * Onset is committed inside requestAnimationFrame and the opacity is written to
 * the DOM directly, not through React state, so the recorded start time is the
 * frame the image is painted in. The hide mirrors the app: a timer of
 * displayDuration after onset, with the end time recorded as the image hides.
 */
export default function TestImage({ src, displayDuration, onDisplayStart, onDisplayEnd }: TestImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const callbacks = useRef({ onDisplayStart, onDisplayEnd });

  useEffect(() => {
    callbacks.current = { onDisplayStart, onDisplayEnd };
  }, [onDisplayStart, onDisplayEnd]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    let cancelled = false;
    let frame = 0;
    let hideTimer = 0;

    // A failed decode still shows the image, as the app does on a load error.
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        frame = requestAnimationFrame(() => {
          img.style.opacity = "1";
          callbacks.current.onDisplayStart(now());
          hideTimer = window.setTimeout(() => {
            img.style.opacity = "0";
            callbacks.current.onDisplayEnd(now());
          }, displayDuration);
        });
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(hideTimer);
    };
  }, [src, displayDuration]);

  return (
    // A plain <img>: the engine stays framework-free, and the file is already preloaded.
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imgRef} src={src} alt="" draggable={false} className={styles.stimulus} style={{ opacity: 0 }} />
  );
}
