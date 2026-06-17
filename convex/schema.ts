import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // LEGACY — old protocol quiz (/quiz, now hidden/redirected). Orphaned: no app
  // code reads or writes this; the backend functions in convex/quizAnalytics.ts
  // are also unused. Kept only for historical data. New /go quizzes use quizEvents.
  // Store each quiz session (one per user taking the quiz)
  quizSessions: defineTable({
    // Anonymous session ID (generated client-side)
    sessionId: v.string(),
    // Optional user ID if logged in
    userId: v.optional(v.string()),
    // User agent and device info for analytics
    userAgent: v.optional(v.string()),
    // Referrer URL (how they got to the quiz)
    referrer: v.optional(v.string()),
    // Started timestamp
    startedAt: v.number(),
    // Completed timestamp (null if abandoned)
    completedAt: v.optional(v.number()),
    // Was the quiz completed?
    completed: v.boolean(),
    // Final recommended protocol (if completed)
    recommendedProtocol: v.optional(v.string()),
    // All protocol scores (if completed)
    protocolScores: v.optional(
      v.array(
        v.object({
          protocolId: v.string(),
          percentage: v.number(),
          totalPoints: v.number(),
        }),
      ),
    ),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_completed", ["completed"])
    .index("by_recommended", ["recommendedProtocol"]),

  // LEGACY — companion to quizSessions (old protocol quiz). Orphaned; kept for
  // historical data only. See note on quizSessions above.
  // Store individual question answers for detailed analytics
  quizAnswers: defineTable({
    // Reference to the session
    sessionId: v.string(),
    // Question ID from quizData
    questionId: v.string(),
    // The question text (for easy querying)
    questionText: v.string(),
    // What the question measures
    measures: v.string(),
    // The selected answer value
    answerValue: v.string(),
    // The selected answer label (human readable)
    answerLabel: v.string(),
    // Time spent on this question (milliseconds)
    timeSpentMs: v.optional(v.number()),
    // Timestamp when answered
    answeredAt: v.number(),
    // Question order (1-indexed)
    questionNumber: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_question", ["questionId"])
    .index("by_answer", ["questionId", "answerValue"]),

  // Append-only event log for the /go landing quiz engine (QuizEngine.tsx).
  // One row per event, mirroring the `landing:*` Vercel events. The write
  // side stays dumb (pure insert); all funnel/conversion shaping happens at
  // read time in the dashboard. See docs/development/featurePlans/quiz-insights.md.
  quizEvents: defineTable({
    // Identity carried on EVERY event ("fat event" so reads never join)
    sessionId: v.string(),
    slug: v.string(),
    persona: v.string(),
    format: v.string(),
    // What happened
    type: v.union(
      v.literal("started"),
      v.literal("screen_viewed"),
      v.literal("answer_selected"),
      v.literal("completed"),
      v.literal("cta_clicked"),
    ),
    // Screen context (screen_viewed)
    screenIndex: v.optional(v.number()),
    screenId: v.optional(v.string()),
    screenKind: v.optional(v.string()),
    totalScreens: v.optional(v.number()),
    // Answer context (answer_selected)
    questionNumber: v.optional(v.number()),
    answerValue: v.optional(v.string()),
    answerLabel: v.optional(v.string()),
    // Outcome context (completed)
    resultBucket: v.optional(v.string()),
    brainAge: v.optional(v.number()),
    brainAgeGap: v.optional(v.number()),
    timeSpentSeconds: v.optional(v.number()),
    // Handoff context (cta_clicked)
    destination: v.optional(v.string()),
    // Attribution (captured on started)
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    // Event time (client clock)
    ts: v.number(),
  })
    .index("by_slug_ts", ["slug", "ts"])
    .index("by_session", ["sessionId"]),

  // Store contest entry submissions
  winEntries: defineTable({
    // Contest identifier (e.g., "nike-2026-01")
    contestId: v.string(),
    // Email address
    email: v.string(),
    // Timestamp when submitted
    submittedAt: v.number(),
    // Browser/device info for analytics
    userAgent: v.optional(v.string()),
    // Source URL for campaign tracking
    referrer: v.optional(v.string()),
  })
    .index("by_contest", ["contestId"])
    .index("by_email_contest", ["email", "contestId"])
    .index("by_referrer", ["referrer"]),

  // Founding Member counter - single document to track spots remaining
  foundingMemberCounter: defineTable({
    // Total limit of founding member spots
    totalLimit: v.number(),
    // Current number of spots taken
    spotsTaken: v.number(),
    // Last updated timestamp
    updatedAt: v.number(),
  }),
});
