/**
 * Cognitive Test Components
 *
 * Components for the WebSDK cognitive test integration on the science page.
 */

// Types
export type {
  TestState,
  TestResult,
  EmailSubmission,
  CognitiveTestSectionProps,
  EmailCaptureFormProps,
  CognicaSDKProps,
  CognitiveTestIdleCardProps,
  CognitiveTestLoaderProps,
  CognitiveTestScoresProps,
  CognitiveTestRecommendationProps,
} from "./types";

// Main orchestrator
export { default as CognitiveTestSection } from "./CognitiveTestSection";
export { default as CognitiveTestSectionMobile } from "./CognitiveTestSectionMobile";
export { default as CognitiveTestIsland } from "./CognitiveTestIsland";

// Sub-components
export { default as CognitiveTestIdleCard } from "./CognitiveTestIdleCard";
export { default as CognitiveTestLoader } from "./CognitiveTestLoader";
export { default as CognitiveTestScores } from "./CognitiveTestScores";
export { default as CognitiveTestRecommendation } from "./CognitiveTestRecommendation";
export { default as CognitiveTestAppPromo } from "./CognitiveTestAppPromo";

// Utility components
export { default as EmailCaptureForm } from "./EmailCaptureForm";
export { default as CognicaSDK } from "./CognicaSDK";
