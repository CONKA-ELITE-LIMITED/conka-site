/**
 * Landing page registry (/go/[slug]).
 *
 * Adding a landing page = create a config file, add it here. Nothing
 * else changes: the route, engine and analytics read from the config.
 */
import type { LandingConfig } from "./types";
import type { ListicleConfig } from "./listicle-types";
import { quizTemplate } from "./quiz-template";
import { brainAgeQuiz } from "./brain-age";
import { adhdListicle } from "./adhd-listicle";
import { productivityListicle } from "./productivity-listicle";
import { brainAgeingListicle } from "./brain-ageing-listicle";
import { generalListicle } from "./general-listicle";

/** Any landing page config; narrow on `format` to render */
export type AnyLandingConfig = LandingConfig | ListicleConfig;

// To add a listicle, create a config file and register it here. Copy the
// closest model: general-listicle.ts for the "mm" template, or a persona file
// (adhd/productivity/brain-ageing) for "im8". See docs/features/LISTICLE_SYSTEM.md.
const registry: Record<string, AnyLandingConfig> = {
  [quizTemplate.slug]: quizTemplate,
  [brainAgeQuiz.slug]: brainAgeQuiz,
  [adhdListicle.slug]: adhdListicle,
  [productivityListicle.slug]: productivityListicle,
  [brainAgeingListicle.slug]: brainAgeingListicle,
  [generalListicle.slug]: generalListicle,
};

export const landingSlugs = Object.keys(registry);

export function getLandingConfig(slug: string): AnyLandingConfig | undefined {
  return registry[slug];
}

export * from "./types";
export * from "./listicle-types";
