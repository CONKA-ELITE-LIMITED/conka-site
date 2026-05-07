/**
 * Types for the /app-insights data report page.
 *
 * Each report follows the same shape: a hook header trio, one chart,
 * a few supporting stat cards, an interpretation, an optional Conka
 * sub-section, an optional ingredient bridge (peer-reviewed citations),
 * and a methodology footnote.
 */

export type StatCard = {
  counter: string;
  topic: string;
  value: string;
  context: string;
  caveat: string;
};

/** Single bar in a categorical bar chart. */
export type BarPoint = {
  label: string;
  value: number;
  /** Optional second-line annotation for the x-axis (e.g. sample size). */
  meta?: string;
};

/** Single point in the Time of Day line chart. */
export type LinePoint = {
  hour: number;
  hourLabel: string;
  noConka: number;
  conka: number;
};

export type DosingBand = {
  x1: string;
  x2: string;
  label: string;
  window: string;
  description: string;
  fillColor: string;
  swatchColor: string;
};

export type LineChartData = {
  variant: "line";
  points: LinePoint[];
  yLabel: string;
  insightNote?: string;
  dosingBands?: DosingBand[];
};

export type BarChartData = {
  variant: "bar";
  points: BarPoint[];
  yLabel: string;
  insightNote?: string;
};

export type ChartData = LineChartData | BarChartData;

export type ConkaSubSection = {
  headline: string;
  body: string;
  caveat: string;
};

export type IngredientCitation = {
  ingredient: string;
  finding: string;
  pmid: string;
  studyDesign: string;
  participants: string;
  duration: string;
};

export type IngredientBridge = {
  intro: string;
  citations: IngredientCitation[];
};

/** Layman-friendly anchor: pairs a measured stat with a relatable comparison. */
export type LaymanAnchor = {
  stat: string;
  anchor: string;
};

export type EvidenceStrength = "Strong" | "Moderate" | "Early signal";

export type ReportData = {
  id: "time-of-day" | "mental-fatigue" | "stress" | "alcohol";
  topicCode: string;
  eyebrowConcept: string;
  hook: string;
  subline: string;
  /** One-line layman framing for the TL;DR strip and per-report callout. */
  headlineFinding: string;
  /** Display-formatted sample size for the per-report callout. */
  sampleSize: string;
  /** Evidence-strength badge, sourced from the report Summary tables. */
  evidenceStrength: EvidenceStrength;
  /** 1-2 relatable comparisons to anchor the headline numbers. */
  laymanAnchors: LaymanAnchor[];
  chart: ChartData;
  statCards: StatCard[];
  interpretation: string;
  conkaSubSection?: ConkaSubSection;
  ingredientBridge?: IngredientBridge;
  methodology: string;
};
