// LEGACY / DEPRECATED — backend for the old protocol quiz (/quiz, now hidden).
// These functions read/write the legacy quizSessions + quizAnswers tables and are
// no longer called by any app code (verified: zero front-end references). Kept only
// so the historical tables stay queryable. New /go quizzes use convex/quizEvents.ts.
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Start a new quiz session
export const startSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionDoc = await ctx.db
      .query("quizSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    // If session already exists, return its ID
    if (sessionDoc) {
      return sessionDoc._id;
    }

    // Create new session
    const id = await ctx.db.insert("quizSessions", {
      sessionId: args.sessionId,
      userId: args.userId,
      userAgent: args.userAgent,
      referrer: args.referrer,
      startedAt: Date.now(),
      completed: false,
    });

    return id;
  },
});

// Record an individual question answer
export const recordAnswer = mutation({
  args: {
    sessionId: v.string(),
    questionId: v.string(),
    questionText: v.string(),
    measures: v.string(),
    answerValue: v.string(),
    answerLabel: v.string(),
    questionNumber: v.number(),
    timeSpentMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if answer already exists for this session/question
    const existing = await ctx.db
      .query("quizAnswers")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existing) {
      // Update existing answer (user changed their answer)
      await ctx.db.patch(existing._id, {
        answerValue: args.answerValue,
        answerLabel: args.answerLabel,
        timeSpentMs: args.timeSpentMs,
        answeredAt: Date.now(),
      });
      return existing._id;
    }

    // Insert new answer
    const id = await ctx.db.insert("quizAnswers", {
      sessionId: args.sessionId,
      questionId: args.questionId,
      questionText: args.questionText,
      measures: args.measures,
      answerValue: args.answerValue,
      answerLabel: args.answerLabel,
      questionNumber: args.questionNumber,
      timeSpentMs: args.timeSpentMs,
      answeredAt: Date.now(),
    });

    return id;
  },
});

// Complete a quiz session with results
export const completeSession = mutation({
  args: {
    sessionId: v.string(),
    recommendedProtocol: v.string(),
    protocolScores: v.array(
      v.object({
        protocolId: v.string(),
        percentage: v.number(),
        totalPoints: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("quizSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(session._id, {
      completed: true,
      completedAt: Date.now(),
      recommendedProtocol: args.recommendedProtocol,
      protocolScores: args.protocolScores,
    });

    return session._id;
  },
});

// Link a user ID to a session (when user logs in after quiz)
export const linkUserToSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("quizSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        userId: args.userId,
      });
    }
  },
});

// ===== QUERY FUNCTIONS FOR ANALYTICS DASHBOARD =====

// Get all quiz sessions (for admin dashboard)
export const getSessions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    const sessions = await ctx.db
      .query("quizSessions")
      .order("desc")
      .take(limit);
    return sessions;
  },
});

// Get completion stats
export const getCompletionStats = query({
  args: {},
  handler: async (ctx) => {
    const allSessions = await ctx.db.query("quizSessions").collect();
    const completed = allSessions.filter((s) => s.completed);
    
    return {
      total: allSessions.length,
      completed: completed.length,
      abandoned: allSessions.length - completed.length,
      completionRate: allSessions.length > 0 
        ? Math.round((completed.length / allSessions.length) * 100) 
        : 0,
    };
  },
});

// Get protocol recommendation distribution
export const getProtocolDistribution = query({
  args: {},
  handler: async (ctx) => {
    const completedSessions = await ctx.db
      .query("quizSessions")
      .withIndex("by_completed", (q) => q.eq("completed", true))
      .collect();

    const distribution: Record<string, number> = {};
    
    for (const session of completedSessions) {
      if (session.recommendedProtocol) {
        distribution[session.recommendedProtocol] = 
          (distribution[session.recommendedProtocol] || 0) + 1;
      }
    }

    return distribution;
  },
});

// Get answer distribution for a specific question
export const getAnswerDistribution = query({
  args: {
    questionId: v.string(),
  },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("quizAnswers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    const distribution: Record<string, { count: number; label: string }> = {};
    
    for (const answer of answers) {
      if (!distribution[answer.answerValue]) {
        distribution[answer.answerValue] = {
          count: 0,
          label: answer.answerLabel,
        };
      }
      distribution[answer.answerValue].count++;
    }

    return {
      questionId: args.questionId,
      totalResponses: answers.length,
      distribution,
    };
  },
});

// Get all answers for a session
export const getSessionAnswers = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("quizAnswers")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return answers.sort((a, b) => a.questionNumber - b.questionNumber);
  },
});
