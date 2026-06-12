/**
 * Landing page registry (/go/[slug]).
 *
 * Adding a landing page = create a config file, add it here. Nothing
 * else changes: the route, engine and analytics read from the config.
 */
import type { LandingConfig } from "./types";
import { quizTemplate } from "./quiz-template";
import { brainAgeQuiz } from "./brain-age";

const registry: Record<string, LandingConfig> = {
  [quizTemplate.slug]: quizTemplate,
  [brainAgeQuiz.slug]: brainAgeQuiz,
};

export const landingSlugs = Object.keys(registry);

export function getLandingConfig(slug: string): LandingConfig | undefined {
  return registry[slug];
}

export * from "./types";
