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
import { listicleTemplate } from "./listicle-template";
import { adhdListicle } from "./adhd-listicle";

/** Any landing page config; narrow on `format` to render */
export type AnyLandingConfig = LandingConfig | ListicleConfig;

const registry: Record<string, AnyLandingConfig> = {
  [quizTemplate.slug]: quizTemplate,
  [brainAgeQuiz.slug]: brainAgeQuiz,
  [listicleTemplate.slug]: listicleTemplate,
  [adhdListicle.slug]: adhdListicle,
};

export const landingSlugs = Object.keys(registry);

export function getLandingConfig(slug: string): AnyLandingConfig | undefined {
  return registry[slug];
}

export * from "./types";
export * from "./listicle-types";
