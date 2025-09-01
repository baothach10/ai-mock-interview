'use client'

import { useGSAP } from "@gsap/react";
import { gsap } from 'gsap'
import { InterviewSession } from '@/app/(routes)/dashboard/page';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { FeedbackData } from '@/types';
import { useConvex } from 'convex/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

function InterviewDetailedInformation() {
    const convex = useConvex();
    const params = useParams();

    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>();
    const [interview, setInterview] = useState<InterviewSession>();
    const [loading, setLoading] = useState<boolean>(true);

    // GSAP refs
    const containerRef = useRef<HTMLDivElement>(null);
    const feedbacksRef = useRef<HTMLDivElement>(null);

    // GSAP animation
    useGSAP(() => {
        if (!loading && containerRef.current) {
            const tl = gsap.timeline();
            tl.from(containerRef.current.children, {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }, [loading]);

    useEffect(() => {
        if (!params.interviewId) return;

        const fetchData = async () => {
            setLoading(true);
            const [feedbacksResult, interviewResult] = await Promise.all([
                convex.query(api.feedbacks.GetFeedbacksByInterview, { interviewId: params.interviewId as string }),
                convex.query(api.interviews.GetInterviewDetail, { interviewId: params.interviewId as string })
            ]);
            setFeedbacks(feedbacksResult);
            setInterview(interviewResult);
            setLoading(false);
        };

        fetchData();
    }, [params.interviewId]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8 bg-white text-black">
                {/* Skeletons here */}
            </div>
        );
    }

    if (!loading && !interview) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                <p className="text-white text-lg">Interview data is not available.</p>
                <Link href="/dashboard">
                    <Button variant={'outline'} className="self-start mt-4">
                        <ArrowLeft /> Back to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="max-w-5xl mx-auto p-6 flex flex-col gap-8 bg-white text-black">
            {/* Interview Info */}
            <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold border-b border-gray-300 pb-2 mb-4">Interview Details</h2>
                <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col gap-4">
                    <p><span className="font-semibold">Status:</span> {interview?.status || "N/A"}</p>
                    {interview?._creationTime && (
                        <p className="text-sm text-gray-400">
                            Created on: {new Date(interview._creationTime).toLocaleDateString(undefined, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            })}
                        </p>
                    )}
                    {interview?.jobTitle && <p><span className="font-semibold">Job Title:</span> {interview.jobTitle}</p>}
                    {interview?.jobDescription && <p><span className="font-semibold">Job Description:</span> {interview.jobDescription}</p>}
                    {interview?.resumeUrl && (
                        <p><span className="font-semibold">Resume:</span>{" "}
                            <a href={interview.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                View Resume
                            </a>
                        </p>
                    )}
                    <div>
                        <h3 className="font-semibold text-xl border-b border-gray-300 pb-1 mt-4 mb-2">Interview Questions:</h3>
                        {interview?.interviewQuestions?.length ? (
                            <ol className="list-decimal list-inside space-y-2">
                                {interview.interviewQuestions.map((q, i) => <li key={i}>{q.question}</li>)}
                            </ol>
                        ) : <p>No questions available.</p>}
                    </div>
                </div>
            </div>

            {/* Feedbacks */}
            <div ref={feedbacksRef} className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold border-b border-gray-300 pb-2 mb-4">Feedbacks</h2>

                {!feedbacks || feedbacks.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-5'>
                        <p className="text-gray-500 text-center">No feedbacks available yet.</p>
                        <Link href={`/interview/${params.interviewId}/start`}>
                            <Button>Start Interview <ArrowRight /></Button>
                        </Link>
                    </div>
                ) : (
                    feedbacks.map((f) => (
                        <div key={f._id} className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 flex flex-col gap-3">
                            {f._creationTime && <p className="text-sm text-gray-400">Available on: {new Date(f._creationTime).toLocaleDateString()}</p>}
                            <p><span className="font-semibold">Feedback:</span> {f.feedback || "N/A"}</p>
                            <p><span className="font-semibold">Rating:</span> ⭐ {f.rating ?? "N/A"} / 10</p>
                            {f.suggestions?.length ? (
                                <div>
                                    <span className="font-semibold">Suggestions:</span>
                                    <ol className="list-decimal list-inside mt-1 space-y-2">
                                        {f.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                                    </ol>
                                </div>
                            ) : <p>No suggestions.</p>}
                        </div>
                    ))
                )}
            </div>

            {/* Back Button */}
            <Link href="/dashboard">
                <Button variant={'outline'} className="self-start mt-4"><ArrowLeft /> Back to Dashboard</Button>
            </Link>
        </div>
    );
}

export default InterviewDetailedInformation;
