"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Globe, Lock, UserCheck, BookOpen, Edit2, Trash2, Users, FileText, ChevronRight, Search } from "lucide-react";
import { listCourses, deleteCourse } from "@/lib/services/institute.service";
import type { InstituteCourse } from "@/lib/services/institute.service";
import { getCurrentUser } from "@/lib/auth";

const VISIBILITY = {
    public: { icon: Globe, label: "Public", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    private: { icon: Lock, label: "Private", cls: "text-slate-500  bg-slate-100  border-slate-200" },
    selected: { icon: UserCheck, label: "Selected", cls: "text-blue-600   bg-blue-50    border-blue-200" },
};

export default function InstituteCoursesPage() {
    const [courses, setCourses] = useState<InstituteCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const load = () => {
        // Guard: only fire API call if confirmed institute_admin
        const user = getCurrentUser();
        if (!user || user.role !== "institute_admin") {
            setLoading(false);
            return;
        }
        setLoading(true);
        listCourses()
            .then(r => { if (r.success) setCourses(r.data); })
            .catch(() => toast.error("Failed to load courses"))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeleting(id);
        try {
            await deleteCourse(id);
            toast.success("Course deleted");
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch {
            toast.error("Failed to delete course");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{courses.length} course{courses.length !== 1 ? "s" : ""} total</p>
                </div>
                <Link
                    href="/institute/courses/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 self-start"
                >
                    <Plus className="w-4 h-4" /> New Course
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-sm"
                />
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse">
                            <div className="h-5 bg-slate-100 rounded mb-3 w-3/4" />
                            <div className="h-3 bg-slate-100 rounded mb-2 w-full" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <BookOpen className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No courses found</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {search ? "Try a different search term" : "Create your first course to get started"}
                    </p>
                    {!search && (
                        <Link href="/institute/courses/create" className="mt-4 text-sm text-blue-600 hover:underline font-medium">
                            Create course →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(course => {
                        const vis = VISIBILITY[course.visibility_type];
                        return (
                            <div key={course.id} className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden flex flex-col">
                                {/* Card Top */}
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${vis.cls}`}>
                                            <vis.icon className="w-3 h-3" />
                                            {vis.label}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/institute/courses/${course.id}`}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course.id, course.title)}
                                                disabled={deleting === course.id}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-40"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 leading-snug mb-2 line-clamp-2">
                                        {course.title}
                                    </h3>
                                    {course.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            {course.content_count} items
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {course.student_count} students
                                        </span>
                                    </div>
                                    <Link
                                        href={`/institute/courses/${course.id}`}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"
                                    >
                                        Manage <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
