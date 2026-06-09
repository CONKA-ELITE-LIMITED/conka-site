"use client";

import useIsMobile from "@/app/hooks/useIsMobile";
import CognitiveTestSection from "./CognitiveTestSection";
import CognitiveTestSectionMobile from "./CognitiveTestSectionMobile";

/**
 * Client island for the live cognitive test. Isolates the mobile/desktop
 * split (and its `useIsMobile` hook) so the surrounding `/app` page can stay
 * a server component. Renders nothing until the breakpoint is resolved to
 * avoid a layout flash.
 */
export default function CognitiveTestIsland() {
  const isMobile = useIsMobile();

  if (isMobile === undefined) return null;

  return isMobile ? <CognitiveTestSectionMobile /> : <CognitiveTestSection />;
}
