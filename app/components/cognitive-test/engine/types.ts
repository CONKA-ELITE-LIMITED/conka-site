export type Side = "left" | "right" | "none";

/** One answered (or timed-out) image. */
export interface Interaction {
  stepOrder: number;
  imageId: string;
  sideSelected: Side;
  reactionTimeMs: number;
}

/** What the engine hands back: the server's scores for this test. */
export interface EngineResult {
  /** score1 from the server's test_stats (0-100, unrounded) */
  score: number;
  accuracy: number;
  speed: number;
  testInstanceId: number;
}

/**
 * Colours and font for the test surface. Every field is optional; the defaults
 * are the app's (grey left half, black right half, white text).
 */
export interface EngineTheme {
  leftBackground?: string;
  rightBackground?: string;
  text?: string;
  mutedText?: string;
  accent?: string;
  accentText?: string;
  fontFamily?: string;
  radius?: string;
}

export interface CognitiveTestEngineProps {
  /** Origin of the Flask API, e.g. https://conka.app. /springboot/* is appended. */
  apiBaseUrl: string;
  /** 20 images (the website test) when true, 48 when false. Default true. */
  shortVersion?: boolean;
  theme?: EngineTheme;
  /** Where the test and mask images are served. Default /cognica. */
  assetBaseUrl?: string;
  onComplete: (result: EngineResult) => void;
  /** Called on any failure (open, preload, steps, complete). The engine shows a retry state. */
  onError?: (error: Error) => void;
}
