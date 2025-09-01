import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { InterviewSession } from "@/app/(routes)/dashboard/page";

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
    interviewRecordId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewRecordId))
      .collect();

    return result[0];
  },
});

export const GetInterviewDetail = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewId))
      .order("desc")
      .collect();
    return result[0];
  },
});

export const GetInterviewList = query({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("userId"), args.uid))
      .order("desc")
      .collect();

    return result;
  },
});

export const UpdateInterviewField = mutation({
  args: {
    interviewId: v.string(),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewId))
      .collect();

    if (interview && interview.length > 0) {
      if (
        (interview[0] as InterviewSession)[
          args.field as keyof InterviewSession
        ] === args.value
      ) {
        return { success: true };
      }
      await ctx.db.patch(interview[0]._id, {
        [args.field]: args.value,
      });
      return { success: false };
    } else return { success: true };
  },
});
