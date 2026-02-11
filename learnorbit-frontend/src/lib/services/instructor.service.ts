/**
 * Instructor Service
 * API calls for instructor dashboard
 */

import { get, patch } from '../api';
import { InstructorCoursesResponse, InstructorStatsResponse } from '@/types/instructor';

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
 * Toggle course publish status
 */
export const toggleCoursePublish = async (courseId: number, isPublished: boolean) => {
    return patch(`/v1/instructor/courses/${courseId}`, { is_published: isPublished });
};
