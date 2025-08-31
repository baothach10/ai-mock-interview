import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  }),
  InterviewSessionTable: defineTable({
    interviewQuestions: v.any(),
    userId: v.id("UserTable"),
    resumeUrl: v.union(v.string(), v.null()),
    status: v.string(),
    jobTitle: v.union(v.string(), v.null()),
    jobDescription: v.union(v.string(), v.null()),
  }),
  FeedbackSessionTable: defineTable({
    interviewId: v.id("InterviewSessionTable"),
    userId: v.id("UserTable"),
    feedback: v.string(),
    suggestions: v.array(v.string()),
    rating: v.number(),
  }),
});
