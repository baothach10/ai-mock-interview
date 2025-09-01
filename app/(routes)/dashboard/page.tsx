"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import EmptyState from "./_components/EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { useConvex } from "convex/react";
import { useUserDetail } from "@/app/Provider";
import { api } from "@/convex/_generated/api";
import InterviewCard from "./_components/InterviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewResponse } from "@/types";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export type InterviewSession = {
  _id: string;
  _creationTime: number;
  interviewQuestions: InterviewResponse[];
  userId: string;
  resumeUrl: string | null;
  status: string;
  jobTitle: string | null;
  jobDescription: string | null;
};

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState<InterviewSession[]>([]);
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (userDetail) GetInterviewList();
  }, [userDetail]);

  const GetInterviewList = async () => {
    setLoading(true);
    const result = await convex.query(api.interviews.GetInterviewList, {
      uid: userDetail._id,
    });
    setInterviewList(result);
    setLoading(false);
  };

  // Animate cards when interviewList updates
  useGSAP(() => {
    if (!loading && cardRefs.current.length > 0) {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [loading, interviewList]);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [headerRef]);

  return (
    <div className="py-20 px-10 md:px-28 lg:px-44">
      <div ref={headerRef} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold">Welcome, {user?.fullName}</h2>
        </div>
        <CreateInterviewDialog />
      </div>

      {!loading && interviewList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {interviewList.map((interview, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
            >
              <InterviewCard interviewDetail={interview} />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
