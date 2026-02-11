import { BookOpen, Users, Award, Unlock } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface CourseInfoCardProps {
    course: {
        total_lessons: number;
        level: string;
        is_free: boolean;
        enrolled_count: number;
    };
    isEnrolled: boolean;
    onEnroll: () => void;
    isEnrolling?: boolean;
}

export function CourseInfoCard({
    course,
    isEnrolled,
    onEnroll,
    isEnrolling,
}: CourseInfoCardProps) {
    return (
        <div className="bg-surface border border-borderLight rounded-xl p-6 lg:sticky lg:top-24">
            <h4 className="text-sm font-semibold text-textPrimary mb-6 uppercase tracking-wide">
                Course Details
            </h4>

            <div className="space-y-4 mb-6">
                {/* Lessons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-mutedText">Lessons</span>
                    </div>
                    <span className="text-sm font-medium text-textPrimary">
                        {course.total_lessons}
                    </span>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Award className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-mutedText">Level</span>
                    </div>
                    <span className="text-sm font-medium text-textPrimary capitalize">
                        {course.level}
                    </span>
                </div>

                {/* Access Type */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Unlock className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-mutedText">Access</span>
                    </div>
                    <span className="text-sm font-medium text-textPrimary">
                        {course.is_free ? "Free" : "Approval Required"}
                    </span>
                </div>

                {/* Enrolled Count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-mutedText">Enrolled</span>
                    </div>
                    <span className="text-sm font-medium text-textPrimary">
                        {course.enrolled_count.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-borderLight my-6" />

            {/* CTA */}
            {isEnrolled ? (
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium">
                        ✓ Already Enrolled
                    </div>
                </div>
            ) : (
                <PrimaryButton
                    onClick={onEnroll}
                    disabled={isEnrolling}
                    className="w-full py-3"
                >
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                </PrimaryButton>
            )}
        </div>
    );
}
