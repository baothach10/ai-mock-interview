import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    uid: v.id("UserTable"),
    resumeUrl: v.optional(v.union(v.string(), v.null())),
    jobTitle: v.optional(v.union(v.string(), v.null())),
    jobDescription: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.questions,
      resumeUrl: args.resumeUrl || null,
      userId: args.uid,
      jobTitle: args.jobTitle || null,
      jobDescription: args.jobDescription || null,
      status: "draft",
    });
    return result;
  },
});

export const GetInterviewQuestions = query({
  args: {
    interviewRecordId: v.id("InterviewSessionTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewRecordId))
      .collect();

    return result[0];
  },
});
