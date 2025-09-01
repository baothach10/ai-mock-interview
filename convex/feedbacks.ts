import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const SaveFeedback = mutation({
  args: {
    interviewId: v.id("InterviewSessionTable"),
    userId: v.id("UserTable"),
    feedback: v.string(),
    suggestions: v.array(v.string()),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("FeedbackSessionTable", {
      interviewId: args.interviewId,
      userId: args.userId,
      feedback: args.feedback,
      suggestions: args.suggestions,
      rating: args.rating,
    });
  },
});

export const GetFeedbacksByInterview = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("FeedbackSessionTable")
      .filter((q) => q.eq(q.field("interviewId"), args.interviewId))
      .collect();
    return result;
  },
});
