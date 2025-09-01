"use client";

import InteractiveAvatarWrapper from "@/app/(routes)/_components/InteractiveAvatar";
import { api } from "@/convex/_generated/api";
import { InterviewData } from "@/types";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { gsap } from 'gsap'
import { useGSAP } from "@gsap/react";

function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();
  const [interviewData, setInterviewData] = React.useState<InterviewData>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (interviewId) {
      GetInterviewQuestions();
    }
  }, [interviewId]);

  const GetInterviewQuestions = async () => {
    const result = await convex.query(api.interviews.GetInterviewQuestions, {
      interviewRecordId: interviewId as string,
    });
    setInterviewData(result as InterviewData);
  };

  // GSAP animation: fade in from bottom
  useGSAP(() => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children);
      return gsap.from(children, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
      });
    }
  }, [interviewData]); // run animation when interviewData is loaded

  return (
    <div className="interview-start-page w-screen h-screen flex flex-col">
      <div
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justify-center gap-5 mx-auto p-10"
      >
        <div className="relative w-full h-180">
          {interviewData && (
            <InteractiveAvatarWrapper interviewData={interviewData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
