import { BookOpen, User, Clock } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface CourseHeroProps {
    course: {
        title: string;
        tagline: string;
        instructor: string;
        is_free: boolean;
        price: number | null;
        duration: string;
        thumbnail_url: string | null;
    };
    onEnroll: () => void;
    isEnrolling?: boolean;
}

export function CourseHero({ course, onEnroll, isEnrolling }: CourseHeroProps) {
    return (
        <section className="bg-primary/[0.02] border-b border-borderLight">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div className="order-2 lg:order-1">
                        {/* Instructor Badge */}
                        <div className="inline-flex items-center gap-2 bg-surface border border-borderLight rounded-full px-3 py-1.5 mb-6">
                            <User className="h-3.5 w-3.5 text-mutedText" />
                            <span className="text-xs font-medium text-mutedText">
                                {course.instructor}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-semibold text-textPrimary mb-4 tracking-tight leading-tight">
                            {course.title}
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg text-mutedText mb-8 leading-relaxed max-w-xl">
                            {course.tagline}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {/* Price Badge */}
                            <div className="flex items-center gap-2">
                                {course.is_free ? (
                                    <span className="text-2xl font-semibold text-success">Free</span>
                                ) : (
                                    <span className="text-2xl font-semibold text-textPrimary">
                                        ₹{course.price?.toFixed(0)}
                                    </span>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-1.5 text-sm text-mutedText">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration}</span>
                            </div>
                        </div>

                        {/* Enroll Button */}
                        <PrimaryButton
                            onClick={onEnroll}
                            disabled={isEnrolling}
                            className="px-8 py-3 text-base"
                        >
                            {isEnrolling ? "Enrolling..." : "Enroll Now"}
                        </PrimaryButton>

                        {/* Trust Message */}
                        <p className="text-xs text-mutedText mt-4">
                            30-day money-back guarantee · Lifetime access
                        </p>
                    </div>

                    {/* Right: Thumbnail */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-surface rounded-xl shadow-md border border-borderLight overflow-hidden">
                            <div className="aspect-video bg-primary/5 flex items-center justify-center">
                                <BookOpen className="h-20 w-20 text-primary/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
