// src/middlewares/institute.middleware.js
const repo = require('../modules/institute/institute.repository');

/**
 * Require the request's JWT to carry role = 'super_admin'.
 */
exports.requireSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ success: false, error: 'Super-admin access required' });
    }
    next();
};

/**
 * Require role = 'institute_admin' AND attach req.instituteId from JWT payload.
 * Institute admins have `institute_id` embedded in their JWT.
 */
exports.requireInstituteAdmin = (req, res, next) => {
    if (req.user?.role !== 'institute_admin') {
        return res.status(403).json({ success: false, error: 'Institute-admin access required' });
    }
    if (!req.user.institute_id) {
        return res.status(403).json({ success: false, error: 'No institute associated with this account' });
    }
    req.instituteId = req.user.institute_id;
    next();
};

/**
 * Verify that the course (:id param) belongs to the requesting institute.
 * Attaches req.course for downstream use.
 */
exports.ownsCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id || req.params.courseId;
        const course = await repo.getCourseById(courseId, req.instituteId);
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found or not yours' });
        }
        req.course = course;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Sanitize a URL — only allow http/https, strip javascript: and data: URIs.
 * Returns cleaned URL or throws.
 */
exports.sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string') throw new Error('URL is required');
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        throw new Error('Only http:// and https:// URLs are allowed');
    }
    if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) {
        throw new Error('Unsafe URL scheme');
    }
    // Basic length check
    if (trimmed.length > 2048) throw new Error('URL too long');
    return trimmed;
};
