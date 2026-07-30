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

  // Lock body scroll while the overlay covers the page. `overflow: hidden`
  // alone does not hold on iOS (the page still scrolls behind the overlay,
  // especially once the keyboard is open), so we pin the body with
  // `position: fixed` and restore the scroll position on release. Pinning the
  // body exposes the html element behind it, whose default background is
  // white, so we blacken it too to match the overlay while it is open.
  useEffect(() => {
    if (!showOverlay) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      htmlBackground: html.style.background,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.background = "#0a0a0a";
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      html.style.background = previous.htmlBackground;
      window.scrollTo(0, scrollY);
    };
  }, [showOverlay]);

  return (
    <>
      {children}
      {showOverlay && <CodeGateOverlay onUnlock={handleUnlock} />}
    </>
  );
}
