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

/** Single bar in a four-group comparison chart (absolute values, grows up). */
export type ComparisonBar = {
  label: string;
  value: number;
  /** Optional second-line annotation for the x-axis (e.g. sample size). */
  meta?: string;
  /** Emphasised bar (e.g. the best-performing group). */
  highlight?: boolean;
};

export type ComparisonChartData = {
  variant: "comparison";
  points: ComparisonBar[];
  yLabel: string;
  insightNote?: string;
  /** Y-axis floor so small absolute gaps between groups stay visible. */
  yMin?: number;
  /** Unit suffix appended to the tooltip value, e.g. " pts" or "ms". */
  valueSuffix?: string;
  /** Fixed decimals for the on-bar value labels (keeps e.g. 80.60 vs 80.97 aligned). */
  labelDecimals?: number;
  /** Lower value is better (e.g. reaction time). Defaults to false. */
  lowerIsBetter?: boolean;
};

export type ChartData = LineChartData | BarChartData | ComparisonChartData;

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

/** The one number a report is remembered by: the finding tile in the hero
 *  and the floating stat tile on the report's chart. */
export type GlanceStat = {
  value: string;
  label: string;
  /** Rendered in the positive accent (a gain rather than a cost). */
  positive?: boolean;
};

export type ReportData = {
  id: "time-of-day" | "mental-fatigue" | "stress" | "alcohol" | "coffee";
  topicCode: string;
  eyebrowConcept: string;
  hook: string;
  /** One-line layman framing, shown under each report's hook. */
  headlineFinding: string;
  /** Display-formatted sample size for the report's evidence line. */
  sampleSize: string;
  /** Evidence-strength badge, sourced from the report Summary tables. */
  evidenceStrength: EvidenceStrength;
  /** Hero finding tile and the chart's floating stat tile. */
  glance: GlanceStat;
  /** Short sample label for tiles, e.g. "712 users". */
  sampleShort: string;
  /** Small user count: shown with an "Early signal" chip next to the
   *  sourced evidence strength, which stays as reported. */
  earlySignal?: boolean;
  /** 1-2 relatable comparisons to anchor the headline numbers. */
  laymanAnchors: LaymanAnchor[];
  chart: ChartData;
  statCards: StatCard[];
  interpretation: string;
  conkaSubSection?: ConkaSubSection;
  ingredientBridge?: IngredientBridge;
  methodology: string;
};
