// src/modules/lessons/lesson.routes.js
const express = require('express');
const router = express.Router();

const controller = require('./lesson.controller');
const { protect, isInstructorOrAdmin, isStudent, ensureEnrolled } = require('../../middlewares/rbac.middleware');

// Instructor management routes (create, update, delete, list for instructor)
router.post('/api/v1/courses/:courseId/lessons', protect, isInstructorOrAdmin, controller.create);
router.put('/api/v1/lessons/:id', protect, isInstructorOrAdmin, controller.update);
router.delete('/api/v1/lessons/:id', protect, isInstructorOrAdmin, controller.delete);
router.get('/api/v1/courses/:courseId/lessons/manage', protect, isInstructorOrAdmin, controller.listForInstructor);

// Student access route - requires enrollment
// ensureEnrolled middleware checks that user has approved enrollment
router.get('/api/v1/courses/:courseId/lessons', protect, isStudent, ensureEnrolled({ paramName: 'courseId' }), controller.listForStudent);

module.exports = router;
