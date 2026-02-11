// src/middlewares/rbac.middleware.js
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const enrollmentRepo = require('../modules/enrollments/enrollment.repository');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * RBAC (Role-Based Access Control) Middleware
 * Provides authentication and authorization for LearnOrbit LMS
 */

/**
 * Protect middleware - Verifies JWT token
 * Attaches decoded user data to req.user
 * 
 * Usage: router.get('/protected', protect, handler)
 */
exports.protect = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authorization token missing or invalid format',
                message: 'Please provide a valid Bearer token',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user data to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
        };

        logger.debug(`User authenticated`, {
            userId: req.user.id,
            role: req.user.role,
            path: req.path,
        });

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired',
                message: 'Please refresh your token or log in again',
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
                message: 'The provided token is invalid',
            });
        }

        logger.error(`Authentication error: ${err.message}`, {
            error: err.stack,
            path: req.path,
        });

        return res.status(401).json({
            success: false,
            error: 'Authentication failed',
        });
    }
};

/**
 * Authorize roles middleware - Checks if user has required role
 * Must be used after protect middleware
 * 
 * Usage: router.post('/admin-only', protect, authorizeRoles('admin'), handler)
 * Usage: router.get('/staff', protect, authorizeRoles('admin', 'instructor'), handler)
 * 
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
exports.authorizeRoles = (...allowedRoles) => (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated',
            message: 'Please log in to access this resource',
        });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Unauthorized access attempt`, {
            userId: req.user.id,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
            path: req.path,
            method: req.method,
        });

        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
            userRole: req.user.role,
        });
    }

    logger.debug(`User authorized`, {
        userId: req.user.id,
        role: req.user.role,
        path: req.path,
    });

    next();
};

/**
 * Check if user is admin
 * Convenience middleware for admin-only routes
 * 
 * Usage: router.delete('/users/:id', protect, isAdmin, handler)
 */
exports.isAdmin = (req, res, next) => {
    return exports.authorizeRoles('admin')(req, res, next);
};

/**
 * Check if user is instructor or admin
 * Convenience middleware for instructor/admin routes
 * 
 * Usage: router.post('/courses', protect, isInstructorOrAdmin, handler)
 */
exports.isInstructorOrAdmin = (req, res, next) => {
    return exports.authorizeRoles('admin', 'instructor')(req, res, next);
};

/**
 * Check if user is student
 * Convenience middleware for student-only routes
 * 
 * Usage: router.post('/enrollments', protect, isStudent, handler)
 */
exports.isStudent = (req, res, next) => {
    return exports.authorizeRoles('student')(req, res, next);
};

/**
 * Check if user owns the resource or is admin
 * Useful for routes where users can only access their own data
 * 
 * Usage: router.get('/users/:id', protect, isOwnerOrAdmin('id'), handler)
 * 
 * @param {string} paramName - Name of the route parameter containing the user ID
 */
exports.isOwnerOrAdmin = (paramName = 'id') => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated',
        });
    }

    const resourceUserId = parseInt(req.params[paramName]);
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (resourceUserId === currentUserId || isAdmin) {
        return next();
    }

    logger.warn(`Unauthorized resource access attempt`, {
        userId: currentUserId,
        resourceUserId,
        path: req.path,
    });

    return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You can only access your own resources',
    });
};

/**
 * Optional authentication middleware
 * Attaches user data if token is present, but doesn't require it
 * Useful for routes that have different behavior for authenticated users
 * 
 * Usage: router.get('/courses', optionalAuth, handler)
 */
exports.optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without authentication
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
        };

        next();
    } catch (err) {
        // Invalid token, continue without authentication
        logger.debug(`Optional auth failed: ${err.message}`);
        next();
    }
};

/**
 * Permission-based middleware
 * Checks if user has specific permissions
 * 
 * Usage: router.post('/courses/:id/publish', protect, hasPermission('publish_course'), handler)
 * 
 * @param {string} permission - Required permission
 */
exports.hasPermission = (permission) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated',
        });
    }

    // Define role-based permissions
    const rolePermissions = {
        admin: [
            'manage_users',
            'manage_courses',
            'manage_content',
            'view_analytics',
            'manage_settings',
            'publish_course',
            'delete_course',
            'manage_enrollments',
        ],
        instructor: [
            'create_course',
            'edit_own_course',
            'view_own_analytics',
            'manage_own_content',
            'publish_course',
        ],
        student: [
            'enroll_course',
            'view_own_courses',
            'submit_assignment',
            'view_own_progress',
        ],
    };

    const userPermissions = rolePermissions[req.user.role] || [];

    if (!userPermissions.includes(permission)) {
        logger.warn(`Permission denied`, {
            userId: req.user.id,
            role: req.user.role,
            requiredPermission: permission,
            path: req.path,
        });

        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: `You don't have permission to perform this action`,
            requiredPermission: permission,
        });
    }

    next();
};

/**
 * Ensure enrolled middleware - Check if user has active enrollment in a course
 * Must be used after protect middleware
 * Admin bypass is allowed
 *
 * Usage: router.get('/courses/:courseId/lessons', protect, ensureEnrolled, handler)
 *
 * @param {Object} options - Options for the middleware
 * @param {string} options.paramName - Name of the route parameter containing course ID (default: 'courseId')
 * @param {boolean} options.allowAdmin - Whether to allow admin bypass (default: true)
 */
exports.ensureEnrolled = (options = {}) => {
    const { paramName = 'courseId', allowAdmin = true } = options;

    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    message: 'Please log in to access this resource',
                });
            }

            // Admin bypass
            if (allowAdmin && req.user.role === 'admin') {
                logger.debug(`Admin bypass for enrollment check`, {
                    userId: req.user.id,
                    path: req.path,
                });
                return next();
            }

            // Get course ID from route params
            const courseId = parseInt(req.params[paramName], 10);

            if (!courseId || isNaN(courseId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid course ID',
                    message: 'Course ID is required and must be a valid number',
                });
            }

            // Check enrollment status
            const status = await enrollmentRepo.getStatus(req.user.id, courseId);

            if (!status) {
                logger.warn(`Access denied - not enrolled`, {
                    userId: req.user.id,
                    courseId,
                    path: req.path,
                });
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'You must be enrolled in this course to access its content',
                    action: 'enroll',
                });
            }

            if (status !== 'active') {
                logger.warn(`Access denied - enrollment not approved`, {
                    userId: req.user.id,
                    courseId,
                    status,
                    path: req.path,
                });
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Your enrollment is pending approval. Please wait for admin confirmation.',
                    status,
                });
            }

            // User is enrolled and approved
            logger.debug(`Enrollment verified`, {
                userId: req.user.id,
                courseId,
                path: req.path,
            });

            next();
        } catch (error) {
            logger.error(`Enrollment check error: ${error.message}`, {
                error: error.stack,
                userId: req.user?.id,
                path: req.path,
            });
            return res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: 'Failed to verify enrollment status',
            });
        }
    };
};

/**
 * Rate limit by role
 * Different rate limits for different roles
 *
 * Usage: router.post('/api-call', protect, rateLimitByRole({ student: 10, instructor: 50, admin: 1000 }), handler)
 *
 * @param {Object} limits - Rate limits per role (requests per minute)
 */
exports.rateLimitByRole = (limits) => {
    const requestCounts = new Map();

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }

        const key = `${req.user.id}_${req.path}`;
        const now = Date.now();
        const windowMs = 60000; // 1 minute

        if (!requestCounts.has(key)) {
            requestCounts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const data = requestCounts.get(key);

        if (now > data.resetTime) {
            // Reset window
            requestCounts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const limit = limits[req.user.role] || limits.student || 10;

        if (data.count >= limit) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                message: `Rate limit exceeded. Limit: ${limit} requests per minute`,
                retryAfter: Math.ceil((data.resetTime - now) / 1000),
            });
        }

        data.count++;
        next();
    };
};

module.exports = exports;
