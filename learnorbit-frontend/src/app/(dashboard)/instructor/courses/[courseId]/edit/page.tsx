"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import CourseForm from "@/components/instructor/CourseForm";
import Curriculum from "@/components/instructor/Curriculum";
import { getCourse } from "@/lib/services/instructor.service";
import { getInstructorLessons, Lesson } from "@/lib/services/lessons.service";
import { InstructorCourse } from "@/types/instructor";
import { toast } from "sonner";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<InstructorCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);

    // params.courseId might be string or string[]
    const courseId = params?.courseId as string;

    useEffect(() => {
        if (!courseId) return;

        const fetchData = async () => {

            try {
                setLoading(true);
                // Parallel fetch
                const [courseRes, lessonsRes] = await Promise.all([
                    getCourse(courseId),
                    getInstructorLessons(courseId)
                ]);

                if (courseRes.success) {
                    setCourse(courseRes.data);
                } else {
                    toast.error("Failed to load course");
                    router.push("/instructor/courses");
                    return;
                }

                if (lessonsRes.success) {
                    setLessons(lessonsRes.data);
                }

            } catch (error: any) {
                console.error("Error fetching data:", error);
                if (error?.response?.status === 403) {
                    toast.error("You do not have permission to edit this course");
                } else if (error?.response?.status === 404) {
                    toast.error("Course not found");
                } else {
                    toast.error("Failed to load course details");
                }
                router.push("/instructor/courses");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <CourseForm initialData={course} />
            <Curriculum courseId={courseId} initialLessons={lessons} />
        </div>
    );
}
