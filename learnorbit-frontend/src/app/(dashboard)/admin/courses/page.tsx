"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, EyeOff } from 'lucide-react';
import {
    getAdminCourses,
    unpublishCourse,
    deleteCourse,
    AdminCourse,
} from '@/lib/services/admin.service';
import { getCurrentUser } from '@/lib/auth';

type FilterTab = 'all' | 'draft' | 'published';

export default function AdminCourseModeration() {
    const router = useRouter();
    const [courses, setCourses] = useState<AdminCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        // Role-based access control
        const user = getCurrentUser();
        if (!user || !['admin', 'super_admin'].includes(user.role)) {
            router.push('/login');
            return;
        }

        fetchCourses();
    }, [activeTab, router]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAdminCourses({
                status: activeTab,
            });

            if (response.success) {
                setCourses(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch courses:', err);

            // Handle 403 Forbidden
            if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view this page.');
            } else {
                setError('Failed to load courses. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUnpublish = async (course: AdminCourse) => {
        if (course.status !== 'published') return;

        // Optimistic update
        setCourses(prev => prev.map(c =>
            c.id === course.id ? { ...c, status: 'draft' as const } : c
        ));

        try {
            await unpublishCourse(course.id);
            // Refresh to get updated data
            await fetchCourses();
        } catch (err) {
            // Revert on error
            setCourses(prev => prev.map(c =>
                c.id === course.id ? { ...c, status: course.status } : c
            ));
            console.error('Failed to unpublish course:', err);
            alert('Failed to unpublish course. Please try again.');
        }
    };

    const handleDeleteConfirm = (courseId: number) => {
        setDeleteConfirm(courseId);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleDelete = async (courseId: number) => {
        // Remove from UI optimistically
        setCourses(prev => prev.filter(c => c.id !== courseId));
        setDeleteConfirm(null);

        try {
            await deleteCourse(courseId);
        } catch (err) {
            console.error('Failed to delete course:', err);
            alert('Failed to delete course. Please try again.');
            // Refresh to restore original state
            await fetchCourses();
        }
    };

    if (loading && courses.length === 0) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                        Course Moderation
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor platform content
                    </p>
                </div>

                {/* Thin divider */}
                <div className="h-px w-full bg-gray-200 mb-8" />

                {/* Filter Tabs */}
                <div className="flex gap-1 mb-6 border-b border-gray-200">
                    <FilterTabButton
                        label="All"
                        active={activeTab === 'all'}
                        onClick={() => setActiveTab('all')}
                    />
                    <FilterTabButton
                        label="Draft"
                        active={activeTab === 'draft'}
                        onClick={() => setActiveTab('draft')}
                    />
                    <FilterTabButton
                        label="Published"
                        active={activeTab === 'published'}
                        onClick={() => setActiveTab('published')}
                    />
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded mb-6">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Courses Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-gray-500">No courses found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Instructor
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Enrollments
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {courses.map((course) => (
                                            <tr
                                                key={course.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-3">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {course.title}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <p className="text-sm text-gray-600">
                                                        {course.instructorName}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={course.status} />
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <p className="text-sm font-medium text-gray-900 tabular-nums">
                                                        {course.enrollmentCount}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <p className="text-sm text-gray-500 tabular-nums">
                                                        {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {course.status === 'published' && (
                                                            <button
                                                                onClick={() => handleUnpublish(course)}
                                                                className="text-sm px-3 py-1.5 rounded border border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors flex items-center gap-1.5"
                                                            >
                                                                <EyeOff className="h-3.5 w-3.5" />
                                                                Unpublish
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteConfirm(course.id)}
                                                            className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {courses.map((course) => (
                                    <div key={course.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {course.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    by {course.instructorName}
                                                </p>
                                            </div>
                                            <StatusBadge status={course.status} />
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>{course.enrollmentCount} enrolled</span>
                                                <span>•</span>
                                                <span>{formatDistanceToNow(new Date(course.createdAt))} ago</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {course.status === 'published' && (
                                                    <button
                                                        onClick={() => handleUnpublish(course)}
                                                        className="text-xs px-2 py-1 rounded border border-orange-200 text-orange-700"
                                                    >
                                                        Unpublish
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteConfirm(course.id)}
                                                    className="text-xs px-2 py-1 rounded border border-red-200 text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm !== null && (
                <ConfirmDialog
                    title="Delete Course"
                    message="Are you sure you want to delete this course? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteConfirm)}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
}

/**
 * FilterTabButton Component
 */
interface FilterTabButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

function FilterTabButton({ label, active, onClick }: FilterTabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-2 text-sm font-medium transition-colors relative
        ${active
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }
      `}
        >
            {label}
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
        </button>
    );
}

/**
 * StatusBadge Component
 */
interface StatusBadgeProps {
    status: 'draft' | 'published';
}

function StatusBadge({ status }: StatusBadgeProps) {
    const isDraft = status === 'draft';

    return (
        <span
            className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
        ${isDraft
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-green-50 text-green-700 border-green-200'
                }
      `}
        >
            {isDraft ? 'Draft' : 'Published'}
        </span>
    );
}

/**
 * Confirm Dialog Component
 */
interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full border border-gray-200 shadow-lg">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        {message}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Loading Skeleton
 */
function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded mt-2 animate-pulse" />
                </div>

                <div className="h-px w-full bg-gray-200 mb-8" />

                <div className="flex gap-1 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
