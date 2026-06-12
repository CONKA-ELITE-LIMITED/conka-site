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
  scores: Record<string, number>;
}

export interface SliderBand {
  /** Band applies when value <= upTo; bands are checked in order */
  upTo: number;
  scores: Record<string, number>;
}

export interface LandingScreen {
  kind: "landing";
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
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
    bands: SliderBand[];
  };
}

export type QuestionScreen = SingleQuestionScreen | SliderQuestionScreen;

export interface InterstitialScreen {
  kind: "interstitial";
  id: string;
  variant: "stat" | "education" | "testimonial" | "comparison" | "commitment";
  eyebrow?: string;
  title: string;
  /** Paragraphs revealed in sequence */
  body?: string[];
  /** Used by variant "stat" */
  stat?: { value: number; prefix?: string; suffix?: string; label: string };
  /** Used by variant "testimonial" */
  testimonial?: { quote: string; name: string; detail?: string };
  /** Used by variant "comparison" */
  comparison?: { withLabel: string; withoutLabel: string; caption?: string };
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
  eyebrow?: string;
}

export type Screen =
  | LandingScreen
  | QuestionScreen
  | InterstitialScreen
  | AnalyzingScreen
  | ResultsScreen;

export interface LandingConfig {
  slug: string;
  /** Ad persona this page targets; tagged on every analytics event */
  persona: string;
  format: LandingFormat;
  /** Page title and Meta content_name */
  title: string;
  resultsCta: { label: string; href: string };
  buckets: ResultBucket[];
  screens: Screen[];
}

/** A recorded answer: raw value plus the points it contributes */
export interface QuizAnswer {
  value: string | number;
  label: string;
  scores: Record<string, number>;
}
