"use client";

/**
 * Shared GSAP entry point for /appv2 components. Registers plugins once;
 * import gsap/ScrollTrigger/useGSAP from here, never from the packages
 * directly, so registration is guaranteed before first use.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
