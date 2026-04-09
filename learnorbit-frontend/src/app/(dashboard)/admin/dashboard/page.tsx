"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Users, GraduationCap, UserCog, BookOpen, CheckCircle, UserPlus, Clock } from 'lucide-react';
import {
    getAdminDashboardStats,
    getAdminDashboardDetails,
    AdminDashboardStats,
    AdminDashboardDetails
} from '@/lib/services/admin.service';
import { getCurrentUser } from '@/lib/auth';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [details, setDetails] = useState<AdminDashboardDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Role-based access control
        const user = getCurrentUser();
        if (!user || !['admin', 'super_admin'].includes(user.role)) {
            router.push('/login');
            return;
        }

        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsResponse, detailsResponse] = await Promise.all([
                getAdminDashboardStats(),
                getAdminDashboardDetails()
            ]);

            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

            if (detailsResponse.success) {
                setDetails(detailsResponse.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch admin dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="border border-red-200 bg-red-50 text-red-800 px-6 py-4 rounded">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="border border-gray-200 bg-gray-50 text-gray-600 px-6 py-4 rounded">
                    <p className="text-sm">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Platform overview
                </p>
            </div>

            {/* Thin divider */}
            <div className="h-px w-full bg-gray-200 mb-10" />

            {/* KPI Stat Strip */}
            <div className="flex flex-wrap gap-px bg-gray-200 border border-gray-200 mb-10">
                <StatItem
                    label="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                />
                <StatItem
                    label="Students"
                    value={stats.totalStudents}
                    icon={GraduationCap}
                />
                <StatItem
                    label="Instructors"
                    value={stats.totalInstructors}
                    icon={UserCog}
                />
                <StatItem
                    label="Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                />
                <StatItem
                    label="Published"
                    value={stats.totalPublishedCourses}
                    icon={CheckCircle}
                />
                <StatItem
                    label="Enrollments"
                    value={stats.totalEnrollments}
                    icon={UserPlus}
                />
            </div>

            {/* Monitoring Sections */}
            {details && (
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recently Registered Users */}
                    <MonitoringSection
                        title="Recently Registered Users"
                        icon={Users}
                        items={details.recentUsers}
                        renderItem={(user) => (
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        )}
                        emptyMessage="No recent users"
                    />

                    {/* Recently Created Courses */}
                    <MonitoringSection
                        title="Recently Created Courses"
                        icon={BookOpen}
                        items={details.recentCourses}
                        renderItem={(course) => (
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {course.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        by {course.instructorName}
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        )}
                        emptyMessage="No recent courses"
                    />

                    {/* Courses Pending Publish */}
                    <MonitoringSection
                        title="Courses Pending Publish"
                        icon={Clock}
                        items={details.pendingCourses}
                        renderItem={(course) => (
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {course.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        by {course.instructorName}
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        )}
                        emptyMessage="No pending courses"
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Stat Item Component
 * Minimal, data-heavy stat display with thin borders
 */
interface StatItemProps {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
}

function StatItem({ label, value, icon: Icon }: StatItemProps) {
    return (
        <div className="flex-1 min-w-[150px] bg-white px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
                <Icon className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 tabular-nums">
                {value.toLocaleString()}
            </p>
        </div>
    );
}

/**
 * MonitoringSection Component
 * Compact list display for recent activity monitoring
 */
interface MonitoringSectionProps<T> {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    emptyMessage: string;
}

function MonitoringSection<T>({ title, icon: Icon, items, renderItem, emptyMessage }: MonitoringSectionProps<T>) {
    return (
        <div className="border border-gray-200 rounded-lg bg-white">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                        {title}
                    </h3>
                </div>
            </div>

            {/* List */}
            <div className="p-4">
                {items.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                        {emptyMessage}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Loading Skeleton
 */
function LoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded mt-2 animate-pulse" />
            </div>

            <div className="h-px w-full bg-gray-200 mb-10" />

            {/* Stats skeleton */}
            <div className="flex flex-wrap gap-px bg-gray-200 border border-gray-200">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-1 min-w-[150px] bg-white px-6 py-8">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-3 animate-pulse" />
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Monitoring sections skeleton */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg bg-white">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="space-y-2">
                                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
