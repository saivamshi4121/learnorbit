"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Play,
    FileText,
    File,
    ExternalLink,
    Check,
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle
} from "lucide-react";
import { useLessonContext, Lesson } from "./LessonContext";
import { CourseCompletionModal } from "./CourseCompletionModal";

/* ============================================
   TYPE CONFIG
   ============================================ */
const typeConfig = {
    video: { icon: Play, label: "Video", bg: "bg-red-50", text: "text-red-600" },
    text: { icon: FileText, label: "Article", bg: "bg-blue-50", text: "text-blue-600" },
    pdf: { icon: File, label: "PDF", bg: "bg-orange-50", text: "text-orange-600" },
    link: { icon: ExternalLink, label: "Link", bg: "bg-purple-50", text: "text-purple-600" },
};

export function LessonContent() {
    const [showCourseCompleteModal, setShowCourseCompleteModal] = useState(false);
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const lessonId = parseInt(params.lessonId as string);

    const {
        course,
        allLessons,
        completedLessons,
        markComplete,
        isCompleted,
        progress,
    } = useLessonContext();

    const currentLesson = allLessons.find((l) => l.id === lessonId);
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const currentModule = course?.modules.find((m) =>
        m.lessons.some((l) => l.id === lessonId)
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [lessonId]);

    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    if (!currentLesson) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Lesson not found</p>
            </div>
        );
    }

    const completed = isCompleted(lessonId);
    const TypeIcon = typeConfig[currentLesson.type].icon;

    const handleComplete = async () => {
        await markComplete(lessonId);
        const newProgress = Math.round(((completedLessons.length + 1) / allLessons.length) * 100);
        if (newProgress === 100) {
            setShowCourseCompleteModal(true);
        } else if (nextLesson) {
            setTimeout(() => {
                router.push(`/learn/${courseId}/${nextLesson.id}`);
            }, 600);
        }
    };

    return (
        <>
            <article className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>{currentModule?.title}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-400">
                        {currentIndex + 1} of {allLessons.length}
                    </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${typeConfig[currentLesson.type].bg} ${typeConfig[currentLesson.type].text}`}>
                        <TypeIcon className="h-3 w-3" />
                        {typeConfig[currentLesson.type].label}
                    </span>
                    {currentLesson.duration && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {currentLesson.duration}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-8 leading-tight">
                    {currentLesson.title}
                </h1>

                {/* Content */}
                <div className="mb-10">
                    {currentLesson.type === "video" && <VideoContent lesson={currentLesson} />}
                    {currentLesson.type === "text" && <TextContent lesson={currentLesson} />}
                    {currentLesson.type === "pdf" && <PDFContent lesson={currentLesson} />}
                    {currentLesson.type === "link" && <LinkContent lesson={currentLesson} />}
                </div>

                {/* Mark Complete */}
                <div className="py-6 border-t border-gray-100">
                    {completed ? (
                        <div className="inline-flex items-center gap-2 text-sm text-green-700">
                            <Check className="h-4 w-4" />
                            <span>Completed</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                            <Check className="h-4 w-4" />
                            Mark complete
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="py-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        {prevLesson ? (
                            <Link
                                href={`/learn/${courseId}/${prevLesson.id}`}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextLesson ? (
                            <Link
                                href={`/learn/${courseId}/${nextLesson.id}`}
                                className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors"
                            >
                                <span>Next: {nextLesson.title}</span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span className="text-sm text-green-600 font-medium">
                                Course complete
                            </span>
                        )}
                    </div>
                </div>
            </article>
            {showCourseCompleteModal && (
                <CourseCompletionModal
                    isOpen={showCourseCompleteModal}
                    onClose={() => setShowCourseCompleteModal(false)}
                    courseId={courseId}
                />
            )}
        </>
    );
}

/* ============================================
   VIDEO CONTENT
   ============================================ */
function VideoContent({ lesson }: { lesson: Lesson }) {
    if (!lesson.embed_url) {
        return (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <span className="text-sm">No video URL provided</span>
            </div>
        );
    }

    return (
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <iframe
                src={lesson.embed_url}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

/* ============================================
   TEXT CONTENT
   ============================================ */
function TextContent({ lesson }: { lesson: Lesson }) {
    return (
        <div className="prose prose-gray max-w-none">
            {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            ) : (
                <p className="text-gray-500 italic">No content available for this lesson.</p>
            )}
        </div>
    );
}

/* ============================================
   PDF CONTENT
   ============================================ */
function PDFContent({ lesson }: { lesson: Lesson }) {
    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <File className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 mb-1">{lesson.title}.pdf</h3>
                    <p className="text-sm text-gray-500 mb-4">Download or view the PDF document</p>
                    <a
                        href={lesson.content || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open PDF
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ============================================
   LINK CONTENT
   ============================================ */
function LinkContent({ lesson }: { lesson: Lesson }) {
    return (
        <div className="bg-purple-50 rounded-lg border border-purple-100 p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 mb-1">External Resource</h3>
                    <p className="text-sm text-gray-500 mb-4">This links to additional learning materials</p>
                    <a
                        href={lesson.content || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open Resource
                    </a>
                </div>
            </div>
        </div>
    );
}
