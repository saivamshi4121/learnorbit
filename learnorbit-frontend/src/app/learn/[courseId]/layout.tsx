"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
    LessonProvider,
    LessonSidebar,
    MobileSidebar,
    LessonHeader,
    useLessonContext
} from "@/components/learn";

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const courseId = params.courseId as string;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <LessonProvider courseId={courseId}>
            <LayoutContent mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
                {children}
            </LayoutContent>
        </LessonProvider>
    );
}

function LayoutContent({
    children,
    mobileOpen,
    setMobileOpen
}: {
    children: React.ReactNode;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}) {
    const { sidebarCollapsed } = useLessonContext();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <LessonHeader />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed bottom-6 right-6 z-30 lg:hidden w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Sidebar (Desktop) */}
            <LessonSidebar />

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            {/* Main Content */}
            <main
                className={`pt-14 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:pl-16" : "lg:pl-72"
                    }`}
            >
                <div className="px-6 lg:px-12 py-10 max-w-[1200px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
