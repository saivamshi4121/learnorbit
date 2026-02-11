import Link from "next/link";
import { X, BookOpen } from "lucide-react";

interface LessonHeaderProps {
    courseTitle: string;
    progress: number;
    courseId: string;
}

export function LessonHeader({ courseTitle, progress, courseId }: LessonHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            {/* Main Header */}
            <div className="h-14 flex items-center justify-between px-4 lg:px-6">
                {/* Left: Logo + Course Title */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-900">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm hidden sm:block">LearnOrbit</span>
                    </Link>

                    <div className="h-5 w-px bg-gray-200" />

                    <h1 className="text-sm font-medium text-gray-700 truncate max-w-[200px] lg:max-w-md">
                        {courseTitle}
                    </h1>
                </div>

                {/* Right: Progress + Exit */}
                <div className="flex items-center gap-6">
                    {/* Progress */}
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                    </div>

                    {/* Exit */}
                    <Link
                        href={`/courses/${courseId}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
                    >
                        <span className="hidden sm:block">Exit</span>
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-0.5 bg-gray-100">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </header>
    );
}
