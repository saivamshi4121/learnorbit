"use client";

import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

/**
 * Create Course Page Workspace
 * Placeholder for creating a new course.
 */
export default function CreateCoursePage() {
    const router = useRouter();

    const onSubmit = (data: any) => {
        // Implement create course logic here
        console.log("Creating course:", data);
        alert("Create Course functionality coming soon!");
        router.push('/instructor');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-textPrimary mb-2">
                        Create New Course
                    </h1>
                    <p className="text-mutedText">
                        Start building your next educational masterpiece.
                    </p>
                </div>

                <div className="bg-surface border border-borderLight rounded-lg p-6">
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-textPrimary mb-1">
                                Course Title
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-borderLight px-3 py-2 text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="e.g. Advanced React Patterns"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <SecondaryButton onClick={() => router.back()}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Create Draft
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
