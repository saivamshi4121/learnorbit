// src/modules/institute/institute.controller.js
const repo = require('./institute.repository');
const { sanitizeUrl } = require('../../middlewares/institute.middleware');
const logger = require('../../utils/logger');
const bcrypt = require('bcrypt');
const pool = require('../../config/database');

const ok = (res, data, message, status = 200) =>
    res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400) =>
    res.status(status).json({ success: false, error: message });

// ─────────────────────────────────────────────────────────────────
// SUPER ADMIN – Institute Management
// ─────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/institutes
 * Body: { name, email, password }
 * Creates an institute + its institute_admin user account.
 */
exports.createInstitute = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return fail(res, 'name, email, and password are required');
        }

        // Create the institute record
        const institute = await repo.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            createdBy: req.user.id,
        });

        // Create the institute_admin user linked to this institute
        const passwordHash = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, is_active, is_email_verified, institute_id)
             VALUES ($1, $2, $3, 'institute_admin', TRUE, TRUE, $4) RETURNING id, name, email, role`,
            [name, email, passwordHash, institute.id]
        );
        const adminUser = rows[0];

        logger.info(`Institute created: ${institute.id} (${email}) by super_admin ${req.user.id}`);
        return ok(res, { institute, adminUser }, 'Institute created successfully', 201);
    } catch (err) {
        if (err.code === '23505') return fail(res, 'Email already in use', 409);
        next(err);
    }
};

/**
 * GET /api/admin/institutes
 */
exports.listInstitutes = async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || '20'), 100);
        const offset = parseInt(req.query.offset || '0');
        const data = await repo.findAll({ limit, offset });
        return ok(res, data);
    } catch (err) { next(err); }
};

/**
 * PATCH /api/admin/institutes/:id/status
 * Body: { status: 'active' | 'suspended' }
 */
exports.updateInstituteStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['active', 'suspended'].includes(status)) {
            return fail(res, 'status must be active or suspended');
        }
        const ok_ = await repo.updateStatus(req.params.id, status);
        if (!ok_) return fail(res, 'Institute not found', 404);
        logger.info(`Institute ${req.params.id} status → ${status} by super_admin ${req.user.id}`);
        return ok(res, null, `Institute ${status}`);
    } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────
// INSTITUTE ADMIN – Course Management
// ─────────────────────────────────────────────────────────────────

exports.createCourse = async (req, res, next) => {
    try {
        const { title, description, visibility_type } = req.body;
        if (!title?.trim()) return fail(res, 'title is required');
        const course = await repo.createCourse({
            instituteId: req.instituteId,
            title: title.trim(),
            description: description?.trim() || null,
            visibilityType: visibility_type || 'private',
        });
        return ok(res, course, 'Course created', 201);
    } catch (err) { next(err); }
};

exports.listCourses = async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || '20'), 100);
        const offset = parseInt(req.query.offset || '0');
        const data = await repo.getCoursesByInstitute(req.instituteId, { limit, offset });
        return ok(res, data);
    } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const updated = await repo.updateCourse(req.course.id, req.instituteId, req.body);
        return ok(res, updated, 'Course updated');
    } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        await repo.deleteCourse(req.course.id, req.instituteId);
        return ok(res, null, 'Course deleted');
    } catch (err) { next(err); }
};

exports.getInstituteStats = async (req, res, next) => {
    try {
        const stats = await repo.getInstituteStats(req.instituteId);
        return ok(res, stats);
    } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────
// INSTITUTE ADMIN – Content Management
// ─────────────────────────────────────────────────────────────────

exports.addContent = async (req, res, next) => {
    try {
        const { title, content_type, content_url, order_index } = req.body;
        if (!title?.trim()) return fail(res, 'title is required');
        if (!content_type) return fail(res, 'content_type is required');
        if (!content_url) return fail(res, 'content_url is required');

        const VALID_TYPES = ['video', 'pdf', 'document', 'link', 'iframe'];
        if (!VALID_TYPES.includes(content_type)) {
            return fail(res, `content_type must be one of: ${VALID_TYPES.join(', ')}`);
        }

        // Sanitize URL — blocks javascript:, data:, non-http(s) schemes
        let safeUrl;
        try { safeUrl = sanitizeUrl(content_url); }
        catch (e) { return fail(res, e.message); }

        const item = await repo.addContent({
            courseId: req.course.id,
            title: title.trim(),
            contentType: content_type,
            contentUrl: safeUrl,
            orderIndex: order_index ?? 0,
        });
        return ok(res, item, 'Content added', 201);
    } catch (err) { next(err); }
};

exports.listContent = async (req, res, next) => {
    try {
        const items = await repo.getContentByCourse(req.course.id);
        return ok(res, items);
    } catch (err) { next(err); }
};

exports.deleteContent = async (req, res, next) => {
    try {
        const deleted = await repo.deleteContent(req.params.contentId, req.course.id);
        if (!deleted) return fail(res, 'Content not found', 404);
        return ok(res, null, 'Content removed');
    } catch (err) { next(err); }
};

exports.reorderContent = async (req, res, next) => {
    try {
        const { order_index } = req.body;
        if (order_index == null) return fail(res, 'order_index required');
        await repo.reorderContent(req.params.contentId, req.course.id, order_index);
        return ok(res, null, 'Content reordered');
    } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────
// INSTITUTE ADMIN – Student Management
// ─────────────────────────────────────────────────────────────────

exports.listStudents = async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || '50'), 200);
        const offset = parseInt(req.query.offset || '0');
        const data = await repo.getStudentsByInstitute(req.instituteId, { limit, offset });
        return ok(res, data);
    } catch (err) { next(err); }
};

exports.addStudent = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        if (!user_id) return fail(res, 'user_id is required');
        const result = await repo.addStudent(req.instituteId, user_id);
        return ok(res, result, 'Student added', 201);
    } catch (err) { next(err); }
};

exports.removeStudent = async (req, res, next) => {
    try {
        const removed = await repo.removeStudent(req.instituteId, req.params.userId);
        if (!removed) return fail(res, 'Student not found', 404);
        return ok(res, null, 'Student removed');
    } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────
// INSTITUTE ADMIN – Course Access Management
// ─────────────────────────────────────────────────────────────────

/**
 * POST /api/institute/courses/:id/access
 * Body: { student_id } OR { email }
 *
 * - If student_id → grant immediately (user must be in institute_students)
 * - If email and user exists → grant + add to institute_students
 * - If email and user doesn't exist → store invite (pending)
 */
exports.grantAccess = async (req, res, next) => {
    try {
        const { student_id, email } = req.body;
        if (!student_id && !email) return fail(res, 'student_id or email required');

        if (student_id) {
            // Verify student belongs to this institute
            const isMember = await repo.isStudentInInstitute(req.instituteId, student_id);
            if (!isMember) return fail(res, 'Student is not in this institute', 403);
            const access = await repo.grantAccess(req.course.id, student_id);
            logger.info(`Access granted: course=${req.course.id} student=${student_id}`);
            return ok(res, access, 'Access granted', 201);
        }

        // Email invite flow
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await repo.findUserByEmail(normalizedEmail);

        if (existingUser) {
            // User exists → grant directly
            await repo.addStudent(req.instituteId, existingUser.id);
            const access = await repo.grantAccess(req.course.id, existingUser.id);
            logger.info(`Access granted via email: course=${req.course.id} user=${existingUser.id}`);
            return ok(res, access, 'Access granted to existing user', 201);
        } else {
            // User doesn't exist → store pending invite
            const access = await repo.inviteByEmail(req.course.id, normalizedEmail);
            // TODO: queue invitation email via email worker
            logger.info(`Invite stored for: ${normalizedEmail} course=${req.course.id}`);
            return ok(res, access, 'Invitation stored — user will get access on registration', 201);
        }
    } catch (err) {
        if (err.code === '23505') return fail(res, 'Access already granted', 409);
        next(err);
    }
};

exports.revokeAccess = async (req, res, next) => {
    try {
        const revoked = await repo.revokeAccess(req.course.id, req.params.studentId);
        if (!revoked) return fail(res, 'Access record not found', 404);
        logger.info(`Access revoked: course=${req.course.id} student=${req.params.studentId}`);
        return ok(res, null, 'Access revoked');
    } catch (err) { next(err); }
};

exports.listCourseAccess = async (req, res, next) => {
    try {
        const data = await repo.getCourseAccessList(req.course.id);
        return ok(res, data);
    } catch (err) { next(err); }
};

// ─────────────────────────────────────────────────────────────────
// STUDENT – My Courses
// ─────────────────────────────────────────────────────────────────

exports.getMyCoursesForStudent = async (req, res, next) => {
    try {
        const courses = await repo.getCoursesForStudent(req.user.id);
        return ok(res, courses);
    } catch (err) { next(err); }
};

/**
 * GET /api/student/courses/:courseId/content
 * Returns ordered content items for a course — only if student has access.
 */
exports.getCourseContentForStudent = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Fetch the course
        const { rows: cRows } = await pool.query(
            `SELECT ic.*, ist.user_id AS is_member
             FROM institute_courses ic
             JOIN institute_students ist ON ist.institute_id = ic.institute_id AND ist.user_id = $1
             WHERE ic.id = $2`,
            [req.user.id, courseId]
        );
        if (!cRows.length) return fail(res, 'Course not found or not accessible', 404);
        const course = cRows[0];

        // Check visibility rules
        if (course.visibility_type === 'private') {
            return fail(res, 'This course is not available', 403);
        }
        if (course.visibility_type === 'selected') {
            const hasAccess = await repo.hasActiveAccess(courseId, req.user.id);
            if (!hasAccess) return fail(res, 'You do not have access to this course', 403);
        }

        const content = await repo.getContentByCourse(courseId);
        return ok(res, { course, content });
    } catch (err) { next(err); }
};
