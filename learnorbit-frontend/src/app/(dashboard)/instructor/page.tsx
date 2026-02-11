"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Switch } from '@/components/ui/Switch';
import { getInstructorCourses, getInstructorStats, toggleCoursePublish } from '@/lib/services/instructor.service';
import { InstructorCourse, InstructorStats } from '@/types/instructor';

type SortKey = 'title' | 'enrollment_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

export default function InstructorDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [stats, setStats] = useState<InstructorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sorting state
    const [sortKey, setSortKey] = useState<SortKey>('updated_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [coursesRes, statsRes] = await Promise.all([
                getInstructorCourses(),
                getInstructorStats()
            ]);

            if (coursesRes.success && coursesRes.data) {
                setCourses(coursesRes.data);
            }

            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (courseId: number, currentStatus: boolean) => {
        // Optimistic update
        setCourses(prev =>
            prev.map(course =>
                course.id === courseId
                    ? { ...course, is_published: !currentStatus }
                    : course
            )
        );

        try {
            await toggleCoursePublish(courseId, !currentStatus);
            // Refresh stats silently
            const statsRes = await getInstructorStats();
            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (err: any) {
            // Revert on error
            setCourses(prev =>
                prev.map(course =>
                    course.id === courseId
                        ? { ...course, is_published: currentStatus }
                        : course
                )
            );
            alert(err.message || 'Failed to update course status');
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc'); // Default to descending for new sort
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
        return Math.max(...courses.map(c => c.enrollment_count), 1);
    }, [courses]);

    const handleCreateCourse = () => router.push('/instructor/courses/create');
    const handleEditCourse = (courseId: number) => router.push(`/instructor/courses/${courseId}/edit`);

    return (
        <div className="min-h-screen bg-background font-sans text-textPrimary">
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
                    <div>
                        <PrimaryButton onClick={handleCreateCourse} className="bg-primary hover:bg-primary/90 text-white shadow-none px-5 py-2">
                            <span className="mr-2">➕</span> Create Course
                        </PrimaryButton>
                    </div>
                </div>

                {/* Thin divider below header */}
                <div className="h-px w-full bg-borderLight mb-8" />

                {/* 2️⃣ STAT STRIP (Inline, Not Cards) */}
                {stats && (
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 text-sm">
                        <StatItem label="Total Courses" value={stats.totalCourses} />
                        <div className="hidden sm:block h-8 w-px bg-borderLight" />

                        <StatItem label="Published" value={stats.publishedCourses} />
                        <div className="hidden sm:block h-8 w-px bg-borderLight" />

                        <StatItem label="Drafts" value={stats.draftCourses} />
                        <div className="hidden sm:block h-8 w-px bg-borderLight" />

                        <StatItem label="Total Students" value={stats.totalStudents} />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* 3️⃣ CORE: Course Table (Main Engine) */}
                <div className="bg-white border border-borderLight sm:rounded-none overflow-hidden hover:shadow-sm transition-shadow duration-300">
                    {loading ? (
                        <div className="p-6">
                            <TableSkeleton rows={5} cols={6} />
                        </div>
                    ) : courses.length === 0 ? (
                        <EmptyState
                            title="No courses yet."
                            description="Create your first structured course."
                            actionLabel="Create Course"
                            onAction={handleCreateCourse}
                        />
                    ) : (
                        <>
                            {/* Desktop Table - Dense & Minimal */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-borderLight bg-white">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider w-[80px]">
                                                Image
                                            </th>
                                            <th
                                                className="text-left px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Title
                                                    <SortIcon active={sortKey === 'title'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider w-[120px]">
                                                Status
                                            </th>
                                            <th
                                                className="text-right px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors w-[180px]"
                                                onClick={() => handleSort('enrollment_count')}
                                            >
                                                <div className="flex items-center justify-end gap-1">
                                                    Enrollments
                                                    <SortIcon active={sortKey === 'enrollment_count'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th
                                                className="text-right px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider cursor-pointer group hover:text-textPrimary transition-colors w-[180px]"
                                                onClick={() => handleSort('updated_at')}
                                            >
                                                <div className="flex items-center justify-end gap-1">
                                                    Last Updated
                                                    <SortIcon active={sortKey === 'updated_at'} direction={sortDirection} />
                                                </div>
                                            </th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-mutedText uppercase tracking-wider w-[140px]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {sortedCourses.map((course) => (
                                            <tr key={course.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="h-10 w-16 relative bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-borderLight">
                                                        {course.thumbnail_url ? (
                                                            <Image
                                                                src={course.thumbnail_url}
                                                                alt={course.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-mutedText">
                                                                No img
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <p className="text-sm font-medium text-textPrimary group-hover:text-primary transition-colors">
                                                        {course.title}
                                                    </p>
                                                    {/* Optional subtle ID for tech feel */}
                                                    <p className="text-[10px] text-mutedText font-mono mt-0.5 opacity-50">
                                                        ID: {course.id}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={course.is_published ? 'published' : 'draft'} />
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-sm font-semibold text-textPrimary tabular-nums">
                                                            {course.enrollment_count}
                                                        </span>
                                                        {/* 🧠 Micro Power Feature: Enrollment Bar */}
                                                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary/80"
                                                                style={{ width: `${(course.enrollment_count / maxEnrollment) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className="text-sm text-mutedText tabular-nums">
                                                        {formatDistanceToNow(new Date(course.updated_at), { addSuffix: true })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <button
                                                            onClick={() => handleEditCourse(course.id)}
                                                            className="text-sm font-medium text-mutedText hover:text-primary hover:underline transition-colors"
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

                            {/* 5️⃣ RESPONSIVE: Mobile Stacked Minimal Card View */}
                            <div className="md:hidden divide-y divide-borderLight bg-white">
                                {sortedCourses.map((course) => (
                                    <div key={course.id} className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded border border-borderLight flex-shrink-0 overflow-hidden relative">
                                                    {course.thumbnail_url && (
                                                        <Image
                                                            src={course.thumbnail_url}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
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
        </div>
    );
}

/**
 * StatItem Component
 * Inline stat display: Large Number | Label
 */
function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-textPrimary tracking-tight">
                {value}
            </span>
            <span className="text-sm font-medium text-mutedText uppercase tracking-wide">
                {label}
            </span>
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
