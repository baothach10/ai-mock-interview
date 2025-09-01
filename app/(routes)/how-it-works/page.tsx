import React from 'react'
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function InstructionPage() {
    return (

        <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* Page Header */}
                <header className="text-center">
                    <h1 className="text-4xl font-bold mb-2">How to Use Our Services</h1>
                    <p className="text-gray-600">Step-by-step guide to navigate and make the most of the platform.</p>
                </header>

                {/* Getting Started Section */}
                <section className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">Getting Started</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Create an account or log in if you already have one.</li>
                        <li>Verify your email to activate your account.</li>
                        <li>Complete your profile for a personalized experience.</li>
                    </ol>
                </section>

                {/* Dashboard Section */}
                <section className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">Dashboard Overview</h2>
                    <p>The dashboard is your central hub. From here, you can:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>View your current tasks and interviews.</li>
                        <li>Access recent feedback and results.</li>
                        <li>Navigate to different sections like profile, settings, and support.</li>
                    </ul>
                </section>

                {/* Performing Actions Section */}
                <section className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">Performing Actions</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Click on an interview card to view details.</li>
                        <li>Use the &quot;Start Interview&quot; button to begin an interview session.</li>
                        <li>Provide feedback using the feedback form after completing tasks.</li>
                    </ol>
                </section>

                {/* Tips & Tricks Section */}
                <section className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">Tips & Tricks</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Keep your profile updated for the best experience.</li>
                        <li>Check notifications regularly to stay informed.</li>
                        <li>Review feedback thoroughly to improve performance.</li>
                    </ul>
                </section>

                {/* Back Button */}
                <div className="flex justify-start mt-4">
                    <Link href="/dashboard">
                        <Button variant={'outline'} className="self-start mt-4">
                            {" "} <ArrowLeft /> Back to Dashboard
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default InstructionPage