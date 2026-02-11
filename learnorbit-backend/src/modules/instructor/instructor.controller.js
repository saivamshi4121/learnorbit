const enrollmentRepo = require('../enrollments/enrollment.repository');
const courseRepo = require('../courses/course.repository');
const logger = require('../../utils/logger');

// GET /api/v1/instructor/courses/:id/enrollments
exports.getCourseEnrollments = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID' });
    }
    // Ensure instructor owns the course or admin
    const course = await courseRepo.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden: Not your course' });
    }
    const enrollments = await enrollmentRepo.findByCourse(courseId);
    res.json({ success: true, data: enrollments });
  } catch (err) {
    logger.error('Error fetching enrollments', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// PATCH /api/v1/instructor/enrollments/:id/approve
exports.approveEnrollment = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    if (isNaN(enrollmentId)) {
      return res.status(400).json({ success: false, error: 'Invalid enrollment ID' });
    }
    const enrollment = await enrollmentRepo.getById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    // Verify ownership
    const course = await courseRepo.findById(enrollment.course_id);
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    await enrollmentRepo.updateStatus(enrollmentId, 'active');
    res.json({ success: true, message: 'Enrollment approved' });
  } catch (err) {
    logger.error('Error approving enrollment', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// PATCH /api/v1/instructor/enrollments/:id/reject
exports.rejectEnrollment = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    if (isNaN(enrollmentId)) {
      return res.status(400).json({ success: false, error: 'Invalid enrollment ID' });
    }
    const enrollment = await enrollmentRepo.getById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    const course = await courseRepo.findById(enrollment.course_id);
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    await enrollmentRepo.deleteEnrollment(enrollmentId);
    res.json({ success: true, message: 'Enrollment rejected and removed' });
  } catch (err) {
    logger.error('Error rejecting enrollment', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// PATCH /api/v1/instructor/enrollments/:id/remove
exports.removeEnrollment = async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id, 10);
    if (isNaN(enrollmentId)) {
      return res.status(400).json({ success: false, error: 'Invalid enrollment ID' });
    }
    const enrollment = await enrollmentRepo.getById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    const course = await courseRepo.findById(enrollment.course_id);
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    // Set back to pending
    await enrollmentRepo.updateStatus(enrollmentId, 'pending');
    res.json({ success: true, message: 'Enrollment access revoked (pending)' });
  } catch (err) {
    logger.error('Error removing enrollment', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
