const enrollmentRepo = require('../enrollments/enrollment.repository');
const courseRepo = require('../courses/course.repository');
const logger = require('../../utils/logger');

// GET /api/v1/instructor/courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await courseRepo.findByInstructor(userId);
    res.json({ success: true, data: courses });
  } catch (err) {
    logger.error('Error fetching instructor courses', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET /api/v1/instructor/stats
exports.getInstructorStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await courseRepo.findByInstructor(userId);

    const stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.is_published).length,
      draftCourses: courses.filter(c => !c.is_published).length,
      totalStudents: courses.reduce((acc, curr) => acc + (curr.enrollment_count || 0), 0)
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    logger.error('Error fetching instructor stats', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// POST /api/v1/instructor/courses
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, thumbnail_url } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const courseId = await courseRepo.create({
      instructor_id: userId,
      title,
      description,
      thumbnail_url,
      is_published: false // Draft by default
    });

    res.status(201).json({ success: true, data: { id: courseId }, message: 'Course created successfully' });
  } catch (err) {
    logger.error('Error creating course', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET /api/v1/instructor/courses/:id
exports.getCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID' });
    }

    const course = await courseRepo.findAnyById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Not your course' });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    logger.error('Error fetching course', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// PATCH /api/v1/instructor/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const updates = req.body;
    const userId = req.user.id;

    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID' });
    }

    const course = await courseRepo.findAnyById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Not your course' });
    }

    await courseRepo.update(courseId, updates);
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (err) {
    logger.error('Error updating course', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

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
