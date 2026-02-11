"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    BookOpen,
    X,
    PanelLeftClose,
    PanelLeft,
    ChevronDown,
    Play,
    FileText,
    File,
    ExternalLink,
    Check,
    Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLessonContext, Module, Lesson } from "./LessonContext";

/* ============================================
   TYPE CONFIG
   ============================================ */
const typeConfig = {
    video: { icon: Play, color: "text-red-500" },
    text: { icon: FileText, color: "text-blue-500" },
    pdf: { icon: File, color: "text-orange-500" },
    link: { icon: ExternalLink, color: "text-purple-500" },
};

/* ============================================
   SIDEBAR COMPONENT
   ============================================ */
export function LessonSidebar() {
    const params = useParams();
    const courseId = params.courseId as string;
    const lessonId = parseInt(params.lessonId as string);

    const {
        course,
        completedLessons,
        sidebarCollapsed,
        isLoading
    } = useLessonContext();

    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    // Initialize expanded modules once course is loaded
    useEffect(() => {
        if (course) {
            setExpandedModules(course.modules.map((m) => m.id));
        }
    }, [course]);

    // Show loading state
    if (isLoading || !course) {
        return (
            <aside
                className={`fixed top-14 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-200 z-20 ${sidebarCollapsed ? "w-16" : "w-72"
                    } hidden lg:block`}
            >
                <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded" />
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                    </div>
                </div>
            </aside>
        );
    }

    const toggleModule = (id: number) => {
        if (sidebarCollapsed) return;
        setExpandedModules((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Calculate lesson numbers globally
    let globalLessonIndex = 0;
    const lessonNumbers: Record<number, number> = {};
    course.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
            globalLessonIndex++;
            lessonNumbers[lesson.id] = globalLessonIndex;
        });
    });

    return (
        <aside
            className={`fixed top-14 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-200 z-20 ${sidebarCollapsed ? "w-16" : "w-72"
                } hidden lg:block`}
        >
            <div className="h-full overflow-y-auto">
                <nav className="py-4">
                    {course.modules.map((module, moduleIndex) => {
                        const isExpanded = expandedModules.includes(module.id) && !sidebarCollapsed;
                        const completedCount = module.lessons.filter((l) =>
                            completedLessons.includes(l.id)
                        ).length;

                        return (
                            <div key={module.id} className="relative">
                                {/* Vertical connecting line for collapsed state */}
                                {sidebarCollapsed && moduleIndex !== course.modules.length - 1 && (
                                    <div className="absolute left-1/2 bottom-0 top-10 w-px bg-gray-100 -ml-px z-0" />
                                )}

                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className={`relative z-10 w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${sidebarCollapsed ? "justify-center mb-2" : "mb-0"
                                        }`}
                                    title={sidebarCollapsed ? module.title : undefined}
                                >
                                    {/* Module Number */}
                                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold flex-shrink-0 ${completedCount === module.lessons.length
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {completedCount === module.lessons.length ? (
                                            <Check className="h-3.5 w-3.5" />
                                        ) : (
                                            moduleIndex + 1
                                        )}
                                    </span>

                                    {!sidebarCollapsed && (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {module.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {completedCount}/{module.lessons.length} complete
                                                </p>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Lessons */}
                                {isExpanded && (
                                    <div className="relative ml-7 border-l border-gray-100 my-1">
                                        {module.lessons.map((lesson) => {
                                            const isActive = lesson.id === lessonId;
                                            const isComplete = completedLessons.includes(lesson.id);
                                            const TypeIcon = typeConfig[lesson.type].icon;

                                            return (
                                                <Link
                                                    key={lesson.id}
                                                    href={`/learn/${courseId}/${lesson.id}`}
                                                    className={`relative block pl-4 pr-4 py-2 transition-colors rounded-r-md mr-2 ${isActive
                                                        ? "bg-blue-50 text-primary"
                                                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                                        }`}
                                                >
                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary -ml-px" />
                                                    )}

                                                    <div className="flex items-center gap-3">
                                                        {/* Status */}
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete
                                                            ? "bg-green-100 text-green-600"
                                                            : isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : "bg-gray-100 text-gray-400"
                                                            }`}>
                                                            {isComplete ? (
                                                                <Check className="h-2.5 w-2.5" />
                                                            ) : (
                                                                <TypeIcon className="h-2.5 w-2.5" />
                                                            )}
                                                        </div>

                                                        {/* Title */}
                                                        <span className={`text-sm truncate ${isActive ? "font-medium" : ""}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Collapsed Lessons */}
                                {sidebarCollapsed && (
                                    <div className="relative z-10 flex flex-col items-center gap-2 pb-4">
                                        {module.lessons.map((lesson) => {
                                            const isActive = lesson.id === lessonId;
                                            const isComplete = completedLessons.includes(lesson.id);

                                            return (
                                                <Link
                                                    key={lesson.id}
                                                    href={`/learn/${courseId}/${lesson.id}`}
                                                    className="relative group group-hover:z-20"
                                                    title={lesson.title}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isActive
                                                        ? "bg-primary text-white shadow-md scale-110"
                                                        : isComplete
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-white text-gray-400 border border-gray-200 hover:border-gray-300"
                                                        }`}>
                                                        {isComplete && !isActive ? (
                                                            <Check className="h-3 w-3" />
                                                        ) : (
                                                            lessonNumbers[lesson.id]
                                                        )}
                                                    </div>

                                                    {/* Tooltip on hover */}
                                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                                        {lesson.title}
                                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

/* ============================================
   MOBILE SIDEBAR
   ============================================ */
export function MobileSidebar({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const params = useParams();
    const courseId = params.courseId as string;
    const lessonId = parseInt(params.lessonId as string);

    const { course, completedLessons, isLoading } = useLessonContext();

    if (!isOpen) return null;

    // Show loading state
    if (isLoading || !course) {
        return (
            <>
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto">
                    <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                        <span className="font-medium text-gray-900">Course Content</span>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-gray-900 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="h-[calc(100%-3.5rem)] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded" />
                            <div className="w-24 h-4 bg-gray-200 rounded" />
                        </div>
                    </div>
                </aside>
            </>
        );
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Course Content</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-500 hover:text-gray-900 rounded"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <nav className="py-2">
                    {course.modules.map((module, moduleIndex) => {
                        const completedCount = module.lessons.filter((l) =>
                            completedLessons.includes(l.id)
                        ).length;

                        return (
                            <div key={module.id}>
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${completedCount === module.lessons.length
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {moduleIndex + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{module.title}</p>
                                            <p className="text-xs text-gray-500">{completedCount}/{module.lessons.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-7 border-l border-gray-100">
                                    {module.lessons.map((lesson) => {
                                        const isActive = lesson.id === lessonId;
                                        const isComplete = completedLessons.includes(lesson.id);
                                        const TypeIcon = typeConfig[lesson.type].icon;

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/learn/${courseId}/${lesson.id}`}
                                                onClick={onClose}
                                                className={`relative block pl-4 pr-4 py-2.5 ${isActive ? "bg-blue-50/50" : ""
                                                    }`}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary -ml-px" />
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center ${isComplete ? "bg-green-100" : "bg-gray-50"
                                                        }`}>
                                                        {isComplete ? (
                                                            <Check className="h-3 w-3 text-green-600" />
                                                        ) : (
                                                            <TypeIcon className={`h-3 w-3 ${typeConfig[lesson.type].color}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-sm ${isActive ? "font-medium text-primary" : "text-gray-700"
                                                        }`}>
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

/* ============================================
   HEADER
   ============================================ */
export function LessonHeader() {
    const {
        course,
        progress,
        sidebarCollapsed,
        toggleSidebar,
        isLoading
    } = useLessonContext();

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-30">
            <div className="h-full flex items-center justify-between px-4">
                {/* Left */}
                <div className="flex items-center gap-2">
                    {/* Sidebar Toggle (Desktop) */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? (
                            <PanelLeft className="h-5 w-5" />
                        ) : (
                            <PanelLeftClose className="h-5 w-5" />
                        )}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 ml-2">
                        <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                            <BookOpen className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm hidden sm:block">
                            LearnOrbit
                        </span>
                    </Link>

                    {/* Course Title - only show when loaded */}
                    {!isLoading && course && (
                        <>
                            <span className="text-gray-300 mx-2 hidden sm:block">/</span>
                            <span className="text-sm text-gray-600 truncate max-w-[200px] hidden sm:block">
                                {course.title}
                            </span>
                        </>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    {/* Progress - only show when loaded */}
                    {!isLoading && course ? (
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{progress}%</span>
                        </div>
                    ) : (
                        <div className="w-16 h-4 bg-gray-100 rounded animate-pulse hidden sm:block" />
                    )}

                    {/* Exit - only show when loaded */}
                    {!isLoading && course ? (
                        <Link
                            href={`/courses/${course.id}`}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <span className="hidden sm:block">Exit</span>
                            <X className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div className="w-12 h-4 bg-gray-100 rounded animate-pulse hidden sm:block" />
                    )}
                </div>
            </div>
        </header>
    );
}
