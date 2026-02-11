"use client";

import { useParams, useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

/**
 * Edit Course Page Workspace
 * Placeholder for editing an existing course.
 */
export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const { courseId } = params;

    const onUpdate = (data: any) => {
        // Implement save changes logic here
        console.log("Saving changes for course:", courseId);
        alert("Edit functionality coming soon!");
        router.push('/instructor');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-textPrimary mb-1">
                            Edit Course: {courseId}
                        </h1>
                        <p className="text-sm text-mutedText">
                            Make changes to your course content and settings.
                        </p>
                    </div>
                </div>

                <div className="bg-surface border border-borderLight rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-mutedText mb-4">Course editor content area</p>
                        <div className="flex gap-4 justify-center">
                            <SecondaryButton onClick={() => router.back()}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton onClick={() => onUpdate({})}>
                                Save Changes
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
