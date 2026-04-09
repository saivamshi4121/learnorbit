"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    BookOpen, Users, Mail, TrendingUp, Plus,
    Globe, Lock, UserCheck, Eye, ChevronRight,
    BarChart3, Clock
} from "lucide-react";
import { getStats, listCourses } from "@/lib/services/institute.service";
import type { InstituteStats, InstituteCourse } from "@/lib/services/institute.service";
import { getCurrentUser } from "@/lib/auth";
import { get } from "@/lib/api";

export default function InstituteDashboardPage() {
    const [stats, setStats] = useState<InstituteStats | null>(null);
    const [courses, setCourses] = useState<InstituteCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [insight, setInsight] = useState<string | null>(null);
    const [insightLoading, setInsightLoading] = useState(true);
    const [insightError, setInsightError] = useState<string | null>(null);

    useEffect(() => {
        // Guard: only fire API calls if the current user is actually an institute_admin.
        // The layout will handle the redirect; this prevents premature 403s during hydration.
        const user = getCurrentUser();
        if (!user || user.role !== "institute_admin") {
            setLoading(false);
            return;
        }

        Promise.all([getStats(), listCourses()])
            .then(([statsRes, coursesRes]) => {
                if (statsRes.success) setStats(statsRes.data);
                if (coursesRes.success) setCourses(coursesRes.data.slice(0, 5));
            })
            .catch(() => toast.error("Failed to load dashboard"))
            .finally(() => setLoading(false));
            
        // Fetch AI Insight
        get<{ insight: string }>("/ai/insights")
            .then((res) => setInsight(res.insight))
            .catch(() => setInsightError("Failed to load AI insight at this time."))
            .finally(() => setInsightLoading(false));
    }, []);

    const visibilityConfig = {
        public: { icon: Globe, label: "Public", color: "text-emerald-500 bg-emerald-50" },
        private: { icon: Lock, label: "Private", color: "text-slate-500  bg-slate-100" },
        selected: { icon: UserCheck, label: "Selected", color: "text-blue-500   bg-blue-50" },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Institute Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your courses, students, and access control</p>
                </div>
                <Link
                    href="/institute/courses/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" />
                    New Course
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: BookOpen, label: "Total Courses", value: stats?.total_courses, color: "from-blue-500 to-blue-600" },
                    { icon: Eye, label: "Published", value: stats?.published_courses, color: "from-emerald-500 to-emerald-600" },
                    { icon: Users, label: "Students", value: stats?.total_students, color: "from-violet-500 to-violet-600" },
                    { icon: Mail, label: "Pending Invites", value: stats?.pending_invites, color: "from-amber-500 to-amber-600" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {loading ? <span className="animate-pulse text-slate-300">—</span> : (stat.value ?? 0)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* AI Insight Card */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl border border-purple-200/60 shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm">AI</span>
                        </div>
                        <h3 className="text-lg font-semibold text-purple-900">AI Insight</h3>
                    </div>
                    {insightLoading ? (
                        <div className="animate-pulse flex space-x-4 ml-10">
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                                <div className="h-4 bg-purple-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : insightError ? (
                        <p className="ml-10 text-red-500 text-sm">{insightError}</p>
                    ) : (
                        <p className="ml-10 text-slate-700 font-medium leading-relaxed italic text-sm sm:text-base border-l-2 border-purple-100 pl-4 py-1">
                            "{insight}"
                        </p>
                    )}
                </div>
            </div>

            {/* Quick Sections Row */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Recent Courses */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-slate-900 text-sm">Recent Courses</span>
                        </div>
                        <Link href="/institute/courses" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="px-6 py-4 animate-pulse">
                                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                                </div>
                            ))
                        ) : courses.length === 0 ? (
                            <div className="px-6 py-10 text-center text-slate-400 text-sm">
                                No courses yet.{" "}
                                <Link href="/institute/courses/create" className="text-blue-600 hover:underline">Create one</Link>
                            </div>
                        ) : (
                            courses.map(course => {
                                const vis = visibilityConfig[course.visibility_type];
                                return (
                                    <Link
                                        key={course.id}
                                        href={`/institute/courses/${course.id}`}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {course.content_count} items · {course.student_count} students
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${vis.color}`}>
                                            <vis.icon className="w-3 h-3" />
                                            {vis.label}
                                        </span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900 text-sm">Quick Actions</span>
                    </div>
                    {[
                        { label: "Create New Course", href: "/institute/courses/create", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
                        { label: "Manage Students", href: "/institute/students", icon: Users, color: "bg-violet-50 text-violet-600" },
                        { label: "View All Courses", href: "/institute/courses", icon: BarChart3, color: "bg-emerald-50 text-emerald-600" },
                        { label: "Pending Invitations", href: "/institute/students", icon: Mail, color: "bg-amber-50 text-amber-600" },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100"
                        >
                            <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                                <action.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
