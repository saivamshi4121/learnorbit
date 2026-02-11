"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { createCourse } from '@/lib/services/instructor.service';
import { toast } from 'sonner';

/**
 * Create Course Page Workspace
 */
export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');

    const onSubmit = async () => {
        if (!title.trim()) {
            toast.error("Please enter a course title");
            return;
        }

        try {
            setLoading(true);
            const res: any = await createCourse({ title });
            if (res.success) {
                toast.success("Course created successfully");
                // Redirect to edit page
                router.push(`/instructor/courses/${res.data.id}/edit`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to create course");
        } finally {
            setLoading(false);
        }
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
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-textPrimary mb-1">
                                Course Title
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-borderLight px-3 py-2 text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="e.g. Advanced React Patterns"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <SecondaryButton onClick={() => router.back()} type="button">
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Draft"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
