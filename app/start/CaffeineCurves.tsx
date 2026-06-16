import CrashChart from "@/app/components/landing/CrashChart";

/**
 * /start cognitive-energy chart. Replaced the old dual-curve SVG with the
 * lander CrashChart (steady-vs-crash curve + cost table) in a sharp, on-brand
 * clinical container. Same compelling story, consistent with the rest of /start.
 */
export default function CaffeineCurves() {
  return <CrashChart sharp />;
}
