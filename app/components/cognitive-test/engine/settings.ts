/**
 * Test timings, ported unchanged from the app engine
 * (conkaApp cognicaOffline/utils/TestSettings.js). All values are milliseconds.
 */
export const DEFAULT_TEST_SETTINGS = {
  imageDisplayTiming: 110,
  blankScreenTiming: 2000,
  progressBarTiming: 40,
  preDynamicMaskBlankTiming: 20,
  dynamicMaskTiming: 230,
  postDynamicMaskBlankTiming: 750,
  maskImagesCount: 7,
} as const;

export type TestSettings = typeof DEFAULT_TEST_SETTINGS;

/** Blank screen before the first image, as the app's TestFlow does. */
export const INITIAL_DELAY_MS = 1500;

/** The Stencil SDK's short version showed 20 images; the full test shows 48. */
export const SHORT_IMAGE_COUNT = 20;
export const FULL_IMAGE_COUNT = 48;

/** Any API call slower than this fails, so the visitor never sits on a spinner. */
export const REQUEST_TIMEOUT_MS = 15000;

/** The white flash on the tapped half, and the minimum gap between two taps. */
export const TAP_FLASH_MS = 75;
export const TAP_DEBOUNCE_MS = 50;
