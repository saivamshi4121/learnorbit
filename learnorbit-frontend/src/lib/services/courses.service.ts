import { get } from '../api';

export interface Course {
    id: string | number;
    title: string;
    description: string | null;
    thumbnail_url?: string | null;
    is_free?: boolean;
    price?: number | null;
    instructor?: string;
    instructorName?: string;
    duration?: string;
    students?: number;
    enrollment_count?: number;
    created_at?: string;
}

/**
 * Fetch all public courses
 */
export const getAllCourses = async (): Promise<{ success: boolean; data: Course[] }> => {
    return get<{ success: boolean; data: Course[] }>('/courses');
};

/**
 * Get a single course by ID (public)
 */
export const getPublicCourseById = async (id: string): Promise<{ success: boolean; data: Course }> => {
    return get<{ success: boolean; data: Course }>(`/courses/${id}`);
};
