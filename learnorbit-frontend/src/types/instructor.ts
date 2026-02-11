/**
 * Instructor Dashboard Types
 */

export interface InstructorCourse {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    is_published: boolean;
    enrollment_count: number;
    created_at: string;
    updated_at: string;
}

export interface InstructorStats {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    totalStudents: number;
}

export interface InstructorCoursesResponse {
    success: boolean;
    data: InstructorCourse[];
}

export interface InstructorStatsResponse {
    success: boolean;
    data: InstructorStats;
}
