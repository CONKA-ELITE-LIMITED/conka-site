/**
 * Timing for the test, ported from the app engine's TimingService.
 *
 * The app uses Date.now() because React Native has nothing finer. The browser
 * does, so every timestamp here is performance.now(): monotonic and
 * sub-millisecond. The formulas are the app's (docs/TIMING-PRECISION.md):
 *
 *   reactionTime = tapTime - displayEndTime   (clamped at 0)
 *
 * Stimulus onset is committed inside requestAnimationFrame (see TestImage), so
 * displayStartTime is the frame the image was painted in, not when a timer fired.
 */
export const now = (): number => performance.now();

export function reactionTimeMs(tapTime: number | null, displayEndTime: number | null): number {
  if (tapTime === null || displayEndTime === null) return 0;
  return Math.max(0, tapTime - displayEndTime);
}
