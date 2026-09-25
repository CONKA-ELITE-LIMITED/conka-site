"use client";

import { useEffect, useState } from "react";
import styles from "./engine.module.css";

interface DynamicMaskProps {
  maskUrls: string[];
  sequenceTiming: number;
  maskCount: number;
}

/**
 * The backward mask: noise images swapped every sequenceTiming / maskCount ms,
 * starting with the first one immediately, as the app's DynamicMask does. All
 * masks are mounted up front and only visibility changes, so a swap never
 * waits on a decode.
 */
export default function DynamicMask({ maskUrls, sequenceTiming, maskCount }: DynamicMaskProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let shown = 1;
    const interval = window.setInterval(() => {
      shown++;
      setIndex((i) => i + 1);
      if (shown > maskCount) clearInterval(interval);
    }, sequenceTiming / maskCount);
    return () => clearInterval(interval);
  }, [sequenceTiming, maskCount]);

  return (
    <>
      {maskUrls.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt=""
          draggable={false}
          className={`${styles.stimulus} ${i === index ? "" : styles.hidden}`}
        />
      ))}
    </>
  );
}
