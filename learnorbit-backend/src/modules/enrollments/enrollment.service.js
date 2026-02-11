// src/modules/enrollments/enrollment.service.js
const enrollmentRepo = require('./enrollment.repository');
const courseRepo = require('../courses/course.repository');
const userRepo = require('../../repositories/user.repository');
const emailService = require('../../utils/email.service');
// const { addPaidEnrollmentJob } = require('../../queues/email.queue'); // Deprecated in favor of direct email

class EnrollmentService {
  // Enroll a student in a course
  async enroll(studentId, courseId) {
    // 1️⃣ Verify course exists, is published and not deleted
    const course = await courseRepo.findById(courseId);
    if (!course) {
      const err = new Error('Course not found');
      err.status = 404;
      throw err;
    }
    if (!course.is_published || course.is_deleted) {
      const err = new Error('Course is not available for enrollment');
      err.status = 400;
      throw err;
    }

    // 2️⃣ Prevent instructor from enrolling in their own course
    if (course.instructor_id === studentId) {
      const err = new Error('Instructors cannot enroll in their own courses');
      err.status = 403;
      throw err;
    }

    // 3️⃣ Prevent duplicate enrollment
    const already = await enrollmentRepo.exists(studentId, courseId);
    if (already) {
      const err = new Error('Student already enrolled in this course');
      err.status = 400;
      throw err;
    }

    // 4️⃣ Default status to 'pending' for ALL enrollments (manual approval required)
    const status = 'pending';

    // 5️⃣ Create enrollment record
    const enrollmentId = await enrollmentRepo.create(studentId, courseId, status);

    // 6️⃣ Send notification to instructor (Non-blocking)
    try {
      const student = await userRepo.findById(studentId);
      const instructor = await userRepo.findById(course.instructor_id);

      if (student && instructor) {
        await emailService.sendEnrollmentNotification({
          instructorEmail: instructor.email,
          instructorName: instructor.name,
          courseTitle: course.title,
          studentName: student.name,
        });
      }
    } catch (e) {
      // Log error but do not fail enrollment creation
      const logger = require('../../utils/logger');
      logger.error('Failed to process enrollment notification email', e);
    }

    return { enrollment_id: enrollmentId, status };
  }

  // List student's enrollments with course details (excluding deleted courses)
  async listByStudent(studentId) {
    return await enrollmentRepo.findByStudent(studentId);
  }

  // Instructor: Get enrollments for a specific course
  async getCourseEnrollments(userId, userRole, courseId) {
    const course = await courseRepo.findAnyById(courseId);
    if (!course) {
      const err = new Error('Course not found');
      err.status = 404;
      throw err;
    }

    // Verify ownership (Admin overrides)
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      const err = new Error('Unauthorized: You can only view enrollments for your own courses');
      err.status = 403;
      throw err;
    }

    return await enrollmentRepo.findByCourse(courseId);
  }

  // Instructor: Approve enrollment
  async approveEnrollment(userId, userRole, enrollmentId) {
    const enrollment = await enrollmentRepo.findById(enrollmentId);
    if (!enrollment) {
      const err = new Error('Enrollment not found');
      err.status = 404;
      throw err;
    }

    const course = await courseRepo.findAnyById(enrollment.course_id);
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    await enrollmentRepo.updateStatus(enrollmentId, 'active');
    return { success: true, message: 'Enrollment approved' };
  }

  // Instructor: Reject enrollment
  async rejectEnrollment(userId, userRole, enrollmentId) {
    const enrollment = await enrollmentRepo.findById(enrollmentId);
    if (!enrollment) {
      const err = new Error('Enrollment not found');
      err.status = 404;
      throw err;
    }

    const course = await courseRepo.findAnyById(enrollment.course_id);
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    await enrollmentRepo.updateStatus(enrollmentId, 'rejected');
    return { success: true, message: 'Enrollment rejected' };
  }

  // Instructor: Remove/Delete enrollment
  async removeEnrollment(userId, userRole, enrollmentId) {
    const enrollment = await enrollmentRepo.findById(enrollmentId);
    if (!enrollment) {
      const err = new Error('Enrollment not found');
      err.status = 404;
      throw err;
    }

    const course = await courseRepo.findAnyById(enrollment.course_id);
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      const err = new Error('Unauthorized');
      err.status = 403;
      throw err;
    }

    await enrollmentRepo.deleteEnrollment(enrollmentId);
    return { success: true, message: 'Enrollment removed' };
  }
}

module.exports = new EnrollmentService();
