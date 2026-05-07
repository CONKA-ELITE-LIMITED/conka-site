"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface VisibilityGateProps {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
}

export default function VisibilityGate({
  children,
  minHeight,
  rootMargin = "200px",
}: VisibilityGateProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
