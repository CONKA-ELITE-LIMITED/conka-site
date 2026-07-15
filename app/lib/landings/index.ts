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

/** Any landing page config; narrow on `format` to render */
export type AnyLandingConfig = LandingConfig | ListicleConfig;

// listicle-template is a scaffold with lorem ipsum copy. Registering it would
// serve that placeholder text at a live /go/listicle-template. Copy it to start
// a new lander; do not add it here.
const registry: Record<string, AnyLandingConfig> = {
  [quizTemplate.slug]: quizTemplate,
  [brainAgeQuiz.slug]: brainAgeQuiz,
  [adhdListicle.slug]: adhdListicle,
  [productivityListicle.slug]: productivityListicle,
  [brainAgeingListicle.slug]: brainAgeingListicle,
};

export const landingSlugs = Object.keys(registry);

export function getLandingConfig(slug: string): AnyLandingConfig | undefined {
  return registry[slug];
}

export * from "./types";
export * from "./listicle-types";
