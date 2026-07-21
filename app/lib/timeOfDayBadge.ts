/**
 * Soft pastel time-of-day badge colours, shared so the nav Shop tiles and the
 * home product showcase render Morning / Afternoon / Full day identically.
 * Each value is a pastel fill plus a darker accent text that reads on both a
 * white surface and a navy hover fill.
 */
export type TimeOfDay = "Morning" | "Afternoon" | "Full day";

export const TIME_OF_DAY_BADGE: Record<TimeOfDay, string> = {
  Morning: "bg-[#f7edcb] text-[#755b1a]",
  Afternoon: "bg-[#f7ddd0] text-[#9a4526]",
  "Full day": "bg-[#dce3f5] text-[#2f3f74]",
};
