"use client";

import { X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

export function CourseCompletionModal({ isOpen, onClose, courseId }: Props) {
    const router = useRouter();
    if (!isOpen) return null;

    const handleDashboard = () => {
        router.push('/dashboard');
        onClose();
    };

    const handleReview = () => {
        router.push(`/learn/${courseId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Course Completed.
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={false}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">You have finished all lessons in this course.</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleDashboard}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                    <button
                        onClick={handleReview}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Review Lessons
                    </button>
                </div>
            </div>
        </div>
    );
}
