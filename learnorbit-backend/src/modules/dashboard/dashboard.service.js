// src/modules/dashboard/dashboard.service.js
const dashboardRepo = require('./dashboard.repository');
const progressService = require('../progress/progress.service');
const enrollmentRepo = require('../enrollments/enrollment.repository');
const logger = require('../../utils/logger');

class DashboardService {
  // Student dashboard
  async getStudentDashboard(studentId) {
    // 1. Fetch active enrollments
    const enrollments = await enrollmentRepo.findActiveByUser(studentId);

    // 2. Fetch progress for each course
    const enrolledCourses = await Promise.all(enrollments.map(async (enrollment) => {
      const progress = await progressService.getCourseProgress(studentId, enrollment.course_id);

      return {
        id: enrollment.course_id,
        title: enrollment.title,
        thumbnail: enrollment.thumbnail_url,
        progressPercentage: progress.percentage,
        resumeLessonId: progress.resumeLessonId
      };
    }));

    return {
      enrolledCourses
    };
  }

  // Instructor dashboard
  async getInstructorDashboard(instructorId) {
    const courses = await dashboardRepo.getInstructorDashboard(instructorId);
    return courses.map(c => ({
      courseId: c.course_id,
      title: c.title,
      thumbnail: c.thumbnail_url,
      isPublished: !!c.is_published,
      totalEnrollments: parseInt(c.total_enrollments, 10) || 0,
      approvedEnrollments: parseInt(c.approved_enrollments, 10) || 0,
      pendingEnrollments: parseInt(c.pending_enrollments, 10) || 0,
    }));
  }

  // Admin dashboard
  async getAdminDashboard() {
    const stats = await dashboardRepo.getAdminDashboard();
    return {
      totalUsers: parseInt(stats.total_users, 10) || 0,
      totalStudents: parseInt(stats.total_students, 10) || 0,
      totalInstructors: parseInt(stats.total_instructors, 10) || 0,
      totalCourses: parseInt(stats.total_courses, 10) || 0,
      totalEnrollments: parseInt(stats.total_enrollments, 10) || 0,
      pendingEnrollments: parseInt(stats.pending_enrollments, 10) || 0,
    };
  }
}

module.exports = new DashboardService();
