"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function Interview() {
  const { interviewId } = useParams();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center mt-10">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <Image
          src="/interview.svg"
          alt="Interview Illustration"
          width={400}
          height={200}
          className="w-3xl h-[350px] object-cover object-top"
        />
        <div className="p-6 flex flex-col items-center space-y-5">
          <h2 className="text-3xl font-bold text-center">
            Ready To Start Interview?
          </h2>
          <p className="text-gray-500 text-center">
            The interview will last approximately 30 minutes. Make sure you are
            in a quiet environment with a stable internet connection.
          </p>
          <Link href={`/interview/${interviewId}/start`}>
            <Button>
              Start Interview <ArrowRight />{" "}
            </Button>
          </Link>
          <hr />
          <div className="p-6 bg-gray-50 rounded-2xl">
            <h2 className="font-semibold text-2xl">
              Want to sent interview to link to someone?
            </h2>
            <div className="flex gap-5 w-full items-center max-w-xl mt-2">
              <Input placeholder="Enter email address" className="w-full" />
              <Button>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
