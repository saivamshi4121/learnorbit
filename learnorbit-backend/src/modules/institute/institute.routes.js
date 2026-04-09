// src/modules/institute/institute.routes.js
const express = require('express');
const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const {
    requireSuperAdmin,
    requireInstituteAdmin,
    ownsCourse,
} = require('../../middlewares/institute.middleware');
const loginRateLimiter = require('../../middlewares/loginRateLimiter');
const ctrl = require('./institute.controller');

// ─────────────────────────────────────────────────────────────────
// SUPER ADMIN  →  /api/admin/institutes
// ─────────────────────────────────────────────────────────────────
router.post('/admin/institutes', protect, requireSuperAdmin, ctrl.createInstitute);
router.get('/admin/institutes', protect, requireSuperAdmin, ctrl.listInstitutes);
router.patch('/admin/institutes/:id/status', protect, requireSuperAdmin, ctrl.updateInstituteStatus);

// ─────────────────────────────────────────────────────────────────
// INSTITUTE ADMIN  →  /api/institute/...
// All routes require institute_admin role; institute_id comes from JWT.
// ─────────────────────────────────────────────────────────────────

// Stats / Overview
router.get('/institute/stats', protect, requireInstituteAdmin, ctrl.getInstituteStats);

// Course CRUD
router.post('/institute/courses', protect, requireInstituteAdmin, ctrl.createCourse);
router.get('/institute/courses', protect, requireInstituteAdmin, ctrl.listCourses);
router.patch('/institute/courses/:id', protect, requireInstituteAdmin, ownsCourse, ctrl.updateCourse);
router.delete('/institute/courses/:id', protect, requireInstituteAdmin, ownsCourse, ctrl.deleteCourse);

// Content management (nested under a course)
router.post('/institute/courses/:id/content', protect, requireInstituteAdmin, ownsCourse, ctrl.addContent);
router.get('/institute/courses/:id/content', protect, requireInstituteAdmin, ownsCourse, ctrl.listContent);
router.delete('/institute/courses/:id/content/:contentId', protect, requireInstituteAdmin, ownsCourse, ctrl.deleteContent);
router.patch('/institute/courses/:id/content/:contentId/order', protect, requireInstituteAdmin, ownsCourse, ctrl.reorderContent);

// Access grants / invitations – rate-limited to slow invite spam
router.post('/institute/courses/:id/access', protect, requireInstituteAdmin, ownsCourse, loginRateLimiter, ctrl.grantAccess);
router.get('/institute/courses/:id/access', protect, requireInstituteAdmin, ownsCourse, ctrl.listCourseAccess);
router.delete('/institute/courses/:id/access/:studentId', protect, requireInstituteAdmin, ownsCourse, ctrl.revokeAccess);

// Student roster
router.get('/institute/students', protect, requireInstituteAdmin, ctrl.listStudents);
router.post('/institute/students', protect, requireInstituteAdmin, ctrl.addStudent);
router.delete('/institute/students/:userId', protect, requireInstituteAdmin, ctrl.removeStudent);

// ─────────────────────────────────────────────────────────────────
// STUDENT  →  /api/student/...
// ─────────────────────────────────────────────────────────────────
router.get('/student/my-courses', protect, ctrl.getMyCoursesForStudent);
router.get('/student/courses/:courseId/content', protect, ctrl.getCourseContentForStudent);

module.exports = router;
