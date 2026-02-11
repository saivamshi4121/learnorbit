// src/modules/enrollments/enrollment.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./enrollment.controller');
const { protect, isStudent, isInstructorOrAdmin } = require('../../middlewares/rbac.middleware');

// POST /api/v1/enrollments - Enroll (create enrollment)
router.post('/v1/enrollments', protect, isStudent, controller.enroll);

// GET /api/v1/enrollments/status/:courseId - Check enrollment status
router.get('/v1/enrollments/status/:courseId', protect, isStudent, controller.checkStatus);

// Instructor Routes

// GET /api/v1/instructor/courses/:id/enrollments - List enrollments for a course
router.get('/v1/instructor/courses/:id/enrollments', protect, isInstructorOrAdmin, controller.getCourseEnrollments);

// PATCH /api/v1/instructor/enrollments/:id/approve - Approve enrollment
router.patch('/v1/instructor/enrollments/:id/approve', protect, isInstructorOrAdmin, controller.approve);

// PATCH /api/v1/instructor/enrollments/:id/reject - Reject enrollment
router.patch('/v1/instructor/enrollments/:id/reject', protect, isInstructorOrAdmin, controller.reject);

// PATCH /api/v1/instructor/enrollments/:id/remove - Remove enrollment
router.patch('/v1/instructor/enrollments/:id/remove', protect, isInstructorOrAdmin, controller.remove);

module.exports = router;
