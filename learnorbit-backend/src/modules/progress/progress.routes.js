// src/modules/progress/progress.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./progress.controller');
const { protect, isStudent } = require('../../middlewares/rbac.middleware');

// Mark lesson progress
router.post('/v1/lessons/:id/progress', protect, isStudent, controller.markProgress);

// Get course progress
router.get('/v1/courses/:id/progress', protect, isStudent, controller.getCourseProgress);

module.exports = router;
