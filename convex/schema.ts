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
});
