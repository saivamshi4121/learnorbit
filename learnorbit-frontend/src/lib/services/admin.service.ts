/**
 * Admin Service
 * API calls for admin dashboard and user management
 */

import { get, patch, del } from '../api';

export interface AdminDashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalPublishedCourses: number;
    totalEnrollments: number;
}

export interface AdminDashboardResponse {
    success: boolean;
    data: AdminDashboardStats;
}

/**
 * Fetch admin dashboard stats
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardResponse> => {
    return get<AdminDashboardResponse>('/v1/admin/dashboard');
};

export interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
}

export interface RecentCourse {
    id: number;
    title: string;
    instructorName: string;
    createdAt: string;
}

export interface PendingCourse {
    id: number;
    title: string;
    instructorName: string;
    createdAt: string;
}

export interface AdminDashboardDetails {
    recentUsers: RecentUser[];
    recentCourses: RecentCourse[];
    pendingCourses: PendingCourse[];
}

export interface AdminDashboardDetailsResponse {
    success: boolean;
    data: AdminDashboardDetails;
}

/**
 * Fetch admin dashboard details (recent activity)
 */
export const getAdminDashboardDetails = async (): Promise<AdminDashboardDetailsResponse> => {
    return get<AdminDashboardDetailsResponse>('/v1/admin/dashboard/details');
};

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    status: 'active' | 'blocked';
    joinedAt: string;
}

export interface AdminUsersResponse {
    success: boolean;
    data: AdminUser[];
}

export interface AdminUserActionResponse {
    success: boolean;
    message?: string;
}

/**
 * Fetch users with optional filters
 */
export const getAdminUsers = async (params?: {
    role?: string;
    search?: string;
}): Promise<AdminUsersResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.role && params.role !== 'all') {
        queryParams.append('role', params.role);
    }

    if (params?.search) {
        queryParams.append('search', params.search);
    }

    const queryString = queryParams.toString();
    const url = `/v1/admin/users${queryString ? `?${queryString}` : ''}`;

    return get<AdminUsersResponse>(url);
};

/**
 * Block a user
 */
export const blockUser = async (userId: number): Promise<AdminUserActionResponse> => {
    return patch<AdminUserActionResponse>(`/v1/admin/users/${userId}/block`);
};

/**
 * Unblock a user
 */
export const unblockUser = async (userId: number): Promise<AdminUserActionResponse> => {
    return patch<AdminUserActionResponse>(`/v1/admin/users/${userId}/unblock`);
};

export interface AdminCourse {
    id: number;
    title: string;
    instructorName: string;
    status: 'draft' | 'published';
    enrollmentCount: number;
    createdAt: string;
}

export interface AdminCoursesResponse {
    success: boolean;
    data: AdminCourse[];
}

export interface AdminCourseActionResponse {
    success: boolean;
    message?: string;
}

/**
 * Fetch courses with optional status filter
 */
export const getAdminCourses = async (params?: {
    status?: string;
}): Promise<AdminCoursesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
    }

    const queryString = queryParams.toString();
    const url = `/v1/admin/courses${queryString ? `?${queryString}` : ''}`;

    return get<AdminCoursesResponse>(url);
};

/**
 * Unpublish a course
 */
export const unpublishCourse = async (courseId: number): Promise<AdminCourseActionResponse> => {
    return patch<AdminCourseActionResponse>(`/v1/admin/courses/${courseId}/unpublish`);
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: number): Promise<AdminCourseActionResponse> => {
    return del<AdminCourseActionResponse>(`/v1/admin/courses/${courseId}`);
};
