/**
 * Cognitive Test Types
 *
 * TypeScript interfaces for the website cognitive test on /app.
 */

/**
 * The current state of the cognitive test flow
 */
export type TestState = "idle" | "email" | "testing" | "processing" | "results";

/**
 * Test results from the engine (server scores from test_stats, rounded for display)
 */
export interface TestResult {
  /** Overall cognitive score (0-100) */
  score: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Speed percentage (0-100) */
  speed: number;
  /** The server's test instance; links the result to Klaviyo */
  testInstanceId: number;
}

/**
 * Email submission data from the capture modal
 */
export interface EmailSubmission {
  /** User's email address */
  email: string;
  /** Whether user consented to their results and CONKA marketing emails */
  consentGiven: boolean;
  /** Timestamp of submission */
  submittedAt: Date;
}

/**
 * Props for the CognitiveTestSection component
 */
export interface CognitiveTestSectionProps {
  /** Optional class name for additional styling */
  className?: string;
}

/**
 * Props for the EmailCaptureForm component (inline form, not modal)
 */
export interface EmailCaptureFormProps {
  /** Callback when email is successfully submitted */
  onSubmit: (submission: EmailSubmission) => void;
  /** Callback to go back to idle state */
  onBack: () => void;
}

/**
 * Props for the CognitiveTestIdleCard component
 */
export interface CognitiveTestIdleCardProps {
  /** Callback when user clicks to start the test */
  onStart: () => void;
}

/**
 * Props for the CognitiveTestLoader component
 */
export interface CognitiveTestLoaderProps {
  /** Callback when loading animation completes */
  onComplete: () => void;
  /** Duration of the loading animation in milliseconds */
  duration?: number;
}

/**
 * Props for the CognitiveTestScores component
 */
export interface CognitiveTestScoresProps {
  /** Test results to display */
  result: TestResult;
  /** Optional email to show confirmation */
  email?: string;
}

/**
 * Props for the CognitiveTestRecommendation component
 */
export interface CognitiveTestRecommendationProps {
  /** Test results to base recommendation on */
  result: TestResult;
}
