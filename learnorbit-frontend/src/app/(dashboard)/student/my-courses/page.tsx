"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    BookOpen, Globe, UserCheck, Lock, Search,
    FileText, ChevronRight, GraduationCap
} from "lucide-react";
import { getMyInstituteCourses } from "@/lib/services/institute.service";
import type { InstituteCourse } from "@/lib/services/institute.service";
import CourseAgent from "@/components/dashboard/CourseAgent";

const VISIBILITY = {
    public: { icon: Globe, label: "Public", cls: "text-emerald-600 bg-emerald-50" },
    private: { icon: Lock, label: "Private", cls: "text-slate-500 bg-slate-100" },
    selected: { icon: UserCheck, label: "Selected", cls: "text-blue-600 bg-blue-50" },
};

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<InstituteCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getMyInstituteCourses()
            .then(r => { if (r.success) setCourses(r.data); })
            .catch(() => toast.error("Failed to load your courses"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
                    </div>
                    <p className="text-sm text-slate-500 ml-12">
                        {courses.length
                            ? `You have access to ${courses.length} course${courses.length !== 1 ? "s" : ""}`
                            : "Courses assigned to you will appear here"}
                    </p>
                </div>

                <div className="flex items-center gap-3 md:ml-12">
                    <Link href="/dashboard/blogs">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow">
                            <FileText className="w-4 h-4" />
                            Manage My Blogs
                        </button>
                    </Link>
                </div>
            </div>

            {/* Search */}
            {courses.length > 3 && (
                <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search your courses..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 shadow-sm"
                    />
                </div>
            )}

            {/* Course Cards */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse">
                            <div className="h-32 bg-slate-100 rounded-xl mb-4" />
                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                            <div className="h-3 bg-slate-100 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-sky-50 flex items-center justify-center mb-5 border border-slate-200">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-1">
                        {search ? "No matching courses" : "No courses available yet"}
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xs">
                        {search
                            ? "Try a different search term"
                            : "Your instructor will assign courses to you. Check back soon!"}
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(course => {
                        const vis = VISIBILITY[course.visibility_type] || VISIBILITY.public;
                        return (
                            <Link
                                key={course.id}
                                href={`/student/courses/${course.id}`}
                                className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                            >
                                {/* Card banner */}
                                <div className="h-28 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 relative overflow-hidden flex-shrink-0">
                                    <div className="absolute inset-0 opacity-30"
                                        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                                    />
                                    <div className="absolute bottom-3 left-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${vis.cls}`}>
                                            <vis.icon className="w-3 h-3" />
                                            {vis.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    {course.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-3 flex-1">
                                            {course.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <FileText className="w-3.5 h-3.5" />
                                            {course.content_count} item{course.content_count !== 1 ? "s" : ""}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-blue-600 font-medium group-hover:gap-2 transition-all">
                                            Start Learning <ChevronRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* AI Course Agent */}
            <CourseAgent />
        </div>
    );
}
