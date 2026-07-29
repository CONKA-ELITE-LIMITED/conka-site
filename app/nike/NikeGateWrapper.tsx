"use client";

import { useEffect, useState } from "react";
import CodeGateOverlay from "./CodeGateOverlay";

/**
 * Client shell that gates the (server-rendered) Nike trial page behind the
 * ceremonial code overlay. The page itself stays a Server Component and is
 * passed in as `children`, rendered underneath the overlay so it is ready to
 * be revealed the instant the code is accepted.
 *
 * Unlock persists for the browser session (sessionStorage), so a returning
 * visitor skips the ceremony. First render is deliberately "locked" so the
 * page content never flashes before the overlay mounts.
 */

const STORAGE_KEY = "nike_trial_unlocked";

export default function NikeGateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  // Until we have read sessionStorage on the client we cannot know whether a
  // returning visitor is already unlocked, so we hold the overlay closed and
  // only skip it once we have checked.
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      // sessionStorage unavailable (private mode, etc.): show the gate.
    }
    setChecked(true);
  }, []);

  const showOverlay = !unlocked;

  // Lock body scroll while the overlay covers the page.
  useEffect(() => {
    if (!showOverlay) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showOverlay]);

  const handleUnlock = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Non-fatal: the visitor just sees the gate again next load.
    }
    setUnlocked(true);
  };

  return (
    <>
      {children}
      {/* A returning visitor (checked && unlocked) never renders the overlay,
          so there is no flash to fade. A first-time visitor keeps it until
          they enter the code. */}
      {showOverlay && checked && <CodeGateOverlay onUnlock={handleUnlock} />}
      {/* Before the sessionStorage check resolves, hold a plain cover so the
          page cannot peek. Swapped for the interactive overlay once checked. */}
      {showOverlay && !checked && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0a]" aria-hidden />
      )}
    </>
  );
}
