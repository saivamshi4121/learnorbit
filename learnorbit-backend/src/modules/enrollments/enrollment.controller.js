// src/modules/enrollments/enrollment.controller.js
const enrollmentService = require('./enrollment.service');
const logger = require('../../utils/logger');

exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, error: 'Course ID is required' });
    }

    const result = await enrollmentService.enroll(userId, courseId);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Enrollment error', error);
    if (error.status) {
      return res.status(error.status).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const userId = req.user.id;

    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Course ID' });
    }

    const status = await enrollmentService.getStatus(userId, courseId);

    res.status(200).json({
      success: true,
      status, // 'active', 'pending', or null
    });
  } catch (error) {
    logger.error('Check status error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Instructor: Get enrollments for a course
exports.getCourseEnrollments = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid Course ID' });
    }

    const enrollments = await enrollmentService.getCourseEnrollments(userId, userRole, courseId);

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    logger.error('Get course enrollments error', error);
    if (error.status) return res.status(error.status).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Instructor: Approve enrollment
exports.approve = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await enrollmentService.approveEnrollment(userId, userRole, enrollmentId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Approve enrollment error', error);
    if (error.status) return res.status(error.status).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Instructor: Reject enrollment
exports.reject = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await enrollmentService.rejectEnrollment(userId, userRole, enrollmentId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Reject enrollment error', error);
    if (error.status) return res.status(error.status).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Instructor: Remove enrollment
exports.remove = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await enrollmentService.removeEnrollment(userId, userRole, enrollmentId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Remove enrollment error', error);
    if (error.status) return res.status(error.status).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
