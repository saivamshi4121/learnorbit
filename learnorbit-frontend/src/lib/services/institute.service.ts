/**
 * Institute API Service
 * All calls are scoped to the logged-in institute_admin automatically via JWT.
 */
import { get, post, patch, del } from '../api';

// ── Types ─────────────────────────────────────────────────────────

export interface Institute {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'suspended';
    student_count: number;
    course_count: number;
    created_at: string;
}

export interface InstituteStats {
    total_courses: number;
    published_courses: number;
    total_students: number;
    pending_invites: number;
}

export interface InstituteCourse {
    id: string;
    institute_id: string;
    title: string;
    description: string | null;
    visibility_type: 'public' | 'private' | 'selected';
    content_count: number;
    student_count: number;
    created_at: string;
    updated_at: string;
}

export interface CourseContent {
    id: string;
    course_id: string;
    title: string;
    content_type: 'video' | 'pdf' | 'document' | 'link' | 'iframe';
    content_url: string;
    order_index: number;
    created_at: string;
}

export interface CourseAccess {
    id: string;
    course_id: string;
    student_id: number | null;
    student_name: string | null;
    student_email: string | null;
    invited_email: string | null;
    access_status: 'pending' | 'active' | 'revoked';
    created_at: string;
}

export interface InstituteStudent {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    enrolled_at: string;
}

// ── Institute Admin Endpoints ─────────────────────────────────────

export const getStats = (): Promise<{ success: boolean; data: InstituteStats }> =>
    get('/institute/stats');

// Courses
export const listCourses = (): Promise<{ success: boolean; data: InstituteCourse[] }> =>
    get('/institute/courses');

export const createCourse = (data: {
    title: string;
    description?: string;
    visibility_type?: string;
}): Promise<{ success: boolean; data: InstituteCourse }> =>
    post('/institute/courses', data);

export const updateCourse = (
    id: string,
    data: Partial<Pick<InstituteCourse, 'title' | 'description' | 'visibility_type'>>
): Promise<{ success: boolean; data: InstituteCourse }> =>
    patch(`/institute/courses/${id}`, data);

export const deleteCourse = (id: string): Promise<{ success: boolean }> =>
    del(`/institute/courses/${id}`);

// Content
export const listContent = (courseId: string): Promise<{ success: boolean; data: CourseContent[] }> =>
    get(`/institute/courses/${courseId}/content`);

export const addContent = (
    courseId: string,
    data: { title: string; content_type: string; content_url: string; order_index?: number }
): Promise<{ success: boolean; data: CourseContent }> =>
    post(`/institute/courses/${courseId}/content`, data);

export const deleteContent = (courseId: string, contentId: string): Promise<{ success: boolean }> =>
    del(`/institute/courses/${courseId}/content/${contentId}`);

// Access / Invitations
export const listCourseAccess = (courseId: string): Promise<{ success: boolean; data: CourseAccess[] }> =>
    get(`/institute/courses/${courseId}/access`);

export const grantAccess = (
    courseId: string,
    data: { student_id?: number; email?: string }
): Promise<{ success: boolean; data: CourseAccess }> =>
    post(`/institute/courses/${courseId}/access`, data);

export const revokeAccess = (courseId: string, studentId: number): Promise<{ success: boolean }> =>
    del(`/institute/courses/${courseId}/access/${studentId}`);

// Students
export const listStudents = (): Promise<{ success: boolean; data: InstituteStudent[] }> =>
    get('/institute/students');

export const removeStudent = (userId: number): Promise<{ success: boolean }> =>
    del(`/institute/students/${userId}`);

// ── Super Admin Endpoints ─────────────────────────────────────────

export const listAllInstitutes = (): Promise<{ success: boolean; data: Institute[] }> =>
    get('/admin/institutes');

export const createInstitute = (data: {
    name: string;
    email: string;
    password: string;
}): Promise<{ success: boolean; data: { institute: Institute } }> =>
    post('/admin/institutes', data);

export const updateInstituteStatus = (
    id: string,
    status: 'active' | 'suspended'
): Promise<{ success: boolean }> =>
    patch(`/admin/institutes/${id}/status`, { status });

// ── Student Endpoints ─────────────────────────────────────────────

export const getMyInstituteCourses = (): Promise<{ success: boolean; data: InstituteCourse[] }> =>
    get('/student/my-courses');

export const getCourseContent = (courseId: string): Promise<{
    success: boolean;
    data: { course: InstituteCourse; content: CourseContent[] };
}> =>
    get(`/student/courses/${courseId}/content`);
