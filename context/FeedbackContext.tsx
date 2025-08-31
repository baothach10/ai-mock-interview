"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Feedback = {
    feedback: string;
    rating: number;
    suggestions: string[];
};

type FeedbackResponse = {
    data: string; // raw JSON string
    success: boolean;
};

type FeedbackContextType = {
    feedback: Feedback | null;
    setFeedback: (feedback: Feedback) => void;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
    const [feedback, setFeedbackState] = useState<Feedback | null>(null);

    // helper to parse JSON string if the API returns as string
    const setFeedback = (rawFeedback: Feedback | FeedbackResponse) => {
        if ("data" in rawFeedback) {
            try {
                const parsed = JSON.parse(rawFeedback.data) as Feedback;
                setFeedbackState(parsed);
            } catch (e) {
                console.error("Invalid feedback data format:", e);
            }
        } else {
            setFeedbackState(rawFeedback);
        }
    };

    return (
        <FeedbackContext.Provider value={{ feedback, setFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error("useFeedback must be used within a FeedbackProvider");
    }
    return context;
};
