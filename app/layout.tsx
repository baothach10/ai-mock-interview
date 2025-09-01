import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackProvider } from "@/context/FeedbackContext";

export const metadata: Metadata = {
  title: "AI Mock Interview",
  description: "The AI Mock Interview Project is a full-stack Next.js app for practicing interviews with AI-generated questions, resume analysis, and interactive AI avatars. Powered by Convex, Clerk, Google Gemini, HeyGen, and GSAP for a seamless, engaging experience.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.className} antialiased`}
          cz-shortcut-listen="true"
        >
          <FeedbackProvider>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </FeedbackProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
