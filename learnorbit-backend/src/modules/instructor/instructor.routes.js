const express = require('express');
const router = express.Router();
const instructorController = require('./instructor.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// All routes require authentication and instructor role
router.use(protect);
router.use(authorizeRoles('instructor', 'admin'));

// Instructor Dashboard
router.get('/courses', instructorController.getInstructorCourses);
router.get('/stats', instructorController.getInstructorStats);

// Course Management
router.post('/courses', instructorController.createCourse);
router.get('/courses/:id', instructorController.getCourse);
router.patch('/courses/:id', instructorController.updateCourse);
router.get('/courses/:id/enrollments', instructorController.getCourseEnrollments);

// Enrollment Management
router.patch('/enrollments/:id/approve', instructorController.approveEnrollment);
router.patch('/enrollments/:id/reject', instructorController.rejectEnrollment);
router.patch('/enrollments/:id/remove', instructorController.removeEnrollment);

module.exports = router;
