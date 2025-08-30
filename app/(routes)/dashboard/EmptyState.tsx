import Image from "next/image";
import React from "react";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";

function EmptyState() {
  return (
    <div className="mt-14 flex flex-col items-center justify-center gap-5 border-4 rounded-2xl border-dashed border-gray-300 p-10 bg-gray-50">
      <Image src="/interview.svg" alt="Empty State" width={400} height={400} />
      <h2 className="mt-2 text-lg text-gray-500">
        You do not have any interviews created
      </h2>
      <CreateInterviewDialog/>
    </div>
  );
}

export default EmptyState;
