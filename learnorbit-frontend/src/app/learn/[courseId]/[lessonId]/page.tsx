"use client";

import { useLessonContext, LessonContent } from "@/components/learn";

export default function LessonPage() {
    const { allLessons } = useLessonContext();

    if (allLessons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Lesson...
                </h2>
                <p className="text-gray-500">
                    Fetching lesson content.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 max-w-[850px] mx-auto">
            <LessonContent />
        </div>
    );
}
