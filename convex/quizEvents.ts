import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Append one quiz event. Pure insert: no reads, no branching, no dedup.
 * Duplicates are harmless and resolved at read time (the funnel counts
 * distinct sessions; answers are last-write-wins). Keeping this dumb is
 * the whole point of the design (see featurePlans/quiz-insights.md).
 */
export const record = mutation({
  args: {
    sessionId: v.string(),
    slug: v.string(),
    persona: v.string(),
    format: v.string(),
    type: v.union(
      v.literal("started"),
      v.literal("screen_viewed"),
      v.literal("answer_selected"),
      v.literal("completed"),
      v.literal("cta_clicked"),
    ),
    screenIndex: v.optional(v.number()),
    screenId: v.optional(v.string()),
    screenKind: v.optional(v.string()),
    totalScreens: v.optional(v.number()),
    questionNumber: v.optional(v.number()),
    answerValue: v.optional(v.string()),
    answerLabel: v.optional(v.string()),
    resultBucket: v.optional(v.string()),
    brainAge: v.optional(v.number()),
    brainAgeGap: v.optional(v.number()),
    timeSpentSeconds: v.optional(v.number()),
    destination: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    ts: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("quizEvents", args);
  },
});
