"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Loader2 } from "lucide-react";
import axios from "axios";
import { CourseHero } from "@/components/courses/CourseHero";
import { CourseInfoCard } from "@/components/courses/CourseInfoCard";
import { CourseAbout } from "@/components/courses/CourseAbout";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { isAuthenticated } from "@/lib/auth";
import { EnrollmentModal } from "@/components/courses/EnrollmentModal";

// Interface matching backend response + UI needs
interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    is_free?: boolean;
    price?: number;
    instructor?: string; // Placeholder for now
    duration?: string;
    level?: string;
    enrolled_count?: number;
    learning_outcomes?: any[];
    lessons?: any[];
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Enrollment state
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                // Fetch course details
                const { data } = await axios.get(`/api/courses/${courseId}`);

                // Transform/enrich data for UI
                const courseData = {
                    ...data.data,
                    // Defaults for missing backend fields
                    instructor: "LearnOrbit Instructor",
                    duration: "Self-paced",
                    level: "All Levels",
                    enrolled_count: 0,
                    learning_outcomes: [], // Backend doesn't provide this yet
                    lessons: [], // Backend doesn't provide public lessons yet
                    is_free: !data.data.price || data.data.price === 0,
                };

                setCourse(courseData);

                // Check if already enrolled (if logged in)
                if (isAuthenticated()) {
                    try {
                        const enrollRes = await axios.get(`/api/v1/enrollments/status/${courseId}`);
                        if (enrollRes.data.status === 'active' || enrollRes.data.status === 'approved') {
                            setIsEnrolled(true);
                        }
                    } catch (e) {
                        // Ignore 404/403 for enrollment check
                    }
                }

            } catch (err: any) {
                console.error("Failed to fetch course:", err);
                setError(err.response?.data?.message || "Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const handleEnrollClick = () => {
        if (!isAuthenticated()) {
            toast.info("Please log in to enroll");
            router.push(`/login?redirect=/courses/${courseId}`);
            return;
        }

        if (isEnrolled) {
            router.push(`/learn/${courseId}`);
            return;
        }

        // Determine if we need confirmation (paid) or direct enroll (free)
        if (course?.is_free) {
            performEnrollment();
        } else {
            setShowEnrollmentModal(true);
        }
    };

    const performEnrollment = async () => {
        if (!course) return;

        setIsEnrolling(true);
        try {
            const { data } = await axios.post('/api/v1/enrollments', {
                courseId: course.id
            });

            if (data.success) {
                setIsEnrolled(true);
                setShowEnrollmentModal(false);

                if (data.data.status === 'active') {
                    toast.success("Successfully enrolled!");
                    router.push(`/learn/${course.id}`);
                } else {
                    toast.success("Enrollment pending approval.");
                }
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || "Enrollment failed";
            if (err.response?.status === 403) {
                toast.error("You are not authorized to enroll.");
            } else if (err.response?.status === 400) {
                // Already enrolled or other bad request
                if (msg.includes("already enrolled")) {
                    setIsEnrolled(true);
                    toast.info("You are already enrolled.");
                    router.push(`/learn/${course.id}`);
                } else {
                    toast.error(msg);
                }
            } else {
                toast.error(msg);
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Course Not Found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
                    {error || "The course you're looking for doesn't exist or has been removed."}
                </p>
                <button
                    onClick={() => router.push('/courses')}
                    className="text-primary hover:underline"
                >
                    Browse all courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Enrollment Modal */}
            <EnrollmentModal
                isOpen={showEnrollmentModal}
                onClose={() => setShowEnrollmentModal(false)}
                onConfirm={performEnrollment}
                title={course.title}
                price={course.price}
                isLoading={isEnrolling}
            />

            {/* Hero Section */}
            <CourseHero
                course={{
                    title: course.title,
                    tagline: course.description.substring(0, 150) + "...", // Fallback for tagline
                    instructor: course.instructor || "Instructor",
                    is_free: course.is_free || false,
                    price: course.price || 0,
                    duration: course.duration || "Self-paced",
                    thumbnail_url: course.thumbnail_url,
                }}
                onEnroll={handleEnrollClick}
                isEnrolling={isEnrolling}
                isEnrolled={isEnrolled}
            />

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: About & Curriculum */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* About Section */}
                        <CourseAbout
                            description={course.description}
                            learning_outcomes={course.learning_outcomes || []}
                        />

                        {/* Curriculum Section */}
                        {/* Only show if lessons are available (e.g. public or mock) */}
                        <CourseCurriculum lessons={course.lessons || []} />
                    </div>

                    {/* Right: Info Card (Sticky) */}
                    <div>
                        <CourseInfoCard
                            course={{
                                total_lessons: course.lessons?.length || 0,
                                level: course.level || "All Levels",
                                is_free: course.is_free || false,
                                enrolled_count: course.enrolled_count || 0,
                            }}
                            isEnrolled={isEnrolled}
                            onEnroll={handleEnrollClick}
                            isEnrolling={isEnrolling}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
