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
