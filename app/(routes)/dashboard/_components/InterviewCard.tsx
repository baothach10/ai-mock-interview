import React from 'react'
import { InterviewSession } from '../page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
    interviewDetail: InterviewSession
}

function InterviewCard({ interviewDetail }: Props) {
    return (
        <div className="p-4 border rounded-xl flex flex-col justify-between">
            <h2 className="font-semibold text-xl flex justify-between items-center">
                {interviewDetail.resumeUrl ? "Resume Interview" : interviewDetail.jobTitle}
                <Badge>{interviewDetail.status}</Badge>
            </h2>

            {/* Date */}
            <p className="text-sm text-gray-400 mt-1">
                Created on: {new Date(interviewDetail._creationTime).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                })}
            </p>

            <p className="line-clamp-2 text-gray-500 mt-2">
                {interviewDetail.resumeUrl
                    ? "We generated the interview from the resume"
                    : interviewDetail.jobDescription}
            </p>

            <div className="mt-5 flex justify-between items-center">
                <Link href={"/interview/" + interviewDetail._id + "/detailed"}>
                    <Button>View Detail</Button>
                </Link>
                <Link href={"/interview/" + interviewDetail._id}>
                    <Button variant={"outline"}>
                        Start Interview <ArrowRight />
                    </Button>
                </Link>
            </div>
        </div>

    )
}

export default InterviewCard