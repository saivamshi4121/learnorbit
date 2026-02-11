"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "@/lib/api";

/* ============================================
   TYPES
   ============================================ */
export interface Lesson {
    id: number;
    title: string;
    type: "video" | "text" | "pdf" | "link";
    duration?: string;
    content?: string;
    provider?: string;
    embed_url?: string;
}

export interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    modules: Module[];
}

interface LessonContextValue {
    course: Course | null;
    allLessons: Lesson[];
    completedLessons: number[];
    progress: number;
    sidebarCollapsed: boolean;
    isLoading: boolean;
    toggleSidebar: () => void;
    markComplete: (lessonId: number) => Promise<void>;
    isCompleted: (lessonId: number) => boolean;
    resumeLessonId: number | null;
}

/* ============================================
   CONTEXT
   ============================================ */
const LessonContext = createContext<LessonContextValue | null>(null);

export function useLessonContext() {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error("useLessonContext must be used within LessonProvider");
    }
    return context;
}

/* ============================================
   PROVIDER
   ============================================ */
export function LessonProvider({
    children,
    courseId,
}: {
    children: ReactNode;
    courseId: string;
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [resumeLessonId, setResumeLessonId] = useState<number | null>(null);

    // Fetch course data and progress
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const [courseRes, lessonsRes, progressRes] = await Promise.all([
                    api.get(`/v1/courses/${courseId}`),
                    api.get(`/v1/courses/${courseId}/lessons`),
                    api.get(`/v1/courses/${courseId}/progress`)
                ]);

                const courseDetails = courseRes.data.data;
                const lessonsData = lessonsRes.data.data || [];
                const progressData = progressRes.data.data;

                // Group lessons into a module
                const modules: Module[] = [{
                    id: 1,
                    title: "Course Content",
                    lessons: lessonsData.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        type: l.type,
                        content: l.content,
                        provider: l.provider,
                        embed_url: l.embed_url,
                        duration: l.duration || "10 min",
                    }))
                }];

                const courseData: Course = {
                    id: courseId,
                    title: courseDetails.title || "Course Title",
                    instructor: "Instructor Name", // Backend doesn't return this yet in course details for student
                    modules: modules
                };

                setCourse(courseData);
                setCompletedLessons(progressData.completedLessons || []);
                setResumeLessonId(progressData.resumeLessonId);
            } catch (error) {
                console.error("Failed to fetch lesson data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    const allLessons = course ? course.modules.flatMap((m) => m.lessons) : [];
    const progress = allLessons.length > 0
        ? Math.round((completedLessons.length / allLessons.length) * 100)
        : 0;

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed((prev) => !prev);
    }, []);

    const isCompleted = useCallback((lessonId: number) => {
        return completedLessons.includes(lessonId);
    }, [completedLessons]);

    const markComplete = useCallback(async (lessonId: number) => {
        if (completedLessons.includes(lessonId)) return;

        // Optimistic update
        setCompletedLessons((prev) => [...prev, lessonId]);

        try {
            await api.post(`/v1/lessons/${lessonId}/progress`, {
                completed: true,
                watch_percentage: 100
            });
        } catch (error) {
            console.error("Failed to mark complete:", error);
            // Rollback
            setCompletedLessons((prev) => prev.filter((id) => id !== lessonId));
        }
    }, [completedLessons]);

    return (
        <LessonContext.Provider
            value={{
                course,
                allLessons,
                completedLessons,
                progress,
                sidebarCollapsed,
                isLoading,
                toggleSidebar,
                markComplete,
                isCompleted,
                resumeLessonId,
            }}
        >
            {children}
        </LessonContext.Provider>
    );
}
