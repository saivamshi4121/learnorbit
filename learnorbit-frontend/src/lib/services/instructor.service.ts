/**
 * Instructor Service
 * API calls for instructor dashboard
 */

import { get, patch, post, put } from '../api';
import { InstructorCoursesResponse, InstructorStatsResponse, InstructorCourse } from '@/types/instructor';

/**
 * Fetch all courses for the logged-in instructor
 */
export const getInstructorCourses = async (): Promise<InstructorCoursesResponse> => {
    return get<InstructorCoursesResponse>('/v1/instructor/courses');
};

/**
 * Fetch dashboard stats for the instructor
 */
export const getInstructorStats = async (): Promise<InstructorStatsResponse> => {
    return get<InstructorStatsResponse>('/v1/instructor/stats');
};

/**
 * Create a new course
 */
export const createCourse = async (data: { title: string; description?: string; thumbnail_url?: string }) => {
    return post('/v1/instructor/courses', data);
};

/**
 * Get a single course by ID
 */
export const getCourse = async (courseId: string) => {
    return get<{ success: boolean; data: InstructorCourse }>(`/v1/instructor/courses/${courseId}`);
};

/**
 * Update various course fields
 */
export const updateCourse = async (courseId: number, data: Partial<InstructorCourse>) => {
    return patch(`/v1/instructor/courses/${courseId}`, data);
};

/**
 * Toggle course publish status
 */
export const toggleCoursePublish = async (courseId: number, isPublished: boolean) => {
    return patch(`/v1/instructor/courses/${courseId}`, { is_published: isPublished });
};
