"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLessonContext } from "@/components/learn/LessonContext";
import { Loader2 } from "lucide-react";

export default function LearnCoursePage() {
    const router = useRouter();
    const { resumeLessonId, isLoading, course } = useLessonContext();

    useEffect(() => {
        if (!isLoading && course) {
            if (resumeLessonId) {
                router.replace(`/learn/${course.id}/${resumeLessonId}`);
            } else {
                // Determine fallback if no resumeLessonId (e.g. course fully complete or just starting and somehow resumeLessonId null)
                // If starting fresh, resumeLessonId should be first lesson (backend logic handles this usually, but my backend logic for resumeLessonId is "first incomplete"). 
                // If all complete, resumeLessonId is last lesson.
                // So resumeLessonId should usually be set.
                // If null, maybe empty course?
                const firstLesson = course.modules?.[0]?.lessons?.[0];
                if (firstLesson) {
                    router.replace(`/learn/${course.id}/${firstLesson.id}`);
                }
            }
        }
    }, [isLoading, resumeLessonId, course, router]);

    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm font-medium">Loading your progress...</p>
            </div>
        </div>
    );
}
