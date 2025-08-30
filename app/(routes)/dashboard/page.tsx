"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React from "react";
import EmptyState from "./EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = React.useState([]);
  return (
    <div className="py-20 px-10 md:px-28 lg:px-44">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold">Welcome, {user?.fullName}</h2>
        </div>
        <CreateInterviewDialog />
      </div>
      {interviewList.length === 0 && <EmptyState />}
    </div>
  );
}

export default Dashboard;
