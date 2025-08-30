"use client";
import InteractiveAvatarWrapper from "@/app/(routes)/_components/InteractiveAvatar";
import { api } from "@/convex/_generated/api";
import { InterviewData } from "@/types";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

function StartInterview() {
  const { interviewId } = useParams();

  const convex = useConvex();

  const [interviewData, setInterviewData] = React.useState<InterviewData>();

  useEffect(() => {
    if (interviewId) {
      GetInterviewQuestions();
    }
  }, [interviewId]);

  const GetInterviewQuestions = async () => {
    const result = await convex.query(api.interviews.GetInterviewQuestions, {
      interviewRecordId: interviewId,
    });
    setInterviewData(result as InterviewData);
  };
  return (
    <div className="inteview-start-page">
      <div className="w-screen h-screen flex flex-col">
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-5 mx-auto p-10">
          <div className="relative w-full h-180">
            {interviewData && (
              <InteractiveAvatarWrapper interviewData={interviewData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
