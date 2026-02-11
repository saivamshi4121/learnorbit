import { get, post, put, del } from '../api';

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    type: 'video' | 'text' | 'pdf' | 'external';
    content?: string;
    provider?: string;
    embed_url?: string;
    duration_seconds?: number;
    completion_required: boolean;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateLessonPayload = {
    title: string;
    type: 'video' | 'text' | 'pdf' | 'external';
    content?: string;
    duration_seconds?: number;
    completion_required?: boolean;
    order_index?: number;
};

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

/**
 * Fetch all lessons for a course (Instructor View)
 */
export const getInstructorLessons = async (courseId: number): Promise<{ success: boolean; data: Lesson[] }> => {
    return get<{ success: boolean; data: Lesson[] }>(`/v1/courses/${courseId}/lessons/manage`);
};

/**
 * Create a new lesson
 */
export const createLesson = async (courseId: number, data: CreateLessonPayload): Promise<{ success: boolean; data: { id: number } }> => {
    return post<{ success: boolean; data: { id: number } }>(`/v1/courses/${courseId}/lessons`, data);
};

/**
 * Update a lesson
 */
export const updateLesson = async (lessonId: number, data: UpdateLessonPayload): Promise<{ success: boolean; message: string }> => {
    return put<{ success: boolean; message: string }>(`/v1/lessons/${lessonId}`, data);
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (lessonId: number): Promise<{ success: boolean; message: string }> => {
    return del<{ success: boolean; message: string }>(`/v1/lessons/${lessonId}`);
};
