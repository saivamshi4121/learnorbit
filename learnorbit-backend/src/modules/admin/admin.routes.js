const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

// All routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles('admin', 'super_admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/dashboard/details', adminController.getDashboardDetails);

// User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/block', adminController.blockUser);
router.patch('/users/:id/unblock', adminController.unblockUser);

// Course Moderation
router.get('/courses', adminController.getCourses);
router.patch('/courses/:id/unpublish', adminController.unpublishCourse);
router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router;
