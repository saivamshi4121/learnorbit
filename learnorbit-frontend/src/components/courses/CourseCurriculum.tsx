"use client";

import { useState } from "react";
import { Video, FileText, Link as LinkIcon, File, ChevronDown } from "lucide-react";

interface Lesson {
    id: number;
    title: string;
    type: "video" | "text" | "pdf" | "link";
    duration?: string;
    description?: string;
}

interface CourseCurriculumProps {
    lessons: Lesson[];
    loading?: boolean;
}

const typeIcons = {
    video: Video,
    text: FileText,
    pdf: File,
    link: LinkIcon,
};

const typeLabels = {
    video: "Video",
    text: "Article",
    pdf: "PDF",
    link: "External Link",
};

export function CourseCurriculum({ lessons }: CourseCurriculumProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <section className="py-16">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-textPrimary mb-2 tracking-tight">
                    Course Curriculum
                </h2>
                <p className="text-sm text-mutedText">
                    {lessons.length} lessons · Structured learning path
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-borderLight" />

                {/* Lessons */}
                <div className="space-y-4">
                    {lessons.map((lesson, index) => {
                        const Icon = typeIcons[lesson.type];
                        const isExpanded = expandedId === lesson.id;
                        const isLast = index === lessons.length - 1;

                        return (
                            <div key={lesson.id} className="relative pl-12">
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-4 w-8 h-8 rounded-full bg-surface border-2 border-borderLight flex items-center justify-center z-10">
                                    <span className="text-xs font-semibold text-mutedText">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Connector Line (not on last item) */}
                                {!isLast && (
                                    <div className="absolute left-4 top-12 -translate-x-1/2 w-px h-[calc(100%-1rem)] bg-borderLight" />
                                )}

                                {/* Lesson Card */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : lesson.id)}
                                    className="w-full text-left bg-surface border border-borderLight rounded-xl p-5 hover:shadow-md transition-shadow duration-200 group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Type Badge */}
                                            <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary px-2.5 py-1 rounded-md text-xs font-medium mb-3">
                                                <Icon className="h-3 w-3" />
                                                <span>{typeLabels[lesson.type]}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base font-medium text-textPrimary mb-1 group-hover:text-primary transition-colors">
                                                {lesson.title}
                                            </h3>

                                            {/* Duration */}
                                            {lesson.duration && (
                                                <p className="text-xs text-mutedText">
                                                    {lesson.duration}
                                                </p>
                                            )}
                                        </div>

                                        {/* Expand Icon */}
                                        <ChevronDown
                                            className={`h-5 w-5 text-mutedText transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>

                                    {/* Expandable Content */}
                                    {isExpanded && lesson.description && (
                                        <div className="mt-4 pt-4 border-t border-borderLight">
                                            <p className="text-sm text-mutedText leading-relaxed">
                                                {lesson.description}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
