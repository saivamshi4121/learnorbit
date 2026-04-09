"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowUpDown, ArrowUp, ArrowDown,
    BookOpen, CheckCircle, File, Users, TrendingUp, LogOut
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Switch } from '@/components/ui/Switch';
import { getInstructorCourses, getInstructorStats, toggleCoursePublish } from '@/lib/services/instructor.service';
import { InstructorCourse, InstructorStats } from '@/types/instructor';
import CourseAgent from '@/components/dashboard/CourseAgent';

type SortKey = 'title' | 'enrollment_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

export default function InstructorDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [stats, setStats] = useState<InstructorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<SortKey>('updated_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [coursesRes, statsRes]: [any, any] = await Promise.all([
                getInstructorCourses(),
                getInstructorStats()
            ]);

            if (coursesRes.success) {
                setCourses(coursesRes.data);
            }
            if (statsRes.success) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (courseId: number, currentStatus: boolean) => {
        // Optimistic update
        setCourses(prev => prev.map(c =>
            c.id === courseId ? { ...c, is_published: !currentStatus } : c
        ));

        try {
            await toggleCoursePublish(courseId, !currentStatus);
        } catch (err) {
            // Revert on failure
            setCourses(prev => prev.map(c =>
                c.id === courseId ? { ...c, is_published: currentStatus } : c
            ));
            console.error("Failed to toggle publish status");
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc'); // Default to asc for new key, though updated_at usually implies desc. Logic can be refined.
        }
    };

    const sortedCourses = useMemo(() => {
        return [...courses].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [courses, sortKey, sortDirection]);

    const maxEnrollment = useMemo(() => {
        if (!courses.length) return 1;
        return Math.max(...courses.map(c => c.enrollment_count), 1);
    }, [courses]);

    const handleCreateCourse = () => router.push('/instructor/courses/create');
    const handleEditCourse = (courseId: number) => router.push(`/instructor/courses/${courseId}/edit`);

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans text-textPrimary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* 1️⃣ HEADER: Authority + Action */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-textPrimary">
                            Instructor Dashboard
                        </h1>
                        <p className="text-sm text-mutedText mt-1">
                            Manage courses and track engagement.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => logout()} variant="outline" className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                        <PrimaryButton onClick={handleCreateCourse} className="bg-primary hover:bg-primary/90 text-white shadow-sm px-5 py-2">
                            Create Course
                        </PrimaryButton>
                    </div>
                </div>

                {/* Thin divider below header */}
                <div className="h-px w-full bg-borderLight mb-8" />

                {/* 2️⃣ STAT STRIP (Cards) */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <StatsCard
                            label="Total Courses"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            trend="+2 this month"
                            color="blue"
                        />
                        <StatsCard
                            label="Published"
                            value={stats.publishedCourses}
                            icon={CheckCircle}
                            color="green"
                        />
                        <StatsCard
                            label="Drafts"
                            value={stats.draftCourses}
                            icon={File}
                            color="gray"
                        />
                        <StatsCard
                            label="Total Students"
                            value={stats.totalStudents}
                            icon={Users}
                            trend="+12% vs last month"
                            color="purple"
                        />
                    </div>
                )}

                {/* 3️⃣ CORE: Course Table (Main Engine) */}
                <div className="bg-white border border-borderLight shadow-sm rounded-xl overflow-hidden mt-8">
                    {loading ? (
                        <div className="p-6">
                            <TableSkeleton rows={5} cols={6} />
                        </div>
                    ) : courses.length === 0 ? (
                        <EmptyState
                            title="No courses yet"
                            description="Create your first structured course to get started."
                            actionLabel="Create Course"
                            onAction={handleCreateCourse}
                        />
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-borderLight bg-gray-50/50">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider w-[80px]">
                                                Image
                                            </th>
                                            <th
                                                className="text-left px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Title
                                                    <SortIcon active={sortKey === 'title'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider w-[120px]">
                                                Status
                                            </th>
                                            <th
                                                className="text-right px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors w-[180px]"
                                                onClick={() => handleSort('enrollment_count')}
                                            >
                                                <div className="flex items-center justify-end gap-1">
                                                    Enrollments
                                                    <SortIcon active={sortKey === 'enrollment_count'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th
                                                className="text-right px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors w-[180px]"
                                                onClick={() => handleSort('updated_at')}
                                            >
                                                <div className="flex items-center justify-end gap-1">
                                                    Last Updated
                                                    <SortIcon active={sortKey === 'updated_at'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-mutedText uppercase tracking-wider w-[140px]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {sortedCourses.map((course) => (
                                            <tr key={course.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="h-10 w-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-borderLight shadow-sm">
                                                        {course.thumbnail_url ? (
                                                            <Image
                                                                src={course.thumbnail_url}
                                                                alt={course.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-mutedText">
                                                                No img
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-textPrimary group-hover:text-primary transition-colors">
                                                        {course.title}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={course.is_published ? 'published' : 'draft'} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-sm font-semibold text-textPrimary tabular-nums">
                                                            {course.enrollment_count}
                                                        </span>
                                                        <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary/80 rounded-full"
                                                                style={{ width: `${(course.enrollment_count / maxEnrollment) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm text-mutedText tabular-nums">
                                                        {formatDistanceToNow(new Date(course.updated_at), { addSuffix: true })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditCourse(course.id)}
                                                            className="text-sm font-medium text-textPrimary hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded transition-all"
                                                        >
                                                            Edit
                                                        </button>
                                                        <Switch
                                                            checked={course.is_published}
                                                            onCheckedChange={() => handleTogglePublish(course.id, course.is_published)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-borderLight bg-white">
                                {sortedCourses.map((course) => (
                                    <div key={course.id} className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded-lg border border-borderLight flex-shrink-0 overflow-hidden relative">
                                                    {course.thumbnail_url && (
                                                        <Image
                                                            src={course.thumbnail_url}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-textPrimary line-clamp-1">
                                                        {course.title}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <StatusBadge status={course.is_published ? 'published' : 'draft'} />
                                                        <span className="text-xs text-mutedText">
                                                            • {formatDistanceToNow(new Date(course.updated_at))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dashed border-borderLight pt-3 mt-1">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-mutedText uppercase tracking-wider">Students</span>
                                                <span className="text-sm font-medium text-textPrimary">{course.enrollment_count}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleEditCourse(course.id)}
                                                    className="text-sm border border-borderLight px-3 py-1 rounded hover:bg-gray-50 text-textPrimary"
                                                >
                                                    Edit
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-mutedText">{course.is_published ? 'Pub' : 'Draft'}</span>
                                                    <Switch
                                                        checked={course.is_published}
                                                        onCheckedChange={() => handleTogglePublish(course.id, course.is_published)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* AI Course Agent */}
            <CourseAgent />
        </div>
    );
}

/**
 * StatsCard Component
 */
function StatsCard({ label, value, icon: Icon, trend, color }: { label: string; value: number; icon: any; trend?: string; color: 'blue' | 'green' | 'gray' | 'purple' }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    };

    return (
        <div className="bg-white border border-borderLight rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-mutedText">{label}</p>
                    <h3 className="text-2xl font-bold text-textPrimary mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className="mt-3 flex items-center text-xs text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                </div>
            )}
        </div>
    );
}

/**
 * SortIcon Component
 */
function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
    if (!active) return <ArrowUpDown className="h-3 w-3 text-mutedText opacity-40 group-hover:opacity-100" />;
    return direction === 'asc'
        ? <ArrowUp className="h-3 w-3 text-primary" />
        : <ArrowDown className="h-3 w-3 text-primary" />;
}
