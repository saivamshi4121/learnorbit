import { get, post, patch, del } from '../api';

export type LessonType = 'video' | 'text' | 'pdf' | 'external';
export type CompletionRule = 'manual' | 'percentage';

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    type: LessonType;
    content?: string; // Markdown for text
    url?: string;     // URL for video/pdf/external
    thumbnail_url?: string; // Optional for video
    duration_seconds?: number;
    completion_rule?: CompletionRule; // e.g., 'manual', 'percentage'
    order_index: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateLessonPayload = {
    title: string;
    type: LessonType;
    content?: string;
    url?: string;
    thumbnail_url?: string;
    duration_seconds?: number;
    completion_rule?: CompletionRule;
    order_index?: number;
    is_published?: boolean;
};

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

/**
 * Fetch all lessons for a course (Instructor View)
 */
export const getInstructorLessons = async (courseId: number | string): Promise<{ success: boolean; data: Lesson[] }> => {
    return get<{ success: boolean; data: Lesson[] }>(`/v1/instructor/courses/${courseId}/lessons`);
};

/**
 * Create a new lesson
 */
export const createLesson = async (courseId: number | string, data: CreateLessonPayload): Promise<{ success: boolean; data: Lesson }> => {
    return post<{ success: boolean; data: Lesson }>(`/v1/instructor/courses/${courseId}/lessons`, data);
};

/**
 * Update a lesson
 */
export const updateLesson = async (lessonId: number, data: UpdateLessonPayload): Promise<{ success: boolean; data: Lesson }> => {
    return patch<{ success: boolean; data: Lesson }>(`/v1/instructor/lessons/${lessonId}`, data);
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (lessonId: number): Promise<{ success: boolean }> => {
    return del<{ success: boolean }>(`/v1/instructor/lessons/${lessonId}`);
};

/**
 * Reorder lessons
 * Payload: { activeId: number, overId: number } or whole list? Usually just new order index for one item or batch.
 * The request says: PATCH /api/v1/instructor/lessons/:lessonId/order
 */
export const reorderLesson = async (lessonId: number, newOrderIndex: number): Promise<{ success: boolean }> => {
    return patch<{ success: boolean }>(`/v1/instructor/lessons/${lessonId}/order`, { order_index: newOrderIndex });
};

