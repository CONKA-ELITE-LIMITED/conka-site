/**
 * Landing system config schema (/go/[slug]).
 *
 * One config file per landing page; the registry in index.ts maps slug
 * to config. The engine renders whatever the screens array describes,
 * so question count, interstitial mix and ordering are pure content
 * decisions. Each screen carries a `kind` discriminator (and questions
 * a `type`, interstitials a `variant`) that selects the renderer.
 * See quiz-template.ts for a reference config.
 */

export type LandingFormat = "quiz";

export type LandingTheme = "light" | "dark";

/**
 * Numeric scoring mode (e.g. the brain-age quiz). The baseline comes
 * from the answer carrying `baselineAge`; every other answer's `years`
 * are summed and clamped to [gapMin, gapMax]. gapMin > 0 guarantees
 * even mostly-good answers produce a small gap. The result is a
 * lifestyle self-assessment score, never a medical measurement.
 */
export interface BrainAgeScoring {
  mode: "brain-age";
  gapMin: number;
  gapMax: number;
}

/** Computed brain-age result, exposed to reveal/results interpolation */
export interface BrainAgeResult {
  realAge: number;
  brainAge: number;
  gap: number;
}

export interface ResultBucket {
  id: string;
  /** Mono tag on the result card, e.g. "MORNING SYSTEM" */
  tag: string;
  title: string;
  body: string;
  /** Product recommendation line shown in the result card */
  recommendation: string;
  /** Overrides config.resultsCta.href for this bucket */
  ctaHref?: string;
}

export interface QuestionOption {
  label: string;
  /** Optional leading glyph */
  icon?: string;
  /** Points toward result buckets, keyed by bucket id */
  scores?: Record<string, number>;
  /** Brain-age scoring: years this answer adds (or subtracts) */
  years?: number;
  /** Brain-age scoring: real-age baseline (set on the age question) */
  baselineAge?: number;
}

export interface SliderBand {
  /** Band applies when value <= upTo; bands are checked in order */
  upTo: number;
  scores?: Record<string, number>;
  /** Brain-age scoring: years this band adds (or subtracts) */
  years?: number;
}

export interface LandingScreen {
  kind: "landing";
  id: string;
  title: string;
  /** Emphasis beat rendered on its own line under the title: larger, accent colour */
  titleAccent?: string;
  subtitle?: string;
  /** Optional looping video (public path) shown between copy and CTA */
  video?: string;
  /** Star-rating line shown above the CTA, e.g. "4.9/5 from customers" */
  rating?: { text: string };
  cta: string;
  /** Reassurance line under the CTA, e.g. "Takes 90 seconds" */
  footnote?: string;
}

interface QuestionScreenBase {
  kind: "question";
  id: string;
  question: string;
  subtitle?: string;
}

export interface SingleQuestionScreen extends QuestionScreenBase {
  type: "single";
  options: QuestionOption[];
}

export interface SliderQuestionScreen extends QuestionScreenBase {
  type: "slider";
  slider: {
    min: number;
    max: number;
    step?: number;
    minLabel: string;
    maxLabel: string;
    /** Readout template, "{value}" is replaced, e.g. "{value} hours" */
    unit?: string;
    /** Tick mark under the track, e.g. an "AVERAGE" anchor */
    anchor?: { value: number; label: string };
    bands: SliderBand[];
  };
}

export type QuestionScreen = SingleQuestionScreen | SliderQuestionScreen;

/**
 * Chart shown on an interstitial. The discriminated `type` picks the
 * renderer: "line" is the stylised with/without curve, "bar" and "pie"
 * take real values from the config.
 */
export type ChartConfig =
  | {
      type: "line";
      withLabel: string;
      withoutLabel: string;
      caption?: string;
    }
  | {
      type: "bar";
      items: { label: string; value: number; accent?: boolean }[];
      /** Readout template, "{value}" is replaced, e.g. "{value} hrs" */
      unit?: string;
      caption?: string;
    }
  | {
      type: "pie";
      /** First segment gets the accent colour; values are relative */
      segments: { label: string; value: number }[];
      caption?: string;
    }
  | {
      type: "cycle";
      /** Diamond of nodes around an accent centre; the active ring
       *  steps round on a timer (the "vicious cycle" screen) */
      nodes: { label: string }[];
      center: string;
    };

export interface InterstitialScreen {
  kind: "interstitial";
  id: string;
  variant:
    | "stat"
    | "education"
    | "testimonial"
    | "comparison"
    | "commitment"
    | "payoff";
  /** Optional: commitment screens may be body-lines only (typed out) */
  title?: string;
  /** Rendered directly under the title, before the visual content */
  subtitle?: string;
  /** Paragraphs revealed in sequence. Inline emphasis: *accent* renders
   *  in the accent colour, **strong** in full-contrast text. Commitment
   *  variant types the lines out character by character. */
  body?: string[];
  /** "strong" renders body in full-contrast text instead of soft grey */
  bodyTone?: "soft" | "strong";
  /** Used by variant "stat" */
  stat?: { value: number; prefix?: string; suffix?: string; label: string };
  /** Used by variant "testimonial" */
  testimonial?: { quote: string; name: string; detail?: string };
  /** Renders on any variant when set */
  chart?: ChartConfig;
  /** Static imagery between title and body: one image renders full
   *  width (phone screenshots); two render as side-by-side white
   *  product cards with mono captions */
  images?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  }[];
  /** Mirrors a previous answer above the title: "YOU SAID: <label>" */
  mirror?: { questionId: string; prefix?: string };
  /** Continue button label, defaults to "Continue" */
  cta?: string;
}

export interface AnalyzingScreen {
  kind: "analyzing";
  id: string;
  title: string;
  /** Lines ticked through before auto-advancing to results */
  steps: string[];
}

export interface ResultsScreen {
  kind: "results";
  id: string;
}

/**
 * Brain-age reveal: two count-up ages (real vs brain age), then a
 * turnaround curve. Title/body support {realAge}, {brainAge} and
 * {gap} interpolation. Only meaningful with scoring mode "brain-age".
 */
export interface RevealScreen {
  kind: "reveal";
  id: string;
  realAgeLabel: string;
  brainAgeLabel: string;
  title: string;
  body?: string[];
  turnaround?: { nowLabel: string; futureLabel: string; caption?: string };
  /** Continue button label, defaults to "Continue" */
  cta?: string;
}

export type Screen =
  | LandingScreen
  | QuestionScreen
  | InterstitialScreen
  | AnalyzingScreen
  | RevealScreen
  | ResultsScreen;

export interface LandingConfig {
  slug: string;
  /** Ad persona this page targets; tagged on every analytics event */
  persona: string;
  format: LandingFormat;
  /** Page title and Meta content_name */
  title: string;
  /** Canvas theme; defaults to "light" */
  theme?: LandingTheme;
  /** Defaults to bucket scoring when omitted */
  scoring?: BrainAgeScoring;
  resultsCta: { label: string; href: string };
  buckets: ResultBucket[];
  screens: Screen[];
}

/** A recorded answer: raw value plus the points it contributes */
export interface QuizAnswer {
  value: string | number;
  label: string;
  scores?: Record<string, number>;
  years?: number;
  baselineAge?: number;
}
