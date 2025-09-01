export type InterviewData = {
  _id: string;
  interviewQuestions: InterviewResponse[];
  userId: string | null;
  jobTitle: string | null;
  jobDescription: string | null;
};

export type InterviewResponse = {
  question: string;
  answer: string;
};

export type FeedbackData = {
  _id: string;
  _creationTime: number;
  suggestions: string[];
  userId: string;
  interviewId: string;
  feedback: string;
  rating: number;
};
