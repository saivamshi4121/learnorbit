"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LessonSidebar, Module, Lesson } from "./LessonSidebar";

interface MobileSidebarProps {
    modules: Module[];
    activeLesson: number;
    onSelectLesson: (lessonId: number) => void;
}

export function MobileSidebar({ modules, activeLesson, onSelectLesson }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (lessonId: number) => {
        onSelectLesson(lessonId);
        setIsOpen(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-40 lg:hidden bg-gray-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Course Content</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-500 hover:text-gray-900"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-56px)]">
                    <nav className="py-4">
                        {modules.map((module, moduleIndex) => (
                            <div key={module.id} className="mb-2">
                                <div className="px-4 py-3">
                                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                                        Module {moduleIndex + 1}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {module.title}
                                    </p>
                                </div>

                                <div className="ml-4 border-l border-gray-100">
                                    {module.lessons.map((lesson) => {
                                        const isActive = lesson.id === activeLesson;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleSelect(lesson.id)}
                                                className={`w-full text-left pl-4 pr-4 py-2.5 text-sm transition-colors relative ${isActive
                                                        ? "text-primary bg-primary/5"
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                                                )}

                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${lesson.completed
                                                            ? "bg-green-500"
                                                            : isActive
                                                                ? "bg-primary"
                                                                : "bg-gray-300"
                                                        }`} />
                                                    <span className="truncate">{lesson.title}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
