"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Building2,
    CircleDollarSign,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users
} from "lucide-react";
import {
    getInstructorCourses,
    toggleCoursePublish,
    deleteCourse
} from "@/lib/services/instructor.service";
import { InstructorCourse } from "@/types/instructor";
import { Switch } from "@/components/ui/Switch";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on layout.tsx

type FilterType = "all" | "published" | "draft";

export default function InstructorCoursesPage() {
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch courses on mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getInstructorCourses();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredCourses = courses.filter((course) => {
        if (filter === "all") return true;
        if (filter === "published") return course.is_published;
        if (filter === "draft") return !course.is_published;
        return true;
    });

    // Toggle publish status
    const handleTogglePublish = async (courseId: number, currentStatus: boolean) => {
        // Optimistic update
        setCourses((prev) =>
            prev.map((c) =>
                c.id === courseId ? { ...c, is_published: !currentStatus } : c
            )
        );

        try {
            await toggleCoursePublish(courseId, !currentStatus);
            toast.success(currentStatus ? "Course unpublished" : "Course published");
        } catch (error) {
            // Revert on failure
            setCourses((prev) =>
                prev.map((c) =>
                    c.id === courseId ? { ...c, is_published: currentStatus } : c
                )
            );
            toast.error("Failed to update status");
        }
    };

    // Delete course
    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteCourse(deleteId);
            setCourses((prev) => prev.filter((c) => c.id !== deleteId));
            toast.success("Course deleted successfully");
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete course");
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Courses</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your courses, track enrollments, and update content.
                    </p>
                </div>
                <Link href="/instructor/courses/create">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </button>
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {(["all", "published", "draft"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${filter === tab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }
              `}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                {courses.filter(c => {
                                    if (tab === 'all') return true;
                                    if (tab === 'published') return c.is_published;
                                    return !c.is_published;
                                }).length}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 w-full bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-lg">
                    <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
                    <div className="mt-6">
                        <Link href="/instructor/courses/create">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                                <Plus className="mr-2 h-4 w-4" />
                                New Course
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-medium">Course</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Status</th>
                                    <th scope="col" className="px-6 py-3 font-medium text-right">Enrollments</th>
                                    <th scope="col" className="px-6 py-3 font-medium text-right">Last Updated</th>
                                    <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200 relative">
                                                    {course.thumbnail_url ? (
                                                        <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full text-gray-300">
                                                            <Building2 className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{course.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">ID: {course.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${course.is_published
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                                    }`}
                                            >
                                                {course.is_published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 text-gray-600">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>{course.enrollment_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {course.updated_at ? format(new Date(course.updated_at), "MMM d, yyyy") : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <Switch
                                                        checked={course.is_published}
                                                        onCheckedChange={() => handleTogglePublish(course.id, course.is_published)}
                                                    />
                                                </div>
                                                <Link href={`/instructor/courses/${course.id}/edit`}>
                                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(course.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-16 bg-gray-100 rounded overflow-hidden border border-gray-200 relative flex-shrink-0">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full text-gray-300">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{course.title}</h3>
                                            <span
                                                className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-medium border ${course.is_published
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                                    }`}
                                            >
                                                {course.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Enrollments</span>
                                        <span className="font-medium text-gray-900">{course.enrollment_count}</span>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Price</span>
                                        <span className="font-medium text-gray-900">Free</span>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Updated</span>
                                        <span className="font-medium text-gray-900">{course.updated_at ? format(new Date(course.updated_at), "MMM d") : "-"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <div className="mr-auto flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-medium">Publish</span>
                                        <Switch
                                            checked={course.is_published}
                                            onCheckedChange={() => handleTogglePublish(course.id, course.is_published)}
                                        />
                                    </div>

                                    <Link href={`/instructor/courses/${course.id}/edit`}>
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(course.id)}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-red-600 border border-gray-200 hover:bg-red-50 hover:border-red-200 h-9 px-3"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all scale-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 full flex items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Course?</h3>
                                <p className="text-sm text-gray-500">
                                    This action cannot be undone. This will permanently delete the course and remove all associated data.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
