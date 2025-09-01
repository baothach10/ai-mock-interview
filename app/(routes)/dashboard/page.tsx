"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import EmptyState from "./_components/EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { useConvex } from "convex/react";
import { useUserDetail } from "@/app/Provider";
import { api } from "@/convex/_generated/api";
import InterviewCard from "./_components/InterviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewResponse } from "@/types";

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

  const [interviewList, setInterviewList] = React.useState<InterviewSession[]>([]);
  const { userDetail } = useUserDetail()
  const convex = useConvex()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userDetail)
      GetInterviewList()
  }, [userDetail])

  const GetInterviewList = async () => {
    setLoading(true)
    const result = await convex.query(api.interviews.GetInterviewList, {
      uid: userDetail._id
    })
    setInterviewList(result)
    setLoading(false)
  }

  return (
    <div className="py-20 px-10 md:px-28 lg:px-44">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold">Welcome, {user?.fullName}</h2>
        </div>
        <CreateInterviewDialog />
      </div>
      {!loading && interviewList.length === 0 ?
        <EmptyState />
        :
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {interviewList.map((interview, index) => (
            <InterviewCard interviewDetail={interview} key={index} />
          ))}
        </div>
      }

      {loading && <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>}

    </div>
  );
}

export default Dashboard;
