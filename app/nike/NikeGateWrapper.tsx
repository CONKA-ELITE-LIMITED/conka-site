"use client";

import { useCallback, useEffect, useState } from "react";
import CodeGateOverlay from "./CodeGateOverlay";

/**
 * Client shell that gates the (server-rendered) Nike trial page behind the
 * ceremonial code overlay. The page itself stays a Server Component and is
 * passed in as `children`, rendered underneath the overlay so it is ready to
 * be revealed the instant the code is accepted.
 *
 * The gate shows on every visit: the unlock is in-memory only, so a reload or
 * a return trip replays the ceremony and asks for the code again.
 */
export default function NikeGateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const showOverlay = !unlocked;

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  // Lock body scroll while the overlay covers the page.
  useEffect(() => {
    if (!showOverlay) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showOverlay]);

  return (
    <>
      {children}
      {showOverlay && <CodeGateOverlay onUnlock={handleUnlock} />}
    </>
  );
}
