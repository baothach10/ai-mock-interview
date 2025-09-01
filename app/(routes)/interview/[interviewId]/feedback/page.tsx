"use client";

import { useParams, useRouter } from "next/navigation";
import { useFeedback } from "@/context/FeedbackContext";
import Link from "next/link";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function FeedbackPage() {
    const { feedback } = useFeedback();
    const router = useRouter();
    const params = useParams()

    const updateStatus = useMutation(api.interviews.UpdateInterviewField)

    useEffect(() => {
        if (feedback) {
            updateStatus({
                interviewId: params.interviewId as string,
                field: 'status',
                value: 'complete'
            })
        }
    }, [feedback])

    if (!feedback) {
        return (
            <div className="flex flex-col justify-center items-center h-40 space-y-4">
                <p className="text-gray-500">No feedback available.</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Interview Feedback</h1>

            <div className="border rounded-2xl p-5 shadow-sm bg-white space-y-3">
                <p className="font-semibold text-lg">⭐ {feedback.rating}/10</p>
                <p className="text-gray-700">{feedback.feedback}</p>

                {feedback.suggestions?.length > 0 && (
                    <div>
                        <p className="font-medium text-gray-900">Suggestions:</p>
                        <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                            {feedback.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Link
                    href='/dashboard'
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Create New Interview
                </Link>
            </div>
        </div>
    );
}
